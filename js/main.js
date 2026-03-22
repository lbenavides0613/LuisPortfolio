/* ============================================================
   main.js — Portfolio Interactivity
   Luis Carlos Benavides Fiallo · Senior Product Manager
   Vanilla JS (ES6+) · No dependencies
   ============================================================ */

'use strict';

/* ============================================================
   1. DOM References
   ============================================================ */
const nav        = document.getElementById('nav');
const navToggle  = document.getElementById('navToggle');
const navMenu    = document.getElementById('navMenu');
const navLinks   = document.querySelectorAll('.nav__link');
const sections   = document.querySelectorAll('section[id]');

/* ============================================================
   2. Sticky Nav — shadow on scroll
   ============================================================ */
function handleNavScroll() {
  nav.classList.toggle('scrolled', window.scrollY > 24);
  highlightActiveNavLink();
}

window.addEventListener('scroll', handleNavScroll, { passive: true });

/* ============================================================
   3. Mobile Menu Toggle
   ============================================================ */
navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);

  const [top, mid, bot] = navToggle.querySelectorAll('span');
  if (isOpen) {
    top.style.transform = 'rotate(45deg) translate(5px, 5px)';
    mid.style.opacity   = '0';
    bot.style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    top.style.transform = '';
    mid.style.opacity   = '';
    bot.style.transform = '';
  }
});

// Close menu when a nav link is clicked
navLinks.forEach(link => {
  link.addEventListener('click', closeMenu);
});

function closeMenu() {
  navMenu.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  const [top, mid, bot] = navToggle.querySelectorAll('span');
  top.style.transform = '';
  mid.style.opacity   = '';
  bot.style.transform = '';
}

/* ============================================================
   4. Active Nav Link Tracking
   ============================================================ */
function highlightActiveNavLink() {
  const scrollMid = window.scrollY + window.innerHeight / 3;

  sections.forEach(section => {
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav__link[href="#${id}"]`);

    if (link) {
      link.classList.toggle('active', scrollMid >= top && scrollMid < bottom);
    }
  });
}

/* ============================================================
   5. Scroll Fade-in — IntersectionObserver
   ============================================================ */
const fadeEls = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    // Stagger siblings within the same parent
    const sibs = Array.from(
      entry.target.parentElement.querySelectorAll('.fade-in:not(.visible)')
    );
    const idx   = sibs.indexOf(entry.target);
    const delay = Math.max(0, idx) * 70;

    setTimeout(() => {
      entry.target.classList.add('visible');
    }, delay);

    fadeObserver.unobserve(entry.target);
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

fadeEls.forEach(el => fadeObserver.observe(el));

/* ============================================================
   6. Animated Number Counters
   ============================================================ */
function animateCounter(el, target, duration = 1600) {
  const startTime = performance.now();

  function step(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);

    el.textContent = Math.floor(eased * target);

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(step);
}

const counterEls = document.querySelectorAll('[data-target]');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const target = parseInt(entry.target.getAttribute('data-target'), 10);
    animateCounter(entry.target, target);
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.6 });

counterEls.forEach(el => counterObserver.observe(el));

/* ============================================================
   7. Smooth Scroll for Anchor Links
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const id     = anchor.getAttribute('href');
    const target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    const offset = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});

/* ============================================================
   8. Timeline Item Staggered Entrance
   ============================================================ */
const timelineItems = document.querySelectorAll('.timeline__item');

const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    // Find index among all timeline items
    const idx   = Array.from(timelineItems).indexOf(entry.target);
    const delay = (idx % 4) * 80; // reset stagger every 4 items

    setTimeout(() => {
      entry.target.classList.add('visible');
    }, delay);

    timelineObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });

timelineItems.forEach(item => timelineObserver.observe(item));

/* ============================================================
   9. Init
   ============================================================ */
// Run once on load to set correct initial state
handleNavScroll();
