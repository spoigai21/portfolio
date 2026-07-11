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
//                    Library, Tool, Platform, Deployment, AI/ML
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
  Git: {
    category: "Tool",
    proficiency: 88,
    deployedIn: "Every project",
    relationship: "Version control underneath everything I build.",
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
