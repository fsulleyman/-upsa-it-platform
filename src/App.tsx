import { useEffect } from 'react';
import { useHashLocation } from './utils/hashRouter';
import { PROGRAMMES, PROJECTS, PROMO_SLIDES } from './data/groundTruth';
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

import { JoinHubModal } from './components/modals/JoinHubModal';
import { ProjectDetailModal } from './components/modals/ProjectDetailModal';
import { ProgrammeDetailModal } from './components/modals/ProgrammeDetailModal';

export function App() {
  const [hashState, updateHash] = useHashLocation();

  // Sync scrolling when section changes in URL hash
  useEffect(() => {
    if (hashState.section) {
      const element = document.getElementById(hashState.section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else if (hashState.section === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [hashState.section]);

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
    ? PROGRAMMES.find((p) => p.id === hashState.programmeId) || null
    : null;

  const selectedProject = hashState.projectId
    ? PROJECTS.find((p) => p.id === hashState.projectId) || null
    : null;

  const isJoinModalOpen = hashState.modal === 'join-hub';

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans selection:bg-[#F2B705] selection:text-[#003366]">
      
      {/* Header Navigation (Permanently Dark Navbar) */}
      <Navbar
        activeSection={hashState.section}
        onNavigate={handleNavigateSection}
      />

      {/* Main Content Sections (pt-28 sm:pt-32 ensures content starts below fixed navbar) */}
      <main className="relative pt-28 sm:pt-32">
        <div id="home">
          <PromoSlider slides={PROMO_SLIDES} onNavigate={handleNavigateSection} />
          <HeroSection onNavigate={handleNavigateSection} />
        </div>

        <AboutSection />

        <AcademicsSection onSelectProgramme={handleSelectProgramme} />

        <DevelopersHubSection
          onOpenJoinModal={() => updateHash({ section: 'hub', modal: 'join-hub' })}
        />

        <InnovationShowcase
          onSelectProject={handleSelectProject}
          activeCategoryFilter={hashState.categoryFilter}
          onFilterCategory={handleFilterCategory}
        />

        <CommunitySection />

        <ContactSection />
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigateSection} />

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

    </div>
  );
}

export default App;
