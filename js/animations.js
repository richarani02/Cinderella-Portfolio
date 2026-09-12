/**
 * ANIMATIONS & INTERACTIVE MAGIC
 * Richa Rani — Cinderella Portfolio
 */

(function () {
  'use strict';

  /* ─── 1. MIDNIGHT ENTRANCE OVERLAY ───────────────────────── */
  function initMidnightOverlay() {
    const overlay = document.getElementById('midnight-overlay');
    if (!overlay) return;

    // Automatically fade out after clock ticks (2.4 seconds)
    setTimeout(() => {
      overlay.classList.add('fade-out');
    }, 2400);

    // Allow user to click to skip
    overlay.addEventListener('click', () => {
      overlay.classList.add('fade-out');
    });
  }

  /* ─── 2. CURSOR SPARKLE TRAIL ───────────────────────────── */
  function initCursorSparkles() {
    let lastX = 0;
    let lastY = 0;
    const threshold = 15; // Min distance before creating sparkle

    window.addEventListener('mousemove', (e) => {
      const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      if (dist > threshold) {
        lastX = e.clientX;
        lastY = e.clientY;
        createSparkle(e.clientX, e.clientY);
      }
    }, { passive: true });

    function createSparkle(x, y) {
      const sparkle = document.createElement('div');
      sparkle.className = 'cursor-sparkle';
      const size = Math.random() * 8 + 6;
      sparkle.style.width = `${size}px`;
      sparkle.style.height = `${size}px`;
      sparkle.style.left = `${x - size / 2}px`;
      sparkle.style.top = `${y - size / 2}px`;
      
      // Randomly select Champagne Gold or Cinderella Blue tint
      const colors = ['#D9B86C', '#A9D8F5', '#FFF9F0'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      sparkle.style.background = `radial-gradient(circle, ${color} 0%, transparent 80%)`;

      document.body.appendChild(sparkle);

      setTimeout(() => {
        sparkle.remove();
      }, 800);
    }
  }

  /* ─── 3. NAV SCROLL & MOBILE MENU ───────────────────────── */
  function initNav() {
    const nav = document.querySelector('.nav');
    const toggle = document.getElementById('nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.nav__mobile .nav__link');

    if (nav) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
      }, { passive: true });
    }

    if (toggle && mobileNav) {
      toggle.addEventListener('click', () => {
        const isOpen = toggle.classList.contains('open');
        toggle.classList.toggle('open');
        mobileNav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', !isOpen);
      });

      mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
          toggle.classList.remove('open');
          mobileNav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  /* ─── 4. SCROLL REVEAL & SKILL BAR ANIMATIONS ───────────── */
  function initScrollReveals() {
    const reveals = document.querySelectorAll('.reveal');
    const skillBars = document.querySelectorAll('.skill-card__bar-fill');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // If skill card, trigger bar fill
          if (entry.target.classList.contains('skill-card')) {
            const fill = entry.target.querySelector('.skill-card__bar-fill');
            if (fill) {
              const targetWidth = fill.getAttribute('data-width') || '80%';
              fill.style.width = targetWidth;
            }
          }
        }
      });
    }, { threshold: 0.15 });

    reveals.forEach(el => observer.observe(el));
    skillBars.forEach(bar => {
      const card = bar.closest('.skill-card');
      if (card) observer.observe(card);
    });
  }

  /* ─── 5. CONTACT FORM HANDLER ───────────────────────────── */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (!btn) return;

      const originalText = btn.innerHTML;
      btn.innerHTML = '✨ Magic Sent! ✦';
      btn.disabled = true;
      btn.style.opacity = '0.85';

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        btn.style.opacity = '1';
        form.reset();
      }, 3000);
    });
  }

  /* ─── INITIALIZATION ────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initMidnightOverlay();
    initCursorSparkles();
    initNav();
    initScrollReveals();
    initContactForm();
  });

})();
