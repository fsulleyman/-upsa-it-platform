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
          <h4 className="text-lg font-extrabold text-[#1A1A1A]">Application Submitted</h4>
          <p className="text-xs text-[#555555] max-w-sm mx-auto">
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
            <label className="block font-extrabold text-[#1A1A1A] mb-1">Full Student Name</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Kwesi Amponsah"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#F5F7FA] border border-slate-300 text-[#1A1A1A] text-xs focus:outline-none focus:border-[#003366]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-extrabold text-[#1A1A1A] mb-1">Student Index Number</label>
              <input
                type="text"
                required
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                placeholder="10293847"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#F5F7FA] border border-slate-300 text-[#1A1A1A] text-xs focus:outline-none focus:border-[#003366]"
              />
            </div>
            <div>
              <label className="block font-extrabold text-[#1A1A1A] mb-1">Academic Level</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#F5F7FA] border border-slate-300 text-[#1A1A1A] text-xs focus:outline-none focus:border-[#003366]"
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
            <label className="block font-extrabold text-[#1A1A1A] mb-1">Programme of Study</label>
            <select
              value={formData.programme}
              onChange={(e) => setFormData({ ...formData, programme: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#F5F7FA] border border-slate-300 text-[#1A1A1A] text-xs focus:outline-none focus:border-[#003366]"
            >
              <option value="BSc Information Technology Management">BSc Information Technology Management</option>
              <option value="BSc Data Science and Analytics">BSc Data Science and Analytics</option>
              <option value="Diploma in Information Technology Management">Diploma in Information Technology Management</option>
              <option value="MSc Information Security Management">MSc Information Security Management</option>
              <option value="MBA in Management Information Systems">MBA in Management Information Systems</option>
              <option value="Other UPSA Programme">Other UPSA Programme</option>
            </select>
          </div>

          <div>
            <label className="block font-extrabold text-[#1A1A1A] mb-1">Primary Technical Interest</label>
            <select
              value={formData.primaryInterest}
              onChange={(e) => setFormData({ ...formData, primaryInterest: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#F5F7FA] border border-slate-300 text-[#1A1A1A] text-xs focus:outline-none focus:border-[#003366]"
            >
              <option value="Full-Stack Web Development">Full-Stack Web Development</option>
              <option value="Mobile App Engineering (React Native / Flutter)">Mobile App Engineering</option>
              <option value="Data Science & Machine Learning">Data Science & Machine Learning</option>
              <option value="Cybersecurity & Ethical Hacking">Cybersecurity & Ethical Hacking</option>
              <option value="Network Infrastructure & Systems">Network Infrastructure & Systems</option>
            </select>
          </div>

          <div>
            <label className="block font-extrabold text-[#1A1A1A] mb-1">GitHub / Portfolio URL (Optional)</label>
            <input
              type="url"
              value={formData.githubOrPortfolio}
              onChange={(e) => setFormData({ ...formData, githubOrPortfolio: e.target.value })}
              placeholder="https://github.com/username"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#F5F7FA] border border-slate-300 text-[#1A1A1A] text-xs focus:outline-none focus:border-[#003366]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-[#003366] text-white font-extrabold text-xs shadow-md hover:bg-blue-900 border border-[#F2B705]/40 transition-colors"
            >
              Submit Hub Application
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
