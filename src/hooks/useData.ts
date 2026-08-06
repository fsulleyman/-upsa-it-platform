import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  PROGRAMMES as fallbackProgrammes,
  PROJECTS as fallbackProjects,
  FACULTY_DIRECTORY as fallbackFaculty,
  PROMO_SLIDES as fallbackPromoSlides,
  INSTITUTION_INFO as fallbackInstitutionInfo,
  HUB_DETAILS as fallbackHubDetails
} from '../data/groundTruth';
import type { AcademicProgramme, StudentProject, FacultyMember, PromoSlide } from '../types';

export function useData() {
  const [programmes, setProgrammes] = useState<AcademicProgramme[]>(fallbackProgrammes);
  const [projects, setProjects] = useState<StudentProject[]>(fallbackProjects);
  const [faculty, setFaculty] = useState<FacultyMember[]>(fallbackFaculty);
  const [promoSlides, setPromoSlides] = useState<PromoSlide[]>(fallbackPromoSlides);
  const [institutionInfo] = useState(fallbackInstitutionInfo);
  const [hubDetails] = useState(fallbackHubDetails);
  const [loading, setLoading] = useState<boolean>(isSupabaseConfigured);

  const fetchAllData = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    try {
      // Fetch Programmes
      const { data: progData } = await supabase.from('programmes').select('*');
      if (progData && progData.length > 0) {
        setProgrammes(
          progData.map((p) => ({
            id: p.id,
            code: p.code,
            name: p.name,
            level: p.level,
            duration: p.duration,
            tagline: p.tagline,
            description: p.description,
            skillsDeveloped: p.skills_developed || [],
            careerOutcomes: p.career_outcomes || [],
            coreModules: p.core_modules || [],
            entryRequirements: p.entry_requirements || [],
            isNew: p.is_new,
            imageUrl: p.image_url
          }))
        );
      }

      // Fetch Projects
      const { data: projData } = await supabase.from('projects').select('*');
      if (projData && projData.length > 0) {
        setProjects(
          projData.map((p) => ({
            id: p.id,
            title: p.title,
            subtitle: p.subtitle,
            description: p.description,
            fullDetails: p.full_details,
            category: p.category,
            technologies: p.technologies || [],
            studentName: p.student_name,
            studentRole: p.student_role,
            mentorName: p.mentor_name,
            hubAffiliation: p.hub_affiliation,
            isVerifiedReal: p.is_verified_real,
            isSample: p.is_sample,
            imageUrl: p.image_url,
            articleUrl: p.article_url,
            articleSource: p.article_source,
            githubUrl: p.github_url,
            demoUrl: p.demo_url,
            date: p.date,
            featured: p.featured
          }))
        );
      }

      // Fetch Faculty
      const { data: facData } = await supabase.from('faculty').select('*');
      if (facData && facData.length > 0) {
        setFaculty(
          facData.map((f) => ({
            id: f.id,
            name: f.name,
            title: f.title,
            academicDegree: f.academic_degree,
            officeLocation: f.office_location,
            role: f.role,
            bio: f.bio,
            specialization: f.specialization || [],
            avatarUrl: f.avatar_url,
            isHOD: f.is_hod,
            isUnconfirmedHOD: f.is_unconfirmed_hod
          }))
        );
      }

      // Fetch Promo Slides
      const { data: slideData } = await supabase.from('promo_slides').select('*');
      if (slideData && slideData.length > 0) {
        setPromoSlides(
          slideData.map((s) => ({
            id: s.id,
            badgeText: s.badge_text,
            title: s.title,
            subtext: s.subtext,
            imageUrl: s.image_url,
            ctaText: s.cta_text,
            ctaLink: s.cta_link
          }))
        );
      }

    } catch (err) {
      console.warn('Supabase fetch notice: using static ground truth data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return {
    programmes,
    projects,
    faculty,
    promoSlides,
    institutionInfo,
    hubDetails,
    loading,
    refreshData: fetchAllData
  };
}
