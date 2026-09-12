/**
 * STARFIELD — Elegant minimal star particle system
 * Cinderella Portfolio — Richa Rani
 *
 * Creates a gentle field of twinkling stars on a canvas element.
 * Performance-conscious: RAF-based, respects reduced-motion.
 */

(function () {
  'use strict';

  const canvas = document.getElementById('starfield');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Star configuration
  const CONFIG = {
    count: 180,           // total stars
    sizeMin: 0.3,
    sizeMax: 1.4,
    opacityMin: 0.08,
    opacityMax: 0.55,
    twinkleSpeed: 0.004,  // opacity oscillation speed
    driftSpeed: 0.012,    // very gentle vertical drift
  };

  let stars = [];
  let width, height;
  let animationId;

  function resize() {
    width  = canvas.width  = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function createStar() {
    return {
      x:       Math.random() * width,
      y:       Math.random() * height,
      radius:  randomBetween(CONFIG.sizeMin, CONFIG.sizeMax),
      opacity: randomBetween(CONFIG.opacityMin, CONFIG.opacityMax),
      twinklePhase: Math.random() * Math.PI * 2, // offset so they don't pulse together
      twinkleAmp:   randomBetween(0.03, 0.18),
      drift:   randomBetween(-0.004, 0.004),      // horizontal drift (very subtle)
      driftY:  randomBetween(0.006, 0.018),       // downward drift (floating)
    };
  }

  function initStars() {
    stars = Array.from({ length: CONFIG.count }, createStar);
  }

  function drawStar(star) {
    const twinkle = star.opacity + Math.sin(star.twinklePhase) * star.twinkleAmp;
    const alpha   = Math.max(0, Math.min(1, twinkle));

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200, 216, 245, ${alpha})`;
    ctx.fill();
  }

  function update(star) {
    if (prefersReducedMotion) return;

    star.twinklePhase += CONFIG.twinkleSpeed + Math.random() * 0.002;
    star.y += star.driftY * CONFIG.driftSpeed;
    star.x += star.drift;

    // Wrap around edges
    if (star.y > height + 2)  star.y = -2;
    if (star.x > width  + 2)  star.x = -2;
    if (star.x < -2)          star.x = width + 2;
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    for (const star of stars) {
      update(star);
      drawStar(star);
    }
    animationId = requestAnimationFrame(render);
  }

  // Add a few slightly larger champagne-coloured "feature" stars
  function addChampagneStars() {
    const champagneCount = 12;
    for (let i = 0; i < champagneCount; i++) {
      const star = createStar();
      star.radius  = randomBetween(0.8, 1.6);
      star.opacity = randomBetween(0.2, 0.5);
      star.twinkleAmp = randomBetween(0.1, 0.25);
      star.champagne = true;
      stars.push(star);
    }
  }

  // Override draw for champagne stars
  const originalRender = render;
  function renderFull() {
    ctx.clearRect(0, 0, width, height);
    for (const star of stars) {
      update(star);
      if (star.champagne) {
        const twinkle = star.opacity + Math.sin(star.twinklePhase) * star.twinkleAmp;
        const alpha   = Math.max(0, Math.min(1, twinkle));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 184, 150, ${alpha})`;
        ctx.fill();
      } else {
        drawStar(star);
      }
    }
    animationId = requestAnimationFrame(renderFull);
  }

  function init() {
    resize();
    initStars();
    addChampagneStars();
    renderFull();
  }

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animationId);
    resize();
    renderFull();
  });

  // Only start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
