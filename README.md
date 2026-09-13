# Richa Rani — Portfolio Website
### "Cinderella: From Code to Magic"

A personal portfolio for Richa Rani, B.Tech CSE student and Web Developer. Built as an original Cinderella-inspired editorial dark luxury experience.

---

## Design Concept

The site interprets the Cinderella theme through an **original visual language** — not Disney, not costumes. Think:

- **Midnight palace architecture** — delicate SVG arch silhouettes
- **Moonlight typography** — editorial Cormorant Garamond display typeface
- **Crystal palette** — near-black midnight navy, pale moonlight blue, warm champagne accents
- **Transformation motion** — graceful scroll reveals, subtle starfield, elegant transitions

The metaphor maps naturally to the developer journey: *before midnight* (the work), *transformation* (the craft), *the journey continues* (seeking opportunities).

---

## Stack

| Layer | Choice |
|---|---|
| Structure | Plain HTML5 (semantic) |
| Styling | Vanilla CSS with custom properties / design tokens |
| Scripting | Vanilla JS (no dependencies) |
| Fonts | Google Fonts: Cormorant Garamond + Inter |
| Build | No build step — open `index.html` directly |

---

## File Structure

```
Cinderella-Portfolio/
├── index.html                 — Main entry point (single-page)
├── css/
│   ├── tokens.css             — Design tokens (palette, spacing, typography, animation)
│   ├── reset.css              — Normalize / reset
│   └── main.css               — All section styles, components, responsive
├── js/
│   ├── particles.js           — Starfield canvas particle system
│   └── animations.js          — Scroll reveals, navigation, interactions
├── assets/
│   ├── svgs/
│   │   ├── palace-arch.svg    — Hero architectural decoration
│   │   └── ornament-divider.svg — Section filigree dividers
│   └── RICHA RANI resume.pdf  — Linked for direct download
└── RICHA RANI resume.pdf      — Original resume (source of truth)
```

---

## Sections

| # | Section | Theme Label |
|---|---|---|
| 1 | Hero | The Invitation |
| 2 | About | Behind the Glass |
| 3 | Skills | The Enchanted Toolkit |
| 4 | Experience | The Journey |
| 5 | Projects | Crafted Transformations |
| 6 | Education | The Foundation |
| 7 | Certification | A Milestone |
| 8 | Contact | Before Midnight |

---

## Personalisation TODO

Before publishing, fill in the following:

```html
<!-- In index.html, find elements with data-social attribute: -->
<a href="https://github.com/richarani02" data-social="github" ...>  →  Replace # with your GitHub URL
<a href="https://www.linkedin.com/in/richa-rani-957627429?utm_source=share_via&utm_content=profile&utm_medium=member_android" data-social="linkedin" ...>  →  Replace # with your LinkedIn URL
```

---

## Opening Locally

Simply open `index.html` in any modern browser. No server or build step required.

```bash
# Option A — double-click index.html
# Option B — use VS Code Live Server extension
# Option C — Python simple server
python -m http.server 8000
# then open http://localhost:8000
```

---

## Accessibility

- Semantic HTML5 landmarks and roles
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus-visible indicators
- `prefers-reduced-motion` respected — all animations disabled on request
- Decorative SVGs marked `aria-hidden` and `role="presentation"`
- Contrast ratios meet WCAG AA

---

## Browser Support

Modern browsers (Chrome, Firefox, Safari, Edge). The site uses:
- CSS custom properties (no IE11 support needed)
- `backdrop-filter` (graceful degradation — nav still readable)
- IntersectionObserver (graceful — elements visible if not supported)
- Canvas API (starfield degrades gracefully if canvas unavailable)

---

*All portfolio content sourced exclusively from the resume. No content is invented.*
