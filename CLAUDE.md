# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TOEFL Online — a landing page for the "Full Bright" TOEFL preparation service targeting Indonesian students. The frontend is a React 19 + TypeScript SPA styled with Tailwind CSS v4. There is no backend yet; all CTAs link to WhatsApp (`wa.me/...`) or anchor scroll targets.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS v4 (CSS-first, no config file) |
| Icons | lucide-react |
| Fonts | @fontsource/nunito (headings), @fontsource/inter (body) — self-hosted |
| Analytics | Facebook Pixel (`fbq`) — declared globally, called in PricingSection |

## Common Commands

```bash
cd frontend
npm install
npm run dev          # Vite dev server at :5173
npm run build        # tsc -b && vite build
npm run lint         # ESLint
npm run preview      # preview production build
```

There is no standalone `typecheck` script — type errors surface via `npm run build` (which runs `tsc -b` first).

## Architecture

`App.tsx` renders sections in a fixed order via a flat list of imports — no router. All navigation is anchor-based (`href="#pricing"`, `href="#testimonials"`).

**Section render order:**
`UrgencyBanner → Navbar → HeroSection → AgitationSection → ValueSection → MediaCoverageSection → SocialProofSection → PricingSection → FAQSection → Footer`

### UI primitives (`src/components/ui/`)

- **`Button`** — variants: `primary` (red CTA), `secondary` (dark), `outline`, `ghost`, `whatsapp` (green). Renders `<a>` when `href` is provided, `<button>` otherwise. Accepts `fullWidth` and `size` (`sm`/`md`/`lg`).
- **`SectionWrapper`** — wraps every section with consistent `max-w-6xl mx-auto` container and `bg` prop (`white`/`cultured`/`dark`). Always use this for new sections.
- **`SocialProofMicro`** — reusable star + alumni-count + guarantee strip. Used under CTAs and at card bottoms.

### Styling approach

Tailwind utility classes are combined with inline `style` props throughout. Tokens from `tokens.css` are referenced via CSS custom properties (e.g. `style={{ color: 'var(--color-cta)' }}`). Prefer the named token values over raw hex when they match:

| Token | Value |
|-------|-------|
| `--color-cta` | `#D70808` (primary red) |
| `--color-text` | `#151515` |
| `--color-body` | `#3d3d3d` |
| `--color-cultured` | `#F3F3F3` |
| `--font-heading` | Nunito |
| `--font-body` | Inter |

### Animations

Two global animation utilities are defined in `tokens.css`:
- `.infinite-track` — horizontal auto-scroll (used in testimonial carousel), pauses on hover
- `.stagger-wrap` / `.stagger-wrap.revealed` — scroll-reveal with per-child delay. Add the `revealed` class via IntersectionObserver.

### Public assets

Static images are served from the `public/` directory and referenced with root-relative paths (e.g. `/image/toefl10.jpeg`). Do not import images from `src/assets/` for content images.

### Facebook Pixel

`fbq` is declared as a global in `PricingSection.tsx` via `declare function fbq(...)`. Call it inside try/catch since it may not be loaded. See `trackAddToCart()` in that file for the pattern.

### WhatsApp CTAs

The WhatsApp number in CTA links (`wa.me/6281234567890`) is a placeholder and should be updated to the real number before going live. Search for `wa.me` to find all instances.

## Key Conventions

- Component files: `PascalCase.tsx`; section components in `sections/`, reusable primitives in `ui/`
- New sections must use `SectionWrapper` — never add raw `max-w-*` container wrappers inline
- Animate only `transform` and `opacity` — never layout-bound properties
- Semantic HTML (`<section>`, `<header>`, `<footer>`) before `<div>` wrappers
- No React Router — keep all navigation as anchor links
