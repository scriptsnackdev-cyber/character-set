import { MBTI_TYPES } from './mbti-data';

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

export async function downloadMBTIWithFrame(imgSrc: string, mbtiType: string, characterName?: string): Promise<void> {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = imgSrc;
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
  });

  const mbtiData = MBTI_TYPES.find(m => m.type === mbtiType);
  const accentColor = mbtiData?.color || '#ff69b4';

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
  vignette.addColorStop(1, `${accentColor}22`);
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, H);

  // Outer border with glow
  ctx.save();
  ctx.shadowColor = accentColor;
  ctx.shadowBlur = 20;
  ctx.strokeStyle = `${accentColor}88`;
  ctx.lineWidth = 4;
  roundRect(ctx, 16, 16, W - 32, H - 32, 24);
  ctx.stroke();
  ctx.restore();

  // Bottom card name banner
  const bannerH = 64;
  const bannerY = H - 100;
  const bannerGrad = ctx.createLinearGradient(W * 0.15, bannerY, W * 0.85, bannerY);
  bannerGrad.addColorStop(0, 'rgba(0,0,0,0)');
  bannerGrad.addColorStop(0.2, `${accentColor}cc`);
  bannerGrad.addColorStop(0.8, `${accentColor}cc`);
  bannerGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = bannerGrad;
  ctx.fillRect(0, bannerY - bannerH / 2, W, bannerH);

  // Draw card name
  const displayText = `${mbtiType} - ${mbtiData?.name || ''}`.toUpperCase();
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 10;
  ctx.font = "900 24px 'Outfit', sans-serif";
  ctx.textAlign = 'center';
  ctx.letterSpacing = '4px';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(displayText, W / 2, bannerY + 8);
  ctx.restore();

  // Watermark
  if (characterName) {
    ctx.save();
    ctx.font = "800 32px 'Outfit', sans-serif";
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 12;
    ctx.fillText(characterName.toUpperCase(), 60, 80);
    ctx.restore();
  }

  // Trigger download
  const link = document.createElement('a');
  link.download = `CHIBI_${mbtiType}_${characterName || 'CAT'}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
