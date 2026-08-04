export type NavSectionId = 'home' | 'about' | 'academics' | 'hub' | 'innovation' | 'community' | 'contact';

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
  bio: string;
  specialization: string[];
  isHOD?: boolean;
  isUnconfirmedHOD?: boolean;
  avatarUrl?: string;
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
