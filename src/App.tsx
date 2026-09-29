import { useEffect } from 'react';
import { useHashLocation } from './utils/hashRouter';
import { AuthProvider } from './context/AuthContext';
import { useData } from './hooks/useData';
import type { NavSectionId, AcademicProgramme, StudentProject } from './types';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

import { PromoSlider } from './components/common/PromoSlider';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { AcademicsSection } from './components/sections/AcademicsSection';
import { DevelopersHubSection } from './components/sections/DevelopersHubSection';
import { InnovationShowcase } from './components/sections/InnovationShowcase';
import { CommunitySection } from './components/sections/CommunitySection';
import { ContactSection } from './components/sections/ContactSection';
import { FacultyPage } from './pages/FacultyPage';
import { LearningHubPage } from './pages/LearningHubPage';

import { JoinHubModal } from './components/modals/JoinHubModal';
import { ProjectDetailModal } from './components/modals/ProjectDetailModal';
import { ProgrammeDetailModal } from './components/modals/ProgrammeDetailModal';
import { EventAnnouncementModal } from './components/modals/EventAnnouncementModal';
import { AdminDashboard } from './components/admin/AdminDashboard';

import { SpeedInsights } from '@vercel/speed-insights/react';

import { trackAnalyticsEvent } from './lib/analyticsTracker';

function AppContent() {
  const [hashState, updateHash] = useHashLocation();
  const {
    programmes,
    projects,
    faculty,
    promoSlides,
    hubDetails,
    heroContent,
    navItems,
    footerContent,
    footerLinks,
    socialLinks,
    institutionInfo,
    eventAnnouncement
  } = useData();

  // Route flags
  const isAdminRoute = hashState.section === 'admin';
  const isFacultyRoute = hashState.section === 'faculty';
  const isLearningHubRoute = hashState.section === 'learning-hub';

  useEffect(() => {
    // Track non-sensitive page view event
    const path = window.location.hash || '#/';
    trackAnalyticsEvent('PAGE_VIEW', path);

    if (isFacultyRoute) {
      document.title = 'Faculty & Staff | UPSA IT Studies';
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else if (isLearningHubRoute) {
      document.title = 'IT Learning Hub & Repository | UPSA IT Studies';
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else if (hashState.section && !isAdminRoute) {
      document.title = 'UPSA IT Studies | Department of Information Technology';
      const element = document.getElementById(hashState.section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else if (hashState.section === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [hashState.section, isAdminRoute, isFacultyRoute, isLearningHubRoute]);

  const handleNavigateSection = (section: NavSectionId) => {
    updateHash({ section, modal: null, programmeId: null, projectId: null });
  };

  const handleSelectProgramme = (prog: AcademicProgramme) => {
    updateHash({ section: 'academics', programmeId: prog.id, modal: 'programme' });
  };

  const handleSelectProject = (project: StudentProject) => {
    updateHash({ section: 'innovation', projectId: project.id, modal: 'project' });
  };

  const handleFilterCategory = (category: string) => {
    updateHash({ section: 'innovation', categoryFilter: category });
  };

  const selectedProgramme = hashState.programmeId
    ? programmes.find((p) => p.id === hashState.programmeId) || null
    : null;

  const selectedProject = hashState.projectId
    ? projects.find((p) => p.id === hashState.projectId) || null
    : null;

  const isJoinModalOpen = hashState.modal === 'join-hub';

  if (isAdminRoute) {
    return (
      <>
        <SpeedInsights />
        <AdminDashboard onNavigateHome={() => updateHash({ section: 'home', modal: null })} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans selection:bg-[#F2B705] selection:text-[#003366]">
      <SpeedInsights />
      
      {/* Header Navigation */}
      <Navbar
        activeSection={hashState.section}
        onNavigate={handleNavigateSection}
        navItems={navItems}
      />

      {/* Main Content (pt-28 sits flush right below 112px fixed navbar) */}
      <main className="relative pt-28">
        {isFacultyRoute ? (
          <FacultyPage faculty={faculty} onNavigate={handleNavigateSection} />
        ) : isLearningHubRoute ? (
          <LearningHubPage onNavigate={handleNavigateSection} />
        ) : (
          <>
            <div id="home">
              <PromoSlider slides={promoSlides} onNavigate={handleNavigateSection} />
              <HeroSection onNavigate={handleNavigateSection} heroContent={heroContent} />
            </div>

            <AboutSection faculty={faculty} />

            <AcademicsSection programmes={programmes} onSelectProgramme={handleSelectProgramme} />

            <DevelopersHubSection
              hubDetails={hubDetails}
              onOpenJoinModal={() => updateHash({ section: 'hub', modal: 'join-hub' })}
            />

            <InnovationShowcase
              projects={projects}
              onSelectProject={handleSelectProject}
              activeCategoryFilter={hashState.categoryFilter}
              onFilterCategory={handleFilterCategory}
            />

            <CommunitySection />

            <ContactSection institutionInfo={institutionInfo} footerContent={footerContent} />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigateSection}
        footerContent={footerContent}
        footerLinks={footerLinks}
        socialLinks={socialLinks}
      />

      {/* Interactive Detail Modals */}
      <ProgrammeDetailModal
        programme={selectedProgramme}
        onClose={() => updateHash({ programmeId: null, modal: null })}
      />

      <ProjectDetailModal
        project={selectedProject}
        onClose={() => updateHash({ projectId: null, modal: null })}
      />

      <JoinHubModal
        isOpen={isJoinModalOpen}
        onClose={() => updateHash({ modal: null })}
      />

      <EventAnnouncementModal
        event={eventAnnouncement}
        activeSection={hashState.section}
      />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
