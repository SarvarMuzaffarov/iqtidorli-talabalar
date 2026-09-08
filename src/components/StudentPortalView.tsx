import React, { useState } from 'react';
import { 
  User, 
  Lightbulb, 
  Trophy, 
  Award, 
  Calendar, 
  Plus, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  BookOpen, 
  Download, 
  GraduationCap, 
  FileText, 
  TrendingUp, 
  Share2,
  AlertCircle,
  FolderGit2,
  Medal,
  ChevronRight,
  Edit3,
  Search,
  Filter,
  Bell,
  Check,
  Flame,
  FileCheck,
  QrCode
} from 'lucide-react';
import { Student, Project, UniversityEvent, Certificate, Achievement, AchievementCategory, Announcement } from '../types';
import { useEyeCare } from '../context/EyeCareContext';
import { UserAvatar } from './UserAvatar';
import { EditStudentModal } from './EditStudentModal';
import { RegisterEventModal } from './RegisterEventModal';

interface StudentPortalViewProps {
  student: Student;
  allProjects: Project[];
  allEvents: UniversityEvent[];
  allCertificates: Certificate[];
  allStudents?: Student[];
  allAnnouncements?: Announcement[];
  onSelectProject: (project: Project) => void;
  onSelectCertificate: (certificate: Certificate) => void;
  onOpenVerifyModal: (certNumber?: string) => void;
  onNavigateTab: (tab: any) => void;
  onAddProject: (newProject: Project) => void;
  onSubmitAchievement: (studentId: string, achievement: Achievement) => void;
  onRegisterForEvent?: (eventId: string, studentId: string, projectId?: string, projectName?: string, topicOrNote?: string) => void;
  onUnregisterForEvent?: (eventId: string, studentId: string) => void;
  onUpdateStudentProfile?: (updatedStudent: Student) => void;
  rank?: number;
}

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({
  student,
  allProjects = [],
  allEvents = [],
  allCertificates = [],
  allStudents = [],
  allAnnouncements = [],
  onSelectProject,
  onSelectCertificate,
  onOpenVerifyModal,
  onNavigateTab,
  onAddProject,
  onSubmitAchievement,
  onRegisterForEvent,
  onUnregisterForEvent,
  onUpdateStudentProfile,
  rank = 1,
}) => {
  const [activeSection, setActiveSection] = useState<'projects' | 'achievements' | 'certificates' | 'events' | 'rating' | 'announcements' | 'recommendation'>('projects');
  const { mode: eyeMode } = useEyeCare();
  const isDark = eyeMode === 'calm-dark';
  const isSepia = eyeMode === 'warm-sepia';

  // Eye-friendly banner styling
  const heroBannerClass = isDark
    ? 'bg-gradient-to-br from-[#161f2e] via-[#121926] to-[#0e141f] border-[#253347] text-slate-100'
    : isSepia
    ? 'bg-gradient-to-br from-[#382f28] via-[#312922] to-[#28211b] border-[#4d4034] text-[#faf6ef]'
    : 'bg-gradient-to-br from-[#1e293b] via-[#1a2332] to-[#0f172a] border-slate-700/80 text-slate-100';

  const heroMetricsClass = isDark
    ? 'bg-[#1a2436]/90 border-[#2c3d55]'
    : isSepia
    ? 'bg-[#29221b]/90 border-[#42372d]'
    : 'bg-slate-800/85 border-slate-700/80';

  const tabContainerBorder = isDark
    ? 'border-[#2a364d]'
    : isSepia
    ? 'border-[#e8e0d5]'
    : 'border-slate-200';

  const getTabClass = (isActive: boolean) => {
    if (isActive) {
      if (isSepia) return 'bg-[#45382e] text-[#faf6ef] shadow-xs';
      if (isDark) return 'bg-sky-600 text-white shadow-xs';
      return 'bg-sky-700 text-white shadow-xs';
    }
    if (isSepia) return 'bg-[#fffdf9] text-[#554940] hover:bg-[#f4ede2] border border-[#e8e0d5]';
    if (isDark) return 'bg-[#1a2232] text-slate-300 hover:bg-[#242e42] border border-[#2a364d]';
    return 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/90';
  };

  const getTabBadgeClass = (isActive: boolean) => {
    if (isActive) {
      if (isSepia) return 'bg-[#312720] text-amber-200';
      if (isDark) return 'bg-sky-800 text-white';
      return 'bg-sky-800 text-white';
    }
    if (isSepia) return 'bg-[#f4ede2] text-[#554940]';
    if (isDark) return 'bg-[#242e42] text-slate-300';
    return 'bg-slate-100 text-slate-700';
  };

  const cardBgClass = isDark
    ? 'bg-[#1a2232] border-[#2a364d] text-slate-100'
    : isSepia
    ? 'bg-[#fffdf9] border-[#e8e0d5] text-[#2d2621]'
    : 'bg-white border-slate-200/90 text-slate-800';

  const subCardBgClass = isDark
    ? 'bg-[#151c28] border-[#253347] text-slate-200'
    : isSepia
    ? 'bg-[#faf6ef] border-[#e8e0d5] text-[#3d332b]'
    : 'bg-slate-50 border-slate-100 text-slate-700';

  const titleTextClass = isDark
    ? 'text-slate-100'
    : isSepia
    ? 'text-[#2d2621]'
    : 'text-slate-900';

  const subTextClass = isDark
    ? 'text-slate-400'
    : isSepia
    ? 'text-[#786d63]'
    : 'text-slate-500';
  
  // Modals for student actions
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);
  const [newAchievementModalOpen, setNewAchievementModalOpen] = useState(false);
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [registerEventModalOpen, setRegisterEventModalOpen] = useState(false);
  const [selectedEventForReg, setSelectedEventForReg] = useState<UniversityEvent | null>(null);

  // New Project Form State
  const [projName, setProjName] = useState('');
  const [projDirection, setProjDirection] = useState('Biotexnologiya va yashil kimyo');
  const [projProblem, setProjProblem] = useState('');
  const [projSolution, setProjSolution] = useState('');
  const [projStage, setProjStage] = useState<'goya' | 'tadqiqot' | 'prototip' | 'sinovda' | 'tijoratlashtirish'>('prototip');
  const [projFunding, setProjFunding] = useState('Institut startap inkubatori');
  const [projTeam, setProjTeam] = useState('3 nafar talaba');
  const [projPresentationName, setProjPresentationName] = useState('');
  const [projPresentationUrl, setProjPresentationUrl] = useState('');

  // New Achievement Form State
  const [achTitle, setAchTitle] = useState('');
  const [achCategory, setAchCategory] = useState<AchievementCategory>('maqola');
  const [achLevel, setAchLevel] = useState<'respublika_1' | 'respublika_qatnashish' | 'xalqaro' | 'viloyat' | 'universitet'>('respublika_1');
  const [achDesc, setAchDesc] = useState('');
  const [achPoints, setAchPoints] = useState(50);
  const [achDate, setAchDate] = useState(new Date().toISOString().split('T')[0]);
  const [achIssuer, setAchIssuer] = useState('OAK jurnali / Ilmiy konferensiya');
  const [achDocName, setAchDocName] = useState('');
  const [achDocUrl, setAchDocUrl] = useState('');

  // Top 100 Search & Filters
  const [top100Search, setTop100Search] = useState('');
  const [top100FacultyFilter, setTop100FacultyFilter] = useState('all');

  const handlePresentationFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProjPresentationName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setProjPresentationUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAchDocName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAchDocUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Filter student's own projects
  const myProjects = allProjects.filter((p) => 
    (student.projectIds && student.projectIds.includes(p.id)) ||
    p.teamMembers?.some((m) => m.name.toLowerCase().includes(student.fullName.toLowerCase().split(' ')[0]))
  );

  // Filter student's own certificates
  const myCertificates = allCertificates.filter((c) => 
    c.studentId === student.id || 
    c.studentName?.toLowerCase() === student.fullName.toLowerCase() ||
    (student.certificateIds && student.certificateIds.includes(c.id))
  );

  // Filter student's registered events
  const myEvents = allEvents.filter((e) => 
    e.registeredStudentIds && e.registeredStudentIds.includes(student.id)
  );

  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projName.trim()) return;

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: projName.trim(),
      direction: projDirection,
      problem: projProblem.trim() || 'Muammo tavsifi kiritilmadi',
      solution: projSolution.trim() || 'Yechim taklifi kiritildi',
      description: `${projProblem.trim()} — ${projSolution.trim()}`,
      teamMembers: [
        { id: student.id, name: student.fullName, role: 'Loyiha rahbari' },
        { id: 'member-2', name: 'Jamoa a’zosi', role: 'Tadqiqotchi' }
      ],
      supervisor: student.scientificSupervisor || 'Institut ilmiy rahbari',
      stage: projStage,
      hasPrototype: projStage === 'prototip' || projStage === 'sinovda' || projStage === 'tijoratlashtirish',
      funding: projFunding,
      awards: 'Yangi taqdim etilgan startap loyiha',
      presentationUrl: projPresentationUrl || undefined,
      presentationName: projPresentationName || undefined,
      imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
      status: 'faol',
      createdAt: new Date().toISOString().split('T')[0]
    };

    onAddProject(newProject);
    setNewProjectModalOpen(false);
    setProjName('');
    setProjProblem('');
    setProjSolution('');
    setProjPresentationName('');
    setProjPresentationUrl('');
  };

  const handleCreateAchievementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!achTitle.trim()) return;

    const newAch: Achievement = {
      id: `ach-${Date.now()}`,
      studentId: student.id,
      category: achCategory,
      title: achTitle.trim(),
      description: achDesc.trim() || 'Ilmiy yutuq tavsifi',
      date: achDate,
      level: achLevel,
      points: Number(achPoints) || 50,
      documentUrl: achDocUrl || undefined,
      documentName: achDocName || undefined,
      verified: false, // will be verified by supervisor
      verifiedBy: student.scientificSupervisor,
      issuer: achIssuer.trim() || 'Rasmiy tashkilot'
    };

    onSubmitAchievement(student.id, newAch);
    setNewAchievementModalOpen(false);
    setAchTitle('');
    setAchDesc('');
    setAchDocName('');
    setAchDocUrl('');
  };

  return (
    <div className="space-y-6 pb-16 w-full max-w-full overflow-hidden">
      
      {/* 1. STUDENT HERO PROFILE BANNER */}
      <div className={`relative ${heroBannerClass} rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm overflow-hidden transition-colors duration-150 w-full max-w-full`}>
        {/* Subtle decorative tone */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 w-full">
            <div className="relative shrink-0">
              <UserAvatar
                src={student.avatarUrl}
                name={student.fullName}
                size="xl"
                className="rounded-2xl border-2 border-amber-400/80 shadow-md"
              />
              <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-xs shadow-md flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 fill-current" />
                #{rank}
              </span>
            </div>

            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-bold">
                  {student.studentIdNumber}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[11px] font-bold">
                  {student.course}-kurs • {student.group}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                  GPA: {student.gpa.toFixed(2)}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight break-words">
                {student.fullName}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                {student.faculty} • <span className="text-sky-300">{student.direction}</span>
              </p>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-300 pt-1">
                <span>Ilmiy rahbar: <strong className="text-amber-300">{student.scientificSupervisor}</strong></span>
                <span className="hidden sm:inline">•</span>
                <span>Aloqa: <strong className="text-white">{student.phone}</strong></span>
                <span className="hidden sm:inline">•</span>
                <span>Telegram: <strong className="text-sky-300">@{student.telegramUsername?.replace('@', '')}</strong></span>
              </div>

              {onUpdateStudentProfile && (
                <div className="pt-2">
                  <button
                    id="student-edit-profile-btn"
                    type="button"
                    onClick={() => setEditProfileModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition shadow-xs"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-300" />
                    <span>Profil ma’lumotlarini tahrirlash</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Points & Ranking Metric Card */}
          <div className={`${heroMetricsClass} border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between w-full md:w-auto gap-3 shrink-0 shadow-inner`}>
            <div>
              <div className="text-[11px] text-slate-300 font-bold uppercase tracking-wider text-left md:text-right">
                Jami To‘plangan Ball
              </div>
              <div className="text-2xl sm:text-4xl font-black text-amber-400 tracking-tight flex items-baseline gap-1 md:justify-end">
                {student.totalPoints}
                <span className="text-xs font-semibold text-slate-300">ball</span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <button
                id="student-add-achievement-quick-btn"
                onClick={() => setNewAchievementModalOpen(true)}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition shadow-xs flex-1 sm:flex-initial"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Yangi yutuq kiritish</span>
              </button>
              <button
                id="student-add-project-quick-btn"
                onClick={() => setNewProjectModalOpen(true)}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition shadow-xs flex-1 sm:flex-initial"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Loyiha qo‘shish</span>
              </button>
            </div>
          </div>
        </div>

        {/* Competencies Tags */}
        <div className="mt-5 pt-4 sm:mt-6 sm:pt-5 border-t border-slate-700/60 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-300 font-semibold mr-1">Kompetensiyalar:</span>
          {student.competencies?.map((c, i) => (
            <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-200 text-xs font-medium border border-slate-700/70">
              {c}
            </span>
          ))}
          <span className="text-xs text-slate-300 font-semibold mx-1">Qiziqishlar:</span>
          {student.interests?.map((item, i) => (
            <span key={i} className="px-2.5 py-1 rounded-lg bg-sky-950/70 text-sky-300 text-xs font-medium border border-sky-800/60">
              #{item}
            </span>
          ))}
        </div>
      </div>

      {/* 2. SECTION NAVIGATION TABS */}
      <div className={`flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 border-b ${tabContainerBorder} scrollbar-none w-full max-w-full`}>
        <button
          id="student-tab-projects"
          onClick={() => setActiveSection('projects')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${getTabClass(activeSection === 'projects')}`}
        >
          <Lightbulb className="w-4 h-4" />
          <span>Mening Loyihalarim</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${getTabBadgeClass(activeSection === 'projects')}`}>
            {myProjects.length}
          </span>
        </button>

        <button
          id="student-tab-achievements"
          onClick={() => setActiveSection('achievements')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${getTabClass(activeSection === 'achievements')}`}
        >
          <Trophy className="w-4 h-4" />
          <span>Erishgan Yutuqlarim</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${getTabBadgeClass(activeSection === 'achievements')}`}>
            {student.achievements?.length || 0}
          </span>
        </button>

        <button
          id="student-tab-certificates"
          onClick={() => setActiveSection('certificates')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${getTabClass(activeSection === 'certificates')}`}
        >
          <Award className="w-4 h-4" />
          <span>Sertifikatlarim & QR</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${getTabBadgeClass(activeSection === 'certificates')}`}>
            {myCertificates.length}
          </span>
        </button>

        <button
          id="student-tab-events"
          onClick={() => setActiveSection('events')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${getTabClass(activeSection === 'events')}`}
        >
          <Calendar className="w-4 h-4" />
          <span>Tadbirlar & Qatnashish</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${getTabBadgeClass(activeSection === 'events')}`}>
            {myEvents.length}
          </span>
        </button>

        <button
          id="student-tab-rating"
          onClick={() => setActiveSection('rating')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${getTabClass(activeSection === 'rating')}`}
        >
          <Flame className="w-4 h-4 text-amber-500" />
          <span>Top 100 Reytingi</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${getTabBadgeClass(activeSection === 'rating')}`}>
            #{rank}
          </span>
        </button>

        <button
          id="student-tab-announcements"
          onClick={() => setActiveSection('announcements')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${getTabClass(activeSection === 'announcements')}`}
        >
          <Bell className="w-4 h-4 text-sky-500" />
          <span>E'lonlar & Yangiliklar</span>
          {allAnnouncements && allAnnouncements.length > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${getTabBadgeClass(activeSection === 'announcements')}`}>
              {allAnnouncements.length}
            </span>
          )}
        </button>

        <button
          id="student-tab-recommendation"
          onClick={() => setActiveSection('recommendation')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${getTabClass(activeSection === 'recommendation')}`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Ilmiy Rahbar Tavsiyasi</span>
        </button>
      </div>

      {/* 3. SECTION CONTENT */}

      {/* SECTION A: MY PROJECTS */}
      {activeSection === 'projects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                Mening Startap va Ilmiy Loyihalarim
              </h2>
              <p className="text-xs text-slate-500">
                Siz rahbarlik qilayotgan va jamoasida qatnashayotgan barcha ilmiy-innovatsion ishlanmalar
              </p>
            </div>

            <button
              id="student-create-project-btn"
              onClick={() => setNewProjectModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi loyiha kiritish</span>
            </button>
          </div>

          {myProjects.length === 0 ? (
            <div className={`${cardBgClass} rounded-2xl border border-dashed p-8 text-center space-y-3`}>
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mx-auto text-amber-500">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h3 className={`text-sm font-bold ${titleTextClass}`}>Hozircha loyihalar ro‘yxatga olinmagan</h3>
              <p className={`text-xs ${subTextClass} max-w-md mx-auto`}>
                Siz o‘z startap g‘oyangiz yoki ilmiy laboratoriya tadqiqotingizni tizimga kiritib, grantlar va inkubatsiyaga tavsiya olishingiz mumkin.
              </p>
              <button
                onClick={() => setNewProjectModalOpen(true)}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg transition"
              >
                Birinchi loyihangizni qo‘shing
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myProjects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => onSelectProject(proj)}
                  className={`${cardBgClass} rounded-2xl border p-5 hover:shadow-md transition cursor-pointer flex flex-col justify-between group`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                          {proj.direction}
                        </span>
                        <h3 className={`font-extrabold text-sm ${titleTextClass} group-hover:text-sky-500 transition mt-1.5`}>
                          {proj.name}
                        </h3>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        proj.hasPrototype
                          ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-600 border border-amber-500/30'
                      }`}>
                        {proj.hasPrototype ? 'Prototip tayyor' : 'Tadqiqot bosqichida'}
                      </span>
                    </div>

                    <p className={`text-xs ${subTextClass} line-clamp-2`}>
                      {proj.description}
                    </p>

                    <div className={`${subCardBgClass} rounded-xl p-3 text-xs space-y-1 border`}>
                      <div className="flex items-center justify-between">
                        <span className={subTextClass}>Moliyalashtirish / Grant:</span>
                        <strong className={titleTextClass}>{proj.funding}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={subTextClass}>Ilmiy rahbar:</span>
                        <strong className={titleTextClass}>{proj.supervisor}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={subTextClass}>Sovrin / Natija:</span>
                        <strong className="text-amber-500">{proj.awards}</strong>
                      </div>
                    </div>
                  </div>

                  <div className={`mt-4 pt-3 border-t ${isDark ? 'border-[#2a364d]' : isSepia ? 'border-[#e8e0d5]' : 'border-slate-100'} flex items-center justify-between text-xs`}>
                    <span className={subTextClass}>
                      Jamoa: <strong className={titleTextClass}>{proj.teamMembers.length} nafar</strong>
                    </span>
                    <span className="text-sky-500 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition">
                      Batafsil ko‘rish <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION B: MY ACHIEVEMENTS */}
      {activeSection === 'achievements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-base font-bold ${titleTextClass} flex items-center gap-2`}>
                <Trophy className="w-4 h-4 text-amber-500" />
                Erishgan Yutuqlarim Xronologiyasi
              </h2>
              <p className={`text-xs ${subTextClass}`}>
                Olimpiadalar, ilmiy maqolalar, tanlovlar va mukofotlar orqali to‘plangan reyting ballari
              </p>
            </div>

            <button
              id="student-add-achievement-btn"
              onClick={() => setNewAchievementModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi yutuq kiritish</span>
            </button>
          </div>

          <div className="space-y-3">
            {student.achievements && student.achievements.length > 0 ? (
              student.achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`${cardBgClass} rounded-2xl border p-4.5 hover:shadow-xs transition flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0 mt-0.5">
                      <Medal className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${subCardBgClass}`}>
                          {ach.category}
                        </span>
                        <span className={`text-[10px] font-semibold ${subTextClass}`}>
                          {ach.date}
                        </span>
                        {ach.verified ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Tasdiqlangan
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 border border-amber-500/30 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Ilmiy rahbar ko‘rib chiqmoqda
                          </span>
                        )}
                      </div>

                      <h4 className={`text-sm font-extrabold ${titleTextClass} mt-1`}>
                        {ach.title}
                      </h4>
                      {ach.description && (
                        <p className={`text-xs ${subTextClass} mt-0.5`}>
                          {ach.description}
                        </p>
                      )}
                      {ach.issuer && (
                        <p className={`text-[11px] ${subTextClass} mt-1`}>
                          Beruvchi tashkilot: <strong className={titleTextClass}>{ach.issuer}</strong>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className={`flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 ${isDark ? 'border-[#2a364d]' : isSepia ? 'border-[#e8e0d5]' : 'border-slate-100'}`}>
                    <div className="text-right">
                      <div className="text-lg font-black text-amber-500">
                        +{ach.points}
                      </div>
                      <div className={`text-[10px] font-bold ${subTextClass} uppercase`}>
                        reyting bali
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={`${cardBgClass} rounded-2xl border border-dashed p-8 text-center`}>
                <p className={`text-xs ${subTextClass}`}>Hozircha yutuqlar qo‘shilmagan.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION C: MY CERTIFICATES & QR */}
      {activeSection === 'certificates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                Mening Rasmiy Sertifikatlarim & QR-Kod
              </h2>
              <p className="text-xs text-slate-500">
                Institut tomonidan berilgan va QR-kod orqali haqiqiyligi tekshiriladigan rasmiy sertifikatlar
              </p>
            </div>

            <button
              onClick={() => onOpenVerifyModal()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
            >
              <QrCode className="w-4 h-4" />
              <span>QR Tekshiruv</span>
            </button>
          </div>

          {myCertificates.length === 0 ? (
            <div className={`${cardBgClass} rounded-2xl border border-dashed p-8 text-center space-y-3`}>
              <Award className={`w-8 h-8 ${subTextClass} mx-auto`} />
              <h3 className={`text-sm font-bold ${titleTextClass}`}>Sertifikatlar mavjud emas</h3>
              <p className={`text-xs ${subTextClass} max-w-md mx-auto`}>
                Institut tanlovlari, olimpiadalari yoki xakatonlarida qatnashib, rasmiy QR-kodli elektron sertifikatga ega bo‘ling.
              </p>
              <button
                onClick={() => onNavigateTab('events')}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg transition"
              >
                Tadbirlar ro‘yxatini ko‘rish
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myCertificates.map((cert) => (
                <div
                  key={cert.id}
                  className={`${cardBgClass} rounded-2xl border p-5 hover:shadow-md transition space-y-3 relative overflow-hidden`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                        {cert.certificateNumber}
                      </span>
                      <h4 className={`font-extrabold text-sm ${titleTextClass} mt-2`}>
                        {cert.eventName}
                      </h4>
                      <p className={`text-xs ${subTextClass} mt-1`}>
                        Sabab: {cert.reason}
                      </p>
                    </div>

                    <div className={`w-14 h-14 ${subCardBgClass} rounded-xl p-1 flex items-center justify-center shrink-0`}>
                      <QrCode className="w-10 h-10 text-emerald-600" />
                    </div>
                  </div>

                  <div className={`pt-3 border-t ${isDark ? 'border-[#2a364d]' : isSepia ? 'border-[#e8e0d5]' : 'border-slate-100'} flex items-center justify-between text-xs`}>
                    <span className={subTextClass}>
                      Sana: <strong className={titleTextClass}>{cert.issueDate}</strong>
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectCertificate(cert)}
                        className={`px-2.5 py-1 rounded-lg font-bold transition ${isDark ? 'bg-sky-950 text-sky-300 hover:bg-sky-900' : 'bg-sky-50 text-sky-700 hover:bg-sky-100'}`}
                      >
                        Sertifikatni ochish
                      </button>
                      <button
                        onClick={() => onOpenVerifyModal(cert.certificateNumber)}
                        className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${isDark ? 'bg-emerald-950 text-emerald-300 hover:bg-emerald-900' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        Tekshirish
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION D: MY REGISTERED EVENTS & OPEN EVENTS */}
      {activeSection === 'events' && (
        <div className="space-y-6">
          {/* Registered Events */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-base font-bold ${titleTextClass} flex items-center gap-2`}>
                  <Calendar className="w-4 h-4 text-sky-600" />
                  Mening Qatnashayotgan Tadbirlarim
                </h2>
                <p className={`text-xs ${subTextClass}`}>
                  Siz ro‘yxatdan o‘tgan institut tadbirlari va xakatonlari
                </p>
              </div>
            </div>

            {myEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {myEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className={`${cardBgClass} rounded-2xl border p-4 hover:shadow-xs transition flex flex-col justify-between gap-3`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Ro‘yxatdan o‘tilgan
                        </span>
                        <span className={`text-[11px] font-medium ${subTextClass}`}>
                          {ev.date} • {ev.time}
                        </span>
                      </div>
                      <h4 className={`text-sm font-extrabold ${titleTextClass} mt-2`}>
                        {ev.title}
                      </h4>
                      <p className={`text-xs ${subTextClass} mt-1`}>
                        📍 Manzil: {ev.location}
                      </p>
                      <p className={`text-[11px] ${subTextClass} mt-0.5`}>
                        Mas’ul: <strong className={titleTextClass}>{ev.responsiblePerson}</strong>
                      </p>
                    </div>

                    <div className={`pt-2 border-t flex items-center justify-between text-xs ${isDark ? 'border-[#2a364d]' : isSepia ? 'border-[#e8e0d5]' : 'border-slate-100'}`}>
                      <button
                        type="button"
                        onClick={() => onNavigateTab('events')}
                        className="text-sky-500 font-bold hover:underline"
                      >
                        Batafsil ma’lumot
                      </button>
                      {onUnregisterForEvent && (
                        <button
                          type="button"
                          onClick={() => onUnregisterForEvent(ev.id, student.id)}
                          className="px-2.5 py-1 text-[11px] font-bold rounded-lg text-rose-600 hover:bg-rose-500/10 transition"
                        >
                          Bekor qilish
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`${cardBgClass} rounded-2xl border border-dashed p-6 text-center space-y-2`}>
                <p className={`text-xs ${subTextClass}`}>Siz hali biron tadbirga ro‘yxatdan o‘tmadingiz. Quyidagi ochiq tadbirlardan birini tanlang!</p>
              </div>
            )}
          </div>

          {/* Open Events to Register */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-sm font-bold ${titleTextClass} flex items-center gap-2`}>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Barcha Ochiq Tadbirlar va Tanlovlar
                </h3>
                <p className={`text-xs ${subTextClass}`}>
                  Ro‘yxatdan o‘tib, startap loyihangiz bilan qatnashing yoki yangi sertifikat yuting
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('events')}
                className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1"
              >
                <span>Barchasini ko‘rish</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {allEvents.map((ev) => {
                const isRegistered = ev.registeredStudentIds?.includes(student.id);
                return (
                  <div
                    key={ev.id}
                    className={`${cardBgClass} rounded-2xl border p-4.5 hover:shadow-sm transition flex flex-col justify-between gap-3`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          ev.type === 'xakaton' 
                            ? 'bg-purple-500/15 text-purple-600'
                            : ev.type === 'tanlov'
                            ? 'bg-amber-500/15 text-amber-600'
                            : 'bg-sky-500/15 text-sky-600'
                        }`}>
                          {ev.type}
                        </span>
                        <span className={`text-[11px] font-medium ${subTextClass}`}>
                          {ev.date}
                        </span>
                      </div>

                      <h4 className={`text-sm font-extrabold ${titleTextClass} mt-2`}>
                        {ev.title}
                      </h4>
                      <p className={`text-xs ${subTextClass} mt-1 line-clamp-2`}>
                        {ev.description}
                      </p>
                      <div className={`mt-2 text-[11px] ${subTextClass}`}>
                        📍 {ev.location} • Mas’ul: <strong className={titleTextClass}>{ev.responsiblePerson}</strong>
                      </div>
                    </div>

                    <div className={`pt-3 border-t flex items-center justify-between text-xs ${isDark ? 'border-[#2a364d]' : isSepia ? 'border-[#e8e0d5]' : 'border-slate-100'}`}>
                      <span className={`text-[11px] ${subTextClass}`}>
                        Ishtirokchilar: <strong className={titleTextClass}>{ev.registeredStudentIds?.length || 0} nafar</strong>
                      </span>

                      {isRegistered ? (
                        <span className="px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-600 text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Ro‘yxatdan o‘tgansiz
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedEventForReg(ev);
                            setRegisterEventModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition shadow-xs flex items-center gap-1"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Ro‘yxatdan o‘tish</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SECTION E: TOP 100 RATING LEADERBOARD */}
      {activeSection === 'rating' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className={`text-base font-bold ${titleTextClass} flex items-center gap-2`}>
                <Flame className="w-4 h-4 text-amber-500" />
                TKTI Yangiyer Filiali Top 100 Iqtidorli Talabalar Reytingi
              </h2>
              <p className={`text-xs ${subTextClass}`}>
                Talabalarning ilmiy maqolalari, startaplari, GPA ko‘rsatkichi va olimpiada yutuqlari bo‘yicha umumiy reytingi
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={top100Search}
                  onChange={(e) => setTop100Search(e.target.value)}
                  placeholder="Ism yoki ID bo‘yicha qidiruv..."
                  className={`pl-8 pr-3 py-1.5 rounded-lg border text-xs w-48 sm:w-56 focus:outline-none focus:border-sky-500 ${
                    isDark ? 'bg-[#151c28] border-[#2a364d] text-white' : 'bg-white border-slate-200 text-slate-800'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Current Student's Rank Alert Card */}
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs ${
            isDark ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : isSepia ? 'bg-amber-100/60 border-amber-300 text-amber-900' : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black text-base flex items-center justify-center shadow-xs shrink-0">
                #{rank}
              </div>
              <div>
                <h4 className="font-extrabold text-sm">Sizning joriy o‘rningiz: #{rank}-o‘rin</h4>
                <p className="text-xs opacity-90">
                  {student.fullName} • To‘plangan jami ball: <strong>{student.totalPoints} ball</strong> (GPA: {student.gpa.toFixed(2)})
                </p>
              </div>
            </div>
            <button
              onClick={() => setNewAchievementModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition shadow-xs shrink-0"
            >
              Ballarni oshirish (+ Yutuq kiritish)
            </button>
          </div>

          {/* Ranking Table / List */}
          <div className={`${cardBgClass} rounded-2xl border overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-[#2a364d] bg-[#141b27] text-slate-400' : isSepia ? 'border-[#e8e0d5] bg-[#f8f2e7] text-[#715c48]' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
                    <th className="py-3 px-4 font-bold text-center w-16">O‘rin</th>
                    <th className="py-3 px-4 font-bold">Talaba</th>
                    <th className="py-3 px-4 font-bold">Yo‘nalish / Guruh</th>
                    <th className="py-3 px-4 font-bold text-center">GPA</th>
                    <th className="py-3 px-4 font-bold text-center">Yutuqlar</th>
                    <th className="py-3 px-4 font-bold text-right">Jami Ball</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {allStudents
                    .slice()
                    .sort((a, b) => b.totalPoints - a.totalPoints)
                    .filter((s) => {
                      if (!top100Search) return true;
                      const q = top100Search.toLowerCase();
                      return (
                        s.fullName.toLowerCase().includes(q) ||
                        s.studentIdNumber?.toLowerCase().includes(q) ||
                        s.direction?.toLowerCase().includes(q)
                      );
                    })
                    .map((st, idx) => {
                      const isMe = st.id === student.id;
                      const pos = idx + 1;
                      return (
                        <tr
                          key={st.id}
                          className={`transition ${
                            isMe
                              ? isDark
                                ? 'bg-amber-500/15 font-semibold text-amber-200'
                                : 'bg-amber-50/80 font-semibold text-amber-950'
                              : isDark
                              ? 'hover:bg-slate-800/40 text-slate-200'
                              : 'hover:bg-slate-50 text-slate-800'
                          }`}
                        >
                          <td className="py-3 px-4 text-center">
                            {pos === 1 ? (
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-xs">
                                🥇 1
                              </span>
                            ) : pos === 2 ? (
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-300 text-slate-950 font-black text-xs shadow-xs">
                                🥈 2
                              </span>
                            ) : pos === 3 ? (
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-600 text-white font-black text-xs shadow-xs">
                                🥉 3
                              </span>
                            ) : (
                              <span className="font-bold text-slate-500">#{pos}</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <UserAvatar
                                src={st.avatarUrl}
                                name={st.fullName}
                                size="sm"
                                className="rounded-lg shrink-0"
                              />
                              <div>
                                <div className="font-bold flex items-center gap-1.5">
                                  <span>{st.fullName}</span>
                                  {isMe && (
                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 font-black uppercase">
                                      Siz
                                    </span>
                                  )}
                                </div>
                                <div className={`text-[11px] ${subTextClass}`}>
                                  {st.studentIdNumber} • Rahbar: {st.scientificSupervisor}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium truncate max-w-[200px]">{st.direction}</div>
                            <div className={`text-[11px] ${subTextClass}`}>{st.course}-kurs, {st.group}</div>
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-emerald-600">
                            {st.gpa?.toFixed(2) || '4.50'}
                          </td>
                          <td className="py-3 px-4 text-center font-semibold">
                            {st.achievements?.length || 0} ta
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="font-black text-amber-500 text-sm">
                              {st.totalPoints}
                            </span>
                            <span className="text-[10px] text-slate-400 ml-1">ball</span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION F: ANNOUNCEMENTS & NEWS */}
      {activeSection === 'announcements' && (
        <div className="space-y-4">
          <div>
            <h2 className={`text-base font-bold ${titleTextClass} flex items-center gap-2`}>
              <Bell className="w-4 h-4 text-sky-500" />
              Institut Ilmiy E'lonlari va Yangiliklari
            </h2>
            <p className={`text-xs ${subTextClass}`}>
              Grantlar, xakatonlar, olimpiada qabullari va ilmiy maqolalar chop etish bo‘yicha e’lonlar
            </p>
          </div>

          <div className="space-y-3">
            {allAnnouncements && allAnnouncements.length > 0 ? (
              allAnnouncements.map((ann) => (
                <div
                  key={ann.id}
                  className={`${cardBgClass} rounded-2xl border p-5 hover:shadow-xs transition space-y-3`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        ann.priority === 'yuqori' 
                          ? 'bg-rose-500/15 text-rose-600 border border-rose-500/30'
                          : 'bg-sky-500/15 text-sky-600'
                      }`}>
                        {ann.category}
                      </span>
                      {ann.priority === 'yuqori' && (
                        <span className="text-[10px] font-bold text-rose-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Muhim
                        </span>
                      )}
                    </div>
                    <span className={`text-xs font-semibold ${subTextClass}`}>
                      {ann.date}
                    </span>
                  </div>

                  <div>
                    <h4 className={`text-sm font-extrabold ${titleTextClass}`}>
                      {ann.title}
                    </h4>
                    <p className={`text-xs ${subTextClass} mt-1 leading-relaxed`}>
                      {ann.content}
                    </p>
                  </div>

                  {ann.targetAudience && (
                    <div className={`pt-2 border-t flex items-center justify-between text-[11px] ${subTextClass} ${isDark ? 'border-[#2a364d]' : isSepia ? 'border-[#e8e0d5]' : 'border-slate-100'}`}>
                      <span>Kimlar uchun: <strong className={titleTextClass}>{ann.targetAudience}</strong></span>
                      <span>Muallif: <strong className={titleTextClass}>{ann.author}</strong></span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className={`${cardBgClass} rounded-2xl border border-dashed p-8 text-center`}>
                <p className={`text-xs ${subTextClass}`}>Hozircha yangi e’lonlar mavjud emas.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION G: SUPERVISOR RECOMMENDATION */}
      {activeSection === 'recommendation' && (
        <div className={`rounded-2xl border p-6 sm:p-8 space-y-5 shadow-xs transition-colors duration-150 ${
          isDark 
            ? 'bg-[#1a2232] border-[#2a364d] text-slate-100' 
            : isSepia 
            ? 'bg-[#fffdf9] border-[#e8e0d5] text-[#2d2621]' 
            : 'bg-white border-slate-200/90 text-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${
              isDark
                ? 'bg-[#242e42] border-[#344463] text-sky-300'
                : isSepia
                ? 'bg-[#f4ede2] border-[#e8e0d5] text-[#715c48]'
                : 'bg-sky-50 border-sky-200 text-sky-700'
            }`}>
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className={`text-base font-extrabold ${isDark ? 'text-slate-100' : isSepia ? 'text-[#2d2621]' : 'text-slate-900'}`}>
                Ilmiy Rahbar Taqrizi va Tavsiyanomasi
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : isSepia ? 'text-[#786d63]' : 'text-slate-500'}`}>
                Ilmiy rahbar: <strong className={isDark ? 'text-sky-300' : isSepia ? 'text-[#8a5b28]' : 'text-sky-700'}>{student.scientificSupervisor}</strong>
              </p>
            </div>
          </div>

          <div className={`p-5 rounded-xl border text-sm leading-relaxed space-y-3 ${
            isDark
              ? 'bg-[#151c28] border-[#2a364d] text-slate-200'
              : isSepia
              ? 'bg-[#faf6ef] border-[#e8e0d5] text-[#3d332b]'
              : 'bg-slate-50 border-slate-200/90 text-slate-700'
          }`}>
            <p className="italic">
              "{student.facultyRecommendation || 'Ushbu talaba o‘quv jarayonida va institut ilmiy-tadqiqot laboratoriyalarida yuqori faollik ko‘rsatib, davlat stipendiyalari va nufuzli xalqaro grantlarga tavsiya etiladi.'}"
            </p>
            <div className={`text-right text-xs font-bold pt-2 border-t ${
              isDark
                ? 'border-[#2a364d] text-sky-400'
                : isSepia
                ? 'border-[#e8e0d5] text-[#8a5b28]'
                : 'border-slate-200 text-slate-900'
            }`}>
              — {student.scientificSupervisor} (Kafedra dotsenti / professori)
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className={`p-4 rounded-xl border ${
              isDark
                ? 'bg-[#151c28] border-[#2a364d]'
                : isSepia
                ? 'bg-[#faf6ef] border-[#e8e0d5]'
                : 'bg-slate-50 border-slate-200'
            }`}>
              <span className={`font-semibold block mb-1 ${isDark ? 'text-slate-400' : isSepia ? 'text-[#786d63]' : 'text-slate-500'}`}>
                Talaba haqida xulosa (Bio):
              </span>
              <p className={`font-medium ${isDark ? 'text-slate-200' : isSepia ? 'text-[#2d2621]' : 'text-slate-800'}`}>
                {student.bio || 'Institut iqtidorli talabalar bazasida to‘liq ro‘yxatga olingan.'}
              </p>
            </div>
            <div className={`p-4 rounded-xl border ${
              isDark
                ? 'bg-[#151c28] border-[#2a364d]'
                : isSepia
                ? 'bg-[#faf6ef] border-[#e8e0d5]'
                : 'bg-slate-50 border-slate-200'
            }`}>
              <span className={`font-semibold block mb-1 ${isDark ? 'text-slate-400' : isSepia ? 'text-[#786d63]' : 'text-slate-500'}`}>
                Tavsiya etilgan yo‘nalishlar:
              </span>
              <p className={`font-medium ${isDark ? 'text-slate-200' : isSepia ? 'text-[#2d2621]' : 'text-slate-800'}`}>
                Magistratura, O‘zbekiston Respublikasi Prezidenti va Davlat stipendiyalari tanlovlari, Startap inkubatsiyasi.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL: ADD NEW PROJECT (FOR STUDENT) */}
      {newProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 my-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  Yangi Startap / Ilmiy Loyiha Kiritish
                </h3>
                <p className="text-xs text-slate-500">Institut innovatsiya bazasiga qo‘shiladi</p>
              </div>
              <button
                onClick={() => setNewProjectModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProjectSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Loyiha Nomi *</label>
                <input
                  type="text"
                  required
                  value={projName}
                  onChange={(e) => setProjName(e.target.value)}
                  placeholder="masalan: Eko-Biopolimer plyonka ishlab chiqarish"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-sky-500 focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Ilmiy yo‘nalish</label>
                <select
                  value={projDirection}
                  onChange={(e) => setProjDirection(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-sky-500 focus:outline-none text-xs"
                >
                  <option value="Biotexnologiya va yashil kimyo">Biotexnologiya va yashil kimyo</option>
                  <option value="Oziq-ovqat xavfsizligi va qayta ishlash">Oziq-ovqat xavfsizligi va qayta ishlash</option>
                  <option value="Polimerlar va kompozit materiallar">Polimerlar va kompozit materiallar</option>
                  <option value="Sun'iy intellekt va IoT texnologiyalari">Sun'iy intellekt va IoT texnologiyalari</option>
                  <option value="Neft-gaz kimyosi va energiya tejamkorlik">Neft-gaz kimyosi va energiya tejamkorlik</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Loyiha bosqichi</label>
                  <select
                    value={projStage}
                    onChange={(e) => setProjStage(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-sky-500 focus:outline-none text-xs"
                  >
                    <option value="goya">G‘oya bosqichida</option>
                    <option value="tadqiqot">Laboratoriya tadqiqotida</option>
                    <option value="prototip">Prototip tayyor</option>
                    <option value="sinovda">Sinov jarayonida</option>
                    <option value="tijoratlashtirish">Tijoratlashtirish</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kutilayotgan grant</label>
                  <input
                    type="text"
                    value={projFunding}
                    onChange={(e) => setProjFunding(e.target.value)}
                    placeholder="masalan: 30 mln so‘m"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-sky-500 focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Hal etilayotgan muammo</label>
                <textarea
                  rows={2}
                  value={projProblem}
                  onChange={(e) => setProjProblem(e.target.value)}
                  placeholder="Loyiha qanday dolzarb muammoni hal qiladi?"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-sky-500 focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Taklif etilayotgan innovatsion yechim</label>
                <textarea
                  rows={2}
                  value={projSolution}
                  onChange={(e) => setProjSolution(e.target.value)}
                  placeholder="Loyiha texnologiyasi qanday afzalliklarga ega?"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-sky-500 focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Prezentatsiya yoki Biznes-reja fayli (PDF, PPTX)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    id="project-presentation-file"
                    accept=".pdf,.pptx,.ppt,.docx,.doc"
                    onChange={handlePresentationFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="project-presentation-file"
                    className="cursor-pointer px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-300 transition flex items-center gap-1.5"
                  >
                    <FolderGit2 className="w-4 h-4 text-sky-600" />
                    <span>Fayl tanlash</span>
                  </label>
                  <span className="text-[11px] text-slate-500 truncate max-w-xs">
                    {projPresentationName || 'Fayl tanlanmagan'}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewProjectModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs"
                >
                  Loyihani kiritish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: ADD NEW ACHIEVEMENT (FOR STUDENT) */}
      {newAchievementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 my-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  Yangi Yutuq Kiritish (Tasdiqqa yuborish)
                </h3>
                <p className="text-xs text-slate-500">
                  Ilmiy rahbarga tasdiqqa yuboriladi va reyting ballingizga qo‘shiladi
                </p>
              </div>
              <button
                onClick={() => setNewAchievementModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAchievementSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Yutuq / Maqola / Sovrin nomi *</label>
                <input
                  type="text"
                  required
                  value={achTitle}
                  onChange={(e) => setAchTitle(e.target.value)}
                  placeholder="masalan: Xalqaro kimyo anjumani 1-o‘rin diplomi yoki Scopus maqola"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-sky-500 focus:outline-none text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kategoriya</label>
                  <select
                    value={achCategory}
                    onChange={(e) => {
                      const cat = e.target.value as AchievementCategory;
                      setAchCategory(cat);
                      if (cat === 'olimpiada' || cat === 'tanlov') setAchPoints(100);
                      else if (cat === 'xalqaro') setAchPoints(120);
                      else if (cat === 'maqola') setAchPoints(50);
                      else if (cat === 'grant') setAchPoints(80);
                      else if (cat === 'startap') setAchPoints(70);
                      else setAchPoints(20);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-sky-500 focus:outline-none text-xs"
                  >
                    <option value="maqola">Ilmiy maqola (Scopus/OAK)</option>
                    <option value="olimpiada">Fan olimpiadasi</option>
                    <option value="tanlov">Respublika tanlovi</option>
                    <option value="xalqaro">Xalqaro musobaqa / Sovrin</option>
                    <option value="grant">Davlat / Xalqaro grant</option>
                    <option value="startap">Startap g‘olibi</option>
                    <option value="sertifikat">Til yoki kasbiy sertifikat</option>
                    <option value="konferensiya">Anjuman tezisi / ma’ruzasi</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tegishli ball</label>
                  <input
                    type="number"
                    value={achPoints}
                    onChange={(e) => setAchPoints(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-sky-500 focus:outline-none text-xs font-bold text-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Darajasi</label>
                  <select
                    value={achLevel}
                    onChange={(e) => setAchLevel(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-sky-500 focus:outline-none text-xs"
                  >
                    <option value="xalqaro">Xalqaro daraja</option>
                    <option value="respublika_1">Respublika 1-o‘rin</option>
                    <option value="respublika_qatnashish">Respublika ishtirokchi</option>
                    <option value="universitet">Universitet miqyosida</option>
                    <option value="viloyat">Viloyat / Shahar</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Erishilgan sana</label>
                  <input
                    type="date"
                    value={achDate}
                    onChange={(e) => setAchDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-sky-500 focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Beruvchi tashkilot / Jurnal nomi</label>
                <input
                  type="text"
                  value={achIssuer}
                  onChange={(e) => setAchIssuer(e.target.value)}
                  placeholder="masalan: OAK jurnali, Innovatsion rivojlanish agentligi"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-sky-500 focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Qisqacha izoh / Havola</label>
                <textarea
                  rows={2}
                  value={achDesc}
                  onChange={(e) => setAchDesc(e.target.value)}
                  placeholder="Maqola DOI raqami, diplom raqami yoki yutuq tavsifi..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-sky-500 focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Sertifikat / Maqola skaner nusxasi (PDF, JPG, PNG)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    id="achievement-doc-file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleDocFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="achievement-doc-file"
                    className="cursor-pointer px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-300 transition flex items-center gap-1.5"
                  >
                    <FileCheck className="w-4 h-4 text-amber-600" />
                    <span>Hujjat yuklash</span>
                  </label>
                  <span className="text-[11px] text-slate-500 truncate max-w-xs">
                    {achDocName || 'Hujjat tanlanmagan'}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewAchievementModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs"
                >
                  Tasdiqqa yuborish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL: EDIT STUDENT PROFILE */}
      {editProfileModalOpen && onUpdateStudentProfile && (
        <EditStudentModal
          student={student}
          isOpen={editProfileModalOpen}
          onClose={() => setEditProfileModalOpen(false)}
          onSave={(updated) => {
            onUpdateStudentProfile(updated);
            setEditProfileModalOpen(false);
          }}
        />
      )}

      {/* 7. MODAL: REGISTER FOR EVENT */}
      {registerEventModalOpen && selectedEventForReg && (
        <RegisterEventModal
          event={selectedEventForReg}
          student={student}
          studentProjects={myProjects}
          isOpen={registerEventModalOpen}
          onClose={() => {
            setRegisterEventModalOpen(false);
            setSelectedEventForReg(null);
          }}
          onRegister={(eventId, studentId, projectId, projectName, note) => {
            onRegisterForEvent?.(eventId, studentId, projectId, projectName, note);
            setRegisterEventModalOpen(false);
            setSelectedEventForReg(null);
          }}
        />
      )}

    </div>
  );
};
