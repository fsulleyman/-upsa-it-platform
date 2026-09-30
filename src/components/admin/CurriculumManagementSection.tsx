import React, { useState, useMemo } from 'react';
import { useCourses } from '../../hooks/useCourses';
import type { Course, CourseType } from '../../types';
import { AdminPageHeader } from './ui/AdminPageHeader';
import { DataTable } from './ui/DataTable';
import type { Column } from './ui/DataTable';
import { StatusBadge } from './ui/StatusBadge';
import { FormInput, FormSelect, FormTextarea, FormToggle } from './ui/FormField';
import { Modal } from './ui/Modal';
import { ConfirmDialog } from './ui/ConfirmDialog';
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  RefreshCw
} from 'lucide-react';

export const CurriculumManagementSection: React.FC = () => {
  const {
    courses,
    loading,
    saveCourse,
    toggleCourseStatus,
    deleteCourse
  } = useCourses();

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('All');
  const [semesterFilter, setSemesterFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);
  const [detailCourse, setDetailCourse] = useState<Course | null>(null);
  const [deleteConfirmCourse, setDeleteConfirmCourse] = useState<Course | null>(null);

  // Submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtered courses computation
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const query = searchQuery.trim().toLowerCase();
      if (query) {
        const matchesCode = c.courseCode.toLowerCase().includes(query);
        const matchesTitle = c.title.toLowerCase().includes(query);
        if (!matchesCode && !matchesTitle) return false;
      }

      if (levelFilter !== 'All' && c.level !== levelFilter) return false;
      if (semesterFilter !== 'All' && c.semester !== semesterFilter) return false;
      if (typeFilter !== 'All' && c.courseType !== typeFilter) return false;

      return true;
    });
  }, [courses, searchQuery, levelFilter, semesterFilter, typeFilter]);

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

  const handleOpenEdit = (course: Course) => {
    setEditingCourse({ ...course });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse?.courseCode || !editingCourse?.title) {
      alert('Course Code and Title are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      await saveCourse(editingCourse);
      setIsModalOpen(false);
      setEditingCourse(null);
    } catch (err: any) {
      alert(err.message || 'Failed to save course');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (course: Course) => {
    try {
      await toggleCourseStatus(course.id, course.isActive);
    } catch (err: any) {
      alert(err.message || 'Failed to update course status');
    }
  };

  const handleDeleteExecute = async () => {
    if (!deleteConfirmCourse) return;
    try {
      await deleteCourse(deleteConfirmCourse.id);
    } catch (err: any) {
      alert(err.message || 'Failed to delete course');
    } finally {
      setDeleteConfirmCourse(null);
    }
  };

  const columns: Column<Course>[] = [
    {
      header: 'Course Code & Title',
      accessor: (row) => (
        <div className="space-y-0.5">
          <div className="font-bold text-white flex items-center gap-2">
            <span className="font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
              {row.courseCode}
            </span>
            <span className="truncate max-w-xs">{row.title}</span>
          </div>
          {row.description && (
            <p className="text-[11px] text-slate-400 truncate max-w-md">{row.description}</p>
          )}
        </div>
      )
    },
    {
      header: 'Level / Semester',
      accessor: (row) => (
        <div className="text-slate-300 font-mono text-xs">
          Level {row.level} • Sem {row.semester}
        </div>
      )
    },
    {
      header: 'Credits',
      accessor: (row) => (
        <span className="font-mono text-slate-300">{row.creditHours} hrs</span>
      )
    },
    {
      header: 'Type',
      accessor: (row) => (
        <StatusBadge
          variant={row.courseType === 'required' ? 'required' : 'elective'}
          label={row.courseType === 'required' ? 'Required' : 'Elective'}
          size="sm"
        />
      )
    },
    {
      header: 'Status',
      accessor: (row) => (
        <StatusBadge
          variant={row.isActive ? 'active' : 'inactive'}
          label={row.isActive ? 'Active' : 'Inactive'}
          size="sm"
        />
      )
    },
    {
      header: 'Actions',
      headerClassName: 'text-right',
      className: 'text-right',
      accessor: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDetailCourse(row);
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenEdit(row);
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 transition-colors"
            title="Edit Course"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleStatus(row);
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 transition-colors"
            title={row.isActive ? 'Deactivate' : 'Activate'}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteConfirmCourse(row);
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 hover:text-rose-300 transition-colors"
            title="Delete Course"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Curriculum & Course Management"
        description="Manage undergraduate and diploma courses, credit hours, semester allocations, and elective requirements."
        badge={`${courses.length} Courses Total`}
      >
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Course</span>
        </button>
      </AdminPageHeader>

      {/* Filter Bar Above Table */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative lg:col-span-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by code or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Levels</option>
            <option value="100">Level 100</option>
            <option value="200">Level 200</option>
            <option value="300">Level 300</option>
            <option value="400">Level 400</option>
          </select>

          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Semesters</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Types</option>
            <option value="required">Required</option>
            <option value="elective">Elective</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredCourses}
        loading={loading}
        keyExtractor={(item) => item.id}
        emptyMessage="No courses found"
        emptySubtext="Adjust your search filters or click 'Add Course' to create a new curriculum course entry."
        emptyIcon={<BookOpen className="w-6 h-6 text-slate-400" />}
      />

      {/* Add / Edit Course Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCourse?.id ? 'Edit Curriculum Course' : 'Create New Course'}
        description="Configure course metadata, academic level, credit hours, and elective group requirements."
        maxWidth="lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="course-form"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Course'}
            </button>
          </>
        }
      >
        <form id="course-form" onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Course Code"
              required
              placeholder="e.g. BITM 101"
              value={editingCourse?.courseCode || ''}
              onChange={(e) => setEditingCourse({ ...editingCourse, courseCode: e.target.value })}
            />
            <FormInput
              label="Course Title"
              required
              placeholder="e.g. Programming Fundamentals"
              value={editingCourse?.title || ''}
              onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormSelect
              label="Academic Level"
              required
              options={[
                { value: '100', label: 'Level 100' },
                { value: '200', label: 'Level 200' },
                { value: '300', label: 'Level 300' },
                { value: '400', label: 'Level 400' }
              ]}
              value={editingCourse?.level || '100'}
              onChange={(e) => setEditingCourse({ ...editingCourse, level: e.target.value })}
            />

            <FormSelect
              label="Semester"
              required
              options={[
                { value: '1', label: 'Semester 1' },
                { value: '2', label: 'Semester 2' }
              ]}
              value={editingCourse?.semester || '1'}
              onChange={(e) => setEditingCourse({ ...editingCourse, semester: e.target.value })}
            />

            <FormInput
              label="Credit Hours"
              type="number"
              min={1}
              max={6}
              required
              value={editingCourse?.creditHours || 3}
              onChange={(e) =>
                setEditingCourse({ ...editingCourse, creditHours: parseInt(e.target.value) || 3 })
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormSelect
              label="Course Type"
              required
              options={[
                { value: 'required', label: 'Required Course' },
                { value: 'elective', label: 'Elective Course' }
              ]}
              value={editingCourse?.courseType || 'required'}
              onChange={(e) =>
                setEditingCourse({ ...editingCourse, courseType: e.target.value as CourseType })
              }
            />

            <FormInput
              label="Elective Group (Optional)"
              placeholder="e.g. LEVEL400_SEM1_ELECTIVE"
              value={editingCourse?.electiveGroup || ''}
              onChange={(e) => setEditingCourse({ ...editingCourse, electiveGroup: e.target.value })}
            />
          </div>

          <FormTextarea
            label="Course Description"
            rows={3}
            placeholder="Overview of learning outcomes..."
            value={editingCourse?.description || ''}
            onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
          />

          <FormToggle
            label="Active in Student Learning Hub"
            description="If active, this course displays in the public curriculum list"
            checked={editingCourse?.isActive ?? true}
            onChange={(checked) => setEditingCourse({ ...editingCourse, isActive: checked })}
          />
        </form>
      </Modal>

      {/* Course Detail View Modal */}
      <Modal
        isOpen={Boolean(detailCourse)}
        onClose={() => setDetailCourse(null)}
        title={detailCourse ? `${detailCourse.courseCode} — ${detailCourse.title}` : ''}
        maxWidth="lg"
        footer={
          <button
            type="button"
            onClick={() => setDetailCourse(null)}
            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-medium text-xs hover:bg-slate-700"
          >
            Close
          </button>
        }
      >
        {detailCourse && (
          <div className="space-y-4 text-xs">
            <div className="flex flex-wrap gap-2">
              <StatusBadge
                variant={detailCourse.courseType === 'required' ? 'required' : 'elective'}
                label={detailCourse.courseType === 'required' ? 'Required Course' : 'Elective Course'}
              />
              <StatusBadge
                variant={detailCourse.isActive ? 'active' : 'inactive'}
                label={detailCourse.isActive ? 'Active' : 'Inactive'}
              />
              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                Level {detailCourse.level} • Semester {detailCourse.semester}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                {detailCourse.creditHours} Credit Hours
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-semibold block">Description</span>
              <p className="text-slate-200 leading-relaxed">
                {detailCourse.description || 'No description provided for this course.'}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteConfirmCourse)}
        onClose={() => setDeleteConfirmCourse(null)}
        onConfirm={handleDeleteExecute}
        title="Delete Curriculum Course"
        message={
          deleteConfirmCourse
            ? `Are you sure you want to delete course ${deleteConfirmCourse.courseCode} (${deleteConfirmCourse.title})?`
            : ''
        }
        confirmLabel="Delete Course"
      />
    </div>
  );
};
