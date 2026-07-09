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

// About — a short prose intro (what I build), then the person shown as icons.
export const about = {
  paragraphs: [
    "I build backend AI and general product features — and right now I'm going deeper into quantum computing.",
    "What I enjoy most is pointing something I already know at a new problem.",
    "A lot of what I make starts as a small, personally useful app that fixes a basic annoyance, then grows from there.",
  ],
  // "Outside of code" — rendered as icon chips instead of a paragraph.
  hobbies: [
    { icon: "🏀", label: "Basketball" },
    { icon: "🏅", label: "Trying new sports" },
    { icon: "🍜", label: "Eating out & new foods" },
    { icon: "🎬", label: "Movies & TV" },
    { icon: "🎮", label: "Gaming (GTA 6 countdown)" },
    { icon: "🏙️", label: "Bay Area real estate" },
  ],
};

// Contact channels, shown around the basketball planet on /contact.
export const contact = [
  { label: "Email", value: "spoigai21@gmail.com", href: "mailto:spoigai21@gmail.com" },
  { label: "LinkedIn", value: "in/shayanpoigai", href: "https://www.linkedin.com/in/shayanpoigai/" },
  { label: "GitHub", value: "spoigai21", href: "https://github.com/spoigai21" },
];

// Experience — résumé-style bullets, ordered oldest → newest (left → right)
// so the timeline reads naturally along its axis. Source of truth: résumé.
export const experience = [
  {
    role: "CS Teaching Assistant & Algorithms Grader",
    company: "Santa Clara University",
    period: "Sept 2025 — June 2026",
    bullets: [
      "Mentored 40+ students in C++ — memory management, pointers, and OOP — and debugged logic errors live using GDB.",
      "Graded Theory of Algorithms for 40+ students across 2 sections, evaluating runtime analysis, greedy, divide-and-conquer, and dynamic-programming solutions.",
    ],
  },
  {
    role: "Machine Learning Research Assistant",
    company: "Santa Clara University",
    period: "Dec 2025 — June 2026",
    bullets: [
      "Spent six months studying what people actually think about LLMs as a therapeutic tool, not what they say in surveys, but what they say to each other, unprompted, across mental-health communities on Twitter, Reddit, and YouTube.",
      "The modeling wasn't the hard part. 5,000+ scraped posts are a mess of slang, typos, and sarcasm; most of my time went into Pandas preprocessing, normalizing text until BERTopic, LDA, and NMF could surface real structure instead of noise.",
      "Co-authored the paper as primary writer, which meant learning LaTeX in Overleaf, fighting table formatting until the columns behaved, and hunting down references — figuring out which prior work actually supported a claim rather than just sounding adjacent to it.",
      "Writing the paper forced a rigor the code never did. Producing a topic model is one thing; defending why the topics mean anything is another.",
      "Submitted to IEEE/ACM ASONAM 2026.",
    ],
  },
  {
    role: "Co-Founder & CTO / Lead Software Engineer",
    company: "Adorus — Jewelry E-commerce Startup",
    period: "May 2026 — Present",
    bullets: [
      "Adorus started as an idea between siblings. My sister and I co-founded it, split the work by what we're each good at, and agreed on one thing: build something we'd actually be proud to put our name on.",
      "Given my technical background, I took ownership of the entire engineering side. Every layer, data models, API contracts, component architecture, and deployment, is mine to design and be accountable for, which means there's no senior engineer to check my thinking. I've learned to be my own code reviewer.",
      "We seriously considered Shopify. Building it ourselves was cheaper and gave us full control over how the site works, so we went that way, a decision I own the consequences of every time something breaks at 2am.",
      "The stack: React.js/Node.js frontend, Java Spring Boot services, PostgreSQL, deployed on AWS EC2 with S3 and CloudFront serving product images through a private bucket. Most of the real work has been the unglamorous foundations: authentication, image pipelines, a schema that won't buckle when real orders arrive.",
      "The parts I couldn't build, we went and found. My sister and I reached out cold on social media to photographers and marketers working in the industry, asking people with real careers to help us. Learning to ask for help turned out to be a skill in itself.",
      "Next: building toward AI agents over an MCP server to give us a clearer read on customer behavior and satisfaction, so the site can adapt to how people actually use it rather than how we assumed they would.",
    ],
  },
  {
    role: "Software Engineering Intern",
    company: "HerbsPro",
    period: "June 2026 — Present",
    bullets: [
      "Implementing AI backend features across the e-commerce stack.",
    ],
  },
];

// Projects — concise bullets that build on (not copy) the résumé, plus a
// `note` callout with the one detail worth knowing. `image` is a screenshot in
// /public/images; `video` (optional) is a short looping clip of real usage that
// takes priority over the still and falls back to it if it fails to load.
export const projects = [
  {
    name: "Kuhn Poker vs Quantum",
    period: "June 2026",
    image: "/images/kuhn-poker.png",
    // TODO(shayan): drop a short screen-capture at this path to show live play.
    // Until then the component falls back to kuhn-poker.png automatically.
    video: "/images/kuhn-poker.mp4",
    tags: ["Qiskit", "IBM Quantum", "FastAPI", "React", "Vercel", "Render"],
    links: {
      github: "https://github.com/spoigai21/KuhnQuantumPoker",
      live: "http://kuhn-quantum-poker.vercel.app/",
    },
    bullets: [
      "A 6-qubit, 12-parameter variational circuit (superposition + entanglement) infers your mixed strategy as you play.",
      "Full-stack: FastAPI backend + React frontend, deployed on Render and Vercel.",
      "Measurement-error mitigation keeps noisy qubit readouts from skewing the AI's decisions.",
    ],
    note: "Ran on real IBM quantum hardware (ibm_fez): on a 4,096-shot run, the real-chip probabilities matched the ideal simulation within ~1.7 percentage points on average — the remaining gap attributable to quantum noise.",
  },
  {
    name: "Disease Tracker",
    period: "October 2025",
    image: "/images/disease-tracker.png",
    tags: ["React", "Node", "FastAPI", "AWS Bedrock", "DynamoDB"],
    links: { github: "https://github.com/tatertotbot/AWS-Inrix-2025" },
    bullets: [
      "FastAPI REST API serving real-time disease metrics and risk assessments with low-latency responses.",
      "AWS Bedrock drives an automated AI risk-scoring pipeline over public-health data.",
      "DynamoDB schemas designed for scalable ingestion and clean backend-to-frontend flow.",
    ],
    note: "Built in a weekend at the AWS × INRIX 2025 hackathon — the Bedrock scoring layer is what turned a raw data feed into something that actually flags emerging hotspots.",
  },
  {
    name: "Restaurant Agentic RAG Pipeline",
    period: "July 2025",
    image: "/images/rag-pipeline.png",
    tags: ["Python", "ChromaDB", "Ollama", "MCP"],
    links: { github: "https://github.com/spoigai21/restaurant-rag" },
    bullets: [
      "Modular RAG framework over Ollama + ChromaDB for semantic search across dynamic datasets.",
      "MCP (Model Context Protocol) server exposing local data as tools for AI agents via JSON-RPC.",
      "Extensible by design — new datasets drop in with minimal refactoring.",
    ],
    note: "The surprise: retrieval quality lived or died on chunking, not the model. The first version confidently returned wrong passages until I shrank the chunks, added overlap, and layered in metadata filters.",
  },
  {
    name: "Social Network",
    period: "September 2025",
    image: "/images/social-network.png",
    video: "/images/social-network-vid.mp4",
    tags: ["C++", "QT", "MVC", "Graphs", "Makefile"],
    links: { github: "https://github.com/spoigai21/socialnetwork" },
    bullets: [
      "Desktop social network in C++/Qt with a GUI for profiles, posts, and comments; MVC keeps UI and logic separate.",
      "File I/O persists users, friendships, posts, and comments across sessions.",
      "A custom graph models friendships; BFS traversal generates friend suggestions.",
    ],
    note: "No graph library — the friend network is a hand-rolled adjacency structure, and \"people you may know\" falls straight out of a breadth-first walk over friends-of-friends.",
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
    period: "Expected December 2027",
    detail:
      "Major GPA: 4.0 · Coursework: Advanced Algorithms, Data Structures & Algorithms, Advanced C++, Linear Algebra, Theory of Automata, Discrete Mathematics.",
  },
];

// What I'm actively working on right now — present-tense, in-progress.
export const posts = [
  {
    slug: "adorus-deployment",
    title: "Deploying Adorus",
    summary:
      "Standing up the Adorus jewelry storefront on an AWS EC2 instance, and integrating & testing Stripe to handle checkout and payments.",
  },
  {
    slug: "herbspro-backend",
    title: "AI projects for HerbsPro",
    summary:
      "Implementing AI projects across the HerbsPro e-commerce stack.",
  },
  {
    slug: "leetcode-grind",
    title: "Grinding LeetCode problems",
    summary:
      "Sharpening data structures and algorithms one problem at a time.",
  },
];
