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
const IDENTITY_COLOR_MATRIX = '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0';

// Smooth, bounded-slope (max derivative <= 1.50) tone curve:
// - When fogRatio == 0 (clean iPhone/smartphone camera where p03 <= 32):
//   Preserves 100% native blacks and highlights, applying only a gentle gamma nudge if the face is dark/bright.
// - When fogRatio > 0 (foggy laptop webcam under ceiling light where p03 > 32):
//   Deepens foggy gray hair (0.32 -> 0.23), gently lifts shadowed face skin (0.45 -> 0.51),
//   and HOLDS bright office background walls (0.80 -> 0.82) so backgrounds NEVER blow out to white
//   and skin shadows NEVER split into yellow/orange!
const WEBCAM_XP = [0.0, 0.18, 0.32, 0.42, 0.52, 0.65, 0.80, 1.0];
const WEBCAM_YP = [0.0, 0.08, 0.23, 0.44, 0.59, 0.72, 0.83, 0.98];

function evalBoundedDehazeCurve(normX, fogRatio, gammaClean = 1.0, userExpOffset = 0) {
  const x = Math.min(1, Math.max(0, normX));
  if (x <= 0) return 0;
  if (x >= 1) return 1;

  // Clean camera curve (gentle gamma)
  const yClean = Math.pow(x, gammaClean);

  // Piecewise linear interpolation on the bounded-slope webcam dehaze & highlight-hold curve
  let yWebcam = x;
  for (let k = 0; k < WEBCAM_XP.length - 1; k++) {
    const x0 = WEBCAM_XP[k];
    const x1 = WEBCAM_XP[k + 1];
    if (x >= x0 && x <= x1) {
      const t = (x - x0) / Math.max(1e-5, x1 - x0);
      yWebcam = WEBCAM_YP[k] + t * (WEBCAM_YP[k + 1] - WEBCAM_YP[k]);
      break;
    }
  }

  let y = yClean * (1 - fogRatio) + yWebcam * fogRatio;
  if (Math.abs(userExpOffset) > 0.001) {
    // Apply manual exposure slider smoothly in midtones without clipping black or white
    y += userExpOffset * 4 * x * (1 - x);
  }
  return Math.min(1, Math.max(0, y));
}

function buildNeutralSvgTable(fogRatio, gammaClean, userExpOffset) {
  const pts = [];
  for (let i = 0; i <= 16; i++) {
    const x = i / 16;
    const y = evalBoundedDehazeCurve(x, fogRatio, gammaClean, userExpOffset);
    pts.push(y.toFixed(3));
  }
  return pts.join(' ');
}

// Builds a Row-Sum = 1.0 3x3 Color Matrix (plus SVG 4x5 string) that:
// 1. Is 100% neutral-preserving: M * [v, v, v]^T = [v, v, v]^T for all v (black hair, gray shadows, white shirts & walls never get tinted!).
// 2. Cancels per-channel S-curve chroma inflation (s = 1 - 0.24 * fogRatio).
// 3. Neutralizes fluorescent webcam yellow-green skin cast (where G > B) by damping excess G and lifting B proportionally to (G - B).
function buildAntiYellowColorMatrix(fogRatio, yellowStrength = 1.0) {
  const f = Math.min(1, Math.max(0, fogRatio));
  if (f < 0.02) {
    return {
      m: [1, 0, 0, 0, 1, 0, 0, 0, 1],
      svgString: IDENTITY_COLOR_MATRIX
    };
  }

  const s = 1.0 - f * 0.24; // 0.76 at full webcam fog
  const lr = 0.2126;
  const lg = 0.7152;
  const lb = 0.0722;

  const s00 = lr * (1 - s) + s;
  const s01 = lg * (1 - s);
  const s02 = lb * (1 - s);
  const s10 = lr * (1 - s);
  const s11 = lg * (1 - s) + s;
  const s12 = lb * (1 - s);
  const s20 = lr * (1 - s);
  const s21 = lg * (1 - s);
  const s22 = lb * (1 - s) + s;

  const yScale = Math.min(1.25, Math.max(0.5, yellowStrength));
  const kG = f * 0.15 * yScale;
  const kB = f * 0.32 * yScale;

  // M = Mantiyellow * Msat where Mantiyellow = [[1, 0, 0], [0, 1-kG, kG], [0, kB, 1-kB]]
  const m00 = s00;
  const m01 = s01;
  const m02 = s02;

  const m10 = (1 - kG) * s10 + kG * s20;
  const m11 = (1 - kG) * s11 + kG * s21;
  const m12 = (1 - kG) * s12 + kG * s22;

  const m20 = kB * s10 + (1 - kB) * s20;
  const m21 = kB * s11 + (1 - kB) * s21;
  const m22 = kB * s12 + (1 - kB) * s22;

  const m = [m00, m01, m02, m10, m11, m12, m20, m21, m22];
  const svgString = `${m00.toFixed(4)} ${m01.toFixed(4)} ${m02.toFixed(4)} 0 0  ${m10.toFixed(4)} ${m11.toFixed(4)} ${m12.toFixed(4)} 0 0  ${m20.toFixed(4)} ${m21.toFixed(4)} ${m22.toFixed(4)} 0 0  0 0 0 1 0`;
  return { m, svgString };
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
      colorMatrix: IDENTITY_COLOR_MATRIX,
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

      if (lum > 40 && lum < 195) {
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
        if (lum >= 25 && lum <= 182) {
          midFocusLum += lum;
          midFocusCount++;
        }
      }
    }

    let acc = 0;
    let p03 = 0;
    let found03 = false;
    const t03 = pixelCount * 0.03;

    for (let v = 0; v < 256; v++) {
      acc += hist[v];
      if (!found03 && acc >= t03) {
        p03 = v;
        found03 = true;
        break;
      }
    }

    const avgLum = totalLum / pixelCount;
    const rawFocusLum = focusCount > 0 ? focusLum / focusCount : avgLum;
    const detectedFaceLum =
      focusCount > 0 && midFocusCount >= focusCount * 0.15
        ? midFocusLum / midFocusCount
        : rawFocusLum;

    const avgG = colorSamples > 20 ? sumG / colorSamples : 128;
    const avgB = colorSamples > 20 ? sumB / colorSamples : 124;
    const rawYellowExcess = Math.max(0, avgG - avgB);

    if (!smoothedState) {
      smoothedState = { p03, faceLum: detectedFaceLum, yellowExcess: rawYellowExcess };
    } else {
      smoothedState.p03 = smoothedState.p03 * 0.65 + p03 * 0.35;
      smoothedState.faceLum = smoothedState.faceLum * 0.6 + detectedFaceLum * 0.4;
      smoothedState.yellowExcess = smoothedState.yellowExcess * 0.65 + rawYellowExcess * 0.35;
    }

    const sp03 = smoothedState.p03;
    const sFaceLum = smoothedState.faceLum;
    const sYellowExcess = smoothedState.yellowExcess;

    const autoEnabled = manualAdjust?.autoLight !== false;
    const userExp = manualAdjust?.exposure || 0; // -25 .. +25
    const userDehaze = manualAdjust?.dehaze || 0;

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
        colorMatrix: IDENTITY_COLOR_MATRIX,
        tableR: DEFAULT_TABLE,
        tableG: DEFAULT_TABLE,
        tableB: DEFAULT_TABLE
      };
    }

    // Foggy Laptop Webcam Detection (sp03 > 32 indicates optical glare lifting black floor)
    const fogRatio = autoEnabled
      ? Math.min(1, Math.max(0, (sp03 - 30) / 42) + userDehaze / 40)
      : Math.min(1, userDehaze / 30);
    const isFoggyWebcam = fogRatio > 0.12;

    // For clean cameras (iPhone, fogRatio == 0), compute gentle gamma if face is dark or overly bright
    const normFace = Math.min(0.85, Math.max(0.15, sFaceLum / 255));
    const targetClean = Math.min(0.64, Math.max(0.48, normFace * 0.6 + 0.56 * 0.4));
    const gammaClean = Math.min(1.22, Math.max(0.82, Math.log(targetClean) / Math.log(normFace)));

    const userExpOffset = (userExp / 25) * 0.14;
    const neutralTable = buildNeutralSvgTable(fogRatio, gammaClean, userExpOffset);

    // Yellow fluorescent cast strength (around 1.0 when G - B >= 8)
    const yellowStrength = Math.min(1.2, Math.max(0.5, sYellowExcess / 8));
    const { svgString: colorMatrix } = buildAntiYellowColorMatrix(fogRatio, yellowStrength);

    const outFace = evalBoundedDehazeCurve(normFace, fogRatio, gammaClean, userExpOffset) * 255;
    const boostNeeded = Math.min(24, Math.max(-14, Math.round(((outFace - sFaceLum) / 255) * 100)));
    const lumPct = Math.round((sFaceLum / 255) * 100);

    let status = 'OPTIMAL';
    let label = 'AF • Kamera Natural HD';
    if (fogRatio > 0.25) {
      status = 'BRIGHT';
      label = 'AF • Anti-Kabut & Warna Natural Aktif';
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
      contrastBoost: 0,
      saturationBoost: 0,
      gamma: Number(gammaClean.toFixed(2)),
      dehazeFloor: Number(fogRatio.toFixed(3)),
      isFoggyWebcam,
      colorMatrix,
      tableR: neutralTable,
      tableG: neutralTable,
      tableB: neutralTable
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
      colorMatrix: IDENTITY_COLOR_MATRIX,
      tableR: DEFAULT_TABLE,
      tableG: DEFAULT_TABLE,
      tableB: DEFAULT_TABLE
    };
  }
}

// Adaptive Dual-Path Computational ISP for Captured Photos:
// - Path A (Clean Smartphone / iPhone Camera, p03 <= 32): Non-destructive, color-true gentle exposure.
// - Path B (Foggy Laptop Webcam with Ceiling Glare, p03 > 32): Subtle top-glare balancing + bounded-slope dehaze curve + Row-Sum-1 Anti-Yellow Matrix.
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
    const gridW = 32;
    const gridH = 24;
    const smallCanvas = document.createElement('canvas');
    smallCanvas.width = gridW;
    smallCanvas.height = gridH;
    const smallCtx = smallCanvas.getContext('2d', { willReadFrequently: true });
    try {
      smallCtx.filter = 'blur(4px)';
    } catch (e) {}
    smallCtx.drawImage(ctx.canvas, 0, 0, gridW, gridH);
    const smallData = smallCtx.getImageData(0, 0, gridW, gridH).data;
    const illumGrid = new Float32Array(gridW * gridH);
    for (let idx = 0; idx < gridW * gridH; idx++) {
      const si = idx * 4;
      illumGrid[idx] = (0.299 * smallData[si] + 0.587 * smallData[si + 1] + 0.114 * smallData[si + 2]) / 255;
    }

    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    let sumLum = 0;
    let focusLum = 0;
    let focusCount = 0;
    let midFocusLum = 0;
    let midFocusCount = 0;
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

      if (lum > 40 && lum < 195) {
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
    const t03 = totalSamples * 0.03;

    for (let v = 0; v < 256; v++) {
      acc += hist[v];
      if (acc >= t03) {
        p03 = v;
        break;
      }
    }

    const avgLum = sumLum / totalSamples;
    const rawFocusLum = focusCount > 0 ? focusLum / focusCount : avgLum;
    const faceLum =
      focusCount > 0 && midFocusCount >= focusCount * 0.15
        ? midFocusLum / midFocusCount
        : rawFocusLum;

    const fogRatio = autoEnabled
      ? Math.min(1, Math.max(0, (p03 - 30) / 42) + userDehaze / 40)
      : Math.min(1, userDehaze / 30);

    const normFace = Math.min(0.85, Math.max(0.15, faceLum / 255));
    const targetClean = Math.min(0.64, Math.max(0.48, normFace * 0.6 + 0.56 * 0.4));
    const gammaClean = Math.min(1.22, Math.max(0.82, Math.log(targetClean) / Math.log(normFace)));
    const userExpOffset = (userExp / 25) * 0.14;

    if (fogRatio < 0.03 && Math.abs(gammaClean - 1.0) < 0.04 && userExp === 0) {
      return;
    }

    const lut = new Float32Array(256);
    for (let v = 0; v < 256; v++) {
      lut[v] = evalBoundedDehazeCurve(v / 255, fogRatio, gammaClean, userExpOffset) * 255;
    }

    const avgG = colorSamples > 20 ? sumG / colorSamples : 128;
    const avgB = colorSamples > 20 ? sumB / colorSamples : 124;
    const yellowExcess = Math.max(0, avgG - avgB);
    const yellowStrength = Math.min(1.2, Math.max(0.5, yellowExcess / 8));
    const { m } = buildAntiYellowColorMatrix(fogRatio, yellowStrength);

    const spatialGlareStrength = fogRatio * 0.15;

    for (let y = 0; y < height; y++) {
      const gy = Math.min(gridH - 1, Math.floor((y / height) * gridH));
      const rowOffset = y * width * 4;
      for (let x = 0; x < width; x++) {
        const i = rowOffset + x * 4;
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        if (spatialGlareStrength > 0.01) {
          const gx = Math.min(gridW - 1, Math.floor((x / width) * gridW));
          const localIllum = illumGrid[gy * gridW + gx];
          if (localIllum > 0.62) {
            const excess = (localIllum - 0.62) * spatialGlareStrength * 255;
            const scale = 1 / Math.max(0.75, 1 - (localIllum - 0.62) * spatialGlareStrength * 0.5);
            r = Math.min(255, Math.max(0, Math.round((r - excess) * scale)));
            g = Math.min(255, Math.max(0, Math.round((g - excess) * scale)));
            b = Math.min(255, Math.max(0, Math.round((b - excess) * scale)));
          }
        }

        const r1 = lut[r];
        const g1 = lut[g];
        const b1 = lut[b];

        data[i] = Math.min(255, Math.max(0, Math.round(r1 * m[0] + g1 * m[1] + b1 * m[2])));
        data[i + 1] = Math.min(255, Math.max(0, Math.round(r1 * m[3] + g1 * m[4] + b1 * m[5])));
        data[i + 2] = Math.min(255, Math.max(0, Math.round(r1 * m[6] + g1 * m[7] + b1 * m[8])));
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
