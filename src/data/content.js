import portrait from "../assets/Neon Blue and Magenta Portrait.png";

export const navLinks = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

export const projects = [
  {
    number: "001",
    year: "2025",
    title: "NHS Trust Efficiency & AI Insights Dashboard",
    tech: "Python / Streamlit / SQL / scikit-learn / GenAI / Plotly",
    description:
      "AI-driven analytics platform for NHS Trust energy data — DBSCAN clustering and PCA for anomaly detection, natural-language insight queries, and interactive facility-level dashboards.",
    status: "Deployed",
  },
  {
    number: "002",
    year: "2025",
    title: "NILAI Corporate Website",
    tech: "React / Vite / Tailwind CSS / GSAP / Framer Motion / Firebase",
    description:
      "Responsive corporate website with reusable components and scroll-triggered GSAP/Framer Motion animations, Firebase integration, and optimized frontend performance.",
    status: "Deployed",
  },
  {
    number: "003",
    year: "2025",
    title: "Chillaware — AI Smart Fridge & Invoice Scanner",
    tech: "React Native / Expo / Firebase / OCR / Computer Vision",
    description:
      "Cross-platform app for fridge inventory and expiry tracking, with Tesseract OCR invoice scanning, computer-vision item detection, and real-time Firebase sync.",
    status: "Active",
  },
  {
    number: "004",
    year: "2024",
    title: "AI Storyboard Generator",
    tech: "Python / Diffusers / PyTorch / LoRA / Streamlit",
    description:
      "Generative AI app for producing storyboard concepts from text prompts — prompt generation, LoRA fine-tuning, image pipelines, and a Streamlit scene-management UI.",
    status: "Active",
  },
  {
    number: "005",
    year: "2024",
    title: "Automated Data Quality ETL Pipeline",
    tech: "Python / Pandas / SQL / Data Validation",
    description:
      "ETL pipeline for large datasets with automated validation, cleansing, audit logging, and summary reporting, built from reusable data-processing components.",
    status: "Deployed",
  },
];

export const skillGroups = [
  {
    title: "Programming & Frameworks",
    code: "SYS.01",
    items: [
      "Python",
      "SQL",
      "JavaScript",
      "TypeScript",
      "MySQL",
      "FastAPI",
      "Streamlit",
      "React Native",
      "Node.js",
    ],
  },
  {
    title: "Testing",
    code: "SYS.02",
    items: [
      "Functional Testing",
      "Test Case Design",
      "Test Script Creation",
      "Test Execution",
      "Defect Reporting",
      "Regression Testing",
      "Integration Testing",
      "Partner Testing",
    ],
  },
  {
    title: "Airline Domain",
    code: "SYS.03",
    items: ["Amadeus Altea", "PNR", "Codeshare", "PNR View", "IATCI", "iEMD", "Partner Airline Validation"],
  },
  {
    title: "AI / Machine Learning",
    code: "SYS.04",
    items: [
      "Computer Vision",
      "OCR",
      "Tesseract",
      "Generative AI",
      "Gemini",
      "LoRA",
      "Stable Diffusion",
      "DBSCAN",
      "PCA",
      "scikit-learn",
      "TensorFlow",
    ],
  },
  {
    title: "Data & Analytics",
    code: "SYS.05",
    items: ["Pandas", "NumPy", "Plotly", "Power BI", "Advanced Excel", "ETL Pipelines"],
  },
  {
    title: "Cloud & Tools",
    code: "SYS.06",
    items: ["Azure", "Firebase", "Docker", "Git", "REST APIs", "Postman", "Selenium", "Linux"],
  },
];

export const quickFacts = [
  { label: "Role", value: "Assistant System Engineer, TCS" },
  { label: "Focus", value: "Functional testing, airline systems, AI/ML" },
  { label: "Education", value: "MCA, VIT Vellore (2025)" },
  { label: "Status", value: "Open to opportunities", isStatus: true },
];

// Chronological record: education + work experience, oldest to most recent.
export const experienceTrack = [
  { year: "2020–23", title: "BSc, Computer Science", sub: "VIT Vellore, CGPA 7.5" },
  { year: "2023–", title: "Icubeverse", sub: "Co-founder, freelance, with a friend" },
  { year: "2023–25", title: "MCA", sub: "VIT Vellore, CGPA 8.24" },
  { year: "Apr–Jul 2025", title: "NILAI Solutions", sub: "AI Engineering Intern" },
  { year: "Dec 2025–", title: "Tata Consultancy Services", sub: "Assistant System Engineer, Japan Airlines" },
];

export const icubeModules = ["Functional testing", "AI / ML systems", "Full-stack apps", "Data analytics", "Automation"];

// Portrait placeholder — swap for a real photo in src/assets/ and update this
// constant; every usage (hero portal + About holo-card) reads from here.
export const portraitImage = portrait;

export const contact = {
  email: "byvenkataraja@gmail.com",
  phone: "+91 7904267840",
  linkedin: "https://linkedin.com/in/venktrj",
  github: "https://github.com/venkat2k25",
};

export const socials = [
  { label: "GitHub", href: contact.github },
  { label: "LinkedIn", href: contact.linkedin },
  { label: "Email", href: `mailto:${contact.email}` },
];
