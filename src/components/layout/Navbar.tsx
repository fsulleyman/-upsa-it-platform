import React, { useState } from 'react';
import type { NavSectionId } from '../../types';
import { Search, Menu, X, GraduationCap } from 'lucide-react';

interface NavbarProps {
  activeSection: NavSectionId;
  onNavigate: (section: NavSectionId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems: { id: NavSectionId; label: string }[] = [
    { id: 'home', label: 'HOME' },
    { id: 'about', label: 'ABOUT' },
    { id: 'academics', label: 'ACADEMICS' },
    { id: 'hub', label: 'DEVELOPERS HUB' },
    { id: 'innovation', label: 'INNOVATION' },
    { id: 'community', label: 'COMMUNITY' },
    { id: 'contact', label: 'CONTACT' }
  ];

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
            <a href="#hub" onClick={() => onNavigate('hub')} className="hover:text-[#F2B705] transition-colors flex items-center gap-1">
              <span>DEVELOPERS HUB</span>
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
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
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

              {/* Rectangular Apply Now CTA */}
              <a
                href="#contact"
                onClick={() => handleNavClick('contact')}
                className="px-4 py-2.5 rounded-lg bg-[#003366] hover:bg-blue-900 text-white font-extrabold text-xs uppercase tracking-wider shadow-sm border border-[#F2B705]/40 transition-colors whitespace-nowrap"
              >
                APPLY NOW
              </a>

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
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
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
