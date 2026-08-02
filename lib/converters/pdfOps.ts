import { PDFDocument } from "pdf-lib";

export async function mergePdfs(files: File[]): Promise<Uint8Array> {
  if (files.length < 2) {
    throw new Error("Add at least two PDF files to merge.");
  }

  const outDoc = await PDFDocument.create();

  for (const file of files) {
    let srcDoc;
    try {
      const bytes = await file.arrayBuffer();
      srcDoc = await PDFDocument.load(bytes);
    } catch {
      throw new Error(`"${file.name}" could not be read — it may be encrypted or corrupted.`);
    }
    const pages = await outDoc.copyPages(srcDoc, srcDoc.getPageIndices());
    pages.forEach((page) => outDoc.addPage(page));
  }

  return outDoc.save();
}

export interface SplitPage {
  filename: string;
  bytes: Uint8Array;
}

export async function splitPdf(file: File): Promise<SplitPage[]> {
  let srcDoc;
  try {
    const bytes = await file.arrayBuffer();
    srcDoc = await PDFDocument.load(bytes);
  } catch {
    throw new Error(`"${file.name}" could not be read — it may be encrypted or corrupted.`);
  }

  const pageCount = srcDoc.getPageCount();
  if (pageCount <= 1) {
    throw new Error("This PDF only has one page — nothing to split.");
  }

  const base = file.name.replace(/\.pdf$/i, "");
  const results: SplitPage[] = [];
  const digits = String(pageCount).length;

  for (let i = 0; i < pageCount; i++) {
    const outDoc = await PDFDocument.create();
    const [page] = await outDoc.copyPages(srcDoc, [i]);
    outDoc.addPage(page);
    const bytes = await outDoc.save();
    const pageNumber = String(i + 1).padStart(digits, "0");
    results.push({ filename: `${base}-page-${pageNumber}.pdf`, bytes });
  }

  return results;
}

export async function imagesToPdf(files: File[]): Promise<Uint8Array> {
  if (files.length === 0) {
    throw new Error("Add at least one image.");
  }

  const outDoc = await PDFDocument.create();

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const isPng = file.type === "image/png" || /\.png$/i.test(file.name);
    let image;
    try {
      image = isPng ? await outDoc.embedPng(bytes) : await outDoc.embedJpg(bytes);
    } catch {
      throw new Error(`"${file.name}" is not a supported PNG or JPG image.`);
    }
    const page = outDoc.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
  }

  return outDoc.save();
}
