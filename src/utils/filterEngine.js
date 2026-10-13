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

// Helper: Build a 17-point normalized lookup table string for SVG <feComponentTransfer type="table">
function buildSvgTableString(blackCut, whitePoint, gamma, sCurveStrength, channelGain = 1.0) {
  const denom = Math.max(20, whitePoint - blackCut);
  const pts = [];
  for (let i = 0; i <= 16; i++) {
    const v = (i / 16) * 255;
    let t = Math.min(1, Math.max(0, (v - blackCut) / denom));
    let g = Math.pow(t, gamma);
    const s = g * g * (3 - 2 * g);
    let out = s * sCurveStrength + g * (1 - sCurveStrength);
    out = Math.min(1, Math.max(0, out * channelGain));
    pts.push(out.toFixed(3));
  }
  return pts.join(' ');
}

const DEFAULT_TABLE = '0 0.063 0.125 0.188 0.25 0.313 0.375 0.438 0.5 0.563 0.625 0.688 0.75 0.813 0.875 0.938 1';

// Real-time Intelligent Camera Scene Analyzer + 17-Point Auto-Dehaze & S-Curve LUT Generator
let analyzerCanvas = null;
let smoothedState = null;

export function analyzeVideoScene(videoEl, focusPoint = { x: 0.5, y: 0.5 }, manualAdjust = { exposure: 0, dehaze: 0 }) {
  if (!videoEl || !videoEl.videoWidth || !videoEl.videoHeight) {
    return {
      luminance: 55,
      status: 'OPTIMAL',
      label: 'AF • Auto-Cahaya Aktif',
      boostNeeded: 0,
      contrastBoost: 8,
      saturationBoost: 10,
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
    let sumR = 0;
    let sumG = 0;
    let sumB = 0;
    let colorSamples = 0;
    const hist = new Uint16Array(256);
    const pixelCount = data.length / 4;

    // Focus region around user's tap point or center face area
    const fx = Math.round((focusPoint?.x ?? 0.5) * sw);
    const fy = Math.round((focusPoint?.y ?? 0.48) * sh);
    const boxRx = 14;
    const boxRy = 13;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const lum = Math.min(255, Math.max(0, Math.round(0.299 * r + 0.587 * g + 0.114 * b)));
      hist[lum]++;
      totalLum += lum;

      if (lum > 30 && lum < 230) {
        sumR += r;
        sumG += g;
        sumB += b;
        colorSamples++;
      }

      const pxIndex = i / 4;
      const x = pxIndex % sw;
      const y = Math.floor(pxIndex / sw);
      if (Math.abs(x - fx) <= boxRx && Math.abs(y - fy) <= boxRy) {
        focusLum += lum;
        focusCount++;
      }
    }

    // Find 4th-percentile (black floor), 12th-percentile, and 98th-percentile (white ceiling)
    let acc = 0;
    let p04 = 0;
    let p12 = 0;
    let p98 = 250;
    let found04 = false;
    let found12 = false;
    const t04 = pixelCount * 0.04;
    const t12 = pixelCount * 0.12;
    const t98 = pixelCount * 0.98;

    for (let v = 0; v < 256; v++) {
      acc += hist[v];
      if (!found04 && acc >= t04) {
        p04 = v;
        found04 = true;
      }
      if (!found12 && acc >= t12) {
        p12 = v;
        found12 = true;
      }
      if (acc >= t98) {
        p98 = v;
        break;
      }
    }

    const avgLum = totalLum / pixelCount;
    const rawFocusLum = focusCount > 0 ? focusLum / focusCount : avgLum;
    // Blend 60% focus region + 40% global scene so clicking a bright background wall never ruins face metering
    const subjectLum = rawFocusLum * 0.6 + avgLum * 0.4;

    // Temporal smoothing (EMA) so live camera preview transitions smoothly without flickering
    if (!smoothedState) {
      smoothedState = { p04, p12, p98, subjectLum, avgLum };
    } else {
      smoothedState.p04 = smoothedState.p04 * 0.65 + p04 * 0.35;
      smoothedState.p12 = smoothedState.p12 * 0.65 + p12 * 0.35;
      smoothedState.p98 = smoothedState.p98 * 0.65 + p98 * 0.35;
      smoothedState.subjectLum = smoothedState.subjectLum * 0.65 + subjectLum * 0.35;
      smoothedState.avgLum = smoothedState.avgLum * 0.65 + avgLum * 0.35;
    }

    const sp04 = smoothedState.p04;
    const sp12 = smoothedState.p12;
    const sp98 = smoothedState.p98;
    const sSubLum = smoothedState.subjectLum;

    // 1. True Black-Floor Dehaze: strips away milky webcam lens fog (even when darkest pixel is 110/255!)
    const userDehazeOffset = (manualAdjust?.dehaze || 0) * 0.9;
    const rawBlackCut = sp04 * 0.82 + Math.max(0, sp12 - 22) * 0.18 - 5 + userDehazeOffset;
    const blackCut = Math.min(130, Math.max(0, rawBlackCut));

    // 2. Clean White-Point Ceiling: guarantees whites stay crisp 255 (NEVER murky grey!)
    const whitePoint = Math.max(blackCut + 75, Math.min(253, sp98 * 0.97));

    // 3. Closed-Form Target Face Gamma: places the subject face at ideal studio luminance (0.57)
    const userExpOffset = (manualAdjust?.exposure || 0) / 160; // -0.25 .. +0.25
    const targetMid = Math.min(0.76, Math.max(0.38, 0.57 + userExpOffset));
    const midNorm = Math.min(0.86, Math.max(0.14, (sSubLum - blackCut) / Math.max(30, whitePoint - blackCut)));
    const gamma = Math.min(1.58, Math.max(0.62, Math.log(targetMid) / Math.log(midNorm)));

    // 4. Filmic S-Curve & Auto White Balance (neutralizes cold green/blue office lights & warms skin)
    const isHazyOrBright = sp04 > 34 || sSubLum > 152;
    const sCurveStrength = isHazyOrBright ? 0.34 : 0.22;

    let gainR = 1.03;
    let gainG = 1.0;
    let gainB = 0.98;
    if (colorSamples > 40) {
      const avgR = sumR / colorSamples;
      const avgG = sumG / colorSamples;
      const avgB = sumB / colorSamples;
      const gray = (avgR + avgG + avgB) / 3;
      gainR = Math.min(1.09, Math.max(0.95, (gray / Math.max(1, avgR)) * 1.03));
      gainG = Math.min(1.04, Math.max(0.95, gray / Math.max(1, avgG)));
      gainB = Math.min(1.06, Math.max(0.92, (gray / Math.max(1, avgB)) * 0.98));
    }

    const tableR = buildSvgTableString(blackCut, whitePoint, gamma, sCurveStrength, gainR);
    const tableG = buildSvgTableString(blackCut, whitePoint, gamma, sCurveStrength, gainG);
    const tableB = buildSvgTableString(blackCut, whitePoint, gamma, sCurveStrength, gainB);

    // 5. Adaptive Saturation Recovery: optical fog dilutes colors, so restore vibrant saturation proportionally
    const fogAmountPct = Math.round((blackCut / 255) * 100);
    const saturationBoost = Math.min(44, Math.max(10, 10 + Math.round(fogAmountPct * 0.95)));
    const lumPct = Math.round((sSubLum / 255) * 100);

    let status = 'OPTIMAL';
    let label = 'AF • Studio Auto-Jernih';
    if (sp04 > 38 || lumPct > 62) {
      status = 'BRIGHT';
      label = 'AF • Anti-Kabut & Anti-Silau Aktif';
    } else if (lumPct < 42) {
      status = 'LOW_LIGHT';
      label = 'AF • Night Low-Light Boost Aktif';
    }

    return {
      luminance: lumPct,
      status,
      label,
      boostNeeded: 0,
      contrastBoost: 8,
      saturationBoost,
      gamma: Number(gamma.toFixed(2)),
      dehazeFloor: Number((blackCut / 255).toFixed(3)),
      tableR,
      tableG,
      tableB
    };
  } catch (e) {
    return {
      luminance: 55,
      status: 'OPTIMAL',
      label: 'AF • Studio Auto-Jernih',
      boostNeeded: 0,
      contrastBoost: 8,
      saturationBoost: 10,
      gamma: 1.0,
      dehazeFloor: 0,
      tableR: DEFAULT_TABLE,
      tableG: DEFAULT_TABLE,
      tableB: DEFAULT_TABLE
    };
  }
}

// Adaptive Computational Photography ISP (Matches Live 17-Point Auto-Dehaze & S-Curve + Saturation Recovery)
export function processIntelligentCapture(ctx, width, height, options = {}) {
  if (!ctx || !width || !height) return;
  const {
    autoTone = true,
    skinSmooth = true,
    studioLight = true,
    autoFocusSharpen = true,
    focusPoint = { x: 0.5, y: 0.45 },
    manualAdjust = { exposure: 0, dehaze: 0 }
  } = options;

  let isOverexposedScene = false;
  let isDarkScene = false;

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

      const hist = new Uint32Array(256);
      const fx = Math.round((focusPoint?.x ?? 0.5) * width);
      const fy = Math.round((focusPoint?.y ?? 0.45) * height);
      const rx = Math.round(width * 0.25);
      const ry = Math.round(height * 0.25);

      const step = 4 * 10;
      for (let i = 0; i < data.length; i += step) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const lum = Math.min(255, Math.max(0, Math.round(0.299 * r + 0.587 * g + 0.114 * b)));
        hist[lum]++;

        if (lum > 25 && lum < 232) {
          sumR += r;
          sumG += g;
          sumB += b;
          sampleCount++;
        }
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
      const rawFocusLum = focusCount > 0 ? focusLum / focusCount : avgLum;
      const subjectLum = rawFocusLum * 0.6 + avgLum * 0.4;

      let acc = 0;
      let p04 = 0;
      let p12 = 0;
      let p98 = 250;
      let found04 = false;
      let found12 = false;
      const t04 = totalSamples * 0.04;
      const t12 = totalSamples * 0.12;
      const t98 = totalSamples * 0.98;

      for (let v = 0; v < 256; v++) {
        acc += hist[v];
        if (!found04 && acc >= t04) {
          p04 = v;
          found04 = true;
        }
        if (!found12 && acc >= t12) {
          p12 = v;
          found12 = true;
        }
        if (acc >= t98) {
          p98 = v;
          break;
        }
      }

      const userDehazeOffset = (manualAdjust?.dehaze || 0) * 0.9;
      const blackCut = Math.min(130, Math.max(0, p04 * 0.82 + Math.max(0, p12 - 22) * 0.18 - 5 + userDehazeOffset));
      const whitePoint = Math.max(blackCut + 75, Math.min(253, p98 * 0.97));

      const userExpOffset = (manualAdjust?.exposure || 0) / 160;
      const targetMid = Math.min(0.76, Math.max(0.38, 0.57 + userExpOffset));
      const midNorm = Math.min(0.86, Math.max(0.14, (subjectLum - blackCut) / Math.max(30, whitePoint - blackCut)));
      const gamma = Math.min(1.58, Math.max(0.62, Math.log(targetMid) / Math.log(midNorm)));

      isOverexposedScene = p04 > 34 || subjectLum > 152;
      isDarkScene = subjectLum < 105 && p04 < 25;
      const sCurveStrength = isOverexposedScene ? 0.34 : 0.22;

      let gainR = 1.03;
      let gainG = 1.0;
      let gainB = 0.98;
      if (sampleCount > 50) {
        const avgR = sumR / sampleCount;
        const avgG = sumG / sampleCount;
        const avgB = sumB / sampleCount;
        const gray = (avgR + avgG + avgB) / 3;
        gainR = Math.min(1.09, Math.max(0.95, (gray / Math.max(1, avgR)) * 1.03));
        gainG = Math.min(1.04, Math.max(0.95, gray / Math.max(1, avgG)));
        gainB = Math.min(1.06, Math.max(0.92, (gray / Math.max(1, avgB)) * 0.98));
      }

      const lutR = new Uint8ClampedArray(256);
      const lutG = new Uint8ClampedArray(256);
      const lutB = new Uint8ClampedArray(256);
      const denom = Math.max(20, whitePoint - blackCut);

      for (let v = 0; v < 256; v++) {
        const t = Math.min(1, Math.max(0, (v - blackCut) / denom));
        const g = Math.pow(t, gamma);
        const sCurve = g * g * (3 - 2 * g);
        const norm = sCurve * sCurveStrength + g * (1 - sCurveStrength);
        const base = norm * 255;

        lutR[v] = Math.min(255, Math.max(0, Math.round(base * gainR)));
        lutG[v] = Math.min(255, Math.max(0, Math.round(base * gainG)));
        lutB[v] = Math.min(255, Math.max(0, Math.round(base * gainB)));
      }

      // Color saturation recovery factor to counter webcam fog desaturation
      const satFactor = 1 + Math.min(0.42, Math.max(0.08, (blackCut / 255) * 0.95));

      for (let i = 0; i < data.length; i += 4) {
        const nr = lutR[data[i]];
        const ng = lutG[data[i + 1]];
        const nb = lutB[data[i + 2]];
        const luma = 0.299 * nr + 0.587 * ng + 0.114 * nb;

        data[i] = Math.min(255, Math.max(0, Math.round(luma + (nr - luma) * satFactor)));
        data[i + 1] = Math.min(255, Math.max(0, Math.round(luma + (ng - luma) * satFactor)));
        data[i + 2] = Math.min(255, Math.max(0, Math.round(luma + (nb - luma) * satFactor)));
      }

      ctx.putImageData(imgData, 0, 0);
    } catch (e) {}
  }

  // STAGE 3: Sensor Chroma Noise Reduction & Skin Smoothing
  if (skinSmooth) {
    try {
      const offCanvas = document.createElement('canvas');
      offCanvas.width = Math.max(1, Math.round(width * 0.45));
      offCanvas.height = Math.max(1, Math.round(height * 0.45));
      const offCtx = offCanvas.getContext('2d');
      offCtx.drawImage(ctx.canvas, 0, 0, offCanvas.width, offCanvas.height);

      ctx.save();
      try {
        ctx.filter = `blur(${Math.max(2, Math.round(width * 0.005))}px)`;
      } catch (e) {}
      ctx.globalCompositeOperation = 'soft-light';
      ctx.globalAlpha = 0.14;
      ctx.drawImage(offCanvas, 0, 0, width, height);
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
