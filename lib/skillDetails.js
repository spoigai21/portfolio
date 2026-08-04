// ============================ EDIT ME ============================
// Per-skill "scanner readout" shown in the Skills-page side panel on hover.
// Keys MUST match `skills[].name` in lib/content.js exactly.
//
// Fields:
//   • deployedIn  — projects you used it in. Shown in the panel as "USED IN".
//                   Keep it to project names; don't spell out which part —
//                   EXCEPT AWS, where naming the services is fine.        ← EDIT
//   • relationship — one plain line on your relationship with the tool.   ← EDIT
//   • category     — one of: Language, Framework, Runtime, Cloud, Database,
//                    Library, Tool, Platform, Deployment, AI/ML, Concept,
//                    Practice
//   • proficiency  — 0..100. NOTE: the "Lock Strength" bar was removed, so this
//                    isn't shown right now. New skills below use placeholder
//                    values — set them if/when you re-enable the bar.     ← EDIT
// =================================================================

export const skillDetails = {
  "C++": {
    category: "Language",
    proficiency: 90,
    deployedIn: "Social Network, CS Teaching",
    relationship: "Where I learned to really program — memory, pointers, OOP.",
  },
  Python: {
    category: "Language",
    proficiency: 88,
    deployedIn: "Restaurant RAG Pipeline, ML Research, Disease Tracker",
    relationship: "My default for AI/ML work and quick tooling.",
  },
  Java: {
    category: "Language",
    proficiency: 78,
    deployedIn: "Adorus",
    relationship: "Backend services language for the Adorus storefront.",
  },
  "React.js": {
    category: "Framework",
    proficiency: 85,
    deployedIn: "Adorus, Disease Tracker, Kuhn Poker",
    relationship: "Primary frontend framework across my projects.",
  },
  "Node.js": {
    category: "Runtime",
    proficiency: 80,
    deployedIn: "Adorus",
    relationship: "Runtime powering the Adorus frontend/back-of-house.",
  },
  FastAPI: {
    category: "Framework",
    proficiency: 85,
    deployedIn: "Kuhn Poker, Disease Tracker, Restaurant RAG Pipeline",
    relationship: "Go-to Python framework for building REST APIs.",
  },
  "Spring Boot": {
    category: "Framework",
    proficiency: 72,
    deployedIn: "Adorus",
    relationship: "Java service layer behind the storefront.",
  },
  AWS: {
    category: "Cloud",
    proficiency: 75,
    deployedIn:
      "Adorus (EC2, S3, CloudFront), Disease Tracker (Bedrock, DynamoDB), HerbsPro Internship",
    relationship: "Where everything I ship actually runs.",
  },
  Docker: {
    category: "Tool",
    proficiency: 64,
    deployedIn: "Adorus",
    relationship: "Containerizing services for deploy. // still leveling up",
  },
  PostgreSQL: {
    category: "Database",
    proficiency: 76,
    deployedIn: "Adorus",
    relationship: "Relational store behind the Adorus data model.",
  },
  Matplotlib: {
    category: "Library",
    proficiency: 70,
    deployedIn: "ML Research",
    relationship: "Plotting and EDA during research work.",
  },
  Linux: {
    category: "Platform",
    proficiency: 74,
    deployedIn: "Daily development",
    relationship: "Where I develop and deploy day to day.",
  },
  Qt: {
    category: "Framework",
    proficiency: 68,
    deployedIn: "Social Network",
    relationship: "C++ desktop GUI framework for the MVC social app.",
  },
  Pandas: {
    category: "Library",
    proficiency: 80,
    deployedIn: "ML Research",
    relationship: "Data wrangling for research and pipelines.",
  },

  // ---- newly added orbs — proficiency values are PLACEHOLDERS ← EDIT ----
  NumPy: {
    category: "AI/ML",
    proficiency: 50, // ← EDIT (placeholder)
    deployedIn: "ML Research (Santa Clara University)",
    relationship: "Numerical arrays underpinning research and ML work.",
  },
  Vercel: {
    category: "Deployment",
    proficiency: 50, // ← EDIT (placeholder)
    deployedIn: "Kuhn Poker vs Quantum, Portfolio",
    relationship: "Deploying frontends and this site.",
  },
  MCP: {
    category: "AI/ML",
    proficiency: 50, // ← EDIT (placeholder)
    deployedIn: "Agentic RAG Pipeline (restaurant-rag), HerbsPro Internship",
    relationship: "Exposing local data as tools for AI agents.",
  },
  Ollama: {
    category: "AI/ML",
    proficiency: 50, // ← EDIT (placeholder)
    deployedIn: "Agentic RAG Pipeline (restaurant-rag)",
    relationship: "Running local LLMs.",
  },
  OpenWebUI: {
    category: "AI/ML",
    proficiency: 50, // ← EDIT (placeholder)
    deployedIn: "Agentic RAG Pipeline (restaurant-rag)",
    relationship: "Local interface for chatting with LLMs.",
  },

  // ---- second batch of orbs — proficiency values are PLACEHOLDERS ← EDIT ----
  // A few `deployedIn` lines are best guesses; those are marked below.
  JavaScript: {
    category: "Language",
    proficiency: 50, // ← EDIT (placeholder)
    deployedIn: "Adorus, Disease Tracker, Kuhn Poker, Portfolio",
    relationship: "The language every frontend I ship actually runs on.",
  },
  SQL: {
    category: "Language",
    proficiency: 50, // ← EDIT (placeholder)
    deployedIn: "Adorus, Disease Tracker",
    relationship: "Querying and shaping the relational side of my data.",
  },
  LaTeX: {
    category: "Language",
    proficiency: 50, // ← EDIT (placeholder)
    deployedIn: "ML Research",
    relationship: "Typesetting the HIBIBI paper in Overleaf, tables and all.",
  },
  "CI/CD": {
    category: "Practice",
    proficiency: 50, // ← EDIT (placeholder)
    deployedIn: "Adorus, Portfolio", // ← EDIT (guess)
    relationship: "Automating build, test, and deploy so shipping is boring.",
  },
  Render: {
    category: "Deployment",
    proficiency: 50, // ← EDIT (placeholder)
    deployedIn: "Kuhn Poker vs Quantum",
    relationship: "Hosting the backends my frontends call.",
  },
  DynamoDB: {
    category: "Database",
    proficiency: 50, // ← EDIT (placeholder)
    deployedIn: "Disease Tracker",
    relationship: "Key-value store for fast, schema-light reads.",
  },
  ChromaDB: {
    category: "Database",
    proficiency: 50, // ← EDIT (placeholder)
    deployedIn: "Agentic RAG Pipeline (restaurant-rag)",
    relationship: "Vector store holding the embeddings a RAG pipeline retrieves.",
  },
  Hotjar: {
    category: "Tool",
    proficiency: 50, // ← EDIT (placeholder)
    deployedIn: "HerbsPro Internship", // ← EDIT (guess)
    relationship: "Watching how people actually move through a page.",
  },
  LangChain: {
    category: "AI/ML",
    proficiency: 50, // ← EDIT (placeholder)
    deployedIn: "Agentic RAG Pipeline (restaurant-rag)", // ← EDIT (guess)
    relationship: "Wiring retrievers, models, and tools into one chain.",
  },
  "Topic Modeling": {
    category: "AI/ML",
    proficiency: 50, // ← EDIT (placeholder)
    deployedIn: "ML Research (BERTopic, LDA, NMF)",
    relationship: "Pulling the themes out of a corpus nobody has read yet.",
  },
  Qiskit: {
    category: "Library",
    proficiency: 50, // ← EDIT (placeholder)
    deployedIn: "Kuhn Poker vs Quantum",
    relationship: "Building and running the variational circuits behind the AI.",
  },
  "IBM Quantum": {
    category: "Platform",
    proficiency: 50, // ← EDIT (placeholder)
    deployedIn: "Kuhn Poker vs Quantum",
    relationship: "Where those circuits ran on real hardware (ibm_fez).",
  },
  "Claude Code": {
    category: "Tool",
    proficiency: 50, // ← EDIT (placeholder)
    deployedIn: "Portfolio, Adorus", // ← EDIT (guess)
    relationship: "Agentic pair programming in the terminal.",
  },
};

// Fallback so an unmapped skill still renders a sensible (clearly-editable) card.
export const DEFAULT_SKILL_DETAIL = {
  category: "Tool",
  proficiency: 60,
  deployedIn: "— EDIT: add projects —",
  relationship: "— EDIT: add a one-line description —",
};

export function getSkillDetail(name) {
  return skillDetails[name] || DEFAULT_SKILL_DETAIL;
}
