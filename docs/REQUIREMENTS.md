# Personal Portfolio Website — Requirements

## 1. Overview
A single-page, scroll-driven personal portfolio / resume site. Visitor scrolls top
to bottom through: intro → work experience → projects → skills → education → resume
download. Visual mood is a dim, "dystopian" night sky with a northern-lights (aurora)
background whose colors flow seamlessly between teal, blue, and purple.

## 2. Tech stack & deployment
- **Framework:** Next.js (React). Chosen because it deploys to Vercel with zero config,
  is React under the hood, and gives serverless API routes if a backend is ever needed.
- **3D:** three.js, used via **react-three-fiber** (`@react-three/fiber`) + `@react-three/drei`
  for the interactive skill orbs. (The chat previews used raw three.js because the preview
  sandbox lacks r3f; the real build should use r3f.)
- **Hosting:** Vercel (push to GitHub → auto-deploy).
- **No standalone Node server** unless a long-running/stateful backend is genuinely needed
  (websockets, background jobs). For a portfolio, none is required.

## 3. Information architecture (section order)
1. Intro / hero
2. Work experience (timeline)
3. Projects
4. Skills / frameworks / languages (3D orbs)
5. Education
6. Resume download
Plus: fixed top nav with anchor links to each section, and a footer.

## 4. Section-by-section requirements

### 4.1 Hero
- Large name, role/title, one-line tagline, and a small location/eyebrow line.
- Name uses the **mixed-font treatment** (see §8).
- A "scroll" cue at the bottom.
- The aurora must be clearly visible *behind the hero* (this was the main miss earlier —
  the lights belong in the upper sky, not below the fold).

### 4.2 Work experience — timeline
- Rendered as a vertical timeline (a connecting line with a node per entry).
- Each entry: role, company, time period, short description.

### 4.3 Projects
- Vertical list of project cards. Each card: name, description below the name, optional image,
  and a row of tech tags.
- Images live in an `images/` directory (`public/images/` in Next.js). Cards should show a
  graceful placeholder if the image is missing.

### 4.4 Skills / frameworks / languages — 3D orbs
- Each skill is a 3D orb displaying its **symbol** (e.g. "JS", "TS", "⚛").
- **Hovering** an orb shows a tooltip with the full language/framework name, and visually
  emphasizes the orb (scale up / brighten).
- Note: orbs currently show text symbols, not official brand logos (the preview can't load
  external logo files). For the real build you can swap in actual logo image textures.

### 4.5 Education
- One or more entries: degree, school, time period, optional detail line.

### 4.6 Resume download
- A clear "Download résumé" button (also linked in the nav).
- Links to `/resume.pdf` — i.e. place `resume.pdf` in `public/`.

## 5. Visual design system

### 5.1 Palette
- Void / background: `#04050b`
- Teal: `#14b8a6`
- Blue: `#3b5bdb`
- Purple: `#7c3aed`
- Green (aurora accent, optional): `~#1ad68c`
- Text bright: `#eef3ff` · text body: `#c9d2e3` · text dim: `#6c7589`
- Hairline/border: `rgba(120,140,190,0.14)`

### 5.2 Typography
- Display: Space Grotesk
- Mono / labels / eyebrows / data: Space Mono
- Mixed-font hero uses additionally: Playfair Display (italic serif), Syne (display),
  Bree Serif (slab).
- Eyebrow labels are small, uppercase, letter-spaced mono (e.g. `// experience`).

### 5.3 Mood & motion
- Dim and desaturated overall; darkness dominates so it reads dystopian, not neon.
- Subtle scroll-reveal (fade + slight rise) on sections.
- All motion must respect `prefers-reduced-motion`.

## 6. Aurora background spec
- Fixed, full-viewport, sits behind all content.
- **Must be visible behind the hero** and across the upper sky.
- Colors flow **seamlessly** through teal → blue → purple (green optional) with no hard jumps.
- Recommended reliable approach: layered, heavily-blurred gradient "bands" (one per color)
  whose opacities crossfade out of phase, plus gentle transform drift, plus a faint star layer.
  (A WebGL shader version is possible but is what silently failed earlier — CSS is safer.)
- Faint stars in the upper portion of the sky.
- Soft vignette to darken edges for text legibility.

## 7. 3D skill orbs spec (technical)
- One scene; each skill = a group containing: a glowing sphere, a faint wireframe shell,
  and a sprite (always faces camera) carrying the symbol texture.
- Raycaster on pointer move detects the hovered orb → updates an HTML tooltip that follows
  the cursor and shows the full name.
- Responsive grid layout (fewer columns on narrow screens); camera distance auto-fits the grid.
- Idle animation: gentle bob/rotation.

## 8. Mixed-font hero name ("Apple-style")
- The name is split per character; each letter cycles through a set of typefaces
  (serif italic → sans → mono → display → slab → repeat).
- Letters share one color and consistent size so it reads as intentional, not chaotic.
- Spaces preserved.
- **Open option:** letters could instead be tinted in different palette colors (teal/blue/
  purple) if a more obvious effect is wanted.

## 9. Content & assets you provide
- Real name, role, tagline, location.
- Experience entries (role, company, period, description).
- Project entries (name, description, image filename, tags).
- Skill list (name + short symbol).
- Education entries (degree, school, period, detail).
- `public/images/*` for project images.
- `public/resume.pdf` for the download button.

## 10. Quality bar
- Fully responsive down to mobile (timeline, cards, orb grid all adapt).
- Keyboard-accessible nav with visible focus states.
- `prefers-reduced-motion` honored (disable or reduce animations).
- No console errors; background must never render as a blank black screen.

## 11. Open decisions (your call)
- Keep green in the aurora, or restrict to teal/blue/purple only?
- Aurora brightness/spread — subtle vs. dominant.
- Mixed-font name: single color (current) vs. multi-color letters.
- Skill orbs: text symbols (current) vs. real brand logo textures.
- Bring back drifting background orbs *over* the aurora, or aurora alone.
