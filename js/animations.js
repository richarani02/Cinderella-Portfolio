/**
 * ANIMATIONS — Scroll-driven reveal & interaction effects
 * Cinderella Portfolio — Richa Rani
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── REVEAL ON SCROLL ─────────────────────────────────── */

  function initReveal() {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    if (prefersReducedMotion) {
      // Make all visible immediately
      revealEls.forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealEls.forEach(el => observer.observe(el));
  }

  /* ─── NAVIGATION ───────────────────────────────────────── */

  function initNav() {
    const nav    = document.querySelector('.nav');
    const toggle = document.querySelector('.nav__toggle');
    const mobile = document.querySelector('.nav__mobile');
    const mobileLinks = document.querySelectorAll('.nav__mobile .nav__link');

    if (!nav) return;

    // Scroll → add .scrolled class
    const handleScroll = () => {
      if (window.scrollY > 60) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };

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

      // Close on link click
      mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
          toggle.classList.remove('open');
          mobile.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });

      // Close on Escape
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && mobile.classList.contains('open')) {
          toggle.classList.remove('open');
          mobile.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    }

    // Active link tracking
    const sections = document.querySelectorAll('section[id]');
    const navLinks  = document.querySelectorAll('.nav__link[href^="#"]');

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
              link.classList.toggle(
                'active',
                link.getAttribute('href') === `#${id}`
              );
            });
          }
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach(s => sectionObserver.observe(s));
  }

  /* ─── CONTACT FORM (aesthetic only — no backend) ─────── */

  function initForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (!btn) return;

      const original = btn.textContent;
      btn.textContent = 'Message Sent ✦';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
        form.reset();
      }, 3000);
    });
  }

  /* ─── HERO NAME ENTRANCE ──────────────────────────────── */

  function initHeroEntrance() {
    if (prefersReducedMotion) return;

    const heroContent = document.querySelector('.hero__content');
    if (!heroContent) return;

    // Stagger hero children
    const children = heroContent.children;
    Array.from(children).forEach((child, i) => {
      child.style.opacity = '0';
      child.style.transform = 'translateY(32px)';
      child.style.transition = `opacity 900ms cubic-bezier(0.16,1,0.3,1) ${i * 140}ms, transform 900ms cubic-bezier(0.16,1,0.3,1) ${i * 140}ms`;

      // Trigger after a brief frame delay
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          child.style.opacity = '';
          child.style.transform = '';
        });
      });
    });
  }

  /* ─── MIDNIGHT EASTER EGG ─────────────────────────────── */
  // At exactly midnight (local time), the footer clock glows golden

  function initMidnightEgg() {
    const footerLogo = document.querySelector('.footer__logo');
    if (!footerLogo) return;

    const now = new Date();
    const hours   = now.getHours();
    const minutes = now.getMinutes();

    // Within 1 minute of midnight
    if (hours === 0 && minutes === 0) {
      footerLogo.style.color = 'var(--color-champagne)';
      footerLogo.style.textShadow = '0 0 24px rgba(212,184,150,0.5)';

      // Add a "Before midnight has passed" message
      const msg = document.createElement('p');
      msg.textContent = '✦  The clock has struck twelve  ✦';
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

  /* ─── SKILL TAG HOVER STAGGER ─────────────────────────── */

  function initSkillTags() {
    const groups = document.querySelectorAll('.skill-group');
    groups.forEach(group => {
      const tags = group.querySelectorAll('.skill-tag');
      tags.forEach((tag, i) => {
        tag.style.transitionDelay = `${i * 30}ms`;
      });
    });
  }

  /* ─── MOUSE MOONLIGHT GLOW ────────────────────────────── */

  function initMouseGlow() {
    if (prefersReducedMotion || window.innerWidth < 1024) return;

    let glow = document.getElementById('mouse-glow');
    if (!glow) {
      glow = document.createElement('div');
      glow.id = 'mouse-glow';
      glow.setAttribute('aria-hidden', 'true');
      document.body.appendChild(glow);
    }

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let isMoving = false;

    window.addEventListener('pointermove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!isMoving) {
        isMoving = true;
        glow.classList.add('active');
        updatePosition();
      }
    }, { passive: true });

    function updatePosition() {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      glow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

      if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
        requestAnimationFrame(updatePosition);
      } else {
        isMoving = false;
      }
    }
  }

  /* ─── CRYSTAL LIGHT SWEEP INITIALIZER ──────────────────── */

  function initCrystalSweep() {
    const sweepElements = document.querySelectorAll(
      '.project-card, .stat-card, .skill-group, .cert-card, .mini-card, .btn'
    );
    sweepElements.forEach((el) => {
      if (!el.classList.contains('crystal-sweep')) {
        el.classList.add('crystal-sweep');
      }
    });
  }

  /* ─── INIT ──────────────────────────────────────────────── */

  function init() {
    initNav();
    initReveal();
    initHeroEntrance();
    initForm();
    initMidnightEgg();
    initSkillTags();
    initMouseGlow();
    initCrystalSweep();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
