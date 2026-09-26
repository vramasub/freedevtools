import {
  AlignmentType,
  Document,
  HeadingLevel,
  ImageRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalMergeType,
} from "docx";
import type { PDFPageProxy } from "pdfjs-dist";

interface FontStyle {
  bold: boolean;
  italic: boolean;
}

interface PositionedItem {
  str: string;
  x: number;
  y: number;
  width: number;
  fontSize: number;
  fontName: string;
  bold: boolean;
  italic: boolean;
}

interface LineSegment {
  text: string;
  startX: number;
}

interface StyleRun {
  text: string;
  bold: boolean;
  italic: boolean;
}

interface DocLine {
  text: string;
  fontSize: number;
  fontName: string;
  y: number;
  minX: number;
  maxX: number;
  segments: LineSegment[];
  runs: StyleRun[];
}

const Y_TOLERANCE = 2;

// `getTextContent()` only exposes an internal font alias (e.g. "g_d0_f1"), never the
// real PostScript font name — so substring-matching for "bold"/"italic" against it can
// never work. The actual font descriptor (with genuine bold/italic flags) only becomes
// available via `page.commonObjs.get()` once something has walked the page's operator
// list — which image extraction already does. Resolved once per page and looked up by
// alias per item; any font that fails to resolve in time falls back to non-bold/non-italic
// rather than blocking text extraction.
async function resolvePageFontStyles(
  page: PDFPageProxy,
  fontNames: Iterable<string>
): Promise<Map<string, FontStyle>> {
  const styles = new Map<string, FontStyle>();
  for (const name of fontNames) {
    try {
      const fontObj = await new Promise<{ bold?: boolean; italic?: boolean }>((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("font resolve timed out")), 3000);
        page.commonObjs.get(name, (resolved: unknown) => {
          clearTimeout(timer);
          resolve(resolved as { bold?: boolean; italic?: boolean });
        });
      });
      styles.set(name, { bold: !!fontObj.bold, italic: !!fontObj.italic });
    } catch {
      styles.set(name, { bold: false, italic: false });
    }
  }
  return styles;
}

function extractPageItems(textContent: { items: unknown[] }, fontStyles: Map<string, FontStyle>): PositionedItem[] {
  const items: PositionedItem[] = [];
  for (const raw of textContent.items) {
    if (!raw || typeof raw !== "object" || !("str" in raw)) continue;
    const item = raw as { str: string; transform: number[]; width: number; fontName: string };
    if (!item.str.trim()) continue;
    const [a, b, , , e, f] = item.transform;
    const fontSize = Math.hypot(a, b) || 1;
    const style = fontStyles.get(item.fontName) ?? { bold: false, italic: false };
    items.push({
      str: item.str,
      x: e,
      y: f,
      width: item.width,
      fontSize,
      fontName: item.fontName,
      bold: style.bold,
      italic: style.italic,
    });
  }
  return items;
}

// A raised ordinal suffix ("19th", "3rd") is typeset as its own text run, shifted upward
// far enough that it lands outside Y_TOLERANCE of the baseline text around it — so it
// gets grouped as its own stray one-"line" group instead of merging into the real line.
// Worse, two suffixes from the same or nearby dates (e.g. "15th September ... 15th
// December") often land at the same raised Y and merge into one orphan group like "th th".
// Splicing these back into the correct position in the baseline text would need per-glyph
// X-matching against possibly multiple insertion points; since the suffix is purely
// cosmetic, dropping the orphan line is far simpler and turns a broken, fractured
// paragraph into clean (if slightly less formal) text: "19 October" instead of "19th
// October" with a stray "th" line above it.
const ORPHAN_ORDINAL_SUFFIX = /^(?:st|nd|rd|th)+$/i;

function isOrphanOrdinalSuffixLine(line: PositionedItem[]): boolean {
  const joined = line
    .map((item) => item.str)
    .join("")
    .replace(/\s+/g, "");
  return ORPHAN_ORDINAL_SUFFIX.test(joined);
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

// Appends `str` to `runs`, merging into the last run when it shares the same bold/italic
// state so a run of same-styled characters becomes one TextRun instead of one per glyph run.
function appendRun(runs: StyleRun[], str: string, bold: boolean, italic: boolean): void {
  const last = runs[runs.length - 1];
  if (last && last.bold === bold && last.italic === italic) {
    last.text += str;
  } else {
    runs.push({ text: str, bold, italic });
  }
}

function trimRuns(runs: StyleRun[]): StyleRun[] {
  const trimmed = runs.map((r) => ({ ...r }));
  while (trimmed.length && !trimmed[0].text.trim()) trimmed.shift();
  while (trimmed.length && !trimmed[trimmed.length - 1].text.trim()) trimmed.pop();
  if (trimmed.length) {
    trimmed[0].text = trimmed[0].text.replace(/^\s+/, "");
    trimmed[trimmed.length - 1].text = trimmed[trimmed.length - 1].text.replace(/\s+$/, "");
  }
  return trimmed;
}

function buildLine(items: PositionedItem[]): DocLine | null {
  const fontSize = items[0].fontSize;
  const columnGapThreshold = fontSize * COLUMN_GAP_MULTIPLIER;
  const spaceThreshold = fontSize * WORD_SPACE_MULTIPLIER;

  let text = "";
  let currentSegment = "";
  let currentSegmentStartX = items[0].x;
  let prevEndX: number | null = null;
  const segments: LineSegment[] = [];
  const runs: StyleRun[] = [];

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
        appendRun(runs, " ", item.bold, item.italic);
      } else if (gap > spaceThreshold) {
        text += " ";
        currentSegment += " ";
        appendRun(runs, " ", item.bold, item.italic);
      }
    }
    text += item.str;
    currentSegment += item.str;
    appendRun(runs, item.str, item.bold, item.italic);
    prevEndX = item.x + item.width;
  }
  if (currentSegment.trim()) {
    segments.push({ text: currentSegment.trim(), startX: currentSegmentStartX });
  }

  const trimmed = text.trim();
  if (!trimmed) return null;
  const first = items[0];
  const last = items[items.length - 1];
  return {
    text: trimmed,
    fontSize,
    fontName: first.fontName,
    y: first.y,
    minX: first.x,
    maxX: last.x + last.width,
    segments,
    runs: trimRuns(runs),
  };
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

// Starting at `start`, greedily extends a run of lines that all share aligned column
// start positions. Returns null if fewer than MIN_TABLE_ROWS lines match.
//
// A row is allowed to have FEWER segments than the reference row, as long as every
// segment it does have aligns to one of the reference columns — this is what makes a
// real-world spanning cell work (e.g. a "Monday" label in column 1 that only appears once,
// with every subsequent activity row in that day having text in column 2 only, and nothing
// in column 1). A row is never allowed to have MORE segments than the reference, since
// there's no established column for the extra one to align to.
function extendTableRun(lines: DocLine[], start: number): DocLine[] | null {
  const first = lines[start];
  if (first.segments.length < MIN_TABLE_COLUMNS) return null;

  const columnCount = first.segments.length;
  const columnStartXs = first.segments.map((s) => s.startX);
  const run: DocLine[] = [first];

  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.segments.length === 0 || line.segments.length > columnCount) break;
    const aligned = line.segments.every((seg) =>
      columnStartXs.some((colX) => Math.abs(seg.startX - colX) <= TABLE_X_TOLERANCE)
    );
    if (!aligned) break;
    run.push(line);
  }

  return run.length >= MIN_TABLE_ROWS ? run : null;
}

// Places each of a row's segments into its matching reference column (nearest startX),
// leaving "" for any reference column this row had no segment for — the counterpart to
// extendTableRun's tolerance for rows with fewer-than-reference segments.
function alignRowToColumns(segments: LineSegment[], columnStartXs: number[]): string[] {
  const row = columnStartXs.map(() => "");
  for (const seg of segments) {
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < columnStartXs.length; i++) {
      const dist = Math.abs(seg.startX - columnStartXs[i]);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }
    row[bestIdx] = seg.text;
  }
  return row;
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
      const columnStartXs = tableRun[0].segments.map((s) => s.startX);
      blocks.push({
        kind: "table",
        rows: tableRun.map((l) => alignRowToColumns(l.segments, columnStartXs)),
      });
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

// A paragraph is treated as centered when every one of its lines is horizontally
// centered on the page (within tolerance) — the common signature of a title-page
// heading or byline. Ordinary left-aligned paragraphs have lines starting at the same
// left margin with varying (non-centered) right edges, so this rarely false-positives.
const CENTER_TOLERANCE_RATIO = 0.04;

function isLineCentered(line: DocLine, pageWidth: number): boolean {
  if (pageWidth <= 0) return false;
  const lineMid = (line.minX + line.maxX) / 2;
  const pageMid = pageWidth / 2;
  return Math.abs(lineMid - pageMid) <= pageWidth * CENTER_TOLERANCE_RATIO;
}

// Matches a leading bullet glyph (plus its following whitespace) on a line extracted
// from the PDF, so it can be rendered as a real Word list item instead of carrying the
// literal character through as plain text. Deliberately excludes plain "-"/"*" since
// those are common inside ordinary prose (hyphenated words, emphasis) and would false-positive.
const BULLET_PATTERN = /^[•◦‣▪●○]\s+/;

// Combines a paragraph's lines into one ordered run list, joining lines with a plain
// space (styled to match the following line's first run) and merging adjacent runs that
// share the same bold/italic state.
function combineLineRuns(lines: DocLine[]): StyleRun[] {
  const combined: StyleRun[] = [];
  lines.forEach((line, i) => {
    if (i > 0) {
      const joiner = line.runs[0] ?? { bold: false, italic: false };
      appendRun(combined, " ", joiner.bold, joiner.italic);
    }
    for (const run of line.runs) {
      appendRun(combined, run.text, run.bold, run.italic);
    }
  });
  return combined;
}

// Removes `count` leading characters from a run list (used to strip a bullet marker
// after it's been matched against the paragraph's flattened text), dropping any run
// that becomes empty.
function stripLeadingChars(runs: StyleRun[], count: number): StyleRun[] {
  let remaining = count;
  const result: StyleRun[] = [];
  for (const run of runs) {
    if (remaining <= 0) {
      result.push(run);
    } else if (run.text.length <= remaining) {
      remaining -= run.text.length;
    } else {
      result.push({ ...run, text: run.text.slice(remaining) });
      remaining = 0;
    }
  }
  return result;
}

// A "" cell only exists because alignRowToColumns found no segment for that column on
// this row — i.e. a source cell that visually spans several rows (like a day name next to
// several activities). The row that established the column (built by extendTableRun's
// reference row) always has every column filled, so a column's first cell is always
// non-blank — meaning marking every non-blank cell RESTART and every blank cell CONTINUE
// is always well-formed, never a CONTINUE with no RESTART above it.
function buildTable(rows: string[][]): Table {
  const columnCount = rows.reduce((max, row) => Math.max(max, row.length), 0);
  return new Table({
    rows: rows.map(
      (row) =>
        new TableRow({
          children: Array.from({ length: columnCount }, (_, colIndex) => {
            const cellText = row[colIndex] ?? "";
            return new TableCell({
              verticalMerge: cellText ? VerticalMergeType.RESTART : VerticalMergeType.CONTINUE,
              children: [new Paragraph(cellText)],
            });
          }),
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

// Extracts embedded images from a single page's already-fetched operator list. Isolated
// and best-effort: any failure — per-image or for the whole page — is swallowed so image
// extraction never blocks the surrounding text/table content, which is the primary
// output of this tool.
async function extractPageImages(
  page: PDFPageProxy,
  opList: { fnArray: number[]; argsArray: unknown[][] },
  paintImageOp: number
): Promise<ExtractedImage[]> {
  const results: ExtractedImage[] = [];
  try {
    for (let i = 0; i < opList.fnArray.length; i++) {
      if (opList.fnArray[i] !== paintImageOp) continue;
      const name = opList.argsArray[i][0] as string;
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
  const pageWidths: number[] = [];
  let totalChars = 0;

  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const opList = await page.getOperatorList();

    const rawTextContent = await page.getTextContent();
    const fontNames = new Set<string>();
    for (const it of rawTextContent.items) {
      if (it && typeof it === "object" && "fontName" in it) {
        fontNames.add((it as { fontName: string }).fontName);
      }
    }
    const fontStyles = await resolvePageFontStyles(page, fontNames);

    const items = extractPageItems(rawTextContent, fontStyles);
    totalChars += items.reduce((sum, it) => sum + it.str.trim().length, 0);

    const lines = groupIntoLines(items)
      .filter((line) => !isOrphanOrdinalSuffixLine(line))
      .map(buildLine)
      .filter((l): l is DocLine => l !== null);
    pageLines.push(lines);
    pageWidths.push(page.view[2] - page.view[0]);

    pageImages.push(await extractPageImages(page, opList, pdfjs.OPS.paintImageXObject));
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
        const centered = !bulletMatch && lines.every((l) => isLineCentered(l, pageWidths[p]));

        let runs = combineLineRuns(lines);
        if (bulletMatch) runs = stripLeadingChars(runs, bulletMatch[0].length);

        nodes.push(
          new Paragraph({
            heading,
            bullet: bulletMatch ? { level: 0 } : undefined,
            alignment: centered ? AlignmentType.CENTER : undefined,
            children: runs.map((r) => new TextRun({ text: r.text, bold: r.bold, italics: r.italic })),
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
