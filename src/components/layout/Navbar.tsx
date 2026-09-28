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
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState<'academics' | 'it-department' | null>(null);

  const handleNavClick = (id: NavSectionId) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setOpenDropdown(null);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('academics/courses');
      setSearchOpen(false);
    }
  };

  const navLinks: { id: NavSectionId; label: string; hasDropdown?: boolean; dropdownKey?: 'academics' | 'it-department' }[] = [
    { id: 'home', label: 'HOME' },
    { id: 'about', label: 'ABOUT' },
    { id: 'academics', label: 'ACADEMICS', hasDropdown: true, dropdownKey: 'academics' },
    { id: 'it-department', label: 'IT DEPARTMENT', hasDropdown: true, dropdownKey: 'it-department' },
    { id: 'developers-hub', label: 'DEVELOPERS HUB' },
    { id: 'innovation', label: 'INNOVATION' },
    { id: 'community', label: 'COMMUNITY' },
    { id: 'contact', label: 'CONTACT' }
  ];

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
            <button onClick={() => handleNavClick('academics/programmes')} className="hover:text-[#F2B705] transition-colors hidden sm:inline">
              PROGRAMMES
            </button>
            <button onClick={() => handleNavClick('developers-hub')} className="hover:text-[#F2B705] transition-colors flex items-center gap-1">
              <span>DEVELOPERS HUB</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="w-full bg-slate-900 border-b border-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-3">
            {/* Official Identity Crest */}
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

            {/* Desktop Navigation Links with Dropdowns */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((item) => {
                const isActive = activeSection === item.id || (item.id === 'academics' && activeSection.startsWith('academics')) || (item.id === 'it-department' && (activeSection.startsWith('it-department') || activeSection === 'research'));

                if (item.hasDropdown && item.dropdownKey === 'academics') {
                  return (
                    <div
                      key={item.id}
                      className="relative"
                      onMouseEnter={() => setOpenDropdown('academics')}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <button
                        onClick={() => handleNavClick('academics')}
                        className={`px-3 py-2 text-xs font-extrabold tracking-wider transition-all flex items-center gap-1 relative ${
                          isActive ? 'text-[#F2B705]' : 'text-slate-200 hover:text-white hover:bg-slate-800 rounded-md'
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronDown className="w-3 h-3" />
                        {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F2B705] rounded-full" />}
                      </button>

                      {openDropdown === 'academics' && (
                        <div className="absolute top-full left-0 w-52 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 text-xs font-extrabold animate-in fade-in-50 duration-150">
                          <button onClick={() => handleNavClick('academics')} className="w-full text-left px-4 py-2.5 text-slate-200 hover:bg-[#003366] hover:text-[#F2B705] block">
                            Academics Overview
                          </button>
                          <button onClick={() => handleNavClick('academics/programmes')} className="w-full text-left px-4 py-2.5 text-slate-200 hover:bg-[#003366] hover:text-[#F2B705] block border-t border-slate-700/60">
                            Programme Directory
                          </button>
                          <button onClick={() => handleNavClick('academics/courses')} className="w-full text-left px-4 py-2.5 text-slate-200 hover:bg-[#003366] hover:text-[#F2B705] block border-t border-slate-700/60">
                            Course Directory Catalog
                          </button>
                        </div>
                      )}
                    </div>
                  );
                }

                if (item.hasDropdown && item.dropdownKey === 'it-department') {
                  return (
                    <div
                      key={item.id}
                      className="relative"
                      onMouseEnter={() => setOpenDropdown('it-department')}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <button
                        onClick={() => handleNavClick('it-department')}
                        className={`px-3 py-2 text-xs font-extrabold tracking-wider transition-all flex items-center gap-1 relative ${
                          isActive ? 'text-[#F2B705]' : 'text-slate-200 hover:text-white hover:bg-slate-800 rounded-md'
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronDown className="w-3 h-3" />
                        {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F2B705] rounded-full" />}
                      </button>

                      {openDropdown === 'it-department' && (
                        <div className="absolute top-full left-0 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 text-xs font-extrabold animate-in fade-in-50 duration-150">
                          <button onClick={() => handleNavClick('it-department')} className="w-full text-left px-4 py-2.5 text-slate-200 hover:bg-[#003366] hover:text-[#F2B705] block">
                            Department Overview
                          </button>
                          <button onClick={() => handleNavClick('it-department/faculty')} className="w-full text-left px-4 py-2.5 text-slate-200 hover:bg-[#003366] hover:text-[#F2B705] block border-t border-slate-700/60">
                            Faculty & Staff Directory
                          </button>
                          <button onClick={() => handleNavClick('research')} className="w-full text-left px-4 py-2.5 text-slate-200 hover:bg-[#003366] hover:text-[#F2B705] block border-t border-slate-700/60">
                            Research & Publications
                          </button>
                          <button onClick={() => handleNavClick('academics/courses')} className="w-full text-left px-4 py-2.5 text-slate-200 hover:bg-[#003366] hover:text-[#F2B705] block border-t border-slate-700/60">
                            Teaching & Courses
                          </button>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`px-3 py-2 text-xs font-extrabold tracking-wider transition-all relative ${
                      isActive ? 'text-[#F2B705]' : 'text-slate-200 hover:text-white hover:bg-slate-800 rounded-md'
                    }`}
                  >
                    {item.label}
                    {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F2B705] rounded-full" />}
                  </button>
                );
              })}
            </nav>

            {/* Right Trigger Group */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 transition-colors"
                title="Search platform"
              >
                <Search className="w-4 h-4" />
              </button>

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
                placeholder="Search programmes, courses, faculty, research..."
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
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top duration-200 max-h-[80vh] overflow-y-auto">
          <button onClick={() => handleNavClick('home')} className="w-full text-left px-4 py-2.5 rounded-lg text-xs font-extrabold text-slate-200 hover:bg-slate-800">
            HOME
          </button>
          <button onClick={() => handleNavClick('about')} className="w-full text-left px-4 py-2.5 rounded-lg text-xs font-extrabold text-slate-200 hover:bg-slate-800">
            ABOUT
          </button>

          {/* Academics Mobile Nested Links */}
          <div className="pl-2 border-l-2 border-[#003366] space-y-1">
            <span className="text-[10px] font-bold text-[#F2B705] px-2 block">ACADEMICS</span>
            <button onClick={() => handleNavClick('academics')} className="w-full text-left px-4 py-2 rounded text-xs font-bold text-slate-300 hover:bg-slate-800">
              Overview
            </button>
            <button onClick={() => handleNavClick('academics/programmes')} className="w-full text-left px-4 py-2 rounded text-xs font-bold text-slate-300 hover:bg-slate-800">
              Programmes Directory
            </button>
            <button onClick={() => handleNavClick('academics/courses')} className="w-full text-left px-4 py-2 rounded text-xs font-bold text-slate-300 hover:bg-slate-800">
              Course Catalog
            </button>
          </div>

          {/* IT Department Mobile Nested Links */}
          <div className="pl-2 border-l-2 border-[#003366] space-y-1">
            <span className="text-[10px] font-bold text-[#F2B705] px-2 block">IT DEPARTMENT</span>
            <button onClick={() => handleNavClick('it-department')} className="w-full text-left px-4 py-2 rounded text-xs font-bold text-slate-300 hover:bg-slate-800">
              Department Overview
            </button>
            <button onClick={() => handleNavClick('it-department/faculty')} className="w-full text-left px-4 py-2 rounded text-xs font-bold text-slate-300 hover:bg-slate-800">
              Faculty & Staff
            </button>
            <button onClick={() => handleNavClick('research')} className="w-full text-left px-4 py-2 rounded text-xs font-bold text-slate-300 hover:bg-slate-800">
              Research & Publications
            </button>
          </div>

          <button onClick={() => handleNavClick('developers-hub')} className="w-full text-left px-4 py-2.5 rounded-lg text-xs font-extrabold text-slate-200 hover:bg-slate-800">
            DEVELOPERS HUB
          </button>
          <button onClick={() => handleNavClick('innovation')} className="w-full text-left px-4 py-2.5 rounded-lg text-xs font-extrabold text-slate-200 hover:bg-slate-800">
            INNOVATION
          </button>
          <button onClick={() => handleNavClick('community')} className="w-full text-left px-4 py-2.5 rounded-lg text-xs font-extrabold text-slate-200 hover:bg-slate-800">
            COMMUNITY
          </button>
          <button onClick={() => handleNavClick('contact')} className="w-full text-left px-4 py-2.5 rounded-lg text-xs font-extrabold text-slate-200 hover:bg-slate-800">
            CONTACT
          </button>
        </div>
      )}
    </header>
  );
};
