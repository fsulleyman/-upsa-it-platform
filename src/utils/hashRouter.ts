import { useState, useEffect } from 'react';
import type { NavSectionId } from '../types';

export interface HashState {
  routePath: string; // e.g. "home", "about", "academics/programmes", "faculty/dr-joshua-ofoeda"
  section: NavSectionId;
  modal: string | null;
  programmeId: string | null;
  projectId: string | null;
  courseId: string | null;
  facultyId: string | null;
  categoryFilter: string | null;
  searchQuery: string | null;
}

export function parseHash(hash: string): HashState {
  const cleanHash = hash.startsWith('#') ? hash.slice(1) : hash;
  if (!cleanHash || cleanHash === '/') {
    return {
      routePath: 'home',
      section: 'home',
      modal: null,
      programmeId: null,
      projectId: null,
      courseId: null,
      facultyId: null,
      categoryFilter: null,
      searchQuery: null
    };
  }

  const parts = cleanHash.split('?');
  let rawPath = parts[0] ? parts[0].replace(/^\/+|\/+$/g, '') : 'home';
  if (!rawPath) rawPath = 'home';
  
  const queryParams = new URLSearchParams(parts[1] || '');

  // Alias maps
  if (rawPath === 'hub') rawPath = 'developers-hub';

  // Extract faculty ID if route is faculty/:id
  let facultyId: string | null = queryParams.get('faculty');
  let section: NavSectionId = 'home';

  if (rawPath.startsWith('faculty/')) {
    facultyId = rawPath.replace('faculty/', '');
    section = 'it-department/faculty';
  } else if (rawPath === 'academics/programmes') {
    section = 'academics/programmes';
  } else if (rawPath === 'academics/courses') {
    section = 'academics/courses';
  } else if (rawPath === 'it-department/faculty') {
    section = 'it-department/faculty';
  } else if (rawPath === 'developers-hub') {
    section = 'developers-hub';
  } else if (
    ['home', 'about', 'academics', 'it-department', 'research', 'innovation', 'community', 'contact', 'admin'].includes(rawPath)
  ) {
    section = rawPath as NavSectionId;
  }

  return {
    routePath: rawPath,
    section,
    modal: queryParams.get('modal'),
    programmeId: queryParams.get('programme'),
    projectId: queryParams.get('project'),
    courseId: queryParams.get('course'),
    facultyId,
    categoryFilter: queryParams.get('category'),
    searchQuery: queryParams.get('q')
  };
}

export function buildHash(state: Partial<HashState>): string {
  const current = parseHash(window.location.hash);
  const routePath = state.routePath !== undefined ? state.routePath : (state.section !== undefined ? state.section : current.routePath);
  const modal = state.modal !== undefined ? state.modal : current.modal;
  const programmeId = state.programmeId !== undefined ? state.programmeId : current.programmeId;
  const projectId = state.projectId !== undefined ? state.projectId : current.projectId;
  const courseId = state.courseId !== undefined ? state.courseId : current.courseId;
  const categoryFilter = state.categoryFilter !== undefined ? state.categoryFilter : current.categoryFilter;
  const searchQuery = state.searchQuery !== undefined ? state.searchQuery : current.searchQuery;

  const params = new URLSearchParams();
  if (modal) params.set('modal', modal);
  if (programmeId) params.set('programme', programmeId);
  if (projectId) params.set('project', projectId);
  if (courseId) params.set('course', courseId);
  if (categoryFilter && categoryFilter !== 'All') params.set('category', categoryFilter);
  if (searchQuery) params.set('q', searchQuery);

  const queryString = params.toString();
  return `#${routePath}${queryString ? `?${queryString}` : ''}`;
}

export function useHashLocation(): [HashState, (update: Partial<HashState>) => void] {
  const [hashState, setHashState] = useState<HashState>(() => parseHash(window.location.hash));

  useEffect(() => {
    const handleHashChange = () => {
      setHashState(parseHash(window.location.hash));
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const updateHash = (update: Partial<HashState>) => {
    const newHash = buildHash(update);
    if (window.location.hash !== newHash) {
      window.location.hash = newHash;
    }
  };

  return [hashState, updateHash];
}
