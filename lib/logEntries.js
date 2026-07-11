// ============================ EDIT ME ============================
// Ambient "captain's log" lines for the Work (/projects) page. Each array item
// corresponds 1:1 (same order) to an entry in `experience` / `projects` in
// lib/content.js, and drives the log header + the margin log column as the user
// scrolls through the timeline / carousel.
//
// Fields per entry:
//   code     — the "ENTRY nn" number shown in the log (e.g. "03").
//   stardate — the timestamp shown in the left column (any format).   ← EDIT
//   label    — short SCREAMING name of the entry.                     ← EDIT
//   line     — one short line narrating that entry (kept unreadably    ← EDIT
//              dim in the UI; make it flavourful, terminal-style).
//
// Keep the counts matching content.js (experience: 4, projects: 4). If they ever
// drift, the UI falls back gracefully.
// =================================================================

export const logEntries = {
  // order matches `experience` in content.js
  experience: [
    {
      code: "01",
      stardate: "78210.4",
      label: "SCU // TEACHING",
      line: "C++ MENTOR // 40+ STUDENTS // GDB LIVE DEBUG",
    },
    {
      code: "02",
      stardate: "78288.1",
      label: "ML RESEARCH",
      line: "BERTOPIC ONLINE // 5000+ POSTS SCANNED",
    },
    {
      code: "03",
      stardate: "78412.6",
      label: "ADORUS",
      line: "FULL-STACK BUILD // AWS DEPLOY",
    },
    {
      code: "04",
      stardate: "78455.9",
      label: "HERBSPRO",
      line: "AI BACKEND // E-COMMERCE STACK",
    },
  ],

  // order matches `projects` in content.js
  projects: [
    {
      code: "01",
      stardate: "78190.2",
      label: "KUHN QUANTUM",
      line: "6-QUBIT VQC // ibm_fez / 4096 SHOTS",
    },
    {
      code: "02",
      stardate: "78233.7",
      label: "DISEASE TRACKER",
      line: "AWS BEDROCK // DYNAMODB INGEST",
    },
    {
      code: "03",
      stardate: "78301.5",
      label: "AGENTIC RAG",
      line: "OLLAMA + CHROMADB // MCP TOOLS",
    },
    {
      code: "04",
      stardate: "78320.8",
      label: "SOCIAL NETWORK",
      line: "C++ / QT // BFS FRIEND GRAPH",
    },
  ],
};
