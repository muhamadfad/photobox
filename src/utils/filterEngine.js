// Aesthetic Filter & Intelligent Camera ISP Engine for Phone Cameras & Photobooths
// Turns flat/noisy smartphone & laptop webcam captures into studio-grade Korean photobooth portraits.

export const PRESET_FILTERS = {
  clean_studio: {
    id: 'clean_studio',
    name: 'Clean Studio Pro',
    badge: 'Auto HD',
    swatch: '#6366f1',
    tagline: 'Pencahayaan studio seimbang, detail tajam & warna kulit natural',
    settings: {
      brightness: 0,
      contrast: 6,
      saturation: 4,
      warmth: 2,
      tint: 1,
      softGlow: 12,
      filmGrain: 0,
      vignette: 8,
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
      brightness: 3,
      contrast: 4,
      saturation: 8,
      warmth: 5,
      tint: 5,
      softGlow: 24,
      filmGrain: 6,
      vignette: 12,
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
      brightness: 4,
      contrast: 2,
      saturation: -2,
      warmth: 4,
      tint: 6,
      softGlow: 28,
      filmGrain: 6,
      vignette: 14,
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
      brightness: 0,
      contrast: 14,
      saturation: 8,
      warmth: 12,
      tint: -3,
      softGlow: 15,
      filmGrain: 26,
      vignette: 22,
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
      brightness: 0,
      contrast: 10,
      saturation: 2,
      warmth: 16,
      tint: 3,
      softGlow: 18,
      filmGrain: 32,
      vignette: 24,
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
      brightness: 2,
      contrast: 16,
      saturation: 14,
      warmth: -6,
      tint: 6,
      softGlow: 20,
      filmGrain: 16,
      vignette: 18,
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
      brightness: 0,
      contrast: 26,
      saturation: -100,
      warmth: 0,
      tint: 0,
      softGlow: 12,
      filmGrain: 38,
      vignette: 28,
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
      brightness: -4,
      contrast: 20,
      saturation: 10,
      warmth: 12,
      tint: 10,
      softGlow: 20,
      filmGrain: 28,
      vignette: 38,
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
      brightness: 0,
      contrast: 14,
      saturation: 14,
      warmth: 22,
      tint: -4,
      softGlow: 16,
      filmGrain: 34,
      vignette: 30,
      halftone: false,
      dateStamp: true,
    }
  }
};

export const DEFAULT_FILTER_SETTINGS = {
  ...PRESET_FILTERS.clean_studio.settings,
  customDate: "'26 10 13",
  aiAutoTone: true,
  aiSkinSmooth: true,
  aiStudioLight: true
};

// Real-time Intelligent Camera Scene Analyzer (Bi-Directional Auto-Exposure: Dark Boost + Bright/Backlight Anti-Glare)
let analyzerCanvas = null;
export function analyzeVideoScene(videoEl, focusPoint = { x: 0.5, y: 0.5 }) {
  if (!videoEl || !videoEl.videoWidth || !videoEl.videoHeight) {
    return {
      luminance: 55,
      status: 'OPTIMAL',
      label: 'AF • Auto-Cahaya Terkunci',
      boostNeeded: 0,
      contrastBoost: 6,
      saturationBoost: 4
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
    let overexposedPixels = 0;
    let darkPixels = 0;
    const pixelCount = data.length / 4;

    // Focus region around user's tap point or center face area
    const fx = Math.round((focusPoint?.x ?? 0.5) * sw);
    const fy = Math.round((focusPoint?.y ?? 0.5) * sh);
    const boxRx = 14;
    const boxRy = 12;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      totalLum += lum;

      if (lum > 210) overexposedPixels++;
      if (lum < 50) darkPixels++;

      const pxIndex = i / 4;
      const x = pxIndex % sw;
      const y = Math.floor(pxIndex / sw);
      if (Math.abs(x - fx) <= boxRx && Math.abs(y - fy) <= boxRy) {
        focusLum += lum;
        focusCount++;
      }
    }

    const avgLum = totalLum / pixelCount;
    const avgFocusLum = focusCount > 0 ? focusLum / focusCount : avgLum;
    const lumPct = Math.round((avgFocusLum / 255) * 100);
    const globalLumPct = Math.round((avgLum / 255) * 100);
    const overexposedPct = Math.round((overexposedPixels / pixelCount) * 100);

    // CASE 1: TOO BRIGHT / OVEREXPOSED / STRONG BACKLIGHT GLARE (like washed-out webcam in bright room)
    // Pull brightness DOWN and boost contrast/dehaze strongly so face & background aren't white!
    if (lumPct > 62 || globalLumPct > 66 || overexposedPct > 24) {
      const excess = Math.max(lumPct - 54, globalLumPct - 56, overexposedPct - 10);
      const darken = -Math.min(34, Math.max(12, Math.round(excess * 0.85)));
      const contrastUp = Math.min(32, Math.max(16, Math.round(excess * 0.75)));
      return {
        luminance: lumPct,
        status: 'BRIGHT',
        label: `Anti-Silau & Backlight (${darken}%)`,
        boostNeeded: darken,
        contrastBoost: contrastUp,
        saturationBoost: 10
      };
    }

    // CASE 2: BACKLIT SILHOUETTE (Background is bright, but face in focus box is genuinely dark < 45%)
    if (globalLumPct - lumPct > 16 && lumPct < 45) {
      const lift = Math.min(18, Math.max(6, Math.round((50 - lumPct) * 0.7)));
      return {
        luminance: lumPct,
        status: 'BACKLIT',
        label: `HDR Backlight Balance (+${lift}%)`,
        boostNeeded: lift,
        contrastBoost: 16,
        saturationBoost: 8
      };
    }

    // CASE 3: DARK / LOW-LIGHT ROOM (Face is genuinely dark < 42% and scene isn't overexposed)
    if (lumPct < 42) {
      const boost = Math.min(28, Math.max(8, Math.round((50 - lumPct) * 0.85)));
      return {
        luminance: lumPct,
        status: 'LOW_LIGHT',
        label: `Night Low-Light Boost (+${boost}%)`,
        boostNeeded: boost,
        contrastBoost: 10,
        saturationBoost: 8
      };
    }

    // CASE 4: BALANCED / NORMAL LIGHTING (42% - 62%) -> Do not over-brighten!
    return {
      luminance: lumPct,
      status: 'OPTIMAL',
      label: 'AF • Cahaya Seimbang',
      boostNeeded: 0,
      contrastBoost: 6,
      saturationBoost: 4
    };
  } catch (e) {
    return {
      luminance: 55,
      status: 'OPTIMAL',
      label: 'AF • Cahaya Seimbang',
      boostNeeded: 0,
      contrastBoost: 6,
      saturationBoost: 4
    };
  }
}

// Adaptive Computational Photography ISP
// Automatically darkens/dehazes washed-out/backlit webcams AND brightens dark low-light cameras
export function processIntelligentCapture(ctx, width, height, options = {}) {
  if (!ctx || !width || !height) return;
  const {
    autoTone = true,
    skinSmooth = true,
    studioLight = true,
    autoFocusSharpen = true,
    focusPoint = { x: 0.5, y: 0.45 }
  } = options;

  let isOverexposedScene = false;
  let isDarkScene = false;

  // STAGE 1 & 2: Bi-Directional Auto-Exposure (Anti-Glare Highlight Recovery OR Low-Light Shadow Lift) + Dehaze
  if (autoTone) {
    try {
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;

      let sumR = 0;
      let sumG = 0;
      let sumB = 0;
      let sumLum = 0;
      let focusLum = 0;
      let focusCount = 0;
      let sampleCount = 0;
      let brightCount = 0;

      // Histogram bins (0..255) to find true black floor (10th percentile) for dehazing milky webcams
      const hist = new Uint32Array(256);

      const fx = Math.round((focusPoint?.x ?? 0.5) * width);
      const fy = Math.round((focusPoint?.y ?? 0.45) * height);
      const rx = Math.round(width * 0.25);
      const ry = Math.round(height * 0.25);

      const step = 4 * 12;
      for (let i = 0; i < data.length; i += step) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const lum = Math.min(255, Math.max(0, Math.round(0.299 * r + 0.587 * g + 0.114 * b)));
        hist[lum]++;

        if (lum > 20 && lum < 235) {
          sumR += r;
          sumG += g;
          sumB += b;
          sampleCount++;
        }
        if (lum > 210) brightCount++;
        sumLum += lum;

        const pxIdx = i / 4;
        const x = pxIdx % width;
        const y = Math.floor(pxIdx / width);
        if (Math.abs(x - fx) <= rx && Math.abs(y - fy) <= ry) {
          focusLum += lum;
          focusCount++;
        }
      }

      const totalSamples = Math.max(1, Math.floor(data.length / step));
      const avgLum = sumLum / totalSamples;
      const subjectLum = focusCount > 0 ? focusLum / focusCount : avgLum;
      const overexposedRatio = brightCount / totalSamples;

      // Find 8th percentile luminance (black point floor) to remove milky webcam haze
      let acc = 0;
      let p08 = 0;
      const targetP08 = totalSamples * 0.08;
      for (let v = 0; v < 256; v++) {
        acc += hist[v];
        if (acc >= targetP08) {
          p08 = v;
          break;
        }
      }

      isOverexposedScene = subjectLum > 152 || avgLum > 160 || overexposedRatio > 0.22;
      isDarkScene = subjectLum < 108 && overexposedRatio < 0.15;

      // Gentle Auto White Balance
      let gainR = 1.01;
      let gainG = 1.0;
      let gainB = 1.0;
      if (sampleCount > 50) {
        const avgR = sumR / sampleCount;
        const avgG = sumG / sampleCount;
        const avgB = sumB / sampleCount;
        const gray = (avgR + avgG + avgB) / 3;
        gainR = Math.min(1.10, Math.max(0.92, (gray / Math.max(1, avgR)) * 1.02));
        gainG = Math.min(1.06, Math.max(0.94, (gray / Math.max(1, avgG))));
        gainB = Math.min(1.10, Math.max(0.92, (gray / Math.max(1, avgB))));
      }

      // Compute Bi-Directional Gamma & Black Floor Dehaze:
      // - If TOO BRIGHT / BACKLIT: gamma > 1.0 (1.18..1.52) pulls down glare + black-point dehaze restores contrast!
      // - If DARK: gamma < 1.0 (0.72..0.92) lifts dark shadows cleanly!
      // - If NORMAL: gamma ~ 1.0
      let gamma = 1.0;
      let blackFloor = 0;
      let sCurveStrength = 0.22;

      if (isOverexposedScene) {
        const excess = Math.max(0, subjectLum - 135, avgLum - 140, overexposedRatio * 180);
        gamma = Math.min(1.52, 1.15 + (excess / 120) * 0.37);
        blackFloor = Math.min(48, Math.max(10, Math.round(p08 * 0.65)));
        sCurveStrength = 0.38;
      } else if (isDarkScene) {
        gamma = Math.max(0.72, 0.94 - ((110 - subjectLum) / 110) * 0.24);
        blackFloor = Math.min(12, Math.round(p08 * 0.3));
        sCurveStrength = 0.22;
      } else {
        gamma = 1.02;
        blackFloor = Math.min(18, Math.round(p08 * 0.4));
        sCurveStrength = 0.20;
      }

      const lutR = new Uint8ClampedArray(256);
      const lutG = new Uint8ClampedArray(256);
      const lutB = new Uint8ClampedArray(256);
      const denom = Math.max(1, 255 - blackFloor);

      for (let v = 0; v < 256; v++) {
        // Subtract milky haze floor
        const dehazed = Math.max(0, (v - blackFloor) / denom);
        let norm = Math.pow(dehazed, gamma);

        // Compress blown highlights softly when scene is overexposed
        if (isOverexposedScene && norm > 0.75) {
          norm = 0.75 + (norm - 0.75) * 0.72;
        }

        // Filmic contrast S-curve
        const sCurve = norm * norm * (3 - 2 * norm);
        norm = sCurve * sCurveStrength + norm * (1 - sCurveStrength);
        const base = Math.min(255, Math.max(0, norm * 255));

        lutR[v] = Math.min(255, Math.max(0, Math.round(base * gainR)));
        lutG[v] = Math.min(255, Math.max(0, Math.round(base * gainG)));
        lutB[v] = Math.min(255, Math.max(0, Math.round(base * gainB)));
      }

      for (let i = 0; i < data.length; i += 4) {
        data[i] = lutR[data[i]];
        data[i + 1] = lutG[data[i + 1]];
        data[i + 2] = lutB[data[i + 2]];
      }

      ctx.putImageData(imgData, 0, 0);
    } catch (e) {
      // Fallback if pixel read fails
    }
  }

  // STAGE 3: Sensor Chroma Noise Reduction & Skin Smoothing (Never uses 'screen' on bright images!)
  if (skinSmooth) {
    try {
      const offCanvas = document.createElement('canvas');
      offCanvas.width = Math.max(1, Math.round(width * 0.45));
      offCanvas.height = Math.max(1, Math.round(height * 0.45));
      const offCtx = offCanvas.getContext('2d');
      offCtx.drawImage(ctx.canvas, 0, 0, offCanvas.width, offCanvas.height);

      ctx.save();
      try {
        ctx.filter = `blur(${Math.max(2, Math.round(width * 0.006))}px)`;
      } catch (e) {}

      if (isOverexposedScene) {
        // In bright/overexposed scenes, use multiply + soft-light to recover rich skin tone & reduce glare
        ctx.globalCompositeOperation = 'multiply';
        ctx.globalAlpha = 0.14;
        ctx.drawImage(offCanvas, 0, 0, width, height);
      } else {
        ctx.globalCompositeOperation = 'soft-light';
        ctx.globalAlpha = 0.18;
        ctx.drawImage(offCanvas, 0, 0, width, height);
      }
      ctx.restore();
    } catch (e) {}
  }

  // STAGE 4: Optical Auto-Focus Clarity & Edge Sharpening
  if (autoFocusSharpen) {
    try {
      const srcData = ctx.getImageData(0, 0, width, height);
      const src = srcData.data;
      const outData = ctx.createImageData(width, height);
      const dst = outData.data;

      const amount = 0.38;
      const w4 = width * 4;

      for (let y = 0; y < height; y++) {
        const yOffset = y * w4;
        const isEdgeY = y === 0 || y === height - 1;
        for (let x = 0; x < width; x++) {
          const idx = yOffset + x * 4;
          if (isEdgeY || x === 0 || x === width - 1) {
            dst[idx] = src[idx];
            dst[idx + 1] = src[idx + 1];
            dst[idx + 2] = src[idx + 2];
            dst[idx + 3] = src[idx + 3];
            continue;
          }

          for (let c = 0; c < 3; c++) {
            const center = src[idx + c];
            const blur =
              (src[idx - w4 + c] +
                src[idx + w4 + c] +
                src[idx - 4 + c] +
                src[idx + 4 + c]) *
              0.25;
            const diff = center - blur;
            const edge = Math.abs(diff) > 3 ? diff * amount : 0;
            dst[idx + c] = Math.min(255, Math.max(0, Math.round(center + edge)));
          }
          dst[idx + 3] = src[idx + 3];
        }
      }
      ctx.putImageData(outData, 0, 0);
    } catch (e) {}
  }

  // STAGE 5: Subtle Edge Framing (Only adds key-light fill if the room is actually dark)
  if (studioLight) {
    try {
      ctx.save();
      const cx = width * (focusPoint?.x ?? 0.5);
      const cy = height * (focusPoint?.y ?? 0.45);
      const radius = Math.max(width, height) * 0.7;

      ctx.globalCompositeOperation = 'soft-light';
      const keyGrad = ctx.createRadialGradient(cx, cy, radius * 0.1, cx, cy, radius);
      keyGrad.addColorStop(0, isDarkScene ? 'rgba(255, 248, 244, 0.25)' : 'rgba(255, 248, 244, 0.04)');
      keyGrad.addColorStop(0.65, 'rgba(0, 0, 0, 0)');
      keyGrad.addColorStop(1, 'rgba(10, 8, 12, 0.18)');
      ctx.fillStyle = keyGrad;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    } catch (e) {}
  }
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
