import React, { useState, useEffect, useCallback } from 'react';
import { X, Calendar, Clock, MapPin, ExternalLink, Sparkles } from 'lucide-react';
import type { EventAnnouncement, NavSectionId } from '../../types';

interface EventAnnouncementModalProps {
  event?: EventAnnouncement | null;
  activeSection: NavSectionId;
}

export const EventAnnouncementModal: React.FC<EventAnnouncementModalProps> = ({ event, activeSection }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    try {
      sessionStorage.setItem('isapForumPopupClosed', 'true');
    } catch {
      // Ignore storage error
    }
  }, []);

  useEffect(() => {
    // Strictly disable on faculty or admin routes
    if (activeSection === 'faculty' || activeSection === 'admin') {
      setIsOpen(false);
      return;
    }

    // Check if user already dismissed modal during this browser session
    try {
      const isDismissed = sessionStorage.getItem('isapForumPopupClosed');
      if (isDismissed === 'true') {
        return;
      }
    } catch {
      // Ignore storage error
    }

    // Check if event exists and is active
    if (!event || event.isActive === false) {
      return;
    }

    // Delayed automatic trigger (~400ms)
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 400);

    return () => clearTimeout(timer);
  }, [activeSection, event]);

  // Keyboard Escape key handler
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen || !event || event.isActive === false) {
    return null;
  }

  const posterImage = event.imageUrl || '/images/isap_forum_2026.jpg';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-announcement-title"
      className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="w-full max-w-lg sm:max-w-2xl bg-slate-900 border-2 border-[#F2B705]/50 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl relative text-white animate-in fade-in zoom-in-95 duration-300">
        
        {/* Top Floating Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close announcement"
          title="Close announcement"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 rounded-full bg-slate-900/90 border border-slate-700 hover:bg-[#F2B705] hover:text-[#003366] text-white transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-[#F2B705]"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Modal Scrollable Container */}
        <div className="max-h-[90vh] overflow-y-auto flex flex-col items-center">
          
          {/* Header Banner Strip */}
          <div className="w-full bg-[#003366] px-4 py-3 sm:px-6 sm:py-3.5 border-b-2 border-[#F2B705] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F2B705] shrink-0" />
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white">
              Official Institutional Event Announcement
            </span>
          </div>

          {/* Prominent Poster Image Display */}
          <div className="w-full bg-slate-950/90 flex items-center justify-center p-2 sm:p-4 border-b border-slate-800">
            <img
              src={posterImage}
              alt={event.title || 'ISAP Forum 2026 Poster'}
              className="w-full h-auto max-h-[55vh] sm:max-h-[65vh] object-contain rounded-xl shadow-md border border-slate-800"
              onError={(e) => {
                // Fallback if image fails to load
                (e.target as HTMLImageElement).src = '/images/isap_forum_2026.jpg';
              }}
            />
          </div>

          {/* Event Details Content */}
          <div className="w-full p-4 sm:p-6 space-y-4 text-left">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#F2B705] text-[#003366] font-mono text-[10px] font-extrabold uppercase inline-block mb-1.5">
                UPSA FITCS NATIONAL FORUM
              </span>
              <h2 id="event-announcement-title" className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {event.title}
              </h2>
              {event.description && (
                <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                  {event.description}
                </p>
              )}
            </div>

            {/* Date, Time, Venue Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1 border-t border-slate-800">
              {event.eventDate && (
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#F2B705] shrink-0" />
                  <span className="font-bold text-slate-200">{event.eventDate}</span>
                </div>
              )}
              {event.eventTime && (
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#00AEEF] shrink-0" />
                  <span className="font-bold text-slate-200">{event.eventTime}</span>
                </div>
              )}
              {event.venue && (
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-2 sm:col-span-1">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-bold text-slate-200 truncate">{event.venue}</span>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              {event.registrationUrl ? (
                <a
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#003366] hover:bg-blue-900 text-[#F2B705] border border-[#F2B705]/50 font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  <span>Register for Forum</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <span className="text-[11px] text-slate-400 italic">
                  Organized by the Department of IT Studies, UPSA.
                </span>
              )}

              <button
                onClick={handleClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors text-center"
              >
                Dismiss Announcement
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
