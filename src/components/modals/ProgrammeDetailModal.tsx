import React from 'react';
import type { AcademicProgramme } from '../../types';
import { Modal } from '../common/Modal';

interface ProgrammeDetailModalProps {
  programme: AcademicProgramme | null;
  onClose: () => void;
}

export const ProgrammeDetailModal: React.FC<ProgrammeDetailModalProps> = ({ programme, onClose }) => {
  if (!programme) return null;

  return (
    <Modal
      isOpen={!!programme}
      onClose={onClose}
      title={programme.name}
      subtitle={`${programme.code} • ${programme.level} (${programme.duration})`}
      maxWidth="2xl"
    >
      <div className="space-y-6 text-sm text-white">
        
        {/* Programme Image Banner Header */}
        {programme.imageUrl && (
          <div className="w-full h-48 sm:h-56 rounded-xl overflow-hidden bg-[#0B132B] border border-slate-800 shadow-md">
            <img
              src={programme.imageUrl}
              alt={programme.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Tagline */}
        <div className="p-4 rounded-xl bg-[#0B132B] border border-slate-800 text-[#F2B705] italic font-bold text-xs sm:text-sm">
          "{programme.tagline}"
        </div>

        {/* Overview */}
        <div>
          <h4 className="font-extrabold text-white text-base mb-1.5">Programme Overview</h4>
          <p className="body-text text-sm text-slate-300 leading-relaxed">{programme.description}</p>
        </div>

        {/* Core Curriculum Modules */}
        <div>
          <h4 className="font-extrabold text-[#00AEEF] text-xs uppercase tracking-wider mb-3">
            Core Curriculum & Key Course Modules
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {programme.coreModules.map((module, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-3 rounded-xl bg-[#0B132B] border border-slate-800 text-slate-200 font-semibold text-xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#F2B705] mt-1.5 shrink-0" />
                <span>{module}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Career Outcomes */}
        <div>
          <h4 className="font-extrabold text-[#00AEEF] text-xs uppercase tracking-wider mb-2">
            Target Career Pathways & Roles
          </h4>
          <div className="flex flex-wrap gap-2">
            {programme.careerOutcomes.map((career, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 rounded-lg bg-[#003366] border border-[#F2B705]/30 text-[#F2B705] font-extrabold text-xs"
              >
                {career}
              </span>
            ))}
          </div>
        </div>

        {/* Admission Requirements */}
        <div>
          <h4 className="font-extrabold text-[#00AEEF] text-xs uppercase tracking-wider mb-2">
            Entry & Admission Requirements
          </h4>
          <ul className="space-y-2 text-slate-300 text-xs font-medium">
            {programme.entryRequirements.map((req, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#F2B705] font-bold shrink-0">•</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-semibold">Offered by Faculty of IT & Communication Studies (FITCS)</span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-[#003366] hover:bg-blue-900 text-white font-extrabold text-xs shadow-md border border-[#F2B705]/40 transition-colors"
          >
            Close Overview
          </button>
        </div>

      </div>
    </Modal>
  );
};
