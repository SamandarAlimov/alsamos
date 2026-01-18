export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  featured: boolean;
  image: string;
  tags: string[];
}

export const newsCategories = [
  "All",
  "Technology",
  "Company News",
  "Industry",
  "Investor Alerts",
  "Products",
  "Innovation"
];

export const newsArticles: NewsArticle[] = [
  {
    id: "1",
    slug: "alsamos-launches-next-gen-ai-platform",
    title: "ALSAMOS Launches Next-Generation AI Platform",
    excerpt: "Revolutionary AI platform promises to transform enterprise operations with unprecedented capabilities.",
    content: `ALSAMOS Corporation today announced the launch of its next-generation artificial intelligence platform, marking a significant milestone in the company's mission to democratize AI technology for businesses worldwide.

The new platform, developed over three years by ALSAMOS's elite team of AI researchers, introduces breakthrough capabilities in natural language processing, computer vision, and predictive analytics. Early adopters report efficiency gains of up to 300% in automated processes.

"This launch represents the culmination of our vision to make enterprise AI accessible and practical," said the ALSAMOS development team. "We've focused on creating a platform that delivers immediate value while being easy to deploy and scale."

Key features of the new platform include:
- Advanced natural language understanding with 99.7% accuracy
- Real-time video analysis capabilities
- Predictive maintenance algorithms
- Seamless integration with existing enterprise systems

The platform is available immediately for enterprise customers, with a tiered pricing model designed to accommodate organizations of all sizes.`,
    category: "Technology",
    author: "ALSAMOS News Team",
    authorRole: "Editorial",
    date: "2024-01-15",
    readTime: "5 min",
    featured: true,
    image: "/placeholder.svg",
    tags: ["AI", "Technology", "Product Launch", "Enterprise"]
  },
  {
    id: "2",
    slug: "record-breaking-q4-results",
    title: "ALSAMOS Reports Record-Breaking Q4 Results",
    excerpt: "Company exceeds analyst expectations with 45% year-over-year revenue growth.",
    content: `ALSAMOS Corporation announced exceptional fourth-quarter results today, with revenue growing 45% year-over-year to reach $2.8 billion, significantly exceeding analyst expectations.

The strong performance was driven by robust demand across all major business segments, with particularly notable growth in the AI and cloud services divisions. The company also reported a 52% increase in enterprise customers, bringing the total to over 15,000 organizations worldwide.

"These results reflect the trust our customers place in ALSAMOS solutions," commented the investor relations team. "We're seeing accelerating adoption across industries as organizations recognize the transformative potential of our integrated technology platform."

Key Q4 highlights include:
- Revenue: $2.8B (up 45% YoY)
- Operating Margin: 28% (up 3 points)
- Free Cash Flow: $680M
- New Enterprise Customers: 2,400+
- R&D Investment: $420M

Looking ahead, ALSAMOS raised its full-year guidance and announced plans to expand operations in emerging markets.`,
    category: "Investor Alerts",
    author: "Investor Relations",
    authorRole: "Finance",
    date: "2024-01-12",
    readTime: "4 min",
    featured: true,
    image: "/placeholder.svg",
    tags: ["Earnings", "Finance", "Growth", "Investors"]
  },
  {
    id: "3",
    slug: "partnership-with-global-universities",
    title: "ALSAMOS Partners with 50 Leading Universities",
    excerpt: "New education initiative aims to train 1 million students in emerging technologies.",
    content: `ALSAMOS Corporation today announced a groundbreaking partnership with 50 of the world's leading universities to launch the "Future Skills Initiative," an ambitious program designed to train 1 million students in emerging technologies over the next five years.

The initiative will provide students with free access to ALSAMOS's educational platform, industry certifications, and mentorship from ALSAMOS professionals. Participating universities span six continents and include some of the most prestigious institutions in technology education.

"Education is the foundation of innovation," said ALSAMOS's education division. "By partnering with world-class universities, we can ensure the next generation of technologists has the skills needed to drive progress in AI, robotics, and sustainable technologies."

The program includes:
- Free access to ALSAMOS EduPlatform
- Industry-recognized certifications
- Internship opportunities
- Research collaboration grants
- Annual technology symposiums

Applications for the first cohort open next month, with courses beginning in the fall semester.`,
    category: "Company News",
    author: "Education Team",
    authorRole: "Education Division",
    date: "2024-01-10",
    readTime: "6 min",
    featured: false,
    image: "/placeholder.svg",
    tags: ["Education", "Partnership", "Universities", "Skills"]
  },
  {
    id: "4",
    slug: "autonomous-vehicle-milestone",
    title: "ALSAMOS Autonomous Vehicles Complete 10 Million Miles",
    excerpt: "Safety-first approach yields zero serious incidents across entire testing program.",
    content: `ALSAMOS's autonomous vehicle division announced today that its fleet has completed 10 million miles of real-world testing with zero serious incidents, setting a new industry benchmark for safety in self-driving technology.

The milestone comes after three years of extensive testing across diverse environments, including urban centers, highways, and challenging weather conditions. The achievement validates ALSAMOS's conservative, safety-first approach to autonomous vehicle development.

"Safety is not negotiable," emphasized the autonomous vehicle team. "Every mile driven has contributed valuable data to our AI systems, making our vehicles progressively safer and more capable."

Testing highlights include:
- 10 million miles completed
- Zero serious incidents
- 50+ cities tested
- All weather conditions
- 99.99% system reliability

The company plans to begin limited public trials in select markets later this year, pending regulatory approval.`,
    category: "Industry",
    author: "Automotive Team",
    authorRole: "Autonomous Vehicles Division",
    date: "2024-01-08",
    readTime: "5 min",
    featured: false,
    image: "/placeholder.svg",
    tags: ["Autonomous Vehicles", "Safety", "Testing", "Milestone"]
  },
  {
    id: "5",
    slug: "sustainable-manufacturing-initiative",
    title: "ALSAMOS Commits to Carbon-Neutral Manufacturing by 2030",
    excerpt: "Comprehensive sustainability roadmap includes $500M investment in green technologies.",
    content: `ALSAMOS Corporation today unveiled its most ambitious sustainability initiative to date, committing to achieve carbon-neutral manufacturing operations across all facilities by 2030.

The initiative, backed by a $500 million investment over six years, includes transitioning to 100% renewable energy, implementing advanced recycling programs, and developing new sustainable materials for product manufacturing.

"Climate action is a business imperative," stated the sustainability division. "We're not just reducing our footprint—we're pioneering new approaches that can be adopted across industries."

Key commitments include:
- 100% renewable energy by 2028
- Zero-waste manufacturing by 2029
- Carbon-neutral operations by 2030
- $500M green technology investment
- Supplier sustainability standards

The company will publish annual progress reports and has committed to third-party verification of all sustainability metrics.`,
    category: "Company News",
    author: "Sustainability Team",
    authorRole: "ESG Division",
    date: "2024-01-05",
    readTime: "4 min",
    featured: false,
    image: "/placeholder.svg",
    tags: ["Sustainability", "Environment", "Green Tech", "ESG"]
  },
  {
    id: "6",
    slug: "medical-ai-breakthrough",
    title: "ALSAMOS Medical AI Achieves 99.9% Cancer Detection Accuracy",
    excerpt: "Clinical trials demonstrate breakthrough performance in early-stage cancer detection.",
    content: `ALSAMOS's healthcare division announced breakthrough results from clinical trials of its medical AI system, demonstrating 99.9% accuracy in detecting early-stage cancers across multiple cancer types.

The AI system, developed in collaboration with leading oncology centers worldwide, analyzed over 500,000 medical images during the trial period. The results represent a significant improvement over current diagnostic methods and could revolutionize cancer screening programs.

"Early detection saves lives," said the healthcare team. "Our AI system can identify cancers at stages where treatment is most effective, potentially saving millions of lives annually."

Trial results show:
- 99.9% detection accuracy
- 500,000+ images analyzed
- 12 cancer types detected
- 40% faster diagnosis
- FDA breakthrough designation pending

The company is now working with regulatory agencies worldwide to bring the technology to clinical practice.`,
    category: "Innovation",
    author: "Healthcare Team",
    authorRole: "Medical Division",
    date: "2024-01-03",
    readTime: "5 min",
    featured: true,
    image: "/placeholder.svg",
    tags: ["Healthcare", "AI", "Cancer", "Medical", "Innovation"]
  },
  {
    id: "7",
    slug: "satellite-constellation-expansion",
    title: "ALSAMOS to Double Satellite Constellation by Year-End",
    excerpt: "Expansion will provide global high-speed internet coverage to underserved regions.",
    content: `ALSAMOS Aerospace announced plans to double its satellite constellation from 500 to 1,000 satellites by year-end, significantly expanding high-speed internet coverage to underserved regions worldwide.

The expansion includes launching satellites optimized for polar and equatorial regions, ensuring truly global coverage. The company has secured launch contracts with multiple providers to execute the ambitious timeline.

"Connectivity is a human right," declared the aerospace division. "Our expanded constellation will bring high-speed internet to the 3 billion people currently without reliable access."

Expansion details include:
- 500 new satellites launching
- Global coverage by December
- 500 Mbps speeds worldwide
- Latency under 20ms
- Affordable pricing for developing regions

ALSAMOS is also partnering with governments and NGOs to subsidize connectivity for education and healthcare applications in low-income regions.`,
    category: "Products",
    author: "Aerospace Team",
    authorRole: "Space Division",
    date: "2024-01-01",
    readTime: "4 min",
    featured: false,
    image: "/placeholder.svg",
    tags: ["Aerospace", "Satellites", "Internet", "Global Coverage"]
  },
  {
    id: "8",
    slug: "robotics-factory-opens",
    title: "ALSAMOS Opens World's Largest Robotics Manufacturing Facility",
    excerpt: "New 2-million square foot facility will produce 100,000 robots annually.",
    content: `ALSAMOS officially opened its new robotics manufacturing facility today, the largest of its kind globally, with capacity to produce 100,000 advanced robots annually.

The 2-million square foot facility features cutting-edge automation, with robots building robots in a showcase of ALSAMOS's manufacturing capabilities. The facility will create 5,000 high-skilled jobs and serve customers in over 80 countries.

"This facility represents the future of manufacturing," said the robotics division. "By scaling our production capabilities, we can make advanced robotics accessible to businesses of all sizes."

Facility highlights:
- 2 million square feet
- 100,000 annual capacity
- 5,000 new jobs
- 95% automated production
- Zero-emission operations

The first robots from the new facility will ship to customers next month, with the company already reporting a 200% increase in pre-orders.`,
    category: "Company News",
    author: "Robotics Team",
    authorRole: "Manufacturing Division",
    date: "2023-12-28",
    readTime: "5 min",
    featured: false,
    image: "/placeholder.svg",
    tags: ["Robotics", "Manufacturing", "Jobs", "Expansion"]
  }
];
