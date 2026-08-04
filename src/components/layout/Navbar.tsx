import React, { useState } from 'react';
import type { NavSectionId } from '../../types';
import { Search, Sun, Moon, Menu, X, GraduationCap } from 'lucide-react';

interface NavbarProps {
  activeSection: NavSectionId;
  onNavigate: (section: NavSectionId) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  isDarkMode,
  onToggleTheme
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
    <header className="fixed top-0 left-0 right-0 z-50 w-full shadow-md bg-white dark:bg-slate-900">
      
      {/* Top Utility Bar */}
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
            
            {/* Theme Switcher */}
            <button
              onClick={onToggleTheme}
              className="p-1 rounded bg-[#002244] hover:bg-blue-900 text-slate-200 transition-colors"
              title="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-[#F2B705]" /> : <Moon className="w-3.5 h-3.5 text-slate-200" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className={`w-full ${isDarkMode ? 'bg-slate-900 border-b border-slate-800 text-slate-100' : 'bg-white border-b border-slate-200 text-[#1A1A1A]'} transition-colors duration-200`}>
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
                <span className="text-sm sm:text-base font-bold tracking-tight text-[#1A1A1A] dark:text-white uppercase block">
                  UPSA <span className="text-xs font-bold text-[#00AEEF] font-sans tracking-normal uppercase">• IT STUDIES</span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-extrabold tracking-widest text-[#F2B705] uppercase block">
                  Scholarship with Professionalism
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links (Center - responsive text size & gap) */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 min-w-0">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`px-2.5 xl:px-3 py-1.5 rounded-md text-[11px] xl:text-xs font-extrabold tracking-wider transition-all whitespace-nowrap ${
                      isActive
                        ? 'text-[#003366] dark:text-[#00AEEF] bg-[#F5F7FA] dark:bg-slate-800 border-b-2 border-[#F2B705]'
                        : 'text-slate-700 dark:text-slate-300 hover:text-[#003366] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Right Action Items: Expandable Search + Rectangular APPLY NOW Button (Fixes Overflow & Button Shape) */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto lg:ml-0">
              
              {/* Expandable Search Icon / Input */}
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search programmes..."
                    className="w-36 sm:w-48 pl-3 pr-8 py-1.5 rounded-lg text-xs border border-[#003366] bg-white text-[#1A1A1A] focus:outline-none shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 rounded-lg bg-[#F5F7FA] dark:bg-slate-800 text-[#003366] dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  title="Search programmes"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}

              {/* Rectangular APPLY NOW Button (Fixes Issue 1 & 2: rounded-lg 8px border radius, shrink-0, 100% visible) */}
              <button
                onClick={() => {
                  onNavigate('hub');
                  window.location.hash = '#hub?modal=join-hub';
                }}
                className="px-4 py-2 rounded-lg bg-[#F2B705] text-[#003366] font-extrabold text-xs tracking-wider uppercase hover:bg-amber-400 shadow-sm transition-all shrink-0 border border-[#003366]/30 whitespace-nowrap"
              >
                APPLY NOW
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-[#F5F7FA] dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>

          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#003366] border-b border-slate-800 text-white px-4 pt-3 pb-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold tracking-wider ${
                activeSection === item.id
                  ? 'bg-blue-900 text-[#F2B705] border-l-4 border-[#F2B705]'
                  : 'text-slate-200 hover:bg-blue-900/60'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2">
            <button
              onClick={() => {
                handleNavClick('hub');
                window.location.hash = '#hub?modal=join-hub';
              }}
              className="w-full py-2.5 rounded-lg bg-[#F2B705] text-[#003366] font-extrabold text-xs tracking-wider uppercase text-center"
            >
              APPLY NOW / JOIN HUB
            </button>
          </div>
        </div>
      )}

    </header>
  );
};
