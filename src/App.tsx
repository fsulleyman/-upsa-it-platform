import { useEffect } from 'react';
import { useHashLocation } from './utils/hashRouter';
import { AuthProvider } from './context/AuthContext';
import { useData } from './hooks/useData';
import type { NavSectionId, AcademicProgramme, StudentProject } from './types';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

import { JoinHubModal } from './components/modals/JoinHubModal';
import { ProjectDetailModal } from './components/modals/ProjectDetailModal';
import { ProgrammeDetailModal } from './components/modals/ProgrammeDetailModal';
import { AdminDashboard } from './components/admin/AdminDashboard';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { AcademicsPage } from './pages/AcademicsPage';
import { ProgrammesPage } from './pages/ProgrammesPage';
import { CoursesPage } from './pages/CoursesPage';
import { ITDepartmentPage } from './pages/ITDepartmentPage';
import { FacultyPage } from './pages/FacultyPage';
import { LecturerProfilePage } from './pages/LecturerProfilePage';
import { ResearchPage } from './pages/ResearchPage';
import { DevelopersHubPage } from './pages/DevelopersHubPage';
import { InnovationPage } from './pages/InnovationPage';
import { CommunityPage } from './pages/CommunityPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

import { SpeedInsights } from '@vercel/speed-insights/react';

function AppContent() {
  const [hashState, updateHash] = useHashLocation();
  const {
    programmes,
    projects,
    faculty,
    courses,
    researchProjects,
    facultyPublications,
    promoSlides,
    hubDetails,
    heroContent,
    navItems,
    footerContent,
    footerLinks,
    socialLinks,
    institutionInfo
  } = useData();

  // Route to Admin Control Center if hash is #admin
  const isAdminRoute = hashState.section === 'admin';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    let pageTitle = 'UPSA IT Studies | Department of Information Technology';

    if (hashState.facultyId) {
      const selectedLecturer = faculty.find(f => f.id === hashState.facultyId || f.slug === hashState.facultyId);
      if (selectedLecturer) {
        pageTitle = `${selectedLecturer.name} (${selectedLecturer.title}) | UPSA IT Faculty`;
      } else {
        pageTitle = 'Faculty Member Profile | UPSA IT Studies';
      }
    } else {
      switch (hashState.section) {
        case 'about':
          pageTitle = 'About Department | UPSA IT Studies';
          break;
        case 'academics':
          pageTitle = 'Academics & Curricula | UPSA IT Studies';
          break;
        case 'academics/programmes':
          pageTitle = 'Degree & Certificate Programmes | UPSA IT Studies';
          break;
        case 'academics/courses':
          pageTitle = 'Course Directory & Syllabi | UPSA IT Studies';
          break;
        case 'it-department':
          pageTitle = 'IT Department Overview | UPSA IT Studies';
          break;
        case 'it-department/faculty':
          pageTitle = 'Faculty & Staff Directory | UPSA IT Studies';
          break;
        case 'research':
          pageTitle = 'Research & Publications Repository | UPSA IT Studies';
          break;
        case 'developers-hub':
          pageTitle = 'UPSA IT Developers Hub | Student Ecosystem';
          break;
        case 'innovation':
          pageTitle = 'Student Innovation & Project Showcase | UPSA IT Studies';
          break;
        case 'community':
          pageTitle = 'Tech Community & Student Clubs | UPSA IT Studies';
          break;
        case 'contact':
          pageTitle = 'Contact Department of IT | UPSA';
          break;
        case 'admin':
          pageTitle = 'Admin Portal | UPSA IT Studies CMS';
          break;
        default:
          pageTitle = 'UPSA IT Studies | Department of Information Technology';
      }
    }

    document.title = pageTitle;
  }, [hashState.section, hashState.facultyId, faculty]);

  const handleNavigateSection = (section: NavSectionId) => {
    updateHash({ section, modal: null, programmeId: null, projectId: null, facultyId: null, courseId: null });
  };

  const handleSelectProgramme = (prog: AcademicProgramme) => {
    updateHash({ section: 'academics/programmes', programmeId: prog.id, modal: 'programme' });
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

  const renderMainContent = () => {
    if (hashState.facultyId || hashState.routePath.startsWith('/faculty/')) {
      return (
        <LecturerProfilePage
          facultyId={hashState.facultyId}
          faculty={faculty}
          courses={courses}
          publications={facultyPublications}
          onNavigate={(sec) => updateHash({ section: sec, modal: null })}
        />
      );
    }

    switch (hashState.section) {
      case 'home':
        return (
          <HomePage
            promoSlides={promoSlides}
            heroContent={heroContent}
            programmes={programmes}
            faculty={faculty}
            projects={projects}
            hubDetails={hubDetails}
            institutionInfo={institutionInfo}
            footerContent={footerContent}
            onNavigateSection={handleNavigateSection}
            onSelectProgramme={handleSelectProgramme}
            onSelectProject={handleSelectProject}
            onOpenJoinModal={() => updateHash({ section: 'developers-hub', modal: 'join-hub' })}
          />
        );
      case 'about':
        return (
          <AboutPage
            faculty={faculty}
            institutionInfo={institutionInfo}
            onNavigate={(sec) => updateHash({ section: sec, modal: null })}
          />
        );
      case 'academics':
        return (
          <AcademicsPage
            programmes={programmes}
            courses={courses}
            onSelectProgramme={handleSelectProgramme}
            onNavigate={(sec) => updateHash({ section: sec, modal: null })}
          />
        );
      case 'academics/programmes':
        return (
          <ProgrammesPage
            programmes={programmes}
            onSelectProgramme={handleSelectProgramme}
          />
        );
      case 'academics/courses':
        return (
          <CoursesPage
            courses={courses}
            programmes={programmes}
            faculty={faculty}
            onNavigate={(sec) => updateHash({ section: sec, modal: null })}
          />
        );
      case 'it-department':
        return (
          <ITDepartmentPage
            faculty={faculty}
            courses={courses}
            onNavigate={(sec) => updateHash({ section: sec, modal: null })}
          />
        );
      case 'it-department/faculty':
        return (
          <FacultyPage
            faculty={faculty}
            onSelectFaculty={(fId) => updateHash({ section: 'it-department/faculty', facultyId: fId })}
          />
        );
      case 'research':
        return (
          <ResearchPage
            researchProjects={researchProjects}
            publications={facultyPublications}
            faculty={faculty}
            onNavigate={(sec) => updateHash({ section: sec, modal: null })}
          />
        );
      case 'developers-hub':
        return (
          <DevelopersHubPage
            hubDetails={hubDetails}
            onOpenJoinModal={() => updateHash({ section: 'developers-hub', modal: 'join-hub' })}
          />
        );
      case 'innovation':
        return (
          <InnovationPage
            projects={projects}
            onSelectProject={handleSelectProject}
            activeCategoryFilter={hashState.categoryFilter}
            onFilterCategory={handleFilterCategory}
          />
        );
      case 'community':
        return (
          <CommunityPage
            onNavigate={(sec) => updateHash({ section: sec, modal: null })}
          />
        );
      case 'contact':
        return (
          <ContactPage
            institutionInfo={institutionInfo}
            footerContent={footerContent}
          />
        );
      case 'not-found':
        return (
          <NotFoundPage
            onNavigateHome={() => updateHash({ section: 'home', modal: null })}
          />
        );
      default:
        return (
          <HomePage
            promoSlides={promoSlides}
            heroContent={heroContent}
            programmes={programmes}
            faculty={faculty}
            projects={projects}
            hubDetails={hubDetails}
            institutionInfo={institutionInfo}
            footerContent={footerContent}
            onNavigateSection={handleNavigateSection}
            onSelectProgramme={handleSelectProgramme}
            onSelectProject={handleSelectProject}
            onOpenJoinModal={() => updateHash({ section: 'developers-hub', modal: 'join-hub' })}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans selection:bg-[#F2B705] selection:text-[#003366]">
      <SpeedInsights />
      
      {/* Header Navigation */}
      <Navbar
        activeSection={hashState.section}
        onNavigate={handleNavigateSection}
        navItems={navItems}
      />

      {/* Main Multi-Page Dynamic Content (pt-28 sits flush right below 112px fixed navbar) */}
      <main className="relative pt-28">
        {renderMainContent()}
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
