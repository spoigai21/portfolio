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
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/",
  },
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
    }
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
