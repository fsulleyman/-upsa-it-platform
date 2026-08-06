import React, { useState } from 'react';
import { Modal } from '../common/Modal';

interface JoinHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JoinHubModal: React.FC<JoinHubModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    studentId: '',
    email: '',
    programme: 'BSc Information Technology Management',
    level: 'Level 200',
    primaryInterest: 'Full-Stack Web Development',
    githubOrPortfolio: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputStyles = "w-full px-3 py-2 rounded-lg bg-[#F5F7FA] border border-slate-300 text-[#1A1A1A] text-xs font-medium focus:outline-none focus:bg-white focus:border-[#003366] transition-all";

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setSubmitted(false);
      }}
      title="Join the UPSA Developers Hub"
      subtitle="Launched 17 Dec 2025 • Student-led, Department-guided Project Community"
      maxWidth="lg"
    >
      {submitted ? (
        <div className="py-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#003366] text-[#F2B705] flex items-center justify-center mx-auto text-xl font-black">
            ✓
          </div>
          <h4 className="text-lg font-extrabold text-[#1A1A1A]">Application Submitted</h4>
          <p className="text-xs text-[#555555] max-w-sm mx-auto leading-relaxed">
            Thank you for applying to join the UPSA Developers Hub cohort. Your application will be reviewed by department faculty mentors.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              onClose();
            }}
            className="px-5 py-2.5 rounded-lg bg-[#003366] text-white text-xs font-extrabold hover:bg-blue-900"
          >
            Close Application Window
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-[#1A1A1A]">
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-[#003366] text-xs font-semibold leading-relaxed">
            Open primarily to IT Studies students and selected cross-programme students with software development aptitude.
          </div>

          <div>
            <label className="block font-extrabold text-[#1A1A1A] mb-1">Full Student Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Ama Asante"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className={inputStyles}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-extrabold text-[#1A1A1A] mb-1">UPSA Student ID *</label>
              <input
                type="text"
                required
                placeholder="e.g. 10293847"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className={inputStyles}
              />
            </div>
            <div>
              <label className="block font-extrabold text-[#1A1A1A] mb-1">UPSA / Personal Email *</label>
              <input
                type="email"
                required
                placeholder="e.g. student@upsamail.edu.gh"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={inputStyles}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-extrabold text-[#1A1A1A] mb-1">Current Academic Programme</label>
              <select
                value={formData.programme}
                onChange={(e) => setFormData({ ...formData, programme: e.target.value })}
                className={inputStyles}
              >
                <option value="BSc Information Technology Management">BSc Information Technology Management</option>
                <option value="BSc Data Science and Analytics">BSc Data Science and Analytics</option>
                <option value="Diploma in IT Management">Diploma in IT Management</option>
                <option value="Other UPSA Degree Programme">Other UPSA Degree Programme</option>
              </select>
            </div>
            <div>
              <label className="block font-extrabold text-[#1A1A1A] mb-1">Level / Year</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className={inputStyles}
              >
                <option value="Level 100">Level 100</option>
                <option value="Level 200">Level 200</option>
                <option value="Level 300">Level 300</option>
                <option value="Level 400">Level 400</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-extrabold text-[#1A1A1A] mb-1">Primary Area of Interest</label>
            <select
              value={formData.primaryInterest}
              onChange={(e) => setFormData({ ...formData, primaryInterest: e.target.value })}
              className={inputStyles}
            >
              <option value="Full-Stack Web Development">Full-Stack Web Development</option>
              <option value="Mobile App Engineering (Flutter/React Native)">Mobile App Engineering (Flutter/React Native)</option>
              <option value="AI & Applied Machine Learning">AI & Applied Machine Learning</option>
              <option value="Data Engineering & Analytics">Data Engineering & Analytics</option>
              <option value="Network Infrastructure & Security">Network Infrastructure & Security</option>
            </select>
          </div>

          <div>
            <label className="block font-extrabold text-[#1A1A1A] mb-1">GitHub Profile / Portfolio Link (Optional)</label>
            <input
              type="url"
              placeholder="https://github.com/your-username"
              value={formData.githubOrPortfolio}
              onChange={(e) => setFormData({ ...formData, githubOrPortfolio: e.target.value })}
              className={inputStyles}
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 border border-slate-300 text-[#555555] text-xs font-bold hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#003366] text-white text-xs font-extrabold hover:bg-blue-900 shadow-sm"
            >
              Submit Application
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
