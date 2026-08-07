import { useState, useEffect } from 'react';
import type { NavSectionId } from '../types';

export interface HashState {
  section: NavSectionId;
  modal: string | null;
  programmeId: string | null;
  projectId: string | null;
  categoryFilter: string | null;
}

export function parseHash(hash: string): HashState {
  const cleanHash = hash.startsWith('#') ? hash.slice(1) : hash;
  if (!cleanHash) {
    return {
      section: 'home',
      modal: null,
      programmeId: null,
      projectId: null,
      categoryFilter: null
    };
  }

  const parts = cleanHash.split('?');
  const path = parts[0] || 'home';
  const queryParams = new URLSearchParams(parts[1] || '');

  const validSections: NavSectionId[] = ['home', 'about', 'academics', 'hub', 'innovation', 'community', 'contact', 'admin'];
  const section: NavSectionId = validSections.includes(path as NavSectionId) ? (path as NavSectionId) : 'home';

  return {
    section,
    modal: queryParams.get('modal'),
    programmeId: queryParams.get('programme'),
    projectId: queryParams.get('project'),
    categoryFilter: queryParams.get('category')
  };
}

export function buildHash(state: Partial<HashState>): string {
  const current = parseHash(window.location.hash);
  const section = state.section !== undefined ? state.section : current.section;
  const modal = state.modal !== undefined ? state.modal : current.modal;
  const programmeId = state.programmeId !== undefined ? state.programmeId : current.programmeId;
  const projectId = state.projectId !== undefined ? state.projectId : current.projectId;
  const categoryFilter = state.categoryFilter !== undefined ? state.categoryFilter : current.categoryFilter;

  const params = new URLSearchParams();
  if (modal) params.set('modal', modal);
  if (programmeId) params.set('programme', programmeId);
  if (projectId) params.set('project', projectId);
  if (categoryFilter && categoryFilter !== 'All') params.set('category', categoryFilter);

  const queryString = params.toString();
  return `#${section}${queryString ? `?${queryString}` : ''}`;
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
