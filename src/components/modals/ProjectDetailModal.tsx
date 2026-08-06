import React from 'react';
import type { StudentProject } from '../../types';
import { Modal } from '../common/Modal';
import { SampleBadge } from '../common/SampleBadge';
import { ExternalLink } from 'lucide-react';

interface ProjectDetailModalProps {
  project: StudentProject | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <Modal
      isOpen={!!project}
      onClose={onClose}
      title={project.title}
      subtitle={project.subtitle}
      maxWidth="xl"
    >
      <div className="space-y-6 text-xs text-white">
        
        {/* Project Image Banner */}
        {project.imageUrl && (
          <div className="w-full h-56 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-md relative">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3 text-xs font-bold text-[#F2B705] bg-[#001B40]/90 px-3 py-1 rounded border border-slate-700 shadow-sm">
              System Architecture Preview
            </div>
          </div>
        )}

        {/* Verification & Classification Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-[#0B132B] border border-slate-800">
          <div>
            <span className="text-slate-400 block text-xs uppercase font-mono font-bold">Project Classification</span>
            <span className="text-white font-extrabold text-sm">{project.category}</span>
          </div>
          <div>
            {project.isVerifiedReal ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-extrabold bg-[#003366] text-[#F2B705] border border-[#F2B705]/40">
                VERIFIED REAL PROJECT
              </span>
            ) : (
              <SampleBadge label="Sample Showcase" />
            )}
          </div>
        </div>

        {/* Detailed Overview */}
        <div>
          <h4 className="font-extrabold text-white text-sm sm:text-base mb-2">Technical Description & Architecture</h4>
          <p className="body-text text-sm text-slate-300 leading-relaxed">{project.fullDetails}</p>
        </div>

        {/* Technologies Stack Tags */}
        <div>
          <h4 className="font-extrabold text-[#00AEEF] text-xs uppercase tracking-wider mb-2">Technologies & Architecture Stack</h4>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-md bg-[#003366] text-white border border-slate-700 font-mono text-xs font-bold"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Developer Attribution */}
        <div className="p-4 rounded-xl bg-[#0B132B] border border-slate-800 space-y-1">
          <span className="text-xs font-mono font-bold text-[#F2B705] uppercase">ENGINEERING CREDIT</span>
          <div className="text-sm font-extrabold text-white">{project.studentName}</div>
          <div className="text-xs text-slate-300 font-medium">Affiliation: {project.hubAffiliation} ({project.date})</div>
        </div>

        {/* External Media Link if available */}
        {project.articleUrl && (
          <div className="p-4 rounded-xl bg-[#003366] border border-[#F2B705]/40 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Official Media Feature</span>
              <span className="text-xs text-[#F2B705] font-extrabold">{project.articleSource || 'Read News Article'}</span>
            </div>
            <a
              href={project.articleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-[#F2B705] text-[#003366] font-extrabold text-xs flex items-center gap-1.5 hover:bg-amber-400 transition-colors"
            >
              <span>Open Link</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-[#003366] hover:bg-blue-900 text-white font-extrabold text-xs shadow-md border border-[#F2B705]/40 transition-colors"
          >
            Close Project
          </button>
        </div>

      </div>
    </Modal>
  );
};
