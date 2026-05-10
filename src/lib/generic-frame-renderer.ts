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

export async function downloadGenericFrame(
  imgSrc: string, 
  title: string, 
  subtitle?: string, 
  characterName?: string,
  accentColor: string = '#ec4899',
  isMinimal: boolean = false
): Promise<void> {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = imgSrc;
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
  });

  // Use original image proportions but reasonable size if minimal
  const W = isMinimal ? img.width : 800;
  const H = isMinimal ? img.height : 1200;
  
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  if (isMinimal) {
    // Just the image
    ctx.drawImage(img, 0, 0, W, H);
    
    // Character Name watermark only
    if (characterName) {
      ctx.save();
      const fontSize = Math.max(24, Math.floor(W * 0.04)); // Responsive font size
      ctx.font = `800 ${fontSize}px 'Outfit', sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = fontSize / 3;
      ctx.fillText(characterName.toUpperCase(), W * 0.05, H * 0.05);
      ctx.restore();
    }
  } else {
    // Full Tarot Frame Logic
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

    // Vignette / Gradient Overlay
    const vignette = ctx.createRadialGradient(W / 2, H / 2, W * 0.25, W / 2, H / 2, W * 0.85);
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, `${accentColor}22`);
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, W, H);

    // Decorative Sparkles / Hearts if it's a pink theme
    if (accentColor.toLowerCase().includes('ec4899') || accentColor.toLowerCase().includes('ff')) {
      ctx.font = "24px serif";
      ctx.fillStyle = `${accentColor}66`;
      for(let i=0; i<15; i++) {
          ctx.fillText("❤", Math.random()*W, Math.random()*H);
          ctx.fillText("✨", Math.random()*W, Math.random()*H);
      }
    }

    // Outer border with glow
    ctx.save();
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 20;
    ctx.strokeStyle = `${accentColor}88`;
    ctx.lineWidth = 4;
    roundRect(ctx, 16, 16, W - 32, H - 32, 24);
    ctx.stroke();
    ctx.restore();

    // Decorative corners
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2;
    const cornerSize = 60;
    // Top Left
    ctx.beginPath(); ctx.moveTo(16, 16 + cornerSize); ctx.lineTo(16, 16); ctx.lineTo(16 + cornerSize, 16); ctx.stroke();
    // Top Right
    ctx.beginPath(); ctx.moveTo(W - 16, 16 + cornerSize); ctx.lineTo(W - 16, 16); ctx.lineTo(W - 16 - cornerSize, 16); ctx.stroke();
    // Bottom Left
    ctx.beginPath(); ctx.moveTo(16, H - 16 - cornerSize); ctx.lineTo(16, H - 16); ctx.lineTo(16 + cornerSize, H - 16); ctx.stroke();
    // Bottom Right
    ctx.beginPath(); ctx.moveTo(W - 16, H - 16 - cornerSize); ctx.lineTo(W - 16, H - 16); ctx.lineTo(W - 16 - cornerSize, H - 16); ctx.stroke();

    // Bottom card name banner
    const bannerH = 80;
    const bannerY = H - 120;
    
    // Fancy Glassmorphism Banner
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 20;
    roundRect(ctx, W*0.1, bannerY - bannerH/2, W*0.8, bannerH, 40);
    ctx.fill();
    
    ctx.strokeStyle = `${accentColor}66`;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // Draw title
    const displayText = title.toUpperCase();
    ctx.save();
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 10;
    ctx.font = "900 36px 'Outfit', sans-serif";
    ctx.textAlign = 'center';
    ctx.letterSpacing = '6px';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(displayText, W / 2, bannerY + 12);
    ctx.restore();

    // Subtitle (if any)
    if (subtitle) {
      ctx.font = "700 16px 'Outfit', sans-serif";
      ctx.textAlign = 'center';
      ctx.fillStyle = `${accentColor}`;
      ctx.letterSpacing = '2px';
      ctx.fillText(subtitle.toUpperCase(), W / 2, bannerY - 50);
    }

    // Watermark / Character Name
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
  }

  // Trigger download
  const link = document.createElement('a');
  link.download = `GEN_${title.replace(/\s/g, '_')}_${characterName || 'CHAR'}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

