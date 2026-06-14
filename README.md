# Shayan Poigai — Portfolio

A single-page, scroll-driven portfolio built with **Next.js (App Router)**, **react-three-fiber**
3D skill orbs, and a CSS aurora night-sky background. Built to the spec in
[`docs/REQUIREMENTS.md`](docs/REQUIREMENTS.md).

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build && npm start   # production build
```

## Deploy

Push to GitHub and import the repo on **Vercel** — zero config. Next.js is detected
automatically.

## Project structure

```
app/
  layout.jsx        # fonts (Space Grotesk/Mono, Playfair, Syne, Bree Serif) + metadata
  page.jsx          # assembles all sections
  globals.css       # palette, layout primitives, scroll-reveal, reduced-motion
components/
  Aurora.jsx        # fixed CSS aurora (blurred gradient bands + stars + vignette)
  Nav.jsx           # fixed top nav with anchor links + mobile menu
  Hero.jsx          # hero with mixed-font name + scroll cue
  MixedFontName.jsx # per-letter font cycling
  Experience.jsx    # vertical timeline
  Projects.jsx      # project cards w/ graceful image fallback
  Skills.jsx        # loads the 3D scene (client-only)
  SkillOrbs.jsx     # react-three-fiber orbs: glow sphere + wireframe + billboard symbol
  Education.jsx     # education + résumé download CTA
  Footer.jsx
lib/content.js      # ALL site content — edit here
public/
  images/           # project images (see below)
  resume.pdf        # downloadable résumé
```

## Editing content

Everything (profile, experience, projects, skills, education) lives in
[`lib/content.js`](lib/content.js). No component edits needed for copy changes.

### Project images

Drop files in `public/images/` matching the `image` paths in `lib/content.js`
(e.g. `public/images/kuhn-poker.jpg`). Missing images fall back to a styled
placeholder automatically — nothing breaks.

### Résumé

`public/resume.pdf` is generated from `docs/Shayan'sFullResume.txt`. Replace it
with your designed PDF anytime.

## Notes on design decisions (the "open decisions" in the spec)

- **Green kept** as a subtle 4th aurora accent.
- **Aurora**: visible behind the hero, tuned subtle (darkness dominates).
- **Mixed-font name**: single color for an intentional, not chaotic, look.
- **Skill orbs**: text symbols (swap in logo textures later if desired).
- **Background**: aurora alone, no extra drifting orbs.

All motion respects `prefers-reduced-motion`.
