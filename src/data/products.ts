export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  fullDescription: string;
  category: string;
  icon: string;
  gradient: string;
  features: string[];
  specifications: { label: string; value: string }[];
  price?: string;
  images: string[];
  relatedProducts: string[];
}

export const productCategories = [
  "All",
  "Technology",
  "Education",
  "Healthcare",
  "Automotive",
  "Aerospace",
  "AI & Robotics",
  "Consumer Electronics",
  "Finance",
  "Smart Home",
  "Wearables",
  "Enterprise",
  "Gaming",
  "Security"
];

export const products: Product[] = [
  {
    id: "1",
    slug: "alsamos-ai-assistant",
    name: "ALSAMOS AI Assistant",
    tagline: "Your Intelligent Business Partner",
    description: "Next-generation AI assistant powered by advanced machine learning algorithms.",
    fullDescription: "ALSAMOS AI Assistant is a revolutionary artificial intelligence platform designed to transform how businesses operate. Built on cutting-edge neural network architecture, it provides intelligent automation, natural language processing, and predictive analytics capabilities that scale with your organization. From customer service automation to complex data analysis, our AI Assistant handles tasks with unprecedented accuracy and efficiency.",
    category: "AI & Robotics",
    icon: "Brain",
    gradient: "from-purple-500 to-indigo-600",
    features: [
      "Natural Language Processing",
      "Predictive Analytics",
      "Multi-language Support",
      "Real-time Learning",
      "Enterprise Integration",
      "24/7 Availability"
    ],
    specifications: [
      { label: "Response Time", value: "<100ms" },
      { label: "Languages Supported", value: "50+" },
      { label: "Accuracy Rate", value: "99.7%" },
      { label: "API Calls/Second", value: "10,000+" },
      { label: "Uptime", value: "99.99%" }
    ],
    price: "Contact for Enterprise Pricing",
    images: ["/placeholder.svg"],
    relatedProducts: ["2", "3"]
  },
  {
    id: "2",
    slug: "alsamos-smartwatch-pro",
    name: "ALSAMOS SmartWatch Pro",
    tagline: "Time Meets Intelligence",
    description: "Premium smartwatch with health monitoring and seamless connectivity.",
    fullDescription: "The ALSAMOS SmartWatch Pro represents the pinnacle of wearable technology. Featuring a stunning AMOLED display, advanced health sensors, and our proprietary ALSAMOS OS, this smartwatch seamlessly integrates with your digital life. Monitor your heart rate, blood oxygen, sleep patterns, and more with clinical-grade accuracy.",
    category: "Consumer Electronics",
    icon: "Watch",
    gradient: "from-cyan-500 to-blue-600",
    features: [
      "Heart Rate Monitoring",
      "Blood Oxygen Sensor",
      "Sleep Tracking",
      "GPS Navigation",
      "5ATM Water Resistance",
      "7-Day Battery Life"
    ],
    specifications: [
      { label: "Display", value: "1.4\" AMOLED" },
      { label: "Resolution", value: "454x454" },
      { label: "Battery", value: "420mAh" },
      { label: "Water Resistance", value: "5ATM" },
      { label: "Connectivity", value: "Bluetooth 5.2, Wi-Fi" }
    ],
    price: "$499",
    images: ["/placeholder.svg"],
    relatedProducts: ["1", "4"]
  },
  {
    id: "3",
    slug: "alsamos-cloud-platform",
    name: "ALSAMOS Cloud Platform",
    tagline: "Scale Without Limits",
    description: "Enterprise-grade cloud infrastructure for modern businesses.",
    fullDescription: "ALSAMOS Cloud Platform provides a comprehensive suite of cloud services designed for enterprises demanding the highest levels of performance, security, and reliability. Our globally distributed infrastructure ensures low latency access from anywhere in the world, while our advanced security features protect your most sensitive data.",
    category: "Technology",
    icon: "Cloud",
    gradient: "from-blue-500 to-purple-600",
    features: [
      "Global CDN",
      "Auto-scaling",
      "99.99% Uptime SLA",
      "DDoS Protection",
      "Real-time Analytics",
      "24/7 Support"
    ],
    specifications: [
      { label: "Data Centers", value: "50+ Global" },
      { label: "Uptime SLA", value: "99.99%" },
      { label: "Bandwidth", value: "Unlimited" },
      { label: "Storage Options", value: "SSD/NVMe" },
      { label: "Compliance", value: "SOC2, HIPAA, GDPR" }
    ],
    price: "Starting at $99/month",
    images: ["/placeholder.svg"],
    relatedProducts: ["1", "5"]
  },
  {
    id: "4",
    slug: "alsamos-ev-model-x",
    name: "ALSAMOS EV Model X",
    tagline: "Drive the Future",
    description: "All-electric luxury vehicle with autonomous driving capabilities.",
    fullDescription: "The ALSAMOS EV Model X redefines automotive excellence with its revolutionary electric powertrain and advanced autonomous driving system. Experience zero-emission luxury with a range of over 500 miles, lightning-fast acceleration, and our signature minimalist interior design featuring a panoramic glass roof and premium materials throughout.",
    category: "Automotive",
    icon: "Car",
    gradient: "from-green-500 to-emerald-600",
    features: [
      "500+ Mile Range",
      "0-60 in 2.5 seconds",
      "Level 4 Autonomy",
      "Panoramic Glass Roof",
      "Premium Audio System",
      "Over-the-Air Updates"
    ],
    specifications: [
      { label: "Range", value: "520 miles" },
      { label: "Acceleration", value: "0-60 in 2.5s" },
      { label: "Top Speed", value: "200 mph" },
      { label: "Battery", value: "150 kWh" },
      { label: "Charging", value: "350kW DC Fast" }
    ],
    price: "Starting at $89,999",
    images: ["/placeholder.svg"],
    relatedProducts: ["2", "6"]
  },
  {
    id: "5",
    slug: "alsamos-medical-scanner",
    name: "ALSAMOS Medical Scanner",
    tagline: "Precision Diagnostics",
    description: "AI-powered medical imaging system for accurate diagnostics.",
    fullDescription: "The ALSAMOS Medical Scanner combines cutting-edge imaging technology with artificial intelligence to deliver unprecedented diagnostic accuracy. Our system detects abnormalities with 99.9% accuracy, helping healthcare providers make faster, more informed decisions. The compact design makes it suitable for hospitals, clinics, and mobile health units.",
    category: "Healthcare",
    icon: "Heart",
    gradient: "from-red-500 to-pink-600",
    features: [
      "AI-Powered Analysis",
      "99.9% Accuracy",
      "Real-time Results",
      "Cloud Integration",
      "HIPAA Compliant",
      "Compact Design"
    ],
    specifications: [
      { label: "Detection Accuracy", value: "99.9%" },
      { label: "Scan Time", value: "<5 minutes" },
      { label: "Resolution", value: "0.1mm" },
      { label: "Data Export", value: "DICOM, HL7" },
      { label: "Certifications", value: "FDA, CE, ISO" }
    ],
    price: "Contact for Medical Pricing",
    images: ["/placeholder.svg"],
    relatedProducts: ["1", "3"]
  },
  {
    id: "6",
    slug: "alsamos-satellite-link",
    name: "ALSAMOS Satellite Link",
    tagline: "Connect Everywhere",
    description: "Global satellite communication system for remote connectivity.",
    fullDescription: "ALSAMOS Satellite Link provides reliable, high-speed internet connectivity anywhere on Earth. Our constellation of low-earth orbit satellites ensures minimal latency and maximum coverage, making it ideal for remote locations, maritime operations, aviation, and emergency response scenarios.",
    category: "Aerospace",
    icon: "Satellite",
    gradient: "from-indigo-500 to-violet-600",
    features: [
      "Global Coverage",
      "Low Latency (<20ms)",
      "High Bandwidth",
      "Weather Resistant",
      "Easy Installation",
      "Maritime Certified"
    ],
    specifications: [
      { label: "Coverage", value: "Global" },
      { label: "Latency", value: "<20ms" },
      { label: "Download Speed", value: "500 Mbps" },
      { label: "Upload Speed", value: "100 Mbps" },
      { label: "Antenna Size", value: "Compact" }
    ],
    price: "$199/month + Equipment",
    images: ["/placeholder.svg"],
    relatedProducts: ["3", "4"]
  },
  {
    id: "7",
    slug: "alsamos-eduplatform",
    name: "ALSAMOS EduPlatform",
    tagline: "Learn Without Boundaries",
    description: "Comprehensive digital learning platform for all ages.",
    fullDescription: "ALSAMOS EduPlatform revolutionizes education with adaptive learning algorithms, interactive content, and real-time progress tracking. From kindergarten to professional development, our platform provides personalized learning paths that adapt to each student's pace and learning style.",
    category: "Education",
    icon: "GraduationCap",
    gradient: "from-yellow-500 to-orange-600",
    features: [
      "Adaptive Learning",
      "Interactive Content",
      "Progress Tracking",
      "Certification Programs",
      "Multi-language",
      "Offline Access"
    ],
    specifications: [
      { label: "Courses", value: "10,000+" },
      { label: "Languages", value: "30+" },
      { label: "Certifications", value: "500+" },
      { label: "Students", value: "5M+" },
      { label: "Instructors", value: "50,000+" }
    ],
    price: "Free - $29.99/month",
    images: ["/placeholder.svg"],
    relatedProducts: ["1", "8"]
  },
  {
    id: "8",
    slug: "alsamos-fintech-suite",
    name: "ALSAMOS FinTech Suite",
    tagline: "Banking Reimagined",
    description: "Complete financial technology platform for modern banking.",
    fullDescription: "ALSAMOS FinTech Suite provides banks and financial institutions with a comprehensive platform for digital transformation. From mobile banking to fraud detection, our suite covers every aspect of modern financial services with enterprise-grade security and regulatory compliance built in.",
    category: "Finance",
    icon: "Landmark",
    gradient: "from-emerald-500 to-teal-600",
    features: [
      "Digital Banking",
      "Fraud Detection",
      "KYC/AML Compliance",
      "Real-time Payments",
      "API Banking",
      "White-label Solutions"
    ],
    specifications: [
      { label: "Transaction Speed", value: "<1 second" },
      { label: "Fraud Detection", value: "99.8%" },
      { label: "Compliance", value: "PCI-DSS, SOC2" },
      { label: "API Calls", value: "Unlimited" },
      { label: "Uptime", value: "99.99%" }
    ],
    price: "Enterprise Pricing",
    images: ["/placeholder.svg"],
    relatedProducts: ["3", "1"]
  },
  {
    id: "9",
    slug: "alsamos-smart-home-hub",
    name: "ALSAMOS Smart Home Hub",
    tagline: "Your Home, Smarter",
    description: "Central control system for all your smart home devices.",
    fullDescription: "The ALSAMOS Smart Home Hub brings all your connected devices together in one seamless ecosystem. Control lighting, climate, security, and entertainment with voice commands or our intuitive app. Compatible with thousands of devices and powered by AI that learns your preferences.",
    category: "Smart Home",
    icon: "Home",
    gradient: "from-amber-500 to-orange-600",
    features: [
      "Voice Control",
      "AI Learning",
      "Universal Compatibility",
      "Energy Management",
      "Security Integration",
      "Remote Access"
    ],
    specifications: [
      { label: "Protocols", value: "Zigbee, Z-Wave, WiFi, Thread" },
      { label: "Devices Supported", value: "5,000+" },
      { label: "Voice Assistants", value: "All Major" },
      { label: "Response Time", value: "<50ms" },
      { label: "Power", value: "12W Max" }
    ],
    price: "$299",
    images: ["/placeholder.svg"],
    relatedProducts: ["2", "10"]
  },
  {
    id: "10",
    slug: "alsamos-vr-headset",
    name: "ALSAMOS VR Headset",
    tagline: "Reality Reimagined",
    description: "Next-gen virtual reality with stunning visuals and comfort.",
    fullDescription: "Experience virtual reality like never before with the ALSAMOS VR Headset. Featuring 8K displays per eye, advanced eye tracking, and haptic feedback, it delivers the most immersive VR experience available. Perfect for gaming, training, design, and virtual collaboration.",
    category: "Gaming",
    icon: "Glasses",
    gradient: "from-fuchsia-500 to-purple-600",
    features: [
      "8K Per Eye Display",
      "Eye Tracking",
      "Haptic Feedback",
      "Wireless Option",
      "Mixed Reality",
      "6DoF Tracking"
    ],
    specifications: [
      { label: "Resolution", value: "8K x 8K per eye" },
      { label: "Refresh Rate", value: "120Hz" },
      { label: "FOV", value: "210°" },
      { label: "Weight", value: "380g" },
      { label: "Battery Life", value: "4 hours" }
    ],
    price: "$1,499",
    images: ["/placeholder.svg"],
    relatedProducts: ["9", "11"]
  },
  {
    id: "11",
    slug: "alsamos-security-system",
    name: "ALSAMOS Security Pro",
    tagline: "Peace of Mind",
    description: "AI-powered comprehensive home and business security.",
    fullDescription: "ALSAMOS Security Pro uses advanced AI to provide unmatched protection for homes and businesses. Features include facial recognition, anomaly detection, 24/7 monitoring, and instant alerts. The system learns normal patterns and identifies potential threats before they become problems.",
    category: "Security",
    icon: "Shield",
    gradient: "from-slate-600 to-zinc-800",
    features: [
      "AI Threat Detection",
      "Facial Recognition",
      "24/7 Monitoring",
      "Smart Alerts",
      "Cloud Storage",
      "Emergency Response"
    ],
    specifications: [
      { label: "Camera Resolution", value: "4K HDR" },
      { label: "Night Vision", value: "100ft" },
      { label: "Storage", value: "Unlimited Cloud" },
      { label: "Response Time", value: "<1 second" },
      { label: "Accuracy", value: "99.9%" }
    ],
    price: "$49.99/month",
    images: ["/placeholder.svg"],
    relatedProducts: ["9", "3"]
  },
  {
    id: "12",
    slug: "alsamos-enterprise-ai",
    name: "ALSAMOS Enterprise AI",
    tagline: "Transform Your Business",
    description: "Complete AI transformation platform for enterprises.",
    fullDescription: "ALSAMOS Enterprise AI is a comprehensive platform that brings artificial intelligence capabilities to every aspect of your business. From automated decision-making to predictive analytics, process optimization to customer insights, this platform transforms how enterprises operate.",
    category: "Enterprise",
    icon: "Building2",
    gradient: "from-blue-600 to-indigo-700",
    features: [
      "Process Automation",
      "Predictive Analytics",
      "Custom AI Models",
      "Integration APIs",
      "Real-time Insights",
      "Scalable Infrastructure"
    ],
    specifications: [
      { label: "Model Training", value: "Custom" },
      { label: "Data Processing", value: "Petabytes" },
      { label: "API Latency", value: "<10ms" },
      { label: "Integrations", value: "500+" },
      { label: "Support", value: "24/7 Enterprise" }
    ],
    price: "Custom Enterprise Pricing",
    images: ["/placeholder.svg"],
    relatedProducts: ["1", "3"]
  }
];
