import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Course, LearningResource } from '../types';

export function useLearningResources() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    try {
      // 1. Query active public courses
      const { data: coursesData, error: coursesErr } = await supabase
        .from('courses')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (coursesErr) {
        throw new Error(coursesErr.message);
      }

      // 2. Query published learning resources (non-blocking fallback)
      let resData: any[] = [];
      try {
        const { data, error: resErr } = await supabase
          .from('learning_resources')
          .select('*')
          .eq('is_published', true)
          .order('display_order', { ascending: true });

        if (resErr) {
          console.warn('Learning resources query notice (table may be empty or unmigrated):', resErr.message);
        } else if (data) {
          resData = data;
        }
      } catch (rErr: any) {
        console.warn('Learning resources fetch notice:', rErr?.message || rErr);
      }

      // Map resource counts for courses
      const resourceCountMap: Record<string, number> = {};
      const mappedResources: LearningResource[] = resData.map((r) => {
        resourceCountMap[r.course_id] = (resourceCountMap[r.course_id] || 0) + 1;
        return {
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
        };
      });

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
        updatedAt: c.updated_at,
        resourceCount: resourceCountMap[c.id] || 0
      }));

      // Sort courses by level, semester, displayOrder
      mappedCourses.sort((a, b) => {
        if (a.level !== b.level) return a.level.localeCompare(b.level);
        if (a.semester !== b.semester) return a.semester.localeCompare(b.semester);
        return a.displayOrder - b.displayOrder;
      });

      setCourses(mappedCourses);
      setResources(mappedResources);
    } catch (err: any) {
      console.error('Learning Hub course data fetch error:', err.message);
      setError(`Failed to load courses from Supabase: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    const handleFocus = () => fetchData();
    window.addEventListener('focus', handleFocus);
    window.addEventListener('hashchange', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('hashchange', handleFocus);
    };
  }, [fetchData]);

  return {
    courses,
    resources,
    loading,
    error,
    refreshData: fetchData
  };
}
