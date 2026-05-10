import { SEVEN_DAYS, OUTFITS } from './seven-day-data';

export async function download7DayWithFrame(imgSrc: string, dayId: string, outfitId: string, characterName?: string): Promise<void> {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = imgSrc;
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
  });

  const dayData = SEVEN_DAYS.find(d => d.id === dayId);
  const outfitData = OUTFITS.find(o => o.id === outfitId);
  // Purple color as requested: "แถบวันสีม่วง" (Purple day bar)
  // Using the same purple from Fortune generator: rgba(199, 139, 245, 0.7)
  const purpleBannerColor = 'rgba(199, 139, 245, 0.7)';

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
  // No borders, so we can use full width/height or keep a small padding if desired.
  // The user said "ไม่ต้องมีขอบๆ", I'll use full canvas or very minimal padding.
  // Let's use 0 padding for "no borders".
  const imgRatio = img.width / img.height;
  const canvasRatio = W / H;
  let sx = 0, sy = 0, sw = img.width, sh = img.height;
  if (imgRatio > canvasRatio) {
    sw = img.height * canvasRatio;
    sx = (img.width - sw) / 2;
  } else {
    sh = img.width / canvasRatio;
    sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);

  // Vignette for depth
  const vignette = ctx.createRadialGradient(W / 2, H / 2, W * 0.25, W / 2, H / 2, W * 0.85);
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, 'rgba(10,9,20,0.5)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, H);

  // Bottom card name banner (Purple Bar)
  const bannerH = 70;
  const bannerY = H - 120;
  const bannerGrad = ctx.createLinearGradient(W * 0.1, bannerY, W * 0.9, bannerY);
  bannerGrad.addColorStop(0, 'rgba(0,0,0,0)');
  bannerGrad.addColorStop(0.2, purpleBannerColor);
  bannerGrad.addColorStop(0.8, purpleBannerColor);
  bannerGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = bannerGrad;
  ctx.fillRect(0, bannerY - bannerH / 2, W, bannerH);

  // Draw day name and outfit name in the banner
  const dayText = `${dayData?.nameEn || ''} - ${outfitData?.nameEn || ''}`.toUpperCase();
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 10;
  ctx.font = "900 28px 'Outfit', sans-serif";
  ctx.textAlign = 'center';
  ctx.letterSpacing = '4px';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(dayText, W / 2, bannerY + 10);
  ctx.restore();

  // Character Name (Top Left)
  if (characterName) {
    ctx.save();
    ctx.font = "800 36px 'Outfit', sans-serif";
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 2;
    ctx.fillText(characterName.toUpperCase(), 50, 80);
    ctx.restore();
  }

  // Trigger download
  const link = document.createElement('a');
  const filename = characterName 
    ? `7Day_${characterName}_${dayData?.nameEn}_${outfitData?.id}.png`
    : `7Day_${dayData?.nameEn}_${outfitData?.id}.png`;
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
