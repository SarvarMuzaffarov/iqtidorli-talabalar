import { Student, Project, UniversityEvent, Announcement, Certificate, ScoringRule, UserRole } from '../types';
import { INITIAL_STUDENTS, INITIAL_PROJECTS, INITIAL_EVENTS, INITIAL_ANNOUNCEMENTS, INITIAL_CERTIFICATES, SCORING_RULES } from '../mockData';

const KEYS = {
  STUDENTS: 'talenthub_tkti_students_v1',
  PROJECTS: 'talenthub_tkti_projects_v1',
  EVENTS: 'talenthub_tkti_events_v1',
  ANNOUNCEMENTS: 'talenthub_tkti_announcements_v1',
  CERTIFICATES: 'talenthub_tkti_certificates_v1',
  TEACHERS: 'talenthub_tkti_teachers_v1',
  ACCOUNTS: 'talenthub_tkti_accounts_v1',
  RULES: 'talenthub_tkti_rules_v1',
  ACTIVE_ROLE: 'talenthub_tkti_role_v1',
  ACTIVE_STUDENT_ID: 'talenthub_tkti_active_student_v1',
  IS_AUTHENTICATED: 'talenthub_tkti_auth_v1',
};

export const STORAGE_KEYS = KEYS;

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  const item = localStorage.getItem(key);
  if (!item) return defaultValue;
  try {
    return JSON.parse(item) as T;
  } catch {
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export const getStoredStudents = (): Student[] => {
  const item = localStorage.getItem(KEYS.STUDENTS);
  if (!item) {
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    return INITIAL_STUDENTS;
  }
  try {
    return JSON.parse(item);
  } catch {
    return INITIAL_STUDENTS;
  }
};

export const saveStoredStudents = (students: Student[]) => {
  localStorage.setItem(KEYS.STUDENTS, JSON.stringify(students));
};

export const getStoredProjects = (): Project[] => {
  const item = localStorage.getItem(KEYS.PROJECTS);
  if (!item) {
    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
    return INITIAL_PROJECTS;
  }
  try {
    return JSON.parse(item);
  } catch {
    return INITIAL_PROJECTS;
  }
};

export const saveStoredProjects = (projects: Project[]) => {
  localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
};

export const getStoredEvents = (): UniversityEvent[] => {
  const item = localStorage.getItem(KEYS.EVENTS);
  if (!item) {
    localStorage.setItem(KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
    return INITIAL_EVENTS;
  }
  try {
    return JSON.parse(item);
  } catch {
    return INITIAL_EVENTS;
  }
};

export const saveStoredEvents = (events: UniversityEvent[]) => {
  localStorage.setItem(KEYS.EVENTS, JSON.stringify(events));
};

export const getStoredAnnouncements = (): Announcement[] => {
  const item = localStorage.getItem(KEYS.ANNOUNCEMENTS);
  if (!item) {
    localStorage.setItem(KEYS.ANNOUNCEMENTS, JSON.stringify(INITIAL_ANNOUNCEMENTS));
    return INITIAL_ANNOUNCEMENTS;
  }
  try {
    return JSON.parse(item);
  } catch {
    return INITIAL_ANNOUNCEMENTS;
  }
};

export const saveStoredAnnouncements = (announcements: Announcement[]) => {
  localStorage.setItem(KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
};

export const getStoredCertificates = (): Certificate[] => {
  const item = localStorage.getItem(KEYS.CERTIFICATES);
  if (!item) {
    localStorage.setItem(KEYS.CERTIFICATES, JSON.stringify(INITIAL_CERTIFICATES));
    return INITIAL_CERTIFICATES;
  }
  try {
    return JSON.parse(item);
  } catch {
    return INITIAL_CERTIFICATES;
  }
};

export const saveStoredCertificates = (certificates: Certificate[]) => {
  localStorage.setItem(KEYS.CERTIFICATES, JSON.stringify(certificates));
};

export const getActiveRole = (): UserRole => {
  return (localStorage.getItem(KEYS.ACTIVE_ROLE) as UserRole) || 'super_admin';
};

export const saveActiveRole = (role: UserRole) => {
  localStorage.setItem(KEYS.ACTIVE_ROLE, role);
};

export const getActiveStudentId = (): string => {
  return localStorage.getItem(KEYS.ACTIVE_STUDENT_ID) || 'stud-1';
};

export const saveActiveStudentId = (id: string) => {
  localStorage.setItem(KEYS.ACTIVE_STUDENT_ID, id);
};

export const resetAllDataToDefault = () => {
  localStorage.setItem(KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
  localStorage.setItem(KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
  localStorage.setItem(KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
  localStorage.setItem(KEYS.ANNOUNCEMENTS, JSON.stringify(INITIAL_ANNOUNCEMENTS));
  localStorage.setItem(KEYS.CERTIFICATES, JSON.stringify(INITIAL_CERTIFICATES));
  localStorage.setItem(KEYS.RULES, JSON.stringify(SCORING_RULES));
  localStorage.setItem(KEYS.ACTIVE_ROLE, 'super_admin');
  localStorage.setItem(KEYS.ACTIVE_STUDENT_ID, 'stud-1');
};
