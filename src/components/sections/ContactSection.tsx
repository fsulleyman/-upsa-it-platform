import React, { useState } from 'react';
import { INSTITUTION_INFO } from '../../data/groundTruth';

export const ContactSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    programmeInterest: 'BSc Information Technology Management',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputStyles = "w-full px-4 py-3 rounded-lg bg-[#F5F7FA] border border-slate-300 text-[#1A1A1A] text-sm font-medium focus:outline-none focus:bg-white focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 transition-all";

  return (
    <section id="contact" className="py-16 bg-[#FFFFFF] border-b border-slate-200 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12 space-y-3">
          <h2 className="section-heading">
            Official Enquiries & Admissions Contact
          </h2>
          <p className="body-text text-lg text-[#555555]">
            Reach out to the Department Secretariat regarding academic programmes, Developers Hub admissions, or research partnerships.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Secretariat Contact Details (Secondary Cards) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Secretariat Office Details */}
            <div className="p-7 rounded-2xl bg-[#F5F7FA] border border-slate-300 shadow-sm space-y-5">
              <h3 className="subheading text-2xl font-black text-[#003366]">Faculty Secretariat Office</h3>

              <div className="space-y-4">
                <div>
                  <span className="text-[#003366] block font-extrabold text-xs uppercase tracking-wider mb-0.5">Physical Location</span>
                  <p className="body-text text-sm text-[#555555] leading-relaxed">{INSTITUTION_INFO.facultyLocation}</p>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[#003366] block font-extrabold text-xs uppercase tracking-wider mb-0.5">Postal Address & Email</span>
                  <p className="body-text text-sm text-[#555555]">{INSTITUTION_INFO.address}</p>
                  <a href={`mailto:${INSTITUTION_INFO.email}`} className="text-[#003366] font-bold text-sm hover:underline block mt-0.5">{INSTITUTION_INFO.email}</a>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[#003366] block font-extrabold text-xs uppercase tracking-wider mb-0.5">Telephone Contacts</span>
                  <span className="font-extrabold text-[#003366] text-sm block">{INSTITUTION_INFO.facultyPhone}</span>
                  <span className="text-xs text-slate-500 block mt-0.5">
                    Switchboard: {INSTITUTION_INFO.switchboard}
                  </span>
                </div>
              </div>
            </div>

            {/* Academic Office Hours */}
            <div className="p-7 rounded-2xl bg-[#F5F7FA] border border-slate-300 shadow-sm space-y-3">
              <h3 className="subheading text-xl font-bold text-[#1A1A1A]">Academic Office Hours</h3>
              <p className="body-text text-sm text-[#555555]">
                Monday to Friday: <strong className="text-[#1A1A1A]">8:00 AM – 5:00 PM</strong> (GMT)
              </p>
              <p className="small-text text-slate-500">
                Secretariat closed on national public holidays.
              </p>
            </div>

          </div>

          {/* Inquiry Form (Primary Visual Card) */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-2xl bg-white border-2 border-[#003366]/20 shadow-md">
            
            {submitted ? (
              <div className="p-8 rounded-xl bg-blue-50 border border-blue-200 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#003366] text-[#F2B705] flex items-center justify-center mx-auto text-xl font-black">
                  ✓
                </div>
                <h3 className="subheading text-2xl font-extrabold text-[#003366]">Inquiry Submitted</h3>
                <p className="body-text text-sm text-[#555555] leading-relaxed">
                  Thank you for contacting the Department of Information Technology Studies. The faculty secretariat will respond to your email.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-lg bg-[#003366] text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-900 transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="subheading text-2xl sm:text-3xl font-extrabold text-[#003366]">
                    Send an Official Inquiry
                  </h3>
                  <p className="body-text text-sm text-[#555555] mt-1">
                    Fill out the form below to connect directly with the IT Studies department office.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kwame Mensah"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={inputStyles}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. kwame.mensah@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={inputStyles}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                      Programme / Subject of Interest
                    </label>
                    <select
                      value={formData.programmeInterest}
                      onChange={(e) => setFormData({ ...formData, programmeInterest: e.target.value })}
                      className={inputStyles}
                    >
                      <option value="BSc Information Technology Management">BSc Information Technology Management</option>
                      <option value="BSc Data Science and Analytics">BSc Data Science and Analytics</option>
                      <option value="Diploma in IT Management">Diploma in Information Technology Management</option>
                      <option value="MSc Information Security Management">MSc Information Security Management</option>
                      <option value="MBA MIS">MBA in Management Information Systems</option>
                      <option value="UPSA Developers Hub Application">UPSA Developers Hub Application</option>
                      <option value="General Secretariat Inquiry">General Secretariat Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                      Message Details *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Write your inquiry for the department secretariat..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={inputStyles}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-lg bg-[#003366] hover:bg-blue-900 text-white font-extrabold text-sm uppercase tracking-wider shadow-md transition-all text-center"
                >
                  Submit Official Inquiry
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
