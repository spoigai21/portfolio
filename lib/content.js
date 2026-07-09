// Central content for the portfolio. Edit here to update the site.

export const profile = {
  name: "Shayan Poigai",
  role: "CS @ SCU",
  // Short, plain, present-tense line shown under the 3D name on the hero.
  now: "Building backend AI features, learning quantum computing, and shipping a jewelry e-commerce platform.",
  location: "Fremont, California",
  email: "spoigai21@gmail.com",
  phone: "510-738-8155",
  links: {
    github: "https://github.com/spoigai21",
    linkedin: "https://www.linkedin.com/in/shayanpoigai/",
  },
};

// About — flowing prose. Two short paragraphs: what I build, then the person.
export const about = {
  paragraphs: [
    "I like building backend AI and general features for the applications I work on, and right now I'm going deeper into quantum computing. What I enjoy most is taking something I already know and pointing it at a new problem — a lot of what I make starts as a small, personally useful app that solves a basic annoyance and grows from there.",
    "Outside of code I play and watch a lot of basketball, and I'm always up for trying a new sport. I like eating out and experimenting with new foods, watching movies and TV, and gaming — currently counting down to GTA 6. Lately I've also been studying trends in Bay Area real estate.",
  ],
};

// Contact channels, shown around the basketball planet on /contact.
export const contact = [
  { label: "Email", value: "spoigai21@gmail.com", href: "mailto:spoigai21@gmail.com" },
  { label: "LinkedIn", value: "in/shayanpoigai", href: "https://www.linkedin.com/in/shayanpoigai/" },
  { label: "GitHub", value: "spoigai21", href: "https://github.com/spoigai21" },
];

// Experience — résumé-style, detailed bullets that tell the whole story.
export const experience = [
  {
    role: "Incoming SWE Intern",
    company: "HerbsPro",
    period: "2026",
    bullets: ["Joining the backend team as a software engineering intern."],
  },
  {
    role: "Co-Founder & Principal Software Engineer",
    company: "Adorus — Jewelry E-commerce Startup",
    period: "May 2026 — Present",
    bullets: [
      "Architecting and building a full-stack jewelry e-commerce platform from the ground up, leading both frontend and backend development.",
      "Building responsive frontend interfaces in React.js and Node.js.",
      "Standing up RESTful backend services in Java Spring Boot backed by a PostgreSQL database.",
      "Deploying and managing the application on AWS EC2 infrastructure.",
    ],
  },
  {
    role: "Machine Learning Research Assistant",
    company: "Santa Clara University",
    period: "December 2025 — June 2026",
    bullets: [
      "Analyzing public sentiment toward using LLMs as a therapeutic tool, contributing to a multi-part academic paper.",
      "Scraped and processed 5,000+ social media posts from Twitter, Reddit, and YouTube across mental-health and AI communities.",
      "Architected an NLP pipeline using unsupervised topic modeling (BERTopic, LDA, NMF), normalizing noisy text with Pandas.",
      "Built Matplotlib/Seaborn analytics revealing shifts in public attitudes; paper submitted to IEEE ASONAM 2026.",
    ],
  },
  {
    role: "Computer Science Lab Teaching Assistant",
    company: "Santa Clara University",
    period: "September 2025 — March 2026",
    bullets: [
      "Mentored 40+ students in C++ memory management, pointers, and OOP, improving lab completion rates.",
      "Debugged complex logic errors in real time, teaching GDB and systematic testing to cut technical debt.",
      "Collaborated with faculty to streamline lab delivery and align with core curriculum objectives.",
    ],
  },
  {
    role: "Theory of Algorithms Grader",
    company: "Santa Clara University",
    period: "March 2026 — June 2026",
    bullets: [
      "Graded assignments for 40+ students across 2 sections of Theory of Algorithms.",
      "Evaluated correctness and efficiency across runtime analysis, divide & conquer, greedy algorithms, and dynamic programming.",
      "Applied consistent rubrics and gave structured feedback to keep grading fair and useful.",
    ],
  },
];

// Projects — résumé-style, detailed bullets. `image` is a screenshot in /public/images.
export const projects = [
  {
    name: "Kuhn Poker vs Quantum",
    period: "June 2026",
    image: "/images/kuhn-poker.png",
    tags: ["Qiskit", "IBM Quantum", "FastAPI", "React", "Vercel", "Render"],
    links: {
      github: "https://github.com/spoigai21/KuhnQuantumPoker",
      live: "http://kuhn-quantum-poker.vercel.app/",
    },
    bullets: [
      "Built a poker game where a 6-qubit quantum circuit — using superposition and entanglement, optimized in Qiskit — discovers the opponent's strategy.",
      "Developed a full-stack app: FastAPI backend + React frontend, deployed on Render and Vercel.",
      "Integrated the IBM Quantum API to run the circuit on real hardware and compare results against simulation.",
      "Sampled the strategy on real hardware and cached it, applying measurement-error mitigation so noisy qubit readouts didn't skew play.",
    ],
  },
  {
    name: "Disease Tracker",
    period: "October 2025",
    image: "/images/disease-tracker.png",
    tags: ["React", "Node", "FastAPI", "AWS Bedrock", "DynamoDB"],
    links: { github: "https://github.com/tatertotbot/AWS-Inrix-2025" },
    bullets: [
      "Developed a FastAPI RESTful API serving real-time disease metrics and risk assessments with low-latency responses.",
      "Integrated AWS Bedrock to engineer an automated, AI-assisted risk-scoring pipeline for public-health data.",
      "Designed DynamoDB NoSQL schemas for scalable ingestion and seamless backend-to-frontend communication.",
    ],
  },
  {
    name: "Restaurant Agentic RAG Pipeline",
    period: "July 2025",
    image: "/images/rag-pipeline.png",
    tags: ["Python", "ChromaDB", "Ollama", "MCP"],
    links: { github: "https://github.com/spoigai21/restaurant-rag" },
    bullets: [
      "Engineered a modular RAG framework using Ollama and ChromaDB for semantic search across dynamic datasets.",
      "Built an MCP (Model Context Protocol) server exposing local data as tools for AI agents via JSON-RPC.",
      "Designed an extensible codebase so new datasets integrate with minimal refactoring.",
      "Fixed confident-but-wrong retrieval by shrinking chunks with overlap and adding metadata filters.",
    ],
  },
  {
    name: "Social Network",
    period: "September 2025",
    image: "/images/social-network.png",
    tags: ["C++", "QT", "MVC", "Graphs", "Makefile"],
    links: { github: "https://github.com/spoigai21/socialnetwork" },
    bullets: [
      "Built a desktop social networking program in C++/QT with a GUI for profiles, posts, and comments, using MVC to separate UI from logic.",
      "Implemented file I/O for persistent storage of users, friendships, posts, and comments with OOP principles.",
      "Modeled friendships with a custom graph data structure and used BFS traversal to generate friend suggestions.",
      "Automated multi-file builds with a Makefile.",
    ],
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
      "Major GPA: 4.0 · Coursework: Advanced Algorithms, Data Structures & Algorithms, Advanced C++, Linear Algebra, Theory of Automata, Discrete Mathematics.",
  },
];

// What I'm actively working on right now — present-tense, in-progress.
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
