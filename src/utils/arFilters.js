/**
 * High-Performance Vector & Procedural Augmented Reality Face Filters
 * Perfectly mapped to MediaPipe 468+ Facial Landmarks
 * Featuring Photographic Blending (Soft-Light / Multiply), 3D Glossy Aesthetics,
 * and Authentic Instagram / TikTok Spark AR Visuals.
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
 * Natural Airbrush Beauty Blush & Korean Douyin Cheek Glow
 * Feathers out seamlessly with an ultra-soft elliptical falloff and translucent skin-tone warmth.
 * NEVER creates clown-like solid disks or harsh circular blotches.
 */
function drawNaturalBlush(ctx, x, y, rx, ry, angle, colorRgb = '235, 105, 115', intensity = 0.16) {
  if (!ctx || !x || !y) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Use true elliptical scaling so the gradient follows the natural cheekbone contour
  const aspect = Math.min(0.65, ry / (rx || 1));
  ctx.scale(1, aspect);

  // Soft-light / multiply sheer feathering: never exceeds 0.20 to avoid solid disks
  const safeAlpha = Math.min(0.20, Math.max(0.04, intensity));
  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
  grad.addColorStop(0, `rgba(${colorRgb}, ${safeAlpha})`);
  grad.addColorStop(0.25, `rgba(${colorRgb}, ${safeAlpha * 0.70})`);
  grad.addColorStop(0.55, `rgba(${colorRgb}, ${safeAlpha * 0.32})`);
  grad.addColorStop(0.80, `rgba(${colorRgb}, ${safeAlpha * 0.08})`);
  grad.addColorStop(1, `rgba(${colorRgb}, 0)`);

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, rx, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * 4-Point Sparkling Star with Gaussian Glow (✦)
 */
function drawSparkleStar(ctx, cx, cy, size, alpha = 1, rotation = 0, colorHex = '#ffffff') {
  if (alpha <= 0.05 || size <= 0.5) return;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.globalAlpha = Math.min(1, Math.max(0, alpha));

  const half = size;
  const pinch = size * 0.18;

  ctx.beginPath();
  ctx.moveTo(0, -half);
  ctx.quadraticCurveTo(0, -pinch, pinch, 0);
  ctx.quadraticCurveTo(0, pinch, 0, half);
  ctx.quadraticCurveTo(0, pinch, -pinch, 0);
  ctx.quadraticCurveTo(0, -pinch, 0, -half);
  ctx.closePath();

  ctx.fillStyle = colorHex;
  ctx.shadowColor = 'rgba(255, 240, 200, 0.85)';
  ctx.shadowBlur = size * 0.8;
  ctx.fill();

  // Soft glowing center core
  ctx.beginPath();
  ctx.arc(0, 0, pinch * 0.7, 0, Math.PI * 2);
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
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.38)';
  ctx.lineWidth = Math.max(1, s * 0.1);
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.restore();
}

/**
 * 3D Glossy Cartoon Blue Bird (Apple/Twitter Emoji Style)
 * Featuring cute curved head crest, plump body, white plumage belly,
 * petite amber beak, anime eye with catchlights, and layered fluttering wing.
 */
function draw3DGlossyBird(ctx, x, y, scale, angle, wingPhase, isFacingLeft = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(scale * (isFacingLeft ? -1 : 1), scale);

  // Soft ambient bird drop shadow
  ctx.shadowColor = 'rgba(2, 132, 199, 0.35)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 3;

  // 1. Pointed layered tail feathers
  ctx.beginPath();
  ctx.moveTo(-10, 1);
  ctx.bezierCurveTo(-18, -4, -22, -1, -21, 5);
  ctx.bezierCurveTo(-24, 8, -20, 11, -11, 5);
  ctx.closePath();
  const tailGrad = ctx.createLinearGradient(-22, 0, -10, 0);
  tailGrad.addColorStop(0, '#0284c7');
  tailGrad.addColorStop(1, '#0369a1');
  ctx.fillStyle = tailGrad;
  ctx.fill();

  // 2. Chubby 3D Body with Head Crest
  ctx.beginPath();
  ctx.moveTo(11, -1);
  ctx.bezierCurveTo(11, -11, 2, -15, -4, -13);
  ctx.bezierCurveTo(-11, -11, -14, -4, -12, 3);
  ctx.bezierCurveTo(-9, 12, 4, 13, 11, 5);
  ctx.bezierCurveTo(13, 3, 13, 1, 11, -1);
  ctx.closePath();

  const bodyGrad = ctx.createLinearGradient(-10, -14, 10, 12);
  bodyGrad.addColorStop(0, '#7dd3fc');
  bodyGrad.addColorStop(0.35, '#38bdf8');
  bodyGrad.addColorStop(0.75, '#0284c7');
  bodyGrad.addColorStop(1, '#0369a1');
  ctx.fillStyle = bodyGrad;
  ctx.fill();

  // 3. Cream-white chest/belly plumage
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.moveTo(1, -2);
  ctx.bezierCurveTo(6, -2, 11, 2, 8, 8);
  ctx.bezierCurveTo(4, 12, -4, 11, -6, 6);
  ctx.bezierCurveTo(-7, 2, -3, -2, 1, -2);
  ctx.closePath();
  const bellyGrad = ctx.createRadialGradient(2, 5, 0, 2, 5, 9);
  bellyGrad.addColorStop(0, 'rgba(240, 249, 255, 0.92)');
  bellyGrad.addColorStop(0.7, 'rgba(224, 242, 254, 0.75)');
  bellyGrad.addColorStop(1, 'rgba(186, 230, 253, 0)');
  ctx.fillStyle = bellyGrad;
  ctx.fill();

  // 4. Petite glossy beak (bright sunny amber)
  ctx.beginPath();
  ctx.moveTo(10, -2);
  ctx.bezierCurveTo(14, -2, 18, 0, 19, 2);
  ctx.bezierCurveTo(17, 3.5, 13, 4.5, 10, 4);
  ctx.closePath();
  const beakGrad = ctx.createLinearGradient(10, 0, 19, 2);
  beakGrad.addColorStop(0, '#f59e0b');
  beakGrad.addColorStop(1, '#fbbf24');
  ctx.fillStyle = beakGrad;
  ctx.fill();

  // 5. Glossy anime eye with dual catchlights
  ctx.beginPath();
  ctx.arc(6, -4, 2.8, 0, Math.PI * 2);
  ctx.fillStyle = '#0f172a';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(7, -5, 1.1, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(5.2, -3.2, 0.55, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  // Soft pink cheek blush on bird
  ctx.beginPath();
  ctx.arc(4, 1.5, 2.2, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(244, 114, 182, 0.65)';
  ctx.fill();

  // 6. 3D Layered Flapping Wing
  const flapAngle = Math.sin(wingPhase) * 0.48;
  const flapScaleY = 0.85 + 0.15 * Math.cos(wingPhase);

  ctx.save();
  ctx.translate(-1, -1);
  ctx.rotate(flapAngle);
  ctx.scale(1, flapScaleY);

  ctx.beginPath();
  ctx.moveTo(3, -2);
  ctx.bezierCurveTo(-3, -13, -13, -10, -12, 1);
  ctx.bezierCurveTo(-11, 5, -7, 6, -3, 3);
  ctx.bezierCurveTo(0, 4, 3, 2, 3, -2);
  ctx.closePath();

  const wingGrad = ctx.createLinearGradient(0, -12, 0, 6);
  wingGrad.addColorStop(0, '#38bdf8');
  wingGrad.addColorStop(0.5, '#0284c7');
  wingGrad.addColorStop(1, '#075985');
  ctx.fillStyle = wingGrad;
  ctx.fill();

  // Specular sheen along upper wing edge
  ctx.beginPath();
  ctx.moveTo(1, -3);
  ctx.bezierCurveTo(-3, -11, -11, -9, -10, 0);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 1.2;
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.restore();

  ctx.restore();
}

/**
 * Filter 1: Pink Tea :-) (by dingmintt)
 * Multi-tiered velvet wine-burgundy hearts hovering in an arc halo right above the hair crown,
 * with natural sheer rose-tea blush on true cheek apples.
 */
function renderPinkTea(ctx, pose, time, makeupCtx = null) {
  const { angle, eyeDist, headTop, leftCheekApple, rightCheekApple, noseBridge } = pose;

  // 1. Natural sheer rose-tea blush
  const blushTargetCtx = makeupCtx || ctx;
  const blushRx = eyeDist * 0.38;
  const blushRy = eyeDist * 0.18;
  drawNaturalBlush(blushTargetCtx, leftCheekApple.x, leftCheekApple.y, blushRx, blushRy, angle - 0.14, '225, 95, 110', 0.16);
  drawNaturalBlush(blushTargetCtx, rightCheekApple.x, rightCheekApple.y, blushRx, blushRy, angle + 0.14, '225, 95, 110', 0.16);
  if (noseBridge) {
    drawNaturalBlush(blushTargetCtx, noseBridge.x, noseBridge.y + eyeDist * 0.10, eyeDist * 0.20, eyeDist * 0.10, angle, '225, 95, 110', 0.08);
  }

  // 2. Floating Tiara of Velvet Wine Hearts nestled gracefully right above the hair
  const crownBase = headTop;
  const baseArcRadius = eyeDist * 0.58;

  const pinkTeaHearts = [
    { t: -0.92, rMult: 0.88, sizeMult: 0.34, rotOffset: -0.32, colorTop: '#8c2239', colorBot: '#631322', bobPhase: 0.2 },
    { t: -0.74, rMult: 0.85, sizeMult: 0.30, rotOffset: -0.24, colorTop: '#9a2842', colorBot: '#6e1628', bobPhase: 1.1 },
    { t: -0.60, rMult: 0.72, sizeMult: 0.20, rotOffset: -0.16, colorTop: '#ab324c', colorBot: '#7c1a2e', bobPhase: 2.3 },
    { t: -0.46, rMult: 1.02, sizeMult: 0.42, rotOffset: -0.18, colorTop: '#831e34', colorBot: '#5c1020', bobPhase: 0.8 },
    { t: -0.24, rMult: 1.10, sizeMult: 0.46, rotOffset: -0.06, colorTop: '#92233c', colorBot: '#661425', bobPhase: 1.7 },
    { t: -0.12, rMult: 0.80, sizeMult: 0.24, rotOffset: 0.04, colorTop: '#a42a45', colorBot: '#75172b', bobPhase: 3.1 },
    { t: 0.10, rMult: 1.08, sizeMult: 0.44, rotOffset: 0.10, colorTop: '#831e34', colorBot: '#5c1020', bobPhase: 0.5 },
    { t: 0.28, rMult: 1.04, sizeMult: 0.42, rotOffset: 0.20, colorTop: '#90223a', colorBot: '#661425', bobPhase: 2.0 },
    { t: 0.36, rMult: 0.76, sizeMult: 0.22, rotOffset: 0.16, colorTop: '#a22944', colorBot: '#74172b', bobPhase: 1.4 },
    { t: 0.50, rMult: 0.98, sizeMult: 0.40, rotOffset: 0.26, colorTop: '#841f35', colorBot: '#5e1121', bobPhase: 2.7 },
    { t: 0.66, rMult: 0.88, sizeMult: 0.30, rotOffset: 0.30, colorTop: '#92233c', colorBot: '#6a1527', bobPhase: 0.9 },
    { t: 0.78, rMult: 0.74, sizeMult: 0.22, rotOffset: 0.36, colorTop: '#a62c47', colorBot: '#78182d', bobPhase: 1.9 },
    { t: 0.88, rMult: 0.66, sizeMult: 0.20, rotOffset: 0.42, colorTop: '#8c2239', colorBot: '#631322', bobPhase: 3.3 }
  ];

  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);

  pinkTeaHearts.forEach((h, idx) => {
    const bob = Math.sin(time * 2.8 + h.bobPhase) * (eyeDist * 0.022);
    const r = baseArcRadius * h.rMult + bob;

    const localX = Math.sin(h.t) * r;
    const localY = -Math.cos(h.t) * r * 0.62;

    const hx = crownBase.x + (localX * cosA - localY * sinA);
    const hy = crownBase.y + (localX * sinA + localY * cosA);

    const heartSize = eyeDist * h.sizeMult * (1 + 0.04 * Math.sin(time * 3 + idx));
    const rot = angle + h.rotOffset;

    ctx.save();
    ctx.translate(hx, hy);
    ctx.rotate(rot);

    ctx.shadowColor = 'rgba(40, 10, 18, 0.45)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 3;

    draw3DHeart(ctx, 0, 0, heartSize, h.colorTop, h.colorBot);
    ctx.restore();
  });
}

/**
 * Filter 2: Heart Crown (by ozy635)
 * Glowing floating neon hearts forming an arched tiara halo nestled above the hair crown
 */
function renderHeartCrown(ctx, pose, time, makeupCtx = null) {
  const { angle, eyeDist, headTop, leftCheekApple, rightCheekApple, noseBridge } = pose;

  // 1. Radiant sheer coral-pink blush
  const blushTargetCtx = makeupCtx || ctx;
  const blushRx = eyeDist * 0.38;
  const blushRy = eyeDist * 0.18;
  drawNaturalBlush(blushTargetCtx, leftCheekApple.x, leftCheekApple.y, blushRx, blushRy, angle - 0.14, '245, 105, 125', 0.16);
  drawNaturalBlush(blushTargetCtx, rightCheekApple.x, rightCheekApple.y, blushRx, blushRy, angle + 0.14, '245, 105, 125', 0.16);
  if (noseBridge) {
    drawNaturalBlush(blushTargetCtx, noseBridge.x, noseBridge.y + eyeDist * 0.10, eyeDist * 0.20, eyeDist * 0.10, angle, '245, 105, 125', 0.08);
  }

  // 2. Halo of Glowing Translucent Neon Hearts floating above the hair
  const heartCount = 8;
  const crownBase = headTop;
  const arcRadius = eyeDist * 0.60;

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
    const tNorm = (i / (heartCount - 1)) * 2 - 1;
    const heartAngle = tNorm * 0.88;

    const bob = Math.sin(time * 3.2 + i * 0.9) * (eyeDist * 0.03);
    const r = arcRadius + bob;

    const localX = Math.sin(heartAngle) * r;
    const localY = -Math.cos(heartAngle) * r * 0.60;

    const hx = crownBase.x + (localX * cosA - localY * sinA);
    const hy = crownBase.y + (localX * sinA + localY * cosA);

    const centerFactor = 1 - Math.abs(tNorm) * 0.25;
    const pulseFactor = 1 + 0.08 * Math.sin(time * 4.5 + i * 1.2);
    const heartSize = eyeDist * 0.34 * centerFactor * pulseFactor;
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
 * 3D Y2K Rectangular Designer Sunglasses resting stylishly on hairline/forehead,
 * organic micro-freckles, and peachy soft-light blush
 */
function renderDenimGlasses(ctx, pose, time, makeupCtx = null) {
  const { angle, eyeDist, forehead, leftCheekApple, rightCheekApple, noseBridge, upVector } = pose;

  // 1. Warm Peachy sheer blush
  const blushTargetCtx = makeupCtx || ctx;
  const blushRx = eyeDist * 0.38;
  const blushRy = eyeDist * 0.18;
  drawNaturalBlush(blushTargetCtx, leftCheekApple.x, leftCheekApple.y, blushRx, blushRy, angle - 0.14, '240, 125, 90', 0.15);
  drawNaturalBlush(blushTargetCtx, rightCheekApple.x, rightCheekApple.y, blushRx, blushRy, angle + 0.14, '240, 125, 90', 0.15);

  // 2. Delicate Micro-Freckles
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);
  const bridgeCenter = noseBridge || forehead;

  const microFreckles = [
    { x: -0.24, y: 0.12, r: 0.9, a: 0.42 },
    { x: -0.32, y: 0.16, r: 1.1, a: 0.38 },
    { x: -0.18, y: 0.20, r: 1.3, a: 0.45 },
    { x: -0.38, y: 0.22, r: 0.8, a: 0.32 },
    { x: -0.12, y: 0.10, r: 1.0, a: 0.42 },
    { x: -0.06, y: 0.06, r: 1.2, a: 0.48 },
    { x: 0.0, y: 0.05, r: 1.1, a: 0.50 },
    { x: 0.06, y: 0.08, r: 1.0, a: 0.42 },
    { x: 0.14, y: 0.12, r: 1.2, a: 0.45 },
    { x: 0.22, y: 0.15, r: 0.9, a: 0.38 },
    { x: 0.30, y: 0.18, r: 1.3, a: 0.45 },
    { x: 0.36, y: 0.22, r: 0.8, a: 0.32 },
    { x: 0.18, y: 0.24, r: 1.1, a: 0.40 },
    { x: -0.04, y: 0.16, r: 1.0, a: 0.40 },
    { x: 0.05, y: 0.18, r: 1.2, a: 0.45 },
    { x: -0.26, y: 0.26, r: 0.8, a: 0.32 },
    { x: 0.25, y: 0.26, r: 0.9, a: 0.38 },
    { x: -0.15, y: 0.28, r: 1.0, a: 0.38 },
    { x: 0.12, y: 0.28, r: 1.1, a: 0.40 }
  ];

  ctx.save();
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

  // 3. 3D Y2K Rectangular Denim Sunglasses resting on hairline
  const glassesCenter = {
    x: forehead.x + upVector.x * (eyeDist * 0.16),
    y: forehead.y + upVector.y * (eyeDist * 0.16)
  };

  const totalWidth = eyeDist * 1.36;
  const totalHeight = eyeDist * 0.44;
  const frameThick = eyeDist * 0.065;
  const lensWidth = (totalWidth - frameThick * 2.8) / 2;
  const lensHeight = totalHeight - frameThick * 2;
  const cornerRad = eyeDist * 0.055;

  ctx.save();
  ctx.translate(glassesCenter.x, glassesCenter.y);
  ctx.rotate(angle);

  ctx.shadowColor = 'rgba(0, 0, 0, 0.40)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 4;

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

  roundRect(-totalWidth / 2, -totalHeight / 2, totalWidth, totalHeight, cornerRad * 1.3);
  const frameGrad = ctx.createLinearGradient(-totalWidth / 2, -totalHeight / 2, totalWidth / 2, totalHeight / 2);
  frameGrad.addColorStop(0, '#5a84a6');
  frameGrad.addColorStop(0.3, '#436987');
  frameGrad.addColorStop(0.7, '#345570');
  frameGrad.addColorStop(1, '#274258');
  ctx.fillStyle = frameGrad;
  ctx.fill();

  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-totalWidth / 2 + cornerRad, -totalHeight / 2 + 1);
  ctx.lineTo(totalWidth / 2 - cornerRad, -totalHeight / 2 + 1);
  ctx.stroke();

  // Silver Hinge Studs
  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.arc(-totalWidth / 2 + frameThick * 0.45, -totalHeight * 0.12, 1.8, 0, Math.PI * 2);
  ctx.arc(totalWidth / 2 - frameThick * 0.45, -totalHeight * 0.12, 1.8, 0, Math.PI * 2);
  ctx.fill();

  // Dual Tinted Translucent Lenses
  const leftLensX = -totalWidth / 2 + frameThick;
  const rightLensX = frameThick * 0.4;
  const lensY = -totalHeight / 2 + frameThick;

  [leftLensX, rightLensX].forEach((lx) => {
    roundRect(lx, lensY, lensWidth, lensHeight, cornerRad);

    const lensGrad = ctx.createLinearGradient(lx, lensY, lx + lensWidth, lensY + lensHeight);
    lensGrad.addColorStop(0, 'rgba(20, 32, 45, 0.72)');
    lensGrad.addColorStop(1, 'rgba(12, 20, 30, 0.82)');
    ctx.fillStyle = lensGrad;
    ctx.fill();

    ctx.strokeStyle = 'rgba(110, 160, 195, 0.45)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.save();
    ctx.clip();

    ctx.beginPath();
    ctx.moveTo(lx + lensWidth * 0.2, lensY);
    ctx.lineTo(lx + lensWidth * 0.45, lensY);
    ctx.lineTo(lx + lensWidth * 0.15, lensY + lensHeight);
    ctx.lineTo(lx - lensWidth * 0.1, lensY + lensHeight);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.26)';
    ctx.fill();

    ctx.restore();
  });

  ctx.restore();
}

/**
 * Filter 4: Blue Bird (by princessaliha)
 * 3D glossy cartoon blue birds orbiting smoothly in an elliptical halo around the hair crown,
 * with natural sheer porcelain blush and trailing fairy dust sparkles.
 */
function renderBlueBirds(ctx, pose, time, makeupCtx = null) {
  const { angle, eyeDist, hoverCrown, leftCheekApple, rightCheekApple, noseBridge } = pose;

  // 1. Natural sheer porcelain-pink blush on high cheek apples
  const blushTargetCtx = makeupCtx || ctx;
  const blushRx = eyeDist * 0.38;
  const blushRy = eyeDist * 0.18;
  drawNaturalBlush(blushTargetCtx, leftCheekApple.x, leftCheekApple.y, blushRx, blushRy, angle - 0.14, '245, 115, 135', 0.16);
  drawNaturalBlush(blushTargetCtx, rightCheekApple.x, rightCheekApple.y, blushRx, blushRy, angle + 0.14, '245, 115, 135', 0.16);
  if (noseBridge) {
    drawNaturalBlush(blushTargetCtx, noseBridge.x, noseBridge.y + eyeDist * 0.10, eyeDist * 0.20, eyeDist * 0.10, angle, '245, 115, 135', 0.08);
  }

  // 2. Halo of 5 fluttering 3D birds orbiting gracefully around the hair crown
  const orbitCenter = hoverCrown;
  const radiusX = eyeDist * 0.68;
  const radiusY = eyeDist * 0.24;
  const numBirds = 5;

  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);

  for (let i = 0; i < numBirds; i++) {
    const orbitAngle = time * 1.05 + (i * (Math.PI * 2)) / numBirds;
    const elX = Math.cos(orbitAngle) * radiusX;
    const elY = Math.sin(orbitAngle) * radiusY;

    // Organic vertical bobbing so birds don't move in a rigid flat ellipse
    const bob = Math.sin(time * 2.8 + i * 1.5) * (eyeDist * 0.035);

    const birdX = orbitCenter.x + (elX * cosA - (elY + bob) * sinA);
    const birdY = orbitCenter.y + (elX * sinA + (elY + bob) * cosA);

    // 3D Depth scaling & opacity: front birds are crisp and larger, back birds are softer
    const zDepth = Math.sin(orbitAngle);
    const normDepth = (zDepth + 1) / 2;
    const scale = (0.82 + 0.30 * normDepth) * (eyeDist / 130);
    const alpha = 0.80 + 0.20 * normDepth;

    // Natural banking: bird tilts smoothly into the curve
    const bank = Math.cos(orbitAngle) * 0.18;
    const rot = angle + bank;

    // Facing direction: smooth facing based on orbital horizontal velocity
    const isFacingLeft = Math.cos(orbitAngle) > 0;

    ctx.save();
    ctx.globalAlpha = alpha;
    draw3DGlossyBird(ctx, birdX, birdY, scale, rot, time * 9 + i * 1.8, isFacingLeft);

    // Twinkling white & golden fairy dust trail behind birds
    if ((i + Math.floor(time * 2)) % 2 === 0) {
      const trailDx = isFacingLeft ? (scale * 22) : (-scale * 22);
      const trailX = birdX + trailDx * cosA;
      const trailY = birdY + trailDx * sinA;
      const pulse = 0.5 + 0.5 * Math.sin(time * 4 + i);
      drawSparkleStar(ctx, trailX, trailY, (eyeDist * 0.06) * pulse, 0.4 + 0.5 * pulse, time * 0.5 + i, '#ffffff');
    }

    ctx.restore();
  }
}

/**
 * Filter 5: Glitter Puppy (by re_mini_scene)
 * Organic floppy ears, 3D chocolate button nose, and fine glittering sparkles
 */
function renderGlitterDog(ctx, pose, time, makeupCtx = null) {
  const { angle, eyeDist, headTop, leftCheekApple, rightCheekApple, noseTip, noseBridge } = pose;

  // 1. Natural sheer rosy blush
  const blushTargetCtx = makeupCtx || ctx;
  const blushRx = eyeDist * 0.38;
  const blushRy = eyeDist * 0.18;
  drawNaturalBlush(blushTargetCtx, leftCheekApple.x, leftCheekApple.y, blushRx, blushRy, angle - 0.14, '240, 110, 115', 0.16);
  drawNaturalBlush(blushTargetCtx, rightCheekApple.x, rightCheekApple.y, blushRx, blushRy, angle + 0.14, '240, 110, 115', 0.16);

  // 2. Fine Shimmering Glitter Dust across cheekbones and nose bridge
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

  // 3. Floppy Caramel Dog Ears naturally attached to top corners of head
  const earDist = eyeDist * 0.58;
  const earLeftBase = {
    x: headTop.x - cosA * earDist + pose.upVector.x * (eyeDist * 0.12),
    y: headTop.y - sinA * earDist + pose.upVector.y * (eyeDist * 0.12)
  };
  const earRightBase = {
    x: headTop.x + cosA * earDist + pose.upVector.x * (eyeDist * 0.12),
    y: headTop.y + sinA * earDist + pose.upVector.y * (eyeDist * 0.12)
  };

  const earWidth = eyeDist * 0.54;
  const earHeight = eyeDist * 0.78;

  const drawFloppyEar = (bx, by, isLeft) => {
    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(angle + (isLeft ? -0.22 : 0.22));
    if (!isLeft) ctx.scale(-1, 1);

    ctx.beginPath();
    ctx.moveTo(-earWidth * 0.2, 0);
    ctx.bezierCurveTo(
      -earWidth * 0.35, -earHeight * 0.55,
      earWidth * 0.2, -earHeight * 0.65,
      earWidth * 0.55, -earHeight * 0.25
    );
    ctx.bezierCurveTo(
      earWidth * 0.85, earHeight * 0.15,
      earWidth * 0.75, earHeight * 0.85,
      earWidth * 0.2, earHeight * 0.98
    );
    ctx.bezierCurveTo(
      -earWidth * 0.1, earHeight * 1.02,
      -earWidth * 0.45, earHeight * 0.8,
      -earWidth * 0.35, earHeight * 0.4
    );
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

    // Soft pink inner ear fold
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

  // 4. 3D Chocolate Puppy Button Nose with nostrils and shine
  const nw = eyeDist * 0.32;
  const nh = eyeDist * 0.22;

  ctx.save();
  ctx.translate(noseTip.x, noseTip.y);
  ctx.rotate(angle);

  // Whisker Dots
  ctx.fillStyle = 'rgba(70, 40, 25, 0.55)';
  [-1, 1].forEach((dir) => {
    ctx.beginPath();
    ctx.arc(dir * nw * 0.55, nh * 0.25, 1.8, 0, Math.PI * 2);
    ctx.arc(dir * nw * 0.75, nh * 0.15, 1.6, 0, Math.PI * 2);
    ctx.arc(dir * nw * 0.65, nh * 0.42, 1.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Nose Button
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

  // Specular highlight
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
function renderCapuccino(ctx, poses, time, width = 640, height = 480, makeupCtx = null) {
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

  // 3. Natural sheer latte blush
  if (poses && poses.length > 0) {
    const blushTargetCtx = makeupCtx || ctx;
    poses.forEach((pose) => {
      const { angle, eyeDist, leftCheekApple, rightCheekApple, noseTip } = pose;
      const blushRx = eyeDist * 0.38;
      const blushRy = eyeDist * 0.18;
      drawNaturalBlush(blushTargetCtx, leftCheekApple.x, leftCheekApple.y, blushRx, blushRy, angle - 0.14, '205, 125, 105', 0.15);
      drawNaturalBlush(blushTargetCtx, rightCheekApple.x, rightCheekApple.y, blushRx, blushRy, angle + 0.14, '205, 125, 105', 0.15);
    });
  }
}

/**
 * Filter 7: El Filme (by supernuay)
 * Golden hour sunlight glow, dreamy bloom, 90s star sparkles (✦), and sun-kissed peach blush
 */
function renderElFilme(ctx, poses, time, width = 640, height = 480, makeupCtx = null) {
  // 1. Golden Hour Sunlight Wash
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

  // 3. Sun-Kissed sheer peach blush
  if (poses && poses.length > 0) {
    const blushTargetCtx = makeupCtx || ctx;
    poses.forEach((pose) => {
      const { angle, eyeDist, headTop, leftCheekApple, rightCheekApple, noseTip } = pose;
      const blushRx = eyeDist * 0.38;
      const blushRy = eyeDist * 0.18;
      drawNaturalBlush(blushTargetCtx, leftCheekApple.x, leftCheekApple.y, blushRx, blushRy, angle - 0.14, '240, 125, 80', 0.15);
      drawNaturalBlush(blushTargetCtx, rightCheekApple.x, rightCheekApple.y, blushRx, blushRy, angle + 0.14, '240, 125, 80', 0.15);

      // Hair Highlight Glint
      const glintX = headTop.x - Math.cos(angle) * (eyeDist * 0.25);
      const glintY = headTop.y - Math.sin(angle) * (eyeDist * 0.25);
      const pulse = 0.5 + 0.5 * Math.sin(time * 4.0);
      drawSparkleStar(ctx, glintX, glintY, eyeDist * 0.16 * (0.7 + 0.3 * pulse), 0.85 * pulse, time * 0.5);
    });
  }
}

/**
 * Master entry point: Renders the active AR filter onto Canvas 2D contexts
 * @param {CanvasRenderingContext2D} ctx - Primary 3D accessories canvas context
 * @param {string} filterId
 * @param {Array<FacePose>} poses
 * @param {number} time
 * @param {number} width
 * @param {number} height
 * @param {CanvasRenderingContext2D|null} makeupCtx - Dedicated soft-light photographic makeup canvas
 */
export function renderARFilter(ctx, filterId, poses = [], time = 0, width = 640, height = 480, makeupCtx = null) {
  if (!filterId || filterId === 'none') {
    return;
  }

  // Atmospheric film filters
  if (filterId === 'capuccino') {
    renderCapuccino(ctx, poses, time, width, height, makeupCtx);
    return;
  }
  if (filterId === 'el_filme') {
    renderElFilme(ctx, poses, time, width, height, makeupCtx);
    return;
  }

  // Facial Landmark AR filters
  if (!poses || poses.length === 0) return;

  poses.forEach((pose) => {
    switch (filterId) {
      case 'pink_tea':
        renderPinkTea(ctx, pose, time, makeupCtx);
        break;
      case 'glitter_dog':
        renderGlitterDog(ctx, pose, time, makeupCtx);
        break;
      case 'denim_glasses':
        renderDenimGlasses(ctx, pose, time, makeupCtx);
        break;
      case 'blue_bird':
        renderBlueBirds(ctx, pose, time, makeupCtx);
        break;
      case 'heart_crown':
        renderHeartCrown(ctx, pose, time, makeupCtx);
        break;
      default:
        break;
    }
  });
}
