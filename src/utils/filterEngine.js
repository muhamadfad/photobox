// Aesthetic Filter & Intelligent Camera ISP Engine for Phone Cameras & Photobooths
// Turns flat/noisy smartphone & laptop webcam captures into studio-grade Korean photobooth portraits.

export const PRESET_FILTERS = {
  clean_studio: {
    id: 'clean_studio',
    name: 'Natural Original HD',
    badge: 'Pure HD',
    swatch: '#6366f1',
    tagline: 'Kualitas asli kamera jernih, warna kulit natural tanpa distorsi filter',
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
  },
  korean_glow: {
    id: 'korean_glow',
    name: 'Haru Peach Glow',
    badge: 'K-Studio',
    swatch: '#fb7185',
    tagline: 'Kulit cerah merona, highlight lembut & tone pastel studio Korea',
    settings: {
      brightness: 4,
      contrast: 2,
      saturation: 6,
      warmth: 4,
      tint: 4,
      softGlow: 16,
      filmGrain: 0,
      vignette: 4,
      halftone: false,
      dateStamp: false,
    }
  },
  seoul_velvet: {
    id: 'seoul_velvet',
    name: 'Seoul Milk Velvet',
    badge: 'Populer',
    swatch: '#f472b6',
    tagline: 'Efek kulit porselen halus dengan tone lembut ala booth Hongdae',
    settings: {
      brightness: 5,
      contrast: 0,
      saturation: -2,
      warmth: 3,
      tint: 4,
      softGlow: 18,
      filmGrain: 0,
      vignette: 4,
      halftone: false,
      dateStamp: false,
    }
  },
  fujifilm_neg: {
    id: 'fujifilm_neg',
    name: 'Fujifilm Classic Neg',
    badge: 'Analog',
    swatch: '#10b981',
    tagline: 'Simulasi film Fuji dengan bayangan tegas & warna kulit hangat natural',
    settings: {
      brightness: 2,
      contrast: 8,
      saturation: 6,
      warmth: 10,
      tint: -2,
      softGlow: 10,
      filmGrain: 18,
      vignette: 10,
      halftone: false,
      dateStamp: true,
    }
  },
  portra_film: {
    id: 'portra_film',
    name: 'Kodak Portra 400',
    badge: '35mm Film',
    swatch: '#f59e0b',
    tagline: 'Tone warna emas analog 35mm, grain organik & kontras sinematik',
    settings: {
      brightness: 3,
      contrast: 6,
      saturation: 4,
      warmth: 14,
      tint: 2,
      softGlow: 12,
      filmGrain: 22,
      vignette: 12,
      halftone: false,
      dateStamp: true,
    }
  },
  digicam_y2k: {
    id: 'digicam_y2k',
    name: 'Y2K Cyber CCD Flash',
    badge: '2000s Cam',
    swatch: '#38bdf8',
    tagline: 'Simulasi kamera pocket tahun 2000-an, warna hidup & kontras tegas',
    settings: {
      brightness: 3,
      contrast: 8,
      saturation: 10,
      warmth: -4,
      tint: 4,
      softGlow: 12,
      filmGrain: 10,
      vignette: 8,
      halftone: false,
      dateStamp: true,
    }
  },
  vintage_newspaper: {
    id: 'vintage_newspaper',
    name: 'Leica Monochrom B&W',
    badge: 'Monochrome',
    swatch: '#334155',
    tagline: 'Hitam putih kontras tinggi nan elegan dengan tekstur titik klasik',
    settings: {
      brightness: 3,
      contrast: 16,
      saturation: -100,
      warmth: 0,
      tint: 0,
      softGlow: 8,
      filmGrain: 26,
      vignette: 14,
      halftone: true,
      dateStamp: false,
    }
  },
  moody_cinema: {
    id: 'moody_cinema',
    name: 'Cinema Crimson Noir',
    badge: 'Editorial',
    swatch: '#9f1239',
    tagline: 'Bayangan dalam dramatis, highlight lembut & atmosfer teater klasik',
    settings: {
      brightness: 0,
      contrast: 10,
      saturation: 8,
      warmth: 10,
      tint: 8,
      softGlow: 14,
      filmGrain: 18,
      vignette: 16,
      halftone: false,
      dateStamp: false,
    }
  },
  retro_90s: {
    id: 'retro_90s',
    name: '90s Disposable Cam',
    badge: 'Retro',
    swatch: '#ea580c',
    tagline: 'Warna golden hour hangat dengan tanggal kamera analog oranye',
    settings: {
      brightness: 3,
      contrast: 8,
      saturation: 10,
      warmth: 16,
      tint: -2,
      softGlow: 12,
      filmGrain: 22,
      vignette: 14,
      halftone: false,
      dateStamp: true,
    }
  }
};

export const DEFAULT_FILTER_SETTINGS = {
  ...PRESET_FILTERS.clean_studio.settings,
  customDate: "'26 10 13",
  aiAutoTone: true,
  aiSkinSmooth: false,
  aiStudioLight: false
};

const DEFAULT_TABLE = '0 0.063 0.125 0.188 0.25 0.313 0.375 0.438 0.5 0.563 0.625 0.688 0.75 0.813 0.875 0.938 1';

// Pure, Color-Neutral Gentle Exposure Curve:
// Never crushes blacks, never distorts colors, never over-processes good cameras (like iPhone).
// Only gently lifts midtones/shadows if the face is genuinely dark/backlit, or gently softens highlights if overexposed.
function evalGentleExposureCurve(v, gamma, shadowFill, highlightCompress) {
  const t = Math.min(1, Math.max(0, v / 255));

  // Gentle shadow fill only on mid-shadows (keeps true blacks at 0 and highlights untouched)
  const lifted = Math.min(1, t + shadowFill * t * (1 - t) * (1 - t) * 2.2);
  let out = Math.pow(lifted, gamma);

  // If background ceiling is bright while lifting face, gently hold back top highlights (> 0.75) so ceiling never blows out
  if (highlightCompress > 0 && t > 0.72) {
    const blend = ((t - 0.72) / 0.28) * highlightCompress;
    out = out * (1 - blend) + t * blend;
  }

  return Math.min(1, Math.max(0, out));
}

function buildGentleSvgTable(gamma, shadowFill, highlightCompress) {
  const pts = [];
  for (let i = 0; i <= 16; i++) {
    const v = (i / 16) * 255;
    const out = evalGentleExposureCurve(v, gamma, shadowFill, highlightCompress);
    pts.push(out.toFixed(3));
  }
  return pts.join(' ');
}

let analyzerCanvas = null;
let smoothedFaceLum = null;

export function analyzeVideoScene(videoEl, focusPoint = { x: 0.5, y: 0.5 }, manualAdjust = { exposure: 0, autoLight: true }) {
  if (!videoEl || !videoEl.videoWidth || !videoEl.videoHeight) {
    return {
      luminance: 58,
      status: 'OPTIMAL',
      label: 'AF • Kualitas Kamera Asli HD',
      boostNeeded: 0,
      contrastBoost: 0,
      saturationBoost: 0,
      gamma: 1.0,
      dehazeFloor: 0,
      tableR: DEFAULT_TABLE,
      tableG: DEFAULT_TABLE,
      tableB: DEFAULT_TABLE
    };
  }

  try {
    const sw = 64;
    const sh = 48;
    if (!analyzerCanvas) {
      analyzerCanvas = document.createElement('canvas');
      analyzerCanvas.width = sw;
      analyzerCanvas.height = sh;
    }
    const ctx = analyzerCanvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(videoEl, 0, 0, sw, sh);
    const { data } = ctx.getImageData(0, 0, sw, sh);

    let totalLum = 0;
    let focusLum = 0;
    let focusCount = 0;
    let midFocusLum = 0;
    let midFocusCount = 0;
    let brightPixels = 0;
    const pixelCount = data.length / 4;

    const fx = Math.round((focusPoint?.x ?? 0.5) * sw);
    const fy = Math.round((focusPoint?.y ?? 0.52) * sh);
    const boxRx = 15;
    const boxRy = 14;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const lum = Math.min(255, Math.max(0, Math.round(0.299 * r + 0.587 * g + 0.114 * b)));
      totalLum += lum;
      if (lum > 190) brightPixels++;

      const pxIndex = i / 4;
      const x = pxIndex % sw;
      const y = Math.floor(pxIndex / sw);
      if (Math.abs(x - fx) <= boxRx && Math.abs(y - fy) <= boxRy) {
        focusLum += lum;
        focusCount++;
        // Ignore bright ceiling lights (>180) and deep black hair (<25) when measuring face brightness
        if (lum >= 25 && lum <= 180) {
          midFocusLum += lum;
          midFocusCount++;
        }
      }
    }

    const avgLum = totalLum / pixelCount;
    const rawFocusLum = focusCount > 0 ? focusLum / focusCount : avgLum;
    const detectedFaceLum =
      focusCount > 0 && midFocusCount >= focusCount * 0.16
        ? midFocusLum / midFocusCount
        : rawFocusLum;

    if (smoothedFaceLum === null) {
      smoothedFaceLum = detectedFaceLum;
    } else {
      smoothedFaceLum = smoothedFaceLum * 0.65 + detectedFaceLum * 0.35;
    }

    const sFaceLum = smoothedFaceLum;
    const highlightRatio = brightPixels / pixelCount;
    const hasBacklight = highlightRatio > 0.15 && sFaceLum < 128;
    const autoEnabled = manualAdjust?.autoLight !== false;
    const userExp = manualAdjust?.exposure || 0; // -25 .. +25

    // Calculate gentle, non-destructive exposure parameters
    let gamma = 1.0;
    let shadowFill = 0;
    let highlightCompress = 0;

    if (autoEnabled) {
      if (sFaceLum < 122) {
        // Face is somewhat dark or backlit: gently lift shadows/midtones without washing out or changing colors
        const darkness = (122 - sFaceLum) / 122; // 0 .. ~0.7
        gamma = Math.max(0.76, 1.0 - darkness * 0.34);
        shadowFill = Math.min(0.18, darkness * 0.24);
        if (hasBacklight) {
          highlightCompress = 0.45;
        }
      } else if (sFaceLum > 168) {
        // Face is genuinely too bright/overexposed: gently tone down highlights
        const excess = (sFaceLum - 168) / 87;
        gamma = Math.min(1.18, 1.0 + excess * 0.24);
      }
    }

    // Apply user's manual Cahaya slider smoothly on top
    if (userExp !== 0) {
      gamma = Math.min(1.35, Math.max(0.65, gamma - (userExp / 25) * 0.22));
      if (userExp > 0) {
        shadowFill = Math.min(0.24, shadowFill + (userExp / 25) * 0.1);
      }
    }

    const tableStr = buildGentleSvgTable(gamma, shadowFill, highlightCompress);
    const sampleOut = evalGentleExposureCurve(sFaceLum, gamma, shadowFill, highlightCompress) * 255;
    const boostNeeded = Math.min(28, Math.max(-15, Math.round(((sampleOut - sFaceLum) / 255) * 100)));
    const lumPct = Math.round((sFaceLum / 255) * 100);

    let status = 'OPTIMAL';
    let label = 'AF • Kamera Natural HD';
    if (!autoEnabled) {
      label = 'AF • Mode Asli Kamera (Tanpa Auto)';
    } else if (hasBacklight) {
      status = 'LOW_LIGHT';
      label = 'AF • Penyeimbang Backlight Lembut';
    } else if (sFaceLum < 105) {
      status = 'LOW_LIGHT';
      label = 'AF • Pencerah Cahaya Natural';
    } else if (sFaceLum > 170) {
      status = 'BRIGHT';
      label = 'AF • Peredam Silau Natural';
    }

    return {
      luminance: lumPct,
      status,
      label,
      boostNeeded,
      contrastBoost: 0,
      saturationBoost: 0,
      gamma: Number(gamma.toFixed(2)),
      dehazeFloor: 0,
      tableR: tableStr,
      tableG: tableStr,
      tableB: tableStr
    };
  } catch (e) {
    return {
      luminance: 58,
      status: 'OPTIMAL',
      label: 'AF • Kamera Natural HD',
      boostNeeded: 0,
      contrastBoost: 0,
      saturationBoost: 0,
      gamma: 1.0,
      dehazeFloor: 0,
      tableR: DEFAULT_TABLE,
      tableG: DEFAULT_TABLE,
      tableB: DEFAULT_TABLE
    };
  }
}

// Non-Destructive, Color-True Exposure Adaptation for Captured Photos
// Preserves 100% of native iPhone/Smartphone sharpness and skin tones without gritty sharpening or color blotching.
export function processIntelligentCapture(ctx, width, height, options = {}) {
  if (!ctx || !width || !height) return;
  const {
    autoTone = true,
    focusPoint = { x: 0.5, y: 0.5 },
    manualAdjust = { exposure: 0, autoLight: true }
  } = options;

  const autoEnabled = autoTone && manualAdjust?.autoLight !== false;
  const userExp = manualAdjust?.exposure || 0;

  if (!autoEnabled && userExp === 0) {
    // 100% untouched native camera frame!
    return;
  }

  try {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    let sumLum = 0;
    let focusLum = 0;
    let focusCount = 0;
    let midFocusLum = 0;
    let midFocusCount = 0;
    let brightPixels = 0;

    const fx = Math.round((focusPoint?.x ?? 0.5) * width);
    const fy = Math.round((focusPoint?.y ?? 0.52) * height);
    const rx = Math.round(width * 0.25);
    const ry = Math.round(height * 0.25);

    const step = 4 * 12;
    for (let i = 0; i < data.length; i += step) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const lum = Math.min(255, Math.max(0, Math.round(0.299 * r + 0.587 * g + 0.114 * b)));
      sumLum += lum;
      if (lum > 190) brightPixels++;

      const pxIdx = i / 4;
      const x = pxIdx % width;
      const y = Math.floor(pxIdx / width);
      if (Math.abs(x - fx) <= rx && Math.abs(y - fy) <= ry) {
        focusLum += lum;
        focusCount++;
        if (lum >= 25 && lum <= 180) {
          midFocusLum += lum;
          midFocusCount++;
        }
      }
    }

    const totalSamples = Math.max(1, Math.floor(data.length / step));
    const avgLum = sumLum / totalSamples;
    const rawFocusLum = focusCount > 0 ? focusLum / focusCount : avgLum;
    const faceLum =
      focusCount > 0 && midFocusCount >= focusCount * 0.16
        ? midFocusLum / midFocusCount
        : rawFocusLum;

    const highlightRatio = brightPixels / totalSamples;
    const hasBacklight = highlightRatio > 0.15 && faceLum < 128;

    let gamma = 1.0;
    let shadowFill = 0;
    let highlightCompress = 0;

    if (autoEnabled) {
      if (faceLum < 122) {
        const darkness = (122 - faceLum) / 122;
        gamma = Math.max(0.76, 1.0 - darkness * 0.34);
        shadowFill = Math.min(0.18, darkness * 0.24);
        if (hasBacklight) {
          highlightCompress = 0.45;
        }
      } else if (faceLum > 168) {
        const excess = (faceLum - 168) / 87;
        gamma = Math.min(1.18, 1.0 + excess * 0.24);
      }
    }

    if (userExp !== 0) {
      gamma = Math.min(1.35, Math.max(0.65, gamma - (userExp / 25) * 0.22));
      if (userExp > 0) {
        shadowFill = Math.min(0.24, shadowFill + (userExp / 25) * 0.1);
      }
    }

    // If exposure needs virtually zero change (camera is already well-lit), keep 100% pure native pixels!
    if (Math.abs(gamma - 1.0) < 0.025 && shadowFill < 0.015) {
      return;
    }

    const lut = new Uint8ClampedArray(256);
    for (let v = 0; v < 256; v++) {
      lut[v] = Math.round(evalGentleExposureCurve(v, gamma, shadowFill, highlightCompress) * 255);
    }

    // Apply pure, identical RGB lookup table so there is ZERO hue/color/saturation shift!
    for (let i = 0; i < data.length; i += 4) {
      data[i] = lut[data[i]];
      data[i + 1] = lut[data[i + 1]];
      data[i + 2] = lut[data[i + 2]];
    }

    ctx.putImageData(imgData, 0, 0);
  } catch (e) {}
}

// Generates CSS filter string for live real-time preview (Webcam & Preview elements)
export function getCssFilterString(settings) {
  const s = settings || DEFAULT_FILTER_SETTINGS;
  const b = 1 + (s.brightness || 0) / 100;
  const c = 1 + (s.contrast || 0) / 100;
  const sat = 1 + (s.saturation || 0) / 100;

  // Sepia/warmth calculation
  const warmth = (s.warmth || 0);
  const sepia = warmth > 0 ? (warmth / 100) * 0.35 : 0;
  const hueRotate = (s.tint || 0) * 0.8;

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
    const dateText = s.customDate || "'26 10 13";
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

// Applies filters directly onto an HTML5 Canvas context
export function applyFiltersToCanvas(ctx, width, height, settings) {
  const s = settings || DEFAULT_FILTER_SETTINGS;
  drawPhotoWithFiltersToCanvas(ctx, ctx.canvas, 0, 0, width, height, 0, s);
}
