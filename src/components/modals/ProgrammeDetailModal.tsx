import React from 'react';
import type { AcademicProgramme } from '../../types';
import { Modal } from '../common/Modal';

interface ProgrammeDetailModalProps {
  programme: AcademicProgramme | null;
  onClose: () => void;
}

export const ProgrammeDetailModal: React.FC<ProgrammeDetailModalProps> = ({ programme, onClose }) => {
  if (!programme) return null;

  const coreModules = programme.coreModules || [];
  const careerOutcomes = programme.careerOutcomes || [];
  const entryRequirements = programme.entryRequirements || [];

  return (
    <Modal
      isOpen={!!programme}
      onClose={onClose}
      title={programme.name}
      subtitle={`${programme.code} • ${programme.level} (${programme.duration})`}
      maxWidth="2xl"
    >
      <div className="space-y-6 text-sm text-[#1A1A1A]">
        
        {/* Programme Image Banner Header */}
        {programme.imageUrl && (
          <div className="w-full h-48 sm:h-56 rounded-xl overflow-hidden bg-[#001B40] border border-slate-300 shadow-md">
            <img
              src={programme.imageUrl}
              alt={programme.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Tagline */}
        {programme.tagline && (
          <div className="p-4 rounded-xl bg-[#F5F7FA] border border-slate-300 text-[#003366] italic font-bold text-xs sm:text-sm">
            "{programme.tagline}"
          </div>
        )}

        {/* Overview */}
        <div>
          <h4 className="font-extrabold text-[#1A1A1A] text-base mb-1.5">Programme Overview</h4>
          <p className="body-text text-sm text-[#555555] leading-relaxed">{programme.description || 'No detailed description provided.'}</p>
        </div>

        {/* Core Curriculum Modules */}
        {coreModules.length > 0 && (
          <div>
            <h4 className="font-extrabold text-[#003366] text-xs uppercase tracking-wider mb-3">
              Core Curriculum & Key Course Modules
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {coreModules.map((module, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-3 rounded-xl bg-[#F5F7FA] border border-slate-300 text-[#1A1A1A] font-semibold text-xs"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#003366] mt-1.5 shrink-0" />
                  <span>{module}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Career Outcomes */}
        {careerOutcomes.length > 0 && (
          <div>
            <h4 className="font-extrabold text-[#003366] text-xs uppercase tracking-wider mb-2">
              Target Career Pathways & Roles
            </h4>
            <div className="flex flex-wrap gap-2">
              {careerOutcomes.map((career, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-[#003366] font-extrabold text-xs"
                >
                  {career}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Admission Requirements */}
        {entryRequirements.length > 0 && (
          <div>
            <h4 className="font-extrabold text-[#003366] text-xs uppercase tracking-wider mb-2">
              Entry & Admission Requirements
            </h4>
            <ul className="space-y-2 text-[#555555] text-xs font-medium">
              {entryRequirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#003366] font-bold shrink-0">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-[#555555] font-semibold">Offered by Faculty of IT & Communication Studies (FITCS)</span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-[#003366] hover:bg-blue-900 text-white font-extrabold text-xs shadow-md transition-colors"
          >
            Close Overview
          </button>
        </div>

      </div>
    </Modal>
  );
};
