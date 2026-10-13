// Aesthetic Filter Engine for Phone Cameras & Photobooths
// Designed to turn flat/harsh smartphone photos into dreamy, filmic, aesthetic portraits.

export const PRESET_FILTERS = {
  korean_glow: {
    id: 'korean_glow',
    name: '🌸 Haru Glow (Korean)',
    tagline: 'Flattering skin smoothing, soft highlight bloom & pastel tones',
    settings: {
      brightness: 8,
      contrast: -6,
      saturation: 4,
      warmth: 8,
      tint: 6,
      softGlow: 45,
      filmGrain: 12,
      vignette: 10,
      halftone: false,
      dateStamp: false,
    }
  },
  portra_film: {
    id: 'portra_film',
    name: '🎞️ Kodak Portra 35mm',
    tagline: 'Warm analog film tones, organic silver grain & soft contrast',
    settings: {
      brightness: 2,
      contrast: 6,
      saturation: -4,
      warmth: 18,
      tint: 4,
      softGlow: 25,
      filmGrain: 38,
      vignette: 25,
      halftone: false,
      dateStamp: true,
    }
  },
  moody_cinema: {
    id: 'moody_cinema',
    name: '🎬 Cinema Crimson Noir',
    tagline: 'Deep rich shadows, velvety highlights & theatrical atmosphere',
    settings: {
      brightness: -4,
      contrast: 22,
      saturation: 12,
      warmth: 12,
      tint: 14,
      softGlow: 30,
      filmGrain: 32,
      vignette: 45,
      halftone: false,
      dateStamp: false,
    }
  },
  vintage_newspaper: {
    id: 'vintage_newspaper',
    name: '📰 Retro Newsprint (B&W)',
    tagline: 'Vintage high-contrast monochrome with ink grain & halftone dots',
    settings: {
      brightness: 5,
      contrast: 28,
      saturation: -100, // True Black & White
      warmth: 0,
      tint: 0,
      softGlow: 15,
      filmGrain: 48,
      vignette: 30,
      halftone: true,
      dateStamp: false,
    }
  },
  retro_90s: {
    id: 'retro_90s',
    name: '☀️ 90s Disposable Cam',
    tagline: 'Golden hour amber wash, punchy colors & retro orange date stamp',
    settings: {
      brightness: 4,
      contrast: 15,
      saturation: 18,
      warmth: 28,
      tint: -4,
      softGlow: 20,
      filmGrain: 42,
      vignette: 35,
      halftone: false,
      dateStamp: true,
    }
  },
  digicam_y2k: {
    id: 'digicam_y2k',
    name: '📼 Y2K Direct Flash',
    tagline: 'Glossy compact camera flash emulation, vibrant pop & cool glow',
    settings: {
      brightness: 14,
      contrast: 20,
      saturation: 14,
      warmth: -8,
      tint: 8,
      softGlow: 35,
      filmGrain: 20,
      vignette: 20,
      halftone: false,
      dateStamp: true,
    }
  },
  sepia_postcard: {
    id: 'sepia_postcard',
    name: '☕ Antique Postcard',
    tagline: 'Nostalgic warm sepia, gentle faded shadows & soft edges',
    settings: {
      brightness: 0,
      contrast: -4,
      saturation: -45,
      warmth: 40,
      tint: 12,
      softGlow: 30,
      filmGrain: 40,
      vignette: 40,
      halftone: false,
      dateStamp: false,
    }
  },
  clean_studio: {
    id: 'clean_studio',
    name: '✨ Modern Studio',
    tagline: 'Crisp yet gentle portrait enhancement, balanced colors',
    settings: {
      brightness: 4,
      contrast: 8,
      saturation: 2,
      warmth: 4,
      tint: 2,
      softGlow: 15,
      filmGrain: 0,
      vignette: 10,
      halftone: false,
      dateStamp: false,
    }
  },
  original: {
    id: 'original',
    name: '🌿 Raw / Original',
    tagline: 'Direct camera feed with no processing',
    settings: {
      brightness: 0,
      contrast: 0,
      saturation: 0,
      warmth: 0,
      tint: 0,
      softGlow: 0,
      filmGrain: 0,
      vignette: 0,
      halftone: false,
      dateStamp: false,
    }
  }
};

export const DEFAULT_FILTER_SETTINGS = {
  ...PRESET_FILTERS.korean_glow.settings,
  customDate: "'26 10 12"
};

// Generates CSS filter string for live real-time preview (Webcam & Preview elements)
export function getCssFilterString(settings) {
  const s = settings || DEFAULT_FILTER_SETTINGS;
  const b = 1 + (s.brightness || 0) / 100;
  const c = 1 + (s.contrast || 0) / 100;
  const sat = 1 + (s.saturation || 0) / 100;

  // Sepia/warmth calculation
  const warmth = (s.warmth || 0);
  const sepia = warmth > 0 ? (warmth / 100) * 0.4 : 0;
  const hueRotate = (s.tint || 0) * 0.8; // magenta / green shift

  let str = `brightness(${b}) contrast(${c}) saturate(${Math.max(0, sat)})`;
  if (sepia > 0) {
    str += ` sepia(${sepia})`;
  }
  if (hueRotate !== 0) {
    str += ` hue-rotate(${hueRotate}deg)`;
  }
  return str;
}

// Generates CSS filter style object and overlay attributes
export function getFilterStyle(settings) {
  const s = settings || DEFAULT_FILTER_SETTINGS;
  return {
    filter: getCssFilterString(s),
  };
}

// Draws a single photo with object-fit: cover, rounded corners, and all aesthetic filters directly onto an HTML5 2D Canvas
export function drawPhotoWithFiltersToCanvas(ctx, img, dx, dy, dw, dh, radius = 0, settings) {
  if (!ctx || !img) return;
  const iw = img.naturalWidth || img.width || dw;
  const ih = img.naturalHeight || img.height || dh;
  if (!iw || !ih) return;

  const s = settings || DEFAULT_FILTER_SETTINGS;

  // Calculate object-fit: cover crop
  const targetRatio = dw / dh;
  const imgRatio = iw / ih;
  let sx = 0;
  let sy = 0;
  let sw = iw;
  let sh = ih;

  if (imgRatio > targetRatio) {
    sw = ih * targetRatio;
    sx = (iw - sw) / 2;
  } else {
    sh = iw / targetRatio;
    sy = (ih - sh) / 2;
  }

  ctx.save();

  // Rounded rectangle clip
  const r = Math.max(0, Math.min(radius, dw / 2, dh / 2));
  ctx.beginPath();
  ctx.moveTo(dx + r, dy);
  ctx.lineTo(dx + dw - r, dy);
  ctx.quadraticCurveTo(dx + dw, dy, dx + dw, dy + r);
  ctx.lineTo(dx + dw, dy + dh - r);
  ctx.quadraticCurveTo(dx + dw, dy + dh, dx + dw - r, dy + dh);
  ctx.lineTo(dx + r, dy + dh);
  ctx.quadraticCurveTo(dx, dy + dh, dx, dy + dh - r);
  ctx.lineTo(dx, dy + r);
  ctx.quadraticCurveTo(dx, dy, dx + r, dy);
  ctx.closePath();
  ctx.clip();

  // Draw base image with CSS filter
  try {
    ctx.filter = getCssFilterString(s);
  } catch (e) {
    // Fallback if browser doesn't support ctx.filter
  }
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
  ctx.filter = 'none';

  // 1. Soft Glow / Bloom
  if (s.softGlow && s.softGlow > 0) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    try {
      ctx.filter = `blur(${Math.max(2, Math.round(dw * 0.015))}px) brightness(1.12)`;
    } catch (e) {}
    ctx.globalAlpha = (s.softGlow / 100) * 0.32;
    ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
    ctx.restore();
  }

  // 2. Halftone Dots Overlay
  if (s.halftone) {
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    const dotSpacing = Math.max(4, Math.round(dw / 90));
    const dotRadius = dotSpacing * 0.32;
    ctx.fillStyle = 'rgba(40, 35, 30, 0.22)';
    for (let y = dy; y < dy + dh; y += dotSpacing) {
      for (let x = dx; x < dx + dw; x += dotSpacing) {
        ctx.beginPath();
        ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  // 3. Procedural Film Grain Overlay
  if (s.filmGrain && s.filmGrain > 0) {
    const grainAlpha = (s.filmGrain / 100) * 0.22;
    ctx.save();
    ctx.globalCompositeOperation = 'overlay';
    const noiseTileSize = 96;
    const noiseCanvas = document.createElement('canvas');
    noiseCanvas.width = noiseTileSize;
    noiseCanvas.height = noiseTileSize;
    const nCtx = noiseCanvas.getContext('2d');
    const imgData = nCtx.createImageData(noiseTileSize, noiseTileSize);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const val = Math.floor(Math.random() * 256);
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
      data[i + 3] = Math.floor(Math.random() * 160 + 60);
    }
    nCtx.putImageData(imgData, 0, 0);
    const pattern = ctx.createPattern(noiseCanvas, 'repeat');
    if (pattern) {
      ctx.fillStyle = pattern;
      ctx.globalAlpha = grainAlpha;
      ctx.fillRect(dx, dy, dw, dh);
    }
    ctx.restore();
  }

  // 4. Subtle Vignette
  if (s.vignette && s.vignette > 0) {
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    const cx = dx + dw / 2;
    const cy = dy + dh / 2;
    const vigGradient = ctx.createRadialGradient(
      cx, cy, dw * 0.25,
      cx, cy, dw * 0.75
    );
    const maxVig = (s.vignette / 100) * 0.55;
    vigGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vigGradient.addColorStop(1, `rgba(15, 10, 5, ${maxVig})`);
    ctx.fillStyle = vigGradient;
    ctx.fillRect(dx, dy, dw, dh);
    ctx.restore();
  }

  // 5. Retro 90s Camera Orange Date Stamp
  if (s.dateStamp) {
    ctx.save();
    const dateText = s.customDate || "'26 10 12";
    const fontSize = Math.max(12, Math.round(dw * 0.065));
    ctx.font = `bold ${fontSize}px 'VT323', 'Courier New', monospace`;
    ctx.fillStyle = '#ff7b00';
    ctx.shadowColor = 'rgba(255, 60, 0, 0.75)';
    ctx.shadowBlur = Math.round(fontSize * 0.25);
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText(dateText, dx + dw - dw * 0.04, dy + dh - dh * 0.03);
    ctx.restore();
  }

  ctx.restore();
}

// Applies filters directly onto an HTML5 Canvas context (used during High-Res photo render & capture)
export function applyFiltersToCanvas(ctx, width, height, settings) {
  const s = settings || DEFAULT_FILTER_SETTINGS;
  drawPhotoWithFiltersToCanvas(ctx, ctx.canvas, 0, 0, width, height, 0, s);
}

