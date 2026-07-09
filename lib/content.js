// Central content for the portfolio. Edit here to update the site.

export const profile = {
  name: "Shayan Poigai",
  role: "CS @ SCU",
  tagline:
    "Motivated second-year Computer Science student at Santa Clara University with interests in AI and backend software development. Proficient in Python and C++ with strong problem-solving skills. Seeking a summer internship to gain practical experience and contribute to impactful software engineering projects.",
  location: "Fremont, California",
  email: "spoigai21@gmail.com",
  phone: "510-738-8155",
  links: {
    github: "https://github.com/spoigai21",
    linkedin: "https://www.linkedin.com/in/shayanpoigai/",
  },
};

// About content, grouped for a visual, card-based layout — short lines, no prose.
export const about = {
  pillars: [
    {
      label: "I build",
      items: [
        "Backend AI & general app features",
        "Useful apps that solve basic, personal problems",
      ],
    },
    { label: "Learning", items: ["Quantum computing"] },
    { label: "How I work", items: ["Take what I know and apply it to new things"] },
  ],
  outside: [
    { icon: "🏀", text: "Play & watch basketball" },
    { icon: "🎯", text: "Trying new sports" },
    { icon: "🍜", text: "Eating out & new foods" },
    { icon: "🎬", text: "Movies & TV" },
    { icon: "🎮", text: "Video games — waiting on GTA 6" },
  ],
};

// Contact channels, shown around the basketball planet on /contact.
export const contact = [
  { label: "Email", value: "spoigai21@gmail.com", href: "mailto:spoigai21@gmail.com" },
  { label: "LinkedIn", value: "in/shayanpoigai", href: "https://www.linkedin.com/in/shayanpoigai/" },
  { label: "GitHub", value: "spoigai21", href: "https://github.com/spoigai21" },
];

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
    // Mini case study. Confirm the specifics match what you actually did.
    caseStudy: {
      problem:
        "Kuhn poker has a known game-theory-optimal mixed strategy. I wanted a version where a quantum circuit discovers and plays that strategy against a human — and to find out whether real IBM Quantum hardware actually reproduces the intended probabilities, not just a simulator.",
      decision:
        "The hardest call was running every hand live on quantum hardware (authentic, but queue latency makes gameplay unplayable) versus faking it. I decoupled the two: sample the strategy distribution from the 6-qubit circuit on real hardware, cache it, and serve moves instantly from that cached distribution — quantum-derived, but responsive.",
      broke:
        "The first hardware runs played a lopsided, easily-exploitable strategy: qubit readout noise skewed the measured probabilities away from the ideal mix. I fixed it by raising the shot count and applying measurement-error mitigation to the results, then renormalizing the sampled distribution — after that the served strategy tracked the intended one closely.",
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
    // Mini case study. Confirm the specifics match what you actually did.
    caseStudy: {
      problem:
        "I wanted an agent that could answer questions over changing local datasets (restaurant data) fully offline — no re-indexing the world on every update, and nothing leaking to a cloud LLM.",
      decision:
        "Instead of stuffing every dataset into the prompt, I exposed the data to the agent through an MCP server — tools over JSON-RPC — so the agent retrieves on demand. That kept context small and made adding a new dataset a matter of registering a tool, not rewriting the pipeline.",
      broke:
        "Early on, semantic search returned confident-but-wrong chunks — the agent sounded sure and cited the wrong thing. The culprit was oversized chunks that blurred each embedding across too many topics; I fixed retrieval by cutting the chunk size down with a bit of overlap and adding metadata filters so a query only searched the relevant dataset.",
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

// What I'm actively working on right now — present-tense, in-progress.
// Titles + one-line descriptions. `slug` keeps the /blog/[slug] route valid for
// when any of these turn into a real write-up.
export const posts = [
  {
    slug: "backend-ai-features",
    title: "Building backend AI features",
    summary:
      "Wiring language models into real app backends — retrieval, tools, and endpoints that ship.",
  },
  {
    slug: "learning-quantum-computing",
    title: "Learning quantum computing",
    summary:
      "Working through circuits, superposition, and entanglement in Qiskit — one experiment at a time.",
  },
  {
    slug: "adorus-ecommerce-platform",
    title: "Shipping Adorus, a jewelry e-commerce platform",
    summary:
      "Full-stack storefront in progress — React/Node front end, Spring Boot + PostgreSQL on AWS.",
  },
  {
    slug: "agentic-rag-pipelines",
    title: "Experimenting with agentic RAG pipelines",
    summary:
      "Prototyping retrieval-augmented agents over MCP tools with local models and ChromaDB.",
  },
];
