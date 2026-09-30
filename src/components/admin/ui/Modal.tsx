import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'md'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getMaxWidthClass = (width: string) => {
    switch (width) {
      case 'sm':
        return 'max-w-sm';
      case 'lg':
        return 'max-w-lg';
      case 'xl':
        return 'max-w-xl';
      case '2xl':
        return 'max-w-2xl';
      case 'md':
      default:
        return 'max-w-md';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card Container */}
      <div
        className={`relative z-10 w-full ${getMaxWidthClass(
          maxWidth
        )} bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 transform transition-all text-slate-100 flex flex-col max-h-[90vh]`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-900/90">
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight">{title}</h3>
            {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 custom-scrollbar flex-1">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
