# CLAUDE.md — CV Portfolio de Luis Benavides

Documentación del proyecto para Claude Code. Referencia rápida de arquitectura, convenciones y flujo de trabajo.

---

## Descripción del proyecto

Sitio web de portafolio profesional para **Luis Carlos Benavides Fiallo**, Senior Product Manager con 10+ años de experiencia. Es una SPA (Single Page Application) completamente en vanilla (sin frameworks ni dependencias externas), enfocada en el mercado laboral de Estados Unidos.

**URL de la rama principal:** `main`  
**Rama activa:** `feature/v1.0.0`

---

## Estructura de archivos

```
CV Portfolio/
├── index.html          ← SPA principal (758 líneas)
├── styles/
│   └── style.css       ← Sistema de diseño completo (~38KB)
├── js/
│   └── main.js         ← Toda la interactividad (~33KB)
├── assets/
│   ├── ArriveLogistics/
│   ├── Better Trucks/
│   ├── Brinks/
│   ├── Veriddica-Intexus/
│   ├── CV Luis benavides AI PM 2026.pdf
│   ├── favicon.svg
│   └── foto Luis benavides.jpg
├── CLAUDE.md           ← Este archivo
├── SesionAnt.md        ← Historial de sesiones y pendientes
├── memory.md           ← Aprendizajes técnicos y decisiones
├── README.md
└── Instructions.md     ← Requisitos originales (español)
```

---

## Stack tecnológico

- **HTML5** — Semántico, atributos `data-i18n` para traducciones
- **CSS3** — Custom Properties, Flexbox, Grid, animaciones con @keyframes, clamp() para tipografía fluida, mobile-first
- **JavaScript ES6+** — Vanilla, IntersectionObserver, requestAnimationFrame, localStorage
- **Sin dependencias externas** — No npm, no build step, funciona directo en el navegador

---

## Secciones del sitio

| ID Sección | Contenido |
|------------|-----------|
| `#hero` | Nombre, título, métricas animadas, CTAs |
| `#ai` | Sección AI-Driven PM: statement de filosofía + grid de 6 herramientas/tecnologías IA |
| `#metrics` | 5 KPIs animados (revenue, delivery rate, etc.) |
| `#about` | Bio, foto, 4 highlight cards |
| `#experience` | 5 roles en timeline (2012–presente) |
| `#case-studies` | 4 productos con galería de fotos |
| `#skills` | Grid interactivo de 6 categorías de habilidades (expand on hover/tap, sin niveles) |
| `#education` | 8 tarjetas (MBA, B.S., 6 certificaciones) |
| `#contact` | Email, LinkedIn, descarga del CV |

---

## Módulos de main.js

| Módulo | Líneas aprox. | Función |
|--------|--------------|---------|
| DOM References | 9–16 | Cache de elementos para performance |
| Sticky Nav | 18–26 | Sombra al hacer scroll |
| Mobile Menu | 29–59 | Hamburguesa → X, cierre en click |
| Active Nav Link | 62–77 | IntersectionObserver para resaltar sección activa |
| Scroll Fade-in | 80–106 | Animación escalonada de entrada |
| Counter Animation | 109–143 | requestAnimationFrame para métricas animadas |
| Smooth Scroll | 146–158 | Scroll suave a anchors con offset del nav |
| Timeline Entrance | 161–180 | Stagger específico para items del timeline |
| Dark Mode | 183–203 | Toggle `.dark`, persiste en localStorage |
| Language Toggle | 206–800+ | 200+ claves EN/ES, aplica traducciones al DOM |

---

## Sistema de diseño (CSS Custom Properties)

```css
/* Colores principales */
--clr-dark: #0b1628       /* Fondos hero/contact */
--clr-primary: #2563eb    /* CTAs, acentos, links */
--clr-accent: #06b6d4     /* Highlights, contadores */

/* Tipografía */
--font-sans: System stack (SF, Segoe UI, Roboto)

/* Espaciado */
--section-pad: 5rem
--container-max: 1160px
--nav-h: 68px
```

---

## Internacionalización (EN/ES)

- Los elementos con `data-i18n="clave"` son actualizados por `applyTranslations(lang)` en main.js
- Los elementos con `data-i18n-html="clave"` reciben innerHTML (contenido con HTML embebido)
- Preferencia de idioma persiste en `localStorage`
- Hay más de 200 claves de traducción organizadas por sección

**Prefijos de claves:**
`nav`, `hero`, `ai`, `mb`, `about`, `exp`, `bt`, `al`, `vi`, `bp`, `ba`, `cs`, `cs.ai`, `sk`, `sk.cat`, `edu`, `con`, `ft`, `gallery`

---

## Convenciones de código

- **Sin frameworks, sin dependencias** — Mantener todo vanilla JS/CSS
- **CSS Custom Properties** — Usar variables existentes, no hardcodear colores/tamaños
- **Mobile-first** — Estilos base para móvil, luego media queries para desktop
- **Traducciones obligatorias** — Cualquier texto visible debe tener su clave EN y ES en `translations` en main.js
- **Sin comentarios innecesarios** — Solo comentar el "por qué", no el "qué"
- **Accesibilidad** — Mantener atributos `aria-*` y semántica HTML5

---

## Assets de fotos (galerías)

Cada carpeta en `assets/` corresponde a una empresa en la sección Experience/Case Studies:

| Carpeta | Empresa | Sección |
|---------|---------|---------|
| `Better Trucks/` | CodeRoad/Better Trucks | Experience + Case Study |
| `ArriveLogistics/` | TEAM/Arrive Logistics | Experience + Case Study |
| `Veriddica-Intexus/` | Veriddica/Intexus | Experience + Case Study |
| `Brinks/` | Brinks Colombia | Experience |

---

## Archivos de sesión y memoria

| Archivo | Propósito |
|---------|-----------|
| [SesionAnt.md](SesionAnt.md) | Resumen de la sesión anterior y pendientes para la próxima |
| [memory.md](memory.md) | Aprendizajes técnicos, decisiones de diseño y patrones descubiertos |

**Flujo de trabajo sugerido:**
1. Al iniciar una sesión, leer `SesionAnt.md` para retomar contexto
2. Al terminar, actualizar `SesionAnt.md` con lo hecho y los pendientes
3. Guardar aprendizajes técnicos no obvios en `memory.md`
