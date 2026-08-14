import { Document, HeadingLevel, ImageRun, Packer, Paragraph, Table, TableCell, TableRow, TextRun } from "docx";
import type { PDFPageProxy } from "pdfjs-dist";

interface PositionedItem {
  str: string;
  x: number;
  y: number;
  width: number;
  fontSize: number;
  fontName: string;
}

interface LineSegment {
  text: string;
  startX: number;
}

interface DocLine {
  text: string;
  fontSize: number;
  fontName: string;
  y: number;
  segments: LineSegment[];
}

const Y_TOLERANCE = 2;

function extractPageItems(textContent: { items: unknown[] }): PositionedItem[] {
  const items: PositionedItem[] = [];
  for (const raw of textContent.items) {
    if (!raw || typeof raw !== "object" || !("str" in raw)) continue;
    const item = raw as { str: string; transform: number[]; width: number; fontName: string };
    if (!item.str.trim()) continue;
    const [a, b, , , e, f] = item.transform;
    const fontSize = Math.hypot(a, b) || 1;
    items.push({ str: item.str, x: e, y: f, width: item.width, fontSize, fontName: item.fontName });
  }
  return items;
}

function groupIntoLines(items: PositionedItem[]): PositionedItem[][] {
  const sorted = [...items].sort((a, b) => b.y - a.y);
  const lines: PositionedItem[][] = [];
  for (const item of sorted) {
    const last = lines[lines.length - 1];
    if (last && Math.abs(last[0].y - item.y) <= Y_TOLERANCE) {
      last.push(item);
    } else {
      lines.push([item]);
    }
  }
  for (const line of lines) line.sort((a, b) => a.x - b.x);
  return lines;
}

// A gap wider than this (relative to font size) is treated as a column boundary — a
// candidate split between table cells — rather than just a wide space within a sentence.
const COLUMN_GAP_MULTIPLIER = 1.5;
const WORD_SPACE_MULTIPLIER = 0.25;

function buildLine(items: PositionedItem[]): DocLine | null {
  const fontSize = items[0].fontSize;
  const columnGapThreshold = fontSize * COLUMN_GAP_MULTIPLIER;
  const spaceThreshold = fontSize * WORD_SPACE_MULTIPLIER;

  let text = "";
  let currentSegment = "";
  let currentSegmentStartX = items[0].x;
  let prevEndX: number | null = null;
  const segments: LineSegment[] = [];

  for (const item of items) {
    if (prevEndX !== null) {
      const gap = item.x - prevEndX;
      if (gap > columnGapThreshold) {
        if (currentSegment.trim()) {
          segments.push({ text: currentSegment.trim(), startX: currentSegmentStartX });
        }
        currentSegment = "";
        currentSegmentStartX = item.x;
        text += " ";
      } else if (gap > spaceThreshold) {
        text += " ";
        currentSegment += " ";
      }
    }
    text += item.str;
    currentSegment += item.str;
    prevEndX = item.x + item.width;
  }
  if (currentSegment.trim()) {
    segments.push({ text: currentSegment.trim(), startX: currentSegmentStartX });
  }

  const trimmed = text.trim();
  if (!trimmed) return null;
  return { text: trimmed, fontSize, fontName: items[0].fontName, y: items[0].y, segments };
}

// A line starts a new paragraph when the vertical gap from the previous line exceeds
// this multiple of the larger of the two lines' font sizes. Using each line's own font
// size as the reference (rather than an empirically-averaged "typical gap") avoids the
// heuristic being thrown off by whichever gap happens to be measured first — e.g. a
// title-to-body transition, which is naturally much larger than normal line spacing.
const PARAGRAPH_GAP_MULTIPLIER = 1.6;

// A heading set closely above its following body text (tight leading, common in real
// documents) can have a gap that's still under PARAGRAPH_GAP_MULTIPLIER's threshold even
// though the font size changes — which would otherwise merge the heading into the body
// paragraph and apply the heading style to both. A font-size change beyond this ratio
// always starts a new paragraph regardless of the gap, since two adjacent lines of
// meaningfully different size are never really the same paragraph.
const FONT_SIZE_CHANGE_RATIO = 1.1;

function groupParagraphs(lines: DocLine[]): DocLine[][] {
  if (lines.length === 0) return [];

  const paragraphs: DocLine[][] = [];
  let current: DocLine[] = [lines[0]];

  for (let i = 1; i < lines.length; i++) {
    const prev = lines[i - 1];
    const line = lines[i];
    const gap = prev.y - line.y;
    const expectedLineGap = Math.max(prev.fontSize, line.fontSize) * PARAGRAPH_GAP_MULTIPLIER;
    const fontSizeChanged =
      Math.max(prev.fontSize, line.fontSize) / Math.min(prev.fontSize, line.fontSize) >
      FONT_SIZE_CHANGE_RATIO;
    if (gap > expectedLineGap || fontSizeChanged) {
      paragraphs.push(current);
      current = [];
    }
    current.push(line);
  }
  paragraphs.push(current);
  return paragraphs;
}

// A run of consecutive lines is treated as a table when each one shares the same number
// of columns and every column's start position lines up (within tolerance) — checked
// directly against the raw line stream, independent of paragraph line-spacing, since
// table rows often use different vertical spacing than surrounding prose. Any
// inconsistency stops the run rather than risking a garbled table, per this tool's
// best-effort disclosure.
const TABLE_X_TOLERANCE = 15;
const MIN_TABLE_COLUMNS = 2;
const MIN_TABLE_ROWS = 2;

// Starting at `start`, greedily extends a run of lines that all share the same column
// count and aligned column start positions. Returns null if fewer than MIN_TABLE_ROWS
// lines match.
function extendTableRun(lines: DocLine[], start: number): DocLine[] | null {
  const first = lines[start];
  if (first.segments.length < MIN_TABLE_COLUMNS) return null;

  const columnCount = first.segments.length;
  const columnStartXs = first.segments.map((s) => s.startX);
  const run: DocLine[] = [first];

  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.segments.length !== columnCount) break;
    const aligned = line.segments.every(
      (seg, idx) => Math.abs(seg.startX - columnStartXs[idx]) <= TABLE_X_TOLERANCE
    );
    if (!aligned) break;
    run.push(line);
  }

  return run.length >= MIN_TABLE_ROWS ? run : null;
}

type DocBlock = { kind: "table"; rows: string[][] } | { kind: "text"; lines: DocLine[] };

// Walks the full line stream once, greedily carving out table runs wherever they occur
// and leaving everything else as plain text blocks (to be paragraph-grouped separately).
function segmentIntoBlocks(lines: DocLine[]): DocBlock[] {
  const blocks: DocBlock[] = [];
  let i = 0;
  let textRunStart = 0;

  const flushText = (end: number) => {
    if (end > textRunStart) blocks.push({ kind: "text", lines: lines.slice(textRunStart, end) });
  };

  while (i < lines.length) {
    const tableRun = extendTableRun(lines, i);
    if (tableRun) {
      flushText(i);
      blocks.push({ kind: "table", rows: tableRun.map((l) => l.segments.map((s) => s.text)) });
      i += tableRun.length;
      textRunStart = i;
    } else {
      i++;
    }
  }
  flushText(lines.length);

  return blocks;
}

function median(nums: number[]): number {
  if (nums.length === 0) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

type HeadingValue = (typeof HeadingLevel)[keyof typeof HeadingLevel] | undefined;

// A paragraph is treated as a heading when its font size is meaningfully larger than
// the document's median body-text size — the ratio thresholds below are deliberately
// coarse (best-effort), since PDFs carry no real "this is a heading" semantic marker.
function detectHeadingLevel(paragraphFontSize: number, medianFontSize: number): HeadingValue {
  if (medianFontSize <= 0) return undefined;
  const ratio = paragraphFontSize / medianFontSize;
  if (ratio > 1.5) return HeadingLevel.HEADING_1;
  if (ratio > 1.25) return HeadingLevel.HEADING_2;
  if (ratio > 1.1) return HeadingLevel.HEADING_3;
  return undefined;
}

// Matches a leading bullet glyph (plus its following whitespace) on a line extracted
// from the PDF, so it can be rendered as a real Word list item instead of carrying the
// literal character through as plain text. Deliberately excludes plain "-"/"*" since
// those are common inside ordinary prose (hyphenated words, emphasis) and would false-positive.
const BULLET_PATTERN = /^[•◦‣▪●○]\s+/;

function buildTable(rows: string[][]): Table {
  return new Table({
    rows: rows.map(
      (row) =>
        new TableRow({
          children: row.map(
            (cellText) => new TableCell({ children: [new Paragraph(cellText)] })
          ),
        })
    ),
  });
}

interface ExtractedImage {
  bytes: Uint8Array;
  width: number;
  height: number;
}

interface ResolvedPdfImage {
  width: number;
  height: number;
  kind?: number;
  data?: Uint8ClampedArray;
  bitmap?: ImageBitmap;
}

// pdfjs resolves embedded images one of two ways depending on browser capability:
// - `bitmap` (an ImageBitmap, via OffscreenCanvas decoding) — the default in modern browsers.
// - `data` (a raw pixel buffer) with a `kind` (ImageKind: 1 = GRAYSCALE_1BPP, unsupported
//   here and skipped; 2 = RGB_24BPP; 3 = RGBA_32BPP) — the fallback path.
// Either way we draw it onto a canvas and re-encode as PNG.
function resolvedImageToPngBytes(obj: ResolvedPdfImage): Uint8Array | null {
  const canvas = document.createElement("canvas");
  canvas.width = obj.width;
  canvas.height = obj.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  if (obj.bitmap) {
    ctx.drawImage(obj.bitmap, 0, 0, obj.width, obj.height);
  } else if (obj.data) {
    let rgba: Uint8ClampedArray;
    if (obj.kind === 3) {
      rgba = obj.data;
    } else if (obj.kind === 2) {
      rgba = new Uint8ClampedArray(obj.width * obj.height * 4);
      for (let i = 0, j = 0; i < obj.data.length; i += 3, j += 4) {
        rgba[j] = obj.data[i];
        rgba[j + 1] = obj.data[i + 1];
        rgba[j + 2] = obj.data[i + 2];
        rgba[j + 3] = 255;
      }
    } else {
      return null;
    }
    ctx.putImageData(new ImageData(new Uint8ClampedArray(rgba), obj.width, obj.height), 0, 0);
  } else {
    return null;
  }

  const base64 = canvas.toDataURL("image/png").split(",")[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

// Extracts embedded images from a single page. Isolated and best-effort: any failure —
// per-image or for the whole page — is swallowed so image extraction never blocks the
// surrounding text/table content, which is the primary output of this tool.
async function extractPageImages(page: PDFPageProxy, paintImageOp: number): Promise<ExtractedImage[]> {
  const results: ExtractedImage[] = [];
  try {
    const opList = await page.getOperatorList();
    for (let i = 0; i < opList.fnArray.length; i++) {
      if (opList.fnArray[i] !== paintImageOp) continue;
      const name = opList.argsArray[i][0];
      try {
        const obj = await new Promise<ResolvedPdfImage>((resolve, reject) => {
          const timer = setTimeout(() => reject(new Error("image resolve timed out")), 5000);
          page.objs.get(name, (resolved: unknown) => {
            clearTimeout(timer);
            resolve(resolved as ResolvedPdfImage);
          });
        });
        const pngBytes = resolvedImageToPngBytes(obj);
        if (pngBytes) results.push({ bytes: pngBytes, width: obj.width, height: obj.height });
      } catch {
        // Skip this one image; keep processing the rest of the page.
      }
    }
  } catch {
    // Skip images for this page entirely; text/table extraction is unaffected.
  }
  return results;
}

const MAX_IMAGE_DIMENSION = 500;

function buildImageParagraph(image: ExtractedImage): Paragraph {
  const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  return new Paragraph({
    children: [new ImageRun({ type: "png", data: image.bytes, transformation: { width, height } })],
  });
}

export async function pdfToDocx(file: File): Promise<Blob> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

  let pdfDoc;
  try {
    const data = new Uint8Array(await file.arrayBuffer());
    pdfDoc = await pdfjs.getDocument({ data }).promise;
  } catch {
    throw new Error(`"${file.name}" could not be read — it may be encrypted or corrupted.`);
  }

  const pageLines: DocLine[][] = [];
  const pageImages: ExtractedImage[][] = [];
  let totalChars = 0;

  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const textContent = await page.getTextContent();
    const items = extractPageItems(textContent);
    totalChars += items.reduce((sum, it) => sum + it.str.trim().length, 0);

    const lines = groupIntoLines(items)
      .map(buildLine)
      .filter((l): l is DocLine => l !== null);
    pageLines.push(lines);

    pageImages.push(await extractPageImages(page, pdfjs.OPS.paintImageXObject));
  }

  if (totalChars < 5) {
    throw new Error("This PDF appears to be scanned/image-based with no extractable text.");
  }

  const medianFontSize = median(pageLines.flat().map((l) => l.fontSize));

  const nodes: (Paragraph | Table)[] = [];
  for (let p = 0; p < pageLines.length; p++) {
    for (const block of segmentIntoBlocks(pageLines[p])) {
      if (block.kind === "table") {
        nodes.push(buildTable(block.rows));
        continue;
      }
      for (const lines of groupParagraphs(block.lines)) {
        const rawText = lines.map((l) => l.text).join(" ");
        // A bullet glyph is a much more reliable "this is a list item" signal than the
        // font-size heuristic — some documents give bullet lines a slightly larger font
        // (e.g. a bold lead-in phrase), which would otherwise misfire as a heading and
        // carry the bullet character through as literal heading text.
        const bulletMatch = BULLET_PATTERN.exec(rawText);
        const heading = bulletMatch ? undefined : detectHeadingLevel(lines[0].fontSize, medianFontSize);
        const text = bulletMatch ? rawText.slice(bulletMatch[0].length) : rawText;
        nodes.push(
          new Paragraph({
            heading,
            bullet: bulletMatch ? { level: 0 } : undefined,
            children: [new TextRun(text)],
          })
        );
      }
    }
    for (const image of pageImages[p]) {
      nodes.push(buildImageParagraph(image));
    }
  }

  const outDoc = new Document({ sections: [{ children: nodes }] });
  return Packer.toBlob(outDoc);
}
