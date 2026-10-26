import {
  about,
  contact,
  education,
  experience,
  now,
  projects,
  skills,
} from "@/lib/content";
import { skillDetails } from "@/lib/skillDetails";
import styles from "./MobilePage.module.css";

// Phones only (hidden above 640px). The desktop site is five routes you fly
// between; a phone can't fly, so everything lives on one scrolling document
// here — same content, same source of truth (lib/content.js), read top to
// bottom instead of navigated.

// Research is its own section; everything else is the general track.
const isResearch = (role) => /research/i.test(role.role);
const research = experience.filter(isResearch).reverse();
const general = experience.filter((r) => !isResearch(r)).reverse();

// The ones worth leading with on a phone, in the order they should read.
const FEATURED = ["SceneSafe", "Fusion Bench", "WikiPatrol"];
const featured = FEATURED.map((name) =>
  projects.find((p) => p.name === name)
).filter(Boolean);

// Group the skill grid by what each tool is for, using the categories already
// recorded in skillDetails. Anything without a category falls into tooling.
const GROUPS = [
  { title: "Languages", categories: ["Language"] },
  { title: "Frameworks & Libraries", categories: ["Framework", "Runtime", "Library"] },
  { title: "AI & Data", categories: ["AI/ML", "Database"] },
  {
    title: "Cloud & Tooling",
    categories: ["Cloud", "Platform", "Deployment", "Tool", "Practice"],
  },
];
const skillGroups = GROUPS.map((g) => ({
  title: g.title,
  items: skills
    .map((s) => s.name)
    .filter((name) => {
      const category = skillDetails[name]?.category;
      if (!category) return g.title === "Cloud & Tooling";
      return g.categories.includes(category);
    }),
})).filter((g) => g.items.length > 0);

function Section({ index, title, children }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>
        <span className={styles.headingNum} aria-hidden="true">
          {String(index).padStart(2, "0")}.
        </span>
        <span className={styles.headingText}>{title}</span>
        <span className={styles.headingRule} aria-hidden="true" />
      </h2>
      {children}
    </section>
  );
}

function Role({ role }) {
  return (
    <li className={styles.role}>
      <div className={styles.roleTop}>
        <h3 className={styles.roleName}>{role.role}</h3>
        <span className={styles.rolePeriod}>{role.period}</span>
      </div>
      <p className={styles.roleCompany}>{role.company}</p>
      <p className={styles.line}>{role.bullets[0]}</p>
    </li>
  );
}

export default function MobilePage() {
  return (
    <div className={styles.page}>
      <Section index={1} title="Featured Work">
        <ol className={styles.cards}>
          {featured.map((p) => (
            <li className={styles.card} key={p.name}>
              <div className={styles.cardTop}>
                <h3 className={styles.cardName}>{p.name}</h3>
                <span className={styles.cardPeriod}>{p.period}</span>
              </div>
              <p className={styles.cardLead}>{p.bullets[0]}</p>
              {p.note && <p className={styles.cardNote}>{p.note}</p>}
              <ul className={styles.tags}>
                {p.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              {p.links && (
                <div className={styles.cardLinks}>
                  {p.links.github && (
                    <a href={p.links.github} target="_blank" rel="noreferrer">
                      GitHub ↗
                    </a>
                  )}
                  {p.links.live && (
                    <a href={p.links.live} target="_blank" rel="noreferrer">
                      Live ↗
                    </a>
                  )}
                  {p.links.pypi && (
                    <a href={p.links.pypi} target="_blank" rel="noreferrer">
                      PyPI ↗
                    </a>
                  )}
                </div>
              )}
            </li>
          ))}
        </ol>
      </Section>

      <Section index={2} title="Experience">
        <ol className={styles.roles}>
          {general.map((r) => (
            <Role key={`${r.company}-${r.role}`} role={r} />
          ))}
        </ol>
      </Section>

      <Section index={3} title="Research">
        <ol className={styles.roles}>
          {research.map((r) => (
            <Role key={`${r.company}-${r.role}`} role={r} />
          ))}
        </ol>
      </Section>

      <Section index={4} title="Skills">
        <div className={styles.skillGroups}>
          {skillGroups.map((g) => (
            <div className={styles.skillGroup} key={g.title}>
              <h3 className={styles.skillTitle}>{g.title}</h3>
              <ul className={styles.chips}>
                {g.items.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section index={5} title="About">
        {education.map((e) => (
          <p className={styles.edu} key={e.degree}>
            <strong>{e.degree}</strong>, {e.school} · {e.period}
          </p>
        ))}
        <ul className={styles.hobbies}>
          {about.hobbies.map((h) => (
            <li key={h.label}>
              <span aria-hidden="true">{h.icon}</span> {h.label}
            </li>
          ))}
        </ul>
      </Section>

      <Section index={6} title="Now">
        <ul className={styles.nowList}>
          {now.items.map((item) => (
            <li key={item.title}>
              <span className={styles.nowTitle}>{item.title}</span>
              {item.summary && (
                <span className={styles.nowSummary}>{item.summary}</span>
              )}
            </li>
          ))}
        </ul>
      </Section>

      <Section index={7} title="Contact">
        <ul className={styles.contact}>
          {contact.map((c) => (
            <li key={c.label}>
              <span className={styles.contactLabel}>{c.label}</span>
              <a href={c.href}>{c.value}</a>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
