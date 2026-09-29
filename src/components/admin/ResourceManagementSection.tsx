import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { logAdminActivity } from '../../lib/activityLogger';
import {
  uploadLearningResourceFile,
  replaceLearningResourceFile,
  deleteLearningResourceFile,
  validateResourceFile
} from '../../utils/resourceStorage';
import type { Course, LearningResource, ResourceType } from '../../types';
import {
  BookOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  RefreshCw,
  FolderOpen
} from 'lucide-react';

export const ResourceManagementSection: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Filter Toolbar States
  const [filterLevel, setFilterLevel] = useState<string>('All');
  const [filterSemester, setFilterSemester] = useState<string>('All');
  const [filterCourseId, setFilterCourseId] = useState<string>('All');
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
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Fetch courses and learning resources from Supabase
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured || !supabase) {
      setError('Supabase client is not configured.');
      setLoading(false);
      return;
    }

    try {
      // 1. Fetch courses
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

      // 2. Fetch all learning resources for admin management
      const { data: resData, error: resErr } = await supabase
        .from('learning_resources')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (resErr) throw resErr;

      const mappedResources: LearningResource[] = (resData || []).map((r) => ({
        id: r.id,
        courseId: r.course_id,
        title: r.title,
        description: r.description || '',
        resourceType: r.resource_type || 'other',
        filePath: r.file_path || '',
        fileUrl: r.file_url || '',
        externalUrl: r.external_url || '',
        thumbnailUrl: r.thumbnail_url || '',
        academicYear: r.academic_year || '',
        resourceYear: r.resource_year ?? undefined,
        duration: r.duration || '',
        isPublished: r.is_published ?? true,
        displayOrder: r.display_order ?? 0,
        uploadedBy: r.uploaded_by || '',
        createdAt: r.created_at,
        updatedAt: r.updated_at
      }));

      setCourses(mappedCourses);
      setResources(mappedResources);
    } catch (err: any) {
      console.error('Failed to load learning resources in admin:', err);
      setError(err.message || 'Failed to fetch learning resource records from Supabase.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showNotification = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 4000);
  };

  // Map course details by course ID
  const courseMap = useMemo(() => {
    const map: Record<string, Course> = {};
    courses.forEach((c) => {
      map[c.id] = c;
    });
    return map;
  }, [courses]);

  // Derived filtered resources
  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      const course = courseMap[res.courseId];

      // Level check
      if (filterLevel !== 'All' && course?.level !== filterLevel) return false;

      // Semester check
      if (filterSemester !== 'All' && course?.semester !== filterSemester) return false;

      // Course check
      if (filterCourseId !== 'All' && res.courseId !== filterCourseId) return false;

      // Resource Type check
      if (filterResourceType !== 'All' && res.resourceType !== filterResourceType) return false;

      // Published state check
      if (filterPublished === 'published' && !res.isPublished) return false;
      if (filterPublished === 'draft' && res.isPublished) return false;

      // Search Query
      const q = filterSearch.trim().toLowerCase();
      if (q) {
        const matchesTitle = res.title.toLowerCase().includes(q);
        const matchesDesc = (res.description || '').toLowerCase().includes(q);
        const matchesCourseCode = course?.courseCode.toLowerCase().includes(q) || false;
        const matchesCourseTitle = course?.title.toLowerCase().includes(q) || false;
        if (!matchesTitle && !matchesDesc && !matchesCourseCode && !matchesCourseTitle) return false;
      }

      return true;
    });
  }, [resources, courseMap, filterLevel, filterSemester, filterCourseId, filterResourceType, filterPublished, filterSearch]);

  // Handle Open Create Modal
  const handleOpenAddModal = () => {
    const defaultCourseId = courses[0]?.id || '';
    setEditingResource({
      courseId: defaultCourseId,
      title: '',
      description: '',
      resourceType: 'slide',
      filePath: '',
      fileUrl: '',
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

  // Handle Open Edit Modal
  const handleOpenEditModal = (res: LearningResource) => {
    setEditingResource({ ...res });
    setSelectedFile(null);
    setModalError(null);
    setIsModalOpen(true);
  };

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const valErr = validateResourceFile(file);
      if (valErr) {
        setModalError(valErr);
        setSelectedFile(null);
        return;
      }
      setModalError(null);
      setSelectedFile(file);
    }
  };

  // Save / Upsert Resource Handler
  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResource?.title?.trim()) {
      setModalError('Resource Title is required.');
      return;
    }
    if (!editingResource.courseId) {
      setModalError('Please select a course for this learning resource.');
      return;
    }

    setIsSaving(true);
    setModalError(null);

    if (!supabase) {
      setModalError('Supabase client is not configured.');
      setIsSaving(false);
      return;
    }

    try {
      const targetCourse = courseMap[editingResource.courseId];
      let finalFilePath = editingResource.filePath || '';
      let finalFileUrl = editingResource.fileUrl || '';

      // Upload file to Supabase Storage if new file selected
      if (selectedFile && targetCourse) {
        let uploadRes;
        if (editingResource.filePath || editingResource.fileUrl) {
          uploadRes = await replaceLearningResourceFile(
            editingResource.filePath || editingResource.fileUrl,
            selectedFile,
            targetCourse.courseCode,
            targetCourse.level,
            targetCourse.semester,
            editingResource.resourceType || 'other'
          );
        } else {
          uploadRes = await uploadLearningResourceFile(
            selectedFile,
            targetCourse.courseCode,
            targetCourse.level,
            targetCourse.semester,
            editingResource.resourceType || 'other'
          );
        }

        if (uploadRes.error) {
          throw new Error(`File upload failed: ${uploadRes.error}`);
        }

        finalFileUrl = uploadRes.publicUrl || '';
        finalFilePath = uploadRes.path || '';
      }

      const payload = {
        id: editingResource.id || undefined,
        course_id: editingResource.courseId,
        title: editingResource.title.trim(),
        description: editingResource.description?.trim() || null,
        resource_type: editingResource.resourceType || 'other',
        file_path: finalFilePath || null,
        file_url: finalFileUrl || null,
        external_url: editingResource.externalUrl?.trim() || null,
        thumbnail_url: editingResource.thumbnailUrl?.trim() || null,
        academic_year: editingResource.academicYear?.trim() || '2025/2026',
        resource_year: editingResource.resourceYear ? Number(editingResource.resourceYear) : null,
        duration: editingResource.duration?.trim() || null,
        is_published: editingResource.isPublished ?? true,
        display_order: Number(editingResource.displayOrder) || 0,
        uploaded_by: user?.email || 'Admin'
      };

      const { error: upsertErr } = await supabase
        .from('learning_resources')
        .upsert(payload);

      if (upsertErr) throw upsertErr;

      // Log activity
      await logAdminActivity({
        action: editingResource.id ? 'UPDATE' : 'CREATE',
        resourceType: 'Learning Resource',
        resourceId: editingResource.id || payload.title,
        description: `Saved learning resource "${payload.title}" for course ${targetCourse?.courseCode || payload.course_id}`
      });

      await fetchData();
      setIsModalOpen(false);
      setEditingResource(null);
      setSelectedFile(null);
      showNotification(`Learning resource "${payload.title}" saved successfully!`);
    } catch (err: any) {
      console.error('Save resource error:', err);
      setModalError(err.message || 'Failed to save learning resource.');
    } finally {
      setIsSaving(false);
    }
  };

  // Quick Toggle Publish Status
  const handleTogglePublish = async (res: LearningResource) => {
    if (!supabase) return;
    try {
      const newStatus = !res.isPublished;
      const { error: updateErr } = await supabase
        .from('learning_resources')
        .update({ is_published: newStatus })
        .eq('id', res.id);

      if (updateErr) throw updateErr;

      await logAdminActivity({
        action: newStatus ? 'PUBLISH' : 'UNPUBLISH',
        resourceType: 'Learning Resource',
        resourceId: res.id,
        description: `${newStatus ? 'Published' : 'Unpublished'} resource "${res.title}"`
      });

      await fetchData();
      showNotification(`Resource "${res.title}" is now ${newStatus ? 'Published' : 'Draft (Hidden)'}.`);
    } catch (err: any) {
      alert(`Status update failed: ${err.message}`);
    }
  };

  // Delete Resource Handler
  const handleDeleteResource = async () => {
    if (!deleteResourceTarget || !supabase) return;

    setIsDeleting(true);
    try {
      // 1. Delete file from storage if present
      const targetPath = deleteResourceTarget.filePath || deleteResourceTarget.fileUrl;
      if (targetPath) {
        await deleteLearningResourceFile(targetPath);
      }

      // 2. Delete database record
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

      await fetchData();
      setDeleteResourceTarget(null);
      showNotification('Learning resource deleted successfully.');
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const getResourceTypeLabel = (type: ResourceType) => {
    switch (type) {
      case 'slide': return 'Lecture Slide';
      case 'note': return 'Lecture Note';
      case 'past_question': return 'Past Exam Question';
      case 'assignment': return 'Assignment / Tutorial';
      case 'tutorial': return 'Tutorial Guide';
      case 'video': return 'Educational Video';
      default: return 'Academic Material';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Banner / Header */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-[#003366] text-[#F2B705] font-mono text-xs font-bold border border-[#F2B705]/30">
              ACADEMIC RESOURCE MANAGEMENT
            </span>
            <span className="text-xs font-bold text-slate-400">
              {resources.length} Total Materials
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white mt-1">
            Learning Resources & Course Files
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Upload, publish, edit, replace, and organize slides, lecture notes, assignments, videos, and past examination questions across all 46 BSc IT Management courses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-3.5 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-lg bg-[#003366] hover:bg-blue-900 text-white font-extrabold text-xs flex items-center gap-2 transition-colors border border-[#F2B705]/40 shadow-md"
          >
            <Plus className="w-4 h-4 text-[#F2B705]" />
            <span>Upload New Resource</span>
          </button>
        </div>
      </div>

      {/* Notification Bar */}
      {notice && (
        <div className="p-3 rounded-xl bg-[#003366] border border-[#F2B705]/40 text-xs font-bold text-white flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-[#F2B705]" />
          <span>{notice}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-4 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by title, description, or course code..."
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-[#F2B705]"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Level */}
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold text-xs"
            >
              <option value="All">All Levels</option>
              <option value="100">Level 100</option>
              <option value="200">Level 200</option>
              <option value="300">Level 300</option>
              <option value="400">Level 400</option>
            </select>

            {/* Semester */}
            <select
              value={filterSemester}
              onChange={(e) => setFilterSemester(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold text-xs"
            >
              <option value="All">All Semesters</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
            </select>

            {/* Specific Course */}
            <select
              value={filterCourseId}
              onChange={(e) => setFilterCourseId(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold text-xs max-w-[200px] truncate"
            >
              <option value="All">All Courses ({courses.length})</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.courseCode} - {c.title}
                </option>
              ))}
            </select>

            {/* Resource Type */}
            <select
              value={filterResourceType}
              onChange={(e) => setFilterResourceType(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold text-xs"
            >
              <option value="All">All Material Types</option>
              <option value="slide">Lecture Slides</option>
              <option value="note">Lecture Notes</option>
              <option value="past_question">Past Examination Questions</option>
              <option value="assignment">Assignments & Tutorials</option>
              <option value="video">Educational Videos</option>
              <option value="other">Other Materials</option>
            </select>

            {/* Publication Status */}
            <select
              value={filterPublished}
              onChange={(e) => setFilterPublished(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold text-xs"
            >
              <option value="All">All Statuses</option>
              <option value="published">Published Only</option>
              <option value="draft">Drafts Only</option>
            </select>

          </div>
        </div>

        {/* Counter Summary */}
        <div className="text-[11px] font-bold text-slate-400 px-1">
          Showing <strong className="text-white">{filteredResources.length}</strong> of{' '}
          <strong className="text-[#F2B705]">{resources.length}</strong> learning materials.
        </div>
      </div>

      {/* Main Table / Data View */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 bg-slate-800/40 rounded-xl border border-slate-700 space-y-2">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#F2B705]" />
          <p className="text-xs font-bold">Loading academic resources from Supabase database...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-slate-800/40 rounded-xl border border-slate-700 space-y-3">
          <FolderOpen className="w-10 h-10 mx-auto text-slate-500 opacity-60" />
          <p className="text-sm font-bold text-slate-200">No learning resources found matching your filters.</p>
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-lg bg-[#003366] text-white font-bold text-xs inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-[#F2B705]" />
            <span>Upload First Resource</span>
          </button>
        </div>
      ) : (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 text-[10px] uppercase font-bold tracking-wider border-b border-slate-700">
                <tr>
                  <th className="px-4 py-3">Course / Level</th>
                  <th className="px-4 py-3">Resource Title & Type</th>
                  <th className="px-4 py-3">Year / Duration</th>
                  <th className="px-4 py-3">File / Link</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 font-medium">
                {filteredResources.map((res) => {
                  const course = courseMap[res.courseId];
                  const hasFile = Boolean(res.fileUrl || res.externalUrl || res.filePath);
                  const targetUrl = res.fileUrl || res.externalUrl || res.filePath || '#';

                  return (
                    <tr key={res.id} className="hover:bg-slate-700/40 transition-colors">
                      
                      {/* Course / Level */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {course ? (
                          <div>
                            <span className="px-2 py-0.5 rounded bg-[#003366] text-[#F2B705] font-mono font-black text-xs">
                              {course.courseCode}
                            </span>
                            <span className="block text-[11px] font-bold text-slate-300 mt-1 max-w-[180px] truncate">
                              {course.title}
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              Level {course.level} • Sem {course.semester}
                            </span>
                          </div>
                        ) : (
                          <span className="text-red-400 font-mono text-[11px]">Unlinked ({res.courseId})</span>
                        )}
                      </td>

                      {/* Title & Type */}
                      <td className="px-4 py-3.5">
                        <div className="space-y-1">
                          <span className="font-extrabold text-white text-xs block">{res.title}</span>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-slate-900 text-[#F2B705] text-[10px] font-bold border border-slate-700">
                              {getResourceTypeLabel(res.resourceType)}
                            </span>
                          </div>
                          {res.description && (
                            <p className="text-[11px] text-slate-400 line-clamp-1 max-w-sm">{res.description}</p>
                          )}
                        </div>
                      </td>

                      {/* Year & Duration */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-[11px]">
                        <div className="space-y-1">
                          {res.academicYear && (
                            <div className="flex items-center gap-1 text-slate-300 font-mono">
                              <Calendar className="w-3 h-3 text-[#F2B705]" />
                              <span>{res.academicYear}</span>
                            </div>
                          )}
                          {res.resourceYear && (
                            <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 text-[10px] font-mono block w-fit">
                              Exam Year: {res.resourceYear}
                            </span>
                          )}
                          {res.duration && (
                            <div className="flex items-center gap-1 text-purple-300 text-[10px]">
                              <Clock className="w-3 h-3" />
                              <span>{res.duration}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* File / Link */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {hasFile ? (
                          <a
                            href={targetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-700 text-[#00AEEF] text-[11px] font-bold inline-flex items-center gap-1 border border-slate-700 transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Access File</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-[10px] text-slate-500 italic">No URL/File</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <button
                          onClick={() => handleTogglePublish(res)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1.5 transition-colors ${
                            res.isPublished
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                          }`}
                        >
                          {res.isPublished ? (
                            <>
                              <Eye className="w-3 h-3" />
                              <span>Published</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              <span>Draft</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(res)}
                          className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                          title="Edit Resource"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setDeleteResourceTarget(res)}
                          className="p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white transition-colors"
                          title="Delete Resource"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Resource Modal */}
      {isModalOpen && editingResource && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl text-white my-8 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#F2B705]" />
                <h3 className="text-lg font-extrabold text-white">
                  {editingResource.id ? 'Edit Learning Resource' : 'Upload New Learning Resource'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-red-500/20 border border-red-500 text-red-200 text-xs font-bold rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSaveResource} className="space-y-4">
              
              {/* Course Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Target Course <span className="text-red-400">*</span>
                </label>
                <select
                  required
                  value={editingResource.courseId || ''}
                  onChange={(e) => setEditingResource({ ...editingResource, courseId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:border-[#F2B705]"
                >
                  <option value="" disabled>-- Select Course --</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      [{c.courseCode}] {c.title} (Level {c.level}, Sem {c.semester})
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Resource Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chapter 3 Lecture Slides - Object-Oriented Concepts"
                  value={editingResource.title || ''}
                  onChange={(e) => setEditingResource({ ...editingResource, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-[#F2B705]"
                />
              </div>

              {/* Resource Type & Academic Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Resource Category</label>
                  <select
                    value={editingResource.resourceType || 'slide'}
                    onChange={(e) =>
                      setEditingResource({
                        ...editingResource,
                        resourceType: e.target.value as ResourceType
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:border-[#F2B705]"
                  >
                    <option value="slide">Lecture Slide</option>
                    <option value="note">Lecture Note / Handout</option>
                    <option value="past_question">Past Examination Question</option>
                    <option value="assignment">Assignment / Lab Manual</option>
                    <option value="tutorial">Tutorial Guide</option>
                    <option value="video">Educational Video Link</option>
                    <option value="other">Other Material</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Academic Year</label>
                  <input
                    type="text"
                    placeholder="e.g. 2025/2026"
                    value={editingResource.academicYear || ''}
                    onChange={(e) => setEditingResource({ ...editingResource, academicYear: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-[#F2B705]"
                  />
                </div>
              </div>

              {/* Resource Year & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Exam / Resource Year</label>
                  <input
                    type="number"
                    placeholder="e.g. 2025"
                    value={editingResource.resourceYear || ''}
                    onChange={(e) => setEditingResource({ ...editingResource, resourceYear: Number(e.target.value) || undefined })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-[#F2B705]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Duration / Reading Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 45 mins (Optional)"
                    value={editingResource.duration || ''}
                    onChange={(e) => setEditingResource({ ...editingResource, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-[#F2B705]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Description / Topics Covered</label>
                <textarea
                  rows={2}
                  placeholder="Optional brief description of what this document or video contains..."
                  value={editingResource.description || ''}
                  onChange={(e) => setEditingResource({ ...editingResource, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-[#F2B705]"
                />
              </div>

              {/* File Upload Section */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-extrabold text-[#F2B705] block uppercase tracking-wider">
                  Resource File & URL Source
                </span>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Upload Document / Media File (Max 50 MB)
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#003366] file:text-white hover:file:bg-blue-900 cursor-pointer"
                  />
                  {selectedFile && (
                    <p className="text-[11px] text-emerald-400 font-bold mt-1">
                      Selected file: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </p>
                  )}
                  {editingResource.fileUrl && !selectedFile && (
                    <p className="text-[11px] text-slate-400 mt-1 truncate">
                      Current File URL: <a href={editingResource.fileUrl} target="_blank" rel="noopener noreferrer" className="text-[#00AEEF] underline">{editingResource.fileUrl}</a>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Or External Link / Video URL (e.g. YouTube, Google Drive)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={editingResource.externalUrl || ''}
                    onChange={(e) => setEditingResource({ ...editingResource, externalUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-[#F2B705]"
                  />
                </div>
              </div>

              {/* Publication Status & Display Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isPublishedCheck"
                    checked={editingResource.isPublished ?? true}
                    onChange={(e) => setEditingResource({ ...editingResource, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-700 text-[#003366] focus:ring-[#F2B705]"
                  />
                  <label htmlFor="isPublishedCheck" className="text-xs font-bold text-slate-200 cursor-pointer">
                    Publish immediately to Learning Hub
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingResource.displayOrder ?? 0}
                    onChange={(e) => setEditingResource({ ...editingResource, displayOrder: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-[#F2B705]"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-lg bg-[#003366] hover:bg-blue-900 text-white font-extrabold text-xs flex items-center gap-2 border border-[#F2B705]/40 shadow-md"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#F2B705]" />
                      <span>Saving & Uploading...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-[#F2B705]" />
                      <span>{editingResource.id ? 'Save Changes' : 'Upload Resource'}</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteResourceTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-extrabold text-white">Confirm Resource Deletion</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-white">"{deleteResourceTarget.title}"</strong>?
              This will remove the file from storage and erase the record from the database.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteResourceTarget(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteResource}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs flex items-center gap-1.5"
              >
                {isDeleting ? 'Deleting...' : 'Permanently Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
