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
   Sticky Progress — desktop-only cinematic entrance
   ============================================================ */
function initStickyProgress(selector) {
  const els = document.querySelectorAll(selector);
  if (!els.length) return;

  const desktop = window.matchMedia('(min-width: 1024px)');
  let ticking = false;

  function update() {
    ticking = false;
    if (!desktop.matches) { els.forEach(el => el.style.removeProperty('--progress')); return; }
    const vh = window.innerHeight;
    els.forEach(el => {
      const rect = el.getBoundingClientRect();
      // 0 cuando el elemento entra por abajo, 1 cuando su centro alcanza el centro del viewport
      const raw = 1 - Math.max(0, rect.top) / vh;
      el.style.setProperty('--progress', Math.min(1, Math.max(0, raw)).toFixed(3));
    });
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  desktop.addEventListener('change', update);
  update();
}

initStickyProgress('[data-sticky] > .hero__inner, [data-sticky] > .container, .ai__inner[data-sticky]');

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

    const idx   = Array.from(timelineItems).indexOf(entry.target);
    const delay = (idx % 4) * 80;

    setTimeout(() => {
      entry.target.classList.add('visible');
    }, delay);

    timelineObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });

timelineItems.forEach(item => timelineObserver.observe(item));

/* ============================================================
   9. Dark Mode Toggle
   ============================================================ */
const darkToggle = document.getElementById('darkToggle');
const iconMoon   = darkToggle.querySelector('.icon-moon');
const iconSun    = darkToggle.querySelector('.icon-sun');

function setDarkMode(enabled) {
  document.body.classList.toggle('dark', enabled);
  iconMoon.style.display = enabled ? 'none'  : '';
  iconSun.style.display  = enabled ? ''      : 'none';
  localStorage.setItem('darkMode', enabled ? '1' : '0');
}

darkToggle.addEventListener('click', () => {
  setDarkMode(!document.body.classList.contains('dark'));
});

// Restore preference on load
if (localStorage.getItem('darkMode') === '1') {
  setDarkMode(true);
}

/* ============================================================
   10. Language Toggle — EN / ES
   ============================================================ */
const translations = {
  en: {
    // Nav
    'nav.ai':           'AI Expertise',
    'nav.about':        'About',
    'nav.experience':   'Experience',
    'nav.case-studies': 'Case Studies',
    'nav.skills':       'Skills',
    'nav.education':    'Education',
    'nav.contact':      'Contact',

    // Hero
    'hero.title':    'Senior Product Manager',
    'hero.tagline':  '10+ years generating <strong>$10M+ in revenue</strong> across Logistics and FinTech. Expert in "0 to 1" product development and scaling through <strong>AI-driven automation</strong>.',
    'hero.cta1':     'Explore AI Work',
    'hero.cta2':     'Get In Touch',
    'hero.m.years':  'Years Experience',
    'hero.m.revenue':'Revenue Generated',
    'hero.m.people': 'People Led',
    'hero.m.units':  'Units Launched',

    // Metrics bar
    'mb.revenue': 'Revenue Generated',
    'mb.ontime':  'On-Time Delivery Rate',
    'mb.launch':  'Revenue — Year One Launch',
    'mb.ai':      'Cost Reduction via AI',
    'mb.profit':  'Profit per Load Increase',

    // About
    'about.label': 'About',
    'about.title': 'The PM Behind the Numbers',
    'about.p1':    'Strategic Lead Product Manager with <strong>10+ years of experience</strong> and a track record of generating over <strong>USD $10M in revenue</strong> across Logistics and FinTech. Expert in "0 to 1" product development and scaling through AI-driven automation.',
    'about.p2':    'Currently leading teams of <strong>25+ people</strong> to integrate AI agents, predictive models, and new product features into core operations — resulting in a <strong>10% reduction in costs</strong> and a <strong>98% on-time delivery rate</strong>.',
    'about.p3':    'Strong background in data-driven decision-making (SQL, Power BI), roadmap prioritization (RICE), and aligning technical delivery with company OKRs. I speak the language of both engineers and executives.',
    'about.h1':    'Product Discovery',
    'about.h2':    'Data-Driven Decisions',
    'about.h3':    'AI & Automation',
    'about.h4':    'Go-to-Market',
    'about.p.h1':  'Design Thinking, user interviews, and market research to define the right problems before building solutions.',
    'about.p.h2':  'SQL, Power BI, and Tableau to measure, iterate, and prove impact with hard numbers.',
    'about.p.h3':  'Led creation of AI agents and automation flows that cut operational costs by 10%.',
    'about.p.h4':  'End-to-end launch strategy: roadmap prioritization (RICE), stakeholder alignment, and release planning.',

    // Experience
    'exp.label': 'Career',
    'exp.title': 'Work Experience',

    // Better Trucks
    'bt.industry': 'Last-mile &amp; regional logistics &middot; Supply chain management',
    'bt.b1':  'Manage 3 cross-functional teams (25+ people) across Engineering and Data, translating complex business needs into high-velocity development cycles',
    'bt.b2':  'Leading strategy and deployment of AI agents and automation flows &mdash; <strong>10% reduction in operational costs</strong>',
    'bt.b3':  'Integrated predictive alert features using AI to identify delivery delays early, achieving a <strong>98% on-time rate</strong>',
    'bt.b4':  'Iterated 10+ product enhancements within 90 days, significantly increasing driver engagement',

    // Arrive Logistics
    'al.industry': 'Logistics &amp; supply chain &middot; Web &amp; mobile app development',
    'al.b1':  'Managed roadmap for web and mobile apps focused on workflow optimization and real-time tracking for 3K+ users',
    'al.b2':  'Increased profit by <strong>3% per load (over $20K USD/day)</strong> by launching a new data-driven commission program',
    'al.b3':  'Developed the first mobile app MVP, significantly accelerating the feedback loop for core logistics features',
    'al.b4':  'Launched 5+ features reducing operational costs by <strong>5%</strong> and simplifying the load creation process',
    'al.b5':  'Integrated predictive data features providing real-time pricing insights to improve broker negotiations',

    // Veriddica / Intexus
    'vi.industry': 'FinTech &middot; Secure ID &amp; Digital Card Solutions &middot; Colombia',
    'vi.b1':  "Led the company's first digital product (Vecard) from concept to scaling, defining the entire product department's structure (\"0 to 1\")",
    'vi.b2':  'Launched <strong>Vecard</strong> &mdash; <strong>$150K USD revenue in the first year</strong>',
    'vi.b3':  'Developed <strong>Card as a Service (CaaS)</strong> &mdash; <strong>11 clients onboarded, $150K USD/month</strong>',
    'vi.b4':  "Created the company's first Data Team and built Power BI dashboards to drive a data-driven culture",

    // Brinks PM
    'bp.industry': 'Security &amp; Cash Management &middot; Automation Products',
    'bp.b1':  'Led development of <strong>Compusafe</strong> (smart safe SaaS), integrating software and hardware for real-time cash management &mdash; <strong>500+ units sold</strong>',
    'bp.b2':  'Created a daily credit model with Bancolombia, facilitating <strong>COP 500M+ per day</strong>',
    'bp.b3':  'Established strategic partnerships across retail and manufacturing sectors',

    // Brinks Analyst
    'ba.role':     'Marketing, Operational & Financial Analyst',
    'ba.industry': 'Security &amp; Cash Management &middot; Operations',
    'ba.b1':  'Developed and led a Lean Program from ideation to implementation &mdash; <strong>7% reduction in core operating costs</strong>',
    'ba.b2':  'Created profitability models at product, customer, and city levels to drive data-backed business decisions',
    'ba.b3':  'Optimized cash flow analysis, identifying a <strong>15% increase in revenue opportunities</strong>',

    // Case Studies
    'cs.label': 'Case Studies',
    'cs.title': "Products I've Built & Scaled",
    'cs.bt.tag':      'Logistics · AI',
    'cs.bt.title':    'Better Trucks — AI-Powered Operations',
    'cs.bt.desc':     'Led the integration of AI agents and automation flows across last-mile logistics operations, eliminating manual processes and reducing operational overhead. Aligned full product strategy with core company OKRs.',
    'cs.bt.m1':       'Cost Reduction',
    'cs.bt.m2':       'On-Time Rate',
    'cs.bt.m3':       'People Led',
    'cs.bt.industry': 'Last-Mile Logistics',
    'cs.al.tag':      'Logistics · Mobile',
    'cs.al.title':    'Arrive Logistics — Load Workflow Optimization',
    'cs.al.desc':     "Designed and shipped the company's first mobile MVP plus 5 web features that streamlined load creation, improved broker commission incentives, and surfaced real-time market rate data.",
    'cs.al.m1':       'Profit per Load',
    'cs.al.m2':       'Cost Reduction',
    'cs.al.m3':       'Load Processing Time',
    'cs.al.industry': 'Supply Chain · Austin, TX',
    'cs.vc.tag':      'FinTech · 0→1',
    'cs.vc.title':    'Vecard & CaaS — Building FinTech from Zero',
    'cs.vc.desc':     'Founded the product area at Veriddica/Intexus and brought two digital products to market: Vecard (mobile ID app) and CaaS — a Card-as-a-Service platform enabling instant debit and credit card issuance for the Latin American market.',
    'cs.vc.m1':       'Revenue Year One',
    'cs.vc.m2':       'Clients Onboarded',
    'cs.vc.m3':       'MRR (CaaS)',
    'cs.vc.industry': 'FinTech · Latin America',
    'cs.cp.tag':      'Hardware · SaaS',
    'cs.cp.title':    'Compusafe — Smart Cash Management SaaS',
    'cs.cp.desc':     'Led development and go-to-market for Compusafe, a smart safe with real-time cash monitoring deployed as SaaS, and Cash Drop — integrating with Bancolombia for daily credit settlement across gas stations, retailers, and manufacturing facilities.',
    'cs.cp.m1':       'Units Sold',
    'cs.cp.m2':       'Monthly Revenue',
    'cs.cp.m3':       'Moved Daily',
    'cs.cp.industry': 'Cash Management · Security',
    'cs.ai.badge': 'AI',

    // Skills
    'sk.label': 'Toolkit',
    'sk.title': 'Skills & Tech Stack',
    'sk.g1':    'AI & Automation',
    'sk.g2':    'Product Management',
    'sk.g3':    'Discovery & Design',
    'sk.g4':    'Data & Analytics',
    'sk.g5':    'Operations & Collaboration',
    'sk.g6':    'Methodologies',
    'sk.cat.product': 'Product Management',
    'sk.cat.ai':      'AI & Automation',
    'sk.cat.data':    'Data & Analytics',
    'sk.cat.design':  'Discovery & Design',
    'sk.cat.ops':     'Operations & Tools',
    'sk.cat.methods': 'Methodologies',

    // Education
    'edu.label':     'Education',
    'edu.title':     'Academic & Continuous Learning',
    'edu.mba':       'MBA — Finance',
    'edu.bs':        'B.S. Business Administration',
    'edu.cert':      'Professional Certification',
    'edu.analytics': 'Data Analytics & Data Processing',
    'edu.pm':        'Product Management',
    'edu.scrum':     'Scrum Methodology',

    // Contact
    'con.label':    "Let's Connect",
    'con.title':    'Open to Senior PM Roles in the US',
    'con.sub':      "Looking for opportunities to drive product strategy at a fast-growing company. Let's talk about how I can contribute to your team.",
    'con.linkedin': 'LinkedIn Profile',
    'con.download': 'Download Resume',

    // Footer
    'ft.sub': 'Built with purpose. Designed to perform.',

    // Gallery
    'gallery.view': 'View Photos',

    // AI-Driven PM
    'ai.label':     'AI-Driven PM',
    'ai.title':     'Building products with AI at the core',
    'ai.statement': 'I embed AI across every stage of the product cycle — from discovery to operational automation — to decide faster and scale with fewer resources.',
    'ai.c1.t': 'LLMs & Assistants',
    'ai.c1.d': 'ChatGPT, Claude and Gemini woven into research, drafting and decision support.',
    'ai.c2.t': 'AI-Assisted Building',
    'ai.c2.d': 'GitHub Copilot and Cursor to prototype, spec and ship faster alongside engineering.',
    'ai.c3.t': 'Prompt Engineering',
    'ai.c3.d': 'Designing prompts and multi-step flows that turn models into reliable product tooling.',
    'ai.c4.t': 'Automation & Agents',
    'ai.c4.d': 'No-code agents and automations (Zapier/Make, N8N) that remove manual operational work.',
    'ai.c5.t': 'AI Data & Analytics',
    'ai.c5.d': 'AI-assisted analysis and dashboards that shorten the path from data to decision.',
    'ai.c6.t': 'AI Product Discovery',
    'ai.c6.d': 'AI-assisted research and synthesis to find the right problems before building.',
  },

  es: {
    // Nav
    'nav.ai':           'Experiencia IA',
    'nav.about':        'Sobre Mí',
    'nav.experience':   'Experiencia',
    'nav.case-studies': 'Casos de Estudio',
    'nav.skills':       'Habilidades',
    'nav.education':    'Educación',
    'nav.contact':      'Contacto',

    // Hero
    'hero.title':    'Senior Product Manager',
    'hero.tagline':  'Más de 10 años generando <strong>+$10M en ingresos</strong> en Logística y FinTech. Experto en desarrollo de producto "0 a 1" y escalamiento a través de <strong>automatización con IA</strong>.',
    'hero.cta1':     'Ver trabajo con IA',
    'hero.cta2':     'Contáctame',
    'hero.m.years':  'Años de Experiencia',
    'hero.m.revenue':'Ingresos Generados',
    'hero.m.people': 'Personas Lideradas',
    'hero.m.units':  'Unidades Lanzadas',

    // Metrics bar
    'mb.revenue': 'Ingresos Generados',
    'mb.ontime':  'Tasa de Entrega a Tiempo',
    'mb.launch':  'Ingresos — Primer Año de Lanzamiento',
    'mb.ai':      'Reducción de Costos con IA',
    'mb.profit':  'Incremento de Utilidad por Carga',

    // About
    'about.label': 'Sobre Mí',
    'about.title': 'El PM Detrás de los Números',
    'about.p1':    'Lead Product Manager Estratégico con <strong>más de 10 años de experiencia</strong> y un historial de más de <strong>USD $10M en ingresos</strong> en Logística y FinTech. Experto en desarrollo de producto "0 a 1" y escalamiento mediante automatización con IA.',
    'about.p2':    'Actualmente liderando equipos de <strong>más de 25 personas</strong> para integrar agentes de IA, modelos predictivos y nuevas funcionalidades en operaciones clave — logrando una <strong>reducción del 10% en costos</strong> y una <strong>tasa de entrega a tiempo del 98%</strong>.',
    'about.p3':    'Sólida experiencia en toma de decisiones basada en datos (SQL, Power BI), priorización de roadmap (RICE) y alineación de entrega técnica con los OKRs de la empresa. Hablo el lenguaje tanto de ingenieros como de ejecutivos.',
    'about.h1':    'Descubrimiento de Producto',
    'about.h2':    'Decisiones Basadas en Datos',
    'about.h3':    'IA y Automatización',
    'about.h4':    'Go-to-Market',
    'about.p.h1':  'Design Thinking, entrevistas con usuarios e investigación de mercado para definir los problemas correctos antes de construir soluciones.',
    'about.p.h2':  'SQL, Power BI y Tableau para medir, iterar y demostrar impacto con métricas concretas.',
    'about.p.h3':  'Lideré la creación de agentes de IA y flujos de automatización que redujeron los costos operativos en un 10%.',
    'about.p.h4':  'Estrategia de lanzamiento integral: priorización de roadmap (RICE), alineación con stakeholders y planificación de releases.',

    // Experience
    'exp.label': 'Carrera',
    'exp.title': 'Experiencia Laboral',

    // Better Trucks
    'bt.industry': 'Logística de última milla &middot; Gestión de cadena de suministro',
    'bt.b1':  'Gestiono 3 equipos interfuncionales (25+ personas) en Ingeniería y Datos, traduciendo necesidades de negocio complejas en ciclos de desarrollo de alta velocidad',
    'bt.b2':  'Liderando la estrategia y despliegue de agentes de IA y flujos de automatización &mdash; <strong>10% de reducción en costos operativos</strong>',
    'bt.b3':  'Integré funcionalidades de alertas predictivas con IA para identificar retrasos en entregas de forma temprana, logrando una <strong>tasa de entrega a tiempo del 98%</strong>',
    'bt.b4':  'Iteré más de 10 mejoras de producto en 90 días, aumentando significativamente el compromiso de los conductores',

    // Arrive Logistics
    'al.industry': 'Logística &amp; cadena de suministro &middot; Desarrollo de apps web y móvil',
    'al.b1':  'Gestioné el roadmap de apps web y móvil enfocadas en optimización de flujos de trabajo y tracking en tiempo real para más de 3.000 usuarios',
    'al.b2':  'Incrementé la utilidad <strong>en un 3% por carga (más de $20K USD/día)</strong> lanzando un nuevo programa de comisiones basado en datos',
    'al.b3':  'Desarrollé el primer MVP de app móvil, acelerando significativamente el ciclo de retroalimentación para funcionalidades clave de logística',
    'al.b4':  'Lancé más de 5 funcionalidades que redujeron los costos operativos en <strong>un 5%</strong> y simplificaron el proceso de creación de cargas',
    'al.b5':  'Integré funcionalidades de datos predictivos que proveen insights de precios en tiempo real para mejorar las negociaciones de los brokers',

    // Veriddica / Intexus
    'vi.industry': 'FinTech &middot; Soluciones de Identidad Digital y Tarjetas &middot; Colombia',
    'vi.b1':  'Lideré el primer producto digital de la empresa (Vecard) desde el concepto hasta el escalamiento, definiendo la estructura completa del área de producto ("0 a 1")',
    'vi.b2':  'Lancé <strong>Vecard</strong> &mdash; <strong>$150K USD en ingresos en el primer año</strong>',
    'vi.b3':  'Desarrollé <strong>Card as a Service (CaaS)</strong> &mdash; <strong>11 clientes incorporados, $150K USD/mes</strong>',
    'vi.b4':  'Creé el primer equipo de Datos de la empresa y construí dashboards en Power BI para impulsar una cultura data-driven',

    // Brinks PM
    'bp.industry': 'Seguridad &amp; Gestión de Efectivo &middot; Productos de Automatización',
    'bp.b1':  'Lideré el desarrollo de <strong>Compusafe</strong> (SaaS de caja fuerte inteligente), integrando software y hardware para gestión de efectivo en tiempo real &mdash; <strong>más de 500 unidades vendidas</strong>',
    'bp.b2':  'Creé un modelo de crédito diario con Bancolombia, facilitando <strong>más de COP 500M por día</strong>',
    'bp.b3':  'Establecí alianzas estratégicas en los sectores de retail y manufactura',

    // Brinks Analyst
    'ba.role':     'Analista de Marketing, Operaciones y Finanzas',
    'ba.industry': 'Seguridad &amp; Gestión de Efectivo &middot; Operaciones',
    'ba.b1':  'Desarrollé y lideré un Programa Lean desde la ideación hasta la implementación &mdash; <strong>7% de reducción en costos operativos clave</strong>',
    'ba.b2':  'Creé modelos de rentabilidad a nivel de producto, cliente y ciudad para impulsar decisiones de negocio basadas en datos',
    'ba.b3':  'Optimicé el análisis de flujo de caja, identificando un <strong>aumento del 15% en oportunidades de ingresos</strong>',

    // Case Studies
    'cs.label': 'Casos de Estudio',
    'cs.title': 'Productos que He Creado y Escalado',
    'cs.bt.tag':      'Logística · IA',
    'cs.bt.title':    'Better Trucks — Operaciones con IA',
    'cs.bt.desc':     'Lideré la integración de agentes de IA y flujos de automatización en operaciones de logística de última milla, eliminando procesos manuales y reduciendo la carga operativa. Alineé la estrategia de producto con los OKRs clave de la empresa.',
    'cs.bt.m1':       'Reducción de Costos',
    'cs.bt.m2':       'Tasa de Entrega a Tiempo',
    'cs.bt.m3':       'Personas Lideradas',
    'cs.bt.industry': 'Logística de Última Milla',
    'cs.al.tag':      'Logística · Móvil',
    'cs.al.title':    'Arrive Logistics — Optimización de Flujo de Cargas',
    'cs.al.desc':     'Diseñé y lancé el primer MVP móvil de la empresa junto con 5 funcionalidades web que optimizaron la creación de cargas, mejoraron los incentivos de comisiones y brindaron datos de tarifas en tiempo real.',
    'cs.al.m1':       'Utilidad por Carga',
    'cs.al.m2':       'Reducción de Costos',
    'cs.al.m3':       'Tiempo de Procesamiento',
    'cs.al.industry': 'Cadena de Suministro · Austin, TX',
    'cs.vc.tag':      'FinTech · 0→1',
    'cs.vc.title':    'Vecard y CaaS — Construyendo FinTech desde Cero',
    'cs.vc.desc':     'Fundé el área de producto en Veriddica/Intexus y llevé al mercado dos productos digitales: Vecard (app móvil de identidad) y CaaS — una plataforma de Tarjeta como Servicio para el mercado latinoamericano.',
    'cs.vc.m1':       'Ingresos Primer Año',
    'cs.vc.m2':       'Clientes Incorporados',
    'cs.vc.m3':       'MRR (CaaS)',
    'cs.vc.industry': 'FinTech · Latinoamérica',
    'cs.cp.tag':      'Hardware · SaaS',
    'cs.cp.title':    'Compusafe — SaaS de Gestión Inteligente de Efectivo',
    'cs.cp.desc':     'Lideré el desarrollo y go-to-market de Compusafe, una caja fuerte inteligente con monitoreo en tiempo real como SaaS, y Cash Drop — integrando con Bancolombia para liquidación de crédito diario en estaciones de servicio, comercios y manufactura.',
    'cs.cp.m1':       'Unidades Vendidas',
    'cs.cp.m2':       'Ingresos Mensuales',
    'cs.cp.m3':       'Movidos Diariamente',
    'cs.cp.industry': 'Gestión de Efectivo · Seguridad',
    'cs.ai.badge': 'IA',

    // Skills
    'sk.label': 'Herramientas',
    'sk.title': 'Habilidades y Stack Tecnológico',
    'sk.g1':    'IA y Automatización',
    'sk.g2':    'Gestión de Producto',
    'sk.g3':    'Descubrimiento y Diseño',
    'sk.g4':    'Datos y Analítica',
    'sk.g5':    'Operaciones y Colaboración',
    'sk.g6':    'Metodologías',
    'sk.cat.product': 'Gestión de Producto',
    'sk.cat.ai':      'IA y Automatización',
    'sk.cat.data':    'Datos y Analítica',
    'sk.cat.design':  'Discovery y Diseño',
    'sk.cat.ops':     'Operaciones y Herramientas',
    'sk.cat.methods': 'Metodologías',

    // Education
    'edu.label':     'Educación',
    'edu.title':     'Formación Académica y Aprendizaje Continuo',
    'edu.mba':       'MBA — Finanzas',
    'edu.bs':        'Licenciatura en Administración de Empresas',
    'edu.cert':      'Certificación Profesional',
    'edu.analytics': 'Analítica de Datos y Procesamiento de Datos',
    'edu.pm':        'Gestión de Producto',
    'edu.scrum':     'Metodología Scrum',

    // Contact
    'con.label':    'Conectemos',
    'con.title':    'Disponible para Roles de Senior PM en EE.UU.',
    'con.sub':      'Busco oportunidades para liderar la estrategia de producto en empresas de alto crecimiento. Hablemos sobre cómo puedo contribuir con tu equipo.',
    'con.linkedin': 'Perfil de LinkedIn',
    'con.download': 'Descargar CV',

    // Footer
    'ft.sub': 'Construido con propósito. Diseñado para destacar.',

    // Gallery
    'gallery.view': 'Ver Fotos',

    // AI-Driven PM
    'ai.label':     'PM con IA',
    'ai.title':     'Construyo productos con la IA en el centro',
    'ai.statement': 'Integro IA en cada etapa del ciclo de producto — desde el discovery hasta la automatización operativa — para decidir más rápido y escalar con menos recursos.',
    'ai.c1.t': 'LLMs y Asistentes',
    'ai.c1.d': 'ChatGPT, Claude y Gemini integrados en research, redacción y toma de decisiones.',
    'ai.c2.t': 'Construcción Asistida por IA',
    'ai.c2.d': 'GitHub Copilot y Cursor para prototipar, especificar y entregar más rápido junto a ingeniería.',
    'ai.c3.t': 'Prompt Engineering',
    'ai.c3.d': 'Diseño de prompts y flujos multi-paso que convierten los modelos en herramientas de producto fiables.',
    'ai.c4.t': 'Automatización y Agentes',
    'ai.c4.d': 'Agentes y automatizaciones no-code (Zapier/Make, N8N) que eliminan trabajo operativo manual.',
    'ai.c5.t': 'Datos y Analítica con IA',
    'ai.c5.d': 'Análisis y dashboards asistidos por IA que acortan el camino del dato a la decisión.',
    'ai.c6.t': 'Discovery de Producto con IA',
    'ai.c6.d': 'Investigación y síntesis asistidas por IA para encontrar los problemas correctos antes de construir.',
  }
};

/* ---- Language Toggle Logic ---- */
const langToggle = document.getElementById('langToggle');
let currentLang  = localStorage.getItem('lang') || 'en';

function applyTranslations(lang) {
  // Plain text elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key] !== undefined) {
      el.textContent = translations[lang][key];
    }
  });

  // HTML elements (contain <strong>, &amp; etc.)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (translations[lang][key] !== undefined) {
      el.innerHTML = translations[lang][key];
    }
  });

  // Update html lang attribute
  document.documentElement.lang = lang;

  // Update button label
  langToggle.textContent = lang === 'en' ? 'ES' : 'EN';

  localStorage.setItem('lang', lang);
  currentLang = lang;
}

langToggle.addEventListener('click', () => {
  applyTranslations(currentLang === 'en' ? 'es' : 'en');
});

// Apply saved language on load
applyTranslations(currentLang);

/* ============================================================
   Skills — data-driven interactive grid (no levels)
   ============================================================ */
const skillsData = [
  {
    id: 'product',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18M9 21V9"/><rect x="3" y="3" width="18" height="18" rx="2"/></svg>',
    skills: ['Roadmap Planning', 'PRD & Feature Specs', 'Product Discovery', 'OKRs & KPIs', 'RICE Prioritization', 'ROI Analysis', 'MVPs & POCs', 'Stakeholder Management'],
  },
  {
    id: 'ai',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a4 4 0 0 0-4 4v1a4 4 0 0 0 0 8v1a4 4 0 0 0 8 0v-1a4 4 0 0 0 0-8V7a4 4 0 0 0-4-4z"/></svg>',
    skills: ['AI Agent Development', 'LLM Implementation', 'Prompt Engineering', 'Claude & Gemini', 'LangChain / LangGraph', 'ADK', 'N8N', 'No-code Workflows'],
  },
  {
    id: 'data',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 14l3-3 3 3 5-6"/></svg>',
    skills: ['SQL', 'Power BI', 'Tableau', 'Google Analytics', 'Pendo', 'Financial Modeling'],
  },
  {
    id: 'design',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18"/></svg>',
    skills: ['Figma', 'Miro', 'UX/UI Principles', 'Rapid Prototyping', 'User Research', 'A/B Testing'],
  },
  {
    id: 'ops',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 17H7A5 5 0 0 1 7 7h2M15 7h2a5 5 0 0 1 0 10h-2M8 12h8"/></svg>',
    skills: ['JIRA (Admin)', 'Confluence', 'Slack', 'Asana', 'Microsoft Teams'],
  },
  {
    id: 'methods',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.2-8.6"/><polyline points="21 3 21 9 15 9"/></svg>',
    skills: ['Scrum', 'Kanban', 'Design Thinking', 'Lean Startup', 'Continuous Discovery', 'OKR Framework'],
  },
];

function renderSkills() {
  const grid = document.getElementById('skillsGrid');
  if (!grid) return;
  grid.innerHTML = skillsData.map(cat => `
    <article class="skill-cat fade-in" data-cat>
      <button class="skill-cat__head" aria-expanded="false">
        <span class="skill-cat__icon" aria-hidden="true">${cat.icon}</span>
        <span class="skill-cat__title" data-i18n="sk.cat.${cat.id}">${cat.id}</span>
        <span class="skill-cat__chevron" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </span>
      </button>
      <div class="skill-cat__panel">
        <div class="skill-cat__tags">
          ${cat.skills.map(s => `<span>${s}</span>`).join('')}
        </div>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('.skill-cat__head').forEach(head => {
    head.addEventListener('click', () => {
      const open = head.getAttribute('aria-expanded') === 'true';
      head.setAttribute('aria-expanded', String(!open));
      head.closest('.skill-cat').classList.toggle('open', !open);
    });
  });

  applyTranslations(currentLang);
  grid.querySelectorAll('.skill-cat.fade-in').forEach(el => fadeObserver.observe(el));
}

renderSkills();

/* ============================================================
   11. Photo Gallery Modal
   ============================================================ */
const galleryData = {
  'better-trucks': {
    name: 'Better Trucks',
    photos: [
      'assets/Better%20Trucks/BetterTrucks1.jpeg',
      'assets/Better%20Trucks/BetterTrucks2.jpeg',
      'assets/Better%20Trucks/BetterTrucks3.jpeg',
    ]
  },
  'arrive-logistics': {
    name: 'Arrive Logistics',
    photos: [
      'assets/ArriveLogistics/Arrive1.jpeg',
      'assets/ArriveLogistics/Arrive2.jpeg',
      'assets/ArriveLogistics/Arrive3.jpeg',
    ]
  },
  'veriddica': {
    name: 'Veriddica / Intexus',
    photos: [
      'assets/Veriddica-Intexus/Vecard1.jpeg',
      'assets/Veriddica-Intexus/Vecard2.jpeg',
      'assets/Veriddica-Intexus/caas1.jpeg',
    ]
  },
  'brinks': {
    name: 'Brinks Colombia',
    photos: [
      'assets/Brinks/Brinks%201.jpeg',
      'assets/Brinks/Brinks%202.jpeg',
      'assets/Brinks/Brinks%203.jpeg',
    ]
  }
};

const galleryModal = document.getElementById('galleryModal');
const modalTitle   = document.getElementById('modalTitle');
const modalTrack   = document.getElementById('galleryTrack');
const modalClose   = document.getElementById('modalClose');
const modalDots    = document.getElementById('modalDots');
const modalCounter = document.getElementById('modalCounter');
const modalThumbs  = document.getElementById('modalThumbs');

let activeGallery = null;
let activeIndex   = 0;

function openGallery(key) {
  const data = galleryData[key];
  if (!data) return;
  activeGallery = data;
  activeIndex = 0;
  modalTitle.textContent = data.name;

  modalTrack.innerHTML = data.photos
    .map((src, i) => `<div class="modal__slide"><img src="${src}" alt="${data.name} — photo ${i + 1}" loading="lazy"></div>`)
    .join('');

  modalThumbs.innerHTML = data.photos
    .map((src, i) => `<img class="modal__thumb${i === 0 ? ' active' : ''}" src="${src}" alt="Photo ${i + 1}" data-index="${i}" loading="lazy">`)
    .join('');

  modalDots.innerHTML = data.photos
    .map((_, i) => `<button class="modal__dot${i === 0 ? ' active' : ''}" data-index="${i}" aria-label="Photo ${i + 1}" role="tab"></button>`)
    .join('');

  syncIndicators(0);
  galleryModal.classList.add('open');
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => modalClose.focus());
}

function showPhoto(index) {
  if (!activeGallery) return;
  const total = activeGallery.photos.length;
  const i = Math.max(0, Math.min(index, total - 1));
  const slide = modalTrack.children[i];
  if (slide) modalTrack.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' });
}

function syncIndicators(i) {
  if (!activeGallery) return;
  activeIndex = i;
  const total = activeGallery.photos.length;
  modalCounter.textContent = `${i + 1} / ${total}`;
  modalDots.querySelectorAll('.modal__dot').forEach((d, di) => d.classList.toggle('active', di === i));
  modalThumbs.querySelectorAll('.modal__thumb').forEach((t, ti) => {
    t.classList.toggle('active', ti === i);
    if (ti === i) t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  });
}

let trackTick = false;
modalTrack.addEventListener('scroll', () => {
  if (trackTick) return;
  trackTick = true;
  requestAnimationFrame(() => {
    trackTick = false;
    const i = Math.round(modalTrack.scrollLeft / modalTrack.clientWidth);
    if (i !== activeIndex) syncIndicators(i);
  });
}, { passive: true });

function closeGallery() {
  galleryModal.classList.remove('open');
  document.body.style.overflow = '';
  activeGallery = null;
}

// Close on X button or backdrop click
modalClose.addEventListener('click', closeGallery);
galleryModal.addEventListener('click', e => {
  if (e.target === galleryModal) closeGallery();
});

// Dots and thumbnails
modalDots.addEventListener('click', e => {
  const dot = e.target.closest('.modal__dot');
  if (dot) showPhoto(parseInt(dot.dataset.index, 10));
});

modalThumbs.addEventListener('click', e => {
  const thumb = e.target.closest('.modal__thumb');
  if (thumb) showPhoto(parseInt(thumb.dataset.index, 10));
});

// Keyboard: Esc, ←, →
document.addEventListener('keydown', e => {
  if (!galleryModal.classList.contains('open')) return;
  if (e.key === 'Escape')     { closeGallery(); return; }
  if (e.key === 'ArrowLeft')  { showPhoto(activeIndex - 1); return; }
  if (e.key === 'ArrowRight') { showPhoto(activeIndex + 1); }
});

// Touch swipe support
let touchStartX = 0;
galleryModal.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].clientX;
}, { passive: true });
galleryModal.addEventListener('touchend', e => {
  const delta = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(delta) < 40) return;
  if (delta < 0) showPhoto(activeIndex + 1);
  else           showPhoto(activeIndex - 1);
}, { passive: true });

// Open gallery — delegated click handler for cards and timeline buttons
document.addEventListener('click', e => {
  // Case card (click anywhere on card)
  const card = e.target.closest('.case-card[data-gallery]');
  if (card) { openGallery(card.dataset.gallery); return; }

  // Timeline "View Photos" button
  const btn = e.target.closest('.timeline__gallery-btn[data-gallery]');
  if (btn)  { openGallery(btn.dataset.gallery); }
});

// Keyboard enter/space on case cards (accessibility)
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const card = e.target.closest('.case-card[data-gallery]');
  if (card) { e.preventDefault(); openGallery(card.dataset.gallery); }
});

/* ============================================================
   12. Init
   ============================================================ */
handleNavScroll();
