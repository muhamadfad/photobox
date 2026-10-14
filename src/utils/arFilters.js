/**
 * High-Performance Vector-Based Augmented Reality Face Filters
 * Perfectly mapped to MediaPipe 468+ Facial Landmarks
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
  },
  {
    id: 'pink_tea',
    name: 'Pink Tea :-)',
    tag: 'pink tea :-)',
    icon: '🤎',
    badge: 'Trending',
    description: 'Mahkota hati wine-burgundy bertingkat viral "pink tea :-)" & warm rose blush'
  },
  {
    id: 'glitter_dog',
    name: 'Glitter Puppy',
    tag: '!) Glitter pack',
    icon: '🐶',
    badge: 'Popular',
    description: 'Telinga & hidung puppy, glitter sparkle berkilau, dan blush pipi'
  },
  {
    id: 'denim_glasses',
    name: 'Denim Shades',
    tag: 'Denim Y2K',
    icon: '🕶️',
    badge: 'Trendy',
    description: 'Kacamata denim Y2K di dahi, bintik freckles natural, & peach blush'
  },
  {
    id: 'blue_bird',
    name: 'Blue Bird',
    tag: 'blue bird',
    icon: '🕊️',
    badge: 'Aesthetic',
    description: 'Burung biru terbang melingkari kepala, porcelain skin & pink blush'
  },
  {
    id: 'heart_crown',
    name: 'Heart Crown',
    tag: 'Good Skin+HeartCrown',
    icon: '👑',
    badge: 'Cute',
    description: 'Mahkota hati merah muda bersinar di atas kepala & soft blush'
  }
];

// Reusable drawing helpers
function drawSoftBlush(ctx, x, y, rx, ry, angle, colorRgba) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(rx, ry));
  grad.addColorStop(0, colorRgba);
  grad.addColorStop(0.65, colorRgba.replace(/[\d.]+\)$/, '0.15)'));
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawSparkleStar(ctx, cx, cy, size, alpha, rotation = 0) {
  if (alpha <= 0.05 || size <= 0.5) return;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.globalAlpha = Math.min(1, Math.max(0, alpha));

  // 4-point sparkle star with bezier curves
  ctx.beginPath();
  const half = size;
  const pinch = size * 0.16;

  ctx.moveTo(0, -half);
  ctx.quadraticCurveTo(0, -pinch, pinch, 0);
  ctx.quadraticCurveTo(0, pinch, 0, half);
  ctx.quadraticCurveTo(0, pinch, -pinch, 0);
  ctx.quadraticCurveTo(0, -pinch, 0, -half);
  ctx.closePath();

  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(255, 230, 180, 0.85)';
  ctx.shadowBlur = size * 0.8;
  ctx.fill();

  // Tiny center core
  ctx.beginPath();
  ctx.arc(0, 0, pinch * 0.7, 0, Math.PI * 2);
  ctx.fillStyle = '#fffdf0';
  ctx.fill();

  ctx.restore();
}

function drawHeart(ctx, x, y, size, color, glowColor = null, glowBlur = 0) {
  ctx.save();
  ctx.translate(x, y);
  if (glowColor && glowBlur > 0) {
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = glowBlur;
  }
  ctx.fillStyle = color;
  ctx.beginPath();
  const s = size / 2;
  ctx.moveTo(0, s * 0.35);
  ctx.bezierCurveTo(-s * 0.9, -s * 0.5, -s * 1.05, s * 0.5, 0, s * 1.15);
  ctx.bezierCurveTo(s * 1.05, s * 0.5, s * 0.9, -s * 0.5, 0, s * 0.35);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/**
 * Filter 1: Glitter Puppy (! Glitter pack)
 * Floppy puppy ears on top of head, puppy nose, glowing fine sparkle dust, soft blush
 */
function renderGlitterDog(ctx, pose, time) {
  const { angle, eyeDist, faceHeight, forehead, noseTip, leftCheek, rightCheek, upVector } = pose;

  // 1. Soft Rosy Cheek Blush
  const blushRadius = eyeDist * 0.38;
  drawSoftBlush(ctx, leftCheek.x, leftCheek.y, blushRadius, blushRadius * 0.75, angle, 'rgba(255, 105, 145, 0.32)');
  drawSoftBlush(ctx, rightCheek.x, rightCheek.y, blushRadius, blushRadius * 0.75, angle, 'rgba(255, 105, 145, 0.32)');

  // 2. Fine Glitter Dust & Twinkling Sparkles across forehead & cheeks
  // Fixed landmark offsets for stable tracking
  const sparkleOffsets = [
    // Forehead / bangs cluster
    { dx: -0.35, dy: -0.3, phase: 0 },
    { dx: -0.18, dy: -0.22, phase: 1.2 },
    { dx: 0.0, dy: -0.28, phase: 2.1 },
    { dx: 0.18, dy: -0.22, phase: 3.4 },
    { dx: 0.35, dy: -0.3, phase: 4.5 },
    { dx: -0.08, dy: -0.15, phase: 0.8 },
    { dx: 0.1, dy: -0.14, phase: 2.9 },
    // Left cheek cluster
    { dx: -0.45, dy: 0.15, phase: 1.5 },
    { dx: -0.32, dy: 0.22, phase: 3.1 },
    { dx: -0.55, dy: 0.28, phase: 4.2 },
    { dx: -0.22, dy: 0.32, phase: 0.5 },
    { dx: -0.38, dy: 0.42, phase: 2.6 },
    // Right cheek cluster
    { dx: 0.45, dy: 0.15, phase: 2.3 },
    { dx: 0.32, dy: 0.22, phase: 4.1 },
    { dx: 0.55, dy: 0.28, phase: 0.9 },
    { dx: 0.22, dy: 0.32, phase: 3.7 },
    { dx: 0.38, dy: 0.42, phase: 1.8 },
    // Nose bridge cluster
    { dx: 0.0, dy: 0.05, phase: 0.4 },
    { dx: -0.08, dy: 0.12, phase: 2.0 },
    { dx: 0.08, dy: 0.12, phase: 3.3 }
  ];

  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);
  const refCenter = pose.noseBridge || pose.forehead;

  sparkleOffsets.forEach((item, idx) => {
    // Coordinate relative to head coordinate space
    const lx = item.dx * eyeDist;
    const ly = item.dy * eyeDist;
    const wx = refCenter.x + (lx * cosA - ly * sinA);
    const wy = refCenter.y + (lx * sinA + ly * cosA);

    const pulse = 0.5 + 0.5 * Math.sin(time * 3.5 + item.phase);
    const starSize = (eyeDist * 0.075) * (0.65 + 0.45 * pulse);
    drawSparkleStar(ctx, wx, wy, starSize, 0.45 + 0.55 * pulse, time * 0.5 + idx);
  });

  // 3. Puppy Ears (Floppy ears positioned on head top)
  const earDistance = eyeDist * 0.62;
  const earUpOffset = eyeDist * 0.42;

  // Compute Left Ear and Right Ear base positions
  const earLeftBase = {
    x: forehead.x - cosA * earDistance + upVector.x * earUpOffset,
    y: forehead.y - sinA * earDistance + upVector.y * earUpOffset
  };
  const earRightBase = {
    x: forehead.x + cosA * earDistance + upVector.x * earUpOffset,
    y: forehead.y + sinA * earDistance + upVector.y * earUpOffset
  };

  const earWidth = eyeDist * 0.58;
  const earHeight = eyeDist * 0.85;

  const drawFloppyEar = (baseX, baseY, isLeft) => {
    ctx.save();
    ctx.translate(baseX, baseY);
    ctx.rotate(angle + (isLeft ? -0.22 : 0.22));
    if (!isLeft) ctx.scale(-1, 1);

    // Outer brown ear flap
    ctx.beginPath();
    ctx.moveTo(-earWidth * 0.25, 0);
    ctx.bezierCurveTo(-earWidth * 0.85, -earHeight * 0.5, -earWidth * 0.7, earHeight * 0.6, -earWidth * 0.1, earHeight * 0.95);
    ctx.bezierCurveTo(earWidth * 0.45, earHeight * 1.05, earWidth * 0.85, earHeight * 0.4, earWidth * 0.35, 0);
    ctx.closePath();

    // Caramel brown gradient
    const earGrad = ctx.createLinearGradient(0, -earHeight * 0.3, 0, earHeight);
    earGrad.addColorStop(0, '#93582e');
    earGrad.addColorStop(0.6, '#804823');
    earGrad.addColorStop(1, '#633314');
    ctx.fillStyle = earGrad;
    ctx.shadowColor = 'rgba(0,0,0,0.22)';
    ctx.shadowBlur = 8;
    ctx.fill();

    // Inner pink ear fold droop
    ctx.beginPath();
    ctx.moveTo(-earWidth * 0.15, earHeight * 0.12);
    ctx.bezierCurveTo(-earWidth * 0.55, earHeight * 0.25, -earWidth * 0.4, earHeight * 0.68, -earWidth * 0.05, earHeight * 0.78);
    ctx.bezierCurveTo(earWidth * 0.3, earHeight * 0.82, earWidth * 0.55, earHeight * 0.45, earWidth * 0.2, earHeight * 0.15);
    ctx.closePath();
    ctx.fillStyle = '#e8a599';
    ctx.shadowBlur = 0;
    ctx.fill();

    ctx.restore();
  };

  drawFloppyEar(earLeftBase.x, earLeftBase.y, true);
  drawFloppyEar(earRightBase.x, earRightBase.y, false);

  // 4. Puppy Nose & Muzzle (Placed over nose tip)
  const noseWidth = eyeDist * 0.46;
  const noseHeight = eyeDist * 0.34;

  ctx.save();
  ctx.translate(noseTip.x, noseTip.y);
  ctx.rotate(angle);

  // Soft warm cream muzzle patch
  ctx.beginPath();
  ctx.ellipse(0, noseHeight * 0.15, noseWidth * 0.88, noseHeight * 0.75, 0, 0, Math.PI * 2);
  const muzzleGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, noseWidth * 0.9);
  muzzleGrad.addColorStop(0, 'rgba(255, 245, 235, 0.92)');
  muzzleGrad.addColorStop(0.75, 'rgba(250, 235, 220, 0.82)');
  muzzleGrad.addColorStop(1, 'rgba(240, 220, 200, 0)');
  ctx.fillStyle = muzzleGrad;
  ctx.fill();

  // Cute whisker dots
  ctx.fillStyle = 'rgba(100, 60, 40, 0.45)';
  [-1, 1].forEach((dir) => {
    ctx.beginPath();
    ctx.arc(dir * noseWidth * 0.45, noseHeight * 0.25, noseWidth * 0.03, 0, Math.PI * 2);
    ctx.arc(dir * noseWidth * 0.6, noseHeight * 0.18, noseWidth * 0.028, 0, Math.PI * 2);
    ctx.arc(dir * noseWidth * 0.5, noseHeight * 0.4, noseWidth * 0.025, 0, Math.PI * 2);
    ctx.fill();
  });

  // Dark chocolate puppy nose button
  ctx.beginPath();
  const nw = noseWidth * 0.58;
  const nh = noseHeight * 0.48;
  ctx.moveTo(0, -nh * 0.35);
  ctx.bezierCurveTo(-nw * 0.6, -nh * 0.45, -nw * 0.7, nh * 0.2, 0, nh * 0.65);
  ctx.bezierCurveTo(nw * 0.7, nh * 0.2, nw * 0.6, -nh * 0.45, 0, -nh * 0.35);
  ctx.closePath();

  const noseGrad = ctx.createLinearGradient(0, -nh * 0.4, 0, nh * 0.6);
  noseGrad.addColorStop(0, '#422415');
  noseGrad.addColorStop(1, '#231209');
  ctx.fillStyle = noseGrad;
  ctx.shadowColor = 'rgba(0,0,0,0.25)';
  ctx.shadowBlur = 4;
  ctx.fill();

  // Nostril indentations
  ctx.fillStyle = '#150a04';
  ctx.beginPath();
  ctx.ellipse(-nw * 0.22, nh * 0.12, nw * 0.08, nh * 0.14, 0.2, 0, Math.PI * 2);
  ctx.ellipse(nw * 0.22, nh * 0.12, nw * 0.08, nh * 0.14, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // White gloss highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.beginPath();
  ctx.ellipse(0, -nh * 0.15, nw * 0.18, nh * 0.08, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Filter 2: Denim Shades (Denim by e.wi.n)
 * Rectangular denim-blue sunglasses pushed up onto forehead/hairline, freckles, peachy blush
 */
function renderDenimGlasses(ctx, pose, time) {
  const { angle, eyeDist, forehead, midForehead, noseTip, leftCheek, rightCheek, upVector } = pose;

  // 1. Warm Peach Cheek & Nose Blush
  const blushRadius = eyeDist * 0.42;
  drawSoftBlush(ctx, leftCheek.x, leftCheek.y, blushRadius, blushRadius * 0.7, angle, 'rgba(255, 125, 95, 0.26)');
  drawSoftBlush(ctx, rightCheek.x, rightCheek.y, blushRadius, blushRadius * 0.7, angle, 'rgba(255, 125, 95, 0.26)');
  drawSoftBlush(ctx, noseTip.x, noseTip.y - eyeDist * 0.1, eyeDist * 0.25, eyeDist * 0.15, angle, 'rgba(255, 125, 95, 0.2)');

  // 2. Cute Natural Freckles across nose bridge & cheek tops
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);
  const bridgeCenter = pose.noseBridge || midForehead;

  const freckleSeeds = [
    { x: -0.28, y: 0.15, r: 1.6, a: 0.55 },
    { x: -0.38, y: 0.2, r: 1.2, a: 0.45 },
    { x: -0.22, y: 0.26, r: 1.8, a: 0.6 },
    { x: -0.45, y: 0.24, r: 1.4, a: 0.4 },
    { x: -0.15, y: 0.12, r: 1.5, a: 0.5 },
    { x: -0.08, y: 0.08, r: 1.3, a: 0.55 },
    { x: 0.0, y: 0.06, r: 1.7, a: 0.6 },
    { x: 0.08, y: 0.1, r: 1.4, a: 0.5 },
    { x: 0.16, y: 0.14, r: 1.6, a: 0.55 },
    { x: 0.26, y: 0.18, r: 1.3, a: 0.45 },
    { x: 0.35, y: 0.22, r: 1.8, a: 0.6 },
    { x: 0.42, y: 0.26, r: 1.2, a: 0.4 },
    { x: 0.22, y: 0.28, r: 1.5, a: 0.5 },
    { x: -0.05, y: 0.2, r: 1.4, a: 0.5 },
    { x: 0.06, y: 0.22, r: 1.3, a: 0.5 },
    { x: -0.32, y: 0.32, r: 1.2, a: 0.4 },
    { x: 0.3, y: 0.32, r: 1.2, a: 0.4 }
  ];

  freckleSeeds.forEach((pt) => {
    const lx = pt.x * eyeDist;
    const ly = pt.y * eyeDist;
    const wx = bridgeCenter.x + (lx * cosA - ly * sinA);
    const wy = bridgeCenter.y + (lx * sinA + ly * cosA);

    ctx.beginPath();
    ctx.arc(wx, wy, pt.r * (eyeDist / 120), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(122, 75, 42, ${pt.a})`;
    ctx.fill();
  });

  // 3. Rectangular Denim Sunglasses perched on forehead/hairline
  // Positioned directly around forehead landmark 10 / 151
  const glassesCenter = {
    x: forehead.x + upVector.x * (eyeDist * 0.08),
    y: forehead.y + upVector.y * (eyeDist * 0.08)
  };

  const totalWidth = eyeDist * 1.78;
  const totalHeight = eyeDist * 0.64;
  const frameThick = eyeDist * 0.09;
  const lensWidth = (totalWidth - frameThick * 3) / 2;
  const lensHeight = totalHeight - frameThick * 2;
  const cornerRadius = eyeDist * 0.07;

  ctx.save();
  ctx.translate(glassesCenter.x, glassesCenter.y);
  ctx.rotate(angle);

  // Outer frame drop shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 4;

  // Denim blue frame
  const denimGrad = ctx.createLinearGradient(-totalWidth / 2, -totalHeight / 2, totalWidth / 2, totalHeight / 2);
  denimGrad.addColorStop(0, '#5a829e');
  denimGrad.addColorStop(0.5, '#486d87');
  denimGrad.addColorStop(1, '#3b586e');

  // Helper for rounded rectangle
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

  // Outer main frame
  roundRect(-totalWidth / 2, -totalHeight / 2, totalWidth, totalHeight, cornerRadius * 1.4);
  ctx.fillStyle = denimGrad;
  ctx.fill();

  // Reset shadow for lenses
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

  // Temple arms hints on edges
  ctx.fillStyle = '#3a576d';
  ctx.fillRect(-totalWidth / 2 - eyeDist * 0.04, -totalHeight / 2 + frameThick * 0.5, eyeDist * 0.05, totalHeight * 0.4);
  ctx.fillRect(totalWidth / 2 - eyeDist * 0.01, -totalHeight / 2 + frameThick * 0.5, eyeDist * 0.05, totalHeight * 0.4);

  // Lenses (Left and Right)
  const leftLensX = -totalWidth / 2 + frameThick;
  const rightLensX = frameThick * 0.5;
  const lensY = -totalHeight / 2 + frameThick;

  [leftLensX, rightLensX].forEach((lx) => {
    // Tinted dark lens
    roundRect(lx, lensY, lensWidth, lensHeight, cornerRadius);
    const lensGrad = ctx.createLinearGradient(lx, lensY, lx + lensWidth, lensY + lensHeight);
    lensGrad.addColorStop(0, 'rgba(20, 32, 45, 0.88)');
    lensGrad.addColorStop(1, 'rgba(10, 18, 28, 0.94)');
    ctx.fillStyle = lensGrad;
    ctx.fill();

    // Inner rim bevel
    ctx.strokeStyle = '#6e98b7';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Diagonal glass reflection slash
    ctx.save();
    ctx.clip(); // clip within lens
    ctx.beginPath();
    ctx.moveTo(lx + lensWidth * 0.25, lensY);
    ctx.lineTo(lx + lensWidth * 0.55, lensY);
    ctx.lineTo(lx + lensWidth * 0.2, lensY + lensHeight);
    ctx.lineTo(lx - lensWidth * 0.1, lensY + lensHeight);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(lx + lensWidth * 0.65, lensY);
    ctx.lineTo(lx + lensWidth * 0.82, lensY);
    ctx.lineTo(lx + lensWidth * 0.48, lensY + lensHeight);
    ctx.lineTo(lx + lensWidth * 0.31, lensY + lensHeight);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.fill();
    ctx.restore();
  });

  // Nose bridge connector notch highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
  ctx.fillRect(-frameThick * 0.4, -totalHeight / 2 + 1, frameThick * 0.8, 2);

  ctx.restore();
}

/**
 * Filter 3: Blue Birds (blue bird by princessaliha)
 * Cute cartoon blue birds orbiting around head top, gentle wing flaps, porcelain glow & blush
 */
function renderBlueBirds(ctx, pose, time) {
  const { angle, eyeDist, forehead, leftCheek, rightCheek, upVector } = pose;

  // 1. Soft Baby Pink Cheek Blush
  const blushRadius = eyeDist * 0.4;
  drawSoftBlush(ctx, leftCheek.x, leftCheek.y, blushRadius, blushRadius * 0.72, angle, 'rgba(255, 115, 160, 0.28)');
  drawSoftBlush(ctx, rightCheek.x, rightCheek.y, blushRadius, blushRadius * 0.72, angle, 'rgba(255, 115, 160, 0.28)');

  // 2. Halo Orbit of Blue Birds hovering above head
  // Center of bird crown orbit
  const orbitCenterX = forehead.x + upVector.x * (eyeDist * 0.45);
  const orbitCenterY = forehead.y + upVector.y * (eyeDist * 0.45);

  const radiusX = eyeDist * 0.88;
  const radiusY = eyeDist * 0.32;
  const numBirds = 5;

  for (let i = 0; i < numBirds; i++) {
    const orbitAngle = time * 1.15 + (i * (Math.PI * 2)) / numBirds;
    // Calculate ellipse coordinate rotated along head roll angle
    const elX = Math.cos(orbitAngle) * radiusX;
    const elY = Math.sin(orbitAngle) * radiusY;

    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const birdX = orbitCenterX + (elX * cosA - elY * sinA);
    const birdY = orbitCenterY + (elX * sinA + elY * cosA);

    // Depth perspective (birds in front appear slightly larger and brighter)
    const depth = (Math.sin(orbitAngle) + 1) / 2; // 0 (back) to 1 (front)
    const scale = (0.75 + 0.35 * depth) * (eyeDist / 130);

    // Draw single animated blue bird
    ctx.save();
    ctx.translate(birdX, birdY);
    ctx.rotate(angle + Math.sin(time * 3 + i) * 0.15);
    ctx.scale(scale, scale);

    // Bird facing direction along velocity
    const movingRight = Math.cos(orbitAngle) < 0;
    if (!movingRight) ctx.scale(-1, 1);

    // Bird drop shadow
    ctx.shadowColor = 'rgba(2, 132, 199, 0.35)';
    ctx.shadowBlur = 8;

    // Bird Body (chubby cute cartoon teardrop)
    ctx.beginPath();
    ctx.ellipse(0, 0, 15, 11, 0, 0, Math.PI * 2);
    const bodyGrad = ctx.createLinearGradient(-15, -10, 15, 10);
    bodyGrad.addColorStop(0, '#60a5fa');
    bodyGrad.addColorStop(0.5, '#38bdf8');
    bodyGrad.addColorStop(1, '#0284c7');
    ctx.fillStyle = bodyGrad;
    ctx.fill();

    // Cute pointed bird tail feathers
    ctx.beginPath();
    ctx.moveTo(-12, -2);
    ctx.lineTo(-24, -9);
    ctx.lineTo(-20, 2);
    ctx.lineTo(-23, 7);
    ctx.lineTo(-11, 4);
    ctx.closePath();
    ctx.fillStyle = '#0284c7';
    ctx.fill();

    // Flapping Wing
    const wingFlap = Math.sin(time * 12 + i * 2) * 0.6;
    ctx.save();
    ctx.translate(-2, -3);
    ctx.rotate(wingFlap);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-4, -16, 12, -18, 8, -2);
    ctx.closePath();
    ctx.fillStyle = '#0369a1';
    ctx.fill();
    ctx.restore();

    // Cute Beak (bright yellow)
    ctx.beginPath();
    ctx.moveTo(13, -2);
    ctx.lineTo(22, 2);
    ctx.lineTo(13, 5);
    ctx.closePath();
    ctx.fillStyle = '#facc15';
    ctx.shadowBlur = 0;
    ctx.fill();

    // Cute Eye with white twinkle
    ctx.beginPath();
    ctx.arc(8, -3, 2.8, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(9, -4, 1.1, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Soft pink cheek dot on bird
    ctx.beginPath();
    ctx.arc(4, 3, 2.2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(244, 114, 182, 0.6)';
    ctx.fill();

    ctx.restore();
  }
}

/**
 * Filter 4: Heart Crown (Good Skin+HeartCrown by ozy635)
 * Floating glowing pink hearts forming an arc crown hovering over head, soft coral blush
 */
function renderHeartCrown(ctx, pose, time) {
  const { angle, eyeDist, faceHeight, forehead, leftCheek, rightCheek, upVector } = pose;

  // 1. Warm Coral-Pink Cheek Blush
  const blushRadius = eyeDist * 0.42;
  drawSoftBlush(ctx, leftCheek.x, leftCheek.y, blushRadius, blushRadius * 0.75, angle, 'rgba(255, 95, 130, 0.3)');
  drawSoftBlush(ctx, rightCheek.x, rightCheek.y, blushRadius, blushRadius * 0.75, angle, 'rgba(255, 95, 130, 0.3)');

  // 2. Glowing Floating Hearts forming an Arc Crown
  const heartCount = 7;
  const arcRadius = eyeDist * 0.78;
  const crownBase = {
    x: forehead.x + upVector.x * (eyeDist * 0.15),
    y: forehead.y + upVector.y * (eyeDist * 0.15)
  };

  const colors = [
    '#ff4d79',
    '#ff668f',
    '#f43f5e',
    '#ff2a6d',
    '#f43f5e',
    '#ff668f',
    '#ff4d79'
  ];

  for (let i = 0; i < heartCount; i++) {
    // Normal distribution angle across head arc: from -0.85 rad (-48 deg) to +0.85 rad (+48 deg)
    const tNorm = (i / (heartCount - 1)) * 2 - 1; // -1 to +1
    const heartAngle = tNorm * 0.85;

    // Bobbing / breathing animation
    const bob = Math.sin(time * 3.2 + i * 0.9) * (eyeDist * 0.04);
    const r = arcRadius + bob;

    // Ellipse arc point in head-local coordinates
    const localX = Math.sin(heartAngle) * r;
    const localY = -Math.cos(heartAngle) * r * 0.55;

    // Rotate along head angle
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const hx = crownBase.x + (localX * cosA - localY * sinA);
    const hy = crownBase.y + (localX * sinA + localY * cosA);

    // Center hearts slightly larger, outer hearts slightly smaller
    const centerFactor = 1 - Math.abs(tNorm) * 0.28;
    const pulseFactor = 1 + 0.08 * Math.sin(time * 4.5 + i * 1.2);
    const heartSize = eyeDist * 0.28 * centerFactor * pulseFactor;

    // Heart rotation slightly fanned out along the arc
    const rot = angle + heartAngle * 0.45;

    ctx.save();
    ctx.translate(hx, hy);
    ctx.rotate(rot);

    // Glowing neon heart
    drawHeart(
      ctx,
      0,
      0,
      heartSize,
      colors[i],
      'rgba(255, 75, 130, 0.75)',
      heartSize * 0.65
    );

    // Gentle white inner highlight dot
    ctx.beginPath();
    ctx.arc(-heartSize * 0.18, -heartSize * 0.15, heartSize * 0.09, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.fill();

    ctx.restore();
  }
}

/**
 * Filter 5: Pink Tea :-) (pink tea :-) by dingmintt)
 * Multi-tiered cluster of velvety wine-burgundy hearts hugging hairline/crown,
 * warm Korean-style tea blush across cheeks & nose tip
 */
function renderPinkTea(ctx, pose, time) {
  const { angle, eyeDist, forehead, leftCheek, rightCheek, noseTip, upVector } = pose;

  // 1. Warm Rosy-Tea Cheek & Nose Blush
  const blushRadius = eyeDist * 0.44;
  drawSoftBlush(ctx, leftCheek.x, leftCheek.y, blushRadius, blushRadius * 0.72, angle, 'rgba(215, 78, 98, 0.32)');
  drawSoftBlush(ctx, rightCheek.x, rightCheek.y, blushRadius, blushRadius * 0.72, angle, 'rgba(215, 78, 98, 0.32)');
  drawSoftBlush(ctx, noseTip.x, noseTip.y - eyeDist * 0.08, eyeDist * 0.22, eyeDist * 0.14, angle, 'rgba(215, 78, 98, 0.22)');

  // 2. Multi-Tiered Dense Cluster of Velvet Wine-Red Hearts
  // Hugging tightly over the hairline / crown as in reference screenshot
  const crownBase = {
    x: forehead.x + upVector.x * (eyeDist * 0.14),
    y: forehead.y + upVector.y * (eyeDist * 0.14)
  };
  const baseArcRadius = eyeDist * 0.76;

  const pinkTeaHearts = [
    // Far-left flank floating above temple/ear
    { t: -0.92, rMult: 0.85, sizeMult: 0.36, rotOffset: -0.32, colorTop: '#8c2239', colorBot: '#661424', bobPhase: 0.2 },
    // Mid-left lower tier
    { t: -0.74, rMult: 0.82, sizeMult: 0.32, rotOffset: -0.24, colorTop: '#9a2842', colorBot: '#70172a', bobPhase: 1.1 },
    // Mid-left tiny accent nestled low
    { t: -0.60, rMult: 0.68, sizeMult: 0.20, rotOffset: -0.16, colorTop: '#ab324c', colorBot: '#7e1b30', bobPhase: 2.3 },
    // Mid-left upper tier (prominent heart)
    { t: -0.46, rMult: 1.05, sizeMult: 0.44, rotOffset: -0.18, colorTop: '#831e34', colorBot: '#5e1121', bobPhase: 0.8 },
    // Center-left apex (high heart)
    { t: -0.24, rMult: 1.12, sizeMult: 0.48, rotOffset: -0.06, colorTop: '#92233c', colorBot: '#681526', bobPhase: 1.7 },
    // Center-left lower accent tucked below
    { t: -0.12, rMult: 0.78, sizeMult: 0.24, rotOffset: 0.04, colorTop: '#a42a45', colorBot: '#77182c', bobPhase: 3.1 },
    // Center-right apex (high prominent heart)
    { t: 0.10, rMult: 1.08, sizeMult: 0.46, rotOffset: 0.10, colorTop: '#831e34', colorBot: '#5e1121', bobPhase: 0.5 },
    // Mid-right upper tier
    { t: 0.28, rMult: 1.04, sizeMult: 0.44, rotOffset: 0.20, colorTop: '#90223a', colorBot: '#681526', bobPhase: 2.0 },
    // Mid-right lower accent
    { t: 0.35, rMult: 0.74, sizeMult: 0.22, rotOffset: 0.16, colorTop: '#a22944', colorBot: '#76182c', bobPhase: 1.4 },
    // Right upper tier
    { t: 0.50, rMult: 0.98, sizeMult: 0.42, rotOffset: 0.26, colorTop: '#841f35', colorBot: '#601222', bobPhase: 2.7 },
    // Right mid tier
    { t: 0.66, rMult: 0.85, sizeMult: 0.32, rotOffset: 0.30, colorTop: '#92233c', colorBot: '#6c1628', bobPhase: 0.9 },
    // Right lower accent
    { t: 0.78, rMult: 0.72, sizeMult: 0.24, rotOffset: 0.36, colorTop: '#a62c47', colorBot: '#7a192f', bobPhase: 1.9 },
    // Far-right flank floating above right temple/ear
    { t: 0.88, rMult: 0.64, sizeMult: 0.20, rotOffset: 0.42, colorTop: '#8c2239', colorBot: '#661424', bobPhase: 3.3 }
  ];

  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);

  pinkTeaHearts.forEach((h, idx) => {
    // Breathing floating motion
    const bob = Math.sin(time * 2.8 + h.bobPhase) * (eyeDist * 0.022);
    const r = baseArcRadius * h.rMult + bob;

    // Heart position along curved head arc in local coordinates
    const localX = Math.sin(h.t) * r;
    const localY = -Math.cos(h.t) * r * 0.62;

    // World coordinates aligned with head roll angle
    const hx = crownBase.x + (localX * cosA - localY * sinA);
    const hy = crownBase.y + (localX * sinA + localY * cosA);

    const heartSize = eyeDist * h.sizeMult * (1 + 0.04 * Math.sin(time * 3 + idx));
    const rot = angle + h.rotOffset;

    ctx.save();
    ctx.translate(hx, hy);
    ctx.rotate(rot);

    // Matte velvet drop shadow
    ctx.shadowColor = 'rgba(50, 10, 20, 0.38)';
    ctx.shadowBlur = 7;
    ctx.shadowOffsetY = 2;

    // Velvet gradient fill
    const grad = ctx.createLinearGradient(0, -heartSize * 0.4, 0, heartSize * 0.6);
    grad.addColorStop(0, h.colorTop);
    grad.addColorStop(1, h.colorBot);
    ctx.fillStyle = grad;

    // Heart path
    ctx.beginPath();
    const s = heartSize / 2;
    ctx.moveTo(0, s * 0.35);
    ctx.bezierCurveTo(-s * 0.92, -s * 0.52, -s * 1.08, s * 0.5, 0, s * 1.18);
    ctx.bezierCurveTo(s * 1.08, s * 0.5, s * 0.92, -s * 0.52, 0, s * 0.35);
    ctx.closePath();
    ctx.fill();

    // Subtle matte rim highlight
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(255, 180, 200, 0.18)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  });
}

/**
 * Filter 6: Capuccino (Capuccino by foreversleeep)
 * Warm creamy latte cafe wash, subtle vintage film dust particles,
 * soft vignette, and cozy latte blush when face is present
 */
function renderCapuccino(ctx, poses, time, width = 640, height = 480) {
  // 1. Warm Creamy Latte Ambient Atmosphere
  const latteGrad = ctx.createLinearGradient(0, 0, 0, height);
  latteGrad.addColorStop(0, 'rgba(215, 175, 140, 0.14)');
  latteGrad.addColorStop(0.5, 'rgba(185, 145, 115, 0.10)');
  latteGrad.addColorStop(1, 'rgba(140, 100, 75, 0.16)');
  ctx.fillStyle = latteGrad;
  ctx.fillRect(0, 0, width, height);

  // Soft Vignette (cozy dark cafe corners)
  const vig = ctx.createRadialGradient(
    width / 2, height / 2, Math.min(width, height) * 0.35,
    width / 2, height / 2, Math.max(width, height) * 0.75
  );
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(55, 30, 20, 0.24)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, width, height);

  // 2. Vintage Film Dust Particles & Specks (organic, gentle drift)
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

    // Occasional tiny vintage lint thread
    if (i % 5 === 0) {
      ctx.strokeStyle = 'rgba(255, 240, 225, 0.22)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + 4, py + 2);
      ctx.stroke();
    }
  }

  // 3. If Face is detected: Cozy Latte-Rose Cheek Blush & Soft Glow
  if (poses && poses.length > 0) {
    poses.forEach((pose) => {
      const { angle, eyeDist, leftCheek, rightCheek, noseTip } = pose;
      const blushRadius = eyeDist * 0.42;
      drawSoftBlush(ctx, leftCheek.x, leftCheek.y, blushRadius, blushRadius * 0.75, angle, 'rgba(195, 115, 95, 0.28)');
      drawSoftBlush(ctx, rightCheek.x, rightCheek.y, blushRadius, blushRadius * 0.75, angle, 'rgba(195, 115, 95, 0.28)');
      drawSoftBlush(ctx, noseTip.x, noseTip.y - eyeDist * 0.08, eyeDist * 0.22, eyeDist * 0.12, angle, 'rgba(195, 115, 95, 0.20)');
    });
  }
}

/**
 * Filter 7: El Filme (el filme by supernuay)
 * Golden hour sunlight glow, dreamy bloom, 90s star sparkle glints (✦),
 * and sun-kissed golden peach blush
 */
function renderElFilme(ctx, poses, time, width = 640, height = 480) {
  // 1. Golden Hour Sunlight Glow (Sunbeam wash from top-left)
  const sunGrad = ctx.createRadialGradient(
    width * 0.1, -height * 0.05, 0,
    width * 0.3, height * 0.4, Math.max(width, height) * 0.95
  );
  sunGrad.addColorStop(0, 'rgba(255, 225, 130, 0.28)');
  sunGrad.addColorStop(0.35, 'rgba(255, 185, 90, 0.15)');
  sunGrad.addColorStop(0.7, 'rgba(240, 140, 60, 0.08)');
  sunGrad.addColorStop(1, 'rgba(200, 100, 40, 0.02)');
  ctx.fillStyle = sunGrad;
  ctx.fillRect(0, 0, width, height);

  // Warm golden ambient film tint
  ctx.fillStyle = 'rgba(255, 190, 110, 0.07)';
  ctx.fillRect(0, 0, width, height);

  // 2. 90s Star Sparkle Glints (✦) twinkling in the golden light
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

  // 3. Face Enhancements: Sun-kissed golden peach blush & glints near hair
  if (poses && poses.length > 0) {
    poses.forEach((pose) => {
      const { angle, eyeDist, forehead, leftCheek, rightCheek, noseTip, upVector } = pose;

      // Sun-kissed golden-peach blush
      const blushRadius = eyeDist * 0.44;
      drawSoftBlush(ctx, leftCheek.x, leftCheek.y, blushRadius, blushRadius * 0.75, angle, 'rgba(245, 125, 75, 0.28)');
      drawSoftBlush(ctx, rightCheek.x, rightCheek.y, blushRadius, blushRadius * 0.75, angle, 'rgba(245, 125, 75, 0.28)');
      drawSoftBlush(ctx, noseTip.x, noseTip.y - eyeDist * 0.08, eyeDist * 0.25, eyeDist * 0.15, angle, 'rgba(245, 125, 75, 0.22)');

      // Highlight glint near hair crown / hairline
      const hairGlintX = forehead.x + upVector.x * (eyeDist * 0.35) - Math.cos(angle) * (eyeDist * 0.25);
      const hairGlintY = forehead.y + upVector.y * (eyeDist * 0.35) - Math.sin(angle) * (eyeDist * 0.25);
      const pulse = 0.5 + 0.5 * Math.sin(time * 4.0);
      drawSparkleStar(ctx, hairGlintX, hairGlintY, eyeDist * 0.18 * (0.7 + 0.3 * pulse), 0.8 * pulse, time * 0.5);
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
