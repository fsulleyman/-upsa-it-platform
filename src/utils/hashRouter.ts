import { useState, useEffect } from 'react';
import type { NavSectionId } from '../types';

export interface HashState {
  section: NavSectionId;
  modal: string | null;
  programmeId: string | null;
  projectId: string | null;
  categoryFilter: string | null;
  courseCode: string | null;
  level: string | null;
  semester: string | null;
  tab: string | null;
  clubId: string | null;
}

export function parseHash(hash: string): HashState {
  const cleanHash = hash.startsWith('#') ? hash.slice(1) : hash;
  if (!cleanHash) {
    return {
      section: 'home',
      modal: null,
      programmeId: null,
      projectId: null,
      categoryFilter: null,
      courseCode: null,
      level: null,
      semester: null,
      tab: null,
      clubId: null
    };
  }

  const parts = cleanHash.split('?');
  const rawPath = (parts[0] || '').replace(/^\/+|\/+$/g, '');
  const path = rawPath || 'home';
  const queryParams = new URLSearchParams(parts[1] || '');

  const validSections: NavSectionId[] = [
    'home',
    'about',
    'academics',
    'faculty',
    'learning-hub',
    'hub',
    'campus-life',
    'innovation',
    'community',
    'contact',
    'admin',
    'reset-password'
  ];
  const section: NavSectionId = validSections.includes(path as NavSectionId)
    ? (path as NavSectionId)
    : 'home';

  const rawLevel = queryParams.get('level');
  const validLevel = rawLevel && ['100', '200', '300', '400', 'All'].includes(rawLevel) ? rawLevel : null;

  const rawSem = queryParams.get('semester');
  const validSem = rawSem && ['1', '2', 'All'].includes(rawSem) ? rawSem : null;

  return {
    section,
    modal: queryParams.get('modal'),
    programmeId: queryParams.get('programme'),
    projectId: queryParams.get('project'),
    categoryFilter: queryParams.get('category'),
    courseCode: queryParams.get('course'),
    level: validLevel,
    semester: validSem,
    tab: queryParams.get('tab'),
    clubId: queryParams.get('club')
  };
}

export function buildHash(state: Partial<HashState>): string {
  const current = parseHash(window.location.hash);
  const isSectionChanging = state.section !== undefined && state.section !== current.section;

  const section = state.section !== undefined ? state.section : current.section;
  const modal = state.modal !== undefined ? state.modal : (isSectionChanging ? null : current.modal);
  const programmeId = state.programmeId !== undefined ? state.programmeId : (isSectionChanging ? null : current.programmeId);
  const projectId = state.projectId !== undefined ? state.projectId : (isSectionChanging ? null : current.projectId);
  const categoryFilter = state.categoryFilter !== undefined ? state.categoryFilter : (isSectionChanging ? null : current.categoryFilter);
  const courseCode = state.courseCode !== undefined ? state.courseCode : (isSectionChanging ? null : current.courseCode);
  const level = state.level !== undefined ? state.level : (isSectionChanging ? null : current.level);
  const semester = state.semester !== undefined ? state.semester : (isSectionChanging ? null : current.semester);
  const tab = state.tab !== undefined ? state.tab : (isSectionChanging ? null : current.tab);
  const clubId = state.clubId !== undefined ? state.clubId : (isSectionChanging ? null : current.clubId);

  const params = new URLSearchParams();
  if (modal) params.set('modal', modal);
  if (programmeId) params.set('programme', programmeId);
  if (projectId) params.set('project', projectId);
  if (categoryFilter && categoryFilter !== 'All') params.set('category', categoryFilter);
  if (level && level !== 'All') params.set('level', level);
  if (semester && semester !== 'All') params.set('semester', semester);
  if (courseCode) params.set('course', courseCode.toUpperCase());
  if (tab) params.set('tab', tab);
  if (clubId) params.set('club', clubId);

  const queryString = params.toString();
  return `#/${section}${queryString ? `?${queryString}` : ''}`;
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
