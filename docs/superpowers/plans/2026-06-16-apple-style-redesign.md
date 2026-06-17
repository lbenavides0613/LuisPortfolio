# Apple-Style Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rediseñar el portafolio vanilla de Luis Benavides hacia una estética de página de producto Apple (tipografía gigante, mucho aire, squircles, transiciones cinematográficas), con una nueva sección protagonista "AI-Driven PM", skills rediseñadas como grid interactivo sin niveles, y galerías como carrusel horizontal con scroll-snap — conservando EN/ES, dark mode y descarga de CV.

**Architecture:** Se reescribe progresivamente `styles/style.css` (sección por sección, reemplazando cada bloque), se reestructura `index.html` (nueva sección `#ai`, skills data-driven, badges AI, link de nav nuevo) y se amplía `js/main.js` con un módulo de sticky-progress (gated a desktop), render data-driven de skills y refactor de la galería a carrusel scroll-snap. Se reutiliza el sistema de reveal existente `.fade-in`→`.visible` (mejorando su CSS) y los módulos de counters, dark mode e i18n. Cada tarea deja el sitio funcionando.

**Tech Stack:** HTML5 semántico, CSS3 (Custom Properties, Grid/Flexbox, clamp(), scroll-snap, backdrop-filter, @keyframes), JavaScript vanilla ES6+ (IntersectionObserver, requestAnimationFrame, matchMedia, localStorage). Sin dependencias, sin build step.

## Global Constraints

- Sin frameworks ni dependencias externas. No npm, no build step, funciona directo en el navegador (verbatim CLAUDE.md).
- Mobile-first: estilos base para móvil, luego media queries para desktop.
- Todo texto visible nuevo debe tener su par de claves **EN y ES** en `translations` de `js/main.js`.
- Usar CSS Custom Properties; no hardcodear colores/tamaños sueltos.
- Mantener atributos `aria-*` y semántica HTML5.
- Solo comentar el "por qué", no el "qué".
- Prioridad: rendimiento móvil impecable — animar solo `transform`/`opacity`, respetar `prefers-reduced-motion`, animaciones pesadas (sticky-progress) solo en desktop (`min-width: 1024px`).
- Acento gradiente IA (`#2563eb → #06b6d4`) reservado EXCLUSIVAMENTE al hilo conductor de IA (sección `#ai` y badges "AI").

## Verification Method (este proyecto no tiene test runner)

El sitio usa solo `file://` (no hace `fetch`), así que se verifica abriéndolo en el navegador:

- **Abrir el sitio:** `start "" "C:\Users\Luis Benavides TMP\Desktop\CV Portfolio\index.html"` (Windows). Recargar con Ctrl+Shift+R tras cada cambio.
- **Consola limpia:** abrir DevTools (F12) → pestaña Console → debe estar **sin errores** tras cargar e interactuar.
- **Snippet de paridad i18n** (pegar en la consola de DevTools; debe imprimir un array vacío):

```js
(() => {
  const missing = [];
  ['en','es'].forEach(lang => {
    document.querySelectorAll('[data-i18n],[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n') || el.getAttribute('data-i18n-html');
      if (translations[lang][key] === undefined) missing.push(`${lang}:${key}`);
    });
  });
  console.log('MISSING I18N KEYS:', [...new Set(missing)]);
})();
```

- **Móvil:** DevTools → Toggle device toolbar (Ctrl+Shift+M) → iPhone 12 Pro. Verificar layout y 60fps subjetivo.
- **Reduced motion:** DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce".

---

## File Structure

| Archivo | Responsabilidad tras el rediseño |
|---------|----------------------------------|
| `index.html` | Markup Apple-style; nueva sección `#ai`; contenedor de skills data-driven (`#skillsGrid`); badges AI en case cards; link de nav `#ai`; modal de galería con track scroll-snap (`#galleryTrack`). |
| `styles/style.css` | Reescrito por bloques: tokens, reset, tipografía fluida, botones, nav translúcido, cada sección Apple-style, dark mode, reduced-motion, media queries. |
| `js/main.js` | Conserva nav/menu/active-link/counters/dark/i18n/gallery. Añade: `initStickyProgress()`, `skillsData`+`renderSkills()`, refactor de galería a carrusel scroll-snap (`showPhoto` actualizado), nuevas claves i18n. |
| `assets/ai/*.svg` | (opcional) íconos de herramientas IA. En este plan los íconos van **inline** en el HTML para evitar requests extra. |
| `CLAUDE.md`, `SesionAnt.md` | Actualizados en la tarea final. |

---

### Task 1: Design System Foundation (tokens, reset, typography, buttons, reveal, motion)

Reescribe la capa global de CSS. No toca secciones individuales todavía; estas siguen con su CSS antiguo y el sitio sigue funcional (con tipografía/colores ya renovados globalmente).

**Files:**
- Modify: `styles/style.css` — bloque `:root`, reset base, tipografía, `.btn*`, `.container`, `.section`, `.section__header/__label/__title`, y reglas `.fade-in`/`.visible`.

**Interfaces:**
- Produces:
  - CSS custom properties: `--bg`, `--surface`, `--surface-2`, `--text`, `--text-2`, `--border`, `--clr-primary`, `--ai-grad`, `--radius-lg`, `--radius-md`, `--section-pad`, `--container-max`, `--nav-h`, `--ease-apple`, `--reveal-y`. Disponibles para todas las tareas siguientes.
  - Clase de reveal existente `.fade-in` → `.visible` con timing Apple (reusada por todas las secciones).

- [ ] **Step 1: Reemplazar el bloque `:root` y añadir variante dark**

En `styles/style.css`, localiza el bloque `:root { ... }` (al inicio del archivo) y reemplázalo por:

```css
:root {
  /* Color — light */
  --bg:         #fbfbfd;
  --surface:    #ffffff;
  --surface-2:  #f5f5f7;
  --text:       #1d1d1f;
  --text-2:     #86868b;
  --border:     rgba(0,0,0,0.08);

  --clr-dark:    #0b1628;
  --clr-primary: #2563eb;
  --clr-accent:  #06b6d4;
  --ai-grad:     linear-gradient(120deg, #2563eb 0%, #06b6d4 100%);

  /* Typography */
  --font-sans: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;

  /* Spacing & shape */
  --section-pad:   clamp(4rem, 10vw, 7rem);
  --container-max: 1120px;
  --nav-h:         52px;
  --radius-lg:     28px;
  --radius-md:     18px;
  --radius-sm:     12px;

  /* Motion */
  --ease-apple: cubic-bezier(0.28, 0.11, 0.32, 1);
  --reveal-y:   24px;

  --shadow-soft: 0 4px 24px rgba(0,0,0,0.06);
  --shadow-card: 0 12px 40px rgba(0,0,0,0.08);
}

body.dark {
  --bg:        #000000;
  --surface:   #0b0b0d;
  --surface-2: #161617;
  --text:      #f5f5f7;
  --text-2:    #a1a1a6;
  --border:    rgba(255,255,255,0.10);
  --shadow-soft: 0 4px 24px rgba(0,0,0,0.4);
  --shadow-card: 0 12px 40px rgba(0,0,0,0.5);
}
```

- [ ] **Step 2: Reemplazar reset + tipografía base**

Localiza el reset global (`*, *::before, *::after { box-sizing... }` y `body { ... }`) y reemplázalo por:

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }

body {
  font-family: var(--font-sans);
  background: var(--bg);
  color: var(--text);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  transition: background 0.4s var(--ease-apple), color 0.4s var(--ease-apple);
}

img { max-width: 100%; display: block; }
a { color: inherit; text-decoration: none; }
ul { list-style: none; }

h1, h2, h3 { line-height: 1.07; letter-spacing: -0.03em; font-weight: 600; }

.container { width: 100%; max-width: var(--container-max); margin-inline: auto; padding-inline: clamp(1.25rem, 5vw, 2.5rem); }

.section { padding-block: var(--section-pad); }

.section__header { margin-bottom: clamp(2rem, 5vw, 3.5rem); }
.section__label {
  display: inline-block;
  font-size: 0.78rem; font-weight: 600; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--clr-primary); margin-bottom: 0.75rem;
}
.section__title { font-size: clamp(2rem, 5.5vw, 3.5rem); }
```

- [ ] **Step 3: Reemplazar estilos de botones**

Localiza las reglas `.btn`, `.btn--primary`, `.btn--outline` y reemplázalas por:

```css
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
  padding: 0.85rem 1.6rem; border-radius: 980px;
  font-size: 1rem; font-weight: 500; cursor: pointer; border: none;
  transition: transform 0.3s var(--ease-apple), background 0.3s var(--ease-apple), opacity 0.3s var(--ease-apple);
}
.btn:hover { transform: scale(1.04); }
.btn:active { transform: scale(0.98); }
.btn--primary { background: var(--clr-primary); color: #fff; }
.btn--primary:hover { background: #1d4fd8; }
.btn--outline { background: transparent; color: var(--text); border: 1px solid var(--border); }
.btn--outline:hover { background: var(--surface-2); }
```

- [ ] **Step 4: Reemplazar reglas de reveal `.fade-in` con timing Apple + reduced-motion**

Localiza las reglas `.fade-in` y `.fade-in.visible` y reemplázalas por:

```css
.fade-in {
  opacity: 0;
  transform: translateY(var(--reveal-y));
  transition: opacity 0.8s var(--ease-apple), transform 0.8s var(--ease-apple);
  will-change: opacity, transform;
}
.fade-in.visible { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .fade-in { transition-duration: 0.01ms; transform: none; }
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

- [ ] **Step 5: Verificar en el navegador**

Run: `start "" "C:\Users\Luis Benavides TMP\Desktop\CV Portfolio\index.html"`
Expected: La página carga con fondo `#fbfbfd`, tipografía system grande en títulos, botones tipo píldora. Consola sin errores. Toggle dark mode pinta fondo negro. El reveal al hacer scroll sigue funcionando.

- [ ] **Step 6: Commit**

```bash
git add styles/style.css
git commit -m "feat(design): add Apple-style design tokens, typography, buttons and reveal foundation

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: Navigation Redesign + nuevo link `#ai`

**Files:**
- Modify: `index.html` — `<ul class="nav__menu">` (añadir item AI), `<nav>` markup mínimo.
- Modify: `styles/style.css` — reglas `.nav*`.
- Modify: `js/main.js` — añadir claves i18n `nav.ai`.

**Interfaces:**
- Consumes: tokens de Task 1 (`--nav-h`, `--border`, `--surface`, `--ease-apple`).
- Produces: ancla `#ai` en la navegación (la sección se crea en Task 4).

- [ ] **Step 1: Añadir el link de nav AI**

En `index.html`, dentro de `<ul class="nav__menu" id="navMenu" role="list">`, inserta como **primer** `<li>` (antes de About):

```html
<li><a href="#ai" class="nav__link" data-i18n="nav.ai">AI Expertise</a></li>
```

- [ ] **Step 2: Reemplazar estilos de nav**

En `styles/style.css`, localiza las reglas `.nav`, `.nav__container`, `.nav__logo`, `.nav__menu`, `.nav__link`, `.nav__link--cta`, `.nav__ctrl-btn`, `.nav.scrolled`, `.nav__toggle` y reemplázalas por:

```css
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  height: var(--nav-h);
  background: color-mix(in srgb, var(--bg) 72%, transparent);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 1px solid transparent;
  transition: border-color 0.3s var(--ease-apple), background 0.3s var(--ease-apple);
}
.nav.scrolled { border-bottom-color: var(--border); }
.nav__container {
  max-width: var(--container-max); height: 100%; margin-inline: auto;
  padding-inline: clamp(1.25rem, 5vw, 2.5rem);
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
}
.nav__logo { font-weight: 700; font-size: 1.1rem; letter-spacing: -0.02em; }
.nav__logo-dot { color: var(--clr-primary); }
.nav__menu { display: flex; align-items: center; gap: clamp(1rem, 2.5vw, 2rem); }
.nav__link {
  font-size: 0.86rem; color: var(--text-2);
  transition: color 0.25s var(--ease-apple); position: relative;
}
.nav__link:hover, .nav__link.active { color: var(--text); }
.nav__link--cta {
  background: var(--clr-primary); color: #fff !important;
  padding: 0.4rem 0.9rem; border-radius: 980px;
}
.nav__link--cta:hover { background: #1d4fd8; }
.nav__controls { display: flex; align-items: center; gap: 0.5rem; }
.nav__ctrl-btn {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 34px; height: 30px; padding-inline: 0.5rem;
  border: 1px solid var(--border); border-radius: 980px;
  background: transparent; color: var(--text); font-size: 0.74rem; cursor: pointer;
  transition: background 0.25s var(--ease-apple);
}
.nav__ctrl-btn:hover { background: var(--surface-2); }
.nav__toggle { display: none; flex-direction: column; gap: 4px; background: none; border: none; cursor: pointer; padding: 6px; }
.nav__toggle span { width: 20px; height: 2px; background: var(--text); border-radius: 2px; transition: transform 0.3s var(--ease-apple), opacity 0.3s var(--ease-apple); }

@media (max-width: 860px) {
  .nav__toggle { display: flex; }
  .nav__menu {
    position: fixed; inset: var(--nav-h) 0 auto 0;
    flex-direction: column; gap: 0.25rem; align-items: stretch;
    background: var(--bg); border-bottom: 1px solid var(--border);
    padding: 1rem clamp(1.25rem, 5vw, 2.5rem) 1.5rem;
    transform: translateY(-120%); opacity: 0; pointer-events: none;
    transition: transform 0.4s var(--ease-apple), opacity 0.3s var(--ease-apple);
  }
  .nav__menu.open { transform: none; opacity: 1; pointer-events: auto; }
  .nav__link { padding: 0.75rem 0; font-size: 1rem; }
}
```

- [ ] **Step 3: Añadir claves i18n `nav.ai`**

En `js/main.js`, dentro de `translations.en` añade junto a las demás claves `nav.*`:

```js
    'nav.ai':           'AI Expertise',
```

Y dentro de `translations.es` (busca el bloque de nav en español) añade:

```js
    'nav.ai':           'Experiencia IA',
```

- [ ] **Step 4: Verificar**

Run: recargar `index.html` (Ctrl+Shift+R)
Expected: Nav translúcida con blur, link "AI Expertise" como primer item, sombra/borde al hacer scroll, menú hamburguesa funciona en viewport ≤860px. Toggle EN/ES cambia "AI Expertise"↔"Experiencia IA". Click en "AI Expertise" hace scroll al tope (la sección llega en Task 4). Consola sin errores.

- [ ] **Step 5: Commit**

```bash
git add index.html styles/style.css js/main.js
git commit -m "feat(nav): Apple-style translucent nav with AI link and i18n

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3: Hero Redesign + módulo sticky-progress

**Files:**
- Modify: `index.html` — `<section class="hero" id="hero">` (estructura eyebrow/headline/subcopy + fila de métricas minimalista).
- Modify: `styles/style.css` — reglas `.hero*`, `.metric-card*` (reemplazadas por `.hero__metrics`).
- Modify: `js/main.js` — añadir `initStickyProgress()` y llamarlo; claves i18n nuevas.

**Interfaces:**
- Consumes: tokens Task 1.
- Produces: `function initStickyProgress(selector)` — añade a cada elemento que matchea `selector` (con `[data-sticky]`) una CSS var `--progress` (0→1) según su avance en viewport; **solo activo en `min-width: 1024px`**. Reusado por Task 4.

- [ ] **Step 1: Reemplazar el markup del hero**

En `index.html`, reemplaza todo el contenido de `<section class="hero" id="hero" ...> ... </section>` por:

```html
<section class="hero" id="hero" aria-label="Introduction" data-sticky>
  <div class="container hero__inner">
    <span class="hero__eyebrow" data-i18n="hero.title">Senior Product Manager</span>
    <h1 class="hero__name">Luis Carlos<br>Benavides Fiallo</h1>
    <p class="hero__tagline" data-i18n-html="hero.tagline">
      10+ years generating <strong>$10M+ in revenue</strong> across Logistics and FinTech.
      Expert in "0 to 1" product development and scaling through
      <strong>AI-driven automation</strong>.
    </p>
    <div class="hero__actions">
      <a href="#ai" class="btn btn--primary" data-i18n="hero.cta1">Explore AI Work</a>
      <a href="#contact" class="btn btn--outline" data-i18n="hero.cta2">Get In Touch</a>
    </div>

    <div class="hero__metrics">
      <div class="hero__metric">
        <span class="hero__metric-value"><span data-target="10">0</span>+</span>
        <span class="hero__metric-label" data-i18n="hero.m.years">Years Experience</span>
      </div>
      <div class="hero__metric">
        <span class="hero__metric-value">$<span data-target="10">0</span>M+</span>
        <span class="hero__metric-label" data-i18n="hero.m.revenue">Revenue Generated</span>
      </div>
      <div class="hero__metric">
        <span class="hero__metric-value"><span data-target="25">0</span>+</span>
        <span class="hero__metric-label" data-i18n="hero.m.people">People Led</span>
      </div>
      <div class="hero__metric">
        <span class="hero__metric-value"><span data-target="500">0</span>+</span>
        <span class="hero__metric-label" data-i18n="hero.m.units">Units Launched</span>
      </div>
    </div>
  </div>

  <div class="hero__scroll-hint" aria-hidden="true">
    <span>Scroll</span>
    <div class="hero__scroll-line"></div>
  </div>
</section>
```

- [ ] **Step 2: Reemplazar el CSS del hero**

En `styles/style.css`, localiza el bloque de estilos del hero (todo lo que empiece con `.hero` y `.metric-card`, `.metrics-bar` lo dejamos para Task 5) y reemplaza las reglas `.hero*` y `.metric-card*` por:

```css
.hero {
  min-height: 100vh; display: flex; align-items: center;
  padding-top: var(--nav-h);
  background:
    radial-gradient(60% 50% at 50% 0%, color-mix(in srgb, var(--clr-primary) 10%, transparent), transparent 70%),
    var(--bg);
}
.hero__inner {
  display: flex; flex-direction: column; align-items: center; text-align: center;
  /* sticky-progress: leve fade/scale al entrar (solo desktop, ver JS) */
  --progress: 1;
}
.hero__eyebrow {
  font-size: clamp(0.9rem, 2vw, 1.1rem); font-weight: 600;
  color: var(--clr-primary); letter-spacing: -0.01em; margin-bottom: 1rem;
}
.hero__name { font-size: clamp(2.8rem, 9vw, 6rem); font-weight: 700; }
.hero__tagline {
  max-width: 640px; margin: 1.5rem auto 0;
  font-size: clamp(1.05rem, 2.4vw, 1.4rem); color: var(--text-2); line-height: 1.5;
}
.hero__tagline strong { color: var(--text); font-weight: 600; }
.hero__actions { display: flex; flex-wrap: wrap; gap: 0.85rem; justify-content: center; margin-top: 2rem; }
.hero__metrics {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem 2.5rem;
  margin-top: clamp(3rem, 8vw, 5rem); width: 100%; max-width: 720px;
}
.hero__metric { display: flex; flex-direction: column; gap: 0.35rem; }
.hero__metric-value { font-size: clamp(1.8rem, 5vw, 3rem); font-weight: 700; letter-spacing: -0.03em; }
.hero__metric-label { font-size: 0.82rem; color: var(--text-2); }
.hero__scroll-hint {
  position: absolute; bottom: 1.75rem; left: 50%; transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
  font-size: 0.72rem; color: var(--text-2); text-transform: uppercase; letter-spacing: 0.1em;
}
.hero__scroll-line { width: 1px; height: 32px; background: linear-gradient(var(--text-2), transparent); animation: scrollPulse 2s var(--ease-apple) infinite; }
@keyframes scrollPulse { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }

@media (min-width: 720px) { .hero__metrics { grid-template-columns: repeat(4, 1fr); } }

@media (min-width: 1024px) {
  .hero__inner { opacity: var(--progress); transform: scale(calc(0.985 + 0.015 * var(--progress))); }
}
```

- [ ] **Step 3: Añadir `initStickyProgress()` en main.js**

En `js/main.js`, justo después del módulo de counters (tras la línea `counterEls.forEach(el => counterObserver.observe(el));`), añade:

```js
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
```

> Nota: el selector cubre `.hero__inner` (Task 3) y `.ai__inner` (Task 4). En Task 4 la sección AI usará `data-sticky` en su `.ai__inner`.

- [ ] **Step 4: Actualizar claves i18n del hero (cta1)**

En `js/main.js`, en `translations.en` cambia el valor de `'hero.cta1'` a `'Explore AI Work'` y en `translations.es` a `'Ver trabajo con IA'`. Verifica que `hero.cta2`, `hero.title`, `hero.tagline`, `hero.m.years`, `hero.m.revenue`, `hero.m.people`, `hero.m.units` ya existen (se reutilizan). Si `hero.m.units` no existiera con el valor correcto, asegúralo: en EN `'Units Launched'`, en ES `'Unidades Lanzadas'`.

- [ ] **Step 5: Verificar**

Run: recargar `index.html`
Expected: Hero a pantalla completa, eyebrow azul, nombre gigante, tagline gris con strong en negro, 2 botones píldora (el primero ancla a `#ai`), fila de 4 métricas que cuentan al cargar (4 columnas en desktop, 2 en móvil), scroll-hint pulsante. En desktop, al hacer scroll el `.hero__inner` hace un leve fade/scale. Pegar el snippet de paridad i18n → array vacío. Consola sin errores.

- [ ] **Step 6: Commit**

```bash
git add index.html styles/style.css js/main.js
git commit -m "feat(hero): Apple-style hero with minimal metrics row and sticky-progress entrance

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 4: AI-Driven PM Section (NUEVA — pieza protagonista)

**Files:**
- Modify: `index.html` — insertar `<section class="ai section" id="ai">` justo después de `</section>` del hero y antes de la metrics-bar.
- Modify: `styles/style.css` — añadir reglas `.ai*`.
- Modify: `js/main.js` — añadir todas las claves i18n `ai.*` en EN y ES.

**Interfaces:**
- Consumes: tokens Task 1, `initStickyProgress` de Task 3 (vía `data-sticky` en `.ai__inner`), acento `--ai-grad`.
- Produces: sección `#ai` (destino del link de nav de Task 2 y del CTA del hero).

- [ ] **Step 1: Insertar el markup de la sección AI**

En `index.html`, inmediatamente después de la etiqueta de cierre `</section>` del hero, inserta:

```html
<!-- =====================
     AI-Driven PM Section
===================== -->
<section class="ai section" id="ai" aria-label="AI expertise">
  <div class="container ai__inner" data-sticky>
    <div class="section__header fade-in">
      <span class="section__label ai__label" data-i18n="ai.label">AI-Driven PM</span>
      <h2 class="section__title" data-i18n="ai.title">Building products with AI at the core</h2>
    </div>

    <p class="ai__statement fade-in" data-i18n="ai.statement">
      I embed AI across every stage of the product cycle — from discovery to operational
      automation — to decide faster and scale with fewer resources.
    </p>

    <div class="ai__grid">
      <article class="ai-card fade-in">
        <div class="ai-card__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a4 4 0 0 0-4 4v1a4 4 0 0 0 0 8v1a4 4 0 0 0 8 0v-1a4 4 0 0 0 0-8V7a4 4 0 0 0-4-4z"/><path d="M12 3v18"/></svg>
        </div>
        <h3 class="ai-card__title" data-i18n="ai.c1.t">LLMs &amp; Assistants</h3>
        <p class="ai-card__desc" data-i18n="ai.c1.d">ChatGPT, Claude and Gemini woven into research, drafting and decision support.</p>
      </article>

      <article class="ai-card fade-in">
        <div class="ai-card__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
        </div>
        <h3 class="ai-card__title" data-i18n="ai.c2.t">AI-Assisted Building</h3>
        <p class="ai-card__desc" data-i18n="ai.c2.d">GitHub Copilot and Cursor to prototype, spec and ship faster alongside engineering.</p>
      </article>

      <article class="ai-card fade-in">
        <div class="ai-card__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v4H4z"/><path d="M4 12h10v8H4z"/><path d="M18 12h2v8h-2z"/></svg>
        </div>
        <h3 class="ai-card__title" data-i18n="ai.c3.t">Prompt Engineering</h3>
        <p class="ai-card__desc" data-i18n="ai.c3.d">Designing prompts and multi-step flows that turn models into reliable product tooling.</p>
      </article>

      <article class="ai-card fade-in">
        <div class="ai-card__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.2 4.2l2.8 2.8M17 17l2.8 2.8M1 12h4M19 12h4M4.2 19.8 7 17M17 7l2.8-2.8"/></svg>
        </div>
        <h3 class="ai-card__title" data-i18n="ai.c4.t">Automation &amp; Agents</h3>
        <p class="ai-card__desc" data-i18n="ai.c4.d">No-code agents and automations (Zapier/Make, N8N) that remove manual operational work.</p>
      </article>

      <article class="ai-card fade-in">
        <div class="ai-card__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 14l3-3 3 3 5-6"/></svg>
        </div>
        <h3 class="ai-card__title" data-i18n="ai.c5.t">AI Data &amp; Analytics</h3>
        <p class="ai-card__desc" data-i18n="ai.c5.d">AI-assisted analysis and dashboards that shorten the path from data to decision.</p>
      </article>

      <article class="ai-card fade-in">
        <div class="ai-card__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
        <h3 class="ai-card__title" data-i18n="ai.c6.t">AI Product Discovery</h3>
        <p class="ai-card__desc" data-i18n="ai.c6.d">AI-assisted research and synthesis to find the right problems before building.</p>
      </article>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Añadir el CSS de la sección AI**

En `styles/style.css`, añade (al final del archivo o tras el bloque del hero):

```css
.ai {
  background:
    radial-gradient(70% 60% at 100% 0%, color-mix(in srgb, var(--clr-accent) 12%, transparent), transparent 60%),
    var(--surface);
}
.ai__inner { --progress: 1; }
.ai__label {
  background: var(--ai-grad); -webkit-background-clip: text; background-clip: text;
  color: transparent; -webkit-text-fill-color: transparent;
}
.ai__statement {
  max-width: 760px; font-size: clamp(1.4rem, 3.5vw, 2.2rem); font-weight: 600;
  letter-spacing: -0.02em; line-height: 1.25; margin-bottom: clamp(2.5rem, 6vw, 4rem);
}
.ai__grid { display: grid; grid-template-columns: 1fr; gap: 1.25rem; }
.ai-card {
  background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-md);
  padding: 1.75rem; transition: transform 0.4s var(--ease-apple), box-shadow 0.4s var(--ease-apple);
}
.ai-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-card); }
.ai-card__icon {
  width: 48px; height: 48px; border-radius: 14px; margin-bottom: 1.1rem;
  display: grid; place-items: center; color: #fff; background: var(--ai-grad);
}
.ai-card__icon svg { width: 24px; height: 24px; }
.ai-card__title { font-size: 1.15rem; font-weight: 600; margin-bottom: 0.5rem; }
.ai-card__desc { font-size: 0.95rem; color: var(--text-2); line-height: 1.5; }

@media (min-width: 640px) { .ai__grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 980px) { .ai__grid { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1024px) {
  .ai__inner > .section__header, .ai__inner > .ai__statement {
    opacity: var(--progress); transform: translateY(calc((1 - var(--progress)) * 20px));
  }
}
```

- [ ] **Step 3: Añadir claves i18n `ai.*` (EN)**

En `js/main.js`, dentro de `translations.en` añade un bloque (junto a las demás secciones):

```js
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
```

- [ ] **Step 4: Añadir claves i18n `ai.*` (ES)**

En `js/main.js`, dentro de `translations.es` añade:

```js
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
```

- [ ] **Step 5: Verificar**

Run: recargar `index.html`
Expected: Tras el hero aparece la sección AI con label en gradiente azul→cian, statement grande, grid de 6 tarjetas (1 col móvil / 2 / 3 desktop) con íconos en squircle de gradiente, hover eleva la tarjeta. Click en nav "AI Expertise" y en el CTA "Explore AI Work" del hero hacen scroll a esta sección. Toggle EN/ES traduce todo. Pegar snippet i18n → array vacío. Consola sin errores.

- [ ] **Step 6: Commit**

```bash
git add index.html styles/style.css js/main.js
git commit -m "feat(ai): add AI-Driven PM hero section with tools grid and bilingual copy

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 5: Impact Metrics Band Restyle

**Files:**
- Modify: `styles/style.css` — reglas `.metrics-bar*`.

**Interfaces:**
- Consumes: tokens Task 1; counters existentes (`[data-target]`, sin cambios JS).

- [ ] **Step 1: Reemplazar el CSS de la metrics-bar**

En `styles/style.css`, localiza las reglas `.metrics-bar`, `.metrics-bar__container`, `.metrics-bar__item`, `.metrics-bar__value`, `.metrics-bar__label`, `.metrics-bar__divider`, `.metrics-bar__prefix` y reemplázalas por:

```css
.metrics-bar { background: var(--clr-dark); color: #fff; padding-block: clamp(3rem, 7vw, 5rem); }
.metrics-bar__container {
  max-width: var(--container-max); margin-inline: auto;
  padding-inline: clamp(1.25rem, 5vw, 2.5rem);
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem 1rem; align-items: start;
}
.metrics-bar__divider { display: none; }
.metrics-bar__item { text-align: center; }
.metrics-bar__value { font-size: clamp(2rem, 6vw, 3.4rem); font-weight: 700; letter-spacing: -0.03em; line-height: 1; }
.metrics-bar__value strong { font-weight: 700; }
.metrics-bar__prefix { color: var(--clr-accent); }
.metrics-bar__label { margin-top: 0.6rem; font-size: 0.8rem; color: rgba(255,255,255,0.6); }

@media (min-width: 860px) { .metrics-bar__container { grid-template-columns: repeat(5, 1fr); } }
```

- [ ] **Step 2: Verificar**

Run: recargar `index.html`
Expected: Banda oscura con 5 KPIs (2 columnas en móvil, 5 en desktop), números gigantes que cuentan al entrar al viewport, prefijo `$` en cian. Sin divisores verticales. Consola sin errores.

- [ ] **Step 3: Commit**

```bash
git add styles/style.css
git commit -m "feat(metrics): restyle impact metrics band Apple-style

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 6: About Section Restyle

**Files:**
- Modify: `styles/style.css` — reglas `.about*`, `.highlight-item*`.

**Interfaces:**
- Consumes: tokens Task 1.

- [ ] **Step 1: Reemplazar el CSS del about**

En `styles/style.css`, localiza las reglas `.about`, `.about__grid`, `.about__photo-wrap`, `.about__photo`, `.about__text`, `.about__highlights`, `.highlight-item`, `.highlight-item__icon`, `.highlight-item__title` y reemplázalas por:

```css
.about__photo-wrap {
  width: 100%; max-width: 560px; margin: 0 auto clamp(2rem, 5vw, 3rem);
  border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-card);
  aspect-ratio: 16 / 10;
}
.about__photo { width: 100%; height: 100%; object-fit: cover; }
.about__grid { display: grid; grid-template-columns: 1fr; gap: clamp(2rem, 5vw, 3.5rem); }
.about__text p { font-size: clamp(1.05rem, 2.2vw, 1.3rem); color: var(--text-2); line-height: 1.55; margin-bottom: 1.1rem; }
.about__text strong { color: var(--text); font-weight: 600; }
.about__highlights { display: grid; grid-template-columns: 1fr; gap: 1rem; }
.highlight-item {
  display: flex; gap: 1rem; align-items: flex-start;
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md);
  padding: 1.25rem; transition: transform 0.4s var(--ease-apple);
}
.highlight-item:hover { transform: translateY(-3px); }
.highlight-item__icon {
  flex-shrink: 0; width: 44px; height: 44px; border-radius: 12px; font-size: 1.4rem;
  display: grid; place-items: center; background: var(--surface-2);
}
.highlight-item__title { font-size: 1.05rem; font-weight: 600; margin-bottom: 0.3rem; }
.highlight-item p { font-size: 0.92rem; color: var(--text-2); line-height: 1.5; }

@media (min-width: 860px) {
  .about__grid { grid-template-columns: 1.1fr 1fr; align-items: start; }
  .about__highlights { grid-template-columns: 1fr 1fr; }
}
```

- [ ] **Step 2: Verificar**

Run: recargar `index.html`
Expected: Foto grande con esquinas redondeadas y aspecto 16:10, bio en gris con strong en negro, 4 highlight cards en grid 2×2 (desktop) que se elevan al hover. Reveal escalonado al hacer scroll. Consola sin errores.

- [ ] **Step 3: Commit**

```bash
git add styles/style.css
git commit -m "feat(about): restyle about section with editorial photo and highlight cards

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 7: Experience Timeline Restyle

**Files:**
- Modify: `styles/style.css` — reglas `.timeline*`.

**Interfaces:**
- Consumes: tokens Task 1.

- [ ] **Step 1: Reemplazar el CSS del timeline**

En `styles/style.css`, localiza las reglas `.timeline`, `.timeline__item`, `.timeline__marker`, `.timeline__content`, `.timeline__header`, `.timeline__role`, `.timeline__company`, `.timeline__arrow`, `.timeline__client`, `.timeline__period`, `.timeline__industry`, `.timeline__bullets`, `.timeline__tech`, `.timeline__gallery-btn` y reemplázalas por:

```css
.timeline { position: relative; display: flex; flex-direction: column; gap: 1.25rem; }
.timeline__item { position: relative; }
.timeline__marker { display: none; }
.timeline__content {
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg);
  padding: clamp(1.5rem, 4vw, 2.25rem); transition: box-shadow 0.4s var(--ease-apple);
}
.timeline__content:hover { box-shadow: var(--shadow-card); }
.timeline__header { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 0.5rem 1rem; align-items: baseline; margin-bottom: 0.4rem; }
.timeline__role { font-size: clamp(1.2rem, 2.6vw, 1.5rem); font-weight: 600; }
.timeline__company { font-size: 0.98rem; color: var(--text-2); display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; }
.timeline__arrow { color: var(--clr-primary); }
.timeline__client { color: var(--text); font-weight: 500; }
.timeline__period { font-size: 0.82rem; color: var(--text-2); white-space: nowrap; }
.timeline__industry { font-size: 0.86rem; color: var(--clr-primary); margin-bottom: 1rem; }
.timeline__bullets { display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1.25rem; }
.timeline__bullets li { position: relative; padding-left: 1.25rem; font-size: 0.96rem; color: var(--text); line-height: 1.5; }
.timeline__bullets li::before { content: ""; position: absolute; left: 0; top: 0.6em; width: 6px; height: 6px; border-radius: 50%; background: var(--clr-primary); }
.timeline__bullets strong { font-weight: 600; }
.timeline__tech { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.1rem; }
.timeline__tech span {
  font-size: 0.74rem; color: var(--text-2);
  background: var(--surface-2); border: 1px solid var(--border);
  padding: 0.25rem 0.65rem; border-radius: 980px;
}
.timeline__gallery-btn {
  display: inline-flex; align-items: center; gap: 0.45rem;
  font-size: 0.82rem; color: var(--clr-primary); background: none;
  border: 1px solid var(--border); border-radius: 980px; padding: 0.45rem 0.9rem; cursor: pointer;
  transition: background 0.25s var(--ease-apple);
}
.timeline__gallery-btn:hover { background: var(--surface-2); }
```

- [ ] **Step 2: Verificar**

Run: recargar `index.html`
Expected: 5 roles como tarjetas squircle limpias, header con rol grande + periodo a la derecha, bullets con punto azul, tags de tecnología en píldoras, botón "View Photos" funcional (abre galería). Reveal escalonado. Consola sin errores.

- [ ] **Step 3: Commit**

```bash
git add styles/style.css
git commit -m "feat(experience): restyle timeline as clean Apple cards

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 8: Case Studies Restyle + AI Badges

**Files:**
- Modify: `index.html` — añadir badge AI a las case cards relevantes (Better Trucks).
- Modify: `styles/style.css` — reglas `.cases__grid`, `.case-card*`, `.case-metric`, nueva `.case-card__ai-badge`.
- Modify: `js/main.js` — clave i18n `cs.ai.badge`.

**Interfaces:**
- Consumes: tokens Task 1, `--ai-grad`.

- [ ] **Step 1: Añadir el badge AI a la case card de Better Trucks**

En `index.html`, dentro de `<article class="case-card case-card--featured ..." data-gallery="better-trucks" ...>`, justo después de la etiqueta `<span class="case-card__tag" ...>...</span>`, inserta:

```html
            <span class="case-card__ai-badge" data-i18n="cs.ai.badge">AI</span>
```

- [ ] **Step 2: Reemplazar el CSS de case studies**

En `styles/style.css`, localiza las reglas `.cases__grid`, `.case-card`, `.case-card--featured`, `.case-card__tag`, `.case-card__title`, `.case-card__desc`, `.case-card__metrics`, `.case-metric`, `.case-card__footer`, `.case-card__industry`, `.case-card__gallery-hint` y reemplázalas por:

```css
.cases__grid { display: grid; grid-template-columns: 1fr; gap: 1.25rem; }
.case-card {
  position: relative; background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius-lg); padding: clamp(1.5rem, 4vw, 2.5rem); cursor: pointer;
  transition: transform 0.4s var(--ease-apple), box-shadow 0.4s var(--ease-apple);
}
.case-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-card); }
.case-card:focus-visible { outline: 2px solid var(--clr-primary); outline-offset: 3px; }
.case-card__tag { display: inline-block; font-size: 0.76rem; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: var(--text-2); }
.case-card__ai-badge {
  position: absolute; top: 1.25rem; right: 1.25rem;
  font-size: 0.7rem; font-weight: 700; letter-spacing: 0.05em; color: #fff;
  background: var(--ai-grad); padding: 0.2rem 0.6rem; border-radius: 980px;
}
.case-card__title { font-size: clamp(1.3rem, 3vw, 1.8rem); font-weight: 600; margin: 0.5rem 0 0.75rem; }
.case-card__desc { font-size: 0.98rem; color: var(--text-2); line-height: 1.55; margin-bottom: 1.5rem; }
.case-card__metrics { display: flex; flex-wrap: wrap; gap: 1.5rem 2.5rem; margin-bottom: 1.5rem; }
.case-metric { display: flex; flex-direction: column; gap: 0.2rem; }
.case-metric strong { font-size: clamp(1.4rem, 3.5vw, 2rem); font-weight: 700; letter-spacing: -0.02em; }
.case-metric span { font-size: 0.78rem; color: var(--text-2); }
.case-card__footer { display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding-top: 1.25rem; border-top: 1px solid var(--border); }
.case-card__industry { font-size: 0.82rem; color: var(--text-2); }
.case-card__gallery-hint { display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.82rem; color: var(--clr-primary); }

@media (min-width: 860px) {
  .cases__grid { grid-template-columns: 1fr 1fr; }
  .case-card--featured { grid-column: 1 / -1; }
}
```

- [ ] **Step 3: Añadir clave i18n `cs.ai.badge`**

En `js/main.js`: en `translations.en` añade `'cs.ai.badge': 'AI',` y en `translations.es` añade `'cs.ai.badge': 'IA',`.

- [ ] **Step 4: Verificar**

Run: recargar `index.html`
Expected: Grid de case cards (1 col móvil, 2 col desktop con la featured ocupando ancho completo), hover eleva, badge "AI" con gradiente en la esquina de Better Trucks, métricas grandes, footer con "View Photos". Click abre la galería. EN/ES cambia badge AI↔IA. Snippet i18n → vacío. Consola sin errores.

- [ ] **Step 5: Commit**

```bash
git add index.html styles/style.css js/main.js
git commit -m "feat(cases): restyle case studies with AI gradient badges

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 9: Gallery → Horizontal Scroll-Snap Carousel

Refactoriza la galería modal: en vez de mostrar una sola foto con prev/next, muestra todas las fotos en un track horizontal con `scroll-snap`, conservando dots, contador, teclado y cierre.

**Files:**
- Modify: `index.html` — reemplazar el `.modal__stage` por un track scroll-snap.
- Modify: `styles/style.css` — reglas `.modal*` para el carrusel.
- Modify: `js/main.js` — reescribir `openGallery`/`showPhoto` para construir slides y sincronizar el scroll con dots/contador.

**Interfaces:**
- Consumes: `galleryData` (sin cambios), `modalTitle`, `modalDots`, `modalCounter`, `closeGallery` existentes.
- Produces: `#galleryTrack` (contenedor scroll-snap) y handlers de scroll que actualizan `activeIndex`.

- [ ] **Step 1: Reemplazar el markup del stage del modal**

En `index.html`, dentro de `<div class="modal" role="document">`, reemplaza el bloque `<div class="modal__stage"> ... </div>` (con sus botones prev/next y `.modal__photo-wrap`) por:

```html
      <div class="modal__track" id="galleryTrack" tabindex="0" aria-label="Photo carousel"></div>
```

Mantén intactos `.modal__header`, `.modal__footer` (con `#modalDots` y `#modalCounter`) y `.modal__thumbs`.

- [ ] **Step 2: Reemplazar el CSS del modal stage por estilos de carrusel**

En `styles/style.css`, localiza las reglas del stage/foto (`.modal__stage`, `.modal__nav`, `.modal__photo-wrap`, `.modal__photo`, `.modal__photo.fading`) y reemplázalas por:

```css
.modal__track {
  display: flex; gap: 0; overflow-x: auto; scroll-snap-type: x mandatory;
  scroll-behavior: smooth; -webkit-overflow-scrolling: touch;
  border-radius: var(--radius-md); outline: none;
}
.modal__track::-webkit-scrollbar { display: none; }
.modal__track { scrollbar-width: none; }
.modal__slide {
  flex: 0 0 100%; scroll-snap-align: center;
  display: grid; place-items: center; min-height: 0;
}
.modal__slide img { width: 100%; max-height: 70vh; object-fit: contain; border-radius: var(--radius-md); }
```

- [ ] **Step 3: Reescribir `openGallery` y `showPhoto` en main.js**

En `js/main.js`, reemplaza las referencias `modalPhoto/modalPrev/modalNext` y las funciones `openGallery` y `showPhoto` por la versión basada en track. Primero, en el bloque de DOM refs del modal, elimina las líneas `const modalPhoto`, `const modalPrev`, `const modalNext` y añade:

```js
const modalTrack = document.getElementById('galleryTrack');
```

Luego reemplaza `openGallery` y `showPhoto` por:

```js
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
```

- [ ] **Step 4: Sincronizar el scroll del track con los indicadores**

En `js/main.js`, justo después de la definición de `syncIndicators`, añade un listener de scroll del track (reemplaza los antiguos listeners de `modalPrev`/`modalNext` que ya no existen):

```js
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
```

Asegúrate de **eliminar** las líneas antiguas `modalPrev.addEventListener(...)` y `modalNext.addEventListener(...)`. Los dots y thumbs siguen llamando a `showPhoto(index)` (que ahora hace scroll). El handler de teclado `ArrowLeft/ArrowRight` sigue funcionando porque llama a `showPhoto(activeIndex ± 1)`.

- [ ] **Step 5: Verificar**

Run: recargar `index.html`, abrir una galería (click en una case card o "View Photos")
Expected: El modal muestra las fotos en un carrusel horizontal con snap; arrastrar/scroll horizontal cambia foto y actualiza dots+contador; click en dots/thumbs hace scroll a la foto; flechas del teclado navegan; Esc cierra; en móvil (device toolbar) el swipe nativo funciona con snap. Consola sin errores.

- [ ] **Step 6: Commit**

```bash
git add index.html styles/style.css js/main.js
git commit -m "feat(gallery): refactor modal to horizontal scroll-snap carousel

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 10: Skills — Interactive Data-Driven Category Grid (sin niveles)

Reemplaza el markup estático de skills por un grid generado desde un objeto JS. Cada categoría es una tarjeta expandible (hover en desktop, tap/teclado en móvil) que revela sus skills. **Sin barras, porcentajes ni niveles.**

**Files:**
- Modify: `index.html` — reemplazar `.skills__grid` por contenedor vacío `#skillsGrid`.
- Modify: `js/main.js` — añadir `skillsData`, `renderSkills()`, toggle de expansión; claves i18n de categorías.
- Modify: `styles/style.css` — reglas `.skills*`, `.skill-cat*` (reemplazan `.skill-group*`).

**Interfaces:**
- Consumes: tokens Task 1, `applyTranslations`/`currentLang` existentes.
- Produces:
  - `const skillsData = [{ id, icon, skills: string[] }]` (títulos vía clave i18n `sk.cat.<id>`).
  - `function renderSkills()` — inyecta el grid en `#skillsGrid` y vuelve a aplicar traducciones.

- [ ] **Step 1: Reemplazar el contenido de la sección skills en el HTML**

En `index.html`, reemplaza el `<div class="skills__grid"> ... </div>` (con los 6 `.skill-group`) por:

```html
        <div class="skills__grid" id="skillsGrid"></div>
```

- [ ] **Step 2: Añadir `skillsData` y `renderSkills()` en main.js**

En `js/main.js`, antes del módulo de la galería (`/* 11. Photo Gallery Modal */`), añade:

```js
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
```

- [ ] **Step 3: Añadir claves i18n de categorías**

En `js/main.js`, en `translations.en` añade:

```js
    'sk.cat.product': 'Product Management',
    'sk.cat.ai':      'AI & Automation',
    'sk.cat.data':    'Data & Analytics',
    'sk.cat.design':  'Discovery & Design',
    'sk.cat.ops':     'Operations & Tools',
    'sk.cat.methods': 'Methodologies',
```

En `translations.es` añade:

```js
    'sk.cat.product': 'Gestión de Producto',
    'sk.cat.ai':      'IA y Automatización',
    'sk.cat.data':    'Datos y Analítica',
    'sk.cat.design':  'Discovery y Diseño',
    'sk.cat.ops':     'Operaciones y Herramientas',
    'sk.cat.methods': 'Metodologías',
```

- [ ] **Step 4: Añadir el CSS de las skills interactivas**

En `styles/style.css`, localiza las reglas `.skills__grid`, `.skill-group`, `.skill-group__title`, `.skill-tags` y reemplázalas por:

```css
.skills__grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
.skill-cat { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); overflow: hidden; }
.skill-cat__head {
  width: 100%; display: flex; align-items: center; gap: 0.85rem;
  padding: 1.1rem 1.25rem; background: none; border: none; cursor: pointer;
  color: var(--text); text-align: left;
}
.skill-cat__icon { width: 38px; height: 38px; border-radius: 11px; display: grid; place-items: center; background: var(--surface-2); flex-shrink: 0; }
.skill-cat__icon svg { width: 20px; height: 20px; color: var(--clr-primary); }
.skill-cat__title { flex: 1; font-size: 1.05rem; font-weight: 600; }
.skill-cat__chevron { transition: transform 0.4s var(--ease-apple); color: var(--text-2); }
.skill-cat__chevron svg { width: 18px; height: 18px; display: block; }
.skill-cat.open .skill-cat__chevron { transform: rotate(180deg); }
.skill-cat__panel {
  display: grid; grid-template-rows: 0fr;
  transition: grid-template-rows 0.45s var(--ease-apple);
}
.skill-cat.open .skill-cat__panel { grid-template-rows: 1fr; }
.skill-cat__tags { overflow: hidden; display: flex; flex-wrap: wrap; gap: 0.5rem; padding: 0 1.25rem; }
.skill-cat.open .skill-cat__tags { padding-bottom: 1.25rem; }
.skill-cat__tags span {
  font-size: 0.82rem; color: var(--text); background: var(--surface-2);
  border: 1px solid var(--border); padding: 0.35rem 0.8rem; border-radius: 980px;
}

@media (min-width: 768px) { .skills__grid { grid-template-columns: 1fr 1fr; } }
@media (hover: hover) and (min-width: 1024px) {
  .skill-cat:hover .skill-cat__panel { grid-template-rows: 1fr; }
  .skill-cat:hover .skill-cat__tags { padding-bottom: 1.25rem; }
  .skill-cat:hover .skill-cat__chevron { transform: rotate(180deg); }
}
```

- [ ] **Step 5: Verificar**

Run: recargar `index.html`
Expected: Skills como 6 tarjetas de categoría (1 col móvil, 2 col desktop) con ícono + título + chevron. En desktop, hover expande y revela los tags (sin niveles); el chevron rota. En móvil, tap expande/colapsa (aria-expanded cambia). Teclado: Tab al header + Enter/Espacio expande. Toggle EN/ES traduce los títulos de categoría. Snippet i18n → vacío. Reveal al hacer scroll. Consola sin errores.

- [ ] **Step 6: Commit**

```bash
git add index.html styles/style.css js/main.js
git commit -m "feat(skills): data-driven interactive category grid without levels

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 11: Education Section Restyle

**Files:**
- Modify: `styles/style.css` — reglas `.education*`, `.edu-card*`.

**Interfaces:**
- Consumes: tokens Task 1, `--ai-grad`.

- [ ] **Step 1: Reemplazar el CSS de education**

En `styles/style.css`, localiza las reglas `.education__grid`, `.edu-card`, `.edu-card--primary`, `.edu-card--cert`, `.edu-card__year`, `.edu-card__degree`, `.edu-card__school` y reemplázalas por:

```css
.education__grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
.edu-card {
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md);
  padding: 1.5rem; transition: transform 0.4s var(--ease-apple), box-shadow 0.4s var(--ease-apple);
}
.edu-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-card); }
.edu-card__year { font-size: 0.78rem; color: var(--text-2); margin-bottom: 0.5rem; }
.edu-card__degree { font-size: 1.1rem; font-weight: 600; margin-bottom: 0.4rem; line-height: 1.25; }
.edu-card__school { font-size: 0.9rem; color: var(--text-2); line-height: 1.4; }
.edu-card__school small { color: var(--text-2); }
.edu-card--primary { border-color: color-mix(in srgb, var(--clr-primary) 35%, var(--border)); }
.edu-card--cert { position: relative; }
.edu-card--cert::before {
  content: "AI"; position: absolute; top: 1rem; right: 1rem;
  font-size: 0.62rem; font-weight: 700; letter-spacing: 0.05em; color: #fff;
  background: var(--ai-grad); padding: 0.15rem 0.5rem; border-radius: 980px;
}

@media (min-width: 640px) { .education__grid { grid-template-columns: 1fr 1fr; } }
@media (min-width: 980px) { .education__grid { grid-template-columns: repeat(3, 1fr); } }
```

- [ ] **Step 2: Verificar**

Run: recargar `index.html`
Expected: Education como grid de tarjetas squircle (1/2/3 columnas según ancho), MBA y B.S. con borde azulado, las 3 certificaciones de IA (`edu-card--cert`) con badge "AI" en gradiente. Hover eleva. Consola sin errores.

- [ ] **Step 3: Commit**

```bash
git add styles/style.css
git commit -m "feat(education): restyle as squircle grid with AI cert badges

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 12: Contact + Footer Restyle

**Files:**
- Modify: `styles/style.css` — reglas `.contact*`, `.footer*`.

**Interfaces:**
- Consumes: tokens Task 1.

- [ ] **Step 1: Reemplazar el CSS de contact y footer**

En `styles/style.css`, localiza las reglas `.contact`, `.contact__inner`, `.contact__title`, `.contact__subtitle`, `.contact__links`, `.contact__link`, `.contact__link--primary`, `.contact__link--secondary`, `.contact__link--ghost`, `.footer`, `.footer__copy`, `.footer__sub` y reemplázalas por:

```css
.contact { background: var(--clr-dark); color: #fff; }
.contact__inner { text-align: center; max-width: 720px; margin-inline: auto; }
.contact .section__label { color: var(--clr-accent); }
.contact__title { font-size: clamp(2rem, 6vw, 3.5rem); font-weight: 600; margin-bottom: 1rem; }
.contact__subtitle { font-size: clamp(1rem, 2.2vw, 1.25rem); color: rgba(255,255,255,0.65); line-height: 1.55; margin-bottom: 2.5rem; }
.contact__links { display: flex; flex-wrap: wrap; gap: 0.85rem; justify-content: center; }
.contact__link {
  display: inline-flex; align-items: center; gap: 0.6rem;
  padding: 0.85rem 1.5rem; border-radius: 980px; font-weight: 500;
  transition: transform 0.3s var(--ease-apple), background 0.3s var(--ease-apple);
}
.contact__link:hover { transform: scale(1.04); }
.contact__link--primary { background: var(--clr-primary); color: #fff; }
.contact__link--secondary { background: rgba(255,255,255,0.1); color: #fff; }
.contact__link--ghost { background: transparent; border: 1px solid rgba(255,255,255,0.25); color: #fff; }
.contact__link--secondary:hover { background: rgba(255,255,255,0.18); }
.contact__link--ghost:hover { background: rgba(255,255,255,0.08); }

.footer { background: var(--clr-dark); color: rgba(255,255,255,0.5); padding-block: 2.5rem; border-top: 1px solid rgba(255,255,255,0.08); }
.footer .container { text-align: center; }
.footer__copy { font-size: 0.85rem; margin-bottom: 0.3rem; }
.footer__sub { font-size: 0.78rem; color: rgba(255,255,255,0.35); }
```

- [ ] **Step 2: Verificar**

Run: recargar `index.html`
Expected: Sección de contacto oscura con título grande, 3 botones (email azul, LinkedIn translúcido, descarga CV ghost) que escalan al hover. Descargar CV baja el PDF; email abre el cliente; LinkedIn abre en pestaña nueva. Footer oscuro centrado. Consola sin errores.

- [ ] **Step 3: Commit**

```bash
git add styles/style.css
git commit -m "feat(contact): restyle contact and footer as dark closing section

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 13: Final QA, Cross-Cutting Verification & Docs

**Files:**
- Modify: `CLAUDE.md` — añadir la sección `#ai` a la tabla de secciones y a los prefijos i18n.
- Modify: `SesionAnt.md` — registrar la sesión del rediseño.
- Modify: `styles/style.css` / `js/main.js` — limpiar restos no usados si los hubiera.

**Interfaces:**
- Consumes: todo lo anterior.

- [ ] **Step 1: Ejecutar el protocolo de verificación completo**

Run: `start "" "C:\Users\Luis Benavides TMP\Desktop\CV Portfolio\index.html"` y recorrer todo el sitio.
Expected (marcar cada uno):
- Las 9 secciones renderizan en orden: hero → ai → metrics-bar → about → experience → case-studies → skills → education → contact.
- Toggle EN/ES traduce TODO (incluida la sección AI y categorías de skills).
- Pegar el snippet de paridad i18n en consola → `MISSING I18N KEYS: []`.
- Dark mode: toggle pinta toda la paleta dark y persiste tras recargar.
- Reveals escalonados al hacer scroll en todas las secciones.
- Sticky-progress visible en desktop (hero + AI), ausente/limpio en móvil.
- Reduced-motion (emulado): sin animaciones de movimiento.
- Galería: carrusel scroll-snap con dots/contador/teclado/swipe.
- Skills: expandir/colapsar por hover (desktop) y tap/teclado (móvil), sin niveles.
- Descarga de CV, email y LinkedIn funcionan.
- Móvil (iPhone 12 Pro): layout fluido, menú hamburguesa OK, sin scroll horizontal.
- Consola sin errores ni warnings en toda la navegación.

- [ ] **Step 2: Buscar y limpiar restos no usados**

Run (Grep) verificar que no queden referencias muertas:
- Buscar `metric-card` en `index.html` → no debe haber resultados (se eliminó en Task 3).
- Buscar `modal__stage`, `modalPrev`, `modalNext`, `modal__photo` en `index.html` y `js/main.js` → no debe haber resultados (refactorizado en Task 9).
- Buscar `skill-group` en `index.html` → no debe haber resultados (reemplazado en Task 10).

Si alguna búsqueda devuelve resultados, eliminar el CSS/JS huérfano correspondiente.

- [ ] **Step 3: Actualizar CLAUDE.md**

En `CLAUDE.md`, en la tabla "Secciones del sitio", añade una fila tras `#hero`:

```markdown
| `#ai` | Sección AI-Driven PM: statement de filosofía + grid de 6 herramientas/tecnologías IA |
```

Y en la lista de "Prefijos de claves" de i18n, añade `ai` y `sk.cat` al conjunto existente.

- [ ] **Step 4: Actualizar SesionAnt.md**

En `SesionAnt.md`, añade una nueva entrada de sesión documentando: rediseño Apple-style completo, nueva sección `#ai`, skills data-driven sin niveles, galería como carrusel scroll-snap, motor sticky-progress desktop-only. Rama `feature/v1.0.0`.

- [ ] **Step 5: Commit final**

```bash
git add CLAUDE.md SesionAnt.md styles/style.css js/main.js index.html
git commit -m "chore: final QA cleanup and docs for Apple-style redesign

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Self-Review (ejecutado al escribir el plan)

**1. Cobertura del spec:**
- Estilo Apple producto / tipografía fluida / squircles / aire → Tasks 1, 3–12. ✓
- Motor de animación Opción A (IntersectionObserver reveals + rAF sticky-progress desktop-only + reduced-motion + gating móvil) → Tasks 1, 3. ✓
- Sección AI dedicada (filosofía + herramientas, sin casos ni certs) → Task 4. ✓
- Hilo conductor IA (badges en case studies, refuerzo hero) → Tasks 3, 4, 8. ✓
- Skills grid interactivo sin niveles → Task 10. ✓
- Conservar EN/ES, dark mode, galerías, PDF → Tasks 2/4/8/10 (i18n), 1–12 (dark vars), 9 (galería), 12 (PDF). ✓
- Galería carrusel scroll-snap → Task 9. ✓
- Certificaciones IA permanecen en Education → Task 11. ✓
- Protocolo de verificación manual → Task 13. ✓

**2. Placeholder scan:** Sin "TBD"/"TODO"/"handle edge cases". Todo el código (CSS/JS/HTML/i18n) está completo e incluido. ✓

**3. Consistencia de tipos/nombres:** `initStickyProgress` (Task 3) se reutiliza vía `data-sticky`/`.ai__inner` (Task 4). `skillsData`/`renderSkills`/`#skillsGrid` (Task 10) consistentes. `galleryData`/`#galleryTrack`/`syncIndicators`/`showPhoto` (Task 9) consistentes. Claves i18n con prefijos `ai.*`, `sk.cat.*`, `nav.ai`, `cs.ai.badge` consistentes entre uso en HTML y definición en EN/ES. Variables CSS (`--ai-grad`, `--ease-apple`, `--reveal-y`, etc.) definidas en Task 1 y usadas después. ✓
