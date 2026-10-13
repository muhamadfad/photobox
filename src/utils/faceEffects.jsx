// =============================================================================
// FACE EFFECTS & AR FILTER ENGINE FOR PIKUBOOTH STUDIO
// Real-time animated SVG overlays + High-resolution 2D Canvas baking for captures
// =============================================================================
import React from 'react';

export const FACE_EFFECTS = [
  {
    id: 'none',
    name: 'Normal',
    shortLabel: 'Normal',
    description: 'Tanpa filter wajah',
    badge: '🚫',
    category: 'basic'
  },
  {
    id: 'butterfly_ig',
    name: 'Instagram Butterfly',
    shortLabel: 'Kupu-Kupu IG',
    description: 'Kupu-kupu terbang di kepala, di pipi kiri & kilau bintang khas Instagram',
    badge: '🦋',
    category: 'trendy'
  },
  {
    id: 'flower_crown',
    name: 'Mahkota Bunga & Kupu-Kupu',
    shortLabel: 'Bunga & Kupu',
    description: 'Mahkota bunga pastel di kepala dengan kupu-kupu manis',
    badge: '🌸',
    category: 'aesthetic'
  },
  {
    id: 'cat_ears',
    name: 'Telinga Kucing Imut',
    shortLabel: 'Kucing Imut',
    description: 'Telinga kucing berbulu di kepala, hidung & kumis manis',
    badge: '🐱',
    category: 'cute'
  },
  {
    id: 'angel_halo',
    name: 'Angel Halo & Stars',
    shortLabel: 'Angel Halo',
    description: 'Lingkaran cahaya malaikat melayang di kepala & bintang bersinar',
    badge: '👼',
    category: 'glow'
  },
  {
    id: 'y2k_star',
    name: 'Y2K Star Hairclips',
    shortLabel: 'Y2K Stars',
    description: 'Jepit bintang Y2K di rambut/kiri kepala & glitter pipi',
    badge: '✨',
    category: 'trendy'
  },
  {
    id: 'devil_horns',
    name: 'Cute Neon Devil',
    shortLabel: 'Neon Devil',
    description: 'Tanduk neon devil imut di kepala & blush pipi',
    badge: '😈',
    category: 'cute'
  },
  {
    id: 'heart_glasses',
    name: 'Heart Sunglasses',
    shortLabel: 'Kacamata Heart',
    description: 'Kacamata hitam bentuk hati aesthetic',
    badge: '🕶️',
    category: 'retro'
  }
];

// -----------------------------------------------------------------------------
// CANVAS DRAWING HELPERS (Ultra-HD vector rendering for photo capture)
// -----------------------------------------------------------------------------

/**
 * Draws an aesthetic butterfly with delicate wings, veining, body, and antennae
 */
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

  // Soft glow underneath
  ctx.shadowColor = wingHighlight;
  ctx.shadowBlur = size * 0.35;

  // Draw Wings (Left & Right)
  [-1, 1].forEach((side) => {
    ctx.save();
    ctx.scale(side, 1);

    // --- Upper Wing ---
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

    // Veins on upper wing
    ctx.lineWidth = Math.max(1, size * 0.02);
    ctx.strokeStyle = veinColor;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(size * 0.1, -size * 0.05);
    ctx.quadraticCurveTo(size * 0.45, -size * 0.4, size * 0.75, -size * 0.45);
    ctx.moveTo(size * 0.1, -size * 0.05);
    ctx.quadraticCurveTo(size * 0.5, -size * 0.15, size * 0.7, -size * 0.1);
    ctx.stroke();

    // White edge dots
    ctx.fillStyle = '#ffffff';
    [-0.55, -0.35, -0.15].forEach((dyOffset, idx) => {
      ctx.beginPath();
      ctx.arc(size * (0.8 - idx * 0.08), size * dyOffset, Math.max(1.2, size * 0.035), 0, Math.PI * 2);
      ctx.fill();
    });

    // --- Lower Wing ---
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

  // Butterfly Body
  ctx.shadowBlur = 0;
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(0, size * 0.05, size * 0.06, size * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.beginPath();
  ctx.arc(0, -size * 0.32, size * 0.08, 0, Math.PI * 2);
  ctx.fill();

  // Antennae
  ctx.strokeStyle = bodyColor;
  ctx.lineWidth = Math.max(1.2, size * 0.03);
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.35);
  ctx.quadraticCurveTo(-size * 0.2, -size * 0.65, -size * 0.35, -size * 0.7);
  ctx.moveTo(0, -size * 0.35);
  ctx.quadraticCurveTo(size * 0.2, -size * 0.65, size * 0.35, -size * 0.7);
  ctx.stroke();

  // Antenna tips
  ctx.fillStyle = wingHighlight;
  ctx.beginPath();
  ctx.arc(-size * 0.35, -size * 0.7, size * 0.03, 0, Math.PI * 2);
  ctx.arc(size * 0.35, -size * 0.7, size * 0.03, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Draws a glowing 4-point sparkle diamond
 */
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

  // Center white star
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.22, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Draws soft aesthetic rosy cheek blush
 */
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

/**
 * Draws a cute daisy / flower
 */
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

  // Center disk
  ctx.fillStyle = centerColor;
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.38, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Draws a cute 5-point star
 */
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

// -----------------------------------------------------------------------------
// MAIN CANVAS EFFECT RENDERER (Bakes into high-res photo capture)
// -----------------------------------------------------------------------------
export function renderFaceEffectToCanvas(ctx, width, height, effectId, anchor = {}) {
  if (!effectId || effectId === 'none') return;

  // Reference face anchor normalized relative to canvas dimensions
  const cx = (anchor.cx ?? 0.5) * width;
  const cy = (anchor.cy ?? 0.42) * height;
  const fw = (anchor.fw ?? 0.38) * width;
  const fh = (anchor.fh ?? 0.50) * height;

  // Key facial anchor coordinates:
  // Head top/hairline
  const headTopY = cy - fh * 0.48;
  // Left cheek (viewer's left side)
  const leftCheekX = cx - fw * 0.32;
  const leftCheekY = cy + fh * 0.08;
  // Right cheek (viewer's right side)
  const rightCheekX = cx + fw * 0.32;
  const rightCheekY = cy + fh * 0.08;
  // Nose tip
  const noseY = cy + fh * 0.02;

  ctx.save();

  switch (effectId) {
    case 'butterfly_ig': {
      // 1. Soft glowing peach-rose blush on both cheeks
      const blushR = fw * 0.22;
      drawCanvasBlush(ctx, leftCheekX, leftCheekY, blushR, blushR * 0.7, 'rgba(251, 113, 133, 0.28)');
      drawCanvasBlush(ctx, rightCheekX, rightCheekY, blushR, blushR * 0.7, 'rgba(251, 113, 133, 0.28)');

      // 2. Beautiful aesthetic butterflies fluttering around the head / hair crown
      // Butterfly 1: Top-Center Head (hovering above hair)
      drawCanvasButterfly(ctx, cx, headTopY - fh * 0.12, fw * 0.28, -0.08, {
        wingTop: '#38bdf8',
        wingBottom: '#0284c7',
        wingHighlight: '#bae6fd'
      });

      // Butterfly 2: Top-Left Head
      drawCanvasButterfly(ctx, cx - fw * 0.38, headTopY - fh * 0.04, fw * 0.23, -0.28, {
        wingTop: '#60a5fa',
        wingBottom: '#2563eb',
        wingHighlight: '#dbeafe'
      });

      // Butterfly 3: Top-Right Head
      drawCanvasButterfly(ctx, cx + fw * 0.36, headTopY - fh * 0.06, fw * 0.22, 0.24, {
        wingTop: '#818cf8',
        wingBottom: '#4f46e5',
        wingHighlight: '#e0e7ff'
      });

      // 3. User Requested: Butterfly on the LEFT cheek ("di kiri")!
      drawCanvasButterfly(ctx, leftCheekX - fw * 0.04, leftCheekY, fw * 0.24, -0.15, {
        wingTop: '#38bdf8',
        wingBottom: '#0369a1',
        wingHighlight: '#e0f2fe'
      });

      // Small companion butterfly hovering near right cheek/shoulder
      drawCanvasButterfly(ctx, rightCheekX + fw * 0.16, rightCheekY + fh * 0.12, fw * 0.16, 0.35, {
        wingTop: '#93c5fd',
        wingBottom: '#3b82f6',
        wingHighlight: '#eff6ff'
      });

      // 4. Golden Sparkling Stars dusted across hair and face (Instagram Aesthetic)
      const sparkleColor = '#fef08a';
      drawCanvasSparkle(ctx, cx - fw * 0.18, headTopY - fh * 0.18, fw * 0.045, sparkleColor);
      drawCanvasSparkle(ctx, cx + fw * 0.20, headTopY - fh * 0.16, fw * 0.05, sparkleColor);
      drawCanvasSparkle(ctx, cx, headTopY - fh * 0.28, fw * 0.06, '#ffffff');
      drawCanvasSparkle(ctx, leftCheekX + fw * 0.12, leftCheekY - fh * 0.08, fw * 0.04, sparkleColor);
      drawCanvasSparkle(ctx, rightCheekX - fw * 0.12, rightCheekY - fh * 0.08, fw * 0.04, sparkleColor);
      drawCanvasSparkle(ctx, cx, noseY, fw * 0.035, '#ffffff');
      drawCanvasSparkle(ctx, leftCheekX - fw * 0.18, leftCheekY + fh * 0.14, fw * 0.035, sparkleColor);
      drawCanvasSparkle(ctx, rightCheekX + fw * 0.08, rightCheekY - fh * 0.16, fw * 0.045, sparkleColor);
      break;
    }

    case 'flower_crown': {
      // Soft blush
      drawCanvasBlush(ctx, leftCheekX, leftCheekY, fw * 0.2, fw * 0.14, 'rgba(244, 63, 94, 0.22)');
      drawCanvasBlush(ctx, rightCheekX, rightCheekY, fw * 0.2, fw * 0.14, 'rgba(244, 63, 94, 0.22)');

      // Arch crown across forehead/hairline
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

      // Butterfly perched on left side of head
      drawCanvasButterfly(ctx, cx - fw * 0.38, crownY - fh * 0.12, fw * 0.22, -0.3, {
        wingTop: '#fbcfe8',
        wingBottom: '#ec4899',
        wingHighlight: '#fdf2f8'
      });

      // Butterfly on left cheek
      drawCanvasButterfly(ctx, leftCheekX, leftCheekY, fw * 0.18, -0.15, {
        wingTop: '#f472b6',
        wingBottom: '#db2777',
        wingHighlight: '#fce7f3'
      });

      // Sparkles
      drawCanvasSparkle(ctx, cx, crownY - fh * 0.16, fw * 0.05, '#fef08a');
      drawCanvasSparkle(ctx, cx + fw * 0.25, crownY - fh * 0.12, fw * 0.04, '#ffffff');
      break;
    }

    case 'cat_ears': {
      // Soft blush
      drawCanvasBlush(ctx, leftCheekX, leftCheekY, fw * 0.22, fw * 0.15, 'rgba(251, 113, 133, 0.32)');
      drawCanvasBlush(ctx, rightCheekX, rightCheekY, fw * 0.22, fw * 0.15, 'rgba(251, 113, 133, 0.32)');

      // Cute fluffy Cat Ears on head
      const earBaseY = headTopY - fh * 0.02;
      const earWidth = fw * 0.32;
      const earHeight = fh * 0.38;

      [-1, 1].forEach((side) => {
        ctx.save();
        ctx.translate(cx + side * fw * 0.32, earBaseY);
        ctx.rotate(side * 0.25);

        // Outer Ear
        ctx.beginPath();
        ctx.moveTo(-earWidth * 0.5, 0);
        ctx.quadraticCurveTo(-earWidth * 0.3, -earHeight * 0.8, 0, -earHeight);
        ctx.quadraticCurveTo(earWidth * 0.3, -earHeight * 0.8, earWidth * 0.5, 0);
        ctx.closePath();
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0,0,0,0.15)';
        ctx.shadowBlur = 10;
        ctx.fill();

        // Inner Pink Ear
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

      // Cute Little Nose
      ctx.fillStyle = '#fb7185';
      ctx.beginPath();
      ctx.ellipse(cx, noseY, fw * 0.04, fw * 0.028, 0, 0, Math.PI * 2);
      ctx.fill();

      // Whisker details on cheeks
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.65)';
      ctx.lineWidth = Math.max(1.5, fw * 0.012);

      // Left Whiskers
      ctx.beginPath();
      ctx.moveTo(cx - fw * 0.15, noseY);
      ctx.lineTo(cx - fw * 0.42, noseY - fh * 0.03);
      ctx.moveTo(cx - fw * 0.15, noseY + fh * 0.02);
      ctx.lineTo(cx - fw * 0.44, noseY + fh * 0.02);
      ctx.moveTo(cx - fw * 0.15, noseY + fh * 0.04);
      ctx.lineTo(cx - fw * 0.41, noseY + fh * 0.07);
      ctx.stroke();

      // Right Whiskers
      ctx.beginPath();
      ctx.moveTo(cx + fw * 0.15, noseY);
      ctx.lineTo(cx + fw * 0.42, noseY - fh * 0.03);
      ctx.moveTo(cx + fw * 0.15, noseY + fh * 0.02);
      ctx.lineTo(cx + fw * 0.44, noseY + fh * 0.02);
      ctx.moveTo(cx + fw * 0.15, noseY + fh * 0.04);
      ctx.lineTo(cx + fw * 0.41, noseY + fh * 0.07);
      ctx.stroke();
      break;
    }

    case 'angel_halo': {
      // Soft blush
      drawCanvasBlush(ctx, leftCheekX, leftCheekY, fw * 0.2, fw * 0.14, 'rgba(251, 191, 36, 0.18)');
      drawCanvasBlush(ctx, rightCheekX, rightCheekY, fw * 0.2, fw * 0.14, 'rgba(251, 191, 36, 0.18)');

      // Floating Golden Halo over head
      const haloY = headTopY - fh * 0.24;
      ctx.save();
      ctx.translate(cx, haloY);

      // Outer glow
      ctx.shadowColor = '#fef08a';
      ctx.shadowBlur = fw * 0.2;

      ctx.beginPath();
      ctx.ellipse(0, 0, fw * 0.36, fw * 0.11, -0.05, 0, Math.PI * 2);
      ctx.lineWidth = Math.max(3, fw * 0.04);
      ctx.strokeStyle = '#facc15';
      ctx.stroke();

      // Inner bright ring
      ctx.beginPath();
      ctx.ellipse(0, 0, fw * 0.36, fw * 0.11, -0.05, 0, Math.PI * 2);
      ctx.lineWidth = Math.max(1.5, fw * 0.018);
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
      ctx.restore();

      // Heavenly stars & sparkles
      drawCanvasSparkle(ctx, cx - fw * 0.38, haloY - fh * 0.08, fw * 0.06, '#fef08a');
      drawCanvasSparkle(ctx, cx + fw * 0.35, haloY - fh * 0.05, fw * 0.055, '#fef08a');
      drawCanvasSparkle(ctx, cx, haloY - fh * 0.15, fw * 0.07, '#ffffff');
      drawCanvasSparkle(ctx, leftCheekX, leftCheekY, fw * 0.04, '#fef08a');
      drawCanvasSparkle(ctx, rightCheekX, rightCheekY, fw * 0.04, '#fef08a');
      break;
    }

    case 'y2k_star': {
      // Soft blush
      drawCanvasBlush(ctx, leftCheekX, leftCheekY, fw * 0.22, fw * 0.15, 'rgba(236, 72, 153, 0.25)');
      drawCanvasBlush(ctx, rightCheekX, rightCheekY, fw * 0.22, fw * 0.15, 'rgba(236, 72, 153, 0.25)');

      // Y2K Metallic Star Clips in hair (left side)
      const clipLeftY = headTopY + fh * 0.04;
      drawCanvas5Star(ctx, cx - fw * 0.36, clipLeftY, fw * 0.11, fw * 0.05, '#f472b6');
      drawCanvas5Star(ctx, cx - fw * 0.44, clipLeftY + fh * 0.12, fw * 0.08, fw * 0.038, '#38bdf8');
      drawCanvas5Star(ctx, cx - fw * 0.28, clipLeftY - fh * 0.09, fw * 0.09, fw * 0.04, '#facc15');

      // Star clip on right side
      drawCanvas5Star(ctx, cx + fw * 0.38, clipLeftY, fw * 0.1, fw * 0.045, '#c084fc');

      // Y2K Cheek Glitter
      drawCanvasSparkle(ctx, leftCheekX, leftCheekY, fw * 0.045, '#f472b6');
      drawCanvasSparkle(ctx, leftCheekX - fw * 0.1, leftCheekY + fh * 0.06, fw * 0.035, '#38bdf8');
      drawCanvasSparkle(ctx, rightCheekX, rightCheekY, fw * 0.045, '#c084fc');
      drawCanvasSparkle(ctx, cx, noseY, fw * 0.035, '#fef08a');
      break;
    }

    case 'devil_horns': {
      // Cheek blush
      drawCanvasBlush(ctx, leftCheekX, leftCheekY, fw * 0.22, fw * 0.15, 'rgba(239, 68, 68, 0.28)');
      drawCanvasBlush(ctx, rightCheekX, rightCheekY, fw * 0.22, fw * 0.15, 'rgba(239, 68, 68, 0.28)');

      // Cute Neon Red/Pink Devil Horns
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

      // Small heart on left cheek
      ctx.save();
      ctx.translate(leftCheekX, leftCheekY);
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      const hs = fw * 0.05;
      ctx.moveTo(0, hs * 0.3);
      ctx.bezierCurveTo(-hs, -hs * 0.8, -hs * 1.6, hs * 0.4, 0, hs * 1.5);
      ctx.bezierCurveTo(hs * 1.6, hs * 0.4, hs, -hs * 0.8, 0, hs * 0.3);
      ctx.fill();
      ctx.restore();
      break;
    }

    case 'heart_glasses': {
      // Chic heart sunglasses sitting at eye level
      const eyeY = cy - fh * 0.05;
      const glassW = fw * 0.36;
      const glassH = fh * 0.24;

      // Cheek blush beneath
      drawCanvasBlush(ctx, leftCheekX, leftCheekY + fh * 0.06, fw * 0.2, fw * 0.12, 'rgba(244, 63, 94, 0.2)');
      drawCanvasBlush(ctx, rightCheekX, rightCheekY + fh * 0.06, fw * 0.2, fw * 0.12, 'rgba(244, 63, 94, 0.2)');

      [-1, 1].forEach((side) => {
        ctx.save();
        ctx.translate(cx + side * fw * 0.23, eyeY);

        // Heart frame
        ctx.beginPath();
        const s = glassW * 0.5;
        ctx.moveTo(0, s * 0.2);
        ctx.bezierCurveTo(-s * 0.8, -s * 0.8, -s * 1.4, s * 0.5, 0, s * 1.25);
        ctx.bezierCurveTo(s * 1.4, s * 0.5, s * 0.8, -s * 0.8, 0, s * 0.2);

        // Tinted glass fill
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fill();

        // Aesthetic pink border
        ctx.lineWidth = Math.max(2.5, fw * 0.025);
        ctx.strokeStyle = '#f472b6';
        ctx.stroke();

        // Specular highlight
        ctx.beginPath();
        ctx.moveTo(-s * 0.6, -s * 0.2);
        ctx.quadraticCurveTo(-s * 0.3, -s * 0.5, 0, -s * 0.15);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = Math.max(1.5, fw * 0.015);
        ctx.stroke();

        ctx.restore();
      });

      // Bridge connection
      ctx.strokeStyle = '#f472b6';
      ctx.lineWidth = Math.max(2, fw * 0.02);
      ctx.beginPath();
      ctx.moveTo(cx - fw * 0.05, eyeY - fh * 0.02);
      ctx.quadraticCurveTo(cx, eyeY - fh * 0.04, cx + fw * 0.05, eyeY - fh * 0.02);
      ctx.stroke();
      break;
    }

    default:
      break;
  }

  ctx.restore();
}

// -----------------------------------------------------------------------------
// REAL-TIME ANIMATED SVG OVERLAY (Viewfinder 60fps Rendering)
// -----------------------------------------------------------------------------
export function FaceEffectOverlay({ effectId, anchor = {}, isMirrored = true }) {
  if (!effectId || effectId === 'none') return null;

  // Percentage coordinates within viewfinder container
  const cx = (anchor.cx ?? 0.5) * 100;
  const cy = (anchor.cy ?? 0.42) * 100;
  const fw = (anchor.fw ?? 0.38) * 100;
  const fh = (anchor.fh ?? 0.50) * 100;

  // Head top & cheek relative offsets
  const headTopY = cy - fh * 0.48;
  const leftCheekX = cx - fw * 0.32;
  const leftCheekY = cy + fh * 0.08;
  const rightCheekX = cx + fw * 0.32;
  const rightCheekY = cy + fh * 0.08;
  const noseY = cy + fh * 0.02;

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
          50% { transform: scale(1.08); }
        }
      `}</style>

      {/* ---------------- INSTAGRAM BUTTERFLY EFFECT ---------------- */}
      {effectId === 'butterfly_ig' && (
        <>
          {/* Soft Cheek Blush Overlay */}
          <div
            className="absolute rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${leftCheekX}%`,
              top: `${leftCheekY}%`,
              width: `${fw * 0.45}%`,
              height: `${fh * 0.28}%`,
              background: 'radial-gradient(circle, rgba(251, 113, 133, 0.38) 0%, rgba(251, 113, 133, 0) 70%)',
              filter: 'blur(8px)'
            }}
          />
          <div
            className="absolute rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${rightCheekX}%`,
              top: `${rightCheekY}%`,
              width: `${fw * 0.45}%`,
              height: `${fh * 0.28}%`,
              background: 'radial-gradient(circle, rgba(251, 113, 133, 0.38) 0%, rgba(251, 113, 133, 0) 70%)',
              filter: 'blur(8px)'
            }}
          />

          {/* Butterfly 1: Head Top Center (Fluttering above hair) */}
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

          {/* Butterfly 2: Head Top Left */}
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

          {/* Butterfly 3: Head Top Right */}
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

          {/* User Requested: Butterfly resting on LEFT cheek ("di kiri") */}
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

          {/* Small companion butterfly near right side */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${rightCheekX + fw * 0.16}%`,
              top: `${rightCheekY + fh * 0.12}%`,
              width: `${fw * 0.17}%`,
              transform: 'rotate(22deg)',
              animation: 'igFlutterBob 3.5s ease-in-out infinite 1.4s'
            }}
          >
            <SvgAnimatedButterfly size="100%" colorPrimary="#93c5fd" colorSecondary="#3b82f6" />
          </div>

          {/* Golden Twinkling Sparkles */}
          <SvgSparkleBadge x={`${cx - fw * 0.18}%`} y={`${headTopY - fh * 0.18}%`} size={18} delay="0s" />
          <SvgSparkleBadge x={`${cx + fw * 0.20}%`} y={`${headTopY - fh * 0.16}%`} size={20} delay="0.6s" />
          <SvgSparkleBadge x={`${cx}%`} y={`${headTopY - fh * 0.28}%`} size={24} delay="1.2s" />
          <SvgSparkleBadge x={`${leftCheekX + fw * 0.12}%`} y={`${leftCheekY - fh * 0.08}%`} size={16} delay="0.4s" />
          <SvgSparkleBadge x={`${rightCheekX - fw * 0.12}%`} y={`${rightCheekY - fh * 0.08}%`} size={16} delay="0.9s" />
          <SvgSparkleBadge x={`${cx}%`} y={`${noseY}%`} size={15} delay="1.5s" />
          <SvgSparkleBadge x={`${leftCheekX - fw * 0.18}%`} y={`${leftCheekY + fh * 0.14}%`} size={15} delay="0.7s" />
          <SvgSparkleBadge x={`${rightCheekX + fw * 0.08}%`} y={`${rightCheekY - fh * 0.16}%`} size={18} delay="1.1s" />
        </>
      )}

      {/* ---------------- MAHKOTA BUNGA & KUPU-KUPU ---------------- */}
      {effectId === 'flower_crown' && (
        <>
          <div
            className="absolute rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${leftCheekX}%`,
              top: `${leftCheekY}%`,
              width: `${fw * 0.4}%`,
              height: `${fh * 0.24}%`,
              background: 'radial-gradient(circle, rgba(244, 63, 94, 0.32) 0%, transparent 70%)',
              filter: 'blur(6px)'
            }}
          />
          <div
            className="absolute rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${rightCheekX}%`,
              top: `${rightCheekY}%`,
              width: `${fw * 0.4}%`,
              height: `${fh * 0.24}%`,
              background: 'radial-gradient(circle, rgba(244, 63, 94, 0.32) 0%, transparent 70%)',
              filter: 'blur(6px)'
            }}
          />

          {/* Floral Tiara Arch */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-1 drop-shadow-md"
            style={{
              left: `${cx}%`,
              top: `${headTopY + fh * 0.02}%`,
              width: `${fw * 0.95}%`
            }}
          >
            <span className="text-xl sm:text-2xl animate-pulse">🌸</span>
            <span className="text-2xl sm:text-3xl">🌺</span>
            <span className="text-xl sm:text-2xl">🌼</span>
            <span className="text-3xl sm:text-4xl">🌸</span>
            <span className="text-xl sm:text-2xl">🌼</span>
            <span className="text-2xl sm:text-3xl">🌺</span>
            <span className="text-xl sm:text-2xl animate-pulse">🌸</span>
          </div>

          {/* Butterfly on left head */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${cx - fw * 0.38}%`,
              top: `${headTopY - fh * 0.12}%`,
              width: `${fw * 0.24}%`,
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

          <SvgSparkleBadge x={`${cx}%`} y={`${headTopY - fh * 0.16}%`} size={22} delay="0s" />
          <SvgSparkleBadge x={`${cx + fw * 0.28}%`} y={`${headTopY - fh * 0.12}%`} size={18} delay="0.8s" />
        </>
      )}

      {/* ---------------- TELINGA KUCING IMUT ---------------- */}
      {effectId === 'cat_ears' && (
        <>
          {/* Cheek Blush */}
          <div
            className="absolute rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${leftCheekX}%`,
              top: `${leftCheekY}%`,
              width: `${fw * 0.45}%`,
              height: `${fh * 0.26}%`,
              background: 'radial-gradient(circle, rgba(251, 113, 133, 0.4) 0%, transparent 70%)',
              filter: 'blur(6px)'
            }}
          />
          <div
            className="absolute rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${rightCheekX}%`,
              top: `${rightCheekY}%`,
              width: `${fw * 0.45}%`,
              height: `${fh * 0.26}%`,
              background: 'radial-gradient(circle, rgba(251, 113, 133, 0.4) 0%, transparent 70%)',
              filter: 'blur(6px)'
            }}
          />

          {/* Left Cat Ear */}
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

          {/* Right Cat Ear */}
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

          {/* Whisker & Nose Centerpiece */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${cx}%`,
              top: `${noseY}%`,
              width: `${fw * 0.7}%`
            }}
          >
            <svg viewBox="0 0 160 50" fill="none" className="w-full h-auto drop-shadow-sm">
              {/* Nose */}
              <ellipse cx="80" cy="18" rx="8" ry="6" fill="#fb7185" />
              {/* Left Whiskers */}
              <line x1="68" y1="16" x2="10" y2="8" stroke="rgba(30,41,59,0.7)" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="66" y1="22" x2="5" y2="24" stroke="rgba(30,41,59,0.7)" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="68" y1="28" x2="15" y2="38" stroke="rgba(30,41,59,0.7)" strokeWidth="2.5" strokeLinecap="round" />
              {/* Right Whiskers */}
              <line x1="92" y1="16" x2="150" y2="8" stroke="rgba(30,41,59,0.7)" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="94" y1="22" x2="155" y2="24" stroke="rgba(30,41,59,0.7)" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="92" y1="28" x2="145" y2="38" stroke="rgba(30,41,59,0.7)" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </>
      )}

      {/* ---------------- ANGEL HALO & STARS ---------------- */}
      {effectId === 'angel_halo' && (
        <>
          <div
            className="absolute rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${leftCheekX}%`,
              top: `${leftCheekY}%`,
              width: `${fw * 0.4}%`,
              height: `${fh * 0.22}%`,
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.25) 0%, transparent 70%)',
              filter: 'blur(6px)'
            }}
          />
          <div
            className="absolute rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${rightCheekX}%`,
              top: `${rightCheekY}%`,
              width: `${fw * 0.4}%`,
              height: `${fh * 0.22}%`,
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.25) 0%, transparent 70%)',
              filter: 'blur(6px)'
            }}
          />

          {/* Floating Halo above head */}
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
          <SvgSparkleBadge x={`${leftCheekX}%`} y={`${leftCheekY}%`} size={16} delay="0.3s" />
          <SvgSparkleBadge x={`${rightCheekX}%`} y={`${rightCheekY}%`} size={16} delay="0.7s" />
        </>
      )}

      {/* ---------------- Y2K STAR HAIRCLIPS ---------------- */}
      {effectId === 'y2k_star' && (
        <>
          <div
            className="absolute rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${leftCheekX}%`,
              top: `${leftCheekY}%`,
              width: `${fw * 0.45}%`,
              height: `${fh * 0.25}%`,
              background: 'radial-gradient(circle, rgba(236, 72, 153, 0.32) 0%, transparent 70%)',
              filter: 'blur(6px)'
            }}
          />
          <div
            className="absolute rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${rightCheekX}%`,
              top: `${rightCheekY}%`,
              width: `${fw * 0.45}%`,
              height: `${fh * 0.25}%`,
              background: 'radial-gradient(circle, rgba(236, 72, 153, 0.32) 0%, transparent 70%)',
              filter: 'blur(6px)'
            }}
          />

          {/* Metallic Star Clips in hair (left side) */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 drop-shadow-md animate-pulse"
            style={{
              left: `${cx - fw * 0.36}%`,
              top: `${headTopY + fh * 0.04}%`,
              width: `${fw * 0.22}%`
            }}
          >
            <SvgStarIcon color="#f472b6" />
          </div>
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 drop-shadow-md"
            style={{
              left: `${cx - fw * 0.44}%`,
              top: `${headTopY + fh * 0.12}%`,
              width: `${fw * 0.16}%`
            }}
          >
            <SvgStarIcon color="#38bdf8" />
          </div>
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 drop-shadow-md"
            style={{
              left: `${cx - fw * 0.28}%`,
              top: `${headTopY - fh * 0.09}%`,
              width: `${fw * 0.18}%`
            }}
          >
            <SvgStarIcon color="#facc15" />
          </div>

          {/* Star Clip Right side */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 drop-shadow-md"
            style={{
              left: `${cx + fw * 0.38}%`,
              top: `${headTopY + fh * 0.04}%`,
              width: `${fw * 0.2}%`
            }}
          >
            <SvgStarIcon color="#c084fc" />
          </div>

          <SvgSparkleBadge x={`${leftCheekX}%`} y={`${leftCheekY}%`} size={18} delay="0s" />
          <SvgSparkleBadge x={`${rightCheekX}%`} y={`${rightCheekY}%`} size={18} delay="0.5s" />
          <SvgSparkleBadge x={`${cx}%`} y={`${noseY}%`} size={15} delay="1s" />
        </>
      )}

      {/* ---------------- CUTE NEON DEVIL ---------------- */}
      {effectId === 'devil_horns' && (
        <>
          <div
            className="absolute rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${leftCheekX}%`,
              top: `${leftCheekY}%`,
              width: `${fw * 0.45}%`,
              height: `${fh * 0.25}%`,
              background: 'radial-gradient(circle, rgba(239, 68, 68, 0.32) 0%, transparent 70%)',
              filter: 'blur(6px)'
            }}
          />
          <div
            className="absolute rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${rightCheekX}%`,
              top: `${rightCheekY}%`,
              width: `${fw * 0.45}%`,
              height: `${fh * 0.25}%`,
              background: 'radial-gradient(circle, rgba(239, 68, 68, 0.32) 0%, transparent 70%)',
              filter: 'blur(6px)'
            }}
          />

          {/* Left Horn */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]"
            style={{
              left: `${cx - fw * 0.28}%`,
              top: `${headTopY - fh * 0.08}%`,
              width: `${fw * 0.22}%`
            }}
          >
            <svg viewBox="0 0 60 70" fill="none" className="w-full h-auto">
              <path
                d="M 10 65 Q 18 25 50 5 Q 35 25 40 65 Z"
                fill="url(#devilHornGrad)"
              />
              <defs>
                <linearGradient id="devilHornGrad" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#e11d48" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Right Horn */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]"
            style={{
              left: `${cx + fw * 0.28}%`,
              top: `${headTopY - fh * 0.08}%`,
              width: `${fw * 0.22}%`,
              transform: 'scaleX(-1)'
            }}
          >
            <svg viewBox="0 0 60 70" fill="none" className="w-full h-auto">
              <path
                d="M 10 65 Q 18 25 50 5 Q 35 25 40 65 Z"
                fill="url(#devilHornGrad)"
              />
            </svg>
          </div>

          {/* Cheek Little Heart */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 text-rose-500 font-bold text-sm sm:text-base animate-pulse"
            style={{
              left: `${leftCheekX}%`,
              top: `${leftCheekY}%`
            }}
          >
            ♥
          </div>
        </>
      )}

      {/* ---------------- HEART SUNGLASSES ---------------- */}
      {effectId === 'heart_glasses' && (
        <>
          <div
            className="absolute rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${leftCheekX}%`,
              top: `${leftCheekY + fh * 0.06}%`,
              width: `${fw * 0.4}%`,
              height: `${fh * 0.22}%`,
              background: 'radial-gradient(circle, rgba(244, 63, 94, 0.28) 0%, transparent 70%)',
              filter: 'blur(6px)'
            }}
          />
          <div
            className="absolute rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${rightCheekX}%`,
              top: `${rightCheekY + fh * 0.06}%`,
              width: `${fw * 0.4}%`,
              height: `${fh * 0.22}%`,
              background: 'radial-gradient(circle, rgba(244, 63, 94, 0.28) 0%, transparent 70%)',
              filter: 'blur(6px)'
            }}
          />

          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 drop-shadow-xl"
            style={{
              left: `${cx}%`,
              top: `${cy - fh * 0.05}%`,
              width: `${fw * 0.88}%`
            }}
          >
            <svg viewBox="0 0 200 80" fill="none" className="w-full h-auto">
              {/* Left Lens */}
              <path
                d="M 50 20 C 35 5 15 5 5 20 C -10 40 25 65 50 78 C 75 65 110 40 95 20 C 85 5 65 5 50 20 Z"
                fill="rgba(15, 23, 42, 0.88)"
                stroke="#f472b6"
                strokeWidth="4"
              />
              {/* Left Reflection */}
              <path
                d="M 22 25 Q 38 15 50 22"
                stroke="rgba(255,255,255,0.45)"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Bridge */}
              <path
                d="M 90 28 Q 100 24 110 28"
                stroke="#f472b6"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Right Lens */}
              <path
                d="M 150 20 C 135 5 115 5 105 20 C 90 40 125 65 150 78 C 175 65 210 40 195 20 C 185 5 165 5 150 20 Z"
                fill="rgba(15, 23, 42, 0.88)"
                stroke="#f472b6"
                strokeWidth="4"
              />
              {/* Right Reflection */}
              <path
                d="M 122 25 Q 138 15 150 22"
                stroke="rgba(255,255,255,0.45)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// SVG ATOM COMPONENTS (Wings Flap & Twinkle Stars)
// -----------------------------------------------------------------------------

function SvgAnimatedButterfly({ size = '100%', colorPrimary = '#38bdf8', colorSecondary = '#0284c7' }) {
  return (
    <svg viewBox="0 0 100 85" fill="none" style={{ width: size, height: 'auto' }} className="drop-shadow-sm">
      {/* Left Wing (Flaps 3D) */}
      <g style={{ transformOrigin: '50px 42px', animation: 'igFlapWingLeft 0.35s ease-in-out infinite' }}>
        <path
          d="M 48 38 C 30 10 5 18 8 40 C 12 55 35 60 48 45 Z"
          fill={colorPrimary}
          stroke="#0f172a"
          strokeWidth="1.2"
        />
        <path
          d="M 48 44 C 32 50 16 65 26 78 C 38 82 46 62 48 48 Z"
          fill={colorSecondary}
          stroke="#0f172a"
          strokeWidth="1.2"
        />
        {/* Veins */}
        <path d="M 46 40 Q 28 28 15 26" stroke="rgba(15,23,42,0.6)" strokeWidth="0.8" />
        <path d="M 46 42 Q 26 44 14 46" stroke="rgba(15,23,42,0.6)" strokeWidth="0.8" />
        {/* Edge Dots */}
        <circle cx="12" cy="30" r="1.5" fill="#ffffff" />
        <circle cx="10" cy="40" r="1.5" fill="#ffffff" />
        <circle cx="20" cy="74" r="1.2" fill="#ffffff" />
      </g>

      {/* Right Wing (Flaps 3D) */}
      <g style={{ transformOrigin: '50px 42px', animation: 'igFlapWingRight 0.35s ease-in-out infinite' }}>
        <path
          d="M 52 38 C 70 10 95 18 92 40 C 88 55 65 60 52 45 Z"
          fill={colorPrimary}
          stroke="#0f172a"
          strokeWidth="1.2"
        />
        <path
          d="M 52 44 C 68 50 84 65 74 78 C 62 82 54 62 52 48 Z"
          fill={colorSecondary}
          stroke="#0f172a"
          strokeWidth="1.2"
        />
        {/* Veins */}
        <path d="M 54 40 Q 72 28 85 26" stroke="rgba(15,23,42,0.6)" strokeWidth="0.8" />
        <path d="M 54 42 Q 74 44 86 46" stroke="rgba(15,23,42,0.6)" strokeWidth="0.8" />
        {/* Edge Dots */}
        <circle cx="88" cy="30" r="1.5" fill="#ffffff" />
        <circle cx="90" cy="40" r="1.5" fill="#ffffff" />
        <circle cx="80" cy="74" r="1.2" fill="#ffffff" />
      </g>

      {/* Butterfly Body & Antennae */}
      <ellipse cx="50" cy="44" rx="2.5" ry="14" fill="#0f172a" />
      <circle cx="50" cy="28" r="3.2" fill="#0f172a" />
      <path d="M 50 27 Q 44 14 38 12" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M 50 27 Q 56 14 62 12" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="38" cy="12" r="1.2" fill="#93c5fd" />
      <circle cx="62" cy="12" r="1.2" fill="#93c5fd" />
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
        <path
          d="M 12 0 Q 13 11 24 12 Q 13 13 12 24 Q 11 13 0 12 Q 11 11 12 0 Z"
          fill="#fef08a"
        />
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
      {/* Outer Fur */}
      <path
        d="M 10 85 Q 25 35 68 8 Q 62 45 65 85 Z"
        fill="#ffffff"
        stroke="rgba(0,0,0,0.08)"
        strokeWidth="1.5"
      />
      {/* Inner Pink */}
      <path
        d="M 22 80 Q 32 45 60 25 Q 56 55 58 80 Z"
        fill="#f472b6"
      />
    </svg>
  );
}
