# Rediseño Apple-Style del Portafolio — Diseño

**Fecha:** 2026-06-16
**Proyecto:** CV Portfolio de Luis Carlos Benavides Fiallo
**Rama activa:** `feature/v1.0.0`

---

## Objetivo

Transformar el portafolio actual (genérico) en un sitio **moderno, limpio y cinematográfico al estilo de las páginas de producto de Apple** (iPhone/Mac), con transiciones fluidas, navegación fácil, y **foco explícito en el conocimiento de IA** del candidato. Sigue siendo una SPA vanilla sin dependencias.

## Resumen del alcance

- **Tipo:** Rediseño visual completo. Se **reescribe `style.css` desde cero**, se **reestructura `index.html`** y se **amplía `main.js`**. Se conserva toda la lógica de i18n, dark mode, galerías y descarga de PDF.
- **Conservar (obligatorio):** bilingüe EN/ES (`data-i18n`), dark mode, galerías de fotos en case studies, descarga de CV en PDF.
- **Prioridad declarada:** **rendimiento móvil impecable** (60fps, `prefers-reduced-motion`, animaciones pesadas limitadas a desktop).
- **Sin dependencias externas** — vanilla JS/CSS, mobile-first (regla del proyecto, ver CLAUDE.md).

## Restricciones globales (verbatim del proyecto)

- Sin frameworks ni dependencias externas. No npm, no build step.
- Mobile-first: estilos base para móvil, luego media queries para desktop.
- Todo texto visible debe tener su par de claves **EN y ES** en `translations` de `main.js`.
- Usar CSS Custom Properties existentes/nuevas; no hardcodear colores/tamaños sueltos.
- Mantener atributos `aria-*` y semántica HTML5.
- Solo comentar el "por qué", no el "qué".

---

## Sistema de diseño visual

### Tipografía
- System font stack actual (SF en Apple → look nativo). No se añaden webfonts.
- Display headlines: `clamp(2.5rem, 8vw, 6rem)`, peso 600–700, `letter-spacing: -0.03em`.
- Jerarquía por sección: **eyebrow** (label pequeño en mayúsculas, `letter-spacing` positivo) → **headline** gigante → **subcopy** en gris secundario.
- Body fluido con `clamp()`.

### Paleta (tokens CSS)
- **Light:** fondo base `#fbfbfd`, superficies `#ffffff`, texto `#1d1d1f`, gris secundario `#86868b`.
- **Dark:** fondo base `#000000`, superficies `#0b0b0d`, texto `#f5f5f7`, gris secundario `#a1a1a6`.
- **Acento producto:** azul `#2563eb` (se mantiene).
- **Acento IA:** gradiente `#2563eb → #06b6d4`, **reservado exclusivamente** al hilo conductor de IA (sección AI, badges "AI").

### Espacio y forma
- `--section-pad` ≈ 7rem (desktop), reducido en móvil.
- `--container-max` 1080–1120px, contenido centrado, mucho aire.
- Tarjetas con `border-radius` 20–28px ("squircle"), sombras suaves.
- `gap` generoso en grids.

### Movimiento (Opción A — motor híbrido vanilla)
- **Reveals:** `opacity 0→1` + `translateY(24px→0)`, easing `cubic-bezier(0.28, 0.11, 0.32, 1)`, ~0.8s, escalonado (stagger).
- **Sticky-progress:** solo 2–3 momentos clave (hero + entrada a la sección IA), vía `requestAnimationFrame`, **activado únicamente en desktop** con `matchMedia`.
- Solo se animan `transform` y `opacity` (composited → 60fps).
- `prefers-reduced-motion: reduce` → todo se reduce a aparición instantánea o fade mínimo.
- En móvil los efectos pesados degradan a fades simples.

---

## Estructura de secciones

| # | Sección | ID | Tratamiento |
|---|---------|-----|-------------|
| 1 | **Hero** | `#hero` | Pantalla completa. Eyebrow "Senior Product Manager" → headline gigante con el nombre → subcopy (tagline con $10M+ y AI-driven). 4 métricas como **fila minimalista** (no tarjetas de colores). Scroll-hint animado. Momento sticky de entrada. |
| 2 | **AI-Driven PM** ⭐ NUEVO | `#ai` | Sección protagonista tras el hero. Statement grande de **filosofía AI-first** + **grid de herramientas/tecnologías IA** (íconos SVG en squircles). Usa el acento gradiente IA. Entrada sticky-progress en desktop. |
| 3 | **Métricas de impacto** | `#metrics` | Banda de KPIs con contadores animados (`requestAnimationFrame`), tipografía gigante, fondo contrastante. |
| 4 | **About** | `#about` | Foto grande editorial + bio + highlight cards minimalistas. |
| 5 | **Experience** | `#experience` | Timeline rediseñado: líneas finas, limpio, reveal escalonado. 5 roles (2012–presente). |
| 6 | **Case Studies** | `#case-studies` | Tarjetas grandes con **carrusel horizontal de fotos (scroll-snap)**. **Badge "AI"** en los casos relevantes (hilo conductor). |
| 7 | **Skills** ⭐ REDISEÑO | `#skills` | **Grid interactivo de categorías** (p.ej. Product, AI & Data, Leadership, Tools). Cada tarjeta revela/expande sus skills al hover/click. **Sin niveles ni calificación** — solo mostrar las skills. |
| 8 | **Education** | `#education` | Grid de tarjetas squircle: MBA, B.S., y **certificaciones (incl. las de IA)**. |
| 9 | **Contact** | `#contact` | Cierre oscuro, CTA grande, email/LinkedIn/**descarga CV PDF**. |

### Hilo conductor de IA (transversal)
- Refuerzo en el hero (tagline destaca "AI-driven").
- Badge "AI" con acento gradiente en case studies relevantes.
- Sección dedicada `#ai` como pieza protagonista.
- (Las certificaciones de IA permanecen en Education, no se duplican en `#ai`.)

---

## Contenido de la sección AI-Driven PM

**Statement de filosofía (editable):** "Integro IA en cada etapa del ciclo de producto — desde el discovery hasta la automatización operativa — para decidir más rápido y escalar con menos recursos."

**Herramientas/tecnologías IA (lista base, editable):**
- LLMs & asistentes: ChatGPT, Claude, Gemini
- Dev & producto con IA: GitHub Copilot, Cursor / coding asistido
- Prompt engineering (diseño de prompts y flujos)
- Automatización / no-code IA: Zapier / Make con IA, agentes
- Datos & análisis con IA: análisis asistido, dashboards
- AI product discovery: investigación y síntesis asistida por IA

Cada herramienta se muestra como ícono SVG dentro de un squircle, con etiqueta. **No se muestra nivel de dominio.**

---

## Skills (rediseño)

- Datos de skills definidos en un **objeto JS data-driven** (categorías → array de skills), para render sin duplicar markup y para soportar i18n.
- Categorías propuestas (editable): **Product Management**, **AI & Data**, **Leadership**, **Tools & Platforms**.
- Interacción: cada tarjeta de categoría revela/expande sus skills al hover (desktop) o tap (móvil). Accesible por teclado.
- **Sin barras, anillos, porcentajes ni etiquetas de nivel.**

---

## Arquitectura técnica (archivos)

```
index.html      Reestructurado: nueva sección #ai, skills grid data-driven,
                markup Apple-style (eyebrow/headline/subcopy), badges AI.
                Nuevas claves data-i18n para AI y categorías de skills.
styles/style.css  REESCRITO desde cero: tokens (color/tipografía/espacio),
                squircles, layouts por sección, dark mode, reduced-motion,
                media queries mobile-first.
js/main.js      AMPLIADO: módulo "scroll engine" (1 IntersectionObserver
                reutilizable para reveals + módulo rAF sticky-progress
                gated por matchMedia desktop); render data-driven de skills;
                carrusel scroll-snap helpers. CONSERVA i18n (+claves nuevas
                EN/ES), dark mode, contadores, smooth scroll, mobile menu.
assets/ai/      Íconos SVG de herramientas IA (o SVG inline en HTML).
```

### Decisiones técnicas
- **Reveals:** atributo `data-reveal` + una sola `IntersectionObserver` reutilizable (DRY). Stagger vía `data-reveal-delay` o índice.
- **Sticky-progress:** módulo aislado, solo activo en desktop (`window.matchMedia('(min-width: 1024px)')`); usa `requestAnimationFrame`, no listeners de scroll sin throttle.
- **Skills:** objeto `skillsData` → función de render que crea el grid e inyecta claves i18n.
- **Carrusel:** CSS `scroll-snap-type: x mandatory` + `scroll-snap-align`; JS mínimo para indicadores/arrastre opcional.
- **i18n:** toda copy nueva con par EN/ES en `translations`. Reusar `applyTranslations(lang)` y `data-i18n` / `data-i18n-html` existentes.
- **Performance:** animar solo `transform`/`opacity`; `will-change` puntual; respetar `prefers-reduced-motion`; degradar en móvil.

---

## Testing / verificación (sin framework de test)

Verificación manual estructurada (el proyecto no tiene runner de tests):
1. **Render base:** abrir `index.html`, las 9 secciones cargan sin errores en consola.
2. **i18n:** toggle EN/ES actualiza toda la copy nueva (AI, skills) sin claves faltantes.
3. **Dark mode:** toggle aplica `.dark` y persiste en `localStorage`; paleta dark correcta en todas las secciones.
4. **Reveals:** al hacer scroll, los elementos `data-reveal` aparecen escalonados.
5. **Sticky-progress:** en desktop (≥1024px) los momentos sticky se animan; en móvil degradan a fade.
6. **Reduced-motion:** con `prefers-reduced-motion: reduce` no hay animaciones de movimiento.
7. **Carrusel:** scroll-snap funciona con touch y trackpad; indicadores correctos.
8. **Skills:** expandir/revelar funciona con hover, tap y teclado; sin niveles visibles.
9. **PDF & enlaces:** descarga de CV y LinkedIn/email funcionan.
10. **Móvil:** en viewport móvil, layout fluido, menú hamburguesa OK, 60fps subjetivo.

---

## Fuera de alcance (YAGNI)

- No se añaden frameworks, build step ni dependencias.
- No se rehace contenido textual de experiencia/educación (solo restyling + claves nuevas donde aplica).
- No se añade backend ni formulario de contacto con envío.
- No se evalúan/califican niveles de skill.
