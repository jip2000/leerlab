/**
 * Foto bewerken met een <canvas>: draaien, bijsnijden en verbeteren voor tekstherkenning.
 */

export interface Crop {
  /** Alles als fractie (0..1) van de gedraaide foto. */
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface EditSettings {
  rotation: number; // graden: 0, 90, 180, 270 plus fijnafstelling
  crop: Crop;
  enhance: boolean;
}

export const fullCrop: Crop = { x: 0, y: 0, w: 1, h: 1 };
const MAX_SIDE = 2200;

export async function loadImage(file: Blob): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return img;
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

/** Draait de foto; geeft een canvas terug dat precies om de gedraaide foto past. */
export function rotate(img: CanvasImageSource & { width: number; height: number }, degrees: number): HTMLCanvasElement {
  const rad = (degrees * Math.PI) / 180;
  const sin = Math.abs(Math.sin(rad));
  const cos = Math.abs(Math.cos(rad));
  // Kleine foto's vergroten (leest beter), grote verkleinen (sneller).
  const side = Math.max(img.width, img.height);
  const scale = Math.min(MAX_SIDE / side, Math.max(1, 1600 / side));
  const w = img.width * scale;
  const h = img.height * scale;
  const c = document.createElement('canvas');
  c.width = Math.round(w * cos + h * sin);
  c.height = Math.round(w * sin + h * cos);
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.translate(c.width / 2, c.height / 2);
  ctx.rotate(rad);
  ctx.drawImage(img, -w / 2, -h / 2, w, h);
  return c;
}

export function cropCanvas(src: HTMLCanvasElement, crop: Crop): HTMLCanvasElement {
  const c = document.createElement('canvas');
  const sx = Math.round(crop.x * src.width);
  const sy = Math.round(crop.y * src.height);
  c.width = Math.max(1, Math.round(crop.w * src.width));
  c.height = Math.max(1, Math.round(crop.h * src.height));
  c.getContext('2d')!.drawImage(src, sx, sy, c.width, c.height, 0, 0, c.width, c.height);
  return c;
}

/**
 * Beeld verbeteren: grijswaarden, contrast oprekken (automatisch), en verscherpen.
 * Werkt direct op de pixels (getImageData).
 */
export function enhance(src: HTMLCanvasElement): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = src.width;
  c.height = src.height;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(src, 0, 0);
  const img = ctx.getImageData(0, 0, c.width, c.height);
  const d = img.data;
  const n = c.width * c.height;
  const gray = new Float32Array(n);
  const hist = new Uint32Array(256);
  for (let i = 0; i < n; i++) {
    const g = 0.299 * d[i * 4]! + 0.587 * d[i * 4 + 1]! + 0.114 * d[i * 4 + 2]!;
    gray[i] = g;
    hist[Math.round(g)]!++;
  }
  // Contrast: 1% donkerste wordt zwart, 1% lichtste wordt wit.
  let lo = 0;
  let hi = 255;
  for (let acc = 0; lo < 255 && acc + hist[lo]! < n * 0.01; lo++) acc += hist[lo]!;
  for (let acc = 0; hi > 0 && acc + hist[hi]! < n * 0.01; hi--) acc += hist[hi]!;
  const range = Math.max(1, hi - lo);
  for (let i = 0; i < n; i++) gray[i] = Math.min(255, Math.max(0, ((gray[i]! - lo) / range) * 255));
  // Verscherpen met een 3×3-filter.
  const w = c.width;
  for (let y = 0; y < c.height; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      let v = gray[i]!;
      if (x > 0 && y > 0 && x < w - 1 && y < c.height - 1) {
        v = 5 * gray[i]! - gray[i - 1]! - gray[i + 1]! - gray[i - w]! - gray[i + w]!;
      }
      const g = Math.min(255, Math.max(0, v));
      d[i * 4] = d[i * 4 + 1] = d[i * 4 + 2] = g;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

export function render(img: HTMLImageElement, s: EditSettings): HTMLCanvasElement {
  const cropped = cropCanvas(rotate(img, s.rotation), s.crop);
  return s.enhance ? enhance(cropped) : cropped;
}

/** Kleinere JPEG om bij de lijst te bewaren. */
export function toJpeg(canvas: HTMLCanvasElement, maxSide = 1600): Promise<Blob> {
  const scale = Math.min(1, maxSide / Math.max(canvas.width, canvas.height));
  const c = document.createElement('canvas');
  c.width = Math.round(canvas.width * scale);
  c.height = Math.round(canvas.height * scale);
  c.getContext('2d')!.drawImage(canvas, 0, 0, c.width, c.height);
  return new Promise((resolve, reject) => c.toBlob((b) => (b ? resolve(b) : reject(new Error('Opslaan van de foto lukte niet'))), 'image/jpeg', 0.85));
}
