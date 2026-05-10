/* ────────────────────────────────────────────────────
   Canvas Frame Renderer
   Draws an ornate tarot frame on a canvas and triggers download.
   ──────────────────────────────────────────────────── */

import { MAJOR_ARCANA, ROMAN, getCardSymbol } from './tarot-data';

/* ── Canvas helpers ── */

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawCornerOrnament(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, size: number,
  dirX: number, dirY: number, color: string
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.lineCap = 'round';

  // L-shape
  ctx.beginPath();
  ctx.moveTo(x, y + dirY * size);
  ctx.lineTo(x, y);
  ctx.lineTo(x + dirX * size, y);
  ctx.stroke();

  // Small inner L
  ctx.strokeStyle = color.replace('0.55', '0.3');
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + dirX * 6, y + dirY * (size * 0.6));
  ctx.lineTo(x + dirX * 6, y + dirY * 6);
  ctx.lineTo(x + dirX * (size * 0.6), y + dirY * 6);
  ctx.stroke();

  // Dot accent
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x + dirX * 10, y + dirY * 10, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawLine(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number, x2: number, y2: number, color: string
) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawDiamond(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, size: number, color: string
) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy - size);
  ctx.lineTo(cx + size, cy);
  ctx.lineTo(cx, cy + size);
  ctx.lineTo(cx - size, cy);
  ctx.closePath();
  ctx.fill();
}

/* ── Main export ── */

export async function downloadWithFrame(imgSrc: string, cardName: string, watermarkText?: string): Promise<void> {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = imgSrc;
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
  });

  const W = 800;
  const H = 1200;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = '#0a0914';
  ctx.fillRect(0, 0, W, H);

  // Draw image (cover-fit)
  const pad = 40;
  const innerW = W - pad * 2;
  const innerH = H - pad * 2;
  const imgRatio = img.width / img.height;
  const slotRatio = innerW / innerH;
  let sx = 0, sy = 0, sw = img.width, sh = img.height;
  if (imgRatio > slotRatio) {
    sw = img.height * slotRatio;
    sx = (img.width - sw) / 2;
  } else {
    sh = img.width / slotRatio;
    sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, pad, pad, innerW, innerH);

  // Vignette
  const vignette = ctx.createRadialGradient(W / 2, H / 2, W * 0.25, W / 2, H / 2, W * 0.85);
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, 'rgba(10,9,20,0.65)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, H);

  // Outer border with glow
  ctx.save();
  ctx.shadowColor = 'rgba(255,142,179,0.35)';
  ctx.shadowBlur = 18;
  ctx.strokeStyle = 'rgba(255,142,179,0.5)';
  ctx.lineWidth = 3;
  roundRect(ctx, 16, 16, W - 32, H - 32, 20);
  ctx.stroke();
  ctx.restore();

  // Inner border
  ctx.strokeStyle = 'rgba(199,139,245,0.25)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, 30, 30, W - 60, H - 60, 14);
  ctx.stroke();

  // Corner ornaments
  const cSize = 50, cOff = 22;
  const cColor = 'rgba(255,178,204,0.55)';
  drawCornerOrnament(ctx, cOff, cOff, cSize, 1, 1, cColor);
  drawCornerOrnament(ctx, W - cOff, cOff, cSize, -1, 1, cColor);
  drawCornerOrnament(ctx, cOff, H - cOff, cSize, 1, -1, cColor);
  drawCornerOrnament(ctx, W - cOff, H - cOff, cSize, -1, -1, cColor);

  // Decorative lines
  const topY = 58;
  const bottomY = H - 58;
  const lineColor = 'rgba(255,142,179,0.2)';
  drawLine(ctx, 80, topY, W - 80, topY, lineColor);
  drawLine(ctx, 80, bottomY, W - 80, bottomY, lineColor);

  // Top symbol
  const symbol = getCardSymbol(cardName);
  ctx.font = '24px serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,178,204,0.7)';
  ctx.fillText(symbol, W / 2, topY - 10);

  // Watermark (Top Left inside the image boundary)
  if (watermarkText) {
    ctx.save();
    ctx.font = "800 28px 'Outfit', sans-serif";
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.shadowColor = 'rgba(0,0,0,0.9)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 2;
    // Pad is 40. Place watermark 16px inward from top left corner of the image.
    ctx.fillText(watermarkText.toUpperCase(), 56, 76);
    ctx.restore();
  }

  // Bottom card name banner
  const bannerH = 56;
  const bannerY = H - 100;
  const bannerGrad = ctx.createLinearGradient(W * 0.15, bannerY, W * 0.85, bannerY);
  bannerGrad.addColorStop(0, 'rgba(199,139,245,0)');
  bannerGrad.addColorStop(0.2, 'rgba(199,139,245,0.7)');
  bannerGrad.addColorStop(0.8, 'rgba(199,139,245,0.7)');
  bannerGrad.addColorStop(1, 'rgba(199,139,245,0)');
  ctx.fillStyle = bannerGrad;
  ctx.fillRect(0, bannerY - bannerH / 2, W, bannerH);

  // Banner border lines
  ctx.strokeStyle = 'rgba(255,142,179,0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(W * 0.15, bannerY - bannerH / 2);
  ctx.lineTo(W * 0.85, bannerY - bannerH / 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(W * 0.15, bannerY + bannerH / 2);
  ctx.lineTo(W * 0.85, bannerY + bannerH / 2);
  ctx.stroke();

  // Card name formulation
  const majorIdx = MAJOR_ARCANA.indexOf(cardName);
  let displayText = cardName.toUpperCase();
  if (majorIdx >= 0) {
    displayText = `${majorIdx}. ${cardName}`.toUpperCase();
  }

  // Draw card name
  ctx.save();
  ctx.shadowColor = 'rgba(199,139,245,0.7)';
  ctx.shadowBlur = 10;
  ctx.font = "900 20px 'Outfit', sans-serif";
  ctx.textAlign = 'center';
  ctx.letterSpacing = '6px';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(displayText, W / 2, bannerY + 6);
  ctx.restore();

  // Diamond accents
  drawDiamond(ctx, W / 2, topY, 5, 'rgba(255,178,204,0.6)');
  drawDiamond(ctx, W / 2, bottomY, 5, 'rgba(255,178,204,0.6)');

  // Trigger download
  const link = document.createElement('a');
  let fileBase = cardName;
  if (majorIdx >= 0) fileBase = `${majorIdx}_${cardName}`;
  const fileName = fileBase.replace(/\./g, "").replace(/ /g, "_").toUpperCase();
  link.download = `${fileName}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export async function downloadRawWithWatermark(imgSrc: string, cardName: string, watermarkText: string): Promise<void> {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = imgSrc;
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
  });

  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d')!;

  ctx.drawImage(img, 0, 0);

  // Draw Watermark Top Left
  if (watermarkText) {
    ctx.save();
    const fontSize = Math.max(16, img.width * 0.03); // Scale font size based on image width
    ctx.font = `800 ${fontSize}px 'Outfit', sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 2;
    
    const x = img.width * 0.04;
    const y = img.width * 0.04 + fontSize;
    ctx.fillText(watermarkText.toUpperCase(), x, y);
    ctx.restore();
  }

  const link = document.createElement('a');
  let fileBase = cardName;
  const majorIdxForFile = MAJOR_ARCANA.indexOf(cardName);
  if (majorIdxForFile >= 0) fileBase = `${majorIdxForFile}_${cardName}`;
  const fileName = fileBase.replace(/\./g, "").replace(/ /g, "_").toUpperCase();
  link.download = `${fileName}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
