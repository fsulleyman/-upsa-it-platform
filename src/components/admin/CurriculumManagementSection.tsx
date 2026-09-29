import React, { useState, useMemo } from 'react';
import { useCourses } from '../../hooks/useCourses';
import type { Course, CourseType } from '../../types';
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Archive,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  GraduationCap
} from 'lucide-react';

export const CurriculumManagementSection: React.FC = () => {
  const {
    courses,
    loading,
    error,
    refreshCourses,
    saveCourse,
    toggleCourseStatus,
    deleteCourse
  } = useCourses();

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('All');
  const [semesterFilter, setSemesterFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);
  const [detailCourse, setDetailCourse] = useState<Course | null>(null);
  const [deleteConfirmCourse, setDeleteConfirmCourse] = useState<Course | null>(null);

  // Status notifications
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotice({ type, message });
    setTimeout(() => setNotice(null), 4000);
  };

  // Filtered courses computation
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      // Search check
      const query = searchQuery.trim().toLowerCase();
      if (query) {
        const matchesCode = c.courseCode.toLowerCase().includes(query);
        const matchesTitle = c.title.toLowerCase().includes(query);
        if (!matchesCode && !matchesTitle) return false;
      }

      // Level check
      if (levelFilter !== 'All' && c.level !== levelFilter) return false;

      // Semester check
      if (semesterFilter !== 'All' && c.semester !== semesterFilter) return false;

      // Type check
      if (typeFilter !== 'All' && c.courseType !== typeFilter) return false;

      // Status check
      if (statusFilter === 'Active' && !c.isActive) return false;
      if (statusFilter === 'Inactive' && c.isActive) return false;

      return true;
    });
  }, [courses, searchQuery, levelFilter, semesterFilter, typeFilter, statusFilter]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = courses.length;
    const required = courses.filter((c) => c.courseType === 'required').length;
    const elective = courses.filter((c) => c.courseType === 'elective').length;
    const l100 = courses.filter((c) => c.level === '100').length;
    const l200 = courses.filter((c) => c.level === '200').length;
    const l300 = courses.filter((c) => c.level === '300').length;
    const l400 = courses.filter((c) => c.level === '400').length;

    return { total, required, elective, l100, l200, l300, l400 };
  }, [courses]);

  // Handle open Add Modal
  const handleOpenAdd = () => {
    setEditingCourse({
      courseCode: '',
      title: '',
      description: '',
      level: levelFilter !== 'All' ? levelFilter : '100',
      semester: semesterFilter !== 'All' ? semesterFilter : '1',
      creditHours: 3,
      courseType: 'required',
      electiveGroup: '',
      programme: 'BSc Information Technology Management',
      displayOrder: (courses.length + 1) * 10,
      isActive: true
    });
    setIsModalOpen(true);
  };

  // Handle open Edit Modal
  const handleOpenEdit = (course: Course) => {
    setEditingCourse({ ...course });
    setIsModalOpen(true);
  };

  // Handle form submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse?.courseCode || !editingCourse?.title) {
      showNotification('Course Code and Title are required.', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      await saveCourse(editingCourse);
      setIsModalOpen(false);
      setEditingCourse(null);
      showNotification(
        `Course ${editingCourse.courseCode} ${editingCourse.id ? 'updated' : 'created'} successfully!`
      );
    } catch (err: any) {
      showNotification(err.message || 'Failed to save course.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle status toggle
  const handleToggleStatus = async (course: Course) => {
    try {
      await toggleCourseStatus(course.id, course.isActive);
      showNotification(
        `Course ${course.courseCode} ${course.isActive ? 'archived' : 'reactivated'} successfully!`
      );
    } catch (err: any) {
      showNotification(err.message || 'Failed to update course status.', 'error');
    }
  };

  // Handle delete execution
  const handleConfirmDelete = async () => {
    if (!deleteConfirmCourse) return;
    try {
      setIsSubmitting(true);
      await deleteCourse(deleteConfirmCourse.id);
      showNotification(`Course ${deleteConfirmCourse.courseCode} deleted successfully.`);
      setDeleteConfirmCourse(null);
    } catch (err: any) {
      showNotification(err.message || 'Failed to delete course.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/80 p-5 rounded-xl border border-slate-700 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-[#F2B705]" />
            <h2 className="text-xl font-black text-white uppercase tracking-tight">
              Undergraduate Curriculum Management
            </h2>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Database-backed course configuration for BSc Information Technology Management
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refreshCourses()}
            className="p-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
            title="Refresh Curriculum Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-lg bg-[#003366] hover:bg-blue-900 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md border border-[#F2B705]/30"
          >
            <Plus className="w-4 h-4 text-[#F2B705]" />
            <span>Add New Course</span>
          </button>
        </div>
      </div>

      {/* Notifications Banner */}
      {notice && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex items-center gap-3 border ${
            notice.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
              : 'bg-red-500/10 border-red-500/40 text-red-300'
          }`}
        >
          {notice.type === 'success' ? (
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          )}
          <span>{notice.message}</span>
        </div>
      )}

      {/* Summary Analytics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Courses</span>
          <span className="text-xl font-black text-white mt-1 block">{stats.total}</span>
        </div>
        <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Required</span>
          <span className="text-xl font-black text-[#00AEEF] mt-1 block">{stats.required}</span>
        </div>
        <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Electives</span>
          <span className="text-xl font-black text-[#F2B705] mt-1 block">{stats.elective}</span>
        </div>
        <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Level 100</span>
          <span className="text-xl font-black text-slate-200 mt-1 block">{stats.l100}</span>
        </div>
        <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Level 200</span>
          <span className="text-xl font-black text-slate-200 mt-1 block">{stats.l200}</span>
        </div>
        <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Level 300</span>
          <span className="text-xl font-black text-slate-200 mt-1 block">{stats.l300}</span>
        </div>
        <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Level 400</span>
          <span className="text-xl font-black text-slate-200 mt-1 block">{stats.l400}</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by course code or title (e.g. BITM104)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-[#003366] text-xs font-medium"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Level Filter */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-[#003366]"
          >
            <option value="All">All Levels</option>
            <option value="100">Level 100</option>
            <option value="200">Level 200</option>
            <option value="300">Level 300</option>
            <option value="400">Level 400</option>
          </select>

          {/* Semester Filter */}
          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-[#003366]"
          >
            <option value="All">All Semesters</option>
            <option value="1">First Semester</option>
            <option value="2">Second Semester</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-[#003366]"
          >
            <option value="All">All Types</option>
            <option value="required">Required</option>
            <option value="elective">Elective</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-[#003366]"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Courses Data Table */}
      <div className="bg-slate-800/60 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-medium flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-[#F2B705]" />
            <span>Loading undergraduate curriculum from database...</span>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-400 text-xs font-bold flex items-center justify-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>Database Error: {error}</span>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs space-y-2">
            <BookOpen className="w-8 h-8 mx-auto text-slate-500 opacity-60" />
            <p className="font-bold text-slate-300">No courses match the selected filters.</p>
            <p className="text-[11px] text-slate-500">Try adjusting your search query or filter settings.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-700">
                <tr>
                  <th className="px-4 py-3.5">Code</th>
                  <th className="px-4 py-3.5">Course Title</th>
                  <th className="px-4 py-3.5 text-center">Level</th>
                  <th className="px-4 py-3.5 text-center">Semester</th>
                  <th className="px-4 py-3.5 text-center">Credits</th>
                  <th className="px-4 py-3.5">Type & Elective Group</th>
                  <th className="px-4 py-3.5 text-center">Resources</th>
                  <th className="px-4 py-3.5 text-center">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {filteredCourses.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/80 transition-colors">
                    <td className="px-4 py-3.5 font-extrabold text-white font-mono">
                      {c.courseCode}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-100 max-w-xs truncate">
                      {c.title}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 font-bold text-[10px]">
                        L{c.level}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 font-bold text-[10px]">
                        Sem {c.semester}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center font-extrabold text-[#F2B705]">
                      {c.creditHours}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="space-y-1">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            c.courseType === 'required'
                              ? 'bg-[#003366]/60 text-[#00AEEF] border border-[#00AEEF]/30'
                              : 'bg-amber-500/20 text-[#F2B705] border border-amber-500/30'
                          }`}
                        >
                          {c.courseType}
                        </span>
                        {c.electiveGroup && (
                          <span className="block text-[9px] font-mono text-slate-400">
                            {c.electiveGroup}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center font-extrabold">
                      <span className="px-2.5 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-700 text-[10px]">
                        {c.resourceCount || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          c.isActive
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-700 text-slate-400 border border-slate-600'
                        }`}
                      >
                        {c.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setDetailCourse(c)}
                          className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="View Full Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Edit Course"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(c)}
                          className={`p-1.5 rounded transition-colors ${
                            c.isActive
                              ? 'hover:bg-amber-500/20 text-slate-400 hover:text-[#F2B705]'
                              : 'hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400'
                          }`}
                          title={c.isActive ? 'Archive Course' : 'Reactivate Course'}
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmCourse(c)}
                          className="p-1.5 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                          title="Delete Course"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Course Modal */}
      {isModalOpen && editingCourse && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl text-white my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-4">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#F2B705]" />
                <span>{editingCourse.id ? 'Edit Curriculum Course' : 'Add New Curriculum Course'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Course Code <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BITM104"
                    value={editingCourse.courseCode || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, courseCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-[#003366]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Course Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Programming Fundamentals"
                    value={editingCourse.title || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold focus:outline-none focus:border-[#003366]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Academic Level</label>
                  <select
                    value={editingCourse.level || '100'}
                    onChange={(e) => setEditingCourse({ ...editingCourse, level: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold focus:outline-none focus:border-[#003366]"
                  >
                    <option value="100">Level 100</option>
                    <option value="200">Level 200</option>
                    <option value="300">Level 300</option>
                    <option value="400">Level 400</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Semester</label>
                  <select
                    value={editingCourse.semester || '1'}
                    onChange={(e) => setEditingCourse({ ...editingCourse, semester: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold focus:outline-none focus:border-[#003366]"
                  >
                    <option value="1">First Semester</option>
                    <option value="2">Second Semester</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Credit Hours</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={editingCourse.creditHours ?? 3}
                    onChange={(e) => setEditingCourse({ ...editingCourse, creditHours: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold focus:outline-none focus:border-[#003366]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Course Type</label>
                  <select
                    value={editingCourse.courseType || 'required'}
                    onChange={(e) =>
                      setEditingCourse({
                        ...editingCourse,
                        courseType: e.target.value as CourseType
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold focus:outline-none focus:border-[#003366]"
                  >
                    <option value="required">Required</option>
                    <option value="elective">Elective</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Elective Group {editingCourse.courseType === 'elective' && <span className="text-amber-400">*</span>}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. LEVEL400_SEM1_ELECTIVE"
                    disabled={editingCourse.courseType !== 'elective'}
                    value={editingCourse.electiveGroup || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, electiveGroup: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-[#003366] disabled:opacity-40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Degree Programme</label>
                <input
                  type="text"
                  value={editingCourse.programme || 'BSc Information Technology Management'}
                  onChange={(e) => setEditingCourse({ ...editingCourse, programme: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-medium focus:outline-none focus:border-[#003366]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Course Description</label>
                <textarea
                  rows={3}
                  placeholder="Enter detailed syllabus summary or learning outcomes..."
                  value={editingCourse.description || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#003366]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingCourse.displayOrder ?? 0}
                    onChange={(e) => setEditingCourse({ ...editingCourse, displayOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold focus:outline-none focus:border-[#003366]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isActiveCheck"
                    checked={editingCourse.isActive ?? true}
                    onChange={(e) => setEditingCourse({ ...editingCourse, isActive: e.target.checked })}
                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-[#003366]"
                  />
                  <label htmlFor="isActiveCheck" className="text-slate-200 font-bold cursor-pointer">
                    Course is Active (Visible in Public Learning Hub)
                  </label>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-[#003366] hover:bg-blue-900 text-white font-extrabold uppercase tracking-wider transition-colors shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Course Detail Modal */}
      {detailCourse && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#F2B705]" />
                <span className="font-extrabold text-base">{detailCourse.courseCode} Details</span>
              </div>
              <button
                onClick={() => setDetailCourse(null)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block font-bold text-[10px] uppercase">Title</span>
                <span className="text-white text-sm font-black">{detailCourse.title}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-700">
                <div>
                  <span className="text-slate-400 block font-bold text-[10px] uppercase">Level & Semester</span>
                  <span className="text-slate-200 font-bold">
                    Level {detailCourse.level} • Sem {detailCourse.semester}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold text-[10px] uppercase">Credits & Type</span>
                  <span className="text-[#F2B705] font-extrabold">
                    {detailCourse.creditHours} Credits ({detailCourse.courseType})
                  </span>
                </div>
              </div>

              {detailCourse.electiveGroup && (
                <div>
                  <span className="text-slate-400 block font-bold text-[10px] uppercase">Elective Group</span>
                  <span className="font-mono text-amber-300 font-bold">{detailCourse.electiveGroup}</span>
                </div>
              )}

              <div>
                <span className="text-slate-400 block font-bold text-[10px] uppercase">Programme</span>
                <span className="text-slate-200 font-medium">{detailCourse.programme}</span>
              </div>

              {detailCourse.description && (
                <div>
                  <span className="text-slate-400 block font-bold text-[10px] uppercase">Description</span>
                  <p className="text-slate-300 bg-slate-900/40 p-2.5 rounded-lg border border-slate-700/60 leading-relaxed">
                    {detailCourse.description}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400 border-t border-slate-700">
                <span>Associated Resources: <strong className="text-white">{detailCourse.resourceCount || 0}</strong></span>
                <span>Status: <strong className={detailCourse.isActive ? 'text-emerald-400' : 'text-slate-400'}>{detailCourse.isActive ? 'Active' : 'Inactive'}</strong></span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-700 text-right">
              <button
                onClick={() => setDetailCourse(null)}
                className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmCourse && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-800 border border-red-500/40 rounded-2xl p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-extrabold text-white">Confirm Course Deletion</h3>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed">
              Are you sure you want to permanently delete course <strong className="text-white font-mono">{deleteConfirmCourse.courseCode} — {deleteConfirmCourse.title}</strong>?
            </p>
            <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg text-[11px] text-red-300 font-medium">
              ⚠️ Warning: Any learning resources associated with this course may be permanently orphaned or removed. Consider <strong>Archiving</strong> instead.
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmCourse(null)}
                className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
