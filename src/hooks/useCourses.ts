import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Course } from '../types';
import { logAdminActivity } from '../lib/activityLogger';

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data, error: fetchErr } = await supabase
        .from('courses')
        .select('*')
        .order('display_order', { ascending: true });

      if (fetchErr) {
        setError(fetchErr.message);
        setLoading(false);
        return;
      }

      // Optionally fetch resource counts per course
      let resourceCounts: Record<string, number> = {};
      try {
        const { data: resData } = await supabase
          .from('learning_resources')
          .select('course_id');

        if (resData) {
          resData.forEach((r) => {
            resourceCounts[r.course_id] = (resourceCounts[r.course_id] || 0) + 1;
          });
        }
      } catch (e) {
        console.warn('Notice: learning_resources query skipped', e);
      }

      const mapped: Course[] = (data || []).map((c) => ({
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
        resourceCount: resourceCounts[c.id] || 0
      }));

      // Sort logically by level, semester, displayOrder
      mapped.sort((a, b) => {
        if (a.level !== b.level) return a.level.localeCompare(b.level);
        if (a.semester !== b.semester) return a.semester.localeCompare(b.semester);
        return a.displayOrder - b.displayOrder;
      });

      setCourses(mapped);
    } catch (err: any) {
      setError(err.message || 'Failed to load courses.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const saveCourse = async (courseData: Partial<Course>) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase client is not configured.');
    }

    const isEdit = Boolean(courseData.id);
    const id = courseData.id || `c-${(courseData.courseCode || '').toLowerCase().trim().replace(/\s+/g, '')}`;

    const payload = {
      id,
      course_code: (courseData.courseCode || '').trim().toUpperCase(),
      title: (courseData.title || '').trim(),
      description: (courseData.description || '').trim() || null,
      level: courseData.level || '100',
      semester: courseData.semester || '1',
      credit_hours: Number(courseData.creditHours) || 3,
      course_type: courseData.courseType || 'required',
      elective_group: courseData.courseType === 'elective' ? (courseData.electiveGroup || null) : null,
      programme: courseData.programme || 'BSc Information Technology Management',
      academic_year: courseData.academicYear || null,
      display_order: Number(courseData.displayOrder) || 0,
      is_active: courseData.isActive ?? true,
      updated_at: new Date().toISOString()
    };

    const { error: saveErr } = await supabase.from('courses').upsert(payload);
    if (saveErr) {
      throw new Error(saveErr.message);
    }

    await logAdminActivity({
      action: isEdit ? 'UPDATE' : 'CREATE',
      resourceType: 'Curriculum Course',
      resourceId: id,
      description: `${isEdit ? 'Updated' : 'Created'} course ${payload.course_code} - ${payload.title}`
    });

    await fetchCourses();
  };

  const toggleCourseStatus = async (id: string, currentStatus: boolean) => {
    if (!isSupabaseConfigured || !supabase) return;

    const newStatus = !currentStatus;
    const { error: err } = await supabase
      .from('courses')
      .update({ is_active: newStatus, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (err) {
      throw new Error(err.message);
    }

    await logAdminActivity({
      action: newStatus ? 'REACTIVATE' : 'ARCHIVE',
      resourceType: 'Curriculum Course',
      resourceId: id,
      description: `${newStatus ? 'Reactivated' : 'Archived'} course ${id}`
    });

    await fetchCourses();
  };

  const deleteCourse = async (id: string) => {
    if (!isSupabaseConfigured || !supabase) return;

    const { error: delErr } = await supabase.from('courses').delete().eq('id', id);
    if (delErr) {
      throw new Error(delErr.message);
    }

    await logAdminActivity({
      action: 'DELETE',
      resourceType: 'Curriculum Course',
      resourceId: id,
      description: `Deleted course ${id}`
    });

    await fetchCourses();
  };

  return {
    courses,
    loading,
    error,
    refreshCourses: fetchCourses,
    saveCourse,
    toggleCourseStatus,
    deleteCourse
  };
}
