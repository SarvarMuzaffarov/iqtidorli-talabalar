export type UserRole = 'super_admin' | 'admin' | 'teacher' | 'student' | 'faculty';

export type AchievementCategory =
  | 'olimpiada'
  | 'tanlov'
  | 'grant'
  | 'sertifikat'
  | 'maqola'
  | 'konferensiya'
  | 'startap'
  | 'loyiha'
  | 'mukofot'
  | 'xalqaro';

export interface Achievement {
  id: string;
  studentId: string;
  category: AchievementCategory;
  title: string;
  description?: string;
  date: string;
  level: 'respublika_1' | 'respublika_qatnashish' | 'xalqaro' | 'viloyat' | 'universitet';
  points: number;
  documentUrl?: string;
  verified: boolean;
  verifiedBy?: string;
  issuer?: string;
}

export type ProjectStage = 'goya' | 'tadqiqot' | 'prototip' | 'sinovda' | 'tijoratlashtirish';

export interface Project {
  id: string;
  name: string;
  direction: string; // e.g. "Biotexnologiya", "Sun'iy intellekt", "Oziq-ovqat xavfsizligi"
  problem: string;
  solution: string;
  description: string;
  teamMembers: {
    id: string;
    name: string;
    role: string;
  }[];
  supervisor: string; // Ilmiy rahbar
  stage: ProjectStage;
  hasPrototype: boolean;
  funding: string; // e.g. "50,000,000 so'm (Innovatsion rivojlanish agentligi granti)"
  awards: string; // e.g. "Startup-2026 tanlovida 1-o'rin"
  files?: string[];
  imageUrl: string;
  videoUrl?: string;
  status: 'faol' | 'yakunlangan' | 'inkubatsiyada';
  createdAt: string;
}

export interface UniversityEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  targetAudience: string;
  registrationDeadline: string;
  capacityLimit: number;
  registeredStudentIds: string[];
  responsiblePerson: string;
  files?: string[];
  status: 'active' | 'completed' | 'upcoming';
  bannerImage?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  targetType: 'all' | 'faculty' | 'course' | 'direction' | 'talented_only' | 'project_participants';
  targetValue?: string; // e.g. "Oziq-ovqat texnologiyasi" or "3-kurs"
  date: string;
  author: string;
  urgent?: boolean;
  sentToTelegram?: boolean;
}

export interface Certificate {
  id: string;
  certificateNumber: string; // e.g. "IL-2026-00125"
  studentId: string;
  studentName: string;
  studentFaculty: string;
  eventId: string;
  eventName: string;
  issueDate: string;
  qrVerificationUrl: string;
  reason: string;
  signatory: string;
  signatoryTitle: string;
  status: 'valid' | 'revoked';
}

export interface Student {
  id: string;
  studentIdNumber: string; // e.g. "TKTI-2022-458"
  fullName: string;
  faculty: string;
  direction: string;
  course: number;
  group: string;
  phone: string;
  email: string;
  avatarUrl: string;
  telegramUsername: string;
  interests: string[];
  competencies: string[];
  gpa: number;
  scientificSupervisor: string;
  totalPoints: number;
  achievements: Achievement[];
  projectIds: string[];
  certificateIds: string[];
  bio?: string;
  facultyRecommendation?: string;
}

export interface ScoringRule {
  activity: string;
  points: number;
  category: AchievementCategory;
  description: string;
}
