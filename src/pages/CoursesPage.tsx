import React, { useState } from 'react';
import type { Course, NavSectionId } from '../types';
import { BookOpen, Search, Clock, Calendar, ChevronRight } from 'lucide-react';

interface CoursesPageProps {
  courses: Course[];
  programmes?: any[];
  faculty?: any[];
  onNavigate: (section: NavSectionId) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ courses, onNavigate }) => {
  const [levelFilter, setLevelFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activeCourses = courses.filter((c) => c.isActive);

  const filteredCourses = activeCourses.filter((course) => {
    const matchesLevel = levelFilter === 'All' || course.level.toLowerCase() === levelFilter.toLowerCase();
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <section className="bg-[#003366] text-white py-14 px-4 sm:px-6 lg:px-8 border-b-4 border-[#F2B705]">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#F2B705] uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Course Catalog Directory</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Department Courses Directory</h1>
          <p className="text-slate-200 text-sm sm:text-base max-w-3xl leading-relaxed">
            Search individual course modules by code, credit hours, level, and semester taught across IT Studies degree programmes.
          </p>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="p-4 sm:p-6 rounded-2xl bg-[#F5F7FA] border border-slate-300 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Level Filter Pills */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {['All', 'Undergraduate', 'Postgraduate'].map((level) => (
              <button
                key={level}
                onClick={() => setLevelFilter(level)}
                className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-colors ${
                  levelFilter === level
                    ? 'bg-[#003366] text-[#F2B705] border border-[#F2B705]/50'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search course code or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-slate-300 text-xs font-medium text-[#1A1A1A] focus:outline-none focus:border-[#003366]"
            />
          </div>
        </div>

        {/* Courses List Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="p-6 rounded-2xl bg-white border border-slate-300 hover:border-[#003366] hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded bg-[#003366] text-white font-mono text-xs font-extrabold">
                      {course.courseCode}
                    </span>
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded border border-slate-300">
                      {course.level}
                    </span>
                  </div>

                  <h2 className="text-lg font-extrabold text-[#1A1A1A] leading-snug">{course.title}</h2>
                  <p className="text-xs text-[#555555] leading-relaxed">{course.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-semibold">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-[#003366]" /> {course.creditHours} Credits
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#003366]" /> {course.semester}
                    </span>
                  </div>

                  <button
                    onClick={() => onNavigate('academics/programmes')}
                    className="text-[#003366] font-bold hover:underline text-xs flex items-center gap-0.5"
                  >
                    Programmes <ChevronRight className="w-3.5 h-3.5 text-[#F2B705]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-[#F5F7FA] border border-slate-300 space-y-2">
            <h3 className="text-lg font-bold text-[#1A1A1A]">No matching courses found</h3>
            <p className="text-xs text-slate-500">Course information is currently being updated in the catalog.</p>
          </div>
        )}
      </section>
    </div>
  );
};
