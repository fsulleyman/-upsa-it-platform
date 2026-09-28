import React from 'react';
import type { NavSectionId, FooterContent, FooterLink, SocialLink } from '../../types';
import { GraduationCap, MapPin, Phone, Mail, Globe, ArrowUpRight, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (section: NavSectionId) => void;
  footerContent?: FooterContent;
  footerLinks?: FooterLink[];
  socialLinks?: SocialLink[];
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  footerContent,
  footerLinks,
  socialLinks
}) => {
  const logoText = footerContent?.logoText || 'UPSA • IT STUDIES';
  const mottoText = footerContent?.mottoText || 'Scholarship with Professionalism';
  const description = footerContent?.description || 'The Department of Information Technology Studies sits inside the Faculty of Information Technology and Communication Studies (FITCS) at the University of Professional Studies, Accra.';
  const digitalAddress = footerContent?.digitalAddress || 'GA-193-4704';
  const address = footerContent?.address || 'P.O. Box LG 149, Accra – Ghana';
  const phoneAdmissions = footerContent?.phoneAdmissions || '+233 30 250 0311';
  const phoneSwitchboard = footerContent?.phoneSwitchboard || '+233 30 250 0312';
  const email = footerContent?.email || 'infotech@upsamail.edu.gh';
  const copyrightText = footerContent?.copyrightText || 'Department of Information Technology Studies — Faculty of Information Technology and Communication Studies, UPSA.';
  const portalUrl = footerContent?.portalUrl || 'https://upsa.edu.gh';

  // Group footer links by column_title
  const activeLinks = footerLinks ? footerLinks.filter(l => l.isActive).sort((a,b) => a.displayOrder - b.displayOrder) : [];
  const activeSocials = socialLinks ? socialLinks.filter(s => s.isActive).sort((a,b) => a.displayOrder - b.displayOrder) : [];

  const columnsMap: Record<string, FooterLink[]> = {};
  activeLinks.forEach(link => {
    if (!columnsMap[link.columnTitle]) columnsMap[link.columnTitle] = [];
    columnsMap[link.columnTitle].push(link);
  });

  const columnTitles = Object.keys(columnsMap);

  return (
    <footer className="w-full bg-[#003366] text-white border-t-4 border-[#F2B705] dark-section">
      
      {/* Top Main Footer Section (UPSA Blue #003366) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Column 1 & 2: Institutional Identity & Motto */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white text-[#003366] border-2 border-[#F2B705] flex items-center justify-center font-bold shadow-md">
                <GraduationCap className="w-7 h-7 text-[#003366]" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold tracking-tight text-white uppercase">
                  {logoText}
                </h3>
                <div className="text-xs font-black text-[#F2B705] tracking-widest uppercase mt-0.5">
                  {mottoText}
                </div>
              </div>
            </div>

            <p className="body-text text-sm text-[#F1F5F9] leading-relaxed max-w-sm font-medium">
              {description}
            </p>

            <div className="pt-2 space-y-2 text-xs text-slate-200">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#F2B705] shrink-0" />
                <span>Ghana Digital Address: <strong className="text-white font-mono">{digitalAddress}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#00AEEF] shrink-0" />
                <span>{address}</span>
              </div>
            </div>

            {/* Social Links List */}
            {activeSocials.length > 0 && (
              <div className="flex items-center gap-3 pt-2">
                {activeSocials.map(s => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded bg-[#002244] border border-[#00AEEF]/40 text-[#00AEEF] hover:text-[#F2B705] text-xs font-bold transition-colors"
                  >
                    {s.platform}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Dynamic Link Columns */}
          {columnTitles.length > 0 ? (
            columnTitles.map(colTitle => (
              <div key={colTitle} className="space-y-4">
                <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#F2B705] border-b border-[#002244] pb-2">
                  {colTitle}
                </h4>
                <ul className="space-y-2.5 text-xs text-slate-100 font-semibold">
                  {columnsMap[colTitle].map(link => (
                    <li key={link.id}>
                      {link.isExternal ? (
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#F2B705] transition-colors inline-flex items-center gap-1 text-[#00AEEF]"
                        >
                          <span>{link.label}</span>
                          <ArrowUpRight className="w-3 h-3 text-[#F2B705]" />
                        </a>
                      ) : (
                        <button
                          onClick={() => onNavigate(link.url as NavSectionId)}
                          className="hover:text-[#F2B705] transition-colors"
                        >
                          {link.label}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <>
              {/* Fallback Static Columns if no dynamic links */}
              <div className="space-y-4">
                <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#F2B705] border-b border-[#002244] pb-2">
                  ACADEMICS & HUB
                </h4>
                <ul className="space-y-2.5 text-xs text-slate-100 font-semibold">
                  <li><button onClick={() => onNavigate('academics')} className="hover:text-[#F2B705]">Academic Programmes</button></li>
                  <li><button onClick={() => onNavigate('hub')} className="hover:text-[#F2B705]">UPSA Developers Hub</button></li>
                  <li><button onClick={() => onNavigate('innovation')} className="hover:text-[#F2B705]">Student Innovations & Showcase</button></li>
                  <li><button onClick={() => onNavigate('community')} className="hover:text-[#F2B705]">DataCamp Integration</button></li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#F2B705] border-b border-[#002244] pb-2">
                  ADMISSIONS & FACULTY
                </h4>
                <ul className="space-y-2.5 text-xs text-slate-100 font-semibold">
                  <li><button onClick={() => onNavigate('about')} className="hover:text-[#F2B705]">About FITCS Faculty</button></li>
                  <li><button onClick={() => onNavigate('contact')} className="hover:text-[#F2B705]">Faculty Secretariat Contact</button></li>
                  <li><a href={portalUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#F2B705] text-[#00AEEF]">Official UPSA Website</a></li>
                </ul>
              </div>
            </>
          )}

          {/* Secretariat Telephones Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#F2B705] border-b border-[#002244] pb-2">
              TELEPHONE CONTACTS
            </h4>
            <div className="space-y-2 text-xs text-slate-100">
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#F2B705] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-slate-200 block font-semibold">Admissions & Secretariat Tel:</span>
                  <span className="block font-mono font-bold text-white text-xs">{phoneAdmissions}</span>
                  <span className="block font-mono text-slate-200 text-[11px]">Switchboard: {phoneSwitchboard}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-2">
                <Mail className="w-4 h-4 text-[#00AEEF] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-slate-200 block font-semibold">Official Email:</span>
                  <span className="font-mono font-bold text-white text-[11px]">
                    {email}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright & Admin Gateway Bar (#002244 Deep Navy) */}
      <div className="w-full bg-[#002244] text-slate-200 text-xs py-4 px-4 sm:px-6 lg:px-8 border-t border-blue-900/60">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} {copyrightText}
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <a href={portalUrl} target="_blank" rel="noreferrer" className="hover:text-[#F2B705] text-slate-300">UPSA Portal</a>
            <span className="text-slate-500">•</span>
            
            {/* Functional Admin Portal Trigger Button */}
            <button
              onClick={() => onNavigate('admin')}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-[#003366] text-[#F2B705] border border-[#F2B705]/50 font-bold hover:underline transition-colors flex items-center gap-1 shadow-sm"
              title="Access Department Admin Control Center"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#F2B705]" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>

    </footer>
  );
};
