/**
 * STARFIELD — Cinematic depth particle system
 * Cinderella Portfolio — Richa Rani
 *
 * Three-tier parallax star layers (near / mid / far) plus
 * occasional champagne shooting star.
 * Performance-conscious: RAF-based, viewport-aware, respects reduced-motion.
 */

(function () {
  'use strict';

  const canvas = document.getElementById('starfield');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── CONFIG ───────────────────────────────────────────────
  const LAYERS = [
    // Far  — tiny, slow, many
    { count: 90,  sizeMin: 0.2, sizeMax: 0.6,  opacityMin: 0.06, opacityMax: 0.25, driftScale: 0.004, twinkleAmp: 0.04 },
    // Mid  — medium, moderate
    { count: 55,  sizeMin: 0.5, sizeMax: 1.0,  opacityMin: 0.12, opacityMax: 0.40, driftScale: 0.008, twinkleAmp: 0.10 },
    // Near — larger, more visible
    { count: 25,  sizeMin: 0.9, sizeMax: 1.6,  opacityMin: 0.20, opacityMax: 0.55, driftScale: 0.015, twinkleAmp: 0.18 },
  ];

  // A handful of champagne-tinted "feature" stars on the near layer
  const CHAMPAGNE_COUNT = 10;

  // Shooting star config
  const SHOOT = {
    chance: 0.0006,    // per-frame probability of spawning one
    minSpeed: 220,     // px/sec
    maxSpeed: 380,
    angle: -30,        // degrees from horizontal (going upper-right → lower-left)
    tailLength: 110,
    maxActive: 1,
  };

  let stars = [];
  let shooters = [];
  let width, height;
  let animationId;
  let lastTs = 0;

  // ─── UTILS ────────────────────────────────────────────────

  function rand(min, max) { return min + Math.random() * (max - min); }

  // ─── RESIZE ───────────────────────────────────────────────

  function resize() {
    width  = canvas.width  = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  // ─── STAR FACTORY ─────────────────────────────────────────

  function createStar(layer) {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      radius: rand(layer.sizeMin, layer.sizeMax),
      baseOpacity: rand(layer.opacityMin, layer.opacityMax),
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: rand(0.0008, 0.003),
      twinkleAmp: layer.twinkleAmp * rand(0.6, 1.4),
      driftX: rand(-0.003, 0.003) * layer.driftScale * 80,
      driftY: rand(0.003, 0.008) * layer.driftScale * 80,
      champagne: false,
    };
  }

  function initStars() {
    stars = [];
    LAYERS.forEach(layer => {
      for (let i = 0; i < layer.count; i++) {
        stars.push({ ...createStar(layer), layerRef: layer });
      }
    });
    // Champagne near-layer stars
    const nearLayer = LAYERS[2];
    for (let i = 0; i < CHAMPAGNE_COUNT; i++) {
      const s = createStar(nearLayer);
      s.champagne = true;
      s.radius    = rand(0.7, 1.5);
      s.twinkleAmp = 0.22;
      stars.push({ ...s, layerRef: nearLayer });
    }
  }

  // ─── SHOOTING STAR ────────────────────────────────────────

  function spawnShooter() {
    const rad = (SHOOT.angle * Math.PI) / 180;
    const speed = rand(SHOOT.minSpeed, SHOOT.maxSpeed);
    // Start off-canvas on the top-right side
    shooters.push({
      x:  rand(width * 0.3, width * 1.1),
      y:  rand(-60, height * 0.3),
      vx: Math.cos(rad) * speed,
      vy: Math.sin(rad) * speed,
      opacity: 0,
      age: 0,
      lifetime: rand(0.55, 0.85), // seconds
    });
  }

  function updateShooters(dt) {
    for (let i = shooters.length - 1; i >= 0; i--) {
      const s = shooters[i];
      s.age += dt;
      const t = s.age / s.lifetime;
      // Fade in then out
      s.opacity = t < 0.15
        ? (t / 0.15)
        : Math.max(0, 1 - (t - 0.15) / 0.85);
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      if (s.age >= s.lifetime) shooters.splice(i, 1);
    }
  }

  function drawShooters() {
    shooters.forEach(s => {
      const rad = (SHOOT.angle * Math.PI) / 180;
      const tx  = s.x - Math.cos(rad) * SHOOT.tailLength;
      const ty  = s.y - Math.sin(rad) * SHOOT.tailLength;

      const grad = ctx.createLinearGradient(tx, ty, s.x, s.y);
      grad.addColorStop(0, `rgba(217, 184, 108, 0)`);
      grad.addColorStop(0.5, `rgba(217, 184, 108, ${s.opacity * 0.4})`);
      grad.addColorStop(1, `rgba(255, 249, 240, ${s.opacity * 0.9})`);

      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(s.x, s.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth   = 1;
      ctx.stroke();

      // Head sparkle
      ctx.beginPath();
      ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 249, 240, ${s.opacity})`;
      ctx.fill();
    });
  }

  // ─── STAR DRAW ────────────────────────────────────────────

  function drawStar(s) {
    const twinkle = Math.sin(s.phase) * s.twinkleAmp;
    const alpha   = Math.min(1, Math.max(0, s.baseOpacity + twinkle));
    const colour  = s.champagne
      ? `rgba(217, 184, 108, ${alpha})`
      : `rgba(169, 216, 245, ${alpha})`;

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    ctx.fillStyle = colour;
    ctx.fill();

    // Soft cross-flare for larger stars
    if (s.radius > 1.1 && alpha > 0.3) {
      const flareAlpha = alpha * 0.18;
      const flareLen   = s.radius * 3.5;
      ctx.strokeStyle  = s.champagne
        ? `rgba(217, 184, 108, ${flareAlpha})`
        : `rgba(169, 216, 245, ${flareAlpha})`;
      ctx.lineWidth    = 0.5;
      ctx.beginPath();
      ctx.moveTo(s.x - flareLen, s.y);
      ctx.lineTo(s.x + flareLen, s.y);
      ctx.moveTo(s.x, s.y - flareLen);
      ctx.lineTo(s.x, s.y + flareLen);
      ctx.stroke();
    }
  }

  function updateStar(s) {
    if (prefersReducedMotion) return;
    s.phase += s.phaseSpeed + Math.random() * 0.0005;
    s.x     += s.driftX;
    s.y     += s.driftY;
    if (s.y > height + 2) s.y = -2;
    if (s.x > width  + 2) s.x = -2;
    if (s.x < -2)          s.x = width + 2;
  }

  // ─── RENDER LOOP ──────────────────────────────────────────

  function render(ts) {
    const dt = Math.min((ts - lastTs) / 1000, 0.05); // cap at 50ms
    lastTs   = ts;

    ctx.clearRect(0, 0, width, height);

    // Stars
    for (const s of stars) {
      updateStar(s);
      drawStar(s);
    }

    // Shooting stars (only when not reduced-motion)
    if (!prefersReducedMotion) {
      if (shooters.length < SHOOT.maxActive && Math.random() < SHOOT.chance) {
        spawnShooter();
      }
      updateShooters(dt);
      drawShooters();
    }

    animationId = requestAnimationFrame(render);
  }

  // ─── INIT ─────────────────────────────────────────────────

  function init() {
    resize();
    initStars();
    lastTs = performance.now();
    animationId = requestAnimationFrame(render);
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      cancelAnimationFrame(animationId);
      resize();
      lastTs = performance.now();
      animationId = requestAnimationFrame(render);
    }, 200);
  }, { passive: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
