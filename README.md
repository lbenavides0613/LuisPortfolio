# Luis Carlos Benavides Fiallo — Portfolio Website

Personal portfolio website for a Senior Product Manager targeting the US market. Built with vanilla HTML5, CSS3, and JavaScript — no frameworks, no dependencies.

## Live Structure

```
CV Portfolio/
├── index.html          # Main page (single-page application)
├── styles/
│   └── style.css       # Full design system & responsive layout
├── js/
│   └── main.js         # Interactivity & scroll animations
├── assets/             # Images, icons (add as needed)
└── Profile.pdf         # Resume (linked for download in Contact section)
```

## Sections

| Section | Description |
|---|---|
| **Hero** | Name, title, "Open to US" badge, animated metric cards, CTA buttons |
| **Impact Bar** | 5 animated KPI counters: productivity, profitability, revenue, cost reduction, profit/load |
| **About** | Professional summary + 4 core strength pillars |
| **Experience** | Timeline with 4 roles: CodeRoad/Better Trucks, TEAM/Arrive Logistics, IntexusLa, Brinks |
| **Case Studies** | 4 product cards with real impact metrics |
| **Skills** | 6 grouped tag clouds: Strategy, Methodologies, Tools, Data, Industries, Leadership |
| **Education** | MBA (Tec de Monterrey), B.S. (UNAL), courses & certifications |
| **Contact** | Email, LinkedIn, and resume download links |

## Tech Stack

- **HTML5** — Semantic markup (`<section>`, `<article>`, `<nav>`, `<main>`)
- **CSS3** — Custom properties, Flexbox, Grid, `@keyframes`, `clamp()`, mobile-first media queries
- **JavaScript (ES6+)** — `IntersectionObserver`, `requestAnimationFrame`, no libraries

## Features

- Animated number counters triggered on scroll entry
- Fade-in entrance animations with staggered siblings
- Sticky frosted-glass nav with active link tracking
- Mobile hamburger menu with CSS transform animation
- Smooth scroll to sections
- Fully responsive: desktop → tablet → mobile → small mobile

## Design Tokens

| Token | Value | Usage |
|---|---|---|
| `--clr-dark` | `#0b1628` | Hero, Contact backgrounds |
| `--clr-primary` | `#2563eb` | Accent color, CTAs, links |
| `--clr-accent` | `#06b6d4` | Highlights, counters, badge |
| `--font-sans` | System stack | All body text |
| `--container-max` | `1160px` | Max content width |

## Getting Started

No build step required. Open `index.html` directly in any modern browser.

```bash
# Optional: serve locally with any static server
npx serve .
# or
python -m http.server 8080
```

## Customization

- **Content** — Edit text directly in `index.html`
- **Colors** — Change CSS custom properties in the `:root` block at the top of `style.css`
- **Resume** — Replace `Profile.pdf` at the root (filename is referenced in the Contact section download link)
- **Profile photo** — Add image to `/assets/` and insert an `<img>` tag in the Hero section

## Browser Support

All modern browsers (Chrome, Firefox, Safari, Edge). Uses standard CSS and Web APIs — no polyfills needed.
