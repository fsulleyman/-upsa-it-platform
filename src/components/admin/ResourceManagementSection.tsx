import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { logAdminActivity } from '../../lib/activityLogger';
import {
  uploadLearningResourceFile,
  replaceLearningResourceFile,
  deleteLearningResourceFile,
  validateResourceFile
} from '../../utils/resourceStorage';
import type { Course, LearningResource, ResourceType } from '../../types';
import { AdminPageHeader } from './ui/AdminPageHeader';
import { DataTable } from './ui/DataTable';
import type { Column } from './ui/DataTable';
import { StatusBadge } from './ui/StatusBadge';
import { FormInput, FormSelect, FormTextarea, FormToggle } from './ui/FormField';
import { Modal } from './ui/Modal';
import { ConfirmDialog } from './ui/ConfirmDialog';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  FileText,
  Calendar,
  FolderOpen
} from 'lucide-react';

export const ResourceManagementSection: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter Toolbar States
  const [filterLevel, setFilterLevel] = useState<string>('All');
  const [filterResourceType, setFilterResourceType] = useState<string>('All');
  const [filterPublished, setFilterPublished] = useState<string>('All');
  const [filterSearch, setFilterSearch] = useState<string>('');

  // Edit / Add Modal States
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingResource, setEditingResource] = useState<Partial<LearningResource> | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Delete Confirmation State
  const [deleteResourceTarget, setDeleteResourceTarget] = useState<LearningResource | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data: coursesData, error: coursesErr } = await supabase
        .from('courses')
        .select('*')
        .order('level', { ascending: true })
        .order('semester', { ascending: true })
        .order('display_order', { ascending: true });

      if (coursesErr) throw coursesErr;

      const mappedCourses: Course[] = (coursesData || []).map((c) => ({
        id: c.id,
        courseCode: c.course_code,
        title: c.title,
        description: c.description || '',
        level: c.level || '100',
        semester: c.semester || '1',
        creditHours: c.credit_hours ?? 3,
        courseOutlineUrl: c.course_outline_url || '',
        displayOrder: c.display_order ?? 0,
        isActive: c.is_active ?? true,
        courseType: c.course_type || 'required',
        electiveGroup: c.elective_group || null,
        programme: c.programme || 'BSc Information Technology Management',
        academicYear: c.academic_year || null,
        createdBy: c.created_by || null,
        updatedBy: c.updated_by || null,
        createdAt: c.created_at,
        updatedAt: c.updated_at
      }));

      setCourses(mappedCourses);

      const { data: resourcesData, error: resErr } = await supabase
        .from('learning_resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (resErr) throw resErr;

      const mappedResources: LearningResource[] = (resourcesData || []).map((r) => ({
        id: r.id,
        courseId: r.course_id,
        title: r.title,
        description: r.description || '',
        resourceType: (r.resource_type as ResourceType) || 'slide',
        fileUrl: r.file_url || '',
        filePath: r.file_path || '',
        externalUrl: r.external_url || '',
        academicYear: r.academic_year || '',
        resourceYear: r.resource_year || undefined,
        duration: r.duration || '',
        isPublished: r.is_published ?? true,
        displayOrder: r.display_order ?? 0,
        createdBy: r.created_by || undefined,
        updatedBy: r.updated_by || undefined,
        createdAt: r.created_at,
        updatedAt: r.updated_at
      }));

      setResources(mappedResources);
    } catch (err: any) {
      console.warn('Notice loading resources:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const courseMap = useMemo(() => {
    const map = new Map<string, Course>();
    courses.forEach((c) => map.set(c.id, c));
    return map;
  }, [courses]);

  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      const course = courseMap.get(res.courseId);

      if (filterLevel !== 'All') {
        if (!course || course.level !== filterLevel) return false;
      }

      if (filterResourceType !== 'All' && res.resourceType !== filterResourceType) return false;

      if (filterPublished === 'Published' && !res.isPublished) return false;
      if (filterPublished === 'Draft' && res.isPublished) return false;

      if (filterSearch.trim()) {
        const query = filterSearch.trim().toLowerCase();
        const titleMatch = res.title.toLowerCase().includes(query);
        const codeMatch = course ? course.courseCode.toLowerCase().includes(query) : false;
        const descMatch = res.description ? res.description.toLowerCase().includes(query) : false;
        if (!titleMatch && !codeMatch && !descMatch) return false;
      }

      return true;
    });
  }, [resources, courseMap, filterLevel, filterResourceType, filterPublished, filterSearch]);

  const handleOpenAddModal = () => {
    setEditingResource({
      courseId: courses.length > 0 ? courses[0].id : '',
      title: '',
      description: '',
      resourceType: 'slide',
      fileUrl: '',
      filePath: '',
      externalUrl: '',
      academicYear: '2025/2026',
      resourceYear: new Date().getFullYear(),
      duration: '',
      isPublished: true,
      displayOrder: 0
    });
    setSelectedFile(null);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (resource: LearningResource) => {
    setEditingResource({ ...resource });
    setSelectedFile(null);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validationErr = validateResourceFile(file);
      if (validationErr) {
        setModalError(validationErr);
        setSelectedFile(null);
      } else {
        setModalError(null);
        setSelectedFile(file);
      }
    }
  };

  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!editingResource?.courseId || !editingResource?.title) {
      setModalError('Target Course and Resource Title are required.');
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setModalError('Supabase is not configured.');
      return;
    }

    setIsSaving(true);

    try {
      let finalFileUrl = editingResource.fileUrl || '';
      let finalFilePath = editingResource.filePath || '';

      const targetCourse = courseMap.get(editingResource.courseId);
      const courseCode = targetCourse ? targetCourse.courseCode : 'COURSE';
      const level = targetCourse ? targetCourse.level : '100';
      const semester = targetCourse ? targetCourse.semester : '1';

      if (selectedFile) {
        if (editingResource.filePath) {
          const replaceRes = await replaceLearningResourceFile(
            editingResource.filePath,
            selectedFile,
            courseCode,
            level,
            semester,
            editingResource.resourceType || 'slide'
          );
          if (replaceRes.error || !replaceRes.publicUrl) {
            throw new Error(replaceRes.error || 'Failed to replace file in storage.');
          }
          finalFileUrl = replaceRes.publicUrl;
          finalFilePath = replaceRes.path || '';
        } else {
          const uploadRes = await uploadLearningResourceFile(
            selectedFile,
            courseCode,
            level,
            semester,
            editingResource.resourceType || 'slide'
          );
          if (uploadRes.error || !uploadRes.publicUrl) {
            throw new Error(uploadRes.error || 'Failed to upload file to storage.');
          }
          finalFileUrl = uploadRes.publicUrl;
          finalFilePath = uploadRes.path || '';
        }
      }

      const payload = {
        ...(editingResource.id ? { id: editingResource.id } : {}),
        course_id: editingResource.courseId,
        title: editingResource.title.trim(),
        description: editingResource.description ? editingResource.description.trim() : null,
        resource_type: editingResource.resourceType || 'slide',
        file_url: finalFileUrl || null,
        file_path: finalFilePath || null,
        external_url: editingResource.externalUrl ? editingResource.externalUrl.trim() : null,
        academic_year: editingResource.academicYear ? editingResource.academicYear.trim() : null,
        resource_year: editingResource.resourceYear || null,
        duration: editingResource.duration ? editingResource.duration.trim() : null,
        is_published: editingResource.isPublished ?? true,
        display_order: editingResource.displayOrder ?? 0,
        updated_at: new Date().toISOString()
      };

      const { data, error: upsertErr } = await supabase
        .from('learning_resources')
        .upsert(payload)
        .select('*')
        .single();

      if (upsertErr) throw upsertErr;

      await logAdminActivity({
        action: editingResource.id ? 'UPDATE' : 'CREATE',
        resourceType: 'Learning Resource',
        resourceId: data.id,
        description: `Saved resource "${editingResource.title}" for course ${editingResource.courseId}`
      });

      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      setModalError(err.message || 'Error saving resource.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublish = async (resource: LearningResource) => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const newStatus = !resource.isPublished;
      const { error: err } = await supabase
        .from('learning_resources')
        .update({ is_published: newStatus, updated_at: new Date().toISOString() })
        .eq('id', resource.id);

      if (err) throw err;

      await logAdminActivity({
        action: newStatus ? 'PUBLISH' : 'UNPUBLISH',
        resourceType: 'Learning Resource',
        resourceId: resource.id,
        description: `Changed publication status to ${newStatus ? 'Published' : 'Draft'}`
      });

      fetchData();
    } catch (err: any) {
      alert(`Error toggling status: ${err.message}`);
    }
  };

  const handleDeleteResourceExecute = async () => {
    if (!deleteResourceTarget || !isSupabaseConfigured || !supabase) return;
    try {
      if (deleteResourceTarget.filePath) {
        await deleteLearningResourceFile(deleteResourceTarget.filePath);
      }

      const { error: delErr } = await supabase
        .from('learning_resources')
        .delete()
        .eq('id', deleteResourceTarget.id);

      if (delErr) throw delErr;

      await logAdminActivity({
        action: 'DELETE',
        resourceType: 'Learning Resource',
        resourceId: deleteResourceTarget.id,
        description: `Deleted learning resource "${deleteResourceTarget.title}"`
      });

      fetchData();
    } catch (err: any) {
      alert(`Error deleting resource: ${err.message}`);
    } finally {
      setDeleteResourceTarget(null);
    }
  };

  const getResourceTypeLabel = (type: ResourceType) => {
    switch (type) {
      case 'past_question':
        return 'Past Question';
      case 'slide':
        return 'Lecture Slide';
      case 'note':
        return 'Lecture Handout';
      case 'assignment':
        return 'Lab Manual';
      case 'tutorial':
        return 'Tutorial Guide';
      case 'video':
        return 'Video Link';
      case 'other':
      default:
        return 'Other Material';
    }
  };

  const columns: Column<LearningResource>[] = [
    {
      header: 'Course Code & Title',
      accessor: (row) => {
        const course = courseMap.get(row.courseId);
        return (
          <div className="space-y-0.5">
            {course ? (
              <>
                <div className="font-bold text-white flex items-center gap-2">
                  <span className="font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    {course.courseCode}
                  </span>
                  <span className="truncate max-w-xs">{course.title}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Level {course.level} • Semester {course.semester}
                </div>
              </>
            ) : (
              <span className="text-rose-400 font-mono text-[11px]">Unlinked ({row.courseId})</span>
            )}
          </div>
        );
      }
    },
    {
      header: 'Resource Name & Type',
      accessor: (row) => (
        <div className="space-y-1">
          <span className="font-bold text-white text-xs block">{row.title}</span>
          <StatusBadge variant="info" label={getResourceTypeLabel(row.resourceType)} size="sm" />
          {row.description && (
            <p className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">{row.description}</p>
          )}
        </div>
      )
    },
    {
      header: 'Academic Info',
      accessor: (row) => (
        <div className="space-y-1 text-[11px]">
          {row.academicYear && (
            <div className="flex items-center gap-1 text-slate-300 font-mono">
              <Calendar className="w-3 h-3 text-amber-400" />
              <span>{row.academicYear}</span>
            </div>
          )}
          {row.resourceYear && (
            <span className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 text-[10px] font-mono block w-fit">
              Exam Year: {row.resourceYear}
            </span>
          )}
        </div>
      )
    },
    {
      header: 'File / Link',
      accessor: (row) => {
        const targetUrl = row.fileUrl || row.externalUrl;
        if (!targetUrl) return <span className="text-[10px] text-slate-500 italic">No File</span>;

        return (
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-blue-400 text-[11px] font-semibold inline-flex items-center gap-1 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Access File</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        );
      }
    },
    {
      header: 'Status',
      accessor: (row) => (
        <button onClick={() => handleTogglePublish(row)} className="cursor-pointer">
          <StatusBadge
            variant={row.isPublished ? 'active' : 'warning'}
            label={row.isPublished ? 'Published' : 'Draft'}
            size="sm"
          />
        </button>
      )
    },
    {
      header: 'Actions',
      headerClassName: 'text-right',
      className: 'text-right',
      accessor: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleOpenEditModal(row)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 transition-colors"
            title="Edit Resource"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeleteResourceTarget(row)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 hover:text-rose-300 transition-colors"
            title="Delete Resource"
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
        title="Learning Resources & Storage Hub"
        description="Upload, manage, publish, and delete lecture slides, past questions, outlines, and lab materials."
        badge={`${resources.length} Resources Total`}
      >
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Resource</span>
        </button>
      </AdminPageHeader>

      {/* Filter Bar Above Table */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search resource title or course code..."
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Levels</option>
            <option value="100">Level 100</option>
            <option value="200">Level 200</option>
            <option value="300">Level 300</option>
            <option value="400">Level 400</option>
          </select>

          <select
            value={filterResourceType}
            onChange={(e) => setFilterResourceType(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Categories</option>
            <option value="slide">Lecture Slides</option>
            <option value="note">Lecture Handouts</option>
            <option value="past_question">Past Questions</option>
            <option value="assignment">Lab Manuals</option>
            <option value="tutorial">Tutorial Guides</option>
            <option value="video">Video Links</option>
            <option value="other">Other</option>
          </select>

          <select
            value={filterPublished}
            onChange={(e) => setFilterPublished(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Statuses</option>
            <option value="Published">Published Only</option>
            <option value="Draft">Drafts Only</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredResources}
        loading={loading}
        keyExtractor={(item) => item.id}
        emptyMessage="No learning resources found"
        emptySubtext="Upload PDFs, lecture slides, or past questions to populate the student Learning Hub."
        emptyIcon={<FolderOpen className="w-6 h-6 text-slate-400" />}
      />

      {/* Upload / Edit Resource Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingResource?.id ? 'Edit Learning Resource' : 'Upload Learning Resource'}
        description="Upload files to Supabase Storage or link external educational media."
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
              form="resource-form"
              disabled={isSaving}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Uploading...' : editingResource?.id ? 'Save Changes' : 'Upload Resource'}
            </button>
          </>
        }
      >
        <form id="resource-form" onSubmit={handleSaveResource} className="space-y-4">
          {modalError && (
            <div className="p-3 bg-rose-500/20 border border-rose-500 text-rose-200 text-xs font-semibold rounded-lg">
              {modalError}
            </div>
          )}

          <FormSelect
            label="Target Course"
            required
            options={courses.map((c) => ({
              value: c.id,
              label: `[${c.courseCode}] ${c.title} (Level ${c.level}, Sem ${c.semester})`
            }))}
            value={editingResource?.courseId || ''}
            onChange={(e) => setEditingResource({ ...editingResource, courseId: e.target.value })}
          />

          <FormInput
            label="Resource Title"
            required
            placeholder="e.g. Chapter 3 Lecture Slides - Object-Oriented Concepts"
            value={editingResource?.title || ''}
            onChange={(e) => setEditingResource({ ...editingResource, title: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormSelect
              label="Resource Category"
              options={[
                { value: 'slide', label: 'Lecture Slide' },
                { value: 'note', label: 'Lecture Handout' },
                { value: 'past_question', label: 'Past Examination Question' },
                { value: 'assignment', label: 'Assignment / Lab Manual' },
                { value: 'tutorial', label: 'Tutorial Guide' },
                { value: 'video', label: 'Educational Video Link' },
                { value: 'other', label: 'Other Material' }
              ]}
              value={editingResource?.resourceType || 'slide'}
              onChange={(e) =>
                setEditingResource({
                  ...editingResource,
                  resourceType: e.target.value as ResourceType
                })
              }
            />

            <FormInput
              label="Academic Year"
              placeholder="e.g. 2025/2026"
              value={editingResource?.academicYear || ''}
              onChange={(e) => setEditingResource({ ...editingResource, academicYear: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Exam / Resource Year"
              type="number"
              placeholder="e.g. 2025"
              value={editingResource?.resourceYear || ''}
              onChange={(e) =>
                setEditingResource({
                  ...editingResource,
                  resourceYear: Number(e.target.value) || undefined
                })
              }
            />

            <FormInput
              label="Reading Time / Duration"
              placeholder="e.g. 45 mins"
              value={editingResource?.duration || ''}
              onChange={(e) => setEditingResource({ ...editingResource, duration: e.target.value })}
            />
          </div>

          <FormTextarea
            label="Description / Topics Covered"
            rows={2}
            placeholder="Brief overview of contents..."
            value={editingResource?.description || ''}
            onChange={(e) => setEditingResource({ ...editingResource, description: e.target.value })}
          />

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-blue-400 block uppercase tracking-wider">
              File Attachment & Storage
            </span>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Upload Document (Max 50 MB)
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
              />
              {selectedFile && (
                <p className="text-[11px] text-emerald-400 font-semibold mt-1">
                  Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
              )}
            </div>

            <FormInput
              label="Or External URL / Video Link"
              placeholder="https://..."
              value={editingResource?.externalUrl || ''}
              onChange={(e) => setEditingResource({ ...editingResource, externalUrl: e.target.value })}
            />
          </div>

          <FormToggle
            label="Publish Immediately to Learning Hub"
            description="If enabled, students can search and download this resource"
            checked={editingResource?.isPublished ?? true}
            onChange={(checked) => setEditingResource({ ...editingResource, isPublished: checked })}
          />
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteResourceTarget)}
        onClose={() => setDeleteResourceTarget(null)}
        onConfirm={handleDeleteResourceExecute}
        title="Delete Learning Resource"
        message={
          deleteResourceTarget
            ? `Are you sure you want to permanently delete "${deleteResourceTarget.title}"? This will erase the file from storage and database.`
            : ''
        }
        confirmLabel="Delete Resource"
      />
    </div>
  );
};
