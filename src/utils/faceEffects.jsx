// =============================================================================
// FACE EFFECTS & AR FILTER ENGINE FOR PIKUBOOTH STUDIO
// Real-time animated SVG overlays + High-resolution 2D Canvas baking for captures
// =============================================================================
import React from 'react';

// =============================================================================
// REAL-TIME COMPUTER VISION FACE DETECTOR
// Native Shape Detection API + 0.3ms Skin Cluster Centroid Detector fallback
// =============================================================================
let nativeFaceDetector = null;
if (typeof window !== 'undefined' && 'FaceDetector' in window) {
  try {
    nativeFaceDetector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
  } catch (e) {
    nativeFaceDetector = null;
  }
}

let faceCanvas = null;
let faceCtx = null;

export async function detectFaceInVideo(video) {
  if (!video || video.readyState < 2) return null;
  const vw = video.videoWidth;
  const vh = video.videoHeight;
  if (!vw || !vh) return null;

  // 1. Hardware-accelerated native Shape Detection API (Chrome / Edge on Windows)
  if (nativeFaceDetector) {
    try {
      const faces = await nativeFaceDetector.detect(video);
      if (faces && faces.length > 0) {
        const box = faces[0].boundingBox;
        const cx = (box.x + box.width * 0.5) / vw;
        const cy = (box.y + box.height * 0.5) / vh;
        const fw = Math.max(0.16, Math.min(0.45, box.width / vw));
        const fh = Math.max(0.20, Math.min(0.55, box.height / vh));
        const top = box.y / vh;
        const bottom = (box.y + box.height) / vh;
        return { cx, cy, fw, fh, top, bottom, confidence: 0.95 };
      }
    } catch (e) {
      // Ignore and fallback
    }
  }

  // 2. High-speed 0.3ms Skin Cluster Centroid Detector fallback
  try {
    if (!faceCanvas) {
      faceCanvas = document.createElement('canvas');
      faceCanvas.width = 100;
      faceCanvas.height = 75;
      faceCtx = faceCanvas.getContext('2d', { willReadFrequently: true });
    }
    const sw = 100;
    const sh = 75;
    faceCtx.drawImage(video, 0, 0, sw, sh);
    const imgData = faceCtx.getImageData(0, 0, sw, sh);
    const d = imgData.data;

    let count = 0;
    let sumX = 0;
    let sumY = 0;
    let minX = sw;
    let maxX = 0;
    let minY = sh;
    let maxY = 0;

    const startY = Math.floor(sh * 0.15);
    const endY = Math.floor(sh * 0.95);
    const startX = Math.floor(sw * 0.15);
    const endX = Math.floor(sw * 0.85);

    for (let y = startY; y < endY; y += 2) {
      for (let x = startX; x < endX; x += 2) {
        const idx = (y * sw + x) * 4;
        const r = d[idx];
        const g = d[idx + 1];
        const b = d[idx + 2];

        const yLum = 0.299 * r + 0.587 * g + 0.114 * b;
        const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
        const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

        if (cr >= 133 && cr <= 175 && cb >= 80 && cb <= 126 && yLum > 35 && yLum < 240) {
          count++;
          sumX += x;
          sumY += y;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (count > 25) {
      const avgX = (sumX / count) / sw;
      const avgY = (sumY / count) / sh;
      const clusterW = Math.max(0.18, Math.min(0.35, ((maxX - minX) / sw) * 1.05));
      const clusterH = Math.max(0.24, Math.min(0.46, ((maxY - minY) / sh) * 1.05));
      const top = minY / sh;
      const bottom = maxY / sh;
      return {
        cx: avgX,
        cy: avgY,
        fw: clusterW,
        fh: clusterH,
        top,
        bottom,
        confidence: 0.8
      };
    }
  } catch (e) {}

  return null;
}

export const EFFECT_CATEGORIES = [
  { id: 'all', label: 'Semua Efek', icon: '✨' },
  { id: 'butterflies', label: 'Kupu & Peri', icon: '🦋' },
  { id: 'animals', label: 'Hewan Gemas', icon: '🐾' },
  { id: 'aesthetic', label: 'Aesthetic', icon: '🎀' },
  { id: 'glasses_cool', label: 'Keren & Retro', icon: '🕶️' }
];

export const FACE_EFFECTS = [
  {
    id: 'none',
    name: 'Normal',
    shortLabel: 'Normal',
    description: 'Tanpa filter wajah',
    badge: '🚫',
    category: 'all'
  },

  // ---------------------------------------------------------------------------
  // 1. KUPU-KUPU & FAIRY (Trending Instagram & TikTok)
  // ---------------------------------------------------------------------------
  {
    id: 'butterfly_ig',
    name: 'Instagram Butterfly (Biru Langit)',
    shortLabel: 'Kupu IG Biru',
    description: 'Kupu-kupu biru elektrik terbang di kepala & pipi kiri khas Instagram',
    badge: '🦋',
    category: 'butterflies'
  },
  {
    id: 'butterfly_gold',
    name: 'Golden Monarch Butterfly',
    shortLabel: 'Kupu Emas',
    description: 'Kupu-kupu raja emas keemasan terbang di mahkota & pipi dengan kilau sunset',
    badge: '✨',
    category: 'butterflies'
  },
  {
    id: 'butterfly_sakura',
    name: 'Sakura Pink Butterfly',
    shortLabel: 'Kupu Sakura',
    description: 'Kupu-kupu pink pastel lembut & kelopak bunga sakura melayang di wajah',
    badge: '🌸',
    category: 'butterflies'
  },
  {
    id: 'fairy_dust',
    name: 'Fairy Pixie Dust',
    shortLabel: 'Peri Sparkle',
    description: 'Mahkota peri kristal melayang & taburan glitter berkilauan di pipi',
    badge: '🧚',
    category: 'butterflies'
  },

  // ---------------------------------------------------------------------------
  // 2. HEWAN GEMAS (Korean Photobooth Classics)
  // ---------------------------------------------------------------------------
  {
    id: 'cat_ears',
    name: 'Telinga Kucing Imut',
    shortLabel: 'Kucing Imut',
    description: 'Telinga kucing berbulu di kepala, hidung & kumis manis',
    badge: '🐱',
    category: 'animals'
  },
  {
    id: 'bunny_ears',
    name: 'Kelinci Fluffy (Bunny)',
    shortLabel: 'Kelinci Imut',
    description: 'Telinga kelinci panjang bergoyang di kepala, blush & hidung kelinci',
    badge: '🐰',
    category: 'animals'
  },
  {
    id: 'bear_ears',
    name: 'Teddy Bear Korea',
    shortLabel: 'Teddy Bear',
    description: 'Telinga beruang cokelat imut khas photobox Korea & tapak kaki di pipi',
    badge: '🐻',
    category: 'animals'
  },
  {
    id: 'puppy_dog',
    name: 'Puppy Dog Gemas',
    shortLabel: 'Puppy Lucu',
    description: 'Telinga anak anjing menggemaskan di kepala & hidung anjing lucu',
    badge: '🐶',
    category: 'animals'
  },
  {
    id: 'frog_hat',
    name: 'Topi Kodok Gemas',
    shortLabel: 'Kodok Gemas',
    description: 'Bando mata kodok bulat hijau lucu di atas kepala & blush bulat merona',
    badge: '🐸',
    category: 'animals'
  },
  {
    id: 'kitsune_fox',
    name: 'Rubah Kitsune Jepang',
    shortLabel: 'Kitsune Fox',
    description: 'Telinga rubah kitsune festival Jepang dengan aksen pita merah di kepala',
    badge: '🦊',
    category: 'animals'
  },

  // ---------------------------------------------------------------------------
  // 3. AESTHETIC & CANTIK (Floral, Royalty & Coquette)
  // ---------------------------------------------------------------------------
  {
    id: 'flower_crown',
    name: 'Mahkota Bunga & Kupu-Kupu',
    shortLabel: 'Bunga & Kupu',
    description: 'Mahkota bunga pastel di kepala dengan kupu-kupu manis di pipi',
    badge: '💐',
    category: 'aesthetic'
  },
  {
    id: 'princess_tiara',
    name: 'Mahkota Tiara Putri Kristal',
    shortLabel: 'Tiara Ratu',
    description: 'Mahkota tiara perak-emas berkilauan permata di kepala ratu/putri',
    badge: '👑',
    category: 'aesthetic'
  },
  {
    id: 'coquette_bow',
    name: 'Coquette Pink Ribbon Bows',
    shortLabel: 'Pita Coquette',
    description: 'Pita satin merah muda coquette aesthetic di rambut kiri & mutiara pipi',
    badge: '🎀',
    category: 'aesthetic'
  },
  {
    id: 'strawberry_cute',
    name: 'Strawberry Sweet',
    shortLabel: 'Stroberi Imut',
    description: 'Jepit stroberi manis di rambut kiri, buah stroberi & blush bintik pipi',
    badge: '🍓',
    category: 'aesthetic'
  },
  {
    id: 'cottage_daisy',
    name: 'Daisy & Faux Freckles',
    shortLabel: 'Daisy & Bintik',
    description: 'Bunga aster daisy di rambut + bintik freckles alami aesthetic di hidung & pipi',
    badge: '🌼',
    category: 'aesthetic'
  },
  {
    id: 'angel_halo',
    name: 'Angel Halo & Stars',
    shortLabel: 'Angel Halo',
    description: 'Lingkaran cahaya malaikat melayang di kepala & bintang bersinar',
    badge: '👼',
    category: 'aesthetic'
  },

  // ---------------------------------------------------------------------------
  // 4. KEREN & RETRO (Glasses, Y2K & Neon)
  // ---------------------------------------------------------------------------
  {
    id: 'heart_glasses',
    name: 'Heart Sunglasses',
    shortLabel: 'Kacamata Heart',
    description: 'Kacamata hitam bentuk hati aesthetic warna pink fuchsia',
    badge: '🕶️',
    category: 'glasses_cool'
  },
  {
    id: 'pixel_shades',
    name: 'Pixel Thug Life 8-Bit',
    shortLabel: 'Pixel Shades',
    description: 'Kacamata pixel hitam legendaris 8-bit Deal With It & bintang pixel retro',
    badge: '👾',
    category: 'glasses_cool'
  },
  {
    id: 'cyber_visor',
    name: 'Cyberpunk Neon Visor',
    shortLabel: 'Cyber Visor',
    description: 'Kacamata visor masa depan neon cyan & magenta bercahaya sci-fi',
    badge: '⚡',
    category: 'glasses_cool'
  },
  {
    id: 'devil_horns',
    name: 'Cute Neon Devil',
    shortLabel: 'Neon Devil',
    description: 'Tanduk neon devil imut di kepala & blush hati',
    badge: '😈',
    category: 'glasses_cool'
  },
  {
    id: 'y2k_star',
    name: 'Y2K Star Hairclips',
    shortLabel: 'Y2K Stars',
    description: 'Jepit bintang Y2K di rambut/kiri kepala & glitter pipi',
    badge: '⭐',
    category: 'glasses_cool'
  },
  {
    id: 'love_hearts',
    name: 'Floating Love Hearts',
    shortLabel: 'Love Hearts',
    description: 'Lingkaran hati cinta melayang berputar di kepala & stiker hati di pipi',
    badge: '💖',
    category: 'glasses_cool'
  }
];

// =============================================================================
// CANVAS DRAWING HELPERS (Ultra-HD vector rendering for photo capture)
// =============================================================================

function drawCanvasButterfly(ctx, x, y, size, angleRad = 0, colors = {}) {
  const {
    wingTop = '#60a5fa',
    wingBottom = '#3b82f6',
    wingHighlight = '#93c5fd',
    veinColor = 'rgba(15, 23, 42, 0.75)',
    bodyColor = '#1e293b'
  } = colors;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angleRad);

  ctx.shadowColor = wingHighlight;
  ctx.shadowBlur = size * 0.35;

  [-1, 1].forEach((side) => {
    ctx.save();
    ctx.scale(side, 1);

    // Upper Wing
    ctx.beginPath();
    ctx.moveTo(size * 0.05, -size * 0.1);
    ctx.bezierCurveTo(
      size * 0.35, -size * 0.85,
      size * 0.95, -size * 0.65,
      size * 0.85, -size * 0.15
    );
    ctx.bezierCurveTo(
      size * 0.65, size * 0.15,
      size * 0.25, size * 0.05,
      size * 0.05, 0
    );
    ctx.closePath();

    const upperGrad = ctx.createLinearGradient(0, -size * 0.7, size * 0.8, 0);
    upperGrad.addColorStop(0, wingHighlight);
    upperGrad.addColorStop(0.45, wingTop);
    upperGrad.addColorStop(1, wingBottom);
    ctx.fillStyle = upperGrad;
    ctx.fill();

    ctx.lineWidth = Math.max(1, size * 0.02);
    ctx.strokeStyle = veinColor;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(size * 0.1, -size * 0.05);
    ctx.quadraticCurveTo(size * 0.45, -size * 0.4, size * 0.75, -size * 0.45);
    ctx.moveTo(size * 0.1, -size * 0.05);
    ctx.quadraticCurveTo(size * 0.5, -size * 0.15, size * 0.7, -size * 0.1);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    [-0.55, -0.35, -0.15].forEach((dyOffset, idx) => {
      ctx.beginPath();
      ctx.arc(size * (0.8 - idx * 0.08), size * dyOffset, Math.max(1.2, size * 0.035), 0, Math.PI * 2);
      ctx.fill();
    });

    // Lower Wing
    ctx.beginPath();
    ctx.moveTo(size * 0.05, size * 0.05);
    ctx.bezierCurveTo(
      size * 0.45, size * 0.15,
      size * 0.75, size * 0.55,
      size * 0.45, size * 0.8
    );
    ctx.bezierCurveTo(
      size * 0.2, size * 0.85,
      size * 0.05, size * 0.45,
      size * 0.02, size * 0.15
    );
    ctx.closePath();

    const lowerGrad = ctx.createLinearGradient(0, 0, size * 0.5, size * 0.7);
    lowerGrad.addColorStop(0, wingTop);
    lowerGrad.addColorStop(1, wingBottom);
    ctx.fillStyle = lowerGrad;
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  });

  // Body & Antennae
  ctx.shadowBlur = 0;
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(0, size * 0.05, size * 0.06, size * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, -size * 0.32, size * 0.08, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = bodyColor;
  ctx.lineWidth = Math.max(1.2, size * 0.03);
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.35);
  ctx.quadraticCurveTo(-size * 0.2, -size * 0.65, -size * 0.35, -size * 0.7);
  ctx.moveTo(0, -size * 0.35);
  ctx.quadraticCurveTo(size * 0.2, -size * 0.65, size * 0.35, -size * 0.7);
  ctx.stroke();

  ctx.fillStyle = wingHighlight;
  ctx.beginPath();
  ctx.arc(-size * 0.35, -size * 0.7, size * 0.03, 0, Math.PI * 2);
  ctx.arc(size * 0.35, -size * 0.7, size * 0.03, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawCanvasSparkle(ctx, x, y, size, color = '#fef08a') {
  ctx.save();
  ctx.translate(x, y);

  ctx.shadowColor = color;
  ctx.shadowBlur = size * 0.6;

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.quadraticCurveTo(size * 0.1, -size * 0.1, size, 0);
  ctx.quadraticCurveTo(size * 0.1, size * 0.1, 0, size);
  ctx.quadraticCurveTo(-size * 0.1, size * 0.1, -size, 0);
  ctx.quadraticCurveTo(-size * 0.1, -size * 0.1, 0, -size);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.22, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawCanvasBlush(ctx, x, y, rx, ry, color = 'rgba(244, 63, 94, 0.22)') {
  ctx.save();
  const grad = ctx.createRadialGradient(x, y, 0, x, y, Math.max(rx, ry));
  grad.addColorStop(0, color);
  grad.addColorStop(0.65, color.replace(/[\d.]+\)$/, '0.08)'));
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawCanvasFlower(ctx, x, y, size, petalColor = '#f472b6', centerColor = '#fef08a') {
  ctx.save();
  ctx.translate(x, y);

  const numPetals = 5;
  ctx.fillStyle = petalColor;
  for (let i = 0; i < numPetals; i++) {
    const angle = (i * 2 * Math.PI) / numPetals;
    ctx.save();
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0, -size * 0.6, size * 0.32, size * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.fillStyle = centerColor;
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.38, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawCanvas5Star(ctx, x, y, rOuter, rInner, color = '#fbbf24') {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = rOuter * 0.4;

  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? rOuter : rInner;
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    const px = Math.cos(angle) * r;
    const py = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawCanvasHeart(ctx, x, y, size, color = '#f43f5e') {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = size * 0.3;

  ctx.beginPath();
  const s = size * 0.5;
  ctx.moveTo(0, s * 0.3);
  ctx.bezierCurveTo(-s, -s * 0.8, -s * 1.6, s * 0.4, 0, s * 1.5);
  ctx.bezierCurveTo(s * 1.6, s * 0.4, s, -s * 0.8, 0, s * 0.3);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawCanvasStrawberry(ctx, x, y, size) {
  ctx.save();
  ctx.translate(x, y);

  // Berry Body
  ctx.beginPath();
  ctx.moveTo(0, size * 0.65);
  ctx.bezierCurveTo(-size * 0.6, size * 0.3, -size * 0.55, -size * 0.35, 0, -size * 0.45);
  ctx.bezierCurveTo(size * 0.55, -size * 0.35, size * 0.6, size * 0.3, 0, size * 0.65);
  ctx.fillStyle = '#ef4444';
  ctx.fill();

  // Seed dots
  ctx.fillStyle = '#fef08a';
  [
    [-size * 0.2, -size * 0.1],
    [size * 0.2, -size * 0.1],
    [0, size * 0.1],
    [-size * 0.15, size * 0.3],
    [size * 0.15, size * 0.3]
  ].forEach(([sx, sy]) => {
    ctx.beginPath();
    ctx.arc(sx, sy, Math.max(1.2, size * 0.05), 0, Math.PI * 2);
    ctx.fill();
  });

  // Green Leaves Calyx
  ctx.fillStyle = '#22c55e';
  [-0.3, 0, 0.3].forEach((ang) => {
    ctx.save();
    ctx.translate(0, -size * 0.45);
    ctx.rotate(ang);
    ctx.beginPath();
    ctx.ellipse(0, -size * 0.18, size * 0.1, size * 0.22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  ctx.restore();
}

function drawCanvasBow(ctx, x, y, size, color = '#f472b6') {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.strokeStyle = '#db2777';
  ctx.lineWidth = Math.max(1, size * 0.03);

  // Left Loop
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-size * 0.4, -size * 0.45, -size * 0.75, -size * 0.3, -size * 0.8, 0);
  ctx.bezierCurveTo(-size * 0.75, size * 0.3, -size * 0.4, size * 0.45, 0, 0);
  ctx.fill();
  ctx.stroke();

  // Right Loop
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(size * 0.4, -size * 0.45, size * 0.75, -size * 0.3, size * 0.8, 0);
  ctx.bezierCurveTo(size * 0.75, size * 0.3, size * 0.4, size * 0.45, 0, 0);
  ctx.fill();
  ctx.stroke();

  // Ribbon Tails
  ctx.beginPath();
  ctx.moveTo(-size * 0.1, size * 0.1);
  ctx.quadraticCurveTo(-size * 0.4, size * 0.5, -size * 0.5, size * 0.9);
  ctx.lineTo(-size * 0.25, size * 0.8);
  ctx.lineTo(0, size * 0.1);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(size * 0.1, size * 0.1);
  ctx.quadraticCurveTo(size * 0.4, size * 0.5, size * 0.5, size * 0.9);
  ctx.lineTo(size * 0.25, size * 0.8);
  ctx.lineTo(0, size * 0.1);
  ctx.fill();
  ctx.stroke();

  // Center knot
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.18, 0, Math.PI * 2);
  ctx.fillStyle = '#fbcfe8';
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

// =============================================================================
// MAIN CANVAS EFFECT RENDERER (Bakes into high-res photo capture)
// =============================================================================
export function renderFaceEffectToCanvas(ctx, width, height, effectId, anchor = {}) {
  if (!effectId || effectId === 'none') return;

  const cx = (anchor.cx ?? 0.5) * width;
  const cy = (anchor.cy ?? 0.60) * height;
  const fw = (anchor.fw ?? 0.24) * width;
  const fh = (anchor.fh ?? 0.32) * height;
  const topY = anchor.top != null ? anchor.top * height : (cy - fh * 0.5);

  const headTopY = topY - fh * 0.12;
  const hairlineY = topY + fh * 0.04;
  const eyesY = topY + fh * 0.38;
  const cheeksY = topY + fh * 0.58;
  const leftCheekX = cx - fw * 0.26;
  const rightCheekX = cx + fw * 0.26;
  const noseY = topY + fh * 0.68;
  const leftCheekY = cheeksY;
  const rightCheekY = cheeksY;

  ctx.save();

  switch (effectId) {
    // ------------------- 1. INSTAGRAM BUTTERFLY (BLUE) -------------------
    case 'butterfly_ig': {
      const blushR = fw * 0.22;
      drawCanvasBlush(ctx, leftCheekX, leftCheekY, blushR, blushR * 0.7, 'rgba(251, 113, 133, 0.28)');
      drawCanvasBlush(ctx, rightCheekX, rightCheekY, blushR, blushR * 0.7, 'rgba(251, 113, 133, 0.28)');

      drawCanvasButterfly(ctx, cx, headTopY - fh * 0.12, fw * 0.28, -0.08, {
        wingTop: '#38bdf8',
        wingBottom: '#0284c7',
        wingHighlight: '#bae6fd'
      });
      drawCanvasButterfly(ctx, cx - fw * 0.38, headTopY - fh * 0.04, fw * 0.23, -0.28, {
        wingTop: '#60a5fa',
        wingBottom: '#2563eb',
        wingHighlight: '#dbeafe'
      });
      drawCanvasButterfly(ctx, cx + fw * 0.36, headTopY - fh * 0.06, fw * 0.22, 0.24, {
        wingTop: '#818cf8',
        wingBottom: '#4f46e5',
        wingHighlight: '#e0e7ff'
      });

      // Butterfly on left cheek
      drawCanvasButterfly(ctx, leftCheekX - fw * 0.04, leftCheekY, fw * 0.24, -0.15, {
        wingTop: '#38bdf8',
        wingBottom: '#0369a1',
        wingHighlight: '#e0f2fe'
      });

      drawCanvasButterfly(ctx, rightCheekX + fw * 0.16, rightCheekY + fh * 0.12, fw * 0.16, 0.35, {
        wingTop: '#93c5fd',
        wingBottom: '#3b82f6',
        wingHighlight: '#eff6ff'
      });

      const sparkleColor = '#fef08a';
      drawCanvasSparkle(ctx, cx - fw * 0.18, headTopY - fh * 0.18, fw * 0.045, sparkleColor);
      drawCanvasSparkle(ctx, cx + fw * 0.20, headTopY - fh * 0.16, fw * 0.05, sparkleColor);
      drawCanvasSparkle(ctx, cx, headTopY - fh * 0.28, fw * 0.06, '#ffffff');
      drawCanvasSparkle(ctx, leftCheekX + fw * 0.12, leftCheekY - fh * 0.08, fw * 0.04, sparkleColor);
      drawCanvasSparkle(ctx, rightCheekX - fw * 0.12, rightCheekY - fh * 0.08, fw * 0.04, sparkleColor);
      drawCanvasSparkle(ctx, cx, noseY, fw * 0.035, '#ffffff');
      drawCanvasSparkle(ctx, leftCheekX - fw * 0.18, leftCheekY + fh * 0.14, fw * 0.035, sparkleColor);
      break;
    }

    // ------------------- 2. GOLDEN MONARCH BUTTERFLY -------------------
    case 'butterfly_gold': {
      drawCanvasBlush(ctx, leftCheekX, leftCheekY, fw * 0.22, fw * 0.15, 'rgba(245, 158, 11, 0.25)');
      drawCanvasBlush(ctx, rightCheekX, rightCheekY, fw * 0.22, fw * 0.15, 'rgba(245, 158, 11, 0.25)');

      drawCanvasButterfly(ctx, cx, headTopY - fh * 0.14, fw * 0.3, -0.05, {
        wingTop: '#fbbf24',
        wingBottom: '#d97706',
        wingHighlight: '#fef08a'
      });
      drawCanvasButterfly(ctx, cx - fw * 0.38, headTopY - fh * 0.05, fw * 0.24, -0.3, {
        wingTop: '#f59e0b',
        wingBottom: '#b45309',
        wingHighlight: '#fde68a'
      });
      drawCanvasButterfly(ctx, cx + fw * 0.36, headTopY - fh * 0.06, fw * 0.22, 0.25, {
        wingTop: '#fcd34d',
        wingBottom: '#d97706',
        wingHighlight: '#fef3c7'
      });

      // Butterfly on left cheek
      drawCanvasButterfly(ctx, leftCheekX, leftCheekY, fw * 0.24, -0.2, {
        wingTop: '#fbbf24',
        wingBottom: '#b45309',
        wingHighlight: '#fef08a'
      });

      drawCanvasSparkle(ctx, cx, headTopY - fh * 0.25, fw * 0.07, '#fef08a');
      drawCanvasSparkle(ctx, cx - fw * 0.2, headTopY - fh * 0.15, fw * 0.05, '#f59e0b');
      drawCanvasSparkle(ctx, cx + fw * 0.2, headTopY - fh * 0.15, fw * 0.05, '#f59e0b');
      drawCanvasSparkle(ctx, leftCheekX - fw * 0.1, leftCheekY + fh * 0.1, fw * 0.04, '#fde68a');
      drawCanvasSparkle(ctx, rightCheekX + fw * 0.1, rightCheekY - fh * 0.1, fw * 0.04, '#fde68a');
      break;
    }

    // ------------------- 3. SAKURA PINK BUTTERFLY -------------------
    case 'butterfly_sakura': {
      drawCanvasBlush(ctx, leftCheekX, leftCheekY, fw * 0.24, fw * 0.16, 'rgba(244, 114, 182, 0.3)');
      drawCanvasBlush(ctx, rightCheekX, rightCheekY, fw * 0.24, fw * 0.16, 'rgba(244, 114, 182, 0.3)');

      drawCanvasButterfly(ctx, cx, headTopY - fh * 0.12, fw * 0.28, 0, {
        wingTop: '#f472b6',
        wingBottom: '#ec4899',
        wingHighlight: '#fce7f3'
      });
      drawCanvasButterfly(ctx, cx - fw * 0.35, headTopY - fh * 0.04, fw * 0.22, -0.25, {
        wingTop: '#fbcfe8',
        wingBottom: '#db2777',
        wingHighlight: '#ffffff'
      });

      // Butterfly on left cheek
      drawCanvasButterfly(ctx, leftCheekX, leftCheekY, fw * 0.22, -0.15, {
        wingTop: '#f472b6',
        wingBottom: '#db2777',
        wingHighlight: '#fdf2f8'
      });

      // Falling sakura petals
      [
        [cx - fw * 0.15, headTopY - fh * 0.05, 0.08],
        [cx + fw * 0.25, headTopY + fh * 0.02, 0.07],
        [rightCheekX + fw * 0.1, rightCheekY + fh * 0.1, 0.08],
        [leftCheekX - fw * 0.12, leftCheekY + fh * 0.12, 0.07]
      ].forEach(([px, py, sz]) => {
        ctx.save();
        ctx.translate(px, py);
        ctx.fillStyle = '#f472b6';
        ctx.beginPath();
        ctx.ellipse(0, 0, fw * sz, fw * (sz * 0.55), 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      drawCanvasSparkle(ctx, cx, headTopY - fh * 0.2, fw * 0.05, '#ffffff');
      drawCanvasSparkle(ctx, leftCheekX + fw * 0.1, leftCheekY - fh * 0.05, fw * 0.04, '#fbcfe8');
      break;
    }

    // ------------------- 4. FAIRY DUST -------------------
    case 'fairy_dust': {
      drawCanvasBlush(ctx, leftCheekX, leftCheekY, fw * 0.25, fw * 0.16, 'rgba(192, 132, 252, 0.25)');
      drawCanvasBlush(ctx, rightCheekX, rightCheekY, fw * 0.25, fw * 0.16, 'rgba(192, 132, 252, 0.25)');

      // Floating fairy tiara arc
      const fairyY = headTopY - fh * 0.1;
      [-0.3, -0.15, 0, 0.15, 0.3].forEach((offset, idx) => {
        const sz = idx === 2 ? 0.07 : 0.05;
        drawCanvasSparkle(ctx, cx + fw * offset, fairyY - Math.abs(offset) * fh * 0.2, fw * sz, '#c084fc');
      });

      // Shimmering glitter dusting
      [-0.25, -0.12, 0, 0.12, 0.25].forEach((dx) => {
        drawCanvasSparkle(ctx, cx + fw * dx, noseY - fh * 0.05 + Math.random() * fh * 0.08, fw * 0.035, '#ffffff');
      });

      drawCanvasSparkle(ctx, leftCheekX, leftCheekY, fw * 0.05, '#f472b6');
      drawCanvasSparkle(ctx, rightCheekX, rightCheekY, fw * 0.05, '#38bdf8');
      break;
    }

    // ------------------- 5. CAT EARS -------------------
    case 'cat_ears': {
      drawCanvasBlush(ctx, leftCheekX, leftCheekY, fw * 0.22, fw * 0.15, 'rgba(251, 113, 133, 0.32)');
      drawCanvasBlush(ctx, rightCheekX, rightCheekY, fw * 0.22, fw * 0.15, 'rgba(251, 113, 133, 0.32)');

      const earBaseY = headTopY - fh * 0.02;
      const earWidth = fw * 0.32;
      const earHeight = fh * 0.38;

      [-1, 1].forEach((side) => {
        ctx.save();
        ctx.translate(cx + side * fw * 0.32, earBaseY);
        ctx.rotate(side * 0.25);

        ctx.beginPath();
        ctx.moveTo(-earWidth * 0.5, 0);
        ctx.quadraticCurveTo(-earWidth * 0.3, -earHeight * 0.8, 0, -earHeight);
        ctx.quadraticCurveTo(earWidth * 0.3, -earHeight * 0.8, earWidth * 0.5, 0);
        ctx.closePath();
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0,0,0,0.15)';
        ctx.shadowBlur = 10;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-earWidth * 0.3, -earHeight * 0.05);
        ctx.quadraticCurveTo(-earWidth * 0.15, -earHeight * 0.65, 0, -earHeight * 0.82);
        ctx.quadraticCurveTo(earWidth * 0.15, -earHeight * 0.65, earWidth * 0.3, -earHeight * 0.05);
        ctx.closePath();
        ctx.fillStyle = '#f472b6';
        ctx.shadowBlur = 0;
        ctx.fill();

        ctx.restore();
      });

      // Nose & Whiskers
      ctx.fillStyle = '#fb7185';
      ctx.beginPath();
      ctx.ellipse(cx, noseY, fw * 0.04, fw * 0.028, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(30, 41, 59, 0.65)';
      ctx.lineWidth = Math.max(1.5, fw * 0.012);

      ctx.beginPath();
      ctx.moveTo(cx - fw * 0.15, noseY);
      ctx.lineTo(cx - fw * 0.42, noseY - fh * 0.03);
      ctx.moveTo(cx - fw * 0.15, noseY + fh * 0.02);
      ctx.lineTo(cx - fw * 0.44, noseY + fh * 0.02);
      ctx.moveTo(cx - fw * 0.15, noseY + fh * 0.04);
      ctx.lineTo(cx - fw * 0.41, noseY + fh * 0.07);

      ctx.moveTo(cx + fw * 0.15, noseY);
      ctx.lineTo(cx + fw * 0.42, noseY - fh * 0.03);
      ctx.moveTo(cx + fw * 0.15, noseY + fh * 0.02);
      ctx.lineTo(cx + fw * 0.44, noseY + fh * 0.02);
      ctx.moveTo(cx + fw * 0.15, noseY + fh * 0.04);
      ctx.lineTo(cx + fw * 0.41, noseY + fh * 0.07);
      ctx.stroke();
      break;
    }

    // ------------------- 6. BUNNY EARS -------------------
    case 'bunny_ears': {
      drawCanvasBlush(ctx, leftCheekX, leftCheekY, fw * 0.24, fw * 0.16, 'rgba(251, 113, 133, 0.35)');
      drawCanvasBlush(ctx, rightCheekX, rightCheekY, fw * 0.24, fw * 0.16, 'rgba(251, 113, 133, 0.35)');

      const earBaseY = headTopY - fh * 0.04;
      const bw = fw * 0.22;
      const bh = fh * 0.65;

      [-1, 1].forEach((side) => {
        ctx.save();
        ctx.translate(cx + side * fw * 0.24, earBaseY);
        ctx.rotate(side * 0.12);

        // Outer white ear
        ctx.beginPath();
        ctx.ellipse(0, -bh * 0.5, bw * 0.5, bh * 0.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0,0,0,0.12)';
        ctx.shadowBlur = 8;
        ctx.fill();

        // Inner pink ear
        ctx.beginPath();
        ctx.ellipse(0, -bh * 0.5, bw * 0.28, bh * 0.38, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#fbcfe8';
        ctx.shadowBlur = 0;
        ctx.fill();

        ctx.restore();
      });

      // Cute bunny nose & mouth
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.ellipse(cx, noseY, fw * 0.035, fw * 0.025, 0, 0, Math.PI * 2);
      ctx.fill();

      // Bunny whiskers
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.6)';
      ctx.lineWidth = Math.max(1.2, fw * 0.01);
      ctx.beginPath();
      ctx.moveTo(cx - fw * 0.1, noseY);
      ctx.lineTo(cx - fw * 0.35, noseY - fh * 0.02);
      ctx.moveTo(cx - fw * 0.1, noseY + fh * 0.02);
      ctx.lineTo(cx - fw * 0.35, noseY + fh * 0.04);

      ctx.moveTo(cx + fw * 0.1, noseY);
      ctx.lineTo(cx + fw * 0.35, noseY - fh * 0.02);
      ctx.moveTo(cx + fw * 0.1, noseY + fh * 0.02);
      ctx.lineTo(cx + fw * 0.35, noseY + fh * 0.04);
      ctx.stroke();
      break;
    }

    // ------------------- 7. TEDDY BEAR KOREA -------------------
    case 'bear_ears': {
      drawCanvasBlush(ctx, leftCheekX, leftCheekY, fw * 0.22, fw * 0.18, 'rgba(251, 146, 60, 0.35)');
      drawCanvasBlush(ctx, rightCheekX, rightCheekY, fw * 0.22, fw * 0.18, 'rgba(251, 146, 60, 0.35)');

      const earBaseY = headTopY - fh * 0.05;
      const bearR = fw * 0.18;

      [-1, 1].forEach((side) => {
        ctx.save();
        ctx.translate(cx + side * fw * 0.35, earBaseY);

        // Outer brown ear
        ctx.beginPath();
        ctx.arc(0, 0, bearR, 0, Math.PI * 2);
        ctx.fillStyle = '#92400e';
        ctx.shadowColor = 'rgba(0,0,0,0.15)';
        ctx.shadowBlur = 6;
        ctx.fill();

        // Inner peach ear
        ctx.beginPath();
        ctx.arc(0, 0, bearR * 0.58, 0, Math.PI * 2);
        ctx.fillStyle = '#fed7aa';
        ctx.shadowBlur = 0;
        ctx.fill();

        ctx.restore();
      });

      // Bear snout & nose
      ctx.beginPath();
      ctx.ellipse(cx, noseY + fh * 0.02, fw * 0.08, fw * 0.06, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#ffedd5';
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(cx, noseY + fh * 0.01, fw * 0.04, fw * 0.025, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#451a03';
      ctx.fill();
      break;
    }

    // ------------------- 8. PUPPY DOG -------------------
    case 'puppy_dog': {
      drawCanvasBlush(ctx, leftCheekX, leftCheekY, fw * 0.22, fw * 0.15, 'rgba(244, 63, 94, 0.25)');
      drawCanvasBlush(ctx, rightCheekX, rightCheekY, fw * 0.22, fw * 0.15, 'rgba(244, 63, 94, 0.25)');

      const earY = headTopY + fh * 0.02;
      const pw = fw * 0.28;
      const ph = fh * 0.48;

      [-1, 1].forEach((side) => {
        ctx.save();
        ctx.translate(cx + side * fw * 0.38, earY);
        ctx.rotate(side * 0.3);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(side * pw * 0.5, ph * 0.5, 0, ph);
        ctx.quadraticCurveTo(-side * pw * 0.5, ph * 0.5, 0, 0);
        ctx.fillStyle = '#78350f';
        ctx.fill();

        ctx.restore();
      });

      // Puppy black nose
      ctx.beginPath();
      ctx.ellipse(cx, noseY, fw * 0.055, fw * 0.038, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b';
      ctx.fill();

      // Cute tongue
      ctx.beginPath();
      ctx.ellipse(cx, noseY + fh * 0.06, fw * 0.04, fw * 0.06, 0, 0, Math.PI);
      ctx.fillStyle = '#fb7185';
      ctx.fill();
      break;
    }

    // ------------------- 9. FROG HAT -------------------
    case 'frog_hat': {
      drawCanvasBlush(ctx, leftCheekX, leftCheekY, fw * 0.2, fw * 0.16, 'rgba(239, 68, 68, 0.35)');
      drawCanvasBlush(ctx, rightCheekX, rightCheekY, fw * 0.2, fw * 0.16, 'rgba(239, 68, 68, 0.35)');

      const eyeY = headTopY - fh * 0.08;
      const eyeR = fw * 0.16;

      // Green Headband
      ctx.beginPath();
      ctx.ellipse(cx, headTopY, fw * 0.45, fw * 0.1, 0, Math.PI, 0);
      ctx.lineWidth = Math.max(8, fw * 0.08);
      ctx.strokeStyle = '#22c55e';
      ctx.stroke();

      [-1, 1].forEach((side) => {
        ctx.save();
        ctx.translate(cx + side * fw * 0.26, eyeY);

        // Frog eye green socket
        ctx.beginPath();
        ctx.arc(0, 0, eyeR, 0, Math.PI * 2);
        ctx.fillStyle = '#22c55e';
        ctx.fill();

        // White eyeball
        ctx.beginPath();
        ctx.arc(0, 0, eyeR * 0.72, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Black pupil
        ctx.beginPath();
        ctx.arc(0, 0, eyeR * 0.42, 0, Math.PI * 2);
        ctx.fillStyle = '#0f172a';
        ctx.fill();

        // Specular highlight
        ctx.beginPath();
        ctx.arc(-eyeR * 0.15, -eyeR * 0.15, eyeR * 0.14, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        ctx.restore();
      });
      break;
    }

    // ------------------- 10. KITSUNE FOX -------------------
    case 'kitsune_fox': {
      drawCanvasBlush(ctx, leftCheekX, leftCheekY, fw * 0.22, fw * 0.15, 'rgba(239, 68, 68, 0.25)');
      drawCanvasBlush(ctx, rightCheekX, rightCheekY, fw * 0.22, fw * 0.15, 'rgba(239, 68, 68, 0.25)');

      const earBaseY = headTopY - fh * 0.02;
      const kw = fw * 0.28;
      const kh = fh * 0.42;

      [-1, 1].forEach((side) => {
        ctx.save();
        ctx.translate(cx + side * fw * 0.32, earBaseY);
        ctx.rotate(side * 0.2);

        // Outer white ear
        ctx.beginPath();
        ctx.moveTo(-kw * 0.5, 0);
        ctx.lineTo(0, -kh);
        ctx.lineTo(kw * 0.5, 0);
        ctx.closePath();
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0,0,0,0.15)';
        ctx.shadowBlur = 8;
        ctx.fill();

        // Red inner mark
        ctx.beginPath();
        ctx.moveTo(-kw * 0.25, -kh * 0.05);
        ctx.lineTo(0, -kh * 0.85);
        ctx.lineTo(kw * 0.25, -kh * 0.05);
        ctx.closePath();
        ctx.fillStyle = '#ef4444';
        ctx.shadowBlur = 0;
        ctx.fill();

        ctx.restore();
      });

      // Red ceremonial cheek whisker lines
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = Math.max(2, fw * 0.016);
      [-1, 1].forEach((side) => {
        ctx.beginPath();
        ctx.moveTo(cx + side * fw * 0.2, leftCheekY - fh * 0.02);
        ctx.lineTo(cx + side * fw * 0.45, leftCheekY - fh * 0.06);
        ctx.moveTo(cx + side * fw * 0.2, leftCheekY + fh * 0.03);
        ctx.lineTo(cx + side * fw * 0.45, leftCheekY + fh * 0.03);
        ctx.stroke();
      });
      break;
    }

    // ------------------- 11. FLOWER CROWN -------------------
    case 'flower_crown': {
      drawCanvasBlush(ctx, leftCheekX, leftCheekY, fw * 0.2, fw * 0.14, 'rgba(244, 63, 94, 0.22)');
      drawCanvasBlush(ctx, rightCheekX, rightCheekY, fw * 0.2, fw * 0.14, 'rgba(244, 63, 94, 0.22)');

      const crownY = headTopY + fh * 0.02;
      const flowerOffsets = [
        { dx: -0.42, dy: 0.06, size: 0.14, color: '#f472b6' },
        { dx: -0.28, dy: -0.02, size: 0.16, color: '#fb7185' },
        { dx: -0.14, dy: -0.07, size: 0.18, color: '#fda4af' },
        { dx: 0, dy: -0.09, size: 0.21, color: '#f43f5e' },
        { dx: 0.14, dy: -0.07, size: 0.18, color: '#fda4af' },
        { dx: 0.28, dy: -0.02, size: 0.16, color: '#fb7185' },
        { dx: 0.42, dy: 0.06, size: 0.14, color: '#f472b6' }
      ];

      flowerOffsets.forEach((f) => {
        drawCanvasFlower(ctx, cx + fw * f.dx, crownY + fh * f.dy, fw * f.size, f.color, '#fef08a');
      });

      drawCanvasButterfly(ctx, cx - fw * 0.38, crownY - fh * 0.12, fw * 0.22, -0.3, {
        wingTop: '#fbcfe8',
        wingBottom: '#ec4899',
        wingHighlight: '#fdf2f8'
      });
      drawCanvasButterfly(ctx, leftCheekX, leftCheekY, fw * 0.18, -0.15, {
        wingTop: '#f472b6',
        wingBottom: '#db2777',
        wingHighlight: '#fce7f3'
      });
      break;
    }

    // ------------------- 12. PRINCESS TIARA -------------------
    case 'princess_tiara': {
      drawCanvasBlush(ctx, leftCheekX, leftCheekY, fw * 0.22, fw * 0.15, 'rgba(244, 114, 182, 0.25)');
      drawCanvasBlush(ctx, rightCheekX, rightCheekY, fw * 0.22, fw * 0.15, 'rgba(244, 114, 182, 0.25)');

      const tiaraY = headTopY - fh * 0.05;
      const tw = fw * 0.7;

      ctx.save();
      ctx.translate(cx, tiaraY);
      ctx.shadowColor = '#fde047';
      ctx.shadowBlur = fw * 0.15;

      // Tiara Base Band
      ctx.beginPath();
      ctx.ellipse(0, 0, tw * 0.5, tw * 0.12, 0, Math.PI, 0);
      ctx.lineWidth = Math.max(3, fw * 0.025);
      ctx.strokeStyle = '#facc15';
      ctx.stroke();

      // Crown Peaks
      ctx.beginPath();
      ctx.moveTo(-tw * 0.45, 0);
      ctx.lineTo(-tw * 0.35, -fh * 0.15);
      ctx.lineTo(-tw * 0.2, -fh * 0.08);
      ctx.lineTo(0, -fh * 0.28);
      ctx.lineTo(tw * 0.2, -fh * 0.08);
      ctx.lineTo(tw * 0.35, -fh * 0.15);
      ctx.lineTo(tw * 0.45, 0);
      ctx.lineWidth = Math.max(3, fw * 0.025);
      ctx.strokeStyle = '#facc15';
      ctx.stroke();

      // Gems on peaks
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.arc(0, -fh * 0.28, fw * 0.045, 0, Math.PI * 2);
      ctx.arc(-tw * 0.35, -fh * 0.15, fw * 0.035, 0, Math.PI * 2);
      ctx.arc(tw * 0.35, -fh * 0.15, fw * 0.035, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      drawCanvasSparkle(ctx, cx, tiaraY - fh * 0.34, fw * 0.07, '#ffffff');
      drawCanvasSparkle(ctx, cx - fw * 0.3, tiaraY - fh * 0.18, fw * 0.05, '#fef08a');
      drawCanvasSparkle(ctx, cx + fw * 0.3, tiaraY - fh * 0.18, fw * 0.05, '#fef08a');
      break;
    }

    // ------------------- 13. COQUETTE PINK BOWS -------------------
    case 'coquette_bow': {
      drawCanvasBlush(ctx, leftCheekX, leftCheekY, fw * 0.24, fw * 0.16, 'rgba(244, 114, 182, 0.32)');
      drawCanvasBlush(ctx, rightCheekX, rightCheekY, fw * 0.24, fw * 0.16, 'rgba(244, 114, 182, 0.32)');

      // Big bow on left hair
      drawCanvasBow(ctx, cx - fw * 0.38, headTopY + fh * 0.06, fw * 0.32, '#f472b6');
      // Companion bow on right hair
      drawCanvasBow(ctx, cx + fw * 0.38, headTopY + fh * 0.06, fw * 0.28, '#f472b6');

      // Pearl dots on cheek
      ctx.fillStyle = '#ffffff';
      [
        [leftCheekX - fw * 0.05, leftCheekY],
        [leftCheekX + fw * 0.08, leftCheekY + fh * 0.04],
        [rightCheekX - fw * 0.08, rightCheekY + fh * 0.04]
      ].forEach(([px, py]) => {
        ctx.beginPath();
        ctx.arc(px, py, fw * 0.025, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }

    // ------------------- 14. STRAWBERRY SWEET -------------------
    case 'strawberry_cute': {
      drawCanvasBlush(ctx, leftCheekX, leftCheekY, fw * 0.24, fw * 0.16, 'rgba(244, 63, 94, 0.3)');
      drawCanvasBlush(ctx, rightCheekX, rightCheekY, fw * 0.24, fw * 0.16, 'rgba(244, 63, 94, 0.3)');

      // Strawberry hairclips on hair
      drawCanvasStrawberry(ctx, cx - fw * 0.36, headTopY + fh * 0.04, fw * 0.18);
      drawCanvasStrawberry(ctx, cx - fw * 0.44, headTopY + fh * 0.15, fw * 0.14);
      // Small strawberry on right cheek
      drawCanvasStrawberry(ctx, rightCheekX + fw * 0.05, rightCheekY, fw * 0.14);

      drawCanvasSparkle(ctx, leftCheekX, leftCheekY, fw * 0.04, '#fef08a');
      break;
    }

    // ------------------- 15. DAISY & FAUX FRECKLES -------------------
    case 'cottage_daisy': {
      drawCanvasBlush(ctx, leftCheekX, leftCheekY, fw * 0.22, fw * 0.15, 'rgba(251, 146, 60, 0.25)');
      drawCanvasBlush(ctx, rightCheekX, rightCheekY, fw * 0.22, fw * 0.15, 'rgba(251, 146, 60, 0.25)');

      // Daisies in hair
      drawCanvasFlower(ctx, cx - fw * 0.38, headTopY + fh * 0.02, fw * 0.16, '#ffffff', '#facc15');
      drawCanvasFlower(ctx, cx - fw * 0.45, headTopY + fh * 0.12, fw * 0.13, '#ffffff', '#facc15');
      drawCanvasFlower(ctx, cx + fw * 0.38, headTopY + fh * 0.04, fw * 0.15, '#ffffff', '#facc15');

      // Faux Freckles across nose bridge & cheeks
      ctx.fillStyle = 'rgba(120, 53, 15, 0.55)';
      const freckleCoords = [
        [-0.08, -0.01], [0, 0.01], [0.08, -0.01],
        [-0.15, 0.03], [-0.22, 0.06], [-0.26, 0.03],
        [0.15, 0.03], [0.22, 0.06], [0.26, 0.03]
      ];
      freckleCoords.forEach(([fx, fy]) => {
        ctx.beginPath();
        ctx.arc(cx + fw * fx, noseY + fh * fy, Math.max(1.2, fw * 0.012), 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }

    // ------------------- 16. ANGEL HALO -------------------
    case 'angel_halo': {
      drawCanvasBlush(ctx, leftCheekX, leftCheekY, fw * 0.2, fw * 0.14, 'rgba(251, 191, 36, 0.18)');
      drawCanvasBlush(ctx, rightCheekX, rightCheekY, fw * 0.2, fw * 0.14, 'rgba(251, 191, 36, 0.18)');

      const haloY = headTopY - fh * 0.24;
      ctx.save();
      ctx.translate(cx, haloY);

      ctx.shadowColor = '#fef08a';
      ctx.shadowBlur = fw * 0.2;

      ctx.beginPath();
      ctx.ellipse(0, 0, fw * 0.36, fw * 0.11, -0.05, 0, Math.PI * 2);
      ctx.lineWidth = Math.max(3, fw * 0.04);
      ctx.strokeStyle = '#facc15';
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(0, 0, fw * 0.36, fw * 0.11, -0.05, 0, Math.PI * 2);
      ctx.lineWidth = Math.max(1.5, fw * 0.018);
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
      ctx.restore();

      drawCanvasSparkle(ctx, cx - fw * 0.38, haloY - fh * 0.08, fw * 0.06, '#fef08a');
      drawCanvasSparkle(ctx, cx + fw * 0.35, haloY - fh * 0.05, fw * 0.055, '#fef08a');
      drawCanvasSparkle(ctx, cx, haloY - fh * 0.15, fw * 0.07, '#ffffff');
      break;
    }

    // ------------------- 17. HEART SUNGLASSES -------------------
    case 'heart_glasses': {
      const eyeY = cy - fh * 0.05;
      const glassW = fw * 0.36;

      drawCanvasBlush(ctx, leftCheekX, leftCheekY + fh * 0.06, fw * 0.2, fw * 0.12, 'rgba(244, 63, 94, 0.2)');
      drawCanvasBlush(ctx, rightCheekX, rightCheekY + fh * 0.06, fw * 0.2, fw * 0.12, 'rgba(244, 63, 94, 0.2)');

      [-1, 1].forEach((side) => {
        ctx.save();
        ctx.translate(cx + side * fw * 0.23, eyeY);

        ctx.beginPath();
        const s = glassW * 0.5;
        ctx.moveTo(0, s * 0.2);
        ctx.bezierCurveTo(-s * 0.8, -s * 0.8, -s * 1.4, s * 0.5, 0, s * 1.25);
        ctx.bezierCurveTo(s * 1.4, s * 0.5, s * 0.8, -s * 0.8, 0, s * 0.2);

        ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        ctx.fill();

        ctx.lineWidth = Math.max(2.5, fw * 0.025);
        ctx.strokeStyle = '#f472b6';
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-s * 0.6, -s * 0.2);
        ctx.quadraticCurveTo(-s * 0.3, -s * 0.5, 0, -s * 0.15);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = Math.max(1.5, fw * 0.015);
        ctx.stroke();

        ctx.restore();
      });

      ctx.strokeStyle = '#f472b6';
      ctx.lineWidth = Math.max(2, fw * 0.02);
      ctx.beginPath();
      ctx.moveTo(cx - fw * 0.05, eyeY - fh * 0.02);
      ctx.quadraticCurveTo(cx, eyeY - fh * 0.04, cx + fw * 0.05, eyeY - fh * 0.02);
      ctx.stroke();
      break;
    }

    // ------------------- 18. PIXEL SHADES 8-BIT -------------------
    case 'pixel_shades': {
      const eyeY = cy - fh * 0.05;
      const pxSize = fw * 0.038;

      ctx.save();
      ctx.fillStyle = '#0f172a';

      // Left Lens block pattern
      [-8, -7, -6, -5, -4, -3, -2].forEach((col) => {
        [0, 1, 2, 3].forEach((row) => {
          ctx.fillRect(cx + col * pxSize, eyeY + row * pxSize, pxSize, pxSize);
        });
      });
      // Right Lens block pattern
      [2, 3, 4, 5, 6, 7, 8].forEach((col) => {
        [0, 1, 2, 3].forEach((row) => {
          ctx.fillRect(cx + col * pxSize, eyeY + row * pxSize, pxSize, pxSize);
        });
      });
      // Bridge & side arms
      [-1, 0, 1].forEach((col) => {
        ctx.fillRect(cx + col * pxSize, eyeY, pxSize, pxSize);
      });
      [-9, -10].forEach((col) => {
        ctx.fillRect(cx + col * pxSize, eyeY, pxSize, pxSize);
      });
      [9, 10].forEach((col) => {
        ctx.fillRect(cx + col * pxSize, eyeY, pxSize, pxSize);
      });

      // White pixel reflections
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(cx - 7 * pxSize, eyeY + 1 * pxSize, pxSize, pxSize);
      ctx.fillRect(cx - 6 * pxSize, eyeY + 2 * pxSize, pxSize, pxSize);
      ctx.fillRect(cx + 3 * pxSize, eyeY + 1 * pxSize, pxSize, pxSize);
      ctx.fillRect(cx + 4 * pxSize, eyeY + 2 * pxSize, pxSize, pxSize);

      ctx.restore();

      drawCanvasSparkle(ctx, cx + fw * 0.45, eyeY - fh * 0.1, fw * 0.06, '#ffffff');
      break;
    }

    // ------------------- 19. CYBERPUNK NEON VISOR -------------------
    case 'cyber_visor': {
      const eyeY = cy - fh * 0.04;
      const vw = fw * 0.85;
      const vh = fh * 0.18;

      ctx.save();
      ctx.translate(cx, eyeY);

      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = fw * 0.25;

      // Curved Visor Glass
      ctx.beginPath();
      ctx.roundRect(-vw * 0.5, -vh * 0.5, vw, vh, [8, 8, 16, 16]);

      const grad = ctx.createLinearGradient(-vw * 0.5, 0, vw * 0.5, 0);
      grad.addColorStop(0, 'rgba(6, 182, 212, 0.85)');
      grad.addColorStop(0.5, 'rgba(59, 130, 246, 0.85)');
      grad.addColorStop(1, 'rgba(236, 72, 153, 0.85)');
      ctx.fillStyle = grad;
      ctx.fill();

      // Glowing Neon Border
      ctx.lineWidth = Math.max(2, fw * 0.02);
      ctx.strokeStyle = '#22d3ee';
      ctx.stroke();

      // HUD Horizon line
      ctx.beginPath();
      ctx.moveTo(-vw * 0.4, 0);
      ctx.lineTo(vw * 0.4, 0);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.stroke();

      ctx.restore();
      break;
    }

    // ------------------- 20. CUTE NEON DEVIL -------------------
    case 'devil_horns': {
      drawCanvasBlush(ctx, leftCheekX, leftCheekY, fw * 0.22, fw * 0.15, 'rgba(239, 68, 68, 0.28)');
      drawCanvasBlush(ctx, rightCheekX, rightCheekY, fw * 0.22, fw * 0.15, 'rgba(239, 68, 68, 0.28)');

      const hornBaseY = headTopY + fh * 0.02;
      const hornW = fw * 0.22;
      const hornH = fh * 0.32;

      [-1, 1].forEach((side) => {
        ctx.save();
        ctx.translate(cx + side * fw * 0.28, hornBaseY);

        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = fw * 0.15;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(side * hornW * 0.3, -hornH * 0.6, side * hornW * 0.8, -hornH);
        ctx.quadraticCurveTo(side * hornW * 0.1, -hornH * 0.5, -side * hornW * 0.4, 0);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, 0, 0, -hornH);
        grad.addColorStop(0, '#f43f5e');
        grad.addColorStop(1, '#e11d48');
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.restore();
      });

      drawCanvasHeart(ctx, leftCheekX, leftCheekY, fw * 0.06, '#ef4444');
      break;
    }

    // ------------------- 21. Y2K STAR HAIRCLIPS -------------------
    case 'y2k_star': {
      drawCanvasBlush(ctx, leftCheekX, leftCheekY, fw * 0.22, fw * 0.15, 'rgba(236, 72, 153, 0.25)');
      drawCanvasBlush(ctx, rightCheekX, rightCheekY, fw * 0.22, fw * 0.15, 'rgba(236, 72, 153, 0.25)');

      const clipLeftY = headTopY + fh * 0.04;
      drawCanvas5Star(ctx, cx - fw * 0.36, clipLeftY, fw * 0.11, fw * 0.05, '#f472b6');
      drawCanvas5Star(ctx, cx - fw * 0.44, clipLeftY + fh * 0.12, fw * 0.08, fw * 0.038, '#38bdf8');
      drawCanvas5Star(ctx, cx - fw * 0.28, clipLeftY - fh * 0.09, fw * 0.09, fw * 0.04, '#facc15');
      drawCanvas5Star(ctx, cx + fw * 0.38, clipLeftY, fw * 0.1, fw * 0.045, '#c084fc');

      drawCanvasSparkle(ctx, leftCheekX, leftCheekY, fw * 0.045, '#f472b6');
      drawCanvasSparkle(ctx, rightCheekX, rightCheekY, fw * 0.045, '#c084fc');
      break;
    }

    // ------------------- 22. FLOATING LOVE HEARTS -------------------
    case 'love_hearts': {
      drawCanvasBlush(ctx, leftCheekX, leftCheekY, fw * 0.24, fw * 0.16, 'rgba(244, 63, 94, 0.35)');
      drawCanvasBlush(ctx, rightCheekX, rightCheekY, fw * 0.24, fw * 0.16, 'rgba(244, 63, 94, 0.35)');

      // Floating halo of hearts above head
      const heartHaloY = headTopY - fh * 0.18;
      [-0.32, -0.16, 0, 0.16, 0.32].forEach((dx, idx) => {
        const hs = idx % 2 === 0 ? fw * 0.08 : fw * 0.11;
        drawCanvasHeart(ctx, cx + fw * dx, heartHaloY + Math.abs(dx) * fh * 0.1, hs, '#f43f5e');
      });

      drawCanvasHeart(ctx, leftCheekX, leftCheekY, fw * 0.06, '#f43f5e');
      drawCanvasHeart(ctx, rightCheekX, rightCheekY, fw * 0.06, '#f43f5e');
      break;
    }

    default:
      break;
  }

  ctx.restore();
}

// =============================================================================
// REAL-TIME ANIMATED SVG OVERLAY (Viewfinder 60fps Rendering)
// =============================================================================
export function FaceEffectOverlay({ effectId, anchor = {}, isMirrored = true }) {
  if (!effectId || effectId === 'none') return null;

  const cx = (anchor.cx ?? 0.5) * 100;
  const cy = (anchor.cy ?? 0.60) * 100;
  const fw = (anchor.fw ?? 0.24) * 100;
  const fh = (anchor.fh ?? 0.32) * 100;
  const topY = anchor.top != null ? anchor.top * 100 : (cy - fh * 0.5);

  const headTopY = topY - fh * 0.12;
  const hairlineY = topY + fh * 0.04;
  const eyesY = topY + fh * 0.38;
  const cheeksY = topY + fh * 0.58;
  const leftCheekX = cx - fw * 0.26;
  const rightCheekX = cx + fw * 0.26;
  const noseY = topY + fh * 0.68;
  const leftCheekY = cheeksY;
  const rightCheekY = cheeksY;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-25 select-none">
      <style>{`
        @keyframes igFlapWingLeft {
          0%, 100% { transform: scaleX(1) rotate(0deg); }
          50% { transform: scaleX(0.2) rotate(-8deg); }
        }
        @keyframes igFlapWingRight {
          0%, 100% { transform: scaleX(1) rotate(0deg); }
          50% { transform: scaleX(0.2) rotate(8deg); }
        }
        @keyframes igFlutterBob {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-7px) rotate(3deg); }
        }
        @keyframes igSparklePulse {
          0%, 100% { opacity: 0.3; transform: scale(0.7) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.25) rotate(45deg); }
        }
        @keyframes igHaloFloat {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50% { transform: translateY(-8px) rotate(1deg); }
        }
        @keyframes igHeartBeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.12); }
        }
        @keyframes igEarTwitch {
          0%, 80%, 100% { transform: rotate(0deg); }
          85% { transform: rotate(-5deg); }
          95% { transform: rotate(4deg); }
        }
      `}</style>

      {/* ---------------- 1. BUTTERFLY IG (BLUE) ---------------- */}
      {effectId === 'butterfly_ig' && (
        <>
          <CheekBlush x={leftCheekX} y={leftCheekY} w={fw * 0.45} h={fh * 0.28} color="rgba(251, 113, 133, 0.38)" />
          <CheekBlush x={rightCheekX} y={rightCheekY} w={fw * 0.45} h={fh * 0.28} color="rgba(251, 113, 133, 0.38)" />

          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${cx}%`,
              top: `${headTopY - fh * 0.12}%`,
              width: `${fw * 0.30}%`,
              animation: 'igFlutterBob 2.8s ease-in-out infinite'
            }}
          >
            <SvgAnimatedButterfly size="100%" colorPrimary="#38bdf8" colorSecondary="#0284c7" />
          </div>

          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${cx - fw * 0.38}%`,
              top: `${headTopY - fh * 0.04}%`,
              width: `${fw * 0.24}%`,
              transform: 'rotate(-16deg)',
              animation: 'igFlutterBob 3.2s ease-in-out infinite 0.5s'
            }}
          >
            <SvgAnimatedButterfly size="100%" colorPrimary="#60a5fa" colorSecondary="#2563eb" />
          </div>

          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${cx + fw * 0.36}%`,
              top: `${headTopY - fh * 0.06}%`,
              width: `${fw * 0.23}%`,
              transform: 'rotate(14deg)',
              animation: 'igFlutterBob 3s ease-in-out infinite 1s'
            }}
          >
            <SvgAnimatedButterfly size="100%" colorPrimary="#818cf8" colorSecondary="#4f46e5" />
          </div>

          {/* Butterfly on left cheek */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 drop-shadow-md"
            style={{
              left: `${leftCheekX - fw * 0.04}%`,
              top: `${leftCheekY}%`,
              width: `${fw * 0.25}%`,
              transform: 'rotate(-12deg)',
              animation: 'igFlutterBob 4s ease-in-out infinite 0.2s'
            }}
          >
            <SvgAnimatedButterfly size="100%" colorPrimary="#38bdf8" colorSecondary="#0369a1" />
          </div>

          <SvgSparkleBadge x={`${cx - fw * 0.18}%`} y={`${headTopY - fh * 0.18}%`} size={18} delay="0s" />
          <SvgSparkleBadge x={`${cx + fw * 0.20}%`} y={`${headTopY - fh * 0.16}%`} size={20} delay="0.6s" />
          <SvgSparkleBadge x={`${cx}%`} y={`${headTopY - fh * 0.28}%`} size={24} delay="1.2s" />
          <SvgSparkleBadge x={`${leftCheekX + fw * 0.12}%`} y={`${leftCheekY - fh * 0.08}%`} size={16} delay="0.4s" />
          <SvgSparkleBadge x={`${rightCheekX - fw * 0.12}%`} y={`${rightCheekY - fh * 0.08}%`} size={16} delay="0.9s" />
        </>
      )}

      {/* ---------------- 2. GOLDEN MONARCH BUTTERFLY ---------------- */}
      {effectId === 'butterfly_gold' && (
        <>
          <CheekBlush x={leftCheekX} y={leftCheekY} w={fw * 0.45} h={fh * 0.28} color="rgba(245, 158, 11, 0.32)" />
          <CheekBlush x={rightCheekX} y={rightCheekY} w={fw * 0.45} h={fh * 0.28} color="rgba(245, 158, 11, 0.32)" />

          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${cx}%`,
              top: `${headTopY - fh * 0.14}%`,
              width: `${fw * 0.32}%`,
              animation: 'igFlutterBob 2.6s ease-in-out infinite'
            }}
          >
            <SvgAnimatedButterfly size="100%" colorPrimary="#fbbf24" colorSecondary="#d97706" />
          </div>

          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${leftCheekX}%`,
              top: `${leftCheekY}%`,
              width: `${fw * 0.24}%`,
              transform: 'rotate(-15deg)',
              animation: 'igFlutterBob 3.8s ease-in-out infinite 0.3s'
            }}
          >
            <SvgAnimatedButterfly size="100%" colorPrimary="#fbbf24" colorSecondary="#b45309" />
          </div>

          <SvgSparkleBadge x={`${cx}%`} y={`${headTopY - fh * 0.25}%`} size={26} delay="0s" />
          <SvgSparkleBadge x={`${cx - fw * 0.25}%`} y={`${headTopY - fh * 0.15}%`} size={18} delay="0.5s" />
          <SvgSparkleBadge x={`${cx + fw * 0.25}%`} y={`${headTopY - fh * 0.15}%`} size={18} delay="1s" />
        </>
      )}

      {/* ---------------- 3. SAKURA PINK BUTTERFLY ---------------- */}
      {effectId === 'butterfly_sakura' && (
        <>
          <CheekBlush x={leftCheekX} y={leftCheekY} w={fw * 0.45} h={fh * 0.28} color="rgba(244, 114, 182, 0.38)" />
          <CheekBlush x={rightCheekX} y={rightCheekY} w={fw * 0.45} h={fh * 0.28} color="rgba(244, 114, 182, 0.38)" />

          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${cx}%`,
              top: `${headTopY - fh * 0.12}%`,
              width: `${fw * 0.28}%`,
              animation: 'igFlutterBob 3s ease-in-out infinite'
            }}
          >
            <SvgAnimatedButterfly size="100%" colorPrimary="#f472b6" colorSecondary="#ec4899" />
          </div>

          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${leftCheekX}%`,
              top: `${leftCheekY}%`,
              width: `${fw * 0.22}%`,
              animation: 'igFlutterBob 3.5s ease-in-out infinite 0.4s'
            }}
          >
            <SvgAnimatedButterfly size="100%" colorPrimary="#fbcfe8" colorSecondary="#db2777" />
          </div>

          <SvgSparkleBadge x={`${cx}%`} y={`${headTopY - fh * 0.2}%`} size={22} delay="0s" />
          <SvgSparkleBadge x={`${leftCheekX}%`} y={`${leftCheekY}%`} size={16} delay="0.5s" />
        </>
      )}

      {/* ---------------- 4. FAIRY DUST ---------------- */}
      {effectId === 'fairy_dust' && (
        <>
          <CheekBlush x={leftCheekX} y={leftCheekY} w={fw * 0.48} h={fh * 0.28} color="rgba(192, 132, 252, 0.32)" />
          <CheekBlush x={rightCheekX} y={rightCheekY} w={fw * 0.48} h={fh * 0.28} color="rgba(192, 132, 252, 0.32)" />

          <SvgSparkleBadge x={`${cx - fw * 0.3}%`} y={`${headTopY - fh * 0.1}%`} size={24} delay="0s" />
          <SvgSparkleBadge x={`${cx}%`} y={`${headTopY - fh * 0.22}%`} size={30} delay="0.4s" />
          <SvgSparkleBadge x={`${cx + fw * 0.3}%`} y={`${headTopY - fh * 0.1}%`} size={24} delay="0.8s" />
          <SvgSparkleBadge x={`${leftCheekX}%`} y={`${leftCheekY}%`} size={18} delay="0.2s" />
          <SvgSparkleBadge x={`${rightCheekX}%`} y={`${rightCheekY}%`} size={18} delay="0.6s" />
          <SvgSparkleBadge x={`${cx}%`} y={`${noseY}%`} size={16} delay="1s" />
        </>
      )}

      {/* ---------------- 5. CAT EARS ---------------- */}
      {effectId === 'cat_ears' && (
        <>
          <CheekBlush x={leftCheekX} y={leftCheekY} w={fw * 0.45} h={fh * 0.26} color="rgba(251, 113, 133, 0.4)" />
          <CheekBlush x={rightCheekX} y={rightCheekY} w={fw * 0.45} h={fh * 0.26} color="rgba(251, 113, 133, 0.4)" />

          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${cx - fw * 0.32}%`,
              top: `${headTopY - fh * 0.12}%`,
              width: `${fw * 0.32}%`,
              animation: 'igHeartBeat 3s ease-in-out infinite'
            }}
          >
            <SvgCatEar side="left" />
          </div>

          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${cx + fw * 0.32}%`,
              top: `${headTopY - fh * 0.12}%`,
              width: `${fw * 0.32}%`,
              animation: 'igHeartBeat 3s ease-in-out infinite 0.15s'
            }}
          >
            <SvgCatEar side="right" />
          </div>

          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${cx}%`, top: `${noseY}%`, width: `${fw * 0.7}%` }}
          >
            <SvgWhiskersAndNose />
          </div>
        </>
      )}

      {/* ---------------- 6. BUNNY EARS ---------------- */}
      {effectId === 'bunny_ears' && (
        <>
          <CheekBlush x={leftCheekX} y={leftCheekY} w={fw * 0.45} h={fh * 0.26} color="rgba(251, 113, 133, 0.4)" />
          <CheekBlush x={rightCheekX} y={rightCheekY} w={fw * 0.45} h={fh * 0.26} color="rgba(251, 113, 133, 0.4)" />

          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${cx - fw * 0.24}%`,
              top: `${headTopY - fh * 0.35}%`,
              width: `${fw * 0.25}%`,
              animation: 'igEarTwitch 4s ease-in-out infinite'
            }}
          >
            <SvgBunnyEar side="left" />
          </div>

          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${cx + fw * 0.24}%`,
              top: `${headTopY - fh * 0.35}%`,
              width: `${fw * 0.25}%`,
              animation: 'igEarTwitch 4s ease-in-out infinite 0.5s'
            }}
          >
            <SvgBunnyEar side="right" />
          </div>

          {/* Bunny little nose */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 text-rose-500 font-bold"
            style={{ left: `${cx}%`, top: `${noseY}%` }}
          >
            🐰
          </div>
        </>
      )}

      {/* ---------------- 7. TEDDY BEAR KOREA ---------------- */}
      {effectId === 'bear_ears' && (
        <>
          <CheekBlush x={leftCheekX} y={leftCheekY} w={fw * 0.42} h={fh * 0.26} color="rgba(251, 146, 60, 0.4)" />
          <CheekBlush x={rightCheekX} y={rightCheekY} w={fw * 0.42} h={fh * 0.26} color="rgba(251, 146, 60, 0.4)" />

          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${cx - fw * 0.35}%`,
              top: `${headTopY - fh * 0.12}%`,
              width: `${fw * 0.3}%`
            }}
          >
            <SvgBearEar />
          </div>

          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${cx + fw * 0.35}%`,
              top: `${headTopY - fh * 0.12}%`,
              width: `${fw * 0.3}%`,
              transform: 'scaleX(-1)'
            }}
          >
            <SvgBearEar />
          </div>

          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 text-2xl"
            style={{ left: `${cx}%`, top: `${noseY}%` }}
          >
            🐻
          </div>
        </>
      )}

      {/* ---------------- 8. PUPPY DOG ---------------- */}
      {effectId === 'puppy_dog' && (
        <>
          <CheekBlush x={leftCheekX} y={leftCheekY} w={fw * 0.42} h={fh * 0.24} color="rgba(244, 63, 94, 0.32)" />
          <CheekBlush x={rightCheekX} y={rightCheekY} w={fw * 0.42} h={fh * 0.24} color="rgba(244, 63, 94, 0.32)" />

          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 text-4xl"
            style={{ left: `${cx - fw * 0.36}%`, top: `${headTopY + fh * 0.05}%`, transform: 'rotate(-25deg)' }}
          >
            🐶
          </div>
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 text-4xl"
            style={{ left: `${cx + fw * 0.36}%`, top: `${headTopY + fh * 0.05}%`, transform: 'rotate(25deg)' }}
          >
            🐶
          </div>
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 text-2xl"
            style={{ left: `${cx}%`, top: `${noseY + fh * 0.02}%` }}
          >
            👅
          </div>
        </>
      )}

      {/* ---------------- 9. FROG HAT ---------------- */}
      {effectId === 'frog_hat' && (
        <>
          <CheekBlush x={leftCheekX} y={leftCheekY} w={fw * 0.42} h={fh * 0.26} color="rgba(239, 68, 68, 0.4)" />
          <CheekBlush x={rightCheekX} y={rightCheekY} w={fw * 0.42} h={fh * 0.26} color="rgba(239, 68, 68, 0.4)" />

          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-6"
            style={{ left: `${cx}%`, top: `${headTopY - fh * 0.08}%`, width: `${fw * 0.8}%` }}
          >
            <div className="w-12 h-12 bg-green-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
              <div className="w-6 h-6 bg-stone-900 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full -translate-x-1 -translate-y-1" />
              </div>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
              <div className="w-6 h-6 bg-stone-900 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full -translate-x-1 -translate-y-1" />
              </div>
            </div>
          </div>
        </>
      )}

      {/* ---------------- 10. KITSUNE FOX ---------------- */}
      {effectId === 'kitsune_fox' && (
        <>
          <CheekBlush x={leftCheekX} y={leftCheekY} w={fw * 0.45} h={fh * 0.26} color="rgba(239, 68, 68, 0.3)" />
          <CheekBlush x={rightCheekX} y={rightCheekY} w={fw * 0.45} h={fh * 0.26} color="rgba(239, 68, 68, 0.3)" />

          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 text-4xl"
            style={{ left: `${cx - fw * 0.32}%`, top: `${headTopY - fh * 0.1}%` }}
          >
            🦊
          </div>
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 text-4xl"
            style={{ left: `${cx + fw * 0.32}%`, top: `${headTopY - fh * 0.1}%`, transform: 'scaleX(-1)' }}
          >
            🦊
          </div>
        </>
      )}

      {/* ---------------- 11. FLOWER CROWN ---------------- */}
      {effectId === 'flower_crown' && (
        <>
          <CheekBlush x={leftCheekX} y={leftCheekY} w={fw * 0.28} h={fh * 0.16} color="rgba(244, 63, 94, 0.32)" />
          <CheekBlush x={rightCheekX} y={rightCheekY} w={fw * 0.28} h={fh * 0.16} color="rgba(244, 63, 94, 0.32)" />

          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-1 drop-shadow-md"
            style={{ left: `${cx}%`, top: `${headTopY}%`, width: `${fw * 0.78}%` }}
          >
            <span className="text-base sm:text-lg animate-pulse">🌸</span>
            <span className="text-lg sm:text-xl">🌺</span>
            <span className="text-base sm:text-lg">🌼</span>
            <span className="text-xl sm:text-2xl">🌸</span>
            <span className="text-base sm:text-lg">🌼</span>
            <span className="text-lg sm:text-xl">🌺</span>
            <span className="text-base sm:text-lg animate-pulse">🌸</span>
          </div>

          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${cx - fw * 0.32}%`,
              top: `${headTopY - fh * 0.08}%`,
              width: `${fw * 0.22}%`,
              animation: 'igFlutterBob 3s ease-in-out infinite'
            }}
          >
            <SvgAnimatedButterfly size="100%" colorPrimary="#f472b6" colorSecondary="#db2777" />
          </div>

          {/* Butterfly on left cheek */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${leftCheekX}%`,
              top: `${leftCheekY}%`,
              width: `${fw * 0.20}%`,
              animation: 'igFlutterBob 3.6s ease-in-out infinite 0.4s'
            }}
          >
            <SvgAnimatedButterfly size="100%" colorPrimary="#fbcfe8" colorSecondary="#ec4899" />
          </div>
        </>
      )}

      {/* ---------------- 12. PRINCESS TIARA ---------------- */}
      {effectId === 'princess_tiara' && (
        <>
          <CheekBlush x={leftCheekX} y={leftCheekY} w={fw * 0.42} h={fh * 0.25} color="rgba(244, 114, 182, 0.3)" />
          <CheekBlush x={rightCheekX} y={rightCheekY} w={fw * 0.42} h={fh * 0.25} color="rgba(244, 114, 182, 0.3)" />

          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_15px_rgba(250,204,21,0.9)]"
            style={{
              left: `${cx}%`,
              top: `${headTopY - fh * 0.15}%`,
              width: `${fw * 0.7}%`,
              animation: 'igHeartBeat 3s ease-in-out infinite'
            }}
          >
            <SvgTiara />
          </div>

          <SvgSparkleBadge x={`${cx}%`} y={`${headTopY - fh * 0.3}%`} size={26} delay="0s" />
          <SvgSparkleBadge x={`${cx - fw * 0.3}%`} y={`${headTopY - fh * 0.18}%`} size={18} delay="0.5s" />
          <SvgSparkleBadge x={`${cx + fw * 0.3}%`} y={`${headTopY - fh * 0.18}%`} size={18} delay="1s" />
        </>
      )}

      {/* ---------------- 13. COQUETTE PINK BOWS ---------------- */}
      {effectId === 'coquette_bow' && (
        <>
          <CheekBlush x={leftCheekX} y={leftCheekY} w={fw * 0.45} h={fh * 0.26} color="rgba(244, 114, 182, 0.35)" />
          <CheekBlush x={rightCheekX} y={rightCheekY} w={fw * 0.45} h={fh * 0.26} color="rgba(244, 114, 182, 0.35)" />

          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 drop-shadow-md"
            style={{ left: `${cx - fw * 0.38}%`, top: `${headTopY + fh * 0.06}%`, width: `${fw * 0.32}%` }}
          >
            <SvgBowIcon color="#f472b6" />
          </div>

          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 drop-shadow-md"
            style={{ left: `${cx + fw * 0.38}%`, top: `${headTopY + fh * 0.06}%`, width: `${fw * 0.28}%` }}
          >
            <SvgBowIcon color="#f472b6" />
          </div>
        </>
      )}

      {/* ---------------- 14. STRAWBERRY SWEET ---------------- */}
      {effectId === 'strawberry_cute' && (
        <>
          <CheekBlush x={leftCheekX} y={leftCheekY} w={fw * 0.45} h={fh * 0.25} color="rgba(244, 63, 94, 0.32)" />
          <CheekBlush x={rightCheekX} y={rightCheekY} w={fw * 0.45} h={fh * 0.25} color="rgba(244, 63, 94, 0.32)" />

          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 text-3xl drop-shadow-md"
            style={{ left: `${cx - fw * 0.36}%`, top: `${headTopY + fh * 0.04}%` }}
          >
            🍓
          </div>
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 text-2xl drop-shadow-md"
            style={{ left: `${rightCheekX + fw * 0.08}%`, top: `${rightCheekY}%` }}
          >
            🍓
          </div>
        </>
      )}

      {/* ---------------- 15. DAISY & FAUX FRECKLES ---------------- */}
      {effectId === 'cottage_daisy' && (
        <>
          <CheekBlush x={leftCheekX} y={leftCheekY} w={fw * 0.45} h={fh * 0.25} color="rgba(251, 146, 60, 0.3)" />
          <CheekBlush x={rightCheekX} y={rightCheekY} w={fw * 0.45} h={fh * 0.25} color="rgba(251, 146, 60, 0.3)" />

          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 text-3xl drop-shadow-md"
            style={{ left: `${cx - fw * 0.38}%`, top: `${headTopY + fh * 0.02}%` }}
          >
            🌼
          </div>
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 text-2xl drop-shadow-md"
            style={{ left: `${cx + fw * 0.38}%`, top: `${headTopY + fh * 0.04}%` }}
          >
            🌼
          </div>
        </>
      )}

      {/* ---------------- 16. ANGEL HALO ---------------- */}
      {effectId === 'angel_halo' && (
        <>
          <CheekBlush x={leftCheekX} y={leftCheekY} w={fw * 0.4} h={fh * 0.22} color="rgba(251, 191, 36, 0.25)" />
          <CheekBlush x={rightCheekX} y={rightCheekY} w={fw * 0.4} h={fh * 0.22} color="rgba(251, 191, 36, 0.25)" />

          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${cx}%`,
              top: `${headTopY - fh * 0.24}%`,
              width: `${fw * 0.72}%`,
              animation: 'igHaloFloat 3s ease-in-out infinite'
            }}
          >
            <svg viewBox="0 0 160 55" fill="none" className="w-full h-auto drop-shadow-[0_0_15px_rgba(250,204,21,0.85)]">
              <ellipse cx="80" cy="27" rx="72" ry="22" stroke="#facc15" strokeWidth="6" />
              <ellipse cx="80" cy="27" rx="72" ry="22" stroke="#ffffff" strokeWidth="2.5" />
            </svg>
          </div>

          <SvgSparkleBadge x={`${cx - fw * 0.38}%`} y={`${headTopY - fh * 0.08}%`} size={24} delay="0s" />
          <SvgSparkleBadge x={`${cx + fw * 0.35}%`} y={`${headTopY - fh * 0.05}%`} size={22} delay="0.5s" />
          <SvgSparkleBadge x={`${cx}%`} y={`${headTopY - fh * 0.15}%`} size={26} delay="1s" />
        </>
      )}

      {/* ---------------- 17. HEART SUNGLASSES ---------------- */}
      {effectId === 'heart_glasses' && (
        <>
          <CheekBlush x={leftCheekX} y={leftCheekY + fh * 0.06} w={fw * 0.4} h={fh * 0.22} color="rgba(244, 63, 94, 0.28)" />
          <CheekBlush x={rightCheekX} y={rightCheekY + fh * 0.06} w={fw * 0.4} h={fh * 0.22} color="rgba(244, 63, 94, 0.28)" />

          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 drop-shadow-xl"
            style={{ left: `${cx}%`, top: `${cy - fh * 0.05}%`, width: `${fw * 0.88}%` }}
          >
            <SvgHeartSunglasses />
          </div>
        </>
      )}

      {/* ---------------- 18. PIXEL SHADES 8-BIT ---------------- */}
      {effectId === 'pixel_shades' && (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl"
          style={{ left: `${cx}%`, top: `${cy - fh * 0.04}%`, width: `${fw * 0.9}%` }}
        >
          <SvgPixelShades />
          <SvgSparkleBadge x="85%" y="10%" size={22} delay="0s" />
        </div>
      )}

      {/* ---------------- 19. CYBER VISOR ---------------- */}
      {effectId === 'cyber_visor' && (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_20px_rgba(6,182,212,0.85)]"
          style={{ left: `${cx}%`, top: `${cy - fh * 0.04}%`, width: `${fw * 0.88}%` }}
        >
          <div className="w-full h-8 sm:h-10 rounded-2xl bg-gradient-to-r from-cyan-400/85 via-blue-500/85 to-fuchsia-500/85 border-2 border-cyan-300 flex items-center justify-between px-4">
            <span className="font-mono text-[9px] text-white tracking-widest font-black">PIKU-AI // 2026</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
        </div>
      )}

      {/* ---------------- 20. CUTE NEON DEVIL ---------------- */}
      {effectId === 'devil_horns' && (
        <>
          <CheekBlush x={leftCheekX} y={leftCheekY} w={fw * 0.45} h={fh * 0.25} color="rgba(239, 68, 68, 0.32)" />
          <CheekBlush x={rightCheekX} y={rightCheekY} w={fw * 0.45} h={fh * 0.25} color="rgba(239, 68, 68, 0.32)" />

          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]"
            style={{ left: `${cx - fw * 0.28}%`, top: `${headTopY - fh * 0.08}%`, width: `${fw * 0.22}%` }}
          >
            <SvgDevilHorn />
          </div>

          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]"
            style={{ left: `${cx + fw * 0.28}%`, top: `${headTopY - fh * 0.08}%`, width: `${fw * 0.22}%`, transform: 'scaleX(-1)' }}
          >
            <SvgDevilHorn />
          </div>

          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 text-rose-500 font-bold text-sm sm:text-base animate-pulse"
            style={{ left: `${leftCheekX}%`, top: `${leftCheekY}%` }}
          >
            ♥
          </div>
        </>
      )}

      {/* ---------------- 21. Y2K STAR HAIRCLIPS ---------------- */}
      {effectId === 'y2k_star' && (
        <>
          <CheekBlush x={leftCheekX} y={leftCheekY} w={fw * 0.45} h={fh * 0.25} color="rgba(236, 72, 153, 0.32)" />
          <CheekBlush x={rightCheekX} y={rightCheekY} w={fw * 0.45} h={fh * 0.25} color="rgba(236, 72, 153, 0.32)" />

          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 drop-shadow-md animate-pulse"
            style={{ left: `${cx - fw * 0.36}%`, top: `${headTopY + fh * 0.04}%`, width: `${fw * 0.22}%` }}
          >
            <SvgStarIcon color="#f472b6" />
          </div>
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 drop-shadow-md"
            style={{ left: `${cx - fw * 0.44}%`, top: `${headTopY + fh * 0.12}%`, width: `${fw * 0.16}%` }}
          >
            <SvgStarIcon color="#38bdf8" />
          </div>
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 drop-shadow-md"
            style={{ left: `${cx + fw * 0.38}%`, top: `${headTopY + fh * 0.04}%`, width: `${fw * 0.2}%` }}
          >
            <SvgStarIcon color="#c084fc" />
          </div>
        </>
      )}

      {/* ---------------- 22. FLOATING LOVE HEARTS ---------------- */}
      {effectId === 'love_hearts' && (
        <>
          <CheekBlush x={leftCheekX} y={leftCheekY} w={fw * 0.45} h={fh * 0.26} color="rgba(244, 63, 94, 0.35)" />
          <CheekBlush x={rightCheekX} y={rightCheekY} w={fw * 0.45} h={fh * 0.26} color="rgba(244, 63, 94, 0.35)" />

          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-3 drop-shadow-lg"
            style={{
              left: `${cx}%`,
              top: `${headTopY - fh * 0.16}%`,
              width: `${fw * 0.9}%`,
              animation: 'igHeartBeat 2s ease-in-out infinite'
            }}
          >
            <span className="text-xl sm:text-2xl animate-bounce">💖</span>
            <span className="text-2xl sm:text-3xl">💗</span>
            <span className="text-3xl sm:text-4xl animate-pulse">💕</span>
            <span className="text-2xl sm:text-3xl">💗</span>
            <span className="text-xl sm:text-2xl animate-bounce">💖</span>
          </div>

          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 text-rose-500 font-bold text-base"
            style={{ left: `${leftCheekX}%`, top: `${leftCheekY}%` }}
          >
            ♥
          </div>
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 text-rose-500 font-bold text-base"
            style={{ left: `${rightCheekX}%`, top: `${rightCheekY}%` }}
          >
            ♥
          </div>
        </>
      )}
    </div>
  );
}

// =============================================================================
// REUSABLE SVG COMPONENTS
// =============================================================================

function CheekBlush({ x, y, w, h, color }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${w}%`,
        height: `${h}%`,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: 'blur(8px)'
      }}
    />
  );
}

function SvgAnimatedButterfly({ size = '100%', colorPrimary = '#38bdf8', colorSecondary = '#0284c7' }) {
  return (
    <svg viewBox="0 0 100 85" fill="none" style={{ width: size, height: 'auto' }} className="drop-shadow-sm">
      <g style={{ transformOrigin: '50px 42px', animation: 'igFlapWingLeft 0.35s ease-in-out infinite' }}>
        <path d="M 48 38 C 30 10 5 18 8 40 C 12 55 35 60 48 45 Z" fill={colorPrimary} stroke="#0f172a" strokeWidth="1.2" />
        <path d="M 48 44 C 32 50 16 65 26 78 C 38 82 46 62 48 48 Z" fill={colorSecondary} stroke="#0f172a" strokeWidth="1.2" />
        <circle cx="12" cy="30" r="1.5" fill="#ffffff" />
        <circle cx="20" cy="74" r="1.2" fill="#ffffff" />
      </g>
      <g style={{ transformOrigin: '50px 42px', animation: 'igFlapWingRight 0.35s ease-in-out infinite' }}>
        <path d="M 52 38 C 70 10 95 18 92 40 C 88 55 65 60 52 45 Z" fill={colorPrimary} stroke="#0f172a" strokeWidth="1.2" />
        <path d="M 52 44 C 68 50 84 65 74 78 C 62 82 54 62 52 48 Z" fill={colorSecondary} stroke="#0f172a" strokeWidth="1.2" />
        <circle cx="88" cy="30" r="1.5" fill="#ffffff" />
        <circle cx="80" cy="74" r="1.2" fill="#ffffff" />
      </g>
      <ellipse cx="50" cy="44" rx="2.5" ry="14" fill="#0f172a" />
      <circle cx="50" cy="28" r="3.2" fill="#0f172a" />
    </svg>
  );
}

function SvgSparkleBadge({ x, y, size = 18, delay = '0s' }) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{
        left: x,
        top: y,
        width: `${size}px`,
        height: `${size}px`,
        animation: `igSparklePulse 2s ease-in-out infinite ${delay}`
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full drop-shadow-[0_0_8px_rgba(254,240,138,0.9)]">
        <path d="M 12 0 Q 13 11 24 12 Q 13 13 12 24 Q 11 13 0 12 Q 11 11 12 0 Z" fill="#fef08a" />
        <circle cx="12" cy="12" r="2.5" fill="#ffffff" />
      </svg>
    </div>
  );
}

function SvgStarIcon({ color = '#fbbf24' }) {
  return (
    <svg viewBox="0 0 24 24" fill={color} className="w-full h-auto drop-shadow-md">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function SvgCatEar({ side = 'left' }) {
  const isLeft = side === 'left';
  return (
    <svg
      viewBox="0 0 80 90"
      fill="none"
      className="w-full h-auto drop-shadow-md"
      style={{ transform: isLeft ? 'rotate(-10deg)' : 'scaleX(-1) rotate(-10deg)' }}
    >
      <path d="M 10 85 Q 25 35 68 8 Q 62 45 65 85 Z" fill="#ffffff" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" />
      <path d="M 22 80 Q 32 45 60 25 Q 56 55 58 80 Z" fill="#f472b6" />
    </svg>
  );
}

function SvgBunnyEar({ side = 'left' }) {
  const isLeft = side === 'left';
  return (
    <svg
      viewBox="0 0 60 140"
      fill="none"
      className="w-full h-auto drop-shadow-lg"
      style={{ transform: isLeft ? 'rotate(-6deg)' : 'scaleX(-1) rotate(-6deg)' }}
    >
      <ellipse cx="30" cy="70" rx="25" ry="65" fill="#ffffff" stroke="rgba(0,0,0,0.06)" strokeWidth="1.5" />
      <ellipse cx="30" cy="70" rx="14" ry="48" fill="#fbcfe8" />
    </svg>
  );
}

function SvgBearEar() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-auto drop-shadow-md">
      <circle cx="40" cy="40" r="38" fill="#92400e" />
      <circle cx="40" cy="40" r="22" fill="#fed7aa" />
    </svg>
  );
}

function SvgWhiskersAndNose() {
  return (
    <svg viewBox="0 0 160 50" fill="none" className="w-full h-auto drop-shadow-sm">
      <ellipse cx="80" cy="18" rx="8" ry="6" fill="#fb7185" />
      <line x1="68" y1="16" x2="10" y2="8" stroke="rgba(30,41,59,0.7)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="66" y1="22" x2="5" y2="24" stroke="rgba(30,41,59,0.7)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="68" y1="28" x2="15" y2="38" stroke="rgba(30,41,59,0.7)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="92" y1="16" x2="150" y2="8" stroke="rgba(30,41,59,0.7)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="94" y1="22" x2="155" y2="24" stroke="rgba(30,41,59,0.7)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="92" y1="28" x2="145" y2="38" stroke="rgba(30,41,59,0.7)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function SvgTiara() {
  return (
    <svg viewBox="0 0 140 60" fill="none" className="w-full h-auto">
      <path d="M 10 50 L 30 18 L 50 35 L 70 5 L 90 35 L 110 18 L 130 50 Z" fill="none" stroke="#facc15" strokeWidth="5" strokeLinejoin="round" />
      <circle cx="70" cy="8" r="6" fill="#ec4899" />
      <circle cx="30" cy="20" r="4" fill="#38bdf8" />
      <circle cx="110" cy="20" r="4" fill="#38bdf8" />
      <line x1="5" y1="52" x2="135" y2="52" stroke="#facc15" strokeWidth="4" />
    </svg>
  );
}

function SvgBowIcon({ color = '#f472b6' }) {
  return (
    <svg viewBox="0 0 100 60" fill="none" className="w-full h-auto drop-shadow-md">
      <path d="M 50 30 C 25 5 5 15 5 30 C 5 45 25 55 50 30 Z" fill={color} stroke="#db2777" strokeWidth="2" />
      <path d="M 50 30 C 75 5 95 15 95 30 C 95 45 75 55 50 30 Z" fill={color} stroke="#db2777" strokeWidth="2" />
      <circle cx="50" cy="30" r="8" fill="#fbcfe8" stroke="#db2777" strokeWidth="2" />
    </svg>
  );
}

function SvgHeartSunglasses() {
  return (
    <svg viewBox="0 0 200 80" fill="none" className="w-full h-auto">
      <path
        d="M 50 20 C 35 5 15 5 5 20 C -10 40 25 65 50 78 C 75 65 110 40 95 20 C 85 5 65 5 50 20 Z"
        fill="rgba(15, 23, 42, 0.88)"
        stroke="#f472b6"
        strokeWidth="4"
      />
      <path d="M 22 25 Q 38 15 50 22" stroke="rgba(255,255,255,0.45)" strokeWidth="3" strokeLinecap="round" />
      <path d="M 90 28 Q 100 24 110 28" stroke="#f472b6" strokeWidth="4" strokeLinecap="round" />
      <path
        d="M 150 20 C 135 5 115 5 105 20 C 90 40 125 65 150 78 C 175 65 210 40 195 20 C 185 5 165 5 150 20 Z"
        fill="rgba(15, 23, 42, 0.88)"
        stroke="#f472b6"
        strokeWidth="4"
      />
      <path d="M 122 25 Q 138 15 150 22" stroke="rgba(255,255,255,0.45)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function SvgPixelShades() {
  return (
    <svg viewBox="0 0 180 40" fill="none" className="w-full h-auto">
      <rect x="10" y="8" width="60" height="24" fill="#0f172a" />
      <rect x="110" y="8" width="60" height="24" fill="#0f172a" />
      <rect x="70" y="12" width="40" height="8" fill="#0f172a" />
      <rect x="20" y="12" width="6" height="6" fill="#ffffff" />
      <rect x="26" y="18" width="6" height="6" fill="#ffffff" />
      <rect x="120" y="12" width="6" height="6" fill="#ffffff" />
      <rect x="126" y="18" width="6" height="6" fill="#ffffff" />
    </svg>
  );
}

function SvgDevilHorn() {
  return (
    <svg viewBox="0 0 60 70" fill="none" className="w-full h-auto">
      <path d="M 10 65 Q 18 25 50 5 Q 35 25 40 65 Z" fill="#e11d48" />
    </svg>
  );
}
