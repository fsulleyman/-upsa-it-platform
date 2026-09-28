export type NavSectionId = 'home' | 'about' | 'academics' | 'faculty' | 'hub' | 'innovation' | 'community' | 'contact' | 'admin';

export type DegreeLevel = 'Undergraduate' | 'Postgraduate' | 'Diploma';

export interface AcademicProgramme {
  id: string;
  code: string;
  name: string;
  level: DegreeLevel;
  duration: string;
  description: string;
  tagline: string;
  skillsDeveloped: string[];
  careerOutcomes: string[];
  coreModules: string[];
  entryRequirements: string[];
  isNew?: boolean;
  imageUrl?: string;
}

export interface PromoSlide {
  id: string;
  badgeText?: string;
  title: string;
  subtext?: string;
  imageUrl: string;
  ctaText?: string;
  ctaLink?: NavSectionId | string;
}

export interface StudentProject {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  fullDetails: string;
  category: 'Web Development' | 'Mobile Applications' | 'Artificial Intelligence' | 'Data Analytics' | 'Cybersecurity' | 'Information Systems';
  technologies: string[];
  studentName: string;
  studentRole: string;
  mentorName: string;
  hubAffiliation: string;
  isVerifiedReal: boolean; // True only for BloodVault & HMS
  isSample?: boolean;      // True for non-fabricated sample cards with visible badge
  imageUrl?: string;
  articleUrl?: string;
  articleSource?: string;
  githubUrl?: string;
  demoUrl?: string;
  date: string;
  featured?: boolean;
}

export interface ResearchArea {
  id: string;
  title: string;
  description: string;
  iconName: string;
  keyTopics: string[];
}

export interface FacultyMember {
  id: string;
  name: string;
  title: string;
  academicDegree: string;
  officeLocation?: string;
  role: string;
  position?: string;
  bio: string;
  biography?: string;
  specialization: string[];
  isHOD?: boolean;
  isUnconfirmedHOD?: boolean;
  avatarUrl?: string;
  email?: string;
  phone?: string;
  office?: string;
  officeNumber?: string;
  officeHours?: string;
  qualifications?: string[];
  teachingAreas?: string[];
  researchInterests?: string[];
  researchTopics?: string[];
  googleScholarUrl?: string;
  orcidUrl?: string;
  linkedinUrl?: string;
  coursesTaught?: string[];
  displayOrder?: number;
  isActive?: boolean;
}

export interface HubMilestone {
  id: string;
  date: string;
  title: string;
  location: string;
  participantsCount: string;
  description: string;
  collaborators: string[];
  keyHighlights: string[];
}

export interface ConfirmedFact {
  id: string;
  label: string;
  value: string;
  isConfirmed: boolean;
  note?: string;
}

export interface SiteSettings {
  id: string;
  siteTitle: string;
  metaDescription: string;
  organizationName: string;
  canonicalUrl: string;
  shareImageUrl?: string;
}

export interface HeroContent {
  id: string;
  topLine: string;
  headline: string;
  subtext: string;
  primaryCtaText: string;
  primaryCtaLink: NavSectionId | string;
  secondaryCtaText: string;
  secondaryCtaLink: NavSectionId | string;
  imageUrl?: string;
}

export interface NavItem {
  id: string;
  sectionId: NavSectionId;
  label: string;
  displayOrder: number;
  isActive: boolean;
}

export interface FooterContent {
  id: string;
  logoText: string;
  mottoText: string;
  description: string;
  digitalAddress: string;
  address: string;
  phoneAdmissions: string;
  phoneSwitchboard: string;
  email: string;
  copyrightText: string;
  portalUrl: string;
}

export interface FooterLink {
  id: string;
  columnTitle: string;
  label: string;
  url: string;
  isExternal: boolean;
  displayOrder: number;
  isActive: boolean;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  iconName?: string;
  displayOrder: number;
  isActive: boolean;
}
