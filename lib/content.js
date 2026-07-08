// Central content for the portfolio. Edit here to update the site.

export const profile = {
  name: "Shayan Poigai",
  role: "CS @ SCU",
  // Short, human hero statement — the first thing people read. Tweak freely.
  heroStatement:
    "I build AI pipelines, run quantum experiments, and ship products end to end. CS student at Santa Clara, happiest turning a hard systems problem into something people can actually use.",
  tagline:
    "Motivated second-year Computer Science student at Santa Clara University with interests in AI and backend software development. Proficient in Python and C++ with strong problem-solving skills. Seeking a summer internship to gain practical experience and contribute to impactful software engineering projects.",
  location: "Fremont, California",
  email: "spoigai21@gmail.com",
  phone: "510-738-8155",
  links: {
    github: "https://github.com/spoigai21",
    // TODO(shayan): replace with your real LinkedIn profile URL.
    linkedin: "https://www.linkedin.com/in/your-handle",
  },
};

// About section content. Written in a first-person voice — edit anything that
// doesn't sound like you, and fill in the [FILL IN] placeholders.
export const about = {
  lead:
    "I like building the kind of software that has to actually work — where the interesting part isn't the demo, it's everything holding the demo up.",
  paragraphs: [
    "Most of what I do lives at the intersection of AI, backend systems, and things I probably shouldn't be able to get working yet. I've wired language models into agents over MCP, pushed a poker strategy onto real quantum hardware, and stood up full-stack products on AWS — and the throughline is that I'd rather ship something real and debug it than keep it safe on a slide.",
    "I'm genuinely curious about hard systems problems: how to make retrieval trustworthy, how noisy quantum hardware behaves outside a textbook, and where the seams are when you glue models, databases, and users together. I learn fastest when something breaks at 1am and I can't leave it alone.",
  ],
  // Small human details. Replace the [FILL IN] bits with real ones.
  facts: [
    { label: "Currently", value: "CS @ Santa Clara, incoming SWE intern at HerbsPro" },
    { label: "Curious about", value: "AI agents, quantum computing, distributed systems" },
    { label: "Off the clock", value: "[FILL IN — a hobby / interest beyond code, e.g. chess, climbing, cooking]" },
  ],
};

export const experience = [
  {
    role: "Incoming SWE Intern",
    company: "HerbsPro",
    period: "2026",
    description:
      "Joining as backend software engineering intern.",
  },
  {
    role: "Co-Founder",
    company: "Adorus — Jewelry E-commerce Startup",
    period: "May 2026 — Present",
    description:
      "Architecting and building a full-stack jewelry e-commerce platform from the ground up. Responsive frontends in React.js and Node.js, RESTful services in Java Spring Boot with PostgreSQL, deployed on AWS EC2.",
  },
  {
    role: "Machine Learning Research Assistant",
    company: "Santa Clara University",
    period: "December 2025 — June 2026",
    description:
      "Analyzing public sentiment toward LLMs as a therapeutic tool. Scraped 5,000+ posts from Twitter, Reddit, and YouTube and built an NLP pipeline using unsupervised topic modeling (BERTopic, LDA, NMF) with visual analytics in Matplotlib/Seaborn. Paper submitted to IEEE/ACM ASONAM 2026.",
  },
  {
    role: "Theory of Algorithms Grader",
    company: "Santa Clara University",
    period: "March 2026 — June 2026",
    description:
      "Graded assignments for 40+ students across 2 sections, evaluating runtime analysis, divide & conquer, greedy algorithms, and dynamic programming with consistent, structured rubrics.",
  },
  {
    role: "Computer Science Lab Teaching Assistant",
    company: "Santa Clara University",
    period: "September 2025 — March 2026",
    description:
      "Mentored 40+ students in C++ memory management, pointers, and OOP. Debugged complex logic errors live, teaching GDB and systematic testing, and collaborated with faculty to streamline lab delivery.",
  },
];

export const projects = [
  {
    name: "Kuhn Poker vs Quantum",
    description:
      "A poker game where you play against an opponent whose strategy is discovered by a 6-qubit quantum circuit using superposition and entanglement. Full-stack app integrating the IBM Quantum API to run the circuit on real hardware and compare against simulation.",
    image: "/images/kuhn-poker.png",
    tags: ["Qiskit", "IBM Quantum", "FastAPI", "React", "Vercel", "Render"],
    links: {
      github: "https://github.com/spoigai21/KuhnQuantumPoker",
      live: "http://kuhn-quantum-poker.vercel.app/",
    },
    // Mini case study. Drafted from the project — tighten the voice and confirm
    // anything marked [VERIFY] against what you actually did.
    caseStudy: {
      problem:
        "Kuhn poker has a known game-theory-optimal mixed strategy. I wanted a version where a quantum circuit discovers and plays that strategy against a human — and to find out whether real IBM Quantum hardware actually reproduces the intended probabilities, not just a simulator.",
      decision:
        "The hardest call was running every hand live on quantum hardware (authentic, but queue latency makes gameplay unplayable) versus faking it. I decoupled the two: sample the strategy distribution from the 6-qubit circuit on real hardware, cache it, and serve moves instantly from that cached distribution — quantum-derived, but responsive.",
      broke:
        "The first hardware runs played a lopsided, easily-exploitable strategy: qubit readout noise skewed the measured probabilities away from the ideal mix. I fixed it by [VERIFY: raising the shot count / adding measurement-error mitigation / renormalizing the sampled distribution] so the served strategy matched the intended one.",
      learned:
        "Real quantum hardware is noisy and non-deterministic — the physics is the easy part to describe and the hard part to trust. Most of the actual engineering was the classical scaffolding around the quantum core: sampling, caching, error handling, and honest comparisons to simulation.",
    },
  },
  {
    name: "Disease Tracker",
    description:
      "A FastAPI RESTful API serving real-time disease metrics and risk assessments with low-latency responses. Integrated AWS Bedrock for an automated AI-assisted risk-scoring pipeline, backed by DynamoDB NoSQL schemas for scalable ingestion.",
    image: "/images/disease-tracker.png",
    tags: ["React", "Node", "FastAPI", "AWS Bedrock", "DynamoDB"],
    links: {
      github: "https://github.com/tatertotbot/AWS-Inrix-2025"
    }
  },
  {
    name: "Restaurant Agentic RAG Pipeline",
    description:
      "A modular RAG framework using Ollama and ChromaDB for semantic search across dynamic datasets. Built an MCP (Model Context Protocol) server exposing local data as tools for AI agents via JSON-RPC, with an extensible codebase for adding new datasets.",
    image: "/images/rag-pipeline.png",
    tags: ["Python", "ChromaDB", "Ollama", "MCP"],
    links: {
      github: "https://github.com/spoigai21/restaurant-rag"
    },
    // Mini case study. Drafted from the project — confirm the [VERIFY] specifics.
    caseStudy: {
      problem:
        "I wanted an agent that could answer questions over changing local datasets (restaurant data) fully offline — no re-indexing the world on every update, and nothing leaking to a cloud LLM.",
      decision:
        "Instead of stuffing every dataset into the prompt, I exposed the data to the agent through an MCP server — tools over JSON-RPC — so the agent retrieves on demand. That kept context small and made adding a new dataset a matter of registering a tool, not rewriting the pipeline.",
      broke:
        "Early on, semantic search returned confident-but-wrong chunks — the agent sounded sure and cited the wrong thing. The culprit was [VERIFY: chunk size too large / an embedding-model mismatch]; I fixed retrieval by [VERIFY: tuning chunk size and overlap / adding metadata filters] before trusting any answer.",
      learned:
        "RAG quality is mostly retrieval quality, not model quality. Good chunking and clean tool boundaries moved the needle far more than any prompt wording — the model was rarely the bottleneck.",
    },
  },
  {
    name: "Social Network",
    description:
      "A desktop social networking program in C++/QT with a GUI for profiles, posts, and comments, applying MVC to separate UI from logic. Persistent file I/O storage and a custom graph data structure with BFS traversal to generate friend suggestions.",
    image: "/images/social-network.png",
    tags: ["C++", "QT", "MVC", "Graphs", "Makefile"],
    links: {
      github: "https://github.com/spoigai21/socialnetwork"
    }
  },
];

// Skills rendered as 3D orbs. `logo` is a brand SVG in /public/logos shown on
// the orb; `name` is the full label shown in the hover tooltip.
export const skills = [
  { name: "C++", logo: "/logos/cpp.svg" },
  { name: "Python", logo: "/logos/python.svg" },
  { name: "Java", logo: "/logos/java.svg" },
  { name: "React.js", logo: "/logos/react.svg" },
  { name: "Node.js", logo: "/logos/nodejs.svg" },
  { name: "FastAPI", logo: "/logos/fastapi.svg" },
  { name: "Spring Boot", logo: "/logos/spring.svg" },
  { name: "AWS", logo: "/logos/aws.svg" },
  { name: "Docker", logo: "/logos/docker.svg" },
  { name: "PostgreSQL", logo: "/logos/postgresql.svg" },
  { name: "Matplotlib", logo: "/logos/matplotlib.svg" },
  { name: "Linux", logo: "/logos/linux.svg" },
  { name: "Qt", logo: "/logos/qt.svg" },
  { name: "Git", logo: "/logos/git.svg" },
  { name: "Pandas", logo: "/logos/pandas.svg" },
];

export const education = [
  {
    degree: "B.S. in Computer Science",
    school: "Santa Clara University",
    period: "Expected Fall 2027",
    detail:
      "Major GPA: 4.0 / 4.0 · Coursework: Advanced Algorithms, Data Structures & Algorithms, Advanced C++, Linear Algebra, Theory of Automata, Discrete Mathematics.",
  },
];

// Technical writing. Scaffolding only — add real posts by dropping another
// object here. `body` is intentionally empty on stubs; the post page shows a
// "coming soon" state until you fill it in. Newest first.
export const posts = [
  {
    slug: "private-cached-image-serving-s3-cloudfront",
    title: "Setting up private, cached image serving with S3 + CloudFront",
    date: "2026-07-08",
    status: "draft", // "draft" renders a coming-soon stub; "published" renders body
    summary:
      "[FILL IN — one or two sentences on what this post covers: keeping an S3 bucket private, serving images through CloudFront with signed URLs/OAI, and caching at the edge.]",
    body: null,
  },
];
