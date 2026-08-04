import type { AcademicProgramme, StudentProject, ResearchArea, FacultyMember, HubMilestone, PromoSlide } from '../types';

export const INSTITUTION_INFO = {
  universityName: "University of Professional Studies, Accra (UPSA)",
  motto: "Scholarship with Professionalism",
  established: "1965 (as IPS), Chartered 2008, Act 850 (2012)",
  address: "P.O. Box LG 149, Accra – Ghana",
  location: "UPSA Road, Madina, Accra, Ghana",
  facultyName: "Faculty of Information Technology and Communication Studies (FITCS)",
  facultyEst: "2008",
  facultyLocation: "Justice Aryeetey Building, 3rd & 4th Floors (Rooms 310/311/410/411/412/407/408/409)",
  facultyPhone: "0303 961 753",
  switchboard: "+233 303 937 544 / +233 303 937 542 / +233 303 958 571",
  email: "admissions@upsamail.edu.gh",
  digitalAddress: "GM-037-0480",
  dean: "Prof. Godfred Yaw Koi-Akrofi",
  departmentName: "Department of Information Technology Studies",
  hodName: "Dr. Joshua Kwaku Ofoeda",
  isHodConfirmed: true,
  studentEnrolmentCount: null, // Unconfirmed - will display [CONFIRM] badge
  isEnrolmentConfirmed: false,
  facultyVision: "To be a distinguished faculty known for providing unique and excellent education and training in Communication and Information Technology Management.",
  facultyCredo: "Efficient communication and IT for professionalism.",
  brandColors: {
    upsaBlue: "#003366",
    upsaGold: "#F2B705",
    techCyan: "#00AEEF",
    lightGrey: "#F5F7FA",
    textPrimary: "#1A1A1A",
    textSecondary: "#555555"
  },
  socials: {
    x: "https://twitter.com/upsaccra",
    xHandle: "@upsaccra",
    facebook: "https://facebook.com/upsaccra",
    instagram: "https://instagram.com/upsaccra",
    tiktok: "https://tiktok.com/@upsaccra",
    linkedin: "https://linkedin.com/school/upsaccra",
    youtube: "https://youtube.com/@upsaccra"
  }
};

export const PROGRAMMES: AcademicProgramme[] = [
  {
    id: "bsc-it-mgt",
    code: "BSc ITM",
    name: "BSc Information Technology Management",
    level: "Undergraduate",
    duration: "4 Years",
    tagline: "Bridging business strategy with enterprise IT execution.",
    description: "Equips students with solid foundations in software development, database administration, network engineering, and corporate IT governance.",
    skillsDeveloped: ["Enterprise Architecture", "Software Engineering", "Database Systems", "IT Project Management", "Network Administration"],
    careerOutcomes: ["IT Systems Analyst", "Database Administrator", "Enterprise Solutions Architect", "Network Engineer", "IT Project Manager"],
    coreModules: [
      "Programming Fundamentals & OOP",
      "Database Management Systems",
      "Network Infrastructure & Security",
      "Systems Analysis & Agile Design",
      "Enterprise Resource Planning (ERP)",
      "IT Governance & Ethics"
    ],
    imageUrl: "/images/prog_bsc_it.png",
    entryRequirements: [
      "WASSCE: Credit passes (A1-C6) in Core English, Core Math, Integrated Science/Social Studies, plus 3 Electives",
      "SSSCE: Credit passes (A-D) in Core & Elective subjects",
      "HND or Diploma in IT/Computer Science for Top-Up admission"
    ]
  },
  {
    id: "bsc-ds-analytics",
    code: "BSc DSA",
    name: "BSc Data Science and Analytics",
    level: "Undergraduate",
    duration: "4 Years",
    imageUrl: "/images/prog_bsc_ds.png",
    tagline: "Unlocking actionable business intelligence from complex data.",
    description: "Prepares data-driven leaders in machine learning, big data architectures, statistical modeling, and real-time analytical decision systems.",
    skillsDeveloped: ["Machine Learning", "Python/R Analytics", "SQL & Big Data", "Data Visualization", "Statistical Inference"],
    careerOutcomes: ["Data Scientist", "Business Intelligence Engineer", "Data Analyst", "Machine Learning Specialist", "Quantitative Risk Analyst"],
    coreModules: [
      "Applied Data Structures & Algorithms",
      "Statistical Computing & Probability",
      "Machine Learning & Pattern Recognition",
      "Big Data Processing & Warehousing",
      "Data Mining & Visualization",
      "AI Ethics & Data Privacy"
    ],
    entryRequirements: [
      "WASSCE/SSSCE with strong background in Elective Mathematics",
      "Diploma in Data Science, Computer Science, or Statistics"
    ]
  },
  {
    id: "dip-it-mgt",
    code: "Dip ITM",
    name: "Diploma in Information Technology Management",
    level: "Diploma",
    duration: "2 Years",
    imageUrl: "/images/prog_dip_it.png",
    tagline: "Fast-track technical training for hands-on IT professionals.",
    description: "Practical 2-year diploma focused on practical hardware maintenance, basic web development, network administration, and IT support services.",
    skillsDeveloped: ["Hardware & Systems Support", "Web Technologies", "Network Fundamentals", "Client Support Management"],
    careerOutcomes: ["IT Support Specialist", "Network Administrator", "Junior Web Developer", "Helpdesk Technical Lead"],
    coreModules: [
      "Computer Hardware & System Software",
      "Web Technologies & HTML/CSS/JS",
      "Computer Networking Essentials",
      "Database Applications",
      "IT Customer Support & Helpdesk"
    ],
    entryRequirements: [
      "WASSCE: Passes (A1-D7) in 3 Core subjects and 3 Elective subjects",
      "Mature Candidates (25+ years with relevant work experience)"
    ]
  },
  {
    id: "msc-info-sec",
    code: "MSc ISM",
    name: "MSc Information Security Management",
    level: "Postgraduate",
    duration: "1 Year",
    isNew: true,
    imageUrl: "/images/prog_msc_sec.png",
    tagline: "Advanced cybersecurity leadership for digital asset protection.",
    description: "Designed for professionals seeking advanced mastery in threat intelligence, ISO 27001 compliance, penetration testing, and strategic cybersecurity governance.",
    skillsDeveloped: ["Cyber Security Governance", "Risk Assessment & Mitigation", "Digital Forensics", "Ethical Hacking", "Cloud & Network Defense"],
    careerOutcomes: ["Chief Information Security Officer (CISO)", "Cybersecurity Manager", "Security Auditor", "Incident Response Team Lead"],
    coreModules: [
      "Cyber Crime & Information Warfare",
      "Information Security Governance & Compliance",
      "Advanced Penetration Testing & Ethical Hacking",
      "Digital Forensics & Incident Response",
      "Cloud Security & Infrastructure Resilience"
    ],
    entryRequirements: [
      "First Degree (Good Second Class or better) in IT, Computer Science, Engineering, or related field from a recognized university",
      "Relevant professional work experience in IT or Information Security is an advantage"
    ]
  },
  {
    id: "mba-mis",
    code: "MBA MIS",
    name: "MBA in Management Information Systems",
    level: "Postgraduate",
    duration: "2 Years",
    isNew: true,
    imageUrl: "/images/prog_mba_mis.png",
    tagline: "Transforming technology insights into corporate executive strategy.",
    description: "Integrates executive business management with cutting-edge information technology strategy, digital transformation, and IT management decision systems.",
    skillsDeveloped: ["Digital Transformation", "Strategic IT Alignment", "CIO Executive Management", "Business Process Re-engineering"],
    careerOutcomes: ["Chief Information Officer (CIO)", "IT Director", "Digital Transformation Manager", "Senior Technology Consultant"],
    coreModules: [
      "Strategic Management Information Systems",
      "Corporate Finance & Executive Leadership",
      "Digital Business & E-Commerce Strategy",
      "Managing Complex IT Projects",
      "Data Analytics for Business Decision Making"
    ],
    entryRequirements: [
      "Recognized Bachelor's degree in any discipline",
      "Minimum 2 years post-qualification managerial/professional experience"
    ]
  }
];

export const RESEARCH_AREAS: ResearchArea[] = [
  {
    id: "ai",
    title: "Artificial Intelligence & Machine Learning",
    description: "Investigating applied machine learning models, predictive intelligence, and natural language processing tailored for African socio-economic challenges.",
    iconName: "BrainCircuit",
    keyTopics: ["Applied ML", "Natural Language Processing", "Computer Vision", "Algorithmic Ethics"]
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity & Information Assurance",
    description: "Protecting critical infrastructure, network security protocols, threat vector monitoring, and enterprise data privacy models.",
    iconName: "ShieldCheck",
    keyTopics: ["Threat Intelligence", "Zero-Trust Architecture", "Digital Forensics", "Data Privacy"]
  },
  {
    id: "informatics",
    title: "Informatics & Data Science",
    description: "Extracting actionable insights from structured and unstructured data repositories across health, business, and educational sectors.",
    iconName: "Database",
    keyTopics: ["Big Data Analytics", "Health Informatics", "Predictive Modeling", "Visual Analytics"]
  },
  {
    id: "infosystems",
    title: "Information Systems & Digital Strategy",
    description: "Analyzing how enterprise systems, cloud platforms, and IT governance frameworks drive institutional performance and professional agility.",
    iconName: "Server",
    keyTopics: ["Enterprise ERP", "IT Governance", "Cloud Computing", "Digital Transformation"]
  },
  {
    id: "programming",
    title: "Software Engineering & Systems Programming",
    description: "Advancing modern software development methodologies, microservices, cloud-native deployments, and open-source ecosystems.",
    iconName: "Code2",
    keyTopics: ["Full-Stack Architecture", "DevOps & CI/CD", "API Design", "Agile Methodologies"]
  },
  {
    id: "computerscience",
    title: "Computer Science Foundations",
    description: "Exploring core computational models, distributed algorithms, system performance optimization, and network topology.",
    iconName: "Cpu",
    keyTopics: ["Distributed Systems", "Algorithms & Complexity", "Network Protocols", "High-Performance Computing"]
  }
];

export const HUB_DETAILS = {
  name: "UPSA Developers Hub",
  launchedDate: "17 December 2025",
  launchLocation: "University Computer Laboratory, UPSA",
  nature: "Student-led, department-guided, project-based learning community.",
  mission: "To foster collaborative software development, practical technical mentorship, hackathon-style innovation, and direct industry exposure.",
  facultyMentor: {
    name: "Dr. Augustina Dede Agor",
    title: "Senior Lecturer & Faculty Mentor",
    degree: "PhD (Computer Science)",
    role: "Department Mentor & Academic Advisor for Developers Hub"
  },
  milestone: {
    id: "net-infra-2026",
    date: "24–27 March 2026",
    title: "UPSA Live Network Infrastructure Guided Exposure",
    location: "UPSA Data Center & Central Server Room",
    participantsCount: "~400",
    description: "Over 400 Developers Hub members engaged in a hands-on exploration of UPSA's enterprise network infrastructure, guided by the university's IT Services Department.",
    collaborators: [
      "Mr. James Tetteh Ami-Narh (Director, IT Services Department)",
      "Mr. John Haizel-Commeh (Deputy Director of Infrastructure, IT Services)"
    ],
    keyHighlights: [
      "Direct inspection of core routing switches and server virtualization racks",
      "Analysis of live campus fiber backbones and Wi-Fi access management",
      "Real-world enterprise network troubleshooting and traffic monitoring",
      "Bridge between academic networking theory and live campus operations"
    ]
  } as HubMilestone
};

export const PROJECTS: StudentProject[] = [
  {
    id: "bloodvault",
    title: "BloodVault",
    subtitle: "Web-Based Blood-Bank Management & Allocation System",
    description: "An intelligent digital platform connecting blood donors, hospitals, and blood banks to ensure real-time inventory tracking and urgent emergency matching.",
    fullDetails: "BloodVault was designed and engineered by Baffour Akoto Aninfeng under the UPSA Developers Hub. The platform digitizes blood donation records, automates blood type compatibility matching, provides live inventory dashboards for hospital blood banks, and sends automated SMS alerts to eligible donors during critical shortages.",
    category: "Web Development",
    technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"],
    studentName: "Baffour Akoto Aninfeng",
    studentRole: "Lead Developer (Student)",
    mentorName: "Dr. Augustina Dede Agor",
    hubAffiliation: "UPSA Developers Hub",
    isVerifiedReal: true,
    isSample: false,
    imageUrl: "/images/bloodvault_preview.jpg",
    articleUrl: "https://www.graphic.com.gh/news/education/upsa-developers-hub-students-build-innovative-tech-solutions.html",
    articleSource: "Graphic Online / UPSA Press",
    githubUrl: "https://github.com/upsaccra",
    demoUrl: "#",
    date: "March 2026",
    featured: true
  },
  {
    id: "upsa-hms-prototype",
    title: "Hospital Management System (HMS)",
    subtitle: "Digital Patient Records & Clinical Triage System",
    description: "A software engineering platform prototyped by UPSA Developers Hub students following observational field visits to healthcare institutions, presented at ICBMED.",
    fullDetails: "Engineered under the UPSA Developers Hub, this Hospital Management System (HMS) prototype digitizes patient intake, automates clinical triage, streamlines appointment scheduling, and manages ward bed allocation. The project was built following observational visits to local healthcare facilities to study real-world medical workflows and was presented at the International Conference on Business, Management, Economics and Development (ICBMED).",
    category: "Information Systems",
    technologies: ["React", "Node.js", "Express", "PostgreSQL", "Tailwind CSS", "Systems Design"],
    studentName: "UPSA Developers Hub HealthTech Cohort",
    studentRole: "Student Engineering Team",
    mentorName: "Dr. Augustina Dede Agor",
    hubAffiliation: "UPSA Developers Hub & ICBMED Conference",
    isVerifiedReal: true,
    isSample: false,
    imageUrl: "/images/hms_preview.jpg",
    articleUrl: "https://www.modernghana.com/news/upsa-developers-hub-presents-healthtech-projects-at-icbmed.html",
    articleSource: "ModernGhana / ICBMED",
    githubUrl: "https://github.com/upsaccra",
    demoUrl: "#",
    date: "2026",
    featured: true
  },
  {
    id: "sample-hub-showcase",
    title: "Sample Innovation Card: Submit Yours",
    subtitle: "Department Student Project Showcase Placeholder",
    description: "Have you built an innovative software application, AI model, or cybersecurity tool? The Developers Hub wants to feature your work on the official showcase.",
    fullDetails: "This is a demonstration showcase card. All student projects featured on this platform undergo review by department mentors. Submit your project repository link, documentation, and live demo URL through the Developers Hub submission portal.",
    category: "Information Systems",
    technologies: ["Developer Hub", "Open Source", "Student Portfolio"],
    studentName: "UPSA Developer Student",
    studentRole: "Hub Community Contributor",
    mentorName: "Department Review Panel",
    hubAffiliation: "UPSA Developers Hub",
    isVerifiedReal: false,
    isSample: true, // Marked visually with [Sample] badge per Constraint 1
    date: "Upcoming",
    featured: false
  }
];

export const FACULTY_DIRECTORY: FacultyMember[] = [
  {
    id: "dean-koi-akrofi",
    name: "Prof. Godfred Yaw Koi-Akrofi",
    title: "Dean, Faculty of Information Technology and Communication Studies (FITCS)",
    academicDegree: "PhD, Associate Professor",
    officeLocation: "FITCS Secretariat, Room 310/311, Justice Aryeetey Building",
    role: "Dean of Faculty",
    bio: "Distinguished academic leader driving excellence in IT management education, industry partnerships, and interdisciplinary research across FITCS.",
    specialization: ["IT Management", "Telecommunications Strategy", "Technology Leadership"],
    avatarUrl: "/images/prof_koi_akrofi.png"
  },
  {
    id: "dr-augustina-agor",
    name: "Dr. Augustina Dede Agor",
    title: "Senior Lecturer & Developers Hub Mentor",
    academicDegree: "PhD (Computer Science)",
    officeLocation: "Justice Aryeetey Building, Room 408",
    role: "Senior Lecturer / Hub Mentor",
    bio: "Senior Lecturer in Computer Science and key mentor behind the UPSA Developers Hub initiative, guiding student practical project cohorts and software engineering research.",
    specialization: ["Computer Science", "Software Engineering", "Algorithmic Design", "Student Mentorship"],
    avatarUrl: "/images/dr_augustina_agor.png"
  },
  {
    id: "dr-joshua-ofoeda",
    name: "Dr. Joshua Kwaku Ofoeda",
    title: "Head of Department, IT Studies",
    academicDegree: "PhD (Information Systems)",
    officeLocation: "Justice Aryeetey Building, Room 410",
    role: "Head of Department",
    bio: "Head of Department leading academic excellence, curriculum innovation, and strategic industry alignment across all IT Studies degree and diploma programmes.",
    specialization: ["Information Systems", "IT Governance", "Digital Health & Tech Strategy"],
    avatarUrl: "/images/dr_joshua_ofoeda.png",
    isHOD: true
  }
];

export const PROMO_SLIDES: PromoSlide[] = [
  {
    id: "congregation-2026",
    badgeText: "14TH CONGREGATION CEREMONY",
    title: "2026 Graduating Class — Undergraduate & Diploma",
    subtext: "Celebrating the achievements and practical excellence of our Department of Information Technology Studies graduates.",
    imageUrl: "/images/upsa_congregation_2026.png",
    ctaText: "Explore Academic Programmes",
    ctaLink: "academics"
  },
  {
    id: "admissions-2026",
    badgeText: "2026/2027 ACADEMIC ADMISSIONS",
    title: "Admissions Open for Undergraduate & Postgraduate IT Programmes",
    subtext: "Apply now for BSc IT Management, BSc Data Science & Analytics, MSc Information Security, and MBA MIS.",
    imageUrl: "/images/bloodvault_preview.jpg",
    ctaText: "Explore Programmes & Requirements",
    ctaLink: "academics"
  },
  {
    id: "dev-hub-cohort",
    badgeText: "DEVELOPERS HUB INITIATIVE",
    title: "UPSA Developers Hub Practical Systems Cohort",
    subtext: "Student-led, department-guided engineering operating from the UPSA Computer Laboratory.",
    imageUrl: "/images/hms_preview.jpg",
    ctaText: "Apply for 2026 Hub Cohort",
    ctaLink: "hub"
  },
  {
    id: "master-class-2026",
    badgeText: "FACULTY INDUSTRY TRADITION",
    title: "Annual FITCS Executive Master Class Series",
    subtext: "Bringing Chief Technology Officers, cybersecurity auditors, and data executives directly into campus lectures.",
    imageUrl: "/images/bloodvault_preview.jpg",
    ctaText: "View Community Details",
    ctaLink: "community"
  }
];

