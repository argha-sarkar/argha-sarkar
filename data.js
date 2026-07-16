/* ═══════════════════════════════════════════════════
   data.js — Shared Site Data Layer
   Stores defaults + reads/writes from localStorage
   ═══════════════════════════════════════════════════ */

const DATA_KEY   = 'argha_site_data';
const PASS_KEY   = 'argha_admin_pass';
const AUTH_KEY   = 'argha_admin_auth';

/* ── Default Content ── */
const DEFAULT_DATA = {
  "seo": {
    "title": "Argha Sarkar — AI Research Engineer & Deep Learning Architect",
    "description": "Portfolio of Argha Sarkar — AI Research Engineer specializing in Deep Learning, MLOps, Deepfake Detection, RAG Systems, and Edge AI."
  },
  "hero": {
    "firstName": "Argha",
    "lastName": "Sarkar",
    "statusText": "STATUS · ONLINE · INDIA · Data",
    "typingPhrases": [
      "AI Research Engineer",
      "Deep Learning Architect",
      "MLOps Engineer",
      "RAG Systems Builder",
      "Production Graded AI Project Builder"
    ],
    "pills": [
      "5+ YRS IT EXPERIENCE",
      "🧠 DEEP LEARNING",
      "🎭 DEEPFAKE DETECTION",
      "📡 RAG SYSTEMS",
      "⚙️ MLOPS",
      "🔐 CYBER SECURITY"
    ],
    "ctaButtons": [
      {
        "label": "./view_projects.sh",
        "href": "#projects",
        "style": "primary"
      },
      {
        "label": "./connect.sh",
        "href": "#connect",
        "style": "outline"
      },
      {
        "label": "./email.sh",
        "href": "mailto:arghasarkar5373@gmail.com",
        "style": "outline"
      }
    ]
  },
  "about": {
    "name": "Argha Sarkar",
    "status": "ONLINE 🟢",
    "designation": "AI Research Engineer",
    "location": "India 🇮🇳",
    "experience": "5+ Years (IT Ops + Data Analyst)",
    "phone": "+91-7439018427",
    "email": "arghasarkar5373@gmail.com",
    "postgrad": "MBA Analytics & DS, MUJ (2024–2026)",
    "undergrad": "B.Tech CSE, Narula Institute (2014–2018)",
    "passions": [
      "Building systems that LEARN",
      "Breaking AI until it's stronger",
      "Shipping ML to production at scale"
    ],
    "directives": [
      "Deepfake Detection via CNN/GAN analysis",
      "RAG-powered multi-agent LLM workflows",
      "Low-latency CV inference on edge devices",
      "MLOps pipelines: Docker → FastAPI → CI/CD"
    ],
    "workStyle": "Break it in research, harden it in prod."
  },
  "arsenal": {
    "categories": [
      {
        "icon": "🧠",
        "title": "Deep Learning & AI",
        "badges": [
          "PyTorch",
          "TensorFlow",
          "Keras",
          "HuggingFace",
          "LangChain",
          "OpenCV",
          "YOLOv8",
          "Ollama"
        ]
      },
      {
        "icon": "⚙️",
        "title": "MLOps & Infrastructure",
        "badges": [
          "Docker",
          "Kubernetes",
          "MLflow",
          "FastAPI",
          "GitHub Actions",
          "W&B",
          "ChromaDB",
          "FAISS"
        ]
      },
      {
        "icon": "🐍",
        "title": "Languages & Data",
        "badges": [
          "Python",
          "R",
          "SQL",
          "Bash",
          "Pandas",
          "NumPy",
          "Scikit-Learn",
          "Power BI"
        ]
      },
      {
        "icon": "🛡️",
        "title": "Security & Systems",
        "badges": [
          "Linux",
          "Kali Linux",
          "Wireshark",
          "MySQL",
          "MongoDB",
          "IBM DB2",
          "Git",
          "VS Code"
        ]
      }
    ],
    "proficiency": [
      {
        "label": "Python & Data Science",
        "width": "100%",
        "level": "Expert"
      },
      {
        "label": "Deep Learning (PyTorch/TF)",
        "width": "100%",
        "level": "Expert"
      },
      {
        "label": "Computer Vision",
        "width": "85%",
        "level": "Advanced"
      },
      {
        "label": "Natural Language Processing",
        "width": "85%",
        "level": "Advanced"
      },
      {
        "label": "MLOps & Production AI",
        "width": "80%",
        "level": "Advanced"
      },
      {
        "label": "LLMs & RAG Systems",
        "width": "75%",
        "level": "Proficient"
      },
      {
        "label": "Cyber Security & OSINT",
        "width": "70%",
        "level": "Proficient"
      }
    ]
  },
  "experience": [
    {
      "period": "JAN 2019 → AUG 2024",
      "role": "Project Assistant",
      "company": "🏢 NEVAEH TECHNOLOGY PVT. LTD.",
      "points": [
        "Directed full project lifecycles for IT-driven business initiatives",
        "Spearheaded cross-functional infrastructure engineering rollouts",
        "Ensured system stability, minimized downtime across production environments",
        "Led client-facing technical integrations & managed project deliveries",
        "Transitioned team workflows toward data-driven decision frameworks"
      ]
    },
    {
      "period": "2024 → 2026 (ONGOING)",
      "role": "MBA: Analytics & Data Science",
      "company": "📚 MANIPAL UNIVERSITY JAIPUR",
      "points": [
        "Focus: Bridging MBA leadership with production AI engineering",
        "Research Track: Deepfake Detection & Media Integrity Systems",
        "Specialization: Business Analytics, Predictive Modeling, AI Strategy",
        "Machine-Learning Deep-Learning RAG"
      ]
    },
    {
      "period": "2014 → 2018",
      "role": "B.Tech: Computer Science and Engineering",
      "company": "📚 Narula Institute of Technology",
      "points": [
        "Responsibility",
        "SQL",
        "Python",
        "Information Technology Operation"
      ]
    }
  ],
  "projects": [
    {
      "icon": "🤟",
      "name": "ASL Vision System",
      "desc": "Real-time American Sign Language to text pipeline. Features model quantization, frame-rate optimization, and hardware-accelerated inference for edge device deployment. Production-grade CV pipeline with <50ms latency.",
      "stack": [
        "PyTorch",
        "OpenCV",
        "YOLO",
        "MLOps"
      ],
      "link": "https://github.com/argha-sarkar/ASL-Vision---Production-Grade-Sign-Language-Recognition-System"
    },
    {
      "icon": "🤖",
      "name": "AI Agentic Study Coach",
      "desc": "Multi-agent architecture with Planner, Teacher, and Evaluator autonomous loops. Integrated ChromaDB vector memory for RAG. Generates personalized learning paths, adaptive quizzes, and progress tracking.",
      "stack": [
        "LangChain",
        "LLMs",
        "FastAPI",
        "ChromaDB"
      ]
    },
    {
      "icon": "🏠",
      "name": "House Prices MLOps Pipeline",
      "desc": "End-to-end MLOps system evolved from experimental Jupyter notebooks to a scalable, Dockerized microservice. Includes automated feature engineering, CI/CD, unit testing, and a FastAPI inference endpoint.",
      "stack": [
        "Scikit-learn",
        "Docker",
        "FastAPI",
        "GitHub Actions"
      ],
      "link": "https://github.com/argha-sarkar/House-Prices-Advanced-Regression-Techniques-Production-Level"
    },
    {
      "icon": "🚀",
      "name": " Titanic Production Graded AI Project",
      "desc": "Refactored a standard machine learning problem into a highly organized, modular, and production-grade Python package (src/) implementing strict separation of concerns (Ingestion, Preprocessing, Training). Integrated MLflow with a local database backend (mlflow.db) to log parameters, track metrics, and register model artifacts systematically across multiple training runs. Decoupled pipeline parameters and model settings into centralized files (configs/), enabling quick tuning and updates without changing core codebase logic.Maintained a robust testing suite using tests/ alongside a dedicated file-based logging mechanism (logs/) to monitor pipeline execution and ensure reliable deployments. Implemented app.py as a dedicated entry point for serving predictions, preparing the model for real-time inference.",
      "link": "https://github.com/argha-sarkar/titanic-production-graded-ai-project-V1",
      "stack": [
        "Python",
        "MLflow",
        "Pytest",
        "Config-driven Architecture"
      ]
    },
    {
      "icon": "🎭",
      "name": "Deepfake Detection System",
      "desc": "CNN/GAN-based forensic classifier for detecting synthetic media. Trained on real vs. AI-generated media datasets with focus on temporal inconsistency and artifact analysis in compressed video streams.",
      "stack": [
        "PyTorch",
        "ResNet",
        "EfficientNet",
        "CV"
      ]
    },
    {
      "icon": "📈",
      "name": "Financial Market Analyzer",
      "desc": "Time-series forecasting engine for equity markets using LSTM and Prophet models. Built quantitative signal detection for algorithmic trading strategy backtesting and risk analysis.",
      "stack": [
        "Python",
        "LSTM",
        "Prophet",
        "Pandas"
      ]
    }
  ],
  "certs": [
    {
      "issuer": "[IBM]",
      "name": "Introduction to Machine Learning Specialization",
      "status": "ACTIVE"
    },
    {
      "issuer": "[DeepLearning.AI]",
      "name": "Probability & Statistics for ML & Data Science",
      "status": "ACTIVE"
    },
    {
      "issuer": "[IBM]",
      "name": "Generative AI for Digital Marketing",
      "status": "ACTIVE"
    },
    {
      "issuer": "[UC Davis]",
      "name": "Market Research Specialization",
      "status": "ACTIVE"
    },
    {
      "issuer": "[Coursera]",
      "name": "Data Science Professional Certificate",
      "status": "ACTIVE"
    },
    {
      "issuer": "[Google]",
      "name": "Data Analytics Certificate",
      "status": "ACTIVE"
    },
    {
      "issuer": "[Indian Institute of Management Ahmedabad]",
      "name": "Advanced Digital Transformation",
      "status": "ACTIVE",
      "link": "https://www.coursera.org/account/accomplishments/specialization/certificate/WJOM6X38ZUSC"
    }
  ],
  "achievements": {
    "metrics": [
      {
        "value": "5",
        "suffix": "+",
        "label1": "Years of",
        "label2": "IT Experience"
      },
      {
        "value": "5",
        "suffix": "+",
        "label1": "Production AI",
        "label2": "Projects Shipped"
      },
      {
        "value": "6",
        "suffix": "",
        "label1": "Professional",
        "label2": "Certifications"
      },
      {
        "value": "2",
        "suffix": "",
        "label1": "Advanced",
        "label2": "Degrees"
      },
      {
        "value": "∞",
        "suffix": "",
        "label1": "Models Trained",
        "label2": "& Broken"
      }
    ],
    "rhythm": {
      "morning": "☕ Read a paper, run an experiment",
      "afternoon": "🧠 Train models, tune hyperparams",
      "evening": "🔐 Analyze threat vectors, write code",
      "midnight": "🌙 Push commits, break prod, fix prod",
      "philosophy": "while alive: learn(). build(). repeat()"
    }
  },
  "stats": {
    "languages": [
      {
        "name": "Python",
        "pct": 72,
        "color": "#3572A5"
      },
      {
        "name": "C++",
        "pct": 10,
        "color": "#f34b7d"
      },
      {
        "name": "HTML",
        "pct": 8,
        "color": "#e34c26"
      },
      {
        "name": "CSS",
        "pct": 5,
        "color": "#563d7c"
      },
      {
        "name": "JavaScript",
        "pct": 3,
        "color": "#f1e05a"
      },
      {
        "name": "R",
        "pct": 2,
        "color": "#276DC3"
      }
    ],
    "weekly": [
      {
        "label": "🧠 Deep Learning Research",
        "pct": 85,
        "time": "26h 30m"
      },
      {
        "label": "📚 MBA Coursework",
        "pct": 63,
        "time": "15h 30m"
      },
      {
        "label": "🐍 Python Engineering",
        "pct": 20,
        "time": "01h 20m"
      },
      {
        "label": "👔 Leadership & Strategy",
        "pct": 30,
        "time": "03h 00m"
      },
      {
        "label": "🔐 Security Research",
        "pct": 12,
        "time": "00h 45m"
      }
    ]
  },
  "research": [
    {
      "title": "🧠 Artificial Intelligence & Deep Learning",
      "desc": "Designing neural network architectures from scratch — CNNs, RNNs, Transformers, and hybrid models. Experienced in transfer learning, fine-tuning large pre-trained models (BERT, LLaMA, Mistral), and publishing reproducible ML experiments."
    },
    {
      "title": "📡 Retrieval-Augmented Generation (RAG)",
      "desc": "End-to-end RAG system design using vector databases (ChromaDB, FAISS), embedding models, and LLM orchestration via LangChain. Building knowledge-grounded agentic workflows."
    },
    {
      "title": "⚙️ MLOps & AI Engineering",
      "desc": "From notebook to production: containerization (Docker/K8s), model versioning (MLflow), monitoring (W&B), REST APIs (FastAPI), CI/CD automation. Bridging the gap between research and real-world deployment."
    },
    {
      "title": "🔐 Cyber Security & OSINT",
      "desc": "Threat analysis, network forensics, vulnerability assessment, and open-source intelligence gathering. Applying AI-driven anomaly detection to cybersecurity frameworks."
    },
    {
      "title": "📈 Quantitative Finance & AI",
      "desc": "Applying LSTM networks, Prophet, and statistical methods to financial time series. Developing signal detection algorithms for algorithmic trading strategy backtesting and risk analysis."
    }
  ],
  "connect": {
    "linkedin": "https://linkedin.com/in/arghasarkar",
    "email": "arghasarkar5373@gmail.com",
    "medium": "https://medium.com/@arghasarkar5373/",
    "twitter": "https://twitter.com/arghasa64623109",
    "github": "https://github.com/argha-sarkar",
    "phone": "+91-7439018427"
  },
  "settings": {
    "defaultTheme": "dark",
    "accentColor": "#00ff41",
    "footerYear": "2026"
  }
};

/* ── Data Helpers ── */
function getData() {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_DATA));
    return JSON.parse(raw);
  } catch(e) {
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}

function saveData(data) {
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
}

function resetData() {
  localStorage.removeItem(DATA_KEY);
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

/* ── Auth Helpers ── */
async function hashPassword(pw) {
  const buf  = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

function getSavedHash() {
  // Default password hash for "admin123"
  return localStorage.getItem(PASS_KEY) || 'b9f97d28f1ea35479dfd66c5aa9c3a12fb4e5b7a0e8b1c234d6789a0b1e2f3a4';
}

async function checkPassword(pw) {
  const h = await hashPassword(pw);
  // On very first login, accept "admin123" by comparing with known hash
  const stored = localStorage.getItem(PASS_KEY);
  if (!stored) {
    // First time — accept "admin123"
    if (pw === 'admin123') {
      localStorage.setItem(PASS_KEY, h);
      return true;
    }
    return false;
  }
  return h === stored;
}

async function changePassword(newPw) {
  const h = await hashPassword(newPw);
  localStorage.setItem(PASS_KEY, h);
}

function setLoggedIn(val) {
  if (val) sessionStorage.setItem(AUTH_KEY, '1');
  else sessionStorage.removeItem(AUTH_KEY);
}

function isLoggedIn() {
  return sessionStorage.getItem(AUTH_KEY) === '1';
}
