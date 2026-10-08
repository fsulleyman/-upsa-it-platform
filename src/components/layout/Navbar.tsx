import React, { useState } from 'react';
import type { NavSectionId, NavItem } from '../../types';
import { Search, Menu, X, GraduationCap, ChevronDown } from 'lucide-react';

interface NavbarProps {
  activeSection: NavSectionId;
  onNavigate: (section: NavSectionId) => void;
  navItems?: NavItem[];
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  navItems: dynamicNavItems
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const defaultNavItems: { id: NavSectionId; label: string }[] = [
    { id: 'home', label: 'HOME' },
    { id: 'about', label: 'ABOUT' },
    { id: 'academics', label: 'ACADEMICS' },
    { id: 'faculty', label: 'FACULTY' },
    { id: 'learning-hub', label: 'LEARNING HUB' },
    { id: 'campus-life', label: 'CAMPUS LIFE' },
    { id: 'innovation', label: 'INNOVATION' },
    { id: 'community', label: 'COMMUNITY' },
    { id: 'contact', label: 'CONTACT' }
  ];

  const rawNavItems = dynamicNavItems && dynamicNavItems.length > 0
    ? dynamicNavItems
        .filter((n) => n.isActive)
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((n) => ({
          id: n.sectionId === 'hub' ? ('campus-life' as NavSectionId) : n.sectionId,
          label: n.sectionId === 'hub' ? 'CAMPUS LIFE' : n.label
        }))
    : defaultNavItems;

  // Deduplicate items by section ID
  const seenSections = new Set<NavSectionId>();
  let displayNavItems: { id: NavSectionId; label: string }[] = [];
  for (const item of rawNavItems) {
    if (!seenSections.has(item.id)) {
      seenSections.add(item.id);
      displayNavItems.push(item);
    }
  }

  // Guarantee FACULTY is present in displayNavItems right after ACADEMICS if omitted from CMS nav items
  if (!seenSections.has('faculty')) {
    const academicsIndex = displayNavItems.findIndex((item) => item.id === 'academics');
    const facultyItem = { id: 'faculty' as NavSectionId, label: 'FACULTY' };
    if (academicsIndex !== -1) {
      displayNavItems.splice(academicsIndex + 1, 0, facultyItem);
    } else {
      displayNavItems.push(facultyItem);
    }
    seenSections.add('faculty');
  }

  // Guarantee LEARNING HUB is present in displayNavItems right after FACULTY if omitted from CMS nav items
  if (!seenSections.has('learning-hub')) {
    const facultyIndex = displayNavItems.findIndex((item) => item.id === 'faculty');
    const hubItem = { id: 'learning-hub' as NavSectionId, label: 'LEARNING HUB' };
    if (facultyIndex !== -1) {
      displayNavItems.splice(facultyIndex + 1, 0, hubItem);
    } else {
      displayNavItems.push(hubItem);
    }
    seenSections.add('learning-hub');
  }

  // Guarantee CAMPUS LIFE is present in displayNavItems right after LEARNING HUB if omitted from CMS nav items
  if (!seenSections.has('campus-life')) {
    const learningHubIndex = displayNavItems.findIndex((item) => item.id === 'learning-hub');
    const campusLifeItem = { id: 'campus-life' as NavSectionId, label: 'CAMPUS LIFE' };
    if (learningHubIndex !== -1) {
      displayNavItems.splice(learningHubIndex + 1, 0, campusLifeItem);
    } else {
      displayNavItems.push(campusLifeItem);
    }
    seenSections.add('campus-life');
  }

  // Guarantee INNOVATION is present in displayNavItems if omitted from CMS nav items
  if (!seenSections.has('innovation')) {
    const campusLifeIndex = displayNavItems.findIndex((item) => item.id === 'campus-life');
    const innovationItem = { id: 'innovation' as NavSectionId, label: 'INNOVATION' };
    if (campusLifeIndex !== -1) {
      displayNavItems.splice(campusLifeIndex + 1, 0, innovationItem);
    } else {
      displayNavItems.push(innovationItem);
    }
    seenSections.add('innovation');
  }

  // Guarantee CONTACT is present in displayNavItems if omitted from CMS nav items
  if (!seenSections.has('contact')) {
    const communityIndex = displayNavItems.findIndex((item) => item.id === 'community');
    const contactItem = { id: 'contact' as NavSectionId, label: 'CONTACT' };
    if (communityIndex !== -1) {
      displayNavItems.splice(communityIndex + 1, 0, contactItem);
    } else {
      displayNavItems.push(contactItem);
    }
    seenSections.add('contact');
  }

  const handleNavClick = (id: NavSectionId) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    setSearchOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('academics');
      setSearchOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full shadow-md bg-slate-900">
      
      {/* Top Utility Bar - Always Dark UPSA Navy */}
      <div className="w-full bg-[#003366] text-white text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-[#002244]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <span className="text-[#F2B705] font-extrabold">FITCS • UPSA ACCRA</span>
            <span className="hidden md:inline text-slate-300">|</span>
            <span className="hidden md:inline text-slate-100">Department of Information Technology Studies</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold tracking-wider">
            <a href="#academics" onClick={() => onNavigate('academics')} className="hover:text-[#F2B705] transition-colors hidden sm:inline">
              PROGRAMMES
            </a>
            <a href="#campus-life" onClick={() => onNavigate('campus-life')} className="hover:text-[#F2B705] transition-colors flex items-center gap-1">
              <span>CAMPUS LIFE</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar - Permanently Dark Slate/Navy */}
      <div className="w-full bg-slate-900 border-b border-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-3">
            
            {/* Official UPSA Identity Crest (Left - shrink-0) */}
            <div 
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 cursor-pointer group shrink-0"
            >
              <div className="w-10 h-10 rounded-lg bg-[#003366] border-2 border-[#F2B705] flex items-center justify-center text-[#F2B705] shadow-sm">
                <GraduationCap className="w-5 h-5" />
              </div>

              <div>
                <span className="text-sm sm:text-base font-bold tracking-tight text-white uppercase block">
                  UPSA <span className="text-xs font-bold text-[#00AEEF] font-sans tracking-normal uppercase">• IT STUDIES</span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-extrabold tracking-widest text-[#F2B705] uppercase block">
                  Scholarship with Professionalism
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {displayNavItems.map((item) => {
                const isActive = activeSection === item.id;
                
                if (item.id === 'campus-life') {
                  return (
                    <div key={item.id} className="relative group">
                      <button
                        onClick={() => handleNavClick(item.id)}
                        className={`px-3 py-2 text-xs font-extrabold tracking-wider transition-all inline-flex items-center gap-1 relative ${
                          isActive
                            ? 'text-[#F2B705]'
                            : 'text-slate-200 hover:text-white hover:bg-slate-800 rounded-md'
                        }`}
                      >
                        <span>CAMPUS LIFE</span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform group-hover:rotate-180" />
                        {isActive && (
                          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F2B705] rounded-full" />
                        )}
                      </button>

                      {/* Dropdown Menu */}
                      <div className="absolute left-0 top-full pt-1 hidden group-hover:block w-52 z-50">
                        <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden p-1.5">
                          <a
                            href="#/campus-life?tab=clubs"
                            onClick={(e) => { e.preventDefault(); window.location.hash = '#/campus-life?tab=clubs'; setSearchOpen(false); }}
                            className="block px-3 py-2 text-xs font-bold text-slate-200 hover:text-[#F2B705] hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            Clubs & Societies
                          </a>
                          <a
                            href="#/community"
                            onClick={(e) => { e.preventDefault(); handleNavClick('community'); }}
                            className="block px-3 py-2 text-xs font-bold text-slate-200 hover:text-[#F2B705] hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            Communities
                          </a>
                          <a
                            href="#/campus-life?tab=events"
                            onClick={(e) => { e.preventDefault(); window.location.hash = '#/campus-life?tab=events'; setSearchOpen(false); }}
                            className="block px-3 py-2 text-xs font-bold text-slate-200 hover:text-[#F2B705] hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            Events
                          </a>
                          <a
                            href="#/campus-life?tab=activities"
                            onClick={(e) => { e.preventDefault(); window.location.hash = '#/campus-life?tab=activities'; setSearchOpen(false); }}
                            className="block px-3 py-2 text-xs font-bold text-slate-200 hover:text-[#F2B705] hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            Activities
                          </a>
                          <a
                            href="#/innovation"
                            onClick={(e) => { e.preventDefault(); handleNavClick('innovation'); }}
                            className="block px-3 py-2 text-xs font-bold text-slate-200 hover:text-[#F2B705] hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            Student Projects
                          </a>
                          <a
                            href="#/campus-life?tab=achievements"
                            onClick={(e) => { e.preventDefault(); window.location.hash = '#/campus-life?tab=achievements'; setSearchOpen(false); }}
                            className="block px-3 py-2 text-xs font-bold text-slate-200 hover:text-[#F2B705] hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            Achievements
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`px-3 py-2 text-xs font-extrabold tracking-wider transition-all relative ${
                      isActive
                        ? 'text-[#F2B705]'
                        : 'text-slate-200 hover:text-white hover:bg-slate-800 rounded-md'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F2B705] rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Action Trigger Group */}
            <div className="flex items-center gap-3 shrink-0">
              
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 transition-colors"
                title="Search platform"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Expanded Search Drawer Overlay */}
      {searchOpen && (
        <div className="w-full bg-slate-800 border-b border-slate-700 p-4 animate-in slide-in-from-top duration-200">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Search programmes, projects, faculty, or entry requirements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-[#F2B705] text-sm"
                autoFocus
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#003366] hover:bg-blue-900 text-white font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          {displayNavItems.map((item) => {
            const isActive = activeSection === item.id;

            if (item.id === 'campus-life') {
              return (
                <div key={item.id} className="space-y-1">
                  <button
                    onClick={() => handleNavClick('campus-life')}
                    className={`w-full text-left px-4 py-3 rounded-lg text-xs font-extrabold tracking-wider transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-[#003366] text-[#F2B705] font-black border-l-4 border-[#F2B705]'
                        : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span>CAMPUS LIFE</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>
                  <div className="pl-4 space-y-1 border-l border-slate-800 ml-4 py-1">
                    <a
                      href="#/campus-life?tab=clubs"
                      onClick={(e) => { e.preventDefault(); window.location.hash = '#/campus-life?tab=clubs'; setMobileMenuOpen(false); }}
                      className="block px-3 py-2 text-[11px] font-bold text-slate-300 hover:text-[#F2B705] hover:bg-slate-800/60 rounded-md transition-colors"
                    >
                      • Clubs & Societies
                    </a>
                    <a
                      href="#/community"
                      onClick={(e) => { e.preventDefault(); handleNavClick('community'); }}
                      className="block px-3 py-2 text-[11px] font-bold text-slate-300 hover:text-[#F2B705] hover:bg-slate-800/60 rounded-md transition-colors"
                    >
                      • Communities
                    </a>
                    <a
                      href="#/campus-life?tab=events"
                      onClick={(e) => { e.preventDefault(); window.location.hash = '#/campus-life?tab=events'; setMobileMenuOpen(false); }}
                      className="block px-3 py-2 text-[11px] font-bold text-slate-300 hover:text-[#F2B705] hover:bg-slate-800/60 rounded-md transition-colors"
                    >
                      • Events
                    </a>
                    <a
                      href="#/campus-life?tab=activities"
                      onClick={(e) => { e.preventDefault(); window.location.hash = '#/campus-life?tab=activities'; setMobileMenuOpen(false); }}
                      className="block px-3 py-2 text-[11px] font-bold text-slate-300 hover:text-[#F2B705] hover:bg-slate-800/60 rounded-md transition-colors"
                    >
                      • Activities
                    </a>
                    <a
                      href="#/innovation"
                      onClick={(e) => { e.preventDefault(); handleNavClick('innovation'); }}
                      className="block px-3 py-2 text-[11px] font-bold text-slate-300 hover:text-[#F2B705] hover:bg-slate-800/60 rounded-md transition-colors"
                    >
                      • Student Projects
                    </a>
                    <a
                      href="#/campus-life?tab=achievements"
                      onClick={(e) => { e.preventDefault(); window.location.hash = '#/campus-life?tab=achievements'; setMobileMenuOpen(false); }}
                      className="block px-3 py-2 text-[11px] font-bold text-slate-300 hover:text-[#F2B705] hover:bg-slate-800/60 rounded-md transition-colors"
                    >
                      • Achievements
                    </a>
                  </div>
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-3 rounded-lg text-xs font-extrabold tracking-wider transition-all ${
                  isActive
                    ? 'bg-[#003366] text-[#F2B705] font-black border-l-4 border-[#F2B705]'
                    : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}

    </header>
  );
};

