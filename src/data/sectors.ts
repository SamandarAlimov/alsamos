export interface Sector {
  id: string;
  name: string;
  slug: string;
  subdomain: string;
  icon: string;
  description: string;
  fullDescription: string;
  gradient: string;
  metrics: {
    label: string;
    value: string;
  }[];
  products: {
    name: string;
    description: string;
    image: string;
  }[];
  caseStudies: {
    title: string;
    description: string;
    result: string;
  }[];
}

export const getSectorBySlug = (slug: string): Sector | undefined => {
  return sectors.find(sector => sector.slug === slug);
};

export const sectors: Sector[] = [
  // CORE SERVICES (11)
  {
    id: "office",
    name: "Office Suite",
    slug: "office",
    subdomain: "office.alsamos.com",
    icon: "FileText",
    description: "Complete productivity suite with documents, spreadsheets, presentations, and collaboration tools.",
    fullDescription: "ALSAMOS Office is a comprehensive cloud-based productivity platform offering word processing, spreadsheets, presentations, and real-time collaboration. Our AI-powered tools enhance productivity for individuals and enterprises worldwide.",
    gradient: "from-blue-600 to-indigo-600",
    metrics: [
      { label: "Active Users", value: "500M+" },
      { label: "Documents Created", value: "10B+" },
      { label: "Enterprise Clients", value: "50K+" },
      { label: "Languages", value: "100+" }
    ],
    products: [
      { name: "ALSAMOS Docs", description: "AI-powered word processor", image: "/placeholder.svg" },
      { name: "ALSAMOS Sheets", description: "Advanced spreadsheets", image: "/placeholder.svg" },
      { name: "ALSAMOS Slides", description: "Presentation creator", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Enterprise Migration", description: "Fortune 500 company migration to ALSAMOS Office", result: "40% productivity increase, $10M annual savings" },
      { title: "Education Deployment", description: "Nationwide school system adoption", result: "5M students using collaborative tools" }
    ]
  },
  {
    id: "weather",
    name: "Weather Services",
    slug: "weather",
    subdomain: "weather.alsamos.com",
    icon: "CloudSun",
    description: "Hyper-accurate weather forecasting powered by AI and global satellite networks.",
    fullDescription: "ALSAMOS Weather provides the world's most accurate weather predictions using AI, satellite data, and IoT sensors. Our forecasts power aviation, agriculture, logistics, and daily planning for billions of users.",
    gradient: "from-sky-500 to-blue-500",
    metrics: [
      { label: "Daily Users", value: "200M+" },
      { label: "Weather Stations", value: "100K+" },
      { label: "Accuracy Rate", value: "98.5%" },
      { label: "Forecast Range", value: "30 days" }
    ],
    products: [
      { name: "WeatherAI", description: "AI-powered forecasting", image: "/placeholder.svg" },
      { name: "StormAlert", description: "Severe weather warnings", image: "/placeholder.svg" },
      { name: "AgriWeather", description: "Agriculture-specific forecasts", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Aviation Safety", description: "Weather integration for airlines", result: "60% reduction in weather delays" },
      { title: "Disaster Prevention", description: "Early warning systems for natural disasters", result: "10M+ people evacuated safely" }
    ]
  },
  {
    id: "lms",
    name: "Learning Management",
    slug: "lms",
    subdomain: "lms.alsamos.com",
    icon: "BookOpen",
    description: "Advanced learning management system for schools, universities, and corporate training.",
    fullDescription: "ALSAMOS LMS is a comprehensive learning platform featuring course management, virtual classrooms, AI tutoring, and certification systems. We power education for millions of learners worldwide.",
    gradient: "from-emerald-500 to-green-500",
    metrics: [
      { label: "Learners", value: "100M+" },
      { label: "Courses", value: "500K+" },
      { label: "Institutions", value: "25K+" },
      { label: "Certifications", value: "50M+" }
    ],
    products: [
      { name: "VirtualClass", description: "Live online classrooms", image: "/placeholder.svg" },
      { name: "AI Tutor", description: "Personalized learning assistant", image: "/placeholder.svg" },
      { name: "SkillPath", description: "Career development tracks", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "University Digital Transformation", description: "Complete online learning infrastructure", result: "300K students learning online seamlessly" },
      { title: "Corporate Training Platform", description: "Employee skill development system", result: "85% completion rate, 40% skill improvement" }
    ]
  },
  {
    id: "eats",
    name: "Food Delivery",
    slug: "eats",
    subdomain: "eats.alsamos.com",
    icon: "Pizza",
    description: "On-demand food delivery from restaurants, groceries, and cloud kitchens.",
    fullDescription: "ALSAMOS Eats connects hungry customers with their favorite restaurants and groceries. Our AI-optimized delivery network ensures fast, fresh delivery while supporting local businesses and sustainable practices.",
    gradient: "from-orange-500 to-red-500",
    metrics: [
      { label: "Orders/Day", value: "50M+" },
      { label: "Restaurant Partners", value: "1M+" },
      { label: "Delivery Partners", value: "5M+" },
      { label: "Cities", value: "10K+" }
    ],
    products: [
      { name: "QuickDelivery", description: "30-minute delivery guarantee", image: "/placeholder.svg" },
      { name: "CloudKitchen", description: "Virtual restaurant platform", image: "/placeholder.svg" },
      { name: "GroceryNow", description: "Instant grocery delivery", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Autonomous Delivery", description: "Drone and robot delivery network", result: "1M+ autonomous deliveries, 50% faster" },
      { title: "Restaurant Recovery", description: "Supporting local restaurants post-pandemic", result: "100K+ restaurants increased revenue 200%" }
    ]
  },
  {
    id: "go",
    name: "Transportation",
    slug: "go",
    subdomain: "go.alsamos.com",
    icon: "Navigation",
    description: "Ride-hailing, car rentals, public transit, and multimodal transportation.",
    fullDescription: "ALSAMOS Go provides seamless mobility solutions from ride-hailing to public transit integration. Our platform optimizes urban transportation while reducing emissions and traffic congestion.",
    gradient: "from-green-500 to-teal-500",
    metrics: [
      { label: "Daily Rides", value: "100M+" },
      { label: "Driver Partners", value: "10M+" },
      { label: "Cities", value: "5K+" },
      { label: "EV Fleet", value: "2M+" }
    ],
    products: [
      { name: "GoRide", description: "On-demand ride-hailing", image: "/placeholder.svg" },
      { name: "GoRental", description: "Car sharing and rentals", image: "/placeholder.svg" },
      { name: "GoTransit", description: "Public transit integration", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "City Mobility Hub", description: "Integrated transport for smart cities", result: "40% traffic reduction, 60% emission decrease" },
      { title: "Electric Fleet Transition", description: "Converting ride-hail fleet to EVs", result: "2M electric vehicles, carbon-neutral operations" }
    ]
  },
  {
    id: "search",
    name: "Search Engine",
    slug: "search",
    subdomain: "search.alsamos.com",
    icon: "Search",
    description: "AI-powered search engine with privacy-first approach and intelligent results.",
    fullDescription: "ALSAMOS Search delivers accurate, unbiased search results while protecting user privacy. Our AI understands context and intent, providing comprehensive answers across web, images, videos, and more.",
    gradient: "from-purple-500 to-violet-500",
    metrics: [
      { label: "Daily Searches", value: "5B+" },
      { label: "Index Size", value: "500B+ pages" },
      { label: "Languages", value: "200+" },
      { label: "Response Time", value: "<100ms" }
    ],
    products: [
      { name: "SearchAI", description: "Conversational search", image: "/placeholder.svg" },
      { name: "ImageSearch", description: "Visual search engine", image: "/placeholder.svg" },
      { name: "ScholarSearch", description: "Academic research search", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Privacy-First Search", description: "Zero-tracking search engine deployment", result: "100M+ privacy-conscious users" },
      { title: "Enterprise Knowledge Search", description: "Internal document search for corporations", result: "70% faster information retrieval" }
    ]
  },
  {
    id: "social",
    name: "Social Network",
    slug: "social",
    subdomain: "social.alsamos.com",
    icon: "Users",
    description: "Social networking platform connecting people, communities, and ideas.",
    fullDescription: "ALSAMOS Social creates meaningful connections through innovative social features, communities, and content sharing. We prioritize mental health, authentic interactions, and user safety.",
    gradient: "from-pink-500 to-rose-500",
    metrics: [
      { label: "Active Users", value: "2B+" },
      { label: "Posts/Day", value: "1B+" },
      { label: "Communities", value: "50M+" },
      { label: "Content Moderation", value: "99.9%" }
    ],
    products: [
      { name: "SocialFeed", description: "Personalized content stream", image: "/placeholder.svg" },
      { name: "Communities", description: "Interest-based groups", image: "/placeholder.svg" },
      { name: "LiveConnect", description: "Real-time video sharing", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Mental Health Initiative", description: "AI-powered wellness features", result: "30% reduction in harmful content exposure" },
      { title: "Creator Economy", description: "Monetization for content creators", result: "$5B+ paid to creators annually" }
    ]
  },
  {
    id: "accounts",
    name: "Identity & Accounts",
    slug: "accounts",
    subdomain: "accounts.alsamos.com",
    icon: "UserCheck",
    description: "Secure identity management, single sign-on, and authentication services.",
    fullDescription: "ALSAMOS Accounts provides secure, seamless identity management across all ALSAMOS services. Our passwordless authentication and biometric security protect billions of user accounts.",
    gradient: "from-slate-500 to-gray-600",
    metrics: [
      { label: "Protected Accounts", value: "3B+" },
      { label: "Daily Logins", value: "500M+" },
      { label: "Security Incidents", value: "0.001%" },
      { label: "Biometric Users", value: "1B+" }
    ],
    products: [
      { name: "SecureID", description: "Biometric authentication", image: "/placeholder.svg" },
      { name: "SingleSign", description: "Universal SSO solution", image: "/placeholder.svg" },
      { name: "PrivacyVault", description: "Personal data management", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Government Digital ID", description: "National digital identity system", result: "100M citizens with secure digital IDs" },
      { title: "Enterprise Zero Trust", description: "Corporate security transformation", result: "99.99% unauthorized access prevention" }
    ]
  },
  {
    id: "mail",
    name: "Email Services",
    slug: "mail",
    subdomain: "mail.alsamos.com",
    icon: "Mail",
    description: "Secure, intelligent email with AI-powered organization and collaboration.",
    fullDescription: "ALSAMOS Mail delivers enterprise-grade email with AI assistance, end-to-end encryption, and seamless integration with ALSAMOS productivity tools. Smart features save hours of email management time.",
    gradient: "from-blue-500 to-cyan-500",
    metrics: [
      { label: "Active Mailboxes", value: "1B+" },
      { label: "Emails/Day", value: "10B+" },
      { label: "Spam Blocked", value: "99.9%" },
      { label: "Storage", value: "Unlimited" }
    ],
    products: [
      { name: "SmartInbox", description: "AI-organized email", image: "/placeholder.svg" },
      { name: "SecureMail", description: "Encrypted communications", image: "/placeholder.svg" },
      { name: "MailAssist", description: "AI email writing", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Enterprise Migration", description: "Large-scale email system migration", result: "500K mailboxes migrated with zero downtime" },
      { title: "AI Productivity Boost", description: "Smart email features deployment", result: "2 hours saved per user weekly" }
    ]
  },
  {
    id: "news",
    name: "News Platform",
    slug: "news",
    subdomain: "news.alsamos.com",
    icon: "Newspaper",
    description: "Personalized news aggregation with verified sources and fact-checking.",
    fullDescription: "ALSAMOS News delivers trustworthy, personalized news from verified sources worldwide. Our AI curates content while fighting misinformation, ensuring users stay informed with accurate information.",
    gradient: "from-red-500 to-rose-500",
    metrics: [
      { label: "Daily Readers", value: "500M+" },
      { label: "News Sources", value: "100K+" },
      { label: "Articles/Day", value: "10M+" },
      { label: "Fact Checks", value: "1M+/day" }
    ],
    products: [
      { name: "NewsFeed", description: "Personalized news stream", image: "/placeholder.svg" },
      { name: "FactCheck", description: "AI verification system", image: "/placeholder.svg" },
      { name: "LocalNews", description: "Hyperlocal coverage", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Misinformation Combat", description: "AI-powered fact-checking at scale", result: "90% reduction in viral misinformation" },
      { title: "Local Journalism Support", description: "Funding local news organizations", result: "5K+ local newsrooms supported" }
    ]
  },
  {
    id: "islam",
    name: "Islamic Services",
    slug: "islam",
    subdomain: "islam.alsamos.com",
    icon: "Moon",
    description: "Comprehensive Islamic apps including prayer times, Quran, and Hajj services.",
    fullDescription: "ALSAMOS Islam provides digital services for the Muslim community including accurate prayer times, Quran with translations, Hajj/Umrah guidance, and halal services. We serve Muslims worldwide with authentic, technology-enhanced religious tools.",
    gradient: "from-emerald-600 to-teal-600",
    metrics: [
      { label: "Users", value: "100M+" },
      { label: "Prayer Notifications", value: "1B+/day" },
      { label: "Quran Recitations", value: "50M+/day" },
      { label: "Languages", value: "50+" }
    ],
    products: [
      { name: "PrayerTime Pro", description: "Accurate prayer times globally", image: "/placeholder.svg" },
      { name: "Quran Digital", description: "Interactive Quran with tafsir", image: "/placeholder.svg" },
      { name: "HajjGuide", description: "Complete pilgrimage assistant", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Hajj Digital Experience", description: "Technology-enhanced pilgrimage services", result: "2M+ pilgrims assisted annually" },
      { title: "Quran Learning Platform", description: "Online Quran education for all ages", result: "10M+ students learning Quran online" }
    ]
  },
  {
    id: "valley",
    name: "Startup Valley",
    slug: "valley",
    subdomain: "valley.alsamos.com",
    icon: "Rocket",
    description: "Startup incubator, accelerator programs, and venture funding platform.",
    fullDescription: "ALSAMOS Valley is the premier startup ecosystem providing incubation, acceleration, mentorship, and funding for innovative startups. We've launched thousands of successful companies and invested billions in the next generation of entrepreneurs.",
    gradient: "from-orange-500 to-amber-500",
    metrics: [
      { label: "Startups Incubated", value: "50K+" },
      { label: "Total Funding", value: "$100B+" },
      { label: "Unicorns Created", value: "500+" },
      { label: "Mentor Network", value: "10K+" }
    ],
    products: [
      { name: "LaunchPad", description: "Startup incubator program", image: "/placeholder.svg" },
      { name: "VentureFund", description: "Seed to Series funding", image: "/placeholder.svg" },
      { name: "MentorConnect", description: "Expert mentorship platform", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Unicorn Factory", description: "Creating billion-dollar startups", result: "500+ unicorns valued at $2T+" },
      { title: "Global Expansion", description: "Helping startups go international", result: "1000+ startups in 50+ countries" }
    ]
  },
  {
    id: "translate",
    name: "Translation Services",
    slug: "translate",
    subdomain: "translate.alsamos.com",
    icon: "Languages",
    description: "AI-powered translation and localization for 200+ languages.",
    fullDescription: "ALSAMOS Translate provides instant, accurate translation across 200+ languages using advanced neural machine translation. From documents to real-time conversations, we break down language barriers worldwide.",
    gradient: "from-indigo-500 to-purple-500",
    metrics: [
      { label: "Languages", value: "200+" },
      { label: "Daily Translations", value: "10B+" },
      { label: "Accuracy Rate", value: "99%+" },
      { label: "Enterprise Clients", value: "100K+" }
    ],
    products: [
      { name: "InstantTranslate", description: "Real-time translation", image: "/placeholder.svg" },
      { name: "DocTranslate", description: "Document translation", image: "/placeholder.svg" },
      { name: "VoiceTranslate", description: "Speech-to-speech translation", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "UN Conference Translation", description: "Real-time multilingual translation", result: "192 countries, 6 official languages seamlessly" },
      { title: "Global E-commerce Localization", description: "Marketplace translation at scale", result: "500M+ product listings translated" }
    ]
  },
  {
    id: "music",
    name: "Music Streaming",
    slug: "music",
    subdomain: "music.alsamos.com",
    icon: "Music",
    description: "Music streaming, podcasts, and audio content platform.",
    fullDescription: "ALSAMOS Music delivers unlimited music streaming with 100M+ tracks, podcasts, and original audio content. Our AI-powered recommendations and high-fidelity audio create the ultimate listening experience.",
    gradient: "from-green-500 to-emerald-500",
    metrics: [
      { label: "Active Users", value: "500M+" },
      { label: "Tracks", value: "100M+" },
      { label: "Podcasts", value: "5M+" },
      { label: "Artists", value: "10M+" }
    ],
    products: [
      { name: "MusicPro", description: "Hi-Fi streaming", image: "/placeholder.svg" },
      { name: "PodcastHub", description: "Podcast platform", image: "/placeholder.svg" },
      { name: "ArtistStudio", description: "Creator tools", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Artist Fair Pay", description: "Equitable royalty distribution", result: "$10B+ paid to artists annually" },
      { title: "Spatial Audio", description: "Immersive 3D audio experience", result: "50M+ spatial audio listeners" }
    ]
  },
  {
    id: "library",
    name: "Digital Library",
    slug: "library",
    subdomain: "library.alsamos.com",
    icon: "Library",
    description: "E-books, audiobooks, academic journals, and digital archives.",
    fullDescription: "ALSAMOS Library provides access to millions of e-books, audiobooks, academic papers, and historical archives. We democratize knowledge access with AI-powered reading and research tools.",
    gradient: "from-amber-600 to-yellow-500",
    metrics: [
      { label: "E-books", value: "50M+" },
      { label: "Audiobooks", value: "5M+" },
      { label: "Academic Papers", value: "200M+" },
      { label: "Daily Readers", value: "100M+" }
    ],
    products: [
      { name: "ReadAnywhere", description: "Cross-device e-reader", image: "/placeholder.svg" },
      { name: "AudioBooks", description: "AI-narrated audiobooks", image: "/placeholder.svg" },
      { name: "ScholarAccess", description: "Academic database", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Global Literacy Initiative", description: "Free books for developing nations", result: "1B+ free books distributed" },
      { title: "University Partnership", description: "Academic library digitization", result: "1000+ universities connected" }
    ]
  },
  {
    id: "travel",
    name: "Travel & Booking",
    slug: "travel",
    subdomain: "travel.alsamos.com",
    icon: "Plane",
    description: "Flight, hotel, and vacation booking with AI travel planning.",
    fullDescription: "ALSAMOS Travel is your complete travel companion offering flights, hotels, car rentals, and experiences. Our AI travel planner creates personalized itineraries while finding the best deals worldwide.",
    gradient: "from-blue-500 to-sky-500",
    metrics: [
      { label: "Bookings/Year", value: "500M+" },
      { label: "Hotels", value: "5M+" },
      { label: "Airlines", value: "500+" },
      { label: "Destinations", value: "200K+" }
    ],
    products: [
      { name: "FlightFinder", description: "Best flight deals", image: "/placeholder.svg" },
      { name: "StayBooker", description: "Hotel reservations", image: "/placeholder.svg" },
      { name: "TripPlanner", description: "AI travel assistant", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Sustainable Travel", description: "Carbon-neutral booking options", result: "10M+ carbon-offset bookings" },
      { title: "Business Travel Management", description: "Corporate travel optimization", result: "30% cost reduction for enterprises" }
    ]
  },
  {
    id: "tv",
    name: "TV & Streaming",
    slug: "tv",
    subdomain: "tv.alsamos.com",
    icon: "Tv",
    description: "Video streaming, live TV, and original content production.",
    fullDescription: "ALSAMOS TV delivers premium entertainment with movies, series, live TV, and award-winning original productions. Our platform offers 4K HDR streaming and personalized recommendations.",
    gradient: "from-red-600 to-rose-500",
    metrics: [
      { label: "Subscribers", value: "300M+" },
      { label: "Movies & Shows", value: "500K+" },
      { label: "Originals", value: "5K+" },
      { label: "Live Channels", value: "1K+" }
    ],
    products: [
      { name: "StreamPro", description: "4K HDR streaming", image: "/placeholder.svg" },
      { name: "LiveTV", description: "Real-time broadcasting", image: "/placeholder.svg" },
      { name: "KidsZone", description: "Children's content", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Global Content Delivery", description: "Worldwide streaming infrastructure", result: "99.99% uptime, 200+ countries" },
      { title: "Original Productions", description: "Award-winning content creation", result: "50+ Emmy and Oscar nominations" }
    ]
  },
  {
    id: "erp",
    name: "Enterprise Resource Planning",
    slug: "erp",
    subdomain: "erp.alsamos.com",
    icon: "Building2",
    description: "Complete ERP solutions for business management and operations.",
    fullDescription: "ALSAMOS ERP provides comprehensive enterprise resource planning with modules for finance, HR, supply chain, manufacturing, and CRM. Our cloud-native platform scales from SMBs to global enterprises.",
    gradient: "from-slate-600 to-zinc-700",
    metrics: [
      { label: "Enterprise Clients", value: "500K+" },
      { label: "Users", value: "50M+" },
      { label: "Transactions/Day", value: "1B+" },
      { label: "Integrations", value: "5K+" }
    ],
    products: [
      { name: "FinanceCore", description: "Financial management", image: "/placeholder.svg" },
      { name: "HRCloud", description: "Human resources", image: "/placeholder.svg" },
      { name: "SupplyChain", description: "Supply chain management", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Manufacturing Excellence", description: "End-to-end manufacturing ERP", result: "40% operational efficiency gain" },
      { title: "Global Retail Deployment", description: "Omnichannel retail ERP", result: "10K+ stores connected worldwide" }
    ]
  },
  {
    id: "messenger",
    name: "Messaging Platform",
    slug: "messenger",
    subdomain: "messenger.alsamos.com",
    icon: "MessageCircle",
    description: "Secure instant messaging, video calls, and team collaboration.",
    fullDescription: "ALSAMOS Messenger provides end-to-end encrypted messaging, HD video calls, and team collaboration tools. From personal chats to enterprise communication, we keep conversations secure and seamless.",
    gradient: "from-violet-500 to-purple-600",
    metrics: [
      { label: "Active Users", value: "2B+" },
      { label: "Messages/Day", value: "100B+" },
      { label: "Video Calls/Day", value: "500M+" },
      { label: "Business Accounts", value: "100M+" }
    ],
    products: [
      { name: "ChatPro", description: "Encrypted messaging", image: "/placeholder.svg" },
      { name: "VideoMeet", description: "HD video conferencing", image: "/placeholder.svg" },
      { name: "TeamSpace", description: "Workspace collaboration", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Enterprise Communication", description: "Corporate messaging platform", result: "Fortune 500 companies connected" },
      { title: "Privacy First", description: "Zero-knowledge encryption", result: "100% message privacy guaranteed" }
    ]
  },

  // TECHNOLOGY & IT (15)
  {
    id: "it",
    name: "Information Technology",
    slug: "it",
    subdomain: "it.alsamos.com",
    icon: "Monitor",
    description: "Cutting-edge software solutions, cloud infrastructure, and digital transformation services.",
    fullDescription: "ALSAMOS IT division leads the global technology revolution with innovative software development, cloud computing solutions, cybersecurity services, and enterprise digital transformation. Our team of 5,000+ engineers builds the future of technology.",
    gradient: "from-blue-500 to-cyan-500",
    metrics: [
      { label: "Active Projects", value: "2,500+" },
      { label: "Cloud Users", value: "50M+" },
      { label: "Data Centers", value: "45" },
      { label: "Engineers", value: "5,000+" }
    ],
    products: [
      { name: "ALSAMOS Cloud", description: "Enterprise cloud platform", image: "/placeholder.svg" },
      { name: "SecureShield", description: "AI-powered cybersecurity", image: "/placeholder.svg" },
      { name: "DataFlow", description: "Big data analytics suite", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Global Bank Digital Transformation", description: "Complete digital overhaul for a Fortune 500 bank", result: "40% cost reduction, 200% efficiency increase" },
      { title: "Smart City Infrastructure", description: "IoT network for metropolitan city management", result: "Connected 10M+ devices across 500 sq km" }
    ]
  },
  {
    id: "ai",
    name: "Artificial Intelligence",
    slug: "ai",
    subdomain: "ai.alsamos.com",
    icon: "Brain",
    description: "Machine learning, neural networks, and intelligent automation systems.",
    fullDescription: "ALSAMOS AI develops cutting-edge artificial intelligence systems including large language models, computer vision, and autonomous decision-making platforms. Our AI powers solutions across all ALSAMOS sectors.",
    gradient: "from-cyan-500 to-blue-500",
    metrics: [
      { label: "AI Models", value: "1,000+" },
      { label: "Daily Predictions", value: "10B+" },
      { label: "Research Papers", value: "5,000+" },
      { label: "AI Researchers", value: "3,000+" }
    ],
    products: [
      { name: "ALSAMOS GPT", description: "Advanced language model", image: "/placeholder.svg" },
      { name: "VisionAI", description: "Computer vision platform", image: "/placeholder.svg" },
      { name: "AutoML Suite", description: "Automated machine learning", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Predictive Healthcare", description: "AI system predicting diseases before symptoms", result: "95% accuracy, 2M+ early interventions" },
      { title: "Smart Manufacturing", description: "AI-optimized production lines", result: "60% efficiency increase, 90% defect reduction" }
    ]
  },
  {
    id: "robotics",
    name: "Robotics",
    slug: "robotics",
    subdomain: "robotics.alsamos.com",
    icon: "Bot",
    description: "Industrial robots, humanoid assistants, and automation systems.",
    fullDescription: "ALSAMOS Robotics creates intelligent machines that work alongside humans. From industrial automation to humanoid assistants, our robots are transforming manufacturing, healthcare, and daily life.",
    gradient: "from-slate-500 to-zinc-500",
    metrics: [
      { label: "Robots Deployed", value: "100K+" },
      { label: "Factory Partners", value: "5,000+" },
      { label: "Robot Models", value: "200+" },
      { label: "Patents", value: "8,000+" }
    ],
    products: [
      { name: "Atlas Pro", description: "Humanoid robot assistant", image: "/placeholder.svg" },
      { name: "IndustrialArm X", description: "Precision manufacturing robot", image: "/placeholder.svg" },
      { name: "HomeBot", description: "Domestic assistance robot", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Automotive Assembly Line", description: "Full robotic automation for car manufacturing", result: "500% productivity increase, zero defects" },
      { title: "Hospital Robot Fleet", description: "Autonomous hospital logistics and assistance", result: "30% staff efficiency improvement" }
    ]
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    slug: "cybersecurity",
    subdomain: "security.alsamos.com",
    icon: "Shield",
    description: "Enterprise security, threat detection, and digital protection services.",
    fullDescription: "ALSAMOS Cybersecurity protects organizations worldwide with AI-powered threat detection, zero-trust architecture, and comprehensive security solutions. We safeguard critical infrastructure and sensitive data.",
    gradient: "from-red-600 to-orange-600",
    metrics: [
      { label: "Protected Endpoints", value: "500M+" },
      { label: "Threats Blocked/Day", value: "10B+" },
      { label: "Security Analysts", value: "5K+" },
      { label: "Zero-Day Discoveries", value: "1K+/year" }
    ],
    products: [
      { name: "ThreatShield", description: "AI threat detection", image: "/placeholder.svg" },
      { name: "ZeroTrust Platform", description: "Enterprise security architecture", image: "/placeholder.svg" },
      { name: "CyberSOC", description: "24/7 security operations", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Nation-State Defense", description: "Critical infrastructure protection", result: "100% prevention of advanced persistent threats" },
      { title: "Enterprise Ransomware Prevention", description: "Comprehensive ransomware defense", result: "Zero successful ransomware attacks" }
    ]
  },
  {
    id: "blockchain",
    name: "Blockchain & Web3",
    slug: "blockchain",
    subdomain: "blockchain.alsamos.com",
    icon: "Link",
    description: "Blockchain infrastructure, DeFi, NFTs, and decentralized applications.",
    fullDescription: "ALSAMOS Blockchain builds decentralized infrastructure for the future of finance and digital ownership. Our platforms enable secure, transparent transactions and innovative Web3 applications.",
    gradient: "from-purple-600 to-indigo-600",
    metrics: [
      { label: "Transactions/Day", value: "100M+" },
      { label: "Total Value Locked", value: "$50B+" },
      { label: "Active Wallets", value: "50M+" },
      { label: "dApps Built", value: "10K+" }
    ],
    products: [
      { name: "ALSAMOS Chain", description: "Enterprise blockchain platform", image: "/placeholder.svg" },
      { name: "DeFi Suite", description: "Decentralized finance tools", image: "/placeholder.svg" },
      { name: "NFT Marketplace", description: "Digital collectibles platform", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Supply Chain Transparency", description: "Blockchain-based supply chain tracking", result: "100% product traceability for 1M+ SKUs" },
      { title: "Central Bank Digital Currency", description: "National CBDC implementation", result: "50M+ citizens using digital currency" }
    ]
  },
  {
    id: "cloud",
    name: "Cloud Computing",
    slug: "cloud",
    subdomain: "cloud.alsamos.com",
    icon: "Cloud",
    description: "Enterprise cloud infrastructure, serverless computing, and managed services.",
    fullDescription: "ALSAMOS Cloud provides world-class cloud infrastructure with global data centers, serverless computing, and AI-optimized resources. We power millions of applications with industry-leading reliability.",
    gradient: "from-sky-500 to-indigo-500",
    metrics: [
      { label: "Data Centers", value: "100+" },
      { label: "Uptime", value: "99.999%" },
      { label: "Customers", value: "10M+" },
      { label: "Regions", value: "50+" }
    ],
    products: [
      { name: "CloudCompute", description: "Scalable virtual machines", image: "/placeholder.svg" },
      { name: "ServerlessAI", description: "AI-optimized functions", image: "/placeholder.svg" },
      { name: "DataLake", description: "Managed data storage", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Streaming Platform Migration", description: "Global streaming service cloud migration", result: "50% cost reduction, 5x performance improvement" },
      { title: "AI Training Infrastructure", description: "GPU clusters for AI research", result: "10x faster model training" }
    ]
  },
  {
    id: "iot",
    name: "Internet of Things",
    slug: "iot",
    subdomain: "iot.alsamos.com",
    icon: "Cpu",
    description: "Connected devices, sensors, and smart infrastructure platforms.",
    fullDescription: "ALSAMOS IoT connects billions of devices worldwide with secure, intelligent platforms. From smart homes to industrial sensors, we enable the connected future with reliable, scalable solutions.",
    gradient: "from-teal-500 to-cyan-500",
    metrics: [
      { label: "Connected Devices", value: "10B+" },
      { label: "Data Points/Day", value: "100T+" },
      { label: "Industrial Partners", value: "50K+" },
      { label: "Smart Cities", value: "500+" }
    ],
    products: [
      { name: "IoT Hub", description: "Device management platform", image: "/placeholder.svg" },
      { name: "EdgeCompute", description: "Edge processing units", image: "/placeholder.svg" },
      { name: "SensorNet", description: "Industrial sensor network", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Smart Factory", description: "Complete factory IoT deployment", result: "40% efficiency increase, predictive maintenance" },
      { title: "Agricultural IoT", description: "Precision farming sensors", result: "30% water savings, 25% yield increase" }
    ]
  },
  {
    id: "quantum",
    name: "Quantum Computing",
    slug: "quantum",
    subdomain: "quantum.alsamos.com",
    icon: "Atom",
    description: "Quantum processors, algorithms, and quantum-safe cryptography.",
    fullDescription: "ALSAMOS Quantum pioneers the quantum computing revolution with advanced processors, quantum algorithms, and quantum-safe security solutions. We're solving previously impossible problems.",
    gradient: "from-violet-600 to-purple-600",
    metrics: [
      { label: "Qubits", value: "1,000+" },
      { label: "Quantum Volume", value: "1M+" },
      { label: "Research Papers", value: "500+" },
      { label: "Patents", value: "2,000+" }
    ],
    products: [
      { name: "QuantumProcessor", description: "Commercial quantum computer", image: "/placeholder.svg" },
      { name: "QuantumCloud", description: "Quantum computing as a service", image: "/placeholder.svg" },
      { name: "PostQuantum", description: "Quantum-safe encryption", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Drug Discovery", description: "Quantum molecular simulation", result: "10x faster drug candidate identification" },
      { title: "Financial Optimization", description: "Quantum portfolio optimization", result: "15% improved returns" }
    ]
  },
  {
    id: "5g",
    name: "5G & Telecommunications",
    slug: "5g",
    subdomain: "5g.alsamos.com",
    icon: "Radio",
    description: "5G networks, telecommunications infrastructure, and connectivity solutions.",
    fullDescription: "ALSAMOS 5G builds the connectivity infrastructure of tomorrow with ultra-fast 5G networks, satellite communications, and next-generation telecom solutions serving billions globally.",
    gradient: "from-blue-600 to-violet-600",
    metrics: [
      { label: "5G Towers", value: "500K+" },
      { label: "Coverage", value: "3B+ people" },
      { label: "Network Speed", value: "10Gbps" },
      { label: "Latency", value: "<1ms" }
    ],
    products: [
      { name: "5G Core", description: "Next-gen network infrastructure", image: "/placeholder.svg" },
      { name: "SatLink", description: "Satellite connectivity", image: "/placeholder.svg" },
      { name: "NetworkAI", description: "AI network optimization", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Smart City 5G", description: "City-wide 5G deployment", result: "100% coverage, enabling smart services" },
      { title: "Rural Connectivity", description: "Bringing internet to remote areas", result: "100M+ people connected for first time" }
    ]
  },
  {
    id: "semiconductor",
    name: "Semiconductors",
    slug: "semiconductor",
    subdomain: "chips.alsamos.com",
    icon: "Microchip",
    description: "Advanced chip design, manufacturing, and semiconductor research.",
    fullDescription: "ALSAMOS Semiconductors designs and manufactures cutting-edge chips powering everything from smartphones to AI supercomputers. Our 2nm process technology leads the industry.",
    gradient: "from-gray-600 to-slate-600",
    metrics: [
      { label: "Chips/Year", value: "10B+" },
      { label: "Process Node", value: "2nm" },
      { label: "Fab Plants", value: "12" },
      { label: "R&D Investment", value: "$20B+/year" }
    ],
    products: [
      { name: "ALSAMOS A-Series", description: "Mobile processors", image: "/placeholder.svg" },
      { name: "AI Accelerator", description: "AI training chips", image: "/placeholder.svg" },
      { name: "QuantumChip", description: "Quantum processor units", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "AI Chip Development", description: "Next-gen AI accelerators", result: "10x performance per watt improvement" },
      { title: "Automotive Chips", description: "Chips for autonomous vehicles", result: "Powers 50% of autonomous cars" }
    ]
  },
  {
    id: "software",
    name: "Software Development",
    slug: "software",
    subdomain: "software.alsamos.com",
    icon: "Code",
    description: "Custom software development, enterprise applications, and developer tools.",
    fullDescription: "ALSAMOS Software develops world-class applications and provides developer tools that power millions of applications. From enterprise software to consumer apps, we build the digital world.",
    gradient: "from-green-600 to-emerald-600",
    metrics: [
      { label: "Developers", value: "50K+" },
      { label: "Apps Built", value: "100K+" },
      { label: "API Calls/Day", value: "100B+" },
      { label: "Code Commits", value: "1M+/day" }
    ],
    products: [
      { name: "DevPlatform", description: "Integrated development environment", image: "/placeholder.svg" },
      { name: "APIHub", description: "Enterprise API management", image: "/placeholder.svg" },
      { name: "CodeAssist", description: "AI coding assistant", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Enterprise Modernization", description: "Legacy system transformation", result: "80% faster development cycles" },
      { title: "Startup Accelerator", description: "Platform for rapid app development", result: "1000+ startups launched" }
    ]
  },
  {
    id: "data",
    name: "Data Analytics",
    slug: "data",
    subdomain: "data.alsamos.com",
    icon: "BarChart3",
    description: "Big data processing, business intelligence, and predictive analytics.",
    fullDescription: "ALSAMOS Data transforms raw data into actionable insights with powerful analytics platforms, AI-driven predictions, and real-time business intelligence serving enterprises worldwide.",
    gradient: "from-indigo-500 to-blue-500",
    metrics: [
      { label: "Data Processed", value: "1 Exabyte/day" },
      { label: "Dashboards", value: "10M+" },
      { label: "Predictions/Day", value: "1B+" },
      { label: "Data Scientists", value: "10K+" }
    ],
    products: [
      { name: "DataFlow", description: "Real-time data pipeline", image: "/placeholder.svg" },
      { name: "InsightAI", description: "Automated analytics", image: "/placeholder.svg" },
      { name: "PredictEngine", description: "Predictive modeling platform", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Retail Analytics", description: "Customer behavior analysis", result: "35% increase in conversion rates" },
      { title: "Financial Risk Analysis", description: "Real-time risk monitoring", result: "$2B in prevented losses" }
    ]
  },
  {
    id: "vr",
    name: "Virtual Reality",
    slug: "vr",
    subdomain: "vr.alsamos.com",
    icon: "Glasses",
    description: "VR/AR hardware, metaverse platforms, and immersive experiences.",
    fullDescription: "ALSAMOS VR creates immersive virtual and augmented reality experiences with cutting-edge hardware and software. From gaming to enterprise training, we're building the metaverse.",
    gradient: "from-fuchsia-500 to-purple-500",
    metrics: [
      { label: "VR Devices Sold", value: "50M+" },
      { label: "Metaverse Users", value: "200M+" },
      { label: "VR Experiences", value: "100K+" },
      { label: "Enterprise Clients", value: "10K+" }
    ],
    products: [
      { name: "ALSAMOS VR Pro", description: "Premium VR headset", image: "/placeholder.svg" },
      { name: "Metaverse", description: "Social VR platform", image: "/placeholder.svg" },
      { name: "AR Glasses", description: "Augmented reality eyewear", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Virtual Training", description: "Enterprise VR training platform", result: "75% faster skill acquisition" },
      { title: "Virtual Tourism", description: "Immersive travel experiences", result: "10M+ virtual tourists annually" }
    ]
  },
  {
    id: "gaming",
    name: "Gaming",
    slug: "gaming",
    subdomain: "gaming.alsamos.com",
    icon: "Gamepad2",
    description: "Video games, gaming platforms, esports, and interactive entertainment.",
    fullDescription: "ALSAMOS Gaming creates world-class video games and gaming platforms. From AAA titles to mobile games, esports arenas to cloud gaming, we deliver entertainment for billions of players.",
    gradient: "from-purple-600 to-pink-600",
    metrics: [
      { label: "Active Players", value: "1B+" },
      { label: "Games Published", value: "500+" },
      { label: "Esports Events", value: "1K+/year" },
      { label: "Prize Pools", value: "$500M+/year" }
    ],
    products: [
      { name: "GameCloud", description: "Cloud gaming platform", image: "/placeholder.svg" },
      { name: "ALSAMOS Console", description: "Next-gen gaming console", image: "/placeholder.svg" },
      { name: "Esports Arena", description: "Competitive gaming platform", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Global Esports League", description: "International esports competition", result: "500M viewers, $100M prize pool" },
      { title: "Mobile Gaming Revolution", description: "Free-to-play mobile games", result: "500M downloads, $1B revenue" }
    ]
  },
  {
    id: "database",
    name: "Database Systems",
    slug: "database",
    subdomain: "database.alsamos.com",
    icon: "Database",
    description: "Enterprise databases, data warehousing, and storage solutions.",
    fullDescription: "ALSAMOS Database provides enterprise-grade database solutions from relational to NoSQL, data warehouses to real-time databases. We store and manage the world's most critical data.",
    gradient: "from-orange-500 to-amber-500",
    metrics: [
      { label: "Databases Managed", value: "10M+" },
      { label: "Data Stored", value: "100 Exabytes" },
      { label: "Queries/Second", value: "1T+" },
      { label: "Uptime", value: "99.9999%" }
    ],
    products: [
      { name: "CloudDB", description: "Managed database service", image: "/placeholder.svg" },
      { name: "RealtimeDB", description: "Real-time synchronization", image: "/placeholder.svg" },
      { name: "DataWarehouse", description: "Enterprise data warehouse", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Financial Trading Platform", description: "Ultra-low latency database", result: "Microsecond query response times" },
      { title: "Social Media Scale", description: "Handling billions of users", result: "1M transactions per second" }
    ]
  },

  // EDUCATION (5)
  {
    id: "education",
    name: "Education",
    slug: "education",
    subdomain: "edu.alsamos.com",
    icon: "GraduationCap",
    description: "World-class educational institutions from kindergarten to university level.",
    fullDescription: "ALSAMOS Education encompasses a complete educational ecosystem including kindergartens, schools, lyceums, and universities. We're shaping the next generation of innovators with cutting-edge curriculum and state-of-the-art facilities.",
    gradient: "from-emerald-500 to-teal-500",
    metrics: [
      { label: "Students", value: "500K+" },
      { label: "Institutions", value: "1,200" },
      { label: "Teachers", value: "45K+" },
      { label: "Countries", value: "35" }
    ],
    products: [
      { name: "EduPlatform", description: "Digital learning management", image: "/placeholder.svg" },
      { name: "Campus VR", description: "Virtual reality classrooms", image: "/placeholder.svg" },
      { name: "SmartBoard", description: "Interactive learning displays", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Digital Campus Transformation", description: "Complete digitalization of 500 schools", result: "30% improvement in student outcomes" },
      { title: "Rural Education Initiative", description: "Bringing quality education to remote areas", result: "100K+ students gained access to quality education" }
    ]
  },
  {
    id: "university",
    name: "Universities",
    slug: "university",
    subdomain: "university.alsamos.com",
    icon: "School",
    description: "World-class universities and higher education institutions.",
    fullDescription: "ALSAMOS Universities provide world-class higher education with cutting-edge research facilities, industry partnerships, and global campuses preparing students for the future.",
    gradient: "from-blue-600 to-indigo-600",
    metrics: [
      { label: "Universities", value: "50+" },
      { label: "Students", value: "500K+" },
      { label: "Research Papers", value: "50K+/year" },
      { label: "Nobel Laureates", value: "25" }
    ],
    products: [
      { name: "ResearchHub", description: "Collaborative research platform", image: "/placeholder.svg" },
      { name: "GlobalCampus", description: "Virtual university experience", image: "/placeholder.svg" },
      { name: "CareerBridge", description: "Industry placement program", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Global Research Network", description: "International research collaboration", result: "1000+ groundbreaking discoveries" },
      { title: "Industry Partnership", description: "Corporate-academic collaboration", result: "95% graduate employment rate" }
    ]
  },
  {
    id: "edtech",
    name: "EdTech",
    slug: "edtech",
    subdomain: "edtech.alsamos.com",
    icon: "Laptop",
    description: "Educational technology, online learning, and digital classroom solutions.",
    fullDescription: "ALSAMOS EdTech develops innovative educational technology solutions from AI tutors to virtual labs, transforming how the world learns with personalized, accessible education.",
    gradient: "from-cyan-500 to-blue-500",
    metrics: [
      { label: "Online Learners", value: "200M+" },
      { label: "Courses", value: "1M+" },
      { label: "AI Tutoring Sessions", value: "1B+/year" },
      { label: "Certifications", value: "100M+" }
    ],
    products: [
      { name: "AI Tutor", description: "Personalized learning AI", image: "/placeholder.svg" },
      { name: "VirtualLab", description: "Online science labs", image: "/placeholder.svg" },
      { name: "SkillPath", description: "Career skill development", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Personalized Learning at Scale", description: "AI-adapted curriculum", result: "50% faster learning outcomes" },
      { title: "Accessibility Initiative", description: "Education for all abilities", result: "10M+ learners with disabilities served" }
    ]
  },
  {
    id: "library",
    name: "Digital Libraries",
    slug: "library",
    subdomain: "library.alsamos.com",
    icon: "Library",
    description: "Digital libraries, e-books, academic journals, and knowledge archives.",
    fullDescription: "ALSAMOS Library provides the world's largest digital library with millions of e-books, academic journals, and historical archives. We make knowledge accessible to everyone, everywhere.",
    gradient: "from-amber-600 to-orange-600",
    metrics: [
      { label: "Digital Books", value: "100M+" },
      { label: "Academic Journals", value: "50K+" },
      { label: "Monthly Readers", value: "500M+" },
      { label: "Languages", value: "200+" }
    ],
    products: [
      { name: "eReader", description: "Premium e-book reader", image: "/placeholder.svg" },
      { name: "ScholarAccess", description: "Academic research portal", image: "/placeholder.svg" },
      { name: "AudioBooks", description: "AI-narrated audiobooks", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Universal Access Initiative", description: "Free books for developing nations", result: "1B+ free book downloads" },
      { title: "Academic Democratization", description: "Open access to research", result: "100% open access to funded research" }
    ]
  },
  {
    id: "training",
    name: "Corporate Training",
    slug: "training",
    subdomain: "training.alsamos.com",
    icon: "UserCog",
    description: "Professional development, corporate training, and certification programs.",
    fullDescription: "ALSAMOS Training provides comprehensive corporate learning solutions with customized programs, certifications, and continuous professional development for enterprises worldwide.",
    gradient: "from-violet-500 to-purple-500",
    metrics: [
      { label: "Trained Professionals", value: "50M+" },
      { label: "Corporate Clients", value: "100K+" },
      { label: "Certifications Awarded", value: "10M+" },
      { label: "Training Programs", value: "50K+" }
    ],
    products: [
      { name: "LearnPro", description: "Corporate LMS", image: "/placeholder.svg" },
      { name: "SkillAssess", description: "Competency evaluation", image: "/placeholder.svg" },
      { name: "LeaderPath", description: "Leadership development", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Global Workforce Upskilling", description: "Mass digital skills training", result: "10M workers upskilled in AI/tech" },
      { title: "Leadership Pipeline", description: "Executive development program", result: "80% internal promotion rate" }
    ]
  },

  // HEALTHCARE (8)
  {
    id: "medicine",
    name: "Medicine & Healthcare",
    slug: "medicine",
    subdomain: "med.alsamos.com",
    icon: "Heart",
    description: "Advanced healthcare solutions, medical research, and hospital networks.",
    fullDescription: "ALSAMOS Healthcare operates world-class hospitals, research centers, and pharmaceutical facilities. Our mission is to revolutionize healthcare through AI diagnostics, robotic surgery, and personalized medicine.",
    gradient: "from-red-500 to-pink-500",
    metrics: [
      { label: "Hospitals", value: "150+" },
      { label: "Patients/Year", value: "25M+" },
      { label: "Research Labs", value: "80" },
      { label: "Medical Staff", value: "100K+" }
    ],
    products: [
      { name: "MediScan AI", description: "AI diagnostic imaging", image: "/placeholder.svg" },
      { name: "RoboSurgeon", description: "Robotic surgery systems", image: "/placeholder.svg" },
      { name: "HealthTrack", description: "Patient monitoring platform", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "AI Cancer Detection", description: "Early detection system achieving 99% accuracy", result: "50,000+ early diagnoses, 95% survival rate improvement" },
      { title: "Telemedicine Network", description: "Remote healthcare for underserved regions", result: "5M+ consultations delivered remotely" }
    ]
  },
  {
    id: "pharma",
    name: "Pharmaceuticals",
    slug: "pharma",
    subdomain: "pharma.alsamos.com",
    icon: "Pill",
    description: "Drug discovery, pharmaceutical manufacturing, and clinical research.",
    fullDescription: "ALSAMOS Pharma develops life-saving medications through AI-accelerated drug discovery, precision manufacturing, and rigorous clinical trials. We're making medicines more effective and accessible.",
    gradient: "from-green-500 to-emerald-500",
    metrics: [
      { label: "Drugs Developed", value: "500+" },
      { label: "Patients Treated", value: "1B+" },
      { label: "Clinical Trials", value: "1,000+" },
      { label: "R&D Investment", value: "$10B+/year" }
    ],
    products: [
      { name: "DrugDiscoveryAI", description: "AI drug development", image: "/placeholder.svg" },
      { name: "GenomeRx", description: "Personalized medicine", image: "/placeholder.svg" },
      { name: "VaccineX", description: "Rapid vaccine platform", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Pandemic Response", description: "Rapid vaccine development", result: "Vaccine developed in 6 months, 2B doses" },
      { title: "Rare Disease Treatment", description: "Gene therapy for rare conditions", result: "100+ orphan drugs developed" }
    ]
  },
  {
    id: "biotech",
    name: "Biotechnology",
    slug: "biotech",
    subdomain: "biotech.alsamos.com",
    icon: "Dna",
    description: "Gene therapy, synthetic biology, and biomanufacturing.",
    fullDescription: "ALSAMOS Biotech pioneers breakthrough biotechnologies from CRISPR gene editing to synthetic biology, creating solutions for health, agriculture, and environmental challenges.",
    gradient: "from-lime-500 to-green-500",
    metrics: [
      { label: "Gene Therapies", value: "100+" },
      { label: "Patents", value: "5,000+" },
      { label: "Research Scientists", value: "10K+" },
      { label: "Biotech Facilities", value: "50+" }
    ],
    products: [
      { name: "GeneEdit Pro", description: "CRISPR platform", image: "/placeholder.svg" },
      { name: "SynthBio Lab", description: "Synthetic biology toolkit", image: "/placeholder.svg" },
      { name: "BioManufacture", description: "Bioproduction systems", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Hereditary Disease Cure", description: "Gene therapy for genetic disorders", result: "10,000+ patients cured of hereditary blindness" },
      { title: "Sustainable Materials", description: "Bio-based materials production", result: "Replacing 50% of petroleum plastics" }
    ]
  },
  {
    id: "medtech",
    name: "Medical Devices",
    slug: "medtech",
    subdomain: "medtech.alsamos.com",
    icon: "Stethoscope",
    description: "Medical devices, diagnostic equipment, and healthcare technology.",
    fullDescription: "ALSAMOS MedTech develops innovative medical devices from AI-powered diagnostics to robotic surgery systems, improving patient outcomes and healthcare efficiency worldwide.",
    gradient: "from-blue-500 to-cyan-500",
    metrics: [
      { label: "Devices Deployed", value: "10M+" },
      { label: "Hospitals Served", value: "50K+" },
      { label: "Lives Saved", value: "100M+" },
      { label: "FDA Approvals", value: "500+" }
    ],
    products: [
      { name: "DiagnosticAI", description: "AI diagnostic systems", image: "/placeholder.svg" },
      { name: "SurgicalRobot", description: "Precision surgery robots", image: "/placeholder.svg" },
      { name: "WearableHealth", description: "Health monitoring devices", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Remote Surgery", description: "Telesurgery across continents", result: "First successful intercontinental surgery" },
      { title: "Early Detection", description: "AI cancer screening", result: "95% accuracy, 40% earlier detection" }
    ]
  },
  {
    id: "dental",
    name: "Dental Care",
    slug: "dental",
    subdomain: "dental.alsamos.com",
    icon: "Smile",
    description: "Dental clinics, orthodontics, and oral health technology.",
    fullDescription: "ALSAMOS Dental provides comprehensive oral healthcare through advanced clinics, AI-powered diagnostics, and innovative treatment technologies for healthy smiles worldwide.",
    gradient: "from-cyan-500 to-teal-500",
    metrics: [
      { label: "Dental Clinics", value: "5K+" },
      { label: "Patients/Year", value: "50M+" },
      { label: "Dentists", value: "50K+" },
      { label: "AI Diagnostics", value: "10M+/year" }
    ],
    products: [
      { name: "DentalAI", description: "AI dental diagnostics", image: "/placeholder.svg" },
      { name: "SmileClear", description: "Invisible aligners", image: "/placeholder.svg" },
      { name: "3D DentPrint", description: "3D printed dental solutions", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "AI Cavity Detection", description: "Early cavity identification", result: "50% earlier detection, 30% cost reduction" },
      { title: "Remote Dental Care", description: "Teledentistry for underserved areas", result: "5M+ patients in remote areas served" }
    ]
  },
  {
    id: "mental",
    name: "Mental Health",
    slug: "mental",
    subdomain: "mental.alsamos.com",
    icon: "HeartPulse",
    description: "Mental health services, therapy platforms, and wellness programs.",
    fullDescription: "ALSAMOS Mental Health provides accessible mental healthcare through therapy platforms, AI-assisted support, and comprehensive wellness programs, reducing stigma and improving lives.",
    gradient: "from-purple-500 to-pink-500",
    metrics: [
      { label: "Therapists", value: "100K+" },
      { label: "Sessions/Year", value: "50M+" },
      { label: "App Users", value: "100M+" },
      { label: "Crisis Interventions", value: "1M+/year" }
    ],
    products: [
      { name: "TherapyConnect", description: "Online therapy platform", image: "/placeholder.svg" },
      { name: "MindAI", description: "AI mental health support", image: "/placeholder.svg" },
      { name: "WellnessTrack", description: "Mental wellness monitoring", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Corporate Wellness", description: "Employee mental health program", result: "40% reduction in burnout, 25% productivity increase" },
      { title: "Youth Mental Health", description: "Teen support platform", result: "60% reduction in crisis incidents" }
    ]
  },
  {
    id: "elderly",
    name: "Elderly Care",
    slug: "elderly",
    subdomain: "elderly.alsamos.com",
    icon: "HeartHandshake",
    description: "Senior care facilities, assisted living, and aging-in-place technology.",
    fullDescription: "ALSAMOS Elderly Care provides dignified senior living solutions with advanced facilities, home care technology, and AI-powered health monitoring for our aging population.",
    gradient: "from-rose-500 to-pink-500",
    metrics: [
      { label: "Care Facilities", value: "2K+" },
      { label: "Seniors Served", value: "5M+" },
      { label: "Home Care Users", value: "10M+" },
      { label: "Caregivers", value: "500K+" }
    ],
    products: [
      { name: "SeniorWatch", description: "Health monitoring wearables", image: "/placeholder.svg" },
      { name: "HomeAssist", description: "Aging-in-place technology", image: "/placeholder.svg" },
      { name: "CareConnect", description: "Family caregiver platform", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Fall Prevention", description: "AI fall detection and prevention", result: "70% reduction in fall injuries" },
      { title: "Memory Care Innovation", description: "Technology for dementia patients", result: "50% improvement in quality of life metrics" }
    ]
  },
  {
    id: "wellness",
    name: "Wellness & Fitness",
    slug: "wellness",
    subdomain: "wellness.alsamos.com",
    icon: "Dumbbell",
    description: "Fitness centers, wellness programs, and health optimization services.",
    fullDescription: "ALSAMOS Wellness operates premium fitness centers and wellness platforms promoting holistic health through exercise, nutrition, and mindfulness for optimal living.",
    gradient: "from-orange-500 to-red-500",
    metrics: [
      { label: "Fitness Centers", value: "10K+" },
      { label: "Members", value: "50M+" },
      { label: "App Users", value: "200M+" },
      { label: "Trainers", value: "500K+" }
    ],
    products: [
      { name: "FitTrack", description: "Fitness tracking platform", image: "/placeholder.svg" },
      { name: "NutriAI", description: "AI nutrition planning", image: "/placeholder.svg" },
      { name: "MindfulApp", description: "Meditation and wellness", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Corporate Fitness", description: "Workplace wellness programs", result: "30% reduction in health insurance costs" },
      { title: "Digital Fitness Revolution", description: "Home workout platform", result: "100M+ home workouts during pandemic" }
    ]
  },

  // FINANCE & BUSINESS (10)
  {
    id: "finance",
    name: "Finance & Banking",
    slug: "finance",
    subdomain: "finance.alsamos.com",
    icon: "Wallet",
    description: "Digital banking, fintech solutions, and investment platforms.",
    fullDescription: "ALSAMOS Finance revolutionizes the financial industry with digital banking, blockchain technology, and AI-powered investment platforms. We make financial services accessible, secure, and intelligent.",
    gradient: "from-green-500 to-emerald-500",
    metrics: [
      { label: "Users", value: "100M+" },
      { label: "Transactions/Day", value: "500M+" },
      { label: "Assets Managed", value: "$500B+" },
      { label: "Countries", value: "180+" }
    ],
    products: [
      { name: "ALSAMOS Pay", description: "Digital payment platform", image: "/placeholder.svg" },
      { name: "InvestAI", description: "AI investment advisor", image: "/placeholder.svg" },
      { name: "BlockChain Vault", description: "Secure digital assets", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Financial Inclusion Initiative", description: "Banking services for unbanked populations", result: "50M+ people gained access to banking" },
      { title: "AI Trading Platform", description: "Automated investment management", result: "25% average annual returns for users" }
    ]
  },
  {
    id: "insurance",
    name: "Insurance",
    slug: "insurance",
    subdomain: "insurance.alsamos.com",
    icon: "ShieldCheck",
    description: "Life, health, auto, and property insurance with AI-powered claims.",
    fullDescription: "ALSAMOS Insurance provides comprehensive coverage with AI-powered underwriting, instant claims processing, and personalized policies for individuals and businesses worldwide.",
    gradient: "from-blue-600 to-cyan-600",
    metrics: [
      { label: "Policies", value: "100M+" },
      { label: "Claims Processed", value: "50M+/year" },
      { label: "Coverage Value", value: "$10T+" },
      { label: "Countries", value: "150+" }
    ],
    products: [
      { name: "InstaClaim", description: "AI claims processing", image: "/placeholder.svg" },
      { name: "RiskAI", description: "Personalized underwriting", image: "/placeholder.svg" },
      { name: "InsureAll", description: "Comprehensive coverage platform", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Instant Claims", description: "AI-powered claims settlement", result: "90% of claims settled in minutes" },
      { title: "Microinsurance", description: "Affordable coverage for underserved", result: "50M+ newly insured individuals" }
    ]
  },
  {
    id: "investment",
    name: "Investment Management",
    slug: "investment",
    subdomain: "invest.alsamos.com",
    icon: "TrendingUp",
    description: "Asset management, venture capital, and wealth management services.",
    fullDescription: "ALSAMOS Investment manages trillions in assets through AI-driven strategies, sustainable investing, and personalized wealth management for institutions and individuals.",
    gradient: "from-emerald-600 to-green-600",
    metrics: [
      { label: "Assets Under Management", value: "$2T+" },
      { label: "Clients", value: "10M+" },
      { label: "Average Returns", value: "18%/year" },
      { label: "Investment Products", value: "5K+" }
    ],
    products: [
      { name: "WealthAI", description: "AI wealth management", image: "/placeholder.svg" },
      { name: "ESG Invest", description: "Sustainable investing", image: "/placeholder.svg" },
      { name: "RoboAdvisor", description: "Automated portfolio management", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Pension Fund Management", description: "AI-optimized retirement funds", result: "3% higher returns, lower volatility" },
      { title: "Impact Investing", description: "Profitable sustainable investments", result: "$100B+ in impact investments" }
    ]
  },
  {
    id: "realestate",
    name: "Real Estate",
    slug: "realestate",
    subdomain: "realestate.alsamos.com",
    icon: "Home",
    description: "Property development, real estate platforms, and property management.",
    fullDescription: "ALSAMOS Real Estate develops premium properties and operates the largest real estate platform with AI-powered valuations, virtual tours, and seamless transactions.",
    gradient: "from-amber-500 to-orange-500",
    metrics: [
      { label: "Properties Listed", value: "50M+" },
      { label: "Annual Transactions", value: "$500B+" },
      { label: "Developments", value: "1K+" },
      { label: "Countries", value: "100+" }
    ],
    products: [
      { name: "PropertyAI", description: "AI property valuation", image: "/placeholder.svg" },
      { name: "VirtualTour", description: "3D property viewing", image: "/placeholder.svg" },
      { name: "SmartBuild", description: "Property development platform", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Digital Property Transactions", description: "Blockchain-based property sales", result: "90% faster transactions, 50% lower costs" },
      { title: "Affordable Housing", description: "Large-scale affordable development", result: "1M+ affordable homes built" }
    ]
  },
  {
    id: "accounting",
    name: "Accounting & Tax",
    slug: "accounting",
    subdomain: "accounting.alsamos.com",
    icon: "Calculator",
    description: "Accounting software, tax services, and financial compliance.",
    fullDescription: "ALSAMOS Accounting provides comprehensive financial management with AI-powered bookkeeping, tax optimization, and compliance services for businesses of all sizes.",
    gradient: "from-slate-500 to-gray-600",
    metrics: [
      { label: "Business Clients", value: "10M+" },
      { label: "Transactions Processed", value: "10B+/year" },
      { label: "Tax Returns Filed", value: "100M+/year" },
      { label: "Compliance Rate", value: "99.99%" }
    ],
    products: [
      { name: "BookKeepAI", description: "Automated accounting", image: "/placeholder.svg" },
      { name: "TaxOptimize", description: "AI tax planning", image: "/placeholder.svg" },
      { name: "ComplianceHub", description: "Regulatory compliance", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "SMB Automation", description: "Automated accounting for small business", result: "80% reduction in bookkeeping time" },
      { title: "Global Tax Compliance", description: "Multi-jurisdiction tax management", result: "Zero compliance penalties for 100K+ clients" }
    ]
  },
  {
    id: "legal",
    name: "Legal Services",
    slug: "legal",
    subdomain: "legal.alsamos.com",
    icon: "Scale",
    description: "Legal tech, contract management, and legal services marketplace.",
    fullDescription: "ALSAMOS Legal democratizes legal services with AI-powered contract analysis, legal research, and access to qualified attorneys worldwide at affordable rates.",
    gradient: "from-indigo-600 to-blue-600",
    metrics: [
      { label: "Legal Professionals", value: "500K+" },
      { label: "Contracts Analyzed", value: "1B+" },
      { label: "Cases Handled", value: "10M+/year" },
      { label: "Countries", value: "180+" }
    ],
    products: [
      { name: "ContractAI", description: "AI contract analysis", image: "/placeholder.svg" },
      { name: "LegalResearch", description: "AI legal research", image: "/placeholder.svg" },
      { name: "LawyerConnect", description: "Legal services marketplace", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Contract Automation", description: "AI-powered contract review", result: "90% faster contract processing" },
      { title: "Access to Justice", description: "Affordable legal services", result: "10M+ underserved individuals helped" }
    ]
  },
  {
    id: "hr",
    name: "Human Resources",
    slug: "hr",
    subdomain: "hr.alsamos.com",
    icon: "Users2",
    description: "HR software, recruitment, and workforce management solutions.",
    fullDescription: "ALSAMOS HR transforms workforce management with AI-powered recruitment, employee engagement platforms, and comprehensive HR solutions for modern organizations.",
    gradient: "from-violet-500 to-purple-500",
    metrics: [
      { label: "Companies Served", value: "1M+" },
      { label: "Employees Managed", value: "500M+" },
      { label: "Hires/Year", value: "50M+" },
      { label: "AI Screenings", value: "1B+/year" }
    ],
    products: [
      { name: "TalentAI", description: "AI recruitment platform", image: "/placeholder.svg" },
      { name: "EngageHub", description: "Employee engagement", image: "/placeholder.svg" },
      { name: "PayrollPro", description: "Global payroll management", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "AI Recruitment", description: "Bias-free AI hiring", result: "40% more diverse hires, 50% faster recruitment" },
      { title: "Employee Retention", description: "Predictive engagement platform", result: "35% reduction in turnover" }
    ]
  },
  {
    id: "consulting",
    name: "Consulting",
    slug: "consulting",
    subdomain: "consulting.alsamos.com",
    icon: "Lightbulb",
    description: "Management consulting, strategy, and digital transformation services.",
    fullDescription: "ALSAMOS Consulting provides world-class management consulting with AI-enhanced insights, helping organizations navigate digital transformation and achieve strategic objectives.",
    gradient: "from-yellow-500 to-orange-500",
    metrics: [
      { label: "Consultants", value: "50K+" },
      { label: "Projects Completed", value: "100K+" },
      { label: "Client Satisfaction", value: "98%" },
      { label: "Countries", value: "150+" }
    ],
    products: [
      { name: "StrategyAI", description: "AI strategy insights", image: "/placeholder.svg" },
      { name: "TransformHub", description: "Digital transformation", image: "/placeholder.svg" },
      { name: "BenchmarkPro", description: "Industry benchmarking", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Digital Transformation", description: "Enterprise modernization", result: "300% ROI on transformation investments" },
      { title: "Operational Excellence", description: "Process optimization", result: "40% cost reduction across operations" }
    ]
  },
  {
    id: "marketplace",
    name: "Marketplace",
    slug: "marketplace",
    subdomain: "marketplace.alsamos.com",
    icon: "Store",
    description: "E-commerce platforms, online marketplaces, and retail technology.",
    fullDescription: "ALSAMOS Marketplace operates the world's largest e-commerce ecosystem connecting millions of sellers with billions of buyers through AI-powered discovery and seamless transactions.",
    gradient: "from-orange-500 to-red-500",
    metrics: [
      { label: "Sellers", value: "50M+" },
      { label: "Products", value: "1B+" },
      { label: "Daily Orders", value: "100M+" },
      { label: "Countries", value: "200+" }
    ],
    products: [
      { name: "SellerHub", description: "Merchant platform", image: "/placeholder.svg" },
      { name: "FulfillmentAI", description: "Smart logistics", image: "/placeholder.svg" },
      { name: "ShopAI", description: "Personalized shopping", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Small Business Empowerment", description: "Enabling global reach for SMBs", result: "10M+ small businesses selling globally" },
      { title: "Sustainable Commerce", description: "Carbon-neutral marketplace", result: "100% carbon-neutral shipping" }
    ]
  },
  {
    id: "payments",
    name: "Payment Solutions",
    slug: "payments",
    subdomain: "payments.alsamos.com",
    icon: "CreditCard",
    description: "Payment processing, digital wallets, and financial infrastructure.",
    fullDescription: "ALSAMOS Payments powers global commerce with instant payment processing, digital wallets, and financial infrastructure serving billions of transactions daily.",
    gradient: "from-teal-500 to-green-500",
    metrics: [
      { label: "Transactions/Day", value: "1B+" },
      { label: "Merchants", value: "100M+" },
      { label: "Payment Volume", value: "$10T+/year" },
      { label: "Countries", value: "200+" }
    ],
    products: [
      { name: "InstaPay", description: "Instant payments", image: "/placeholder.svg" },
      { name: "MerchantPro", description: "Payment processing", image: "/placeholder.svg" },
      { name: "WalletX", description: "Digital wallet", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Cross-Border Payments", description: "Instant international transfers", result: "90% reduction in transfer fees" },
      { title: "Financial Inclusion", description: "Mobile payments for unbanked", result: "100M+ first-time digital payment users" }
    ]
  },

  // MANUFACTURING & INDUSTRY (12)
  {
    id: "automotive",
    name: "Automotive",
    slug: "automotive",
    subdomain: "auto.alsamos.com",
    icon: "Car",
    description: "Electric vehicles, autonomous driving, and sustainable transportation.",
    fullDescription: "ALSAMOS Automotive is pioneering the future of mobility with electric vehicles, autonomous driving technology, and sustainable transportation solutions. Our vehicles combine luxury, performance, and environmental responsibility.",
    gradient: "from-orange-500 to-amber-500",
    metrics: [
      { label: "Vehicles Sold", value: "2M+" },
      { label: "Charging Stations", value: "50K+" },
      { label: "Factories", value: "12" },
      { label: "Patents", value: "5,000+" }
    ],
    products: [
      { name: "ALSAMOS EV-X", description: "Luxury electric sedan", image: "/placeholder.svg" },
      { name: "ALSAMOS Truck", description: "Electric commercial vehicle", image: "/placeholder.svg" },
      { name: "AutoPilot AI", description: "Autonomous driving system", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "City Fleet Electrification", description: "Converting municipal fleet to electric", result: "80% carbon reduction, $50M annual savings" },
      { title: "Autonomous Logistics", description: "Self-driving delivery network", result: "1M+ autonomous deliveries completed" }
    ]
  },
  {
    id: "aerospace",
    name: "Aerospace",
    slug: "aerospace",
    subdomain: "aero.alsamos.com",
    icon: "Rocket",
    description: "Space exploration, satellites, rockets, and aviation technology.",
    fullDescription: "ALSAMOS Aerospace pushes the boundaries of human exploration with advanced rocket systems, satellite networks, and aviation technology. We're making space accessible and building the infrastructure for humanity's multi-planetary future.",
    gradient: "from-violet-500 to-purple-500",
    metrics: [
      { label: "Satellites", value: "500+" },
      { label: "Launches", value: "200+" },
      { label: "Space Stations", value: "3" },
      { label: "Astronauts Trained", value: "500+" }
    ],
    products: [
      { name: "Falcon-X", description: "Reusable rocket system", image: "/placeholder.svg" },
      { name: "SatNet", description: "Global satellite network", image: "/placeholder.svg" },
      { name: "SpaceStation Alpha", description: "Commercial space station", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Global Internet Coverage", description: "Satellite constellation for worldwide connectivity", result: "3B+ people connected to high-speed internet" },
      { title: "Mars Mission Preparation", description: "Developing life support and transport systems", result: "First successful cargo mission to Mars" }
    ]
  },
  {
    id: "construction",
    name: "Construction",
    slug: "construction",
    subdomain: "construction.alsamos.com",
    icon: "Building2",
    description: "Smart buildings, sustainable construction, and urban development.",
    fullDescription: "ALSAMOS Construction builds the cities of tomorrow with sustainable materials, smart building technology, and innovative urban planning. We create spaces that are efficient, beautiful, and environmentally responsible.",
    gradient: "from-amber-500 to-yellow-500",
    metrics: [
      { label: "Projects Completed", value: "10K+" },
      { label: "Square Meters Built", value: "500M+" },
      { label: "Smart Buildings", value: "2,500+" },
      { label: "Cities Developed", value: "50+" }
    ],
    products: [
      { name: "SmartConcrete", description: "Self-healing building material", image: "/placeholder.svg" },
      { name: "BuildingOS", description: "Smart building management", image: "/placeholder.svg" },
      { name: "ModularHome", description: "Prefabricated housing", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Net-Zero City District", description: "Carbon-neutral urban development", result: "100% renewable energy, 90% water recycling" },
      { title: "Rapid Housing Initiative", description: "Affordable housing at scale", result: "100K homes built in 3 years" }
    ]
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    slug: "manufacturing",
    subdomain: "manufacturing.alsamos.com",
    icon: "Factory",
    description: "Smart factories, industrial automation, and advanced manufacturing.",
    fullDescription: "ALSAMOS Manufacturing operates smart factories worldwide with AI-driven production, robotic automation, and sustainable practices delivering precision products at scale.",
    gradient: "from-gray-500 to-slate-600",
    metrics: [
      { label: "Factories", value: "500+" },
      { label: "Products/Year", value: "10B+" },
      { label: "Robots", value: "100K+" },
      { label: "Countries", value: "50+" }
    ],
    products: [
      { name: "FactoryOS", description: "Smart factory platform", image: "/placeholder.svg" },
      { name: "QualityAI", description: "AI quality control", image: "/placeholder.svg" },
      { name: "SupplyChainAI", description: "Supply chain optimization", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Lights-Out Factory", description: "Fully automated manufacturing", result: "24/7 operation, zero defects" },
      { title: "Sustainable Manufacturing", description: "Carbon-neutral production", result: "100% renewable energy, zero waste" }
    ]
  },
  {
    id: "mining",
    name: "Mining & Resources",
    slug: "mining",
    subdomain: "mining.alsamos.com",
    icon: "Pickaxe",
    description: "Sustainable mining, mineral processing, and resource management.",
    fullDescription: "ALSAMOS Mining leads responsible resource extraction with autonomous operations, sustainable practices, and advanced processing technologies for critical minerals.",
    gradient: "from-stone-500 to-amber-600",
    metrics: [
      { label: "Mining Sites", value: "200+" },
      { label: "Annual Production", value: "500M tons" },
      { label: "Reclamation Rate", value: "100%" },
      { label: "Autonomous Vehicles", value: "5K+" }
    ],
    products: [
      { name: "AutoMine", description: "Autonomous mining", image: "/placeholder.svg" },
      { name: "GeoAI", description: "AI mineral exploration", image: "/placeholder.svg" },
      { name: "CleanProcess", description: "Green processing", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Autonomous Mining", description: "Fully automated mine operation", result: "50% productivity increase, zero injuries" },
      { title: "Mine Rehabilitation", description: "Complete ecosystem restoration", result: "100% of closed mines fully rehabilitated" }
    ]
  },
  {
    id: "steel",
    name: "Steel & Metals",
    slug: "steel",
    subdomain: "steel.alsamos.com",
    icon: "Hammer",
    description: "Steel production, metal processing, and advanced alloys.",
    fullDescription: "ALSAMOS Steel produces high-quality steel and advanced alloys with green hydrogen technology, recycled materials, and precision manufacturing for construction and industry.",
    gradient: "from-zinc-500 to-gray-600",
    metrics: [
      { label: "Annual Production", value: "100M tons" },
      { label: "Steel Plants", value: "50+" },
      { label: "Recycled Content", value: "80%" },
      { label: "Product Types", value: "10K+" }
    ],
    products: [
      { name: "GreenSteel", description: "Carbon-neutral steel", image: "/placeholder.svg" },
      { name: "SuperAlloy", description: "Advanced alloys", image: "/placeholder.svg" },
      { name: "RecycleSteel", description: "Circular steel production", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Green Steel Production", description: "Hydrogen-based steelmaking", result: "95% reduction in carbon emissions" },
      { title: "Circular Economy", description: "100% recyclable steel products", result: "Zero waste to landfill" }
    ]
  },
  {
    id: "chemicals",
    name: "Chemicals",
    slug: "chemicals",
    subdomain: "chemicals.alsamos.com",
    icon: "FlaskConical",
    description: "Specialty chemicals, sustainable materials, and industrial solutions.",
    fullDescription: "ALSAMOS Chemicals develops innovative chemical solutions with sustainable processes, bio-based materials, and advanced polymers for diverse industrial applications.",
    gradient: "from-lime-500 to-green-600",
    metrics: [
      { label: "Products", value: "50K+" },
      { label: "Production Sites", value: "100+" },
      { label: "R&D Investment", value: "$5B+/year" },
      { label: "Bio-based Products", value: "40%" }
    ],
    products: [
      { name: "BioPlastics", description: "Sustainable polymers", image: "/placeholder.svg" },
      { name: "GreenChem", description: "Eco-friendly chemicals", image: "/placeholder.svg" },
      { name: "SpecChem", description: "Specialty chemicals", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Plastic Alternatives", description: "Biodegradable packaging", result: "Replacing 1M tons of plastic annually" },
      { title: "Green Chemistry", description: "Sustainable chemical processes", result: "60% reduction in environmental impact" }
    ]
  },
  {
    id: "textiles",
    name: "Textiles",
    slug: "textiles",
    subdomain: "textiles.alsamos.com",
    icon: "Scissors",
    description: "Sustainable textiles, smart fabrics, and textile manufacturing.",
    fullDescription: "ALSAMOS Textiles produces sustainable fabrics with recycled materials, smart textile technology, and ethical manufacturing for fashion and industrial applications.",
    gradient: "from-pink-500 to-rose-500",
    metrics: [
      { label: "Fabric Types", value: "10K+" },
      { label: "Annual Production", value: "5B meters" },
      { label: "Recycled Content", value: "70%" },
      { label: "Factories", value: "200+" }
    ],
    products: [
      { name: "EcoFabric", description: "Recycled textiles", image: "/placeholder.svg" },
      { name: "SmartTextile", description: "Connected fabrics", image: "/placeholder.svg" },
      { name: "PerformFabric", description: "Technical textiles", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Ocean Plastic Fabrics", description: "Textiles from ocean waste", result: "100M kg of ocean plastic recycled" },
      { title: "Smart Sportswear", description: "Performance monitoring fabrics", result: "Used by 100+ Olympic athletes" }
    ]
  },
  {
    id: "packaging",
    name: "Packaging",
    slug: "packaging",
    subdomain: "packaging.alsamos.com",
    icon: "Package",
    description: "Sustainable packaging, smart packaging, and packaging automation.",
    fullDescription: "ALSAMOS Packaging creates sustainable packaging solutions with biodegradable materials, smart packaging technology, and automated packaging systems for global brands.",
    gradient: "from-amber-500 to-yellow-600",
    metrics: [
      { label: "Packages/Year", value: "100B+" },
      { label: "Sustainable Materials", value: "90%" },
      { label: "Brand Partners", value: "10K+" },
      { label: "Facilities", value: "300+" }
    ],
    products: [
      { name: "EcoPack", description: "Biodegradable packaging", image: "/placeholder.svg" },
      { name: "SmartPack", description: "Connected packaging", image: "/placeholder.svg" },
      { name: "AutoPack", description: "Packaging automation", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Plastic-Free Packaging", description: "100% plastic-free solutions", result: "10B plastic packages eliminated" },
      { title: "Smart Supply Chain", description: "Connected package tracking", result: "50% reduction in lost packages" }
    ]
  },
  {
    id: "printing",
    name: "3D Printing",
    slug: "printing",
    subdomain: "3dprint.alsamos.com",
    icon: "Printer",
    description: "Additive manufacturing, 3D printing services, and rapid prototyping.",
    fullDescription: "ALSAMOS 3D Printing provides industrial additive manufacturing with advanced materials, large-scale production capabilities, and rapid prototyping for aerospace, medical, and consumer products.",
    gradient: "from-cyan-500 to-blue-500",
    metrics: [
      { label: "Printers Deployed", value: "50K+" },
      { label: "Parts/Year", value: "100M+" },
      { label: "Materials", value: "500+" },
      { label: "Industries Served", value: "50+" }
    ],
    products: [
      { name: "PrintX Pro", description: "Industrial 3D printer", image: "/placeholder.svg" },
      { name: "MetalPrint", description: "Metal additive manufacturing", image: "/placeholder.svg" },
      { name: "BioPrint", description: "Medical 3D printing", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Aerospace Parts", description: "3D printed aircraft components", result: "50% weight reduction, 70% cost savings" },
      { title: "Medical Implants", description: "Custom patient-specific implants", result: "1M+ custom implants produced" }
    ]
  },
  {
    id: "defense",
    name: "Defense & Security",
    slug: "defense",
    subdomain: "defense.alsamos.com",
    icon: "ShieldAlert",
    description: "Defense systems, security solutions, and protective technologies.",
    fullDescription: "ALSAMOS Defense develops advanced defense and security systems with AI-powered surveillance, autonomous systems, and protective technologies for national security and public safety.",
    gradient: "from-slate-600 to-gray-700",
    metrics: [
      { label: "Countries Served", value: "50+" },
      { label: "Security Systems", value: "100K+" },
      { label: "R&D Investment", value: "$15B+/year" },
      { label: "Patents", value: "10K+" }
    ],
    products: [
      { name: "SentinelAI", description: "AI surveillance systems", image: "/placeholder.svg" },
      { name: "DefenseNet", description: "Secure communications", image: "/placeholder.svg" },
      { name: "GuardianDrone", description: "Autonomous security drones", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Border Security", description: "AI-powered border monitoring", result: "99% threat detection rate" },
      { title: "Critical Infrastructure", description: "Infrastructure protection", result: "Zero successful attacks on protected sites" }
    ]
  },
  {
    id: "marine",
    name: "Marine & Shipping",
    slug: "marine",
    subdomain: "marine.alsamos.com",
    icon: "Ship",
    description: "Shipping, maritime technology, and ocean exploration.",
    fullDescription: "ALSAMOS Marine operates sustainable shipping fleets, develops maritime technology, and leads ocean exploration with autonomous vessels and clean propulsion systems.",
    gradient: "from-blue-600 to-cyan-600",
    metrics: [
      { label: "Ships", value: "500+" },
      { label: "Cargo/Year", value: "1B tons" },
      { label: "Ports Served", value: "1K+" },
      { label: "Electric Vessels", value: "100+" }
    ],
    products: [
      { name: "AutoShip", description: "Autonomous vessels", image: "/placeholder.svg" },
      { name: "CleanMarine", description: "Zero-emission ships", image: "/placeholder.svg" },
      { name: "OceanExplore", description: "Deep-sea exploration", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Autonomous Shipping", description: "Self-navigating cargo ships", result: "First transatlantic autonomous voyage" },
      { title: "Green Fleet", description: "Zero-emission shipping", result: "50% of fleet carbon-neutral" }
    ]
  },

  // ENERGY & ENVIRONMENT (8)
  {
    id: "energy",
    name: "Energy",
    slug: "energy",
    subdomain: "energy.alsamos.com",
    icon: "Zap",
    description: "Renewable energy, power generation, and energy storage solutions.",
    fullDescription: "ALSAMOS Energy leads the clean energy transition with solar, wind, and nuclear power generation, advanced storage solutions, and smart grid technology powering the sustainable future.",
    gradient: "from-yellow-500 to-orange-500",
    metrics: [
      { label: "Renewable Capacity", value: "500 GW" },
      { label: "Countries", value: "100+" },
      { label: "Homes Powered", value: "500M+" },
      { label: "Carbon Avoided", value: "1B tons/year" }
    ],
    products: [
      { name: "SolarMax", description: "High-efficiency solar panels", image: "/placeholder.svg" },
      { name: "WindForce", description: "Offshore wind turbines", image: "/placeholder.svg" },
      { name: "PowerPack", description: "Grid-scale storage", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "National Grid Transformation", description: "100% renewable national grid", result: "First major economy on 100% renewables" },
      { title: "Energy Access", description: "Solar power for off-grid communities", result: "100M+ people with first-time electricity" }
    ]
  },
  {
    id: "solar",
    name: "Solar Energy",
    slug: "solar",
    subdomain: "solar.alsamos.com",
    icon: "Sun",
    description: "Solar panels, solar farms, and photovoltaic technology.",
    fullDescription: "ALSAMOS Solar develops cutting-edge photovoltaic technology with record-breaking efficiency, building-integrated solar, and utility-scale solar farms powering clean energy worldwide.",
    gradient: "from-yellow-400 to-orange-500",
    metrics: [
      { label: "Solar Capacity", value: "200 GW" },
      { label: "Panel Efficiency", value: "35%" },
      { label: "Solar Farms", value: "1K+" },
      { label: "Rooftop Installations", value: "50M+" }
    ],
    products: [
      { name: "UltraPanel", description: "High-efficiency panels", image: "/placeholder.svg" },
      { name: "SolarRoof", description: "Building-integrated solar", image: "/placeholder.svg" },
      { name: "SolarFarm", description: "Utility-scale systems", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Desert Solar Megaproject", description: "World's largest solar farm", result: "50 GW capacity, powering 20M homes" },
      { title: "Solar Cities", description: "100% solar-powered cities", result: "10 cities running on solar" }
    ]
  },
  {
    id: "nuclear",
    name: "Nuclear Energy",
    slug: "nuclear",
    subdomain: "nuclear.alsamos.com",
    icon: "Atom",
    description: "Advanced nuclear reactors, fusion research, and nuclear technology.",
    fullDescription: "ALSAMOS Nuclear develops safe, clean nuclear energy with next-generation reactors, fusion research, and advanced fuel cycles for reliable baseload power generation.",
    gradient: "from-green-500 to-teal-500",
    metrics: [
      { label: "Reactors", value: "50+" },
      { label: "Power Generated", value: "100 GW" },
      { label: "Fusion Progress", value: "Net positive" },
      { label: "Zero Incidents", value: "100%" }
    ],
    products: [
      { name: "MicroReactor", description: "Small modular reactor", image: "/placeholder.svg" },
      { name: "FusionCore", description: "Fusion energy systems", image: "/placeholder.svg" },
      { name: "SafeNuke", description: "Passive safety reactors", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "First Commercial Fusion", description: "Net-positive fusion reactor", result: "Unlimited clean energy breakthrough" },
      { title: "Modular Deployment", description: "Rapid reactor deployment", result: "50 reactors in 5 years" }
    ]
  },
  {
    id: "water",
    name: "Water Technology",
    slug: "water",
    subdomain: "water.alsamos.com",
    icon: "Droplets",
    description: "Water treatment, desalination, and water infrastructure.",
    fullDescription: "ALSAMOS Water ensures access to clean water with advanced treatment, desalination, and smart water management systems serving communities and industries worldwide.",
    gradient: "from-blue-400 to-cyan-500",
    metrics: [
      { label: "Water Treated", value: "100B liters/day" },
      { label: "Desalination Plants", value: "500+" },
      { label: "People Served", value: "2B+" },
      { label: "Water Recycled", value: "80%" }
    ],
    products: [
      { name: "PureWater", description: "Advanced purification", image: "/placeholder.svg" },
      { name: "DesalPro", description: "Energy-efficient desalination", image: "/placeholder.svg" },
      { name: "WaterSmart", description: "Smart water management", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Desert Nation Water Security", description: "Complete water independence", result: "100% water needs met through desalination" },
      { title: "Water Crisis Response", description: "Emergency water solutions", result: "10M+ people saved from water crisis" }
    ]
  },
  {
    id: "waste",
    name: "Waste Management",
    slug: "waste",
    subdomain: "waste.alsamos.com",
    icon: "Recycle",
    description: "Recycling, waste-to-energy, and circular economy solutions.",
    fullDescription: "ALSAMOS Waste transforms waste into resources with advanced recycling, waste-to-energy systems, and circular economy solutions creating a zero-waste future.",
    gradient: "from-green-600 to-emerald-600",
    metrics: [
      { label: "Waste Processed", value: "500M tons/year" },
      { label: "Recycling Rate", value: "95%" },
      { label: "Waste-to-Energy", value: "50 GW" },
      { label: "Cities Served", value: "5K+" }
    ],
    products: [
      { name: "SmartSort", description: "AI waste sorting", image: "/placeholder.svg" },
      { name: "WasteToEnergy", description: "Energy from waste", image: "/placeholder.svg" },
      { name: "CircularHub", description: "Recycling marketplace", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Zero-Waste City", description: "100% waste diversion", result: "First major city with zero landfill" },
      { title: "Plastic Recycling", description: "Chemical plastic recycling", result: "100% plastic recycled to new products" }
    ]
  },
  {
    id: "environment",
    name: "Environmental Services",
    slug: "environment",
    subdomain: "environment.alsamos.com",
    icon: "TreeDeciduous",
    description: "Environmental consulting, restoration, and conservation.",
    fullDescription: "ALSAMOS Environmental protects and restores ecosystems with conservation programs, environmental consulting, and nature-based solutions for climate resilience.",
    gradient: "from-green-500 to-lime-500",
    metrics: [
      { label: "Land Protected", value: "100M hectares" },
      { label: "Trees Planted", value: "10B+" },
      { label: "Species Protected", value: "10K+" },
      { label: "Carbon Offset", value: "5B tons" }
    ],
    products: [
      { name: "EcoRestore", description: "Ecosystem restoration", image: "/placeholder.svg" },
      { name: "CarbonTrack", description: "Carbon monitoring", image: "/placeholder.svg" },
      { name: "WildlifeAI", description: "Conservation technology", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Rainforest Restoration", description: "Large-scale reforestation", result: "50M hectares of forest restored" },
      { title: "Species Recovery", description: "Endangered species programs", result: "100+ species saved from extinction" }
    ]
  },
  {
    id: "climate",
    name: "Climate Solutions",
    slug: "climate",
    subdomain: "climate.alsamos.com",
    icon: "CloudRain",
    description: "Carbon capture, climate technology, and emissions reduction.",
    fullDescription: "ALSAMOS Climate develops breakthrough climate solutions with direct air capture, carbon storage, and emissions reduction technology combating climate change at scale.",
    gradient: "from-teal-500 to-cyan-500",
    metrics: [
      { label: "CO2 Captured", value: "100M tons/year" },
      { label: "DAC Facilities", value: "500+" },
      { label: "Emissions Reduced", value: "2B tons/year" },
      { label: "Climate Projects", value: "10K+" }
    ],
    products: [
      { name: "CarbonCapture", description: "Direct air capture", image: "/placeholder.svg" },
      { name: "EmissionsZero", description: "Decarbonization platform", image: "/placeholder.svg" },
      { name: "ClimateAI", description: "Climate modeling", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Industrial Decarbonization", description: "Net-zero heavy industry", result: "First carbon-neutral steel production" },
      { title: "Atmospheric Cleanup", description: "Large-scale carbon removal", result: "1 gigaton CO2 removed from atmosphere" }
    ]
  },
  {
    id: "ev",
    name: "EV Infrastructure",
    slug: "ev",
    subdomain: "ev.alsamos.com",
    icon: "BatteryCharging",
    description: "Electric vehicle charging networks and battery technology.",
    fullDescription: "ALSAMOS EV builds the world's largest EV charging network with ultra-fast chargers, battery swap stations, and next-generation battery technology enabling mass EV adoption.",
    gradient: "from-green-400 to-emerald-500",
    metrics: [
      { label: "Charging Stations", value: "1M+" },
      { label: "Countries", value: "100+" },
      { label: "Daily Charges", value: "50M+" },
      { label: "Battery Factories", value: "20" }
    ],
    products: [
      { name: "SuperCharge", description: "Ultra-fast charging", image: "/placeholder.svg" },
      { name: "SwapStation", description: "Battery swap network", image: "/placeholder.svg" },
      { name: "PowerCell", description: "Advanced EV batteries", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "National EV Network", description: "Complete country coverage", result: "100% of highways with fast charging" },
      { title: "5-Minute Charging", description: "Ultra-rapid charging technology", result: "Full charge in 5 minutes achieved" }
    ]
  },

  // CONSUMER PRODUCTS (12)
  {
    id: "gadgets",
    name: "Gadgets & Electronics",
    slug: "gadgets",
    subdomain: "gadgets.alsamos.com",
    icon: "Smartphone",
    description: "Smartphones, wearables, smart home devices, and consumer electronics.",
    fullDescription: "ALSAMOS Gadgets creates innovative consumer electronics that seamlessly integrate into daily life. From smartphones to smart home ecosystems, our devices combine cutting-edge technology with beautiful design.",
    gradient: "from-pink-500 to-rose-500",
    metrics: [
      { label: "Products", value: "500+" },
      { label: "Users", value: "1B+" },
      { label: "Patents", value: "15K+" },
      { label: "Innovation Centers", value: "25" }
    ],
    products: [
      { name: "ALSAMOS Phone X", description: "Flagship smartphone", image: "/placeholder.svg" },
      { name: "ALSAMOS Watch", description: "Smart wearable", image: "/placeholder.svg" },
      { name: "ALSAMOS Home Hub", description: "Smart home controller", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Smart Home Ecosystem", description: "Integrated home automation platform", result: "30% energy savings, seamless device integration" },
      { title: "Accessibility Innovation", description: "Technology for differently-abled users", result: "5M+ users with improved accessibility" }
    ]
  },
  {
    id: "fashion",
    name: "Fashion",
    slug: "fashion",
    subdomain: "fashion.alsamos.com",
    icon: "Shirt",
    description: "Luxury fashion, sustainable apparel, and smart textiles.",
    fullDescription: "ALSAMOS Fashion combines luxury design with sustainable practices and smart textile technology. Our collections feature innovative materials and timeless aesthetics for the conscious consumer.",
    gradient: "from-fuchsia-500 to-pink-500",
    metrics: [
      { label: "Stores", value: "2,000+" },
      { label: "Designers", value: "500+" },
      { label: "Collections/Year", value: "100+" },
      { label: "Countries", value: "120+" }
    ],
    products: [
      { name: "EcoLux Collection", description: "Sustainable luxury line", image: "/placeholder.svg" },
      { name: "SmartWear", description: "Tech-integrated clothing", image: "/placeholder.svg" },
      { name: "ALSAMOS Couture", description: "High fashion collection", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Zero-Waste Manufacturing", description: "Eliminating textile waste in production", result: "100% waste recycled, 50% water reduction" },
      { title: "Smart Fabric Innovation", description: "Temperature-regulating clothing", result: "50M+ garments with smart technology" }
    ]
  },
  {
    id: "food",
    name: "Restaurant & Food Services",
    slug: "food",
    subdomain: "food.alsamos.com",
    icon: "UtensilsCrossed",
    description: "Restaurant chains, food technology, and culinary innovation.",
    fullDescription: "ALSAMOS Food Services operates premium restaurant chains and develops innovative food technology. From farm to table, we ensure quality, sustainability, and exceptional dining experiences.",
    gradient: "from-yellow-500 to-orange-500",
    metrics: [
      { label: "Restaurants", value: "10K+" },
      { label: "Daily Meals", value: "50M+" },
      { label: "Chefs", value: "100K+" },
      { label: "Countries", value: "100+" }
    ],
    products: [
      { name: "ALSAMOS Kitchen", description: "Cloud kitchen platform", image: "/placeholder.svg" },
      { name: "FoodBot", description: "Robotic food preparation", image: "/placeholder.svg" },
      { name: "FreshTrack", description: "Supply chain management", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Sustainable Sourcing", description: "100% traceable ingredient supply chain", result: "Zero food waste, 100% sustainable sourcing" },
      { title: "Automated Kitchen", description: "Robotic food preparation at scale", result: "50% cost reduction, consistent quality" }
    ]
  },
  {
    id: "beverages",
    name: "Beverages",
    slug: "beverages",
    subdomain: "beverages.alsamos.com",
    icon: "Coffee",
    description: "Premium beverages, coffee chains, and beverage technology.",
    fullDescription: "ALSAMOS Beverages offers premium drink experiences from specialty coffee to innovative beverages, with sustainable sourcing and cutting-edge beverage technology.",
    gradient: "from-amber-600 to-brown-600",
    metrics: [
      { label: "Coffee Shops", value: "15K+" },
      { label: "Drinks/Day", value: "50M+" },
      { label: "Beverage Brands", value: "100+" },
      { label: "Countries", value: "150+" }
    ],
    products: [
      { name: "ALSAMOS Coffee", description: "Premium coffee chain", image: "/placeholder.svg" },
      { name: "SmartBrew", description: "AI coffee brewing", image: "/placeholder.svg" },
      { name: "EcoCup", description: "Sustainable packaging", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Sustainable Coffee", description: "Direct farmer partnerships", result: "100K+ farmers with fair trade income" },
      { title: "Zero-Waste Cafes", description: "Eliminating single-use waste", result: "100% of cafes waste-free" }
    ]
  },
  {
    id: "toys",
    name: "Toys & Games",
    slug: "toys",
    subdomain: "toys.alsamos.com",
    icon: "Gamepad",
    description: "Educational toys, smart toys, and family entertainment.",
    fullDescription: "ALSAMOS Toys creates innovative play experiences with educational toys, smart toys, and family entertainment that combine learning with fun for children of all ages.",
    gradient: "from-purple-500 to-pink-500",
    metrics: [
      { label: "Products", value: "10K+" },
      { label: "Children Served", value: "500M+" },
      { label: "Educational Content", value: "100K+ hours" },
      { label: "Countries", value: "180+" }
    ],
    products: [
      { name: "LearnBot", description: "Educational robot", image: "/placeholder.svg" },
      { name: "CreativeKit", description: "STEM building sets", image: "/placeholder.svg" },
      { name: "PlayVerse", description: "Digital play platform", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "STEM Education", description: "Coding toys for kids", result: "50M children learned programming" },
      { title: "Inclusive Play", description: "Toys for all abilities", result: "Award-winning accessible toy line" }
    ]
  },
  {
    id: "cosmetics",
    name: "Cosmetics & Beauty",
    slug: "cosmetics",
    subdomain: "beauty.alsamos.com",
    icon: "Sparkles",
    description: "Skincare, cosmetics, and beauty technology.",
    fullDescription: "ALSAMOS Beauty creates premium cosmetics and skincare with clean ingredients, AI-powered personalization, and sustainable packaging for conscious beauty consumers.",
    gradient: "from-pink-400 to-rose-500",
    metrics: [
      { label: "Products", value: "5K+" },
      { label: "Customers", value: "200M+" },
      { label: "Clean Ingredients", value: "100%" },
      { label: "Countries", value: "150+" }
    ],
    products: [
      { name: "SkinAI", description: "Personalized skincare", image: "/placeholder.svg" },
      { name: "CleanBeauty", description: "Sustainable cosmetics", image: "/placeholder.svg" },
      { name: "BeautyTech", description: "Smart beauty devices", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Personalized Skincare", description: "AI-customized products", result: "95% customer satisfaction rate" },
      { title: "Sustainable Beauty", description: "Zero-waste packaging", result: "100M+ plastic packages eliminated" }
    ]
  },
  {
    id: "jewelry",
    name: "Jewelry & Watches",
    slug: "jewelry",
    subdomain: "jewelry.alsamos.com",
    icon: "Gem",
    description: "Luxury jewelry, watches, and precious accessories.",
    fullDescription: "ALSAMOS Jewelry crafts exquisite timepieces and jewelry with ethically sourced materials, innovative designs, and timeless craftsmanship for discerning collectors.",
    gradient: "from-yellow-400 to-amber-500",
    metrics: [
      { label: "Boutiques", value: "1K+" },
      { label: "Artisans", value: "10K+" },
      { label: "Ethical Sourcing", value: "100%" },
      { label: "Countries", value: "100+" }
    ],
    products: [
      { name: "Heritage Collection", description: "Classic luxury pieces", image: "/placeholder.svg" },
      { name: "ALSAMOS Timepiece", description: "Precision watches", image: "/placeholder.svg" },
      { name: "Sustainable Gems", description: "Lab-grown diamonds", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Ethical Diamonds", description: "100% conflict-free sourcing", result: "Industry-leading transparency" },
      { title: "Smart Luxury Watch", description: "Traditional craft meets technology", result: "Best-selling luxury smartwatch" }
    ]
  },
  {
    id: "furniture",
    name: "Furniture & Home",
    slug: "furniture",
    subdomain: "furniture.alsamos.com",
    icon: "Sofa",
    description: "Home furniture, smart home products, and interior design.",
    fullDescription: "ALSAMOS Furniture designs beautiful, sustainable home products with smart technology integration, modular design, and eco-friendly materials for modern living.",
    gradient: "from-amber-500 to-orange-500",
    metrics: [
      { label: "Products", value: "50K+" },
      { label: "Stores", value: "2K+" },
      { label: "Homes Furnished", value: "100M+" },
      { label: "Sustainable Materials", value: "80%" }
    ],
    products: [
      { name: "SmartHome Collection", description: "Connected furniture", image: "/placeholder.svg" },
      { name: "EcoLiving", description: "Sustainable furniture", image: "/placeholder.svg" },
      { name: "ModularSpace", description: "Flexible living solutions", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Circular Furniture", description: "Take-back and recycling program", result: "100% of furniture recyclable" },
      { title: "Smart Living Spaces", description: "AI-integrated home products", result: "30% improvement in home efficiency" }
    ]
  },
  {
    id: "appliances",
    name: "Home Appliances",
    slug: "appliances",
    subdomain: "appliances.alsamos.com",
    icon: "Refrigerator",
    description: "Smart appliances, kitchen technology, and home automation.",
    fullDescription: "ALSAMOS Appliances creates intelligent home products with AI-powered efficiency, seamless connectivity, and sustainable design for the modern smart home.",
    gradient: "from-slate-500 to-zinc-500",
    metrics: [
      { label: "Products", value: "1K+" },
      { label: "Homes Equipped", value: "200M+" },
      { label: "Energy Savings", value: "40%" },
      { label: "Connected Devices", value: "1B+" }
    ],
    products: [
      { name: "SmartFridge", description: "AI refrigerator", image: "/placeholder.svg" },
      { name: "EcoWash", description: "Water-saving appliances", image: "/placeholder.svg" },
      { name: "HomeConnect", description: "Appliance ecosystem", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Smart Kitchen", description: "Connected kitchen ecosystem", result: "50% reduction in food waste" },
      { title: "Energy Efficiency", description: "AI-optimized appliances", result: "40% energy savings for households" }
    ]
  },
  {
    id: "sports",
    name: "Sports & Outdoors",
    slug: "sports",
    subdomain: "sports.alsamos.com",
    icon: "Medal",
    description: "Sports equipment, athletic wear, and outdoor gear.",
    fullDescription: "ALSAMOS Sports equips athletes and outdoor enthusiasts with performance gear, smart equipment, and sustainable products for every level of competition and adventure.",
    gradient: "from-green-500 to-teal-500",
    metrics: [
      { label: "Products", value: "20K+" },
      { label: "Athletes Sponsored", value: "10K+" },
      { label: "Stores", value: "5K+" },
      { label: "Countries", value: "150+" }
    ],
    products: [
      { name: "PerformGear", description: "Professional equipment", image: "/placeholder.svg" },
      { name: "SmartSport", description: "Connected athletic wear", image: "/placeholder.svg" },
      { name: "AdventureKit", description: "Outdoor equipment", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Olympic Partnership", description: "Official Olympics supplier", result: "1000+ medals won with our equipment" },
      { title: "Sustainable Sportswear", description: "Recycled performance wear", result: "100M garments from recycled materials" }
    ]
  },
  {
    id: "pets",
    name: "Pet Care",
    slug: "pets",
    subdomain: "pets.alsamos.com",
    icon: "Cat",
    description: "Pet products, veterinary services, and pet technology.",
    fullDescription: "ALSAMOS Pets provides comprehensive pet care with premium nutrition, smart pet technology, and veterinary services ensuring happy, healthy pets and owners.",
    gradient: "from-orange-400 to-amber-500",
    metrics: [
      { label: "Pet Products", value: "10K+" },
      { label: "Vet Clinics", value: "5K+" },
      { label: "Pets Served", value: "100M+" },
      { label: "Countries", value: "100+" }
    ],
    products: [
      { name: "PetHealth", description: "Smart pet monitoring", image: "/placeholder.svg" },
      { name: "NutriPet", description: "Premium pet nutrition", image: "/placeholder.svg" },
      { name: "VetConnect", description: "Telehealth for pets", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Pet Health Monitoring", description: "AI health tracking for pets", result: "50% earlier disease detection" },
      { title: "Personalized Nutrition", description: "Custom pet food formulation", result: "30% improvement in pet health metrics" }
    ]
  },
  {
    id: "baby",
    name: "Baby & Kids",
    slug: "baby",
    subdomain: "baby.alsamos.com",
    icon: "Baby",
    description: "Baby products, children's essentials, and parenting technology.",
    fullDescription: "ALSAMOS Baby provides safe, innovative products for infants and children with smart monitoring, organic materials, and expert-designed essentials for growing families.",
    gradient: "from-pink-300 to-rose-400",
    metrics: [
      { label: "Products", value: "5K+" },
      { label: "Families Served", value: "50M+" },
      { label: "Safety Rating", value: "100%" },
      { label: "Countries", value: "120+" }
    ],
    products: [
      { name: "SmartBaby", description: "Baby monitoring system", image: "/placeholder.svg" },
      { name: "OrganicBaby", description: "Natural baby products", image: "/placeholder.svg" },
      { name: "GrowthTrack", description: "Child development app", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Safe Sleep", description: "AI-powered baby monitoring", result: "Zero SIDS incidents with our monitors" },
      { title: "Organic Baby Care", description: "100% natural products", result: "50% reduction in baby skin issues" }
    ]
  },

  // MEDIA & ENTERTAINMENT (8)
  {
    id: "media",
    name: "Media & Entertainment",
    slug: "media",
    subdomain: "media.alsamos.com",
    icon: "Film",
    description: "Streaming platforms, content creation, and digital media networks.",
    fullDescription: "ALSAMOS Media delivers world-class entertainment through streaming platforms, film production, and digital content networks. We create stories that inspire and connect people globally.",
    gradient: "from-red-500 to-orange-500",
    metrics: [
      { label: "Subscribers", value: "500M+" },
      { label: "Content Hours", value: "1M+" },
      { label: "Original Productions", value: "5,000+" },
      { label: "Languages", value: "100+" }
    ],
    products: [
      { name: "ALSAMOS Stream", description: "Premium streaming platform", image: "/placeholder.svg" },
      { name: "ALSAMOS Studios", description: "Content production", image: "/placeholder.svg" },
      { name: "ALSAMOS Music", description: "Music streaming service", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Global Content Delivery", description: "Low-latency streaming worldwide", result: "99.99% uptime, 4K streaming in 190 countries" },
      { title: "AI Content Recommendation", description: "Personalized viewing experience", result: "40% increase in user engagement" }
    ]
  },
  {
    id: "publishing",
    name: "Publishing",
    slug: "publishing",
    subdomain: "publishing.alsamos.com",
    icon: "BookMarked",
    description: "Books, magazines, digital publishing, and content platforms.",
    fullDescription: "ALSAMOS Publishing brings stories to life through print and digital channels with bestselling authors, innovative formats, and global distribution reaching readers everywhere.",
    gradient: "from-indigo-500 to-purple-500",
    metrics: [
      { label: "Titles Published", value: "1M+" },
      { label: "Authors", value: "100K+" },
      { label: "Monthly Readers", value: "500M+" },
      { label: "Languages", value: "100+" }
    ],
    products: [
      { name: "eBookX", description: "Digital publishing platform", image: "/placeholder.svg" },
      { name: "AudioBook Pro", description: "Premium audiobooks", image: "/placeholder.svg" },
      { name: "AuthorHub", description: "Self-publishing platform", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Self-Publishing Revolution", description: "Democratizing book publishing", result: "500K+ indie authors published" },
      { title: "AI Translation", description: "Instant book translation", result: "Books available in 100+ languages" }
    ]
  },
  {
    id: "music",
    name: "Music & Audio",
    slug: "music",
    subdomain: "music.alsamos.com",
    icon: "Music",
    description: "Music streaming, production, and artist services.",
    fullDescription: "ALSAMOS Music connects artists with fans through streaming, discovery, and creator tools, empowering musicians while delivering the world's best listening experience.",
    gradient: "from-green-500 to-emerald-500",
    metrics: [
      { label: "Subscribers", value: "400M+" },
      { label: "Songs", value: "100M+" },
      { label: "Artists", value: "10M+" },
      { label: "Podcasts", value: "5M+" }
    ],
    products: [
      { name: "ALSAMOS Music", description: "Music streaming", image: "/placeholder.svg" },
      { name: "CreatorStudio", description: "Music production tools", image: "/placeholder.svg" },
      { name: "PodcastHub", description: "Podcast platform", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Artist Direct", description: "Direct artist-to-fan monetization", result: "$10B+ paid directly to artists" },
      { title: "AI Music Discovery", description: "Personalized recommendations", result: "5B+ monthly song discoveries" }
    ]
  },
  {
    id: "film",
    name: "Film & Television",
    slug: "film",
    subdomain: "film.alsamos.com",
    icon: "Clapperboard",
    description: "Film production, TV studios, and cinematic experiences.",
    fullDescription: "ALSAMOS Film produces award-winning movies and television with cutting-edge technology, diverse storytelling, and global theatrical and streaming distribution.",
    gradient: "from-amber-500 to-red-500",
    metrics: [
      { label: "Productions", value: "500+" },
      { label: "Academy Awards", value: "100+" },
      { label: "Studios", value: "20" },
      { label: "Annual Viewers", value: "5B+" }
    ],
    products: [
      { name: "ALSAMOS Studios", description: "Film production", image: "/placeholder.svg" },
      { name: "VirtualStage", description: "Virtual production", image: "/placeholder.svg" },
      { name: "IMAX Experience", description: "Premium cinema", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Virtual Production", description: "LED wall filming technology", result: "50% cost reduction, unlimited locations" },
      { title: "Global Premiere", description: "Simultaneous worldwide release", result: "Largest global film opening ever" }
    ]
  },
  {
    id: "advertising",
    name: "Advertising & Marketing",
    slug: "advertising",
    subdomain: "ads.alsamos.com",
    icon: "Megaphone",
    description: "Digital advertising, marketing technology, and brand services.",
    fullDescription: "ALSAMOS Advertising delivers effective marketing with AI-powered targeting, creative excellence, and measurable results across digital and traditional channels.",
    gradient: "from-pink-500 to-orange-500",
    metrics: [
      { label: "Ad Impressions/Day", value: "100B+" },
      { label: "Advertisers", value: "10M+" },
      { label: "Markets", value: "200+" },
      { label: "Ad Revenue", value: "$100B+/year" }
    ],
    products: [
      { name: "AdPlatform", description: "Programmatic advertising", image: "/placeholder.svg" },
      { name: "BrandAI", description: "AI creative tools", image: "/placeholder.svg" },
      { name: "InfluencerHub", description: "Creator marketing", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "AI Creative", description: "AI-generated ad content", result: "2x higher engagement rates" },
      { title: "Privacy-First Ads", description: "Effective targeting without tracking", result: "Maintained ROI with full privacy" }
    ]
  },
  {
    id: "events",
    name: "Events & Live",
    slug: "events",
    subdomain: "events.alsamos.com",
    icon: "Ticket",
    description: "Live events, concerts, and experiential entertainment.",
    fullDescription: "ALSAMOS Events creates unforgettable live experiences from concerts to corporate events with cutting-edge production, seamless ticketing, and global venues.",
    gradient: "from-purple-600 to-pink-600",
    metrics: [
      { label: "Events/Year", value: "100K+" },
      { label: "Attendees/Year", value: "500M+" },
      { label: "Venues", value: "5K+" },
      { label: "Countries", value: "150+" }
    ],
    products: [
      { name: "TicketX", description: "Event ticketing", image: "/placeholder.svg" },
      { name: "LiveStream Pro", description: "Hybrid event platform", image: "/placeholder.svg" },
      { name: "VenueOS", description: "Venue management", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Metaverse Concert", description: "First major virtual concert", result: "100M+ simultaneous virtual attendees" },
      { title: "Sustainable Events", description: "Carbon-neutral event production", result: "Zero-waste events worldwide" }
    ]
  },
  {
    id: "broadcast",
    name: "Broadcasting",
    slug: "broadcast",
    subdomain: "broadcast.alsamos.com",
    icon: "Radio",
    description: "Television, radio networks, and broadcast technology.",
    fullDescription: "ALSAMOS Broadcasting operates global TV and radio networks with premium content, news coverage, and innovative broadcast technology reaching billions of viewers.",
    gradient: "from-blue-500 to-indigo-500",
    metrics: [
      { label: "TV Channels", value: "500+" },
      { label: "Radio Stations", value: "1K+" },
      { label: "Daily Viewers", value: "2B+" },
      { label: "Countries", value: "200+" }
    ],
    products: [
      { name: "NewsNetwork", description: "24/7 news channels", image: "/placeholder.svg" },
      { name: "SportsCast", description: "Sports broadcasting", image: "/placeholder.svg" },
      { name: "StreamCast", description: "IP broadcasting", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Global News Network", description: "24/7 worldwide news coverage", result: "Most-watched news network globally" },
      { title: "Sports Revolution", description: "Interactive sports viewing", result: "50% increase in sports engagement" }
    ]
  },
  {
    id: "photography",
    name: "Photography",
    slug: "photography",
    subdomain: "photo.alsamos.com",
    icon: "Camera",
    description: "Cameras, photo services, and imaging technology.",
    fullDescription: "ALSAMOS Photography develops professional cameras and imaging technology with AI-enhanced photography, cloud storage, and creative tools for photographers everywhere.",
    gradient: "from-gray-600 to-zinc-600",
    metrics: [
      { label: "Cameras Sold", value: "50M+" },
      { label: "Cloud Photos", value: "100B+" },
      { label: "Pro Photographers", value: "10M+" },
      { label: "Image Recognition", value: "99.9%" }
    ],
    products: [
      { name: "ProCamera X", description: "Professional camera", image: "/placeholder.svg" },
      { name: "PhotoCloud", description: "Photo storage and editing", image: "/placeholder.svg" },
      { name: "ImageAI", description: "AI photo enhancement", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Computational Photography", description: "AI-enhanced mobile cameras", result: "Professional quality from smartphones" },
      { title: "Memory Preservation", description: "AI photo restoration", result: "1B+ historic photos restored" }
    ]
  },

  // AGRICULTURE & FOOD (6)
  {
    id: "agriculture",
    name: "Agriculture",
    slug: "agriculture",
    subdomain: "agri.alsamos.com",
    icon: "Tractor",
    description: "Smart farming, agricultural technology, and sustainable agriculture.",
    fullDescription: "ALSAMOS Agriculture transforms farming with precision agriculture, AI-powered crop management, and sustainable practices feeding the world while protecting the planet.",
    gradient: "from-green-500 to-lime-500",
    metrics: [
      { label: "Farms Served", value: "10M+" },
      { label: "Hectares Managed", value: "500M+" },
      { label: "Yield Increase", value: "40%" },
      { label: "Water Savings", value: "50%" }
    ],
    products: [
      { name: "FarmOS", description: "Farm management platform", image: "/placeholder.svg" },
      { name: "CropAI", description: "AI crop analytics", image: "/placeholder.svg" },
      { name: "AgriDrone", description: "Agricultural drones", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Precision Agriculture", description: "AI-optimized farming", result: "50% reduction in water and pesticides" },
      { title: "Smallholder Empowerment", description: "Technology for small farms", result: "10M small farmers doubled income" }
    ]
  },
  {
    id: "livestock",
    name: "Livestock",
    slug: "livestock",
    subdomain: "livestock.alsamos.com",
    icon: "Beef",
    description: "Animal husbandry, livestock technology, and sustainable ranching.",
    fullDescription: "ALSAMOS Livestock modernizes animal agriculture with health monitoring, sustainable practices, and precision feeding for ethical, efficient livestock production.",
    gradient: "from-amber-600 to-orange-600",
    metrics: [
      { label: "Animals Monitored", value: "500M+" },
      { label: "Farms", value: "1M+" },
      { label: "Health Detection", value: "99%" },
      { label: "Emission Reduction", value: "40%" }
    ],
    products: [
      { name: "HerdHealth", description: "Animal health monitoring", image: "/placeholder.svg" },
      { name: "FeedOptimize", description: "Precision feeding", image: "/placeholder.svg" },
      { name: "RanchOS", description: "Ranch management", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Disease Prevention", description: "Early health detection", result: "90% reduction in disease outbreaks" },
      { title: "Sustainable Ranching", description: "Carbon-neutral cattle ranching", result: "First carbon-neutral beef operation" }
    ]
  },
  {
    id: "fishery",
    name: "Fisheries & Aquaculture",
    slug: "fishery",
    subdomain: "fishery.alsamos.com",
    icon: "Fish",
    description: "Sustainable fishing, aquaculture, and marine protein production.",
    fullDescription: "ALSAMOS Fisheries leads sustainable seafood production with advanced aquaculture, ocean-friendly fishing, and marine ecosystem protection for healthy oceans and food security.",
    gradient: "from-blue-500 to-cyan-500",
    metrics: [
      { label: "Fish Farms", value: "10K+" },
      { label: "Annual Production", value: "50M tons" },
      { label: "Wild Catch Reduction", value: "70%" },
      { label: "Ocean Cleanup", value: "10M tons" }
    ],
    products: [
      { name: "AquaFarm", description: "Smart aquaculture", image: "/placeholder.svg" },
      { name: "OceanTrack", description: "Sustainable fishing tech", image: "/placeholder.svg" },
      { name: "SeaFood AI", description: "Fish health monitoring", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Ocean Farming", description: "Large-scale sustainable aquaculture", result: "50% of seafood from farms" },
      { title: "Wild Stock Recovery", description: "Ocean ecosystem restoration", result: "Fish populations doubled in managed areas" }
    ]
  },
  {
    id: "grocery",
    name: "Grocery & Supermarkets",
    slug: "grocery",
    subdomain: "grocery.alsamos.com",
    icon: "ShoppingCart",
    description: "Supermarket chains, grocery delivery, and food retail technology.",
    fullDescription: "ALSAMOS Grocery operates smart supermarkets with frictionless checkout, sustainable products, and same-day delivery bringing fresh food to every neighborhood.",
    gradient: "from-green-600 to-teal-600",
    metrics: [
      { label: "Stores", value: "20K+" },
      { label: "Daily Customers", value: "100M+" },
      { label: "Delivery Orders/Day", value: "10M+" },
      { label: "Countries", value: "80+" }
    ],
    products: [
      { name: "SmartStore", description: "Automated checkout stores", image: "/placeholder.svg" },
      { name: "FreshDelivery", description: "Grocery delivery", image: "/placeholder.svg" },
      { name: "LocalSource", description: "Local food marketplace", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Checkout-Free Shopping", description: "AI-powered automatic checkout", result: "Zero wait times, 50% faster shopping" },
      { title: "Food Waste Elimination", description: "AI inventory management", result: "90% reduction in food waste" }
    ]
  },
  {
    id: "organic",
    name: "Organic & Natural",
    slug: "organic",
    subdomain: "organic.alsamos.com",
    icon: "Leaf",
    description: "Organic food, natural products, and health-conscious consumer goods.",
    fullDescription: "ALSAMOS Organic provides certified organic and natural products from food to personal care, supporting sustainable agriculture and healthy living choices.",
    gradient: "from-lime-500 to-green-600",
    metrics: [
      { label: "Organic Products", value: "50K+" },
      { label: "Partner Farms", value: "100K+" },
      { label: "Customers", value: "100M+" },
      { label: "Certifications", value: "100%" }
    ],
    products: [
      { name: "PureOrganic", description: "Certified organic food", image: "/placeholder.svg" },
      { name: "NaturalCare", description: "Organic personal care", image: "/placeholder.svg" },
      { name: "FarmDirect", description: "Direct from organic farms", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Organic Transition", description: "Helping farms go organic", result: "100K+ farms converted to organic" },
      { title: "Accessible Organic", description: "Affordable organic products", result: "50% price reduction for organic" }
    ]
  },
  {
    id: "foodtech",
    name: "Food Technology",
    slug: "foodtech",
    subdomain: "foodtech.alsamos.com",
    icon: "Utensils",
    description: "Food innovation, plant-based proteins, and food science.",
    fullDescription: "ALSAMOS FoodTech develops future foods with plant-based proteins, cultured meat, and nutrition innovation creating sustainable, delicious alternatives to traditional animal products.",
    gradient: "from-emerald-500 to-teal-500",
    metrics: [
      { label: "Products Developed", value: "1K+" },
      { label: "R&D Scientists", value: "5K+" },
      { label: "Plant Protein Production", value: "1M tons/year" },
      { label: "Emissions Avoided", value: "50M tons CO2" }
    ],
    products: [
      { name: "PlantProtein", description: "Plant-based meat", image: "/placeholder.svg" },
      { name: "CultureMeat", description: "Cultivated meat", image: "/placeholder.svg" },
      { name: "NutriDesign", description: "Personalized nutrition", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Meat Alternative", description: "Indistinguishable plant meat", result: "1B+ plant-based meals served" },
      { title: "Cultured Protein", description: "Lab-grown meat at scale", result: "First commercial cultured meat facility" }
    ]
  },

  // TRAVEL & HOSPITALITY (6)
  {
    id: "travel",
    name: "Travel",
    slug: "travel",
    subdomain: "travel.alsamos.com",
    icon: "Plane",
    description: "Travel booking, airlines, and tourism services.",
    fullDescription: "ALSAMOS Travel connects travelers with seamless booking, premium airlines, and curated experiences, making global exploration accessible and sustainable.",
    gradient: "from-sky-500 to-blue-500",
    metrics: [
      { label: "Travelers/Year", value: "500M+" },
      { label: "Destinations", value: "10K+" },
      { label: "Airlines Partnered", value: "500+" },
      { label: "Hotels", value: "1M+" }
    ],
    products: [
      { name: "TravelBook", description: "Travel booking platform", image: "/placeholder.svg" },
      { name: "ALSAMOS Airlines", description: "Premium airline", image: "/placeholder.svg" },
      { name: "ExperienceHub", description: "Tour booking", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Sustainable Travel", description: "Carbon-neutral travel options", result: "50M carbon-neutral trips booked" },
      { title: "AI Travel Planning", description: "Personalized trip planning", result: "95% traveler satisfaction rate" }
    ]
  },
  {
    id: "hotels",
    name: "Hotels & Resorts",
    slug: "hotels",
    subdomain: "hotels.alsamos.com",
    icon: "Hotel",
    description: "Luxury hotels, resorts, and hospitality services.",
    fullDescription: "ALSAMOS Hotels delivers exceptional hospitality with luxury properties, personalized service, and sustainable operations at destinations worldwide.",
    gradient: "from-amber-500 to-yellow-500",
    metrics: [
      { label: "Properties", value: "5K+" },
      { label: "Rooms", value: "1M+" },
      { label: "Guests/Year", value: "200M+" },
      { label: "Countries", value: "150+" }
    ],
    products: [
      { name: "LuxuryStay", description: "Premium hotels", image: "/placeholder.svg" },
      { name: "SmartRoom", description: "AI-powered rooms", image: "/placeholder.svg" },
      { name: "ResortLife", description: "Destination resorts", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Contactless Hospitality", description: "Fully digital guest experience", result: "50% faster check-in, higher satisfaction" },
      { title: "Net-Zero Hotels", description: "Carbon-neutral operations", result: "100% of properties carbon-neutral" }
    ]
  },
  {
    id: "aviation",
    name: "Aviation",
    slug: "aviation",
    subdomain: "aviation.alsamos.com",
    icon: "PlaneTakeoff",
    description: "Commercial aviation, aircraft manufacturing, and airport services.",
    fullDescription: "ALSAMOS Aviation operates airlines, manufactures aircraft, and provides aviation services with focus on sustainability, safety, and passenger experience.",
    gradient: "from-blue-600 to-indigo-600",
    metrics: [
      { label: "Aircraft", value: "1K+" },
      { label: "Passengers/Year", value: "500M+" },
      { label: "Routes", value: "5K+" },
      { label: "On-Time Rate", value: "95%" }
    ],
    products: [
      { name: "EcoJet", description: "Sustainable aircraft", image: "/placeholder.svg" },
      { name: "AirportOS", description: "Smart airport platform", image: "/placeholder.svg" },
      { name: "SkyConnect", description: "In-flight experience", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Electric Aviation", description: "Short-haul electric flights", result: "First commercial electric airline routes" },
      { title: "Sustainable Aviation Fuel", description: "100% SAF operations", result: "50% of flights on sustainable fuel" }
    ]
  },
  {
    id: "cruise",
    name: "Cruise Lines",
    slug: "cruise",
    subdomain: "cruise.alsamos.com",
    icon: "Anchor",
    description: "Cruise vacations, expedition voyages, and maritime tourism.",
    fullDescription: "ALSAMOS Cruises offers unforgettable ocean voyages with sustainable ships, world-class service, and destinations from tropical islands to polar expeditions.",
    gradient: "from-cyan-500 to-blue-600",
    metrics: [
      { label: "Ships", value: "50+" },
      { label: "Passengers/Year", value: "10M+" },
      { label: "Destinations", value: "500+" },
      { label: "Expedition Routes", value: "100+" }
    ],
    products: [
      { name: "OceanLux", description: "Luxury cruise line", image: "/placeholder.svg" },
      { name: "Expedition", description: "Adventure cruises", image: "/placeholder.svg" },
      { name: "RiverVoyage", description: "River cruises", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Zero-Emission Cruise", description: "First zero-emission cruise ship", result: "Carbon-neutral ocean voyages" },
      { title: "Sustainable Tourism", description: "Eco-friendly destinations", result: "100% sustainable shore excursions" }
    ]
  },
  {
    id: "carRental",
    name: "Car Rental",
    slug: "carrental",
    subdomain: "carrental.alsamos.com",
    icon: "CarFront",
    description: "Vehicle rental, car sharing, and mobility services.",
    fullDescription: "ALSAMOS Car Rental provides flexible mobility with premium vehicles, electric options, and seamless digital experiences at airports and cities worldwide.",
    gradient: "from-orange-500 to-red-500",
    metrics: [
      { label: "Vehicles", value: "500K+" },
      { label: "Locations", value: "10K+" },
      { label: "Rentals/Year", value: "100M+" },
      { label: "EV Fleet", value: "50%" }
    ],
    products: [
      { name: "InstantRent", description: "Digital car rental", image: "/placeholder.svg" },
      { name: "FlexCar", description: "Subscription vehicles", image: "/placeholder.svg" },
      { name: "EVRent", description: "Electric vehicle rental", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Keyless Rental", description: "Fully digital car pickup", result: "Zero wait time, app-based access" },
      { title: "Electric Fleet", description: "All-electric rental fleet", result: "50% of fleet now electric" }
    ]
  },
  {
    id: "tourism",
    name: "Tourism & Attractions",
    slug: "tourism",
    subdomain: "tourism.alsamos.com",
    icon: "Mountain",
    description: "Tourist attractions, theme parks, and destination experiences.",
    fullDescription: "ALSAMOS Tourism creates memorable experiences at world-class attractions, theme parks, and destinations with innovative entertainment and sustainable tourism practices.",
    gradient: "from-green-500 to-emerald-500",
    metrics: [
      { label: "Attractions", value: "500+" },
      { label: "Visitors/Year", value: "500M+" },
      { label: "Theme Parks", value: "50" },
      { label: "Countries", value: "80+" }
    ],
    products: [
      { name: "ParkPass", description: "Universal attraction access", image: "/placeholder.svg" },
      { name: "VirtualTour", description: "Virtual experiences", image: "/placeholder.svg" },
      { name: "EcoTourism", description: "Sustainable adventures", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Smart Theme Park", description: "AI-optimized guest experience", result: "50% shorter wait times" },
      { title: "Virtual Heritage", description: "VR historical experiences", result: "10M+ virtual tourists to protected sites" }
    ]
  },

  // SPECIALIZED SERVICES (10)
  {
    id: "neurolink",
    name: "NeuroLink",
    slug: "neurolink",
    subdomain: "neurolink.alsamos.com",
    icon: "Sparkle",
    description: "Brain-computer interfaces, neurotechnology, and cognitive enhancement.",
    fullDescription: "ALSAMOS NeuroLink pioneers brain-computer interfaces connecting minds to technology. Our neurotechnology enables new forms of communication, treats neurological conditions, and expands human potential.",
    gradient: "from-purple-600 to-violet-600",
    metrics: [
      { label: "Implants", value: "100K+" },
      { label: "Neural Connections", value: "1M+" },
      { label: "Conditions Treated", value: "50+" },
      { label: "Research Partners", value: "500+" }
    ],
    products: [
      { name: "NeuroChip", description: "Brain-computer interface", image: "/placeholder.svg" },
      { name: "MindLink", description: "Thought-to-text", image: "/placeholder.svg" },
      { name: "NeuroHealth", description: "Neurological treatments", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Paralysis Breakthrough", description: "Restoring movement through BCI", result: "10K+ paralyzed patients regained mobility" },
      { title: "Thought Communication", description: "Direct brain-to-brain messaging", result: "First successful telepathic communication" }
    ]
  },
  {
    id: "spacetravel",
    name: "Space Tourism",
    slug: "spacetravel",
    subdomain: "space.alsamos.com",
    icon: "Orbit",
    description: "Commercial space travel, orbital hotels, and space experiences.",
    fullDescription: "ALSAMOS Space Tourism makes the cosmos accessible with suborbital flights, orbital stays, and lunar experiences, opening the final frontier to civilian explorers.",
    gradient: "from-indigo-600 to-purple-600",
    metrics: [
      { label: "Space Tourists", value: "10K+" },
      { label: "Orbital Flights", value: "500+" },
      { label: "Space Hotels", value: "3" },
      { label: "Lunar Visitors", value: "100+" }
    ],
    products: [
      { name: "SuborbitalX", description: "Space edge flights", image: "/placeholder.svg" },
      { name: "OrbitalStay", description: "Space hotel", image: "/placeholder.svg" },
      { name: "LunarExpress", description: "Moon tourism", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Space Hotel Launch", description: "First commercial space hotel", result: "Orbiting luxury accommodation" },
      { title: "Accessible Space", description: "Reduced cost space tourism", result: "Space flights at 1/10th original cost" }
    ]
  },
  {
    id: "embassy",
    name: "Government Services",
    slug: "government",
    subdomain: "gov.alsamos.com",
    icon: "Building",
    description: "E-government, digital public services, and civic technology.",
    fullDescription: "ALSAMOS Government modernizes public services with digital platforms, AI-powered citizen services, and transparent governance technology for efficient, accessible government.",
    gradient: "from-blue-700 to-indigo-700",
    metrics: [
      { label: "Government Clients", value: "200+" },
      { label: "Citizens Served", value: "1B+" },
      { label: "Digital Services", value: "10K+" },
      { label: "Efficiency Gain", value: "50%" }
    ],
    products: [
      { name: "GovCloud", description: "Government cloud platform", image: "/placeholder.svg" },
      { name: "CitizenApp", description: "Digital public services", image: "/placeholder.svg" },
      { name: "GovAI", description: "AI for government", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Digital Nation", description: "Complete government digitization", result: "100% of services online, 90% citizen adoption" },
      { title: "AI Public Services", description: "Automated government services", result: "80% faster service delivery" }
    ]
  },
  {
    id: "nonprofit",
    name: "Philanthropy",
    slug: "nonprofit",
    subdomain: "giving.alsamos.com",
    icon: "Heart",
    description: "Charitable foundations, social impact, and humanitarian programs.",
    fullDescription: "ALSAMOS Foundation drives positive change through strategic philanthropy, humanitarian aid, and social impact programs addressing global challenges from poverty to climate.",
    gradient: "from-rose-500 to-pink-500",
    metrics: [
      { label: "Annual Giving", value: "$10B+" },
      { label: "Lives Impacted", value: "1B+" },
      { label: "Projects", value: "50K+" },
      { label: "Countries", value: "180+" }
    ],
    products: [
      { name: "GiveNow", description: "Donation platform", image: "/placeholder.svg" },
      { name: "ImpactTrack", description: "Impact measurement", image: "/placeholder.svg" },
      { name: "VolunteerHub", description: "Volunteer coordination", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Global Poverty Reduction", description: "Multi-sector poverty programs", result: "100M+ lifted out of extreme poverty" },
      { title: "Climate Action", description: "Environmental philanthropy", result: "$5B+ for climate solutions" }
    ]
  },
  {
    id: "research",
    name: "Research & Development",
    slug: "research",
    subdomain: "research.alsamos.com",
    icon: "Microscope",
    description: "Scientific research, innovation labs, and technology R&D.",
    fullDescription: "ALSAMOS Research drives breakthrough innovation across all sectors with world-class research facilities, top scientists, and ambitious programs pushing the boundaries of human knowledge.",
    gradient: "from-cyan-600 to-blue-600",
    metrics: [
      { label: "Research Labs", value: "200+" },
      { label: "Scientists", value: "50K+" },
      { label: "Patents/Year", value: "10K+" },
      { label: "R&D Budget", value: "$50B+/year" }
    ],
    products: [
      { name: "LabCloud", description: "Research collaboration", image: "/placeholder.svg" },
      { name: "InnoHub", description: "Innovation incubator", image: "/placeholder.svg" },
      { name: "ScienceAI", description: "AI research assistant", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Moonshot Projects", description: "10x breakthrough research", result: "5 Nobel Prizes in 10 years" },
      { title: "Open Science", description: "Open research publication", result: "All research freely accessible" }
    ]
  },
  {
    id: "venture",
    name: "Venture Capital",
    slug: "venture",
    subdomain: "ventures.alsamos.com",
    icon: "Rocket",
    description: "Startup investment, venture funding, and entrepreneurship support.",
    fullDescription: "ALSAMOS Ventures invests in and supports the next generation of world-changing startups with funding, mentorship, and resources from idea to IPO.",
    gradient: "from-orange-500 to-yellow-500",
    metrics: [
      { label: "Investments Made", value: "5K+" },
      { label: "Capital Deployed", value: "$50B+" },
      { label: "Unicorns Created", value: "200+" },
      { label: "IPOs", value: "500+" }
    ],
    products: [
      { name: "StartupFund", description: "Seed to growth funding", image: "/placeholder.svg" },
      { name: "FounderHub", description: "Startup resources", image: "/placeholder.svg" },
      { name: "AcceleratorX", description: "Startup accelerator", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Unicorn Factory", description: "Building billion-dollar companies", result: "200+ portfolio companies valued $1B+" },
      { title: "Deep Tech Investment", description: "Funding breakthrough technology", result: "$10B in deep tech investments" }
    ]
  },
  {
    id: "logistics",
    name: "Logistics & Supply Chain",
    slug: "logistics",
    subdomain: "logistics.alsamos.com",
    icon: "Truck",
    description: "Freight, warehousing, last-mile delivery, and supply chain solutions.",
    fullDescription: "ALSAMOS Logistics powers global commerce with AI-optimized supply chains, autonomous delivery, and sustainable logistics moving goods efficiently worldwide.",
    gradient: "from-blue-500 to-indigo-500",
    metrics: [
      { label: "Packages/Day", value: "100M+" },
      { label: "Warehouses", value: "10K+" },
      { label: "Delivery Vehicles", value: "500K+" },
      { label: "Countries", value: "200+" }
    ],
    products: [
      { name: "ShipAI", description: "AI logistics optimization", image: "/placeholder.svg" },
      { name: "WarehouseOS", description: "Smart warehousing", image: "/placeholder.svg" },
      { name: "LastMile", description: "Delivery platform", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Same-Day Delivery", description: "Global same-day logistics", result: "Same-day delivery in 1000+ cities" },
      { title: "Autonomous Delivery", description: "Robot and drone delivery", result: "1B+ autonomous deliveries" }
    ]
  },
  {
    id: "education_services",
    name: "Tutoring & Test Prep",
    slug: "tutoring",
    subdomain: "tutoring.alsamos.com",
    icon: "BookOpen",
    description: "Private tutoring, test preparation, and academic support services.",
    fullDescription: "ALSAMOS Tutoring provides personalized academic support with AI tutors, expert instructors, and test prep programs helping students achieve their educational goals.",
    gradient: "from-violet-500 to-indigo-500",
    metrics: [
      { label: "Students Tutored", value: "50M+" },
      { label: "Tutors", value: "1M+" },
      { label: "Subjects", value: "500+" },
      { label: "Score Improvement", value: "30%" }
    ],
    products: [
      { name: "TutorMatch", description: "Find expert tutors", image: "/placeholder.svg" },
      { name: "TestPrep Pro", description: "Test preparation", image: "/placeholder.svg" },
      { name: "AI Homework", description: "AI homework help", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "AI Tutoring at Scale", description: "24/7 AI-powered tutoring", result: "30% average grade improvement" },
      { title: "Test Score Boost", description: "SAT/ACT preparation", result: "200+ average point increase" }
    ]
  },
  {
    id: "cleaning",
    name: "Cleaning Services",
    slug: "cleaning",
    subdomain: "clean.alsamos.com",
    icon: "Sparkles",
    description: "Commercial and residential cleaning, sanitation services.",
    fullDescription: "ALSAMOS Clean provides professional cleaning services with eco-friendly products, robotic cleaning, and quality assurance for homes and businesses worldwide.",
    gradient: "from-cyan-400 to-blue-400",
    metrics: [
      { label: "Properties Cleaned", value: "10M+/month" },
      { label: "Cleaning Staff", value: "500K+" },
      { label: "Cleaning Robots", value: "100K+" },
      { label: "Cities", value: "5K+" }
    ],
    products: [
      { name: "CleanBook", description: "On-demand cleaning", image: "/placeholder.svg" },
      { name: "RoboClean", description: "Robotic cleaning", image: "/placeholder.svg" },
      { name: "GreenClean", description: "Eco-friendly services", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Hospital-Grade Cleaning", description: "Medical facility sanitation", result: "99.99% pathogen elimination" },
      { title: "Sustainable Cleaning", description: "Zero-chemical cleaning solutions", result: "100% biodegradable products" }
    ]
  },
  {
    id: "security_services",
    name: "Security Services",
    slug: "securityservices",
    subdomain: "guard.alsamos.com",
    icon: "ShieldCheck",
    description: "Physical security, surveillance, and protective services.",
    fullDescription: "ALSAMOS Security provides comprehensive protection with AI surveillance, professional guards, and integrated security systems for properties, events, and individuals.",
    gradient: "from-gray-600 to-slate-700",
    metrics: [
      { label: "Security Personnel", value: "1M+" },
      { label: "Properties Protected", value: "5M+" },
      { label: "Cameras Monitored", value: "50M+" },
      { label: "Response Time", value: "<3 min" }
    ],
    products: [
      { name: "GuardForce", description: "Professional security", image: "/placeholder.svg" },
      { name: "WatchAI", description: "AI surveillance", image: "/placeholder.svg" },
      { name: "SecureEvent", description: "Event security", image: "/placeholder.svg" }
    ],
    caseStudies: [
      { title: "Smart City Security", description: "City-wide security network", result: "50% crime reduction" },
      { title: "AI Threat Detection", description: "Predictive security", result: "90% of threats prevented" }
    ]
  }
];
