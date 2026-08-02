export interface ImageResult {
  blob: Blob;
  width: number;
  height: number;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read this image file."));
    };
    img.src = url;
  });
}

function drawToCanvas(
  img: HTMLImageElement,
  width: number,
  height: number
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser.");
  ctx.drawImage(img, 0, 0, width, height);
  return canvas;
}

function canvasToBlob(canvas: HTMLCanvasElement, mime: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error(`Your browser could not encode this image as ${mime}.`));
          return;
        }
        resolve(blob);
      },
      mime,
      quality
    );
  });
}

export async function reencodeImage(
  file: File,
  mime: string,
  quality?: number
): Promise<ImageResult> {
  const img = await loadImage(file);
  const canvas = drawToCanvas(img, img.naturalWidth, img.naturalHeight);
  const blob = await canvasToBlob(canvas, mime, quality);
  return { blob, width: canvas.width, height: canvas.height };
}

export async function resizeImageFile(
  file: File,
  targetWidth: number,
  targetHeight: number,
  mime: string,
  quality?: number
): Promise<ImageResult> {
  const img = await loadImage(file);
  const canvas = drawToCanvas(img, Math.max(1, Math.round(targetWidth)), Math.max(1, Math.round(targetHeight)));
  const blob = await canvasToBlob(canvas, mime, quality);
  return { blob, width: canvas.width, height: canvas.height };
}

export async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  const img = await loadImage(file);
  return { width: img.naturalWidth, height: img.naturalHeight };
}

export async function compressPng(file: File, quality: number): Promise<ImageResult> {
  const UPNG = await import("upng-js");
  const img = await loadImage(file);
  const width = img.naturalWidth;
  const height = img.naturalHeight;
  const canvas = drawToCanvas(img, width, height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser.");
  const imageData = ctx.getImageData(0, 0, width, height);

  const colorCount = Math.max(2, Math.round(quality * 256));
  const encoded = UPNG.encode([imageData.data.buffer], width, height, colorCount);
  return { blob: new Blob([encoded], { type: "image/png" }), width, height };
}
