import React, { useState, useMemo } from 'react';
import { useLearningResources } from '../hooks/useLearningResources';
import type { Course, NavSectionId } from '../types';
import {
  GraduationCap,
  BookOpen,
  Search,
  FileText,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  FolderOpen,
  Layers,
  Calendar,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface LearningHubPageProps {
  onNavigate?: (section: NavSectionId) => void;
}

export const LearningHubPage: React.FC<LearningHubPageProps> = () => {
  const { courses, resources, loading, error } = useLearningResources();

  // Navigation and Filter States
  const [selectedLevel, setSelectedLevel] = useState<string>('100');
  const [selectedSemester, setSelectedSemester] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedResourceType, setSelectedResourceType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Course Detail Modal State
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Derived filtered courses
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      // Level check
      if (selectedLevel !== 'All' && c.level !== selectedLevel) return false;

      // Semester check
      if (selectedSemester !== 'All' && c.semester !== selectedSemester) return false;

      // Course Type check
      if (selectedType !== 'All' && c.courseType !== selectedType) return false;

      // Search query check
      const query = searchQuery.trim().toLowerCase();
      if (query) {
        const matchesCode = c.courseCode.toLowerCase().includes(query);
        const matchesTitle = c.title.toLowerCase().includes(query);
        const matchesDesc = (c.description || '').toLowerCase().includes(query);
        
        // Also check if any resource belonging to this course matches the search query
        const courseRes = resources.filter((r) => r.courseId === c.id);
        const matchesRes = courseRes.some(
          (r) => r.title.toLowerCase().includes(query) || (r.description || '').toLowerCase().includes(query)
        );

        if (!matchesCode && !matchesTitle && !matchesDesc && !matchesRes) return false;
      }

      // Resource Type filter check
      if (selectedResourceType !== 'All') {
        const courseRes = resources.filter((r) => r.courseId === c.id);
        const hasResourceType = courseRes.some((r) => r.resourceType === selectedResourceType);
        if (!hasResourceType) return false;
      }

      return true;
    });
  }, [courses, resources, selectedLevel, selectedSemester, selectedType, selectedResourceType, searchQuery]);

  // Derived resources for selected modal course
  const activeCourseResources = useMemo(() => {
    if (!selectedCourse) return [];
    let list = resources.filter((r) => r.courseId === selectedCourse.id);
    if (selectedResourceType !== 'All') {
      list = list.filter((r) => r.resourceType === selectedResourceType);
    }
    return list;
  }, [selectedCourse, resources, selectedResourceType]);



  // Counts per level for tabs
  const levelCounts = useMemo(() => {
    return {
      '100': courses.filter((c) => c.level === '100').length,
      '200': courses.filter((c) => c.level === '200').length,
      '300': courses.filter((c) => c.level === '300').length,
      '400': courses.filter((c) => c.level === '400').length,
      All: courses.length
    };
  }, [courses]);

  const getResourceTypeLabel = (type: string) => {
    switch (type) {
      case 'slide': return 'Lecture Slide';
      case 'note': return 'Lecture Note';
      case 'past_question': return 'Past Examination Question';
      case 'assignment': return 'Assignment / Tutorial';
      case 'tutorial': return 'Tutorial Guide';
      case 'video': return 'Educational Video';
      default: return 'Academic Resource';
    }
  };

  const getResourceTypeBadgeStyle = (type: string) => {
    switch (type) {
      case 'past_question':
        return 'bg-amber-500/15 text-[#F2B705] border-amber-500/30';
      case 'slide':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'note':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'video':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-[#F2B705] selection:text-[#003366]">
      {/* Header Banner */}
      <div className="relative bg-[#002244] border-b border-[#003366] text-white py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#001830] via-[#002244] to-[#003366] opacity-90" />
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <GraduationCap className="w-96 h-96 text-[#F2B705]" />
        </div>

        <div className="relative max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#003366]/80 text-[#F2B705] border border-[#F2B705]/40 text-xs font-bold font-mono uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>UPSA FITCS • UNDERGRADUATE ACADEMIC REPOSITORY</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            IT Learning Hub & Resource Repository
          </h1>

          <p className="max-w-3xl text-slate-300 text-sm sm:text-base leading-relaxed font-medium">
            Official academic repository for the <strong className="text-white">BSc Information Technology Management</strong> programme at the Department of Information Technology Studies, UPSA Accra. Access lecture slides, comprehensive notes, assignments, and past examination questions organized by academic level and semester.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Level Selector Cards Navigation */}
        <div className="space-y-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#F2B705]" />
            <span>Select Academic Level</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { level: '100', label: 'Level 100', subtitle: 'First Year' },
              { level: '200', label: 'Level 200', subtitle: 'Second Year' },
              { level: '300', label: 'Level 300', subtitle: 'Third Year' },
              { level: '400', label: 'Level 400', subtitle: 'Final Year' },
              { level: 'All', label: 'All Levels', subtitle: 'Full Curriculum' }
            ].map((item) => {
              const isSelected = selectedLevel === item.level;
              const count = levelCounts[item.level as keyof typeof levelCounts] || 0;
              return (
                <button
                  key={item.level}
                  onClick={() => setSelectedLevel(item.level)}
                  className={`p-4 rounded-xl text-left border transition-all relative overflow-hidden group ${
                    isSelected
                      ? 'bg-[#003366] border-[#F2B705] text-white shadow-xl shadow-[#003366]/40 ring-1 ring-[#F2B705]'
                      : 'bg-slate-900/80 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                  }`}
                >
                  <span className="text-sm font-extrabold block">{item.label}</span>
                  <span className="text-[11px] text-slate-400 block font-medium mt-0.5">{item.subtitle}</span>
                  <div className="mt-3 flex items-center justify-between text-[10px] font-bold">
                    <span className={isSelected ? 'text-[#F2B705]' : 'text-slate-500'}>
                      {count} Courses
                    </span>
                    {isSelected && <CheckCircle className="w-3.5 h-3.5 text-[#F2B705]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">

            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search by course code, title, or resource name (e.g. BITM104, Programming, Past Question)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs font-medium focus:outline-none focus:border-[#F2B705]"
              />
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              
              {/* Semester Filter */}
              <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Semester:</span>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="bg-transparent text-white font-bold focus:outline-none text-xs"
                >
                  <option value="All" className="bg-slate-900">All Semesters</option>
                  <option value="1" className="bg-slate-900">First Semester</option>
                  <option value="2" className="bg-slate-900">Second Semester</option>
                </select>
              </div>

              {/* Course Type Filter */}
              <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Type:</span>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-transparent text-white font-bold focus:outline-none text-xs"
                >
                  <option value="All" className="bg-slate-900">All Types</option>
                  <option value="required" className="bg-slate-900">Required</option>
                  <option value="elective" className="bg-slate-900">Elective</option>
                </select>
              </div>

              {/* Resource Type Filter */}
              <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="text-[10px] font-bold text-[#F2B705] uppercase">Resource Filter:</span>
                <select
                  value={selectedResourceType}
                  onChange={(e) => setSelectedResourceType(e.target.value)}
                  className="bg-transparent text-white font-bold focus:outline-none text-xs"
                >
                  <option value="All" className="bg-slate-900">All Resource Types</option>
                  <option value="past_question" className="bg-slate-900">Past Examination Questions</option>
                  <option value="slide" className="bg-slate-900">Lecture Slides</option>
                  <option value="note" className="bg-slate-900">Lecture Notes</option>
                  <option value="assignment" className="bg-slate-900">Assignments & Tutorials</option>
                  <option value="video" className="bg-slate-900">Educational Videos</option>
                  <option value="other" className="bg-slate-900">Other Academic Files</option>
                </select>
              </div>

            </div>

          </div>
        </div>

        {/* Results Info & Feedback Banner */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <div>
            Showing <strong className="text-white">{filteredCourses.length}</strong> undergraduate courses for{' '}
            <strong className="text-[#F2B705]">{selectedLevel === 'All' ? 'All Levels' : `Level ${selectedLevel}`}</strong>
            {selectedSemester !== 'All' && <span> • Semester {selectedSemester}</span>}
          </div>
        </div>

        {/* Courses Cards Grid */}
        {loading ? (
          <div className="p-16 text-center text-slate-400 space-y-3 bg-slate-900/40 rounded-2xl border border-slate-800">
            <div className="w-8 h-8 border-4 border-[#F2B705] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-300">Loading undergraduate course repository from Supabase...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-red-500/10 border border-red-500/30 rounded-2xl text-red-300 text-xs font-bold space-y-2">
            <AlertCircle className="w-6 h-6 mx-auto text-red-400" />
            <p>{error}</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="p-16 text-center text-slate-400 space-y-3 bg-slate-900/40 rounded-2xl border border-slate-800">
            <FolderOpen className="w-12 h-12 mx-auto text-slate-600 opacity-60" />
            <p className="text-sm font-bold text-slate-200">No courses match your active search and filter criteria.</p>
            <p className="text-xs text-slate-500">Try resetting your filters or selecting a different academic level.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCourses.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedCourse(c)}
                className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-[#003366] rounded-2xl p-5 shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="space-y-3">
                  
                  {/* Card Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-[#003366] text-[#F2B705] border border-[#F2B705]/40 font-mono font-black text-xs tracking-wider">
                      {c.courseCode}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold">
                        Level {c.level} • Sem {c.semester}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          c.courseType === 'required'
                            ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                            : 'bg-amber-500/15 text-[#F2B705] border border-amber-500/30'
                        }`}
                      >
                        {c.courseType}
                      </span>
                    </div>
                  </div>

                  {/* Course Title & Description */}
                  <div>
                    <h3 className="text-base font-extrabold text-white group-hover:text-[#F2B705] transition-colors leading-snug">
                      {c.title}
                    </h3>

                    {c.electiveGroup && (
                      <span className="inline-block mt-1 text-[10px] font-mono text-amber-400/90 font-bold bg-amber-500/10 px-2 py-0.5 rounded">
                        Group: {c.electiveGroup}
                      </span>
                    )}

                    {c.description && (
                      <p className="text-slate-400 text-xs mt-2 line-clamp-2 leading-relaxed">
                        {c.description}
                      </p>
                    )}
                  </div>

                </div>

                {/* Card Bottom Meta Bar */}
                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                    <span className="font-extrabold text-[#F2B705]">{c.creditHours} Credits</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-bold text-slate-300">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>{c.resourceCount || 0} Resources</span>
                    </span>
                  </div>

                  <span className="text-xs font-extrabold text-[#00AEEF] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>Explore</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-2xl text-white my-8 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-[#003366] text-[#F2B705] border border-[#F2B705]/40 font-mono font-black text-sm">
                    {selectedCourse.courseCode}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-bold">
                    Level {selectedCourse.level} • Semester {selectedCourse.semester}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-[#F2B705]/20 text-[#F2B705] border border-[#F2B705]/40 text-xs font-extrabold">
                    {selectedCourse.creditHours} Credits
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold uppercase">
                    {selectedCourse.courseType}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {selectedCourse.title}
                </h2>
                <p className="text-slate-400 text-xs">
                  Programme: <strong className="text-slate-200">{selectedCourse.programme}</strong>
                </p>
              </div>

              <button
                onClick={() => setSelectedCourse(null)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold transition-colors shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Course Description */}
            {selectedCourse.description && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-xs text-slate-300 space-y-1">
                <span className="text-[10px] font-extrabold text-[#F2B705] uppercase tracking-wider block">Course Overview</span>
                <p className="leading-relaxed">{selectedCourse.description}</p>
              </div>
            )}

            {/* Academic Resources List Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#F2B705]" />
                  <span>Available Academic Learning Resources ({activeCourseResources.length})</span>
                </h3>
              </div>

              {activeCourseResources.length === 0 ? (
                <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800/80 text-slate-400 text-xs space-y-2">
                  <FolderOpen className="w-8 h-8 mx-auto text-slate-600 opacity-60" />
                  <p className="font-bold text-slate-300">No learning resources have been uploaded for this course yet.</p>
                  <p className="text-[11px] text-slate-500">Course resources and past questions will be made available by department lecturers.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {activeCourseResources.map((res) => {
                    const hasUrl = Boolean(res.fileUrl || res.externalUrl || res.filePath);
                    const targetUrl = res.fileUrl || res.externalUrl || res.filePath || '#';

                    return (
                      <div
                        key={res.id}
                        className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${getResourceTypeBadgeStyle(
                                res.resourceType
                              )}`}
                            >
                              {getResourceTypeLabel(res.resourceType)}
                            </span>

                            {res.resourceYear && (
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] font-bold flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-[#F2B705]" />
                                <span>{res.resourceYear}</span>
                              </span>
                            )}

                            {res.duration && (
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] flex items-center gap-1">
                                <Clock className="w-3 h-3 text-purple-400" />
                                <span>{res.duration}</span>
                              </span>
                            )}
                          </div>

                          <h4 className="text-sm font-extrabold text-white">{res.title}</h4>

                          {res.description && (
                            <p className="text-slate-400 text-xs leading-relaxed">{res.description}</p>
                          )}
                        </div>

                        {/* Action Link / Button */}
                        <div className="shrink-0">
                          {hasUrl ? (
                            <a
                              href={targetUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 rounded-lg bg-[#003366] hover:bg-blue-900 text-white font-extrabold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-colors border border-[#F2B705]/30 shadow-sm"
                            >
                              <span>Access File</span>
                              <ExternalLink className="w-3.5 h-3.5 text-[#F2B705]" />
                            </a>
                          ) : (
                            <span className="px-3 py-1.5 rounded bg-slate-800 text-slate-500 text-[11px] font-bold inline-block">
                              File Unavailable
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">
                Department of Information Technology Studies • UPSA
              </span>
              <button
                onClick={() => setSelectedCourse(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
