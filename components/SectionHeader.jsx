import Reveal from "./Reveal";

// Shared eyebrow + title header, matching the pattern used across sections.
// Kept as its own component so new sections stay consistent with the old ones.
export default function SectionHeader({ eyebrow, title }) {
  return (
    <Reveal>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="section-title">{title}</h2>
    </Reveal>
  );
}
