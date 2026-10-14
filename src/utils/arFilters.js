/**
 * High-Performance Vector & Procedural Augmented Reality Face Filters
 * Perfectly mapped to MediaPipe 468+ Facial Landmarks
 * Featuring Photographic Blending (Soft-Light / Multiply), Elevated 3D Head Crowns,
 * and Authentic Instagram / TikTok Aesthetics.
 */

export const AR_FILTERS = [
  {
    id: 'none',
    name: 'Asli Kamera',
    tag: 'Natural',
    icon: '✨',
    badge: 'Off',
    description: 'Kamera HD Natural tanpa filter AR'
  },
  {
    id: 'pink_tea',
    name: 'Pink Tea :-)',
    tag: 'pink tea :-)',
    icon: '🤎',
    badge: 'Trending',
    description: 'Mahkota hati wine-burgundy melayang di atas rambut & soft-light rose blush'
  },
  {
    id: 'glitter_dog',
    name: 'Glitter Puppy',
    tag: '!) Glitter pack',
    icon: '🐶',
    badge: 'Popular',
    description: 'Telinga floppy & hidung puppy, glitter sparkle berkilau, dan natural blush'
  },
  {
    id: 'denim_glasses',
    name: 'Denim Shades',
    tag: 'Denim Y2K',
    icon: '🕶️',
    badge: 'Trendy',
    description: 'Kacamata denim Y2K di dahi, bintik micro-freckles natural, & peach blush'
  },
  {
    id: 'blue_bird',
    name: 'Blue Bird',
    tag: 'blue bird',
    icon: '🕊️',
    badge: 'Aesthetic',
    description: 'Burung biru 3D terbang mengitari kepala di atas rambut & porcelain pink glow'
  },
  {
    id: 'heart_crown',
    name: 'Heart Crown',
    tag: 'Good Skin+HeartCrown',
    icon: '👑',
    badge: 'Cute',
    description: 'Mahkota hati neon bersinar melayang di atas kepala & soft radiant blush'
  },
  {
    id: 'capuccino',
    name: 'Capuccino',
    tag: 'foreversleeep',
    icon: '☕',
    badge: 'Cozy Cafe',
    description: 'Tone cafe latte hangat, vintage film dust & retro grain ala foreversleeep'
  },
  {
    id: 'el_filme',
    name: 'El Filme',
    tag: 'supernuay',
    icon: '🎞️',
    badge: '90s Gold',
    description: 'Golden hour sunlight glow, dreamy bloom & 90s star sparkles ala supernuay'
  }
];

/**
 * Natural Photographic Blush Blend
 * Uses 'soft-light' and 'multiply' blend modes to preserve natural skin pores,
 * luminance, and texture — avoiding artificial clown-like solid disks.
 */
function drawNaturalBlush(ctx, x, y, rx, ry, angle, colorRgb = '240, 90, 120', intensity = 0.5) {
  if (!x || !y) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // 1. Soft-light blend mode: smoothly warms and flushes skin while keeping pores and skin tones
  ctx.globalCompositeOperation = 'soft-light';
  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(rx, ry));
  grad.addColorStop(0, `rgba(${colorRgb}, ${intensity})`);
  grad.addColorStop(0.35, `rgba(${colorRgb}, ${intensity * 0.7})`);
  grad.addColorStop(0.7, `rgba(${colorRgb}, ${intensity * 0.2})`);
  grad.addColorStop(1, `rgba(${colorRgb}, 0)`);

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Subtle multiply blend mode in the core: creates realistic depth without chalkiness
  ctx.globalCompositeOperation = 'multiply';
  const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(rx, ry) * 0.6);
  coreGrad.addColorStop(0, `rgba(${colorRgb}, ${intensity * 0.22})`);
  coreGrad.addColorStop(1, `rgba(${colorRgb}, 0)`);

  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.ellipse(0, 0, rx * 0.6, ry * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * 4-Point Sparkling Star with Gaussian Glow
 */
function drawSparkleStar(ctx, cx, cy, size, alpha = 1, rotation = 0, colorHex = '#ffffff') {
  if (alpha <= 0.05 || size <= 0.5) return;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.globalAlpha = Math.min(1, Math.max(0, alpha));

  const half = size;
  const pinch = size * 0.16;

  ctx.beginPath();
  ctx.moveTo(0, -half);
  ctx.quadraticCurveTo(0, -pinch, pinch, 0);
  ctx.quadraticCurveTo(0, pinch, 0, half);
  ctx.quadraticCurveTo(0, pinch, -pinch, 0);
  ctx.quadraticCurveTo(0, -pinch, 0, -half);
  ctx.closePath();

  ctx.fillStyle = colorHex;
  ctx.shadowColor = 'rgba(255, 235, 190, 0.9)';
  ctx.shadowBlur = size * 0.75;
  ctx.fill();

  // Soft center core
  ctx.beginPath();
  ctx.arc(0, 0, pinch * 0.65, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  ctx.restore();
}

/**
 * 3D Shaded Heart with Specular Curves
 */
function draw3DHeart(ctx, x, y, size, colorTop, colorBot, glowColor = null, glowBlur = 0) {
  ctx.save();
  ctx.translate(x, y);

  if (glowColor && glowBlur > 0) {
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = glowBlur;
  }

  const s = size / 2;
  const grad = ctx.createLinearGradient(0, -s * 0.6, 0, s * 1.2);
  grad.addColorStop(0, colorTop);
  grad.addColorStop(1, colorBot);
  ctx.fillStyle = grad;

  ctx.beginPath();
  ctx.moveTo(0, s * 0.35);
  ctx.bezierCurveTo(-s * 0.95, -s * 0.55, -s * 1.1, 0.48, 0, s * 1.2);
  ctx.bezierCurveTo(s * 1.1, 0.48, s * 0.95, -s * 0.55, 0, s * 0.35);
  ctx.closePath();
  ctx.fill();

  // Subtle specular highlight arc on upper-left lobe
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.arc(-s * 0.35, -s * 0.12, s * 0.28, Math.PI * 0.8, Math.PI * 1.8);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = Math.max(1, s * 0.1);
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.restore();
}

/**
 * Filter 1: Pink Tea :-) (by dingmintt)
 * Multi-tiered velvet wine-burgundy hearts hovering in an arc halo ABOVE the hair crown,
 * with natural soft-light rose-tea blush on true cheek apples.
 */
function renderPinkTea(ctx, pose, time) {
  const { angle, eyeDist, headTop, leftCheekApple, rightCheekApple, noseTip } = pose;

  // 1. Natural Soft-Light Rose-Tea Blush on true cheek apples
  const blushRx = eyeDist * 0.36;
  const blushRy = eyeDist * 0.24;
  drawNaturalBlush(ctx, leftCheekApple.x, leftCheekApple.y, blushRx, blushRy, angle, '210, 70, 95', 0.52);
  drawNaturalBlush(ctx, rightCheekApple.x, rightCheekApple.y, blushRx, blushRy, angle, '210, 70, 95', 0.52);
  drawNaturalBlush(ctx, noseTip.x, noseTip.y - eyeDist * 0.06, eyeDist * 0.18, eyeDist * 0.12, angle, '210, 70, 95', 0.35);

  // 2. Floating Tiara of Velvet Wine Hearts hovering gracefully ABOVE the hair
  // Using headTop as anchor with an expansive arc radius so it floats above the hair volume
  const crownBase = headTop;
  const baseArcRadius = eyeDist * 1.02;

  const pinkTeaHearts = [
    // Far-left flank floating above temple/ear
    { t: -0.92, rMult: 0.88, sizeMult: 0.38, rotOffset: -0.32, colorTop: '#8c2239', colorBot: '#631322', bobPhase: 0.2 },
    // Mid-left lower tier
    { t: -0.74, rMult: 0.85, sizeMult: 0.34, rotOffset: -0.24, colorTop: '#9a2842', colorBot: '#6e1628', bobPhase: 1.1 },
    // Mid-left small accent
    { t: -0.60, rMult: 0.72, sizeMult: 0.22, rotOffset: -0.16, colorTop: '#ab324c', colorBot: '#7c1a2e', bobPhase: 2.3 },
    // Mid-left prominent heart
    { t: -0.46, rMult: 1.04, sizeMult: 0.46, rotOffset: -0.18, colorTop: '#831e34', colorBot: '#5c1020', bobPhase: 0.8 },
    // Center-left apex (high heart)
    { t: -0.24, rMult: 1.12, sizeMult: 0.50, rotOffset: -0.06, colorTop: '#92233c', colorBot: '#661425', bobPhase: 1.7 },
    // Center-left lower accent
    { t: -0.12, rMult: 0.80, sizeMult: 0.26, rotOffset: 0.04, colorTop: '#a42a45', colorBot: '#75172b', bobPhase: 3.1 },
    // Center-right apex (high prominent heart)
    { t: 0.10, rMult: 1.10, sizeMult: 0.48, rotOffset: 0.10, colorTop: '#831e34', colorBot: '#5c1020', bobPhase: 0.5 },
    // Mid-right upper tier
    { t: 0.28, rMult: 1.05, sizeMult: 0.46, rotOffset: 0.20, colorTop: '#90223a', colorBot: '#661425', bobPhase: 2.0 },
    // Mid-right lower accent
    { t: 0.36, rMult: 0.76, sizeMult: 0.24, rotOffset: 0.16, colorTop: '#a22944', colorBot: '#74172b', bobPhase: 1.4 },
    // Right upper tier
    { t: 0.50, rMult: 1.00, sizeMult: 0.44, rotOffset: 0.26, colorTop: '#841f35', colorBot: '#5e1121', bobPhase: 2.7 },
    // Right mid tier
    { t: 0.66, rMult: 0.88, sizeMult: 0.34, rotOffset: 0.30, colorTop: '#92233c', colorBot: '#6a1527', bobPhase: 0.9 },
    // Right lower accent
    { t: 0.78, rMult: 0.74, sizeMult: 0.26, rotOffset: 0.36, colorTop: '#a62c47', colorBot: '#78182d', bobPhase: 1.9 },
    // Far-right flank floating above right temple/ear
    { t: 0.88, rMult: 0.66, sizeMult: 0.22, rotOffset: 0.42, colorTop: '#8c2239', colorBot: '#631322', bobPhase: 3.3 }
  ];

  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);

  pinkTeaHearts.forEach((h, idx) => {
    // Gentle breathing floating motion
    const bob = Math.sin(time * 2.8 + h.bobPhase) * (eyeDist * 0.024);
    const r = baseArcRadius * h.rMult + bob;

    const localX = Math.sin(h.t) * r;
    const localY = -Math.cos(h.t) * r * 0.65;

    const hx = crownBase.x + (localX * cosA - localY * sinA);
    const hy = crownBase.y + (localX * sinA + localY * cosA);

    const heartSize = eyeDist * h.sizeMult * (1 + 0.04 * Math.sin(time * 3 + idx));
    const rot = angle + h.rotOffset;

    ctx.save();
    ctx.translate(hx, hy);
    ctx.rotate(rot);

    // Matte velvet drop shadow
    ctx.shadowColor = 'rgba(40, 10, 18, 0.45)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 3;

    draw3DHeart(ctx, 0, 0, heartSize, h.colorTop, h.colorBot);
    ctx.restore();
  });
}

/**
 * Filter 2: Heart Crown (by ozy635)
 * Glowing floating neon hearts forming an arched tiara halo high above the hair crown
 */
function renderHeartCrown(ctx, pose, time) {
  const { angle, eyeDist, headTop, leftCheekApple, rightCheekApple } = pose;

  // 1. Radiant Coral-Pink Blush on true cheek apples
  const blushRx = eyeDist * 0.36;
  const blushRy = eyeDist * 0.24;
  drawNaturalBlush(ctx, leftCheekApple.x, leftCheekApple.y, blushRx, blushRy, angle, '255, 90, 130', 0.55);
  drawNaturalBlush(ctx, rightCheekApple.x, rightCheekApple.y, blushRx, blushRy, angle, '255, 90, 130', 0.55);

  // 2. Halo of Glowing Translucent Neon Hearts floating high above the hair
  const heartCount = 8;
  const crownBase = headTop;
  const arcRadius = eyeDist * 1.05;

  const colors = [
    { top: '#ff5983', bot: '#e11d48' },
    { top: '#ff6b91', bot: '#f43f5e' },
    { top: '#ff3d6e', bot: '#be123c' },
    { top: '#ff5983', bot: '#e11d48' },
    { top: '#ff5983', bot: '#e11d48' },
    { top: '#ff3d6e', bot: '#be123c' },
    { top: '#ff6b91', bot: '#f43f5e' },
    { top: '#ff5983', bot: '#e11d48' }
  ];

  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);

  for (let i = 0; i < heartCount; i++) {
    const tNorm = (i / (heartCount - 1)) * 2 - 1; // -1 to +1
    const heartAngle = tNorm * 0.88;

    const bob = Math.sin(time * 3.2 + i * 0.9) * (eyeDist * 0.035);
    const r = arcRadius + bob;

    const localX = Math.sin(heartAngle) * r;
    const localY = -Math.cos(heartAngle) * r * 0.62;

    const hx = crownBase.x + (localX * cosA - localY * sinA);
    const hy = crownBase.y + (localX * sinA + localY * cosA);

    const centerFactor = 1 - Math.abs(tNorm) * 0.25;
    const pulseFactor = 1 + 0.08 * Math.sin(time * 4.5 + i * 1.2);
    const heartSize = eyeDist * 0.38 * centerFactor * pulseFactor;
    const rot = angle + heartAngle * 0.42;

    ctx.save();
    ctx.translate(hx, hy);
    ctx.rotate(rot);

    draw3DHeart(
      ctx,
      0,
      0,
      heartSize,
      colors[i].top,
      colors[i].bot,
      'rgba(255, 60, 115, 0.85)',
      heartSize * 0.75
    );

    ctx.restore();
  }
}

/**
 * Filter 3: Denim Shades (by e.wi.n)
 * 3D Y2K Rectangular Designer Sunglasses tilted stylishly on hairline/forehead,
 * organic micro-freckles, and peachy soft-light blush
 */
function renderDenimGlasses(ctx, pose, time) {
  const { angle, eyeDist, forehead, leftCheekApple, rightCheekApple, noseTip, noseBridge, upVector } = pose;

  // 1. Warm Peachy Soft-Light Blush on true cheek apples & nose
  const blushRx = eyeDist * 0.38;
  const blushRy = eyeDist * 0.22;
  drawNaturalBlush(ctx, leftCheekApple.x, leftCheekApple.y, blushRx, blushRy, angle, '250, 115, 80', 0.48);
  drawNaturalBlush(ctx, rightCheekApple.x, rightCheekApple.y, blushRx, blushRy, angle, '250, 115, 80', 0.48);
  drawNaturalBlush(ctx, noseTip.x, noseTip.y - eyeDist * 0.08, eyeDist * 0.22, eyeDist * 0.12, angle, '250, 115, 80', 0.30);

  // 2. Delicate Micro-Freckles (organic speckles, blend mode multiply)
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);
  const bridgeCenter = noseBridge || forehead;

  // 35 realistic micro-freckle coordinates mapped across bridge and cheek tops
  const microFreckles = [
    { x: -0.24, y: 0.12, r: 0.9, a: 0.45 },
    { x: -0.32, y: 0.16, r: 1.1, a: 0.40 },
    { x: -0.18, y: 0.20, r: 1.3, a: 0.50 },
    { x: -0.38, y: 0.22, r: 0.8, a: 0.35 },
    { x: -0.12, y: 0.10, r: 1.0, a: 0.45 },
    { x: -0.06, y: 0.06, r: 1.2, a: 0.50 },
    { x: 0.0, y: 0.05, r: 1.1, a: 0.55 },
    { x: 0.06, y: 0.08, r: 1.0, a: 0.45 },
    { x: 0.14, y: 0.12, r: 1.2, a: 0.50 },
    { x: 0.22, y: 0.15, r: 0.9, a: 0.40 },
    { x: 0.30, y: 0.18, r: 1.3, a: 0.50 },
    { x: 0.36, y: 0.22, r: 0.8, a: 0.35 },
    { x: 0.18, y: 0.24, r: 1.1, a: 0.45 },
    { x: -0.04, y: 0.16, r: 1.0, a: 0.45 },
    { x: 0.05, y: 0.18, r: 1.2, a: 0.50 },
    { x: -0.26, y: 0.26, r: 0.8, a: 0.35 },
    { x: 0.25, y: 0.26, r: 0.9, a: 0.40 },
    { x: -0.15, y: 0.28, r: 1.0, a: 0.40 },
    { x: 0.12, y: 0.28, r: 1.1, a: 0.45 },
    { x: -0.02, y: 0.26, r: 0.9, a: 0.40 },
    { x: -0.20, y: 0.16, r: 0.7, a: 0.35 },
    { x: 0.19, y: 0.18, r: 0.8, a: 0.35 },
    { x: -0.28, y: 0.20, r: 1.0, a: 0.40 },
    { x: 0.28, y: 0.20, r: 1.1, a: 0.45 }
  ];

  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  microFreckles.forEach((pt) => {
    const lx = pt.x * eyeDist;
    const ly = pt.y * eyeDist;
    const wx = bridgeCenter.x + (lx * cosA - ly * sinA);
    const wy = bridgeCenter.y + (lx * sinA + ly * cosA);

    ctx.beginPath();
    ctx.arc(wx, wy, pt.r * (eyeDist / 135), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(120, 68, 38, ${pt.a})`;
    ctx.fill();
  });
  ctx.restore();

  // 3. 3D Y2K Rectangular Denim Sunglasses resting on hairline/forehead
  const glassesCenter = {
    x: forehead.x + upVector.x * (eyeDist * 0.32),
    y: forehead.y + upVector.y * (eyeDist * 0.32)
  };

  const totalWidth = eyeDist * 1.42;
  const totalHeight = eyeDist * 0.46;
  const frameThick = eyeDist * 0.07;
  const lensWidth = (totalWidth - frameThick * 2.8) / 2;
  const lensHeight = totalHeight - frameThick * 2;
  const cornerRad = eyeDist * 0.06;

  ctx.save();
  ctx.translate(glassesCenter.x, glassesCenter.y);
  ctx.rotate(angle);

  // Realistic drop shadow under frame
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 5;

  const roundRect = (rx, ry, rw, rh, rad) => {
    ctx.beginPath();
    ctx.moveTo(rx + rad, ry);
    ctx.lineTo(rx + rw - rad, ry);
    ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + rad);
    ctx.lineTo(rx + rw, ry + rh - rad);
    ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - rad, ry + rh);
    ctx.lineTo(rx + rad, ry + rh);
    ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - rad);
    ctx.lineTo(rx, ry + rad);
    ctx.quadraticCurveTo(rx, ry, rx + rad, ry);
    ctx.closePath();
  };

  // Outer frame body with 3D denim gradient & metallic bevel
  roundRect(-totalWidth / 2, -totalHeight / 2, totalWidth, totalHeight, cornerRad * 1.3);
  const frameGrad = ctx.createLinearGradient(-totalWidth / 2, -totalHeight / 2, totalWidth / 2, totalHeight / 2);
  frameGrad.addColorStop(0, '#5a84a6');
  frameGrad.addColorStop(0.3, '#436987');
  frameGrad.addColorStop(0.7, '#345570');
  frameGrad.addColorStop(1, '#274258');
  ctx.fillStyle = frameGrad;
  ctx.fill();

  // Top edge specular bevel highlight
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-totalWidth / 2 + cornerRad, -totalHeight / 2 + 1);
  ctx.lineTo(totalWidth / 2 - cornerRad, -totalHeight / 2 + 1);
  ctx.stroke();

  // Metallic Silver Hinge Studs on the temples
  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.arc(-totalWidth / 2 + frameThick * 0.45, -totalHeight * 0.12, 1.8, 0, Math.PI * 2);
  ctx.arc(totalWidth / 2 - frameThick * 0.45, -totalHeight * 0.12, 1.8, 0, Math.PI * 2);
  ctx.fill();

  // Dual Tinted Translucent Lenses with Glass Glare
  const leftLensX = -totalWidth / 2 + frameThick;
  const rightLensX = frameThick * 0.4;
  const lensY = -totalHeight / 2 + frameThick;

  [leftLensX, rightLensX].forEach((lx) => {
    roundRect(lx, lensY, lensWidth, lensHeight, cornerRad);

    // Dark translucent lens (lets forehead/hair breathe through slightly)
    const lensGrad = ctx.createLinearGradient(lx, lensY, lx + lensWidth, lensY + lensHeight);
    lensGrad.addColorStop(0, 'rgba(20, 32, 45, 0.72)');
    lensGrad.addColorStop(1, 'rgba(12, 20, 30, 0.82)');
    ctx.fillStyle = lensGrad;
    ctx.fill();

    // Inner rim bevel stroke
    ctx.strokeStyle = 'rgba(110, 160, 195, 0.45)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Diagonal Glass Glare Streaks
    ctx.save();
    ctx.clip();

    ctx.beginPath();
    ctx.moveTo(lx + lensWidth * 0.2, lensY);
    ctx.lineTo(lx + lensWidth * 0.45, lensY);
    ctx.lineTo(lx + lensWidth * 0.15, lensY + lensHeight);
    ctx.lineTo(lx - lensWidth * 0.1, lensY + lensHeight);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(lx + lensWidth * 0.58, lensY);
    ctx.lineTo(lx + lensWidth * 0.75, lensY);
    ctx.lineTo(lx + lensWidth * 0.45, lensY + lensHeight);
    ctx.lineTo(lx + lensWidth * 0.28, lensY + lensHeight);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fill();

    ctx.restore();
  });

  ctx.restore();
}

/**
 * Filter 4: Blue Bird (by princessaliha)
 * 3D glossy cartoon blue birds orbiting in an expansive halo HIGH ABOVE the hair crown
 */
function renderBlueBirds(ctx, pose, time) {
  const { angle, eyeDist, hoverCrown, leftCheekApple, rightCheekApple } = pose;

  // 1. Natural Soft-Light Porcelain Pink Blush on true cheek apples
  const blushRx = eyeDist * 0.36;
  const blushRy = eyeDist * 0.24;
  drawNaturalBlush(ctx, leftCheekApple.x, leftCheekApple.y, blushRx, blushRy, angle, '255, 105, 150', 0.50);
  drawNaturalBlush(ctx, rightCheekApple.x, rightCheekApple.y, blushRx, blushRy, angle, '255, 105, 150', 0.50);

  // 2. Expansive Halo Orbit hovering high above the hair crown
  const orbitCenter = hoverCrown;
  const radiusX = eyeDist * 1.18;
  const radiusY = eyeDist * 0.44;
  const numBirds = 5;

  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);

  for (let i = 0; i < numBirds; i++) {
    const orbitAngle = time * 1.2 + (i * (Math.PI * 2)) / numBirds;
    const elX = Math.cos(orbitAngle) * radiusX;
    const elY = Math.sin(orbitAngle) * radiusY;

    const birdX = orbitCenter.x + (elX * cosA - elY * sinA);
    const birdY = orbitCenter.y + (elX * sinA + elY * cosA);

    // 3D Depth perspective: birds in front are larger with richer contrast
    const depth = (Math.sin(orbitAngle) + 1) / 2; // 0 (back) to 1 (front)
    const scale = (0.85 + 0.35 * depth) * (eyeDist / 125);

    ctx.save();
    ctx.translate(birdX, birdY);
    ctx.rotate(angle + Math.sin(time * 3 + i) * 0.15);
    ctx.scale(scale, scale);

    const movingRight = Math.cos(orbitAngle) < 0;
    if (!movingRight) ctx.scale(-1, 1);

    // Soft 3D drop shadow
    ctx.shadowColor = 'rgba(2, 132, 199, 0.4)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 3;

    // 3D Chubby Bird Body
    ctx.beginPath();
    ctx.ellipse(0, 0, 16, 12, 0, 0, Math.PI * 2);
    const bodyGrad = ctx.createLinearGradient(-16, -10, 16, 12);
    bodyGrad.addColorStop(0, '#7dd3fc');
    bodyGrad.addColorStop(0.4, '#38bdf8');
    bodyGrad.addColorStop(1, '#0284c7');
    ctx.fillStyle = bodyGrad;
    ctx.fill();

    // Specular body highlight arc
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(0, -5, 11, Math.PI * 0.9, Math.PI * 1.8);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Pointed Tail Feathers
    ctx.beginPath();
    ctx.moveTo(-13, -2);
    ctx.lineTo(-26, -10);
    ctx.lineTo(-21, 2);
    ctx.lineTo(-25, 8);
    ctx.lineTo(-12, 4);
    ctx.closePath();
    ctx.fillStyle = '#0284c7';
    ctx.fill();

    // Fluttering 3D Wing
    const wingFlap = Math.sin(time * 12 + i * 2) * 0.55;
    ctx.save();
    ctx.translate(-2, -3);
    ctx.rotate(wingFlap);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-5, -17, 13, -19, 9, -2);
    ctx.closePath();
    ctx.fillStyle = '#0369a1';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(4, -10, 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.fill();
    ctx.restore();

    // Beak (bright sunny yellow)
    ctx.beginPath();
    ctx.moveTo(14, -2);
    ctx.lineTo(24, 2);
    ctx.lineTo(14, 6);
    ctx.closePath();
    ctx.fillStyle = '#facc15';
    ctx.fill();

    // Glossy Cartoon Eye
    ctx.beginPath();
    ctx.arc(9, -3, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(10.2, -4.2, 1.2, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Soft pink cheek dot on bird
    ctx.beginPath();
    ctx.arc(5, 3, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(244, 114, 182, 0.65)';
    ctx.fill();

    // Twinkling fairy dust sparkle behind bird
    if (i % 2 === 0) {
      drawSparkleStar(ctx, -28, 4, 8, 0.6 + 0.4 * Math.sin(time * 4 + i), time, '#ffffff');
    }

    ctx.restore();
  }
}

/**
 * Filter 5: Glitter Puppy (by re_mini_scene)
 * Realistic floppy ears draping naturally from head corners, 3D button nose on nose tip,
 * delicate fine glitter sparkle dust across cheeks, and soft rosy blush
 */
function renderGlitterDog(ctx, pose, time) {
  const { angle, eyeDist, headTop, leftCheekApple, rightCheekApple, noseTip, noseBridge } = pose;

  // 1. Natural Soft-Light Rosy Blush on true cheek apples
  const blushRx = eyeDist * 0.36;
  const blushRy = eyeDist * 0.24;
  drawNaturalBlush(ctx, leftCheekApple.x, leftCheekApple.y, blushRx, blushRy, angle, '250, 95, 135', 0.52);
  drawNaturalBlush(ctx, rightCheekApple.x, rightCheekApple.y, blushRx, blushRy, angle, '250, 95, 135', 0.52);

  // 2. Fine Shimmering Glitter Dust & Twinkling Sparkles across cheeks and nose bridge
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);
  const refCenter = noseBridge || headTop;

  const glitterDust = [
    { dx: -0.32, dy: 0.12, p: 0.2, s: 7 },
    { dx: -0.42, dy: 0.18, p: 1.4, s: 9 },
    { dx: -0.22, dy: 0.22, p: 2.1, s: 6 },
    { dx: -0.36, dy: 0.28, p: 3.5, s: 8 },
    { dx: 0.32, dy: 0.12, p: 1.8, s: 7 },
    { dx: 0.42, dy: 0.18, p: 2.9, s: 9 },
    { dx: 0.22, dy: 0.22, p: 0.5, s: 6 },
    { dx: 0.36, dy: 0.28, p: 4.1, s: 8 },
    { dx: 0.0, dy: 0.05, p: 0.8, s: 8 },
    { dx: -0.08, dy: 0.10, p: 2.3, s: 7 },
    { dx: 0.08, dy: 0.10, p: 3.7, s: 7 }
  ];

  glitterDust.forEach((g, idx) => {
    const lx = g.dx * eyeDist;
    const ly = g.dy * eyeDist;
    const gx = refCenter.x + (lx * cosA - ly * sinA);
    const gy = refCenter.y + (lx * sinA + ly * cosA);

    const pulse = 0.5 + 0.5 * Math.sin(time * 3.8 + g.p);
    drawSparkleStar(ctx, gx, gy, (eyeDist * 0.065) * (0.6 + 0.4 * pulse), 0.5 + 0.5 * pulse, time * 0.4 + idx);
  });

  // 3. Floppy Caramel Dog Ears naturally attached to top corners of head (elevated above hair)
  const earDist = eyeDist * 0.65;
  const earLeftBase = {
    x: headTop.x - cosA * earDist + pose.upVector.x * (eyeDist * 0.22),
    y: headTop.y - sinA * earDist + pose.upVector.y * (eyeDist * 0.22)
  };
  const earRightBase = {
    x: headTop.x + cosA * earDist + pose.upVector.x * (eyeDist * 0.22),
    y: headTop.y + sinA * earDist + pose.upVector.y * (eyeDist * 0.22)
  };

  const earWidth = eyeDist * 0.58;
  const earHeight = eyeDist * 0.82;

  const drawFloppyEar = (bx, by, isLeft) => {
    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(angle + (isLeft ? -0.22 : 0.22));
    if (!isLeft) ctx.scale(-1, 1);

    // Continuous smooth rounded floppy puppy ear (NO flat straight lines)
    ctx.beginPath();
    ctx.moveTo(-earWidth * 0.2, 0);
    // Arch UP and OUTWARD to the smooth rounded top fold apex
    ctx.bezierCurveTo(
      -earWidth * 0.35, -earHeight * 0.55,
      earWidth * 0.2, -earHeight * 0.65,
      earWidth * 0.55, -earHeight * 0.25
    );
    // Outer floppy droop curve hanging down
    ctx.bezierCurveTo(
      earWidth * 0.85, earHeight * 0.15,
      earWidth * 0.75, earHeight * 0.85,
      earWidth * 0.2, earHeight * 0.98
    );
    // Rounded bottom tip
    ctx.bezierCurveTo(
      -earWidth * 0.1, earHeight * 1.02,
      -earWidth * 0.45, earHeight * 0.8,
      -earWidth * 0.35, earHeight * 0.4
    );
    // Smooth inner curve returning to base
    ctx.bezierCurveTo(
      -earWidth * 0.28, earHeight * 0.2,
      -earWidth * 0.24, earHeight * 0.08,
      -earWidth * 0.2, 0
    );
    ctx.closePath();

    const earGrad = ctx.createLinearGradient(0, -earHeight * 0.5, 0, earHeight);
    earGrad.addColorStop(0, '#9e6236');
    earGrad.addColorStop(0.5, '#844c26');
    earGrad.addColorStop(1, '#663717');
    ctx.fillStyle = earGrad;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.38)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;
    ctx.fill();

    // Soft pink inner ear fold (completely rounded, matching the curve)
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.moveTo(-earWidth * 0.1, -earHeight * 0.05);
    ctx.bezierCurveTo(
      -earWidth * 0.18, -earHeight * 0.35,
      earWidth * 0.15, -earHeight * 0.42,
      earWidth * 0.38, -earHeight * 0.15
    );
    ctx.bezierCurveTo(
      earWidth * 0.55, earHeight * 0.15,
      earWidth * 0.45, earHeight * 0.68,
      earWidth * 0.12, earHeight * 0.78
    );
    ctx.bezierCurveTo(
      -earWidth * 0.08, earHeight * 0.8,
      -earWidth * 0.25, earHeight * 0.58,
      -earWidth * 0.18, earHeight * 0.28
    );
    ctx.bezierCurveTo(
      -earWidth * 0.14, earHeight * 0.12,
      -earWidth * 0.12, 0.02,
      -earWidth * 0.1, -earHeight * 0.05
    );
    ctx.closePath();
    ctx.fillStyle = '#e8a599';
    ctx.fill();

    ctx.restore();
  };

  drawFloppyEar(earLeftBase.x, earLeftBase.y, true);
  drawFloppyEar(earRightBase.x, earRightBase.y, false);

  // 4. Puppy Button Nose & Subtle Whisker Accents right on nose tip (no artificial white plate!)
  const nw = eyeDist * 0.34;
  const nh = eyeDist * 0.24;

  ctx.save();
  ctx.translate(noseTip.x, noseTip.y);
  ctx.rotate(angle);

  // Cute Whisker Dots
  ctx.fillStyle = 'rgba(70, 40, 25, 0.55)';
  [-1, 1].forEach((dir) => {
    ctx.beginPath();
    ctx.arc(dir * nw * 0.55, nh * 0.25, 1.8, 0, Math.PI * 2);
    ctx.arc(dir * nw * 0.75, nh * 0.15, 1.6, 0, Math.PI * 2);
    ctx.arc(dir * nw * 0.65, nh * 0.42, 1.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // 3D Chocolate Puppy Button Nose with nostrils and shine
  ctx.beginPath();
  const btnW = nw * 0.68;
  const btnH = nh * 0.58;
  ctx.moveTo(0, -btnH * 0.35);
  ctx.bezierCurveTo(-btnW * 0.6, -btnH * 0.48, -btnW * 0.72, btnH * 0.2, 0, btnH * 0.68);
  ctx.bezierCurveTo(btnW * 0.72, btnH * 0.2, btnW * 0.6, -btnH * 0.48, 0, -btnH * 0.35);
  ctx.closePath();

  const noseGrad = ctx.createLinearGradient(0, -btnH * 0.4, 0, btnH * 0.6);
  noseGrad.addColorStop(0, '#4a2818');
  noseGrad.addColorStop(1, '#231209');
  ctx.fillStyle = noseGrad;
  ctx.shadowColor = 'rgba(0,0,0,0.38)';
  ctx.shadowBlur = 6;
  ctx.fill();

  // Nostril indentations
  ctx.fillStyle = '#140804';
  ctx.beginPath();
  ctx.ellipse(-btnW * 0.22, btnH * 0.12, btnW * 0.08, btnH * 0.14, 0.2, 0, Math.PI * 2);
  ctx.ellipse(btnW * 0.22, btnH * 0.12, btnW * 0.08, btnH * 0.14, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // Glossy specular highlight
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.beginPath();
  ctx.ellipse(0, -btnH * 0.15, btnW * 0.22, btnH * 0.09, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Filter 6: Capuccino (by foreversleeep)
 * Warm creamy latte wash, vintage film dust motes, soft vignette, and cozy latte blush
 */
function renderCapuccino(ctx, poses, time, width = 640, height = 480) {
  // 1. Warm Creamy Latte Ambient Atmosphere
  const latteGrad = ctx.createLinearGradient(0, 0, 0, height);
  latteGrad.addColorStop(0, 'rgba(215, 175, 140, 0.14)');
  latteGrad.addColorStop(0.5, 'rgba(185, 145, 115, 0.10)');
  latteGrad.addColorStop(1, 'rgba(140, 100, 75, 0.16)');
  ctx.fillStyle = latteGrad;
  ctx.fillRect(0, 0, width, height);

  // Soft Cozy Vignette
  const vig = ctx.createRadialGradient(
    width / 2, height / 2, Math.min(width, height) * 0.35,
    width / 2, height / 2, Math.max(width, height) * 0.75
  );
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(55, 30, 20, 0.24)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, width, height);

  // 2. Organic Vintage Film Dust Particles
  const dustCount = 16;
  ctx.fillStyle = 'rgba(255, 245, 235, 0.32)';
  for (let i = 0; i < dustCount; i++) {
    const seedX = (Math.sin(i * 127.1 + 3.1) * 0.5 + 0.5);
    const seedY = (Math.cos(i * 311.7 + 1.7) * 0.5 + 0.5);
    const driftX = (seedX + (time * 0.015 * ((i % 3) + 1))) % 1.0;
    const driftY = (seedY + (time * 0.02 * (((i + 1) % 4) + 1))) % 1.0;

    const px = driftX * width;
    const py = driftY * height;
    const size = (i % 3 === 0) ? 1.8 : 1.2;

    ctx.beginPath();
    ctx.arc(px, py, size, 0, Math.PI * 2);
    ctx.fill();

    if (i % 5 === 0) {
      ctx.strokeStyle = 'rgba(255, 240, 225, 0.22)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + 4, py + 2);
      ctx.stroke();
    }
  }

  // 3. Natural Soft-Light Latte Blush on true cheek apples
  if (poses && poses.length > 0) {
    poses.forEach((pose) => {
      const { angle, eyeDist, leftCheekApple, rightCheekApple, noseTip } = pose;
      const blushRx = eyeDist * 0.38;
      const blushRy = eyeDist * 0.24;
      drawNaturalBlush(ctx, leftCheekApple.x, leftCheekApple.y, blushRx, blushRy, angle, '195, 115, 95', 0.45);
      drawNaturalBlush(ctx, rightCheekApple.x, rightCheekApple.y, blushRx, blushRy, angle, '195, 115, 95', 0.45);
      drawNaturalBlush(ctx, noseTip.x, noseTip.y - eyeDist * 0.08, eyeDist * 0.20, eyeDist * 0.12, angle, '195, 115, 95', 0.28);
    });
  }
}

/**
 * Filter 7: El Filme (by supernuay)
 * Golden hour sunlight glow, dreamy bloom, 90s star sparkles (✦), and sun-kissed peach blush
 */
function renderElFilme(ctx, poses, time, width = 640, height = 480) {
  // 1. Golden Hour Sunlight Wash (Warm low afternoon sunlight from top-left)
  const sunGrad = ctx.createRadialGradient(
    width * 0.1, -height * 0.05, 0,
    width * 0.35, height * 0.45, Math.max(width, height) * 0.95
  );
  sunGrad.addColorStop(0, 'rgba(255, 225, 130, 0.28)');
  sunGrad.addColorStop(0.35, 'rgba(255, 185, 90, 0.15)');
  sunGrad.addColorStop(0.7, 'rgba(240, 140, 60, 0.08)');
  sunGrad.addColorStop(1, 'rgba(200, 100, 40, 0.02)');
  ctx.fillStyle = sunGrad;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = 'rgba(255, 190, 110, 0.07)';
  ctx.fillRect(0, 0, width, height);

  // 2. 90s Star Sparkle Glints (✦)
  const ambientSparkles = [
    { x: 0.18, y: 0.15, size: 14, phase: 0 },
    { x: 0.82, y: 0.22, size: 12, phase: 1.8 },
    { x: 0.12, y: 0.58, size: 15, phase: 2.7 },
    { x: 0.75, y: 0.65, size: 13, phase: 3.5 },
    { x: 0.45, y: 0.12, size: 11, phase: 0.9 }
  ];

  ambientSparkles.forEach((s, idx) => {
    const pulse = 0.5 + 0.5 * Math.sin(time * 3.2 + s.phase);
    const px = s.x * width;
    const py = s.y * height;
    drawSparkleStar(ctx, px, py, s.size * (0.6 + 0.4 * pulse), 0.35 + 0.55 * pulse, time * 0.4 + idx);
  });

  // 3. Sun-Kissed Soft-Light Peach Blush on true cheek apples
  if (poses && poses.length > 0) {
    poses.forEach((pose) => {
      const { angle, eyeDist, headTop, leftCheekApple, rightCheekApple, noseTip, upVector } = pose;
      const blushRx = eyeDist * 0.40;
      const blushRy = eyeDist * 0.25;
      drawNaturalBlush(ctx, leftCheekApple.x, leftCheekApple.y, blushRx, blushRy, angle, '245, 125, 75, 0.48');
      drawNaturalBlush(ctx, rightCheekApple.x, rightCheekApple.y, blushRx, blushRy, angle, '245, 125, 75, 0.48');
      drawNaturalBlush(ctx, noseTip.x, noseTip.y - eyeDist * 0.08, eyeDist * 0.22, eyeDist * 0.14, angle, '245, 125, 75, 0.32');

      // Hair Highlight Glint
      const glintX = headTop.x - Math.cos(angle) * (eyeDist * 0.25);
      const glintY = headTop.y - Math.sin(angle) * (eyeDist * 0.25);
      const pulse = 0.5 + 0.5 * Math.sin(time * 4.0);
      drawSparkleStar(ctx, glintX, glintY, eyeDist * 0.16 * (0.7 + 0.3 * pulse), 0.85 * pulse, time * 0.5);
    });
  }
}

/**
 * Master entry point: Renders the active AR filter onto any Canvas 2D context
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} filterId
 * @param {Array<FacePose>} poses
 * @param {number} time
 * @param {number} width
 * @param {number} height
 */
export function renderARFilter(ctx, filterId, poses = [], time = 0, width = 640, height = 480) {
  if (!filterId || filterId === 'none') {
    return;
  }

  // Atmospheric film filters (can render ambient tone even if face is momentarily obscured)
  if (filterId === 'capuccino') {
    renderCapuccino(ctx, poses, time, width, height);
    return;
  }
  if (filterId === 'el_filme') {
    renderElFilme(ctx, poses, time, width, height);
    return;
  }

  // Facial Landmark AR filters (require detected face poses)
  if (!poses || poses.length === 0) return;

  poses.forEach((pose) => {
    switch (filterId) {
      case 'pink_tea':
        renderPinkTea(ctx, pose, time);
        break;
      case 'glitter_dog':
        renderGlitterDog(ctx, pose, time);
        break;
      case 'denim_glasses':
        renderDenimGlasses(ctx, pose, time);
        break;
      case 'blue_bird':
        renderBlueBirds(ctx, pose, time);
        break;
      case 'heart_crown':
        renderHeartCrown(ctx, pose, time);
        break;
      default:
        break;
    }
  });
}
