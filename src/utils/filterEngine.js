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

// Closed-Form Naka-Rushton Photoreceptor HDR & Optical Dehaze Curve:
// - When blackCut > 0 (foggy laptop webcam with ceiling glare like p04 = 80):
//   Strips away the milky veil, anchors hair/eyebrows at rich dark tones (p = 1.58 toe),
//   and expands face skin midtones up to bright studio luminance (0.62) while rolling off ceiling glare.
// - When blackCut == 0 (good camera like iPhone where p04 < 32):
//   Preserves 100% of true blacks and natural colors, gently lifting shadowed faces only when needed.
function evalNakaRushtonHdrCurve(v, blackCut, whitePoint, targetMid, pToe, mHalf) {
  const denom = Math.max(40, whitePoint - blackCut);
  const t = Math.min(1, Math.max(0, (v - blackCut) / denom));
  if (t <= 0) return 0;
  if (t >= 1) return 1;

  const tp = Math.pow(t, pToe);
  const mp = Math.pow(mHalf, pToe);
  const norm = (tp / (tp + mp)) * (1 + mp);
  return Math.min(1, Math.max(0, norm));
}

function buildNakaRushtonSvgTable(blackCut, whitePoint, targetMid, pToe, mHalf, channelGain = 1.0) {
  const pts = [];
  for (let i = 0; i <= 16; i++) {
    const v = (i / 16) * 255;
    let out = evalNakaRushtonHdrCurve(v, blackCut, whitePoint, targetMid, pToe, mHalf);
    out = Math.min(1, Math.max(0, out * channelGain));
    pts.push(out.toFixed(3));
  }
  return pts.join(' ');
}

let analyzerCanvas = null;
let smoothedState = null;

export function analyzeVideoScene(
  videoEl,
  focusPoint = { x: 0.5, y: 0.5 },
  manualAdjust = { exposure: 0, dehaze: 0, autoLight: true }
) {
  if (!videoEl || !videoEl.videoWidth || !videoEl.videoHeight) {
    return {
      luminance: 58,
      status: 'OPTIMAL',
      label: 'AF • Kamera Natural HD',
      boostNeeded: 0,
      contrastBoost: 0,
      saturationBoost: 0,
      gamma: 1.0,
      dehazeFloor: 0,
      isFoggyWebcam: false,
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
    let sumR = 0;
    let sumG = 0;
    let sumB = 0;
    let colorSamples = 0;

    const hist = new Uint16Array(256);
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
      hist[lum]++;
      totalLum += lum;
      if (lum > 190) brightPixels++;

      if (lum > 35 && lum < 205) {
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
        // Ignore bright ceiling lights (>182) and deep black hair (<25) when measuring face brightness
        if (lum >= 25 && lum <= 182) {
          midFocusLum += lum;
          midFocusCount++;
        }
      }
    }

    let acc = 0;
    let p03 = 0;
    let p12 = 0;
    let p98 = 250;
    let found03 = false;
    let found12 = false;
    const t03 = pixelCount * 0.03;
    const t12 = pixelCount * 0.12;
    const t98 = pixelCount * 0.98;

    for (let v = 0; v < 256; v++) {
      acc += hist[v];
      if (!found03 && acc >= t03) {
        p03 = v;
        found03 = true;
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
    const detectedFaceLum =
      focusCount > 0 && midFocusCount >= focusCount * 0.15
        ? midFocusLum / midFocusCount
        : rawFocusLum;

    if (!smoothedState) {
      smoothedState = { p03, p12, p98, faceLum: detectedFaceLum };
    } else {
      smoothedState.p03 = smoothedState.p03 * 0.6 + p03 * 0.4;
      smoothedState.p12 = smoothedState.p12 * 0.6 + p12 * 0.4;
      smoothedState.p98 = smoothedState.p98 * 0.6 + p98 * 0.4;
      smoothedState.faceLum = smoothedState.faceLum * 0.55 + detectedFaceLum * 0.45;
    }

    const sp03 = smoothedState.p03;
    const sp12 = smoothedState.p12;
    const sp98 = smoothedState.p98;
    const sFaceLum = smoothedState.faceLum;

    const autoEnabled = manualAdjust?.autoLight !== false;
    const userExp = manualAdjust?.exposure || 0; // -25 .. +25
    const userDehaze = manualAdjust?.dehaze || 0; // 0 .. 30

    if (!autoEnabled && userExp === 0 && userDehaze === 0) {
      return {
        luminance: Math.round((sFaceLum / 255) * 100),
        status: 'OPTIMAL',
        label: 'AF • Mode Asli Kamera',
        boostNeeded: 0,
        contrastBoost: 0,
        saturationBoost: 0,
        gamma: 1.0,
        dehazeFloor: 0,
        isFoggyWebcam: false,
        tableR: DEFAULT_TABLE,
        tableG: DEFAULT_TABLE,
        tableB: DEFAULT_TABLE
      };
    }

    // Detect whether the camera is suffering from Laptop Webcam Optical Glare/Fog (sp03 > 32)
    // vs a clean Smartphone/iPhone camera with true blacks (sp03 <= 32)
    const isFoggyWebcam = sp03 > 32 || userDehaze > 0;

    // 1. Optical Glare Floor (blackCut):
    // - On iPhone (sp03 ~ 10..25): autoBlackCut = 0 (never crushes shadows!)
    // - On Laptop Webcam with ceiling glare (sp03 ~ 75..90): strips away the milky veil!
    const autoBlackCut =
      autoEnabled && sp03 > 32
        ? Math.max(0, (sp03 - 14) * 0.85 + Math.max(0, sp12 - sp03) * 0.25)
        : 0;
    const blackCut = Math.min(115, Math.max(0, autoBlackCut + userDehaze * 1.1));
    const whitePoint = Math.max(blackCut + 85, Math.min(254, sp98 * 0.985));
    const denom = Math.max(50, whitePoint - blackCut);

    // 2. Closed-Form Naka-Rushton Parameters:
    // Calculate where the user's face sits after subtracting the glare floor
    const faceT = Math.min(0.82, Math.max(0.14, (sFaceLum - blackCut) / denom));
    const userExpOffset = (userExp / 25) * 0.16;

    // Target studio face luminance: ~0.60 on foggy webcams, or gentle nudge on clean cameras
    const rawTargetMid = isFoggyWebcam
      ? 0.60 + userExpOffset
      : Math.min(0.66, Math.max(0.48, faceT * 0.55 + 0.60 * 0.45 + userExpOffset));
    const targetMid = Math.min(0.78, Math.max(0.38, rawTargetMid));

    // Toe contrast exponent pToe:
    // On foggy webcams (blackCut > 20), pToe = 1.52..1.65 anchors hair/eyebrows dark while expanding skin midtones!
    // On clean iPhone cameras (blackCut == 0), pToe = 1.08 keeps gentle natural gradation.
    const fogRatio = Math.min(1, blackCut / 75);
    const pToe = 1.06 + fogRatio * 0.56;

    // Exact analytical half-saturation point mHalf so f(faceT) == targetMid
    const mHalf = Math.min(
      0.75,
      Math.max(0.10, faceT * Math.pow((1 - targetMid) / Math.max(0.08, targetMid), 1 / pToe))
    );

    // 3. Auto White Balance & Saturation Recovery (only active proportionally to webcam fog!)
    let gainR = 1.0 + fogRatio * 0.04;
    let gainG = 1.0;
    let gainB = 1.0 - fogRatio * 0.03;
    if (isFoggyWebcam && colorSamples > 40) {
      const avgR = sumR / colorSamples;
      const avgG = sumG / colorSamples;
      const avgB = sumB / colorSamples;
      const gray = (avgR + avgG + avgB) / 3;
      const wbR = Math.min(1.08, Math.max(0.96, (gray / Math.max(1, avgR)) * 1.04));
      const wbG = Math.min(1.02, Math.max(0.95, (gray / Math.max(1, avgG)) * 0.99));
      const wbB = Math.min(1.04, Math.max(0.92, (gray / Math.max(1, avgB)) * 0.97));
      gainR = 1.0 * (1 - fogRatio) + wbR * fogRatio;
      gainG = 1.0 * (1 - fogRatio) + wbG * fogRatio;
      gainB = 1.0 * (1 - fogRatio) + wbB * fogRatio;
    }

    const tableR = buildNakaRushtonSvgTable(blackCut, whitePoint, targetMid, pToe, mHalf, gainR);
    const tableG = buildNakaRushtonSvgTable(blackCut, whitePoint, targetMid, pToe, mHalf, gainG);
    const tableB = buildNakaRushtonSvgTable(blackCut, whitePoint, targetMid, pToe, mHalf, gainB);

    const sampleOut = evalNakaRushtonHdrCurve(sFaceLum, blackCut, whitePoint, targetMid, pToe, mHalf) * 255;
    const boostNeeded = Math.min(32, Math.max(-16, Math.round(((sampleOut - sFaceLum) / 255) * 100)));

    // Restore color saturation that was diluted by the webcam's white glare veil
    const saturationBoost = Math.round(fogRatio * 34);
    const contrastBoost = Math.round(fogRatio * 10);
    const lumPct = Math.round((sFaceLum / 255) * 100);

    let status = 'OPTIMAL';
    let label = 'AF • Kamera Natural HD';
    if (blackCut > 22) {
      status = 'BRIGHT';
      label = 'AF • Anti-Kabut & Penjernih Webcam Aktif';
    } else if (sFaceLum < 105) {
      status = 'LOW_LIGHT';
      label = 'AF • Pencerah Cahaya Natural';
    } else if (sFaceLum > 172) {
      status = 'BRIGHT';
      label = 'AF • Peredam Silau Natural';
    }

    return {
      luminance: lumPct,
      status,
      label,
      boostNeeded,
      contrastBoost,
      saturationBoost,
      gamma: Number(mHalf.toFixed(2)),
      dehazeFloor: Number((blackCut / 255).toFixed(3)),
      isFoggyWebcam,
      tableR,
      tableG,
      tableB
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
      isFoggyWebcam: false,
      tableR: DEFAULT_TABLE,
      tableG: DEFAULT_TABLE,
      tableB: DEFAULT_TABLE
    };
  }
}

// Adaptive Dual-Path Computational ISP for Captured Photos:
// - Path A (Clean Smartphone / iPhone Camera, p03 <= 32): Non-destructive, color-true gentle exposure.
// - Path B (Foggy Laptop Webcam with Ceiling Glare, p03 > 32): 2D Spatial Glare Subtraction + Naka-Rushton HDR Dehaze + Color Recovery.
export function processIntelligentCapture(ctx, width, height, options = {}) {
  if (!ctx || !width || !height) return;
  const {
    autoTone = true,
    focusPoint = { x: 0.5, y: 0.5 },
    manualAdjust = { exposure: 0, dehaze: 0, autoLight: true }
  } = options;

  const autoEnabled = autoTone && manualAdjust?.autoLight !== false;
  const userExp = manualAdjust?.exposure || 0;
  const userDehaze = manualAdjust?.dehaze || 0;

  if (!autoEnabled && userExp === 0 && userDehaze === 0) {
    return;
  }

  try {
    // First sample scene histogram & build a 32x24 2D spatial illumination map to detect & cancel uneven ceiling glare
    const gridW = 32;
    const gridH = 24;
    const smallCanvas = document.createElement('canvas');
    smallCanvas.width = gridW;
    smallCanvas.height = gridH;
    const smallCtx = smallCanvas.getContext('2d', { willReadFrequently: true });
    try {
      smallCtx.filter = 'blur(3px)';
    } catch (e) {}
    smallCtx.drawImage(ctx.canvas, 0, 0, gridW, gridH);
    const smallData = smallCtx.getImageData(0, 0, gridW, gridH).data;
    const illumGrid = new Float32Array(gridW * gridH);
    for (let idx = 0; idx < gridW * gridH; idx++) {
      const si = idx * 4;
      illumGrid[idx] = 0.299 * smallData[si] + 0.587 * smallData[si + 1] + 0.114 * smallData[si + 2];
    }

    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    let sumLum = 0;
    let focusLum = 0;
    let focusCount = 0;
    let midFocusLum = 0;
    let midFocusCount = 0;
    let sumR = 0;
    let sumG = 0;
    let sumB = 0;
    let colorSamples = 0;

    const hist = new Uint32Array(256);
    const fx = Math.round((focusPoint?.x ?? 0.5) * width);
    const fy = Math.round((focusPoint?.y ?? 0.52) * height);
    const rx = Math.round(width * 0.25);
    const ry = Math.round(height * 0.25);

    const step = 4 * 10;
    for (let i = 0; i < data.length; i += step) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const lum = Math.min(255, Math.max(0, Math.round(0.299 * r + 0.587 * g + 0.114 * b)));
      hist[lum]++;
      sumLum += lum;

      if (lum > 35 && lum < 205) {
        sumR += r;
        sumG += g;
        sumB += b;
        colorSamples++;
      }

      const pxIdx = i / 4;
      const x = pxIdx % width;
      const y = Math.floor(pxIdx / width);
      if (Math.abs(x - fx) <= rx && Math.abs(y - fy) <= ry) {
        focusLum += lum;
        focusCount++;
        if (lum >= 25 && lum <= 182) {
          midFocusLum += lum;
          midFocusCount++;
        }
      }
    }

    const totalSamples = Math.max(1, Math.floor(data.length / step));
    let acc = 0;
    let p03 = 0;
    let p12 = 0;
    let p98 = 250;
    let found03 = false;
    let found12 = false;
    const t03 = totalSamples * 0.03;
    const t12 = totalSamples * 0.12;
    const t98 = totalSamples * 0.98;

    for (let v = 0; v < 256; v++) {
      acc += hist[v];
      if (!found03 && acc >= t03) {
        p03 = v;
        found03 = true;
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

    const avgLum = sumLum / totalSamples;
    const rawFocusLum = focusCount > 0 ? focusLum / focusCount : avgLum;
    const faceLum =
      focusCount > 0 && midFocusCount >= focusCount * 0.15
        ? midFocusLum / midFocusCount
        : rawFocusLum;

    const isFoggyWebcam = p03 > 32 || userDehaze > 0;
    const autoBlackCut =
      autoEnabled && p03 > 32
        ? Math.max(0, (p03 - 14) * 0.85 + Math.max(0, p12 - p03) * 0.25)
        : 0;
    const blackCut = Math.min(115, Math.max(0, autoBlackCut + userDehaze * 1.1));
    const whitePoint = Math.max(blackCut + 85, Math.min(254, p98 * 0.985));
    const denom = Math.max(50, whitePoint - blackCut);

    const faceT = Math.min(0.82, Math.max(0.14, (faceLum - blackCut) / denom));
    const userExpOffset = (userExp / 25) * 0.16;
    const rawTargetMid = isFoggyWebcam
      ? 0.60 + userExpOffset
      : Math.min(0.66, Math.max(0.48, faceT * 0.55 + 0.60 * 0.45 + userExpOffset));
    const targetMid = Math.min(0.78, Math.max(0.38, rawTargetMid));

    const fogRatio = Math.min(1, blackCut / 75);
    const pToe = 1.06 + fogRatio * 0.56;
    const mHalf = Math.min(
      0.75,
      Math.max(0.10, faceT * Math.pow((1 - targetMid) / Math.max(0.08, targetMid), 1 / pToe))
    );

    // If clean camera (blackCut == 0) and exposure is already balanced, keep 100% pure native pixels!
    if (blackCut < 2 && Math.abs(targetMid - faceT) < 0.03 && userExp === 0) {
      return;
    }

    let gainR = 1.0 + fogRatio * 0.04;
    let gainG = 1.0;
    let gainB = 1.0 - fogRatio * 0.03;
    if (isFoggyWebcam && colorSamples > 50) {
      const avgR = sumR / colorSamples;
      const avgG = sumG / colorSamples;
      const avgB = sumB / colorSamples;
      const gray = (avgR + avgG + avgB) / 3;
      const wbR = Math.min(1.08, Math.max(0.96, (gray / Math.max(1, avgR)) * 1.04));
      const wbG = Math.min(1.02, Math.max(0.95, (gray / Math.max(1, avgG)) * 0.99));
      const wbB = Math.min(1.04, Math.max(0.92, (gray / Math.max(1, avgB)) * 0.97));
      gainR = 1.0 * (1 - fogRatio) + wbR * fogRatio;
      gainG = 1.0 * (1 - fogRatio) + wbG * fogRatio;
      gainB = 1.0 * (1 - fogRatio) + wbB * fogRatio;
    }

    const lutR = new Uint8ClampedArray(256);
    const lutG = new Uint8ClampedArray(256);
    const lutB = new Uint8ClampedArray(256);
    for (let v = 0; v < 256; v++) {
      const norm = evalNakaRushtonHdrCurve(v, blackCut, whitePoint, targetMid, pToe, mHalf) * 255;
      lutR[v] = Math.min(255, Math.max(0, Math.round(norm * gainR)));
      lutG[v] = Math.min(255, Math.max(0, Math.round(norm * gainG)));
      lutB[v] = Math.min(255, Math.max(0, Math.round(norm * gainB)));
    }

    // Proportional saturation recovery only for foggy webcams (1.0 on iPhone -> up to 1.36 on heavy webcam fog)
    const satFactor = 1.0 + fogRatio * 0.36;
    const spatialGlareStrength = fogRatio * 0.24;

    for (let y = 0; y < height; y++) {
      const gy = Math.min(gridH - 1, Math.floor((y / height) * gridH));
      const rowOffset = y * width * 4;
      for (let x = 0; x < width; x++) {
        const i = rowOffset + x * 4;
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        // 2D Spatial Ceiling Glare Subtraction (removes uneven overhead light haze bleeding across hair/forehead)
        if (spatialGlareStrength > 0.02) {
          const gx = Math.min(gridW - 1, Math.floor((x / width) * gridW));
          const localIllum = illumGrid[gy * gridW + gx];
          if (localIllum > faceLum + 8 && r < 238 && g < 238 && b < 238) {
            const excessGlare = (localIllum - faceLum) * spatialGlareStrength;
            r = Math.max(0, Math.round(r - excessGlare));
            g = Math.max(0, Math.round(g - excessGlare));
            b = Math.max(0, Math.round(b - excessGlare));
          }
        }

        const nr = lutR[r];
        const ng = lutG[g];
        const nb = lutB[b];

        if (satFactor > 1.01) {
          const luma = 0.299 * nr + 0.587 * ng + 0.114 * nb;
          data[i] = Math.min(255, Math.max(0, Math.round(luma + (nr - luma) * satFactor)));
          data[i + 1] = Math.min(255, Math.max(0, Math.round(luma + (ng - luma) * satFactor)));
          data[i + 2] = Math.min(255, Math.max(0, Math.round(luma + (nb - luma) * satFactor)));
        } else {
          data[i] = nr;
          data[i + 1] = ng;
          data[i + 2] = nb;
        }
      }
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
  const warmth = s.warmth || 0;
  const sepia = warmth > 0 ? (warmth / 100) * 0.35 : 0;
  const hueRotate = (s.tint || 0) * 0.8;

  if (b === 1 && c === 1 && sat === 1 && sepia === 0 && hueRotate === 0) {
    return 'none';
  }

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
  const filterStr = getCssFilterString(settings);
  return {
    filter: filterStr === 'none' ? undefined : filterStr
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
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

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

  // Draw base image with CSS filter only when active
  const filterStr = getCssFilterString(s);
  if (filterStr !== 'none') {
    try {
      ctx.filter = filterStr;
    } catch (e) {}
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
