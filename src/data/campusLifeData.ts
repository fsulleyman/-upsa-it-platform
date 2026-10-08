export interface Club {
  id: string;
  name: string;
  shortName: string;
  category: 'Software & Systems' | 'Cybersecurity' | 'Data & AI' | 'Academic & Professional';
  tagline: string;
  description: string;
  logoUrl?: string;
  bannerUrl?: string;
  isFlagship?: boolean;
  mentorName: string;
  mentorRole: string;
  studentLead: string;
  studentLeadRole: string;
  memberCount: string;
  establishedDate: string;
  meetingLocation: string;
  activities: string[];
  contactEmail: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  isPlaceholder?: boolean;
}

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  clubId: string;
  clubName: string;
  imageUrl?: string;
  badgeText: string;
  registrationInfo?: string;
  isConfirmed: boolean;
  isPlaceholder?: boolean;
}

export interface CampusActivity {
  id: string;
  title: string;
  description: string;
  category: string;
  clubName: string;
  schedule: string;
  highlights: string[];
  isPlaceholder?: boolean;
}

export interface CampusAchievement {
  id: string;
  title: string;
  description: string;
  date: string;
  issuer: string;
  category: string;
  articleUrl?: string;
  isConfirmed: boolean;
  isPlaceholder?: boolean;
}

export const CLUBS_DATA: Club[] = [
  {
    id: "dev-hub",
    name: "UPSA Developers Hub",
    shortName: "Dev Hub",
    category: "Software & Systems",
    tagline: "Bridging academic IT theory with practical enterprise systems engineering.",
    description: "The flagship student software development community anchored in the UPSA Computer Laboratory. Students collaborate on web-based platforms, mobile apps, enterprise systems, and operational software for campus and national impact under faculty mentorship.",
    isFlagship: true,
    mentorName: "Dr. Augustina Dede Agor",
    mentorRole: "Senior Lecturer & Faculty Advisor",
    studentLead: "Baffour Akoto Aninfeng",
    studentLeadRole: "Lead Developer (Student Cohort)",
    memberCount: "~400 Active Members",
    establishedDate: "17 December 2025",
    meetingLocation: "University Computer Laboratory, UPSA",
    activities: [
      "Weekly Hands-on Software Engineering Sprints",
      "Enterprise Network Infrastructure Inspections",
      "Hackathon & Prototype Incubations",
      "Peer Code Reviews & Architecture Audits"
    ],
    contactEmail: "infotech@upsamail.edu.gh",
    githubUrl: "https://github.com/upsaccra",
    linkedinUrl: "https://linkedin.com/school/upsaccra",
    isPlaceholder: false
  },
  {
    id: "cyber-sec-society",
    name: "UPSA Cybersecurity Student Society",
    shortName: "CyberSec Society",
    category: "Cybersecurity",
    tagline: "Promoting digital defense, ethical hacking, and threat intelligence.",
    description: "Student technical society focused on information security governance, zero-trust architecture, network defense protocols, and ethical hacking simulation challenges.",
    isFlagship: false,
    mentorName: "FITCS Cybersecurity Faculty",
    mentorRole: "Academic Advisors",
    studentLead: "Student CyberSec Executive Team",
    studentLeadRole: "Student Coordinators",
    memberCount: "~150 Student Cohort",
    establishedDate: "2026",
    meetingLocation: "Justice Aryeetey Building, UPSA",
    activities: [
      "Capture The Flag (CTF) Ethical Hacking Drills",
      "Network Packet Analysis & Vulnerability Scanning",
      "ISO 27001 Security Framework Case Studies"
    ],
    contactEmail: "infotech@upsamail.edu.gh",
    isPlaceholder: true // Clearly tagged placeholder for frontend demonstration
  },
  {
    id: "data-ai-association",
    name: "UPSA Data & AI Student Association",
    shortName: "Data & AI Club",
    category: "Data & AI",
    tagline: "Exploring machine learning models and data analytics for business decision systems.",
    description: "Student analytics community complementing the BSc Data Science and Analytics curriculum through Python data processing, SQL warehousing, and predictive modeling projects.",
    isFlagship: false,
    mentorName: "Data Science Faculty Team",
    mentorRole: "Academic Mentors",
    studentLead: "Student Analytics Guild",
    studentLeadRole: "Student Lead",
    memberCount: "~120 Members",
    establishedDate: "2026",
    meetingLocation: "FITCS Analytics Lab, UPSA",
    activities: [
      "DataCamp Python & SQL Skill Sprints",
      "Predictive Intelligence & Machine Learning Workshops",
      "Visualization & Business Intelligence Challenges"
    ],
    contactEmail: "infotech@upsamail.edu.gh",
    isPlaceholder: true // Clearly tagged placeholder for frontend demonstration
  }
];

export const CAMPUS_EVENTS_DATA: CampusEvent[] = [
  {
    id: "net-infra-visit-2026",
    title: "UPSA Live Network Infrastructure Guided Inspection",
    description: "Over 400 Developers Hub members engaged in a hands-on exploration of UPSA's enterprise network infrastructure, core routing switches, and server virtualization racks guided by the university's IT Services Department.",
    date: "24–27 March 2026",
    time: "9:00 AM – 3:00 PM GMT",
    location: "UPSA Data Center & Central Server Room",
    clubId: "dev-hub",
    clubName: "UPSA Developers Hub",
    imageUrl: "/images/hms_preview.jpg",
    badgeText: "FIELD EXPOSURE",
    registrationInfo: "Completed (~400 participants)",
    isConfirmed: true,
    isPlaceholder: false
  },
  {
    id: "isap-forum-2026",
    title: "ISAP Forum 2026: Public Sector Identification Systems",
    description: "Theme: Public Sector Identification Systems for Socioeconomic Development: Ghana's Experience and the Way Forward. Hosted by the Faculty of Information Technology and Communication Studies.",
    date: "Wednesday, 7th October 2026",
    time: "9:00 AM GMT",
    location: "PCU Auditorium (Second Floor), UPSA",
    clubId: "all",
    clubName: "FITCS Faculty & Student Body",
    imageUrl: "/images/isap_forum_2026.jpg",
    badgeText: "FACULTY FORUM",
    registrationInfo: "Open to All IT Studies & FITCS Students",
    isConfirmed: true,
    isPlaceholder: false
  },
  {
    id: "annual-masterclass-2026",
    title: "FITCS Annual Executive Master Class Series",
    description: "Landmark faculty tradition bringing top Chief Technology Officers (CTOs), cybersecurity auditors, and data executives directly into campus lectures for intensive industry mentorship.",
    date: "Annual Academic Event (2026)",
    time: "10:00 AM GMT",
    location: "UPSA Campus Auditorium",
    clubId: "all",
    clubName: "Faculty of IT & Communication Studies",
    imageUrl: "/images/bloodvault_preview.jpg",
    badgeText: "EXECUTIVE LECTURE",
    registrationInfo: "Departmental Student Registration",
    isConfirmed: true,
    isPlaceholder: false
  },
  {
    id: "cyber-ctf-drill-2026",
    title: "Student Cybersecurity & Threat Intelligence Drill [Sample]",
    description: "Hands-on capture-the-flag simulation testing student defense capabilities against synthetic threat vectors and simulated network intrusions.",
    date: "Sample Academic Calendar",
    time: "2:00 PM GMT",
    location: "UPSA Computer Laboratory",
    clubId: "cyber-sec-society",
    clubName: "UPSA Cybersecurity Student Society",
    imageUrl: "/images/hms_preview.jpg",
    badgeText: "PRACTICAL DRILL [SAMPLE]",
    registrationInfo: "Development Placeholder Data",
    isConfirmed: false,
    isPlaceholder: true
  }
];

export const CAMPUS_ACTIVITIES_DATA: CampusActivity[] = [
  {
    id: "act-dev-sprints",
    title: "Developers Hub Weekly Software Sprints",
    description: "Hands-on coding sessions where student developers work on real systems like BloodVault and hospital record management under faculty guidance.",
    category: "Software Development",
    clubName: "UPSA Developers Hub",
    schedule: "Weekly (UPSA Computer Laboratory)",
    highlights: ["Git Version Control", "Full-Stack Architecture", "Code Reviews"],
    isPlaceholder: false
  },
  {
    id: "act-datacamp",
    title: "DataCamp Classroom Hands-On Analytics Sprints",
    description: "Integration with DataCamp Classroom granting IT Studies students direct access to Python analytics, SQL warehousing, and R programming tracks.",
    category: "Data Science & Analytics",
    clubName: "UPSA Data & AI Student Association",
    schedule: "Ongoing Academic Semester",
    highlights: ["Python for Data Science", "SQL Warehousing", "R Statistical Computing"],
    isPlaceholder: false
  },
  {
    id: "act-ctf-simulations",
    title: "Network Security & Ethical Hacking Simulations [Sample]",
    description: "Practical exercises analyzing network packet dumps, configuring firewalls, and identifying web application vulnerabilities.",
    category: "Cybersecurity",
    clubName: "UPSA Cybersecurity Student Society",
    schedule: "Bi-Weekly Sprints [Sample]",
    highlights: ["Packet Analysis", "Firewall Rules", "OWASP Top 10 Audits"],
    isPlaceholder: true
  }
];

export const CAMPUS_ACHIEVEMENTS_DATA: CampusAchievement[] = [
  {
    id: "ach-icbmed-2026",
    title: "ICBMED International Conference Presentation",
    description: "Hospital Management System (HMS) prototype engineered by UPSA Developers Hub HealthTech cohort presented at the International Conference on Business, Management, Economics and Development.",
    date: "2026",
    issuer: "ICBMED Conference Committee",
    category: "Research & International Presentation",
    articleUrl: "https://www.graphic.com.gh/news/education/upsa-developers-hub-students-build-innovative-tech-solutions.html",
    isConfirmed: true,
    isPlaceholder: false
  },
  {
    id: "ach-bloodvault-press",
    title: "BloodVault National Press & Media Feature",
    description: "Web-based blood bank management platform designed by Baffour Akoto Aninfeng under the Developers Hub featured by Graphic Online and national university media.",
    date: "March 2026",
    issuer: "Graphic Online / UPSA Press",
    category: "Student System Deployment",
    articleUrl: "https://www.graphic.com.gh/news/education/upsa-developers-hub-students-build-innovative-tech-solutions.html",
    isConfirmed: true,
    isPlaceholder: false
  },
  {
    id: "ach-net-infra-cohort",
    title: "400+ Students Enterprise Infrastructure Certification",
    description: "Over 400 Developers Hub student members successfully completed guided inspection and live traffic monitoring of UPSA Data Center core switches.",
    date: "March 2026",
    issuer: "UPSA IT Services Department & FITCS",
    category: "Practical Industry Exposure",
    isConfirmed: true,
    isPlaceholder: false
  }
];
