export interface Job {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  salary?: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  posted: string;
}

export const departments = [
  "All Departments",
  "Engineering",
  "Design",
  "Product",
  "Marketing",
  "Sales",
  "Operations",
  "Finance",
  "Human Resources",
  "Legal",
  "Research & Development"
];

export const locations = [
  "All Locations",
  "Tashkent, Uzbekistan",
  "San Francisco, USA",
  "London, UK",
  "Dubai, UAE",
  "Singapore",
  "Tokyo, Japan",
  "Remote"
];

export const jobTypes = [
  "All Types",
  "Full-time",
  "Part-time",
  "Contract",
  "Internship"
];

export const jobs: Job[] = [
  {
    id: "1",
    slug: "senior-ai-engineer",
    title: "Senior AI Engineer",
    department: "Engineering",
    location: "San Francisco, USA",
    type: "Full-time",
    experience: "5+ years",
    salary: "$180,000 - $250,000",
    description: "Join our world-class AI team to build next-generation machine learning systems that power ALSAMOS products used by millions worldwide.",
    responsibilities: [
      "Design and implement scalable ML systems",
      "Lead research initiatives in NLP and computer vision",
      "Mentor junior engineers and contribute to technical strategy",
      "Collaborate with product teams to define AI capabilities",
      "Optimize model performance and reduce inference latency",
      "Publish research and represent ALSAMOS at conferences"
    ],
    requirements: [
      "MS/PhD in Computer Science, ML, or related field",
      "5+ years experience in ML/AI development",
      "Expert proficiency in Python, PyTorch, TensorFlow",
      "Published research in top-tier venues (NeurIPS, ICML, etc.)",
      "Experience deploying ML systems at scale",
      "Strong communication and leadership skills"
    ],
    benefits: [
      "Competitive salary and equity package",
      "Comprehensive health, dental, and vision insurance",
      "Unlimited PTO policy",
      "Annual learning and development budget",
      "Home office setup allowance",
      "Regular team offsites and events"
    ],
    posted: "2024-01-10"
  },
  {
    id: "2",
    slug: "product-designer",
    title: "Senior Product Designer",
    department: "Design",
    location: "London, UK",
    type: "Full-time",
    experience: "4+ years",
    salary: "£80,000 - £120,000",
    description: "Shape the future of ALSAMOS products by creating intuitive, beautiful experiences that delight millions of users across our platform.",
    responsibilities: [
      "Lead end-to-end design for major product features",
      "Create wireframes, prototypes, and high-fidelity designs",
      "Conduct user research and usability testing",
      "Collaborate closely with engineering and product teams",
      "Contribute to and evolve our design system",
      "Mentor junior designers and establish best practices"
    ],
    requirements: [
      "4+ years of product design experience",
      "Strong portfolio demonstrating end-to-end design process",
      "Proficiency in Figma, Sketch, and prototyping tools",
      "Experience with design systems and component libraries",
      "Understanding of front-end development principles",
      "Excellent communication and presentation skills"
    ],
    benefits: [
      "Competitive salary and equity",
      "Private health insurance",
      "25 days annual leave plus bank holidays",
      "Flexible working arrangements",
      "Professional development budget",
      "Modern London office with great amenities"
    ],
    posted: "2024-01-08"
  },
  {
    id: "3",
    slug: "backend-engineer",
    title: "Backend Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    experience: "3+ years",
    salary: "$140,000 - $180,000",
    description: "Build robust, scalable backend systems that power the ALSAMOS platform, serving millions of users and processing billions of requests daily.",
    responsibilities: [
      "Design and implement RESTful APIs and microservices",
      "Optimize database performance and data models",
      "Build real-time data processing pipelines",
      "Ensure system reliability and implement monitoring",
      "Participate in code reviews and technical discussions",
      "Document systems and contribute to engineering wiki"
    ],
    requirements: [
      "3+ years backend development experience",
      "Strong proficiency in Go, Python, or Node.js",
      "Experience with PostgreSQL, Redis, and message queues",
      "Familiarity with cloud platforms (AWS, GCP, or Azure)",
      "Understanding of distributed systems principles",
      "BS in Computer Science or equivalent experience"
    ],
    benefits: [
      "Competitive compensation with equity",
      "Fully remote with flexible hours",
      "Health insurance for you and dependents",
      "Home office equipment budget",
      "Annual company retreat",
      "Learning and development stipend"
    ],
    posted: "2024-01-06"
  },
  {
    id: "4",
    slug: "product-manager",
    title: "Product Manager, Enterprise",
    department: "Product",
    location: "Dubai, UAE",
    type: "Full-time",
    experience: "5+ years",
    salary: "AED 40,000 - 60,000/month",
    description: "Drive the strategy and execution of ALSAMOS enterprise products, working with global customers to solve their most complex challenges.",
    responsibilities: [
      "Define product vision and roadmap for enterprise segment",
      "Gather and prioritize customer requirements",
      "Work closely with engineering to deliver features",
      "Analyze metrics and make data-driven decisions",
      "Present to executives and key stakeholders",
      "Manage relationships with strategic customers"
    ],
    requirements: [
      "5+ years product management experience",
      "Background in enterprise B2B products",
      "Strong analytical and problem-solving skills",
      "Experience with agile development methodologies",
      "Excellent written and verbal communication",
      "MBA or technical degree preferred"
    ],
    benefits: [
      "Competitive tax-free salary",
      "Annual performance bonus",
      "Premium health insurance",
      "Housing allowance",
      "Annual flight allowance",
      "Education assistance for children"
    ],
    posted: "2024-01-04"
  },
  {
    id: "5",
    slug: "marketing-manager",
    title: "Digital Marketing Manager",
    department: "Marketing",
    location: "Singapore",
    type: "Full-time",
    experience: "4+ years",
    salary: "SGD 8,000 - 12,000/month",
    description: "Lead digital marketing initiatives across APAC, driving brand awareness and customer acquisition for ALSAMOS products.",
    responsibilities: [
      "Develop and execute digital marketing strategies",
      "Manage paid advertising campaigns across platforms",
      "Analyze campaign performance and optimize ROI",
      "Collaborate with content team on marketing assets",
      "Build and manage marketing automation workflows",
      "Report on KPIs and present to leadership"
    ],
    requirements: [
      "4+ years digital marketing experience",
      "Proven track record of successful campaigns",
      "Experience with Google Ads, Meta, LinkedIn advertising",
      "Strong analytical skills and data-driven mindset",
      "Familiarity with marketing automation tools",
      "Experience in B2B tech marketing preferred"
    ],
    benefits: [
      "Competitive salary package",
      "Annual performance bonus",
      "Health and dental coverage",
      "Flexible work arrangements",
      "Professional development budget",
      "Central Singapore office location"
    ],
    posted: "2024-01-02"
  },
  {
    id: "6",
    slug: "data-scientist",
    title: "Data Scientist",
    department: "Research & Development",
    location: "Tashkent, Uzbekistan",
    type: "Full-time",
    experience: "3+ years",
    description: "Apply advanced analytics and machine learning to extract insights from data and drive innovation across ALSAMOS products.",
    responsibilities: [
      "Analyze large datasets to identify trends and patterns",
      "Build predictive models and ML algorithms",
      "Create data visualizations and dashboards",
      "Collaborate with product teams on data-driven features",
      "Design and run A/B tests and experiments",
      "Present findings to technical and non-technical audiences"
    ],
    requirements: [
      "MS/PhD in Data Science, Statistics, or related field",
      "3+ years hands-on data science experience",
      "Proficiency in Python, SQL, and ML frameworks",
      "Experience with big data technologies (Spark, etc.)",
      "Strong statistical and mathematical foundation",
      "Excellent problem-solving and communication skills"
    ],
    benefits: [
      "Competitive local salary",
      "International work opportunities",
      "Health insurance",
      "Professional development budget",
      "Modern Tashkent office",
      "Relocation assistance available"
    ],
    posted: "2023-12-28"
  },
  {
    id: "7",
    slug: "sales-executive",
    title: "Enterprise Sales Executive",
    department: "Sales",
    location: "Tokyo, Japan",
    type: "Full-time",
    experience: "5+ years",
    salary: "¥10M - 15M + Commission",
    description: "Drive revenue growth by selling ALSAMOS enterprise solutions to major corporations across Japan and the broader APAC region.",
    responsibilities: [
      "Identify and pursue new enterprise opportunities",
      "Manage full sales cycle from prospecting to close",
      "Build relationships with C-level executives",
      "Achieve and exceed quarterly revenue targets",
      "Collaborate with solutions engineers on proposals",
      "Maintain accurate forecasts and CRM records"
    ],
    requirements: [
      "5+ years enterprise software sales experience",
      "Proven track record of exceeding quotas",
      "Experience selling to Japanese enterprises",
      "Native Japanese and business English fluency",
      "Strong presentation and negotiation skills",
      "Bachelor's degree required"
    ],
    benefits: [
      "Competitive base + uncapped commission",
      "Stock options",
      "Comprehensive benefits package",
      "Annual President's Club trip",
      "Professional development opportunities",
      "Prime Tokyo office location"
    ],
    posted: "2023-12-25"
  },
  {
    id: "8",
    slug: "software-intern",
    title: "Software Engineering Intern",
    department: "Engineering",
    location: "San Francisco, USA",
    type: "Internship",
    experience: "Students",
    salary: "$8,000 - $10,000/month",
    description: "Join ALSAMOS for a summer internship and work on real projects that impact millions of users while learning from world-class engineers.",
    responsibilities: [
      "Work on meaningful projects with real impact",
      "Collaborate with experienced engineers",
      "Participate in code reviews and team meetings",
      "Present your work to the broader team",
      "Learn our tech stack and development practices",
      "Contribute to open source projects"
    ],
    requirements: [
      "Currently pursuing BS/MS in Computer Science",
      "Strong fundamentals in data structures and algorithms",
      "Proficiency in at least one programming language",
      "Previous internship or project experience",
      "Strong problem-solving abilities",
      "Available for 12-week summer program"
    ],
    benefits: [
      "Competitive internship compensation",
      "Housing assistance for relocating interns",
      "Meals and snacks provided",
      "Intern events and activities",
      "Mentorship program",
      "Potential full-time offer"
    ],
    posted: "2023-12-20"
  }
];

export const companyBenefits = [
  {
    icon: "Heart",
    title: "Health & Wellness",
    description: "Comprehensive health, dental, and vision insurance plus wellness programs"
  },
  {
    icon: "Wallet",
    title: "Competitive Pay",
    description: "Top-of-market compensation with equity packages and performance bonuses"
  },
  {
    icon: "Calendar",
    title: "Time Off",
    description: "Generous PTO policy, paid holidays, and flexible work arrangements"
  },
  {
    icon: "GraduationCap",
    title: "Learning",
    description: "Annual learning budget, conference attendance, and internal training"
  },
  {
    icon: "Home",
    title: "Remote Work",
    description: "Flexible remote work options with home office setup allowance"
  },
  {
    icon: "Users",
    title: "Team Events",
    description: "Regular team offsites, company retreats, and social events"
  }
];

export const cultureValues = [
  {
    title: "Innovation First",
    description: "We push boundaries and challenge conventions to create breakthrough solutions."
  },
  {
    title: "Customer Obsessed",
    description: "Every decision starts with the question: how does this benefit our customers?"
  },
  {
    title: "Collaborative Spirit",
    description: "We believe the best ideas emerge when diverse perspectives come together."
  },
  {
    title: "Continuous Growth",
    description: "We're committed to learning, improving, and helping each other develop."
  }
];
