import { PDFDocument, StandardFonts, PageSizes, type PDFFont, type PDFPage } from "pdf-lib";

interface WordToken {
  text: string;
  bold: boolean;
  italic: boolean;
}

const MARGIN = 50;
const [PAGE_WIDTH, PAGE_HEIGHT] = PageSizes.A4;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const BODY_SIZE = 11;

const HEADING_SIZES: Record<string, number> = {
  H1: 20,
  H2: 17,
  H3: 14,
  H4: 12,
  H5: 12,
  H6: 12,
};

function tokenize(node: Node, bold = false, italic = false): WordToken[] {
  const tokens: WordToken[] = [];
  node.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      const words = (child.textContent ?? "").split(/\s+/).filter(Boolean);
      for (const text of words) tokens.push({ text, bold, italic });
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const el = child as Element;
      const tag = el.tagName.toLowerCase();
      const nextBold = bold || tag === "strong" || tag === "b";
      const nextItalic = italic || tag === "em" || tag === "i";
      tokens.push(...tokenize(el, nextBold, nextItalic));
    }
  });
  return tokens;
}

class PdfLayout {
  private doc: PDFDocument;
  private fonts: { regular: PDFFont; bold: PDFFont; italic: PDFFont; boldItalic: PDFFont };
  private page: PDFPage;
  private cursorY: number;

  private constructor(doc: PDFDocument, fonts: PdfLayout["fonts"]) {
    this.doc = doc;
    this.fonts = fonts;
    this.page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    this.cursorY = PAGE_HEIGHT - MARGIN;
  }

  static async create(doc: PDFDocument): Promise<PdfLayout> {
    const fonts = {
      regular: await doc.embedFont(StandardFonts.Helvetica),
      bold: await doc.embedFont(StandardFonts.HelveticaBold),
      italic: await doc.embedFont(StandardFonts.HelveticaOblique),
      boldItalic: await doc.embedFont(StandardFonts.HelveticaBoldOblique),
    };
    return new PdfLayout(doc, fonts);
  }

  private pickFont(bold: boolean, italic: boolean): PDFFont {
    if (bold && italic) return this.fonts.boldItalic;
    if (bold) return this.fonts.bold;
    if (italic) return this.fonts.italic;
    return this.fonts.regular;
  }

  private lineHeightFor(size: number): number {
    return size * 1.25;
  }

  private newPage() {
    this.page = this.doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    this.cursorY = PAGE_HEIGHT - MARGIN;
  }

  private ensureSpace(height: number) {
    if (this.cursorY - height < MARGIN) {
      this.newPage();
    }
  }

  private wrapTokens(tokens: WordToken[], size: number, maxWidth: number): WordToken[][] {
    const lines: WordToken[][] = [];
    let current: WordToken[] = [];
    let currentWidth = 0;

    for (const token of tokens) {
      const font = this.pickFont(token.bold, token.italic);
      const wordWidth = font.widthOfTextAtSize(`${token.text} `, size);
      if (currentWidth + wordWidth > maxWidth && current.length > 0) {
        lines.push(current);
        current = [];
        currentWidth = 0;
      }
      current.push(token);
      currentWidth += wordWidth;
    }
    if (current.length > 0) lines.push(current);
    if (lines.length === 0) lines.push([]);
    return lines;
  }

  private drawTokenLine(tokens: WordToken[], x: number, y: number, size: number) {
    let cx = x;
    for (const token of tokens) {
      const font = this.pickFont(token.bold, token.italic);
      const word = `${token.text} `;
      this.page.drawText(word, { x: cx, y, size, font });
      cx += font.widthOfTextAtSize(word, size);
    }
  }

  renderParagraph(tokens: WordToken[], size: number, indent = 0, bulletPrefix?: string) {
    const lineHeight = this.lineHeightFor(size);

    if (tokens.length === 0) {
      this.ensureSpace(lineHeight);
      this.cursorY -= lineHeight;
      return;
    }

    const lines = this.wrapTokens(tokens, size, CONTENT_WIDTH - indent);
    lines.forEach((line, i) => {
      this.ensureSpace(lineHeight);
      if (i === 0 && bulletPrefix) {
        this.page.drawText(bulletPrefix, { x: MARGIN, y: this.cursorY, size, font: this.fonts.regular });
      }
      this.drawTokenLine(line, MARGIN + indent, this.cursorY, size);
      this.cursorY -= lineHeight;
    });
    this.cursorY -= size * 0.35;
  }

  renderTable(tableEl: Element) {
    const rows = Array.from(tableEl.querySelectorAll("tr"));
    if (rows.length === 0) return;

    const numCols = Math.max(1, rows[0].children.length);
    const colWidth = CONTENT_WIDTH / numCols;
    const cellPadding = 4;
    const fontSize = 10;
    const lineHeight = this.lineHeightFor(fontSize);

    for (const row of rows) {
      const cells = Array.from(row.children);
      const cellLines = cells.map((cell) =>
        this.wrapTokens(tokenize(cell), fontSize, colWidth - cellPadding * 2)
      );
      const maxLines = Math.max(1, ...cellLines.map((lines) => lines.length));
      const rowHeight = maxLines * lineHeight + cellPadding * 2;

      this.ensureSpace(rowHeight);
      const rowTop = this.cursorY;
      let x = MARGIN;

      cells.forEach((_, i) => {
        this.page.drawLine({ start: { x, y: rowTop }, end: { x: x + colWidth, y: rowTop }, thickness: 0.5 });
        this.page.drawLine({
          start: { x, y: rowTop - rowHeight },
          end: { x: x + colWidth, y: rowTop - rowHeight },
          thickness: 0.5,
        });
        this.page.drawLine({ start: { x, y: rowTop }, end: { x, y: rowTop - rowHeight }, thickness: 0.5 });

        let ty = rowTop - cellPadding - fontSize * 0.85;
        for (const line of cellLines[i]) {
          this.drawTokenLine(line, x + cellPadding, ty, fontSize);
          ty -= lineHeight;
        }
        x += colWidth;
      });

      this.page.drawLine({ start: { x, y: rowTop }, end: { x, y: rowTop - rowHeight }, thickness: 0.5 });
      this.cursorY = rowTop - rowHeight;
    }
    this.cursorY -= 10;
  }

  async renderImage(imgEl: Element) {
    const src = imgEl.getAttribute("src") ?? "";
    const match = src.match(/^data:image\/(png|jpe?g);base64,(.+)$/i);
    if (!match) return;

    const [, type, base64] = match;
    let bytes: Uint8Array;
    try {
      bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    } catch {
      return;
    }

    let embedded;
    try {
      embedded =
        type.toLowerCase() === "png" ? await this.doc.embedPng(bytes) : await this.doc.embedJpg(bytes);
    } catch {
      return;
    }

    const scale = Math.min(1, CONTENT_WIDTH / embedded.width);
    const w = embedded.width * scale;
    const h = embedded.height * scale;

    this.ensureSpace(h);
    this.page.drawImage(embedded, { x: MARGIN, y: this.cursorY - h, width: w, height: h });
    this.cursorY -= h + 10;
  }

  async renderBlock(el: Element) {
    const tag = el.tagName.toLowerCase();

    if (/^h[1-6]$/.test(tag)) {
      const size = HEADING_SIZES[tag.toUpperCase()] ?? BODY_SIZE;
      const tokens = tokenize(el).map((t) => ({ ...t, bold: true }));
      this.renderParagraph(tokens, size);
      return;
    }

    if (tag === "p") {
      const onlyChild = el.children.length === 1 ? el.children[0] : null;
      const isImageOnly =
        onlyChild && onlyChild.tagName.toLowerCase() === "img" && (el.textContent ?? "").trim() === "";
      if (isImageOnly) {
        await this.renderImage(onlyChild);
        return;
      }
      this.renderParagraph(tokenize(el), BODY_SIZE);
      return;
    }

    if (tag === "ul" || tag === "ol") {
      const items = Array.from(el.children).filter((c) => c.tagName.toLowerCase() === "li");
      items.forEach((li, i) => {
        const prefix = tag === "ol" ? `${i + 1}.` : "•";
        this.renderParagraph(tokenize(li), BODY_SIZE, 18, prefix);
      });
      return;
    }

    if (tag === "table") {
      this.renderTable(el);
      return;
    }

    if (tag === "img") {
      await this.renderImage(el);
      return;
    }

    const text = el.textContent?.trim();
    if (text) {
      this.renderParagraph(tokenize(el), BODY_SIZE);
    }
  }
}

export async function docxToPdf(file: File): Promise<Uint8Array> {
  const mammoth = await import("mammoth");

  let html: string;
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml(
      { arrayBuffer },
      { convertImage: mammoth.images.dataUri }
    );
    html = result.value;
  } catch {
    throw new Error(`"${file.name}" could not be read as a Word document. Only .docx files are supported (not legacy .doc).`);
  }

  const parsedHtml = new DOMParser().parseFromString(html, "text/html");
  const blocks = Array.from(parsedHtml.body.children);
  if (blocks.length === 0) {
    throw new Error("This document appears to be empty.");
  }

  const pdfDoc = await PDFDocument.create();
  const layout = await PdfLayout.create(pdfDoc);

  for (const block of blocks) {
    await layout.renderBlock(block);
  }

  return pdfDoc.save();
}
