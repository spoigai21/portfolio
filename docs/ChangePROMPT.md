# Prompt for Claude Code

I need you to restyle my existing Next.js portfolio site. Don't touch the content, section order, or data — only the visuals. Two major changes: replace the current aurora background with a breathing spiral, and rebuild the hero/intro section as a 3D interactive holographic projector scene. The overall mood is dark sci-fi.

---

## 1. Background — Breathing Spiral

Replace the current aurora/northern-lights background with a full-viewport, fixed, animated spiral made of thin glowing lines. Use three.js (via react-three-fiber since this is a Next.js project) or a fullscreen GLSL shader — whichever you're more confident will actually render visually on screen.

### Shape
- A vortex/spiral of many fine lines (not solid — think wireframe curves) radiating from a bright center and sweeping outward in 3–4 spiral arms.
- The lines should be dense near the center and spread apart toward the edges.

### Colors
- Background void: deep indigo `#0c0628`.
- Spiral lines: violet `#5b2a9e` at the outer edges, brightening inward through `#9b30e0` to a hot magenta/pink core `#d633ff`.
- NO rainbow, NO teal, NO green. Strictly indigo → violet → magenta.

### Motion — two simultaneous animations
1. **Rotation:** the entire spiral rotates slowly and continuously (maybe 1 full turn every ~40 seconds).
2. **Breathing (compress / decompress):** the spiral arms periodically tighten toward the center (compress) and then loosen back out (decompress). Smooth sinusoidal motion, roughly a 6–8 second cycle. When compressed the core glows slightly brighter; when expanded it dims.

### Dimming pulse
On top of the breathing, the overall brightness of the purple/violet lines should slowly pulse — fading from full intensity down to maybe 40% intensity and back up, on a ~10 second cycle. This should be slightly out of phase with the breathing so the two effects don't sync up and look mechanical. The result: the spiral feels alive, like it's inhaling and exhaling light.

### Performance
- Render at reduced resolution (0.5×–0.75× device pixels) since the lines are soft/glowing anyway.
- Respect `prefers-reduced-motion`: if set, freeze the spiral in a static mid-state.

---

## 2. Hero Section — 3D Holographic Projector

The intro/hero section (the one showing my name, role, and about-me text) should become a 3D interactive scene using react-three-fiber. The user can click-and-drag (or touch-drag on mobile) to orbit the camera around the scene.

### The projector
- At the bottom of the scene, place a small 3D object that looks like a sci-fi holographic projector — a low, flat cylindrical base (like a hockey-puck shaped device) sitting on a surface. Give it a subtle metallic/dark-chrome look with a faint glowing ring around its top edge in cyan `#4dd0e1`.
- From the top of the projector, a faint conical "beam" of light extends upward (slightly transparent, volumetric-looking — use a cone geometry with a transparent gradient material). The beam color should be a soft white-cyan `rgba(77, 208, 225, 0.08)`.

### The projected name (hologram text)
- My name floats above the projector, inside the beam, as large 3D text (use `@react-three/drei`'s `<Text3D>` or `<Text>` component).
- The text has a **seamless rainbow color shift** — the color rolls across the letters continuously like a slow gradient animation cycling through the spectrum. Not static rainbow — it should flow and move. Use a custom shader material or a time-based uniform that shifts hue across the text's UV coordinates.
- The text should have a subtle holographic flicker — occasionally (randomly, subtly) the opacity dips very slightly for 1–2 frames, like a hologram glitching. Don't overdo it; just a hint.
- Faint horizontal scanlines over the text (a repeating thin-stripe pattern in the material) to sell the hologram look.

### The about-me text
- Below the 3D name (or beside it on wide screens), the role and tagline/about-me text is normal 2D HTML overlaid on the scene — NOT 3D text.
- Color: a soft lavender-white `#efeaff`. Clean, readable, no glow effects on it.
- Font: same as the rest of the site (Space Grotesk / the main display font).

### Camera & interaction
- Default camera angle: slightly above and in front of the projector, looking down at ~20° so you see the base, the beam, and the floating name.
- OrbitControls: user can drag to rotate around the scene. Limit vertical rotation so they can't flip upside down. Enable damping for smooth feel.
- On mobile: touch-drag to orbit.

---

## 3. Global Font Colors (apply site-wide)

Update the CSS variables / design tokens across the whole site:

- **Body text:** `#efeaff` (soft lavender-white) — used for paragraphs, descriptions, timeline text.
- **Headings:** `#f4f0ff` (slightly brighter lavender-white).
- **Accent color (links, timeline nodes, hover states, tags, buttons, nav highlights):** cyan `#4dd0e1`. This is the one pop of contrast against all the purple.
- **Dim/secondary text (dates, labels, footer):** `#8a82a6` (muted lavender-grey).
- **Borders / hairlines:** `rgba(139, 92, 246, 0.18)` (faint violet).
- **Glass card backgrounds:** `rgba(12, 6, 40, 0.6)` with `backdrop-filter: blur(8px)`.
- **Section eyebrow labels** (the `// experience` text): cyan `#4dd0e1`.

Remove any teal `#14b8a6` or green references from the old palette. The only bright colors on the whole site should be violet/purple (from the spiral) and cyan (accent).

---

## 4. Sci-fi details to add everywhere

- **Timeline nodes:** replace the old teal glow with a cyan `#4dd0e1` glow. The connecting line should gradient from cyan at top to violet `#7c3aed` at bottom.
- **Project cards and education cards:** on hover, the border should briefly pulse with a faint violet glow (`box-shadow: 0 0 20px rgba(139, 92, 246, 0.3)`).
- **Skill orbs:** keep the existing 3D orbs but shift their color palette to use violet `#7c3aed`, indigo `#4338ca`, and cyan `#4dd0e1` instead of teal/blue/purple.
- **Resume download button:** border in cyan, with a violet-to-indigo gradient background on hover.
- **Cursor:** if easily done, add a subtle radial glow that follows the mouse (a transparent `pointer-events: none` div, ~200px wide, with a radial gradient of violet at 5% opacity). Optional but adds to the sci-fi feel.

---

## Summary of the vibe

Imagine a dark command center in a sci-fi film. Deep indigo darkness everywhere. A slowly breathing, dimming spiral of violet energy dominates the background. In the hero, a small chrome device projects a shimmering rainbow-hologram of my name into the air, and you can orbit around it. All text is cool lavender-white with cyan accents. Everything feels alive but restrained — the motion is slow and organic, never frantic.
