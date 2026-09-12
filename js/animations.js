/**
 * ANIMATIONS — Scroll-driven reveal & cinematic interactions
 * Cinderella Portfolio — Richa Rani
 *
 * Modules:
 *  - initNav              Navigation scroll state + mobile drawer + active-link
 *  - initHeroEntrance     8-stage cinematic sequence
 *  - initReveal           Scroll-based reveal with variant patterns
 *  - initForm             Contact form aesthetic handler
 *  - initSkillTags        Staggered skill tag reveal
 *  - initTimelineGlow     Animated timeline node pulses
 *  - initMouseGlow        Smooth pointer-following moonlight (desktop only)
 *  - initCrystalSweep     Light-sweep class binding
 *  - initMidnightEgg      Footer midnight easter-egg
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ================================================================
     NAV — scroll state + mobile drawer + active-link tracking
  ================================================================ */

  function initNav() {
    const nav         = document.querySelector('.nav');
    const toggle      = document.querySelector('.nav__toggle');
    const mobile      = document.querySelector('.nav__mobile');
    const mobileLinks = document.querySelectorAll('.nav__mobile .nav__link');
    if (!nav) return;

    // Scroll → .scrolled
    const handleScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Mobile toggle
    if (toggle && mobile) {
      toggle.addEventListener('click', () => {
        const isOpen = toggle.classList.contains('open');
        toggle.classList.toggle('open');
        mobile.classList.toggle('open');
        toggle.setAttribute('aria-expanded', !isOpen);
        document.body.style.overflow = isOpen ? '' : 'hidden';
      });

      mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
          toggle.classList.remove('open');
          mobile.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });

      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && mobile.classList.contains('open')) {
          toggle.classList.remove('open');
          mobile.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    }

    // Active-link tracking
    const sections  = document.querySelectorAll('section[id]');
    const navLinks  = document.querySelectorAll('.nav__link[href^="#"]');
    const secObs    = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
        }
      });
    }, { threshold: 0.4 });
    sections.forEach(s => secObs.observe(s));
  }

  /* ================================================================
     HERO ENTRANCE — 8-stage cinematic sequence
  ================================================================ */

  function initHeroEntrance() {
    // With reduced-motion: skip the sequence, reveal everything at once
    const heroContent = document.querySelector('.hero__content');
    if (!heroContent) return;

    if (prefersReducedMotion) {
      Array.from(heroContent.children).forEach(c => {
        c.style.opacity   = '';
        c.style.transform = '';
      });
      return;
    }

    // Stage timing (ms after page load)
    const STAGES = [
      { delay: 80,   dur: 700 },   // Stage 1: eyebrow label
      { delay: 320,  dur: 900 },   // Stage 2: headline Richa Rani
      { delay: 700,  dur: 800 },   // Stage 3: tagline role text
      { delay: 950,  dur: 750 },   // Stage 4: body tagline
      { delay: 1150, dur: 680 },   // Stage 5: CTA buttons
      { delay: 1350, dur: 600 },   // Stage 6: social links
    ];

    const children = Array.from(heroContent.children);
    children.forEach((child, i) => {
      const cfg = STAGES[i] || { delay: 1400 + i * 120, dur: 550 };
      child.style.opacity   = '0';
      child.style.transform = 'translateY(28px)';
      child.style.filter    = 'blur(3px)';
      child.style.transition = [
        `opacity  ${cfg.dur}ms cubic-bezier(0.16, 1, 0.3, 1) ${cfg.delay}ms`,
        `transform ${cfg.dur}ms cubic-bezier(0.16, 1, 0.3, 1) ${cfg.delay}ms`,
        `filter   ${cfg.dur * 0.7}ms ease ${cfg.delay}ms`,
      ].join(', ');
    });

    // Trigger — double-rAF ensures paint before transition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        children.forEach(child => {
          child.style.opacity   = '';
          child.style.transform = '';
          child.style.filter    = '';
        });
      });
    });

    // Subtle hero arch fade-in
    const arch = document.querySelector('.hero__arch');
    const crystal = document.querySelector('.hero__crystal-center');
    const moon = document.querySelector('.hero__moon');
    [arch, crystal, moon].forEach((el, idx) => {
      if (!el) return;
      el.style.opacity   = '0';
      el.style.transition = `opacity 1800ms ease ${200 + idx * 200}ms`;
      requestAnimationFrame(() => requestAnimationFrame(() => { el.style.opacity = ''; }));
    });
  }

  /* ================================================================
     REVEAL — Scroll-based with variant animation patterns
  ================================================================ */

  function initReveal() {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    if (prefersReducedMotion) {
      revealEls.forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -48px 0px' });

    revealEls.forEach(el => observer.observe(el));
  }

  /* ================================================================
     FORM — Aesthetic-only contact form handler
  ================================================================ */

  function initForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn      = form.querySelector('button[type="submit"]');
      if (!btn) return;
      const original = btn.innerHTML;
      btn.innerHTML  = 'Message Sent ✦';
      btn.disabled   = true;
      setTimeout(() => { btn.innerHTML = original; btn.disabled = false; form.reset(); }, 3200);
    });
  }

  /* ================================================================
     SKILL TAGS — Staggered delay on hover group
  ================================================================ */

  function initSkillTags() {
    document.querySelectorAll('.skill-group').forEach(group => {
      group.querySelectorAll('.skill-tag').forEach((tag, i) => {
        tag.style.transitionDelay = `${i * 28}ms`;
      });
    });
  }

  /* ================================================================
     TIMELINE NODES — Pulsing glow on each star node
  ================================================================ */

  function initTimelineGlow() {
    if (prefersReducedMotion) return;

    const nodes = document.querySelectorAll('.timeline__node-star');
    nodes.forEach((node, i) => {
      node.style.animationDelay = `${i * 1200}ms`;
      node.classList.add('timeline__node-star--pulse');
    });

    // Animate the timeline line drawing on scroll
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    const lineObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          timeline.classList.add('timeline--revealed');
          lineObs.unobserve(timeline);
        }
      });
    }, { threshold: 0.05 });
    lineObs.observe(timeline);
  }

  /* ================================================================
     MOUSE MOONLIGHT GLOW — Smooth lerped pointer follower
  ================================================================ */

  function initMouseGlow() {
    // Desktop-only; disabled if reduced-motion
    if (prefersReducedMotion || window.innerWidth < 1024) return;

    let glow = document.getElementById('mouse-glow');
    if (!glow) {
      glow = document.createElement('div');
      glow.id = 'mouse-glow';
      glow.setAttribute('aria-hidden', 'true');
      document.body.appendChild(glow);
    }

    let tx = window.innerWidth  / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;
    let rafId = null;
    let active = false;

    window.addEventListener('pointermove', e => {
      tx = e.clientX;
      ty = e.clientY;
      if (!active) {
        active = true;
        glow.classList.add('active');
        animate();
      }
    }, { passive: true });

    function animate() {
      cx += (tx - cx) * 0.07;
      cy += (ty - cy) * 0.07;
      glow.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      const dist = Math.hypot(tx - cx, ty - cy);
      if (dist > 0.15) {
        rafId = requestAnimationFrame(animate);
      } else {
        active = false;
      }
    }
  }

  /* ================================================================
     CRYSTAL SWEEP — Light-reflection on interactive cards
  ================================================================ */

  function initCrystalSweep() {
    const targets = document.querySelectorAll(
      '.project-card, .stat-card, .skill-group, .cert-card, .mini-card, .btn'
    );
    targets.forEach(el => {
      if (!el.classList.contains('crystal-sweep')) el.classList.add('crystal-sweep');
    });
  }

  /* ================================================================
     MIDNIGHT EASTER EGG — Subtle footer golden moment at 00:00
  ================================================================ */

  function initMidnightEgg() {
    const footerLogo = document.querySelector('.footer__logo');
    if (!footerLogo) return;
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
      footerLogo.style.cssText += `
        color: var(--color-champagne);
        text-shadow: 0 0 32px rgba(212, 184, 150, 0.5);
        transition: all 1.2s ease;
      `;
      const msg = document.createElement('p');
      msg.textContent = '✦  The clock has struck twelve  ✦';
      msg.setAttribute('aria-live', 'polite');
      msg.style.cssText = `
        font-size: var(--text-xs);
        letter-spacing: 0.2em;
        color: rgba(212,184,150,0.7);
        margin-top: 0.5rem;
        text-transform: uppercase;
        animation: pulse-dot 2s ease-in-out infinite;
      `;
      footerLogo.after(msg);
    }
  }

  /* ================================================================
     INIT
  ================================================================ */

  function init() {
    initNav();
    initReveal();
    initHeroEntrance();
    initForm();
    initSkillTags();
    initTimelineGlow();
    initMouseGlow();
    initCrystalSweep();
    initMidnightEgg();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
