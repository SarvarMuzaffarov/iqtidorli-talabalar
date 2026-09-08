import React from 'react';
import { 
  Users, 
  Lightbulb, 
  Trophy, 
  Calendar, 
  Award, 
  Megaphone, 
  TrendingUp, 
  ChevronRight, 
  Plus, 
  Sparkles,
  CheckCircle2,
  ExternalLink,
  QrCode,
  GraduationCap,
  Send,
  UserPlus,
  ShieldCheck
} from 'lucide-react';
import { Student, Project, UniversityEvent, Announcement, Certificate, UserRole } from '../types';
import { TktiyfLogo } from './TktiyfLogo';
import { useEyeCare } from '../context/EyeCareContext';

interface DashboardViewProps {
  students?: Student[];
  projects?: Project[];
  events?: UniversityEvent[];
  announcements?: Announcement[];
  certificates?: Certificate[];
  currentRole: UserRole;
  onSelectStudent: (student: Student) => void;
  onSelectProject?: (project: Project) => void;
  onOpenAddStudent?: () => void;
  onOpenAddTeacher?: () => void;
  onOpenAddProject?: () => void;
  onOpenCreateEvent?: () => void;
  onOpenCreateAnnouncement?: () => void;
  onOpenIssueCertificate?: () => void;
  onOpenVerifyModal?: () => void;
  onNavigateTab: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students = [],
  projects = [],
  events = [],
  announcements = [],
  certificates = [],
  currentRole,
  onSelectStudent,
  onSelectProject,
  onOpenAddStudent,
  onOpenAddTeacher,
  onOpenAddProject,
  onOpenCreateEvent,
  onOpenCreateAnnouncement,
  onOpenIssueCertificate,
  onOpenVerifyModal,
  onNavigateTab,
}) => {
  const safeStudents = Array.isArray(students) ? students : [];
  const safeProjects = Array.isArray(projects) ? projects : [];
  const safeEvents = Array.isArray(events) ? events : [];
  const safeAnnouncements = Array.isArray(announcements) ? announcements : [];
  const safeCertificates = Array.isArray(certificates) ? certificates : [];
  const { mode } = useEyeCare();

  const isDark = mode === 'calm-dark';
  const isSepia = mode === 'warm-sepia';

  const cardClass = isDark
    ? 'bg-[#1a2232] border-[#2a364d] text-slate-100'
    : isSepia
    ? 'bg-[#fffdf9] border-[#e8e0d5] text-[#2d2621]'
    : 'bg-white border-slate-200/90 text-slate-800';

  const subtleClass = isDark
    ? 'bg-[#242e42] border-[#374563] text-slate-300'
    : isSepia
    ? 'bg-[#f4ede2] border-[#dfd4c5] text-[#63564c]'
    : 'bg-slate-50 border-slate-100 text-slate-600';

  const bannerClass = isDark
    ? 'bg-gradient-to-r from-[#162032] via-[#1a263c] to-[#162032] border-[#2a364d]'
    : isSepia
    ? 'bg-gradient-to-r from-[#382f28] via-[#463b33] to-[#382f28] border-[#55473d]'
    : 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-slate-800';

  // Sort students by total points descending
  const sortedStudents = [...safeStudents].sort((a, b) => b.totalPoints - a.totalPoints);
  const top3 = sortedStudents.slice(0, 3);

  // Total achievements calculation
  const totalAchievements = safeStudents.reduce((acc, s) => acc + (s.achievements || []).length, 0);

  // Prompt KPI baseline display values - strictly based on real existing data
  const kpiStats = [
    {
      id: 'kpi-students',
      label: 'Jami iqtidorli talabalar',
      value: safeStudents.length,
      icon: Users,
      color: 'sky',
      subtext: `${safeStudents.filter(s => s.gpa >= 4.5).length} nafar a'lochi (GPA ≥ 4.5)`,
      action: () => onNavigateTab('students'),
    },
    {
      id: 'kpi-projects',
      label: 'Loyihalar soni',
      value: safeProjects.length,
      icon: Lightbulb,
      color: 'amber',
      subtext: `${safeProjects.filter(p => p.hasPrototype).length} ta prototip mavjud`,
      action: () => onNavigateTab('projects'),
    },
    {
      id: 'kpi-achievements',
      label: 'Yutuqlar & Sovrinlar',
      value: totalAchievements,
      icon: Trophy,
      color: 'purple',
      subtext: `${safeStudents.flatMap(s => s.achievements || []).filter(a => a.level === 'xalqaro').length} ta xalqaro darajada`,
      action: () => onNavigateTab('rating'),
    },
    {
      id: 'kpi-events',
      label: 'Tadbirlar & Tanlovlar',
      value: safeEvents.length,
      icon: Calendar,
      color: 'emerald',
      subtext: `${safeEvents.filter(e => e.status === 'active').length} ta faol ro‘yxatga olish`,
      action: () => onNavigateTab('events'),
    },
    {
      id: 'kpi-certificates',
      label: 'Berilgan sertifikatlar',
      value: safeCertificates.length,
      icon: Award,
      color: 'indigo',
      subtext: 'Barchasi QR-kod bilan',
      action: () => onNavigateTab('certificates'),
    },
    {
      id: 'kpi-announcements',
      label: 'Rasmiy e\'lonlar',
      value: safeAnnouncements.length,
      icon: Megaphone,
      color: 'rose',
      subtext: `${safeAnnouncements.filter(a => a.urgent).length} ta muhim e'lon`,
      action: () => onNavigateTab('announcements'),
    },
  ];

  const facultyBreakdown = [
    { name: 'Oziq-ovqat texnologiyasi', count: 94, color: 'bg-sky-500' },
    { name: 'Yoqilg‘i va organik birikmalar', count: 88, color: 'bg-indigo-500' },
    { name: 'Noorganik moddalar texnologiyasi', count: 68, color: 'bg-emerald-500' },
    { name: 'Muhandislik va avtomatlashtirish', count: 62, color: 'bg-amber-500' },
    { name: 'Silikat materiallar va metallurgiya', count: 44, color: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-6 pb-12 w-full max-w-full overflow-hidden">
      {/* Platform Banner Header */}
      <div className={`relative overflow-hidden rounded-2xl ${bannerClass} text-white p-4 sm:p-6 lg:p-8 shadow-md flex items-center justify-between gap-6 transition-colors duration-150 w-full max-w-full`}>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex flex-wrap items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-sky-400/30 text-sky-300 text-[11px] sm:text-xs font-semibold mb-3 shadow-xs max-w-full">
            <TktiyfLogo size="xs" />
            <span className="hidden sm:inline">Toshkent kimyo-texnologiya instituti Yangiyer filiali</span>
            <span className="sm:hidden">TKTI Yangiyer filiali</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
            TKTI Yangiyer Filiali TalentHub Platformasi
          </h1>
          <p className="text-sm text-slate-200 leading-relaxed max-w-2xl">
            Yangiyer filiali iqtidorli talabalarining yagona profili, yutuqlar bazasi, ilmiy loyihalari,
            QR-kodli sertifikatlar va avtomatlashtirilgan reyting tizimi.
          </p>

          {/* Quick Action Buttons per Role */}
          <div className="flex flex-wrap items-center gap-2.5 mt-5">
            {currentRole === 'super_admin' && (
              <>
                <button
                  id="dash-superadmin-control-btn"
                  onClick={() => onNavigateTab('superadmin_control')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-lg transition shadow-sm"
                >
                  <ShieldCheck className="w-3.5 h-3.5 fill-current" />
                  Akkountlar & Nazorat
                </button>
                <button
                  id="dash-add-teacher-btn"
                  onClick={() => onOpenAddTeacher ? onOpenAddTeacher() : onNavigateTab('superadmin_control')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition shadow-sm"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  + O‘qituvchi qo‘shish
                </button>
                <button
                  id="dash-add-student-btn"
                  onClick={() => onOpenAddStudent ? onOpenAddStudent() : onNavigateTab('students')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg transition shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Yangi talaba qo‘shish
                </button>
                <button
                  id="dash-create-event-btn"
                  onClick={() => onOpenCreateEvent ? onOpenCreateEvent() : onNavigateTab('events')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
                >
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  Tadbir yaratish
                </button>
                <button
                  id="dash-issue-cert-btn"
                  onClick={() => onOpenIssueCertificate ? onOpenIssueCertificate() : onNavigateTab('certificates')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  Sertifikat yaratish
                </button>
              </>
            )}

            {currentRole === 'admin' && (
              <>
                <button
                  id="dash-admin-control-btn"
                  onClick={() => onNavigateTab('superadmin_control')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-lg transition shadow-sm"
                >
                  <ShieldCheck className="w-3.5 h-3.5 fill-current" />
                  Akkountlar & Nazorat
                </button>
                <button
                  id="dash-admin-add-teacher-btn"
                  onClick={() => onOpenAddTeacher ? onOpenAddTeacher() : onNavigateTab('superadmin_control')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition shadow-sm"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  + O‘qituvchi qo‘shish
                </button>
                <button
                  id="dash-add-student-btn"
                  onClick={() => onOpenAddStudent ? onOpenAddStudent() : onNavigateTab('students')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg transition shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Yangi talaba qo‘shish
                </button>
                <button
                  id="dash-create-event-btn"
                  onClick={() => onOpenCreateEvent ? onOpenCreateEvent() : onNavigateTab('events')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
                >
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  Tadbir yaratish
                </button>
                <button
                  id="dash-issue-cert-btn"
                  onClick={() => onOpenIssueCertificate ? onOpenIssueCertificate() : onNavigateTab('certificates')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  Sertifikat yaratish
                </button>
                <button
                  id="dash-create-ann-btn"
                  onClick={() => onOpenCreateAnnouncement ? onOpenCreateAnnouncement() : onNavigateTab('announcements')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
                >
                  <Megaphone className="w-3.5 h-3.5 text-rose-400" />
                  E‘lon yuborish
                </button>
              </>
            )}

            {(currentRole === 'faculty' || currentRole === 'teacher') && (
              <>
                <button
                  id="dash-teacher-portal-btn"
                  onClick={() => onNavigateTab('teacher_portal')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition shadow-sm"
                >
                  <GraduationCap className="w-4 h-4" />
                  Biriktirilgan Talabalarim Kabineti
                </button>
                <button
                  id="dash-approvals-btn"
                  onClick={() => onNavigateTab('faculty')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Arizalarni tasdiqlash
                </button>
              </>
            )}

            {currentRole === 'student' && (
              <button
                id="dash-student-portal-btn"
                onClick={() => onNavigateTab('student_portal')}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-lg transition shadow-sm"
              >
                <Trophy className="w-4 h-4 fill-current" />
                Mening Shaxsiy Kabinetim & Portfolio
              </button>
            )}

            <button
              id="dash-verify-qr-btn"
              onClick={onOpenVerifyModal}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold rounded-lg border border-emerald-500/40 transition"
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-400" />
              Sertifikatni QR orqali tekshirish
            </button>

            <a
              id="dash-telegram-channel-btn"
              href="https://t.me/yosh_olimlar_tktiyf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 text-xs font-bold rounded-lg border border-sky-400/30 transition shadow-xs"
              title="TKTI Yosh Olimlar Telegram Kanali"
            >
              <Send className="w-3.5 h-3.5 text-sky-400 fill-sky-400/20" />
              <span>Telegram: @yosh_olimlar_tktiyf</span>
              <ExternalLink className="w-3 h-3 text-sky-400" />
            </a>
          </div>
        </div>

        {/* Right side official seal */}
        <div className="hidden md:flex flex-col items-center justify-center shrink-0 pr-4 z-10">
          <div className="p-2 rounded-2xl bg-slate-900/60 border border-sky-400/20 backdrop-blur-xs shadow-xl hover:scale-105 transition">
            <TktiyfLogo size="2xl" />
          </div>
          <span className="text-[10px] text-sky-300 font-bold mt-2 uppercase tracking-wider">
            Yangiyer filiali
          </span>
        </div>

        {/* Decorative background grid */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
      </div>

      {/* KPI Section matching user prompt table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <span>Asosiy Platforma Ko‘rsatkichlari</span>
            <span className="text-xs font-normal text-slate-500">TKTI miqyosida</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {kpiStats.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.id}
                onClick={kpi.action}
                className={`${cardClass} p-4 rounded-xl border shadow-xs hover:shadow-sm transition cursor-pointer group`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`p-2 rounded-lg ${subtleClass} group-hover:text-sky-600 transition`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-80 transition" />
                </div>
                <div className="text-2xl font-black tracking-tight">
                  {kpi.value}
                </div>
                <div className="text-xs font-semibold mt-1 line-clamp-1 opacity-90">
                  {kpi.label}
                </div>
                <div className="text-[11px] opacity-60 mt-1 font-medium">
                  {kpi.subtext}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Grid: Top Active Students Rating (Section 6 & 9) + Featured Projects (Section 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Faol Talabalar Reytingi (Prompt Section 6) */}
        <div className={`lg:col-span-5 ${cardClass} rounded-xl border p-5 shadow-xs space-y-4`}>
          <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                Faol Talabalar Reytingi
              </h3>
              <p className="text-xs opacity-60">Institut bo‘yicha eng yuqori ball to‘plaganlar</p>
            </div>
            <button
              onClick={() => onNavigateTab('rating')}
              className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
            >
              Barchasi <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Top 3 Podium List */}
          <div className="space-y-2.5">
            {top3.map((student, index) => {
              const medalEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
              const rankBg = index === 0 ? 'bg-amber-50 border-amber-200' : index === 1 ? 'bg-slate-50 border-slate-200' : 'bg-orange-50 border-orange-200';

              return (
                <div
                  key={student.id}
                  onClick={() => onSelectStudent(student)}
                  className={`flex items-center justify-between p-3 rounded-xl border ${rankBg} hover:shadow-xs transition cursor-pointer`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-black">{medalEmoji}</span>
                    <img
                      src={student.avatarUrl}
                      alt={student.fullName}
                      className="w-10 h-10 rounded-full object-cover border border-white shadow-xs"
                    />
                    <div>
                      <div className="font-bold text-slate-900 text-xs sm:text-sm hover:text-sky-600">
                        {student.fullName}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {student.course}-kurs • {student.faculty.split(' ')[0]}...
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 bg-white font-extrabold text-xs text-slate-800 rounded-lg border border-slate-200 shadow-2xs">
                      {student.totalPoints} ball
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Remaining top students */}
          <div className="divide-y divide-slate-100 pt-1">
            {sortedStudents.slice(3, 5).map((student, idx) => (
              <div
                key={student.id}
                onClick={() => onSelectStudent(student)}
                className="flex items-center justify-between py-2 text-xs hover:bg-slate-50 px-2 rounded-lg cursor-pointer transition"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-slate-400 w-4 text-center">{idx + 4}.</span>
                  <span className="font-semibold text-slate-800">{student.fullName}</span>
                </div>
                <span className="font-bold text-slate-600">{student.totalPoints} ball</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="p-2.5 rounded-lg bg-slate-50 text-[11px] text-slate-500 leading-relaxed flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Ballar: Respublika 1-o‘rin (+100), Xalqaro tanlov (+120), Maqola (+50), Startap (+70).</span>
            </div>
          </div>
        </div>

        {/* Right Col: Featured Projects & Activity (Prompt Section 2: "Aqlli issiqxona") */}
        <div className={`lg:col-span-7 ${cardClass} rounded-xl border p-5 shadow-xs space-y-4`}>
          <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                Iqtidorli Talabalar Loyihalari
              </h3>
              <p className="text-xs opacity-60">Institut ixtirolari va startap prototiplari</p>
            </div>
            <button
              onClick={() => onNavigateTab('projects')}
              className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
            >
              Barcha loyihalar ({safeProjects.length}) <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {safeProjects.slice(0, 2).map((project) => (
              <div
                key={project.id}
                onClick={() => onSelectProject ? onSelectProject(project) : onNavigateTab('projects')}
                className="border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 hover:shadow-xs transition cursor-pointer flex flex-col group"
              >
                <div className="h-32 w-full relative overflow-hidden bg-slate-100">
                  <img
                    src={project.imageUrl}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500 text-white shadow-xs">
                      {project.hasPrototype ? 'Prototip tayyor' : 'Tadqiqotda'}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wide">
                      {project.direction}
                    </span>
                    <h4 className="font-bold text-xs text-slate-900 mt-0.5 line-clamp-1 group-hover:text-sky-600 transition">
                      {project.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
                    <span>Jamoa: <strong className="text-slate-900">{project.teamMembers.length} talaba</strong></span>
                    <span className="text-amber-600 font-semibold">{project.awards}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Faculty Breakdown */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-800 mb-2">
              Fakultetlar kesimida iqtidorli talabalar ulushi
            </h4>
            <div className="space-y-1.5">
              {facultyBreakdown.map((f) => (
                <div key={f.name} className="flex items-center text-[11px] gap-2">
                  <span className="w-48 truncate text-slate-600">{f.name}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${f.color} rounded-full`}
                      style={{ width: `${(f.count / 100) * 100}%` }}
                    />
                  </div>
                  <span className="font-bold text-slate-800 w-8 text-right">{f.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Section: Active Events (Section 3) & Latest Announcements (Section 4) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Events quick card */}
        <div className={`${cardClass} rounded-xl border p-5 shadow-xs space-y-3`}>
          <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-500" />
                Yaqinlashayotgan Tadbirlar
              </h3>
              <p className="text-xs opacity-60">Institut miqyosidagi tanlovlar va forumi</p>
            </div>
            <button
              onClick={() => onNavigateTab('events')}
              className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
            >
              Barcha tadbirlar <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {events.slice(0, 2).map((ev) => (
              <div
                key={ev.id}
                onClick={() => onNavigateTab('events')}
                className={`p-3 rounded-lg border border-slate-200/80 dark:border-slate-700/80 hover:border-sky-400 ${subtleClass} transition cursor-pointer flex items-center justify-between`}
              >
                <div>
                  <div className="font-bold text-xs">{ev.title}</div>
                  <div className="text-[11px] opacity-60 mt-0.5">
                    📅 {ev.date} • {ev.time} • 📍 {ev.location.split(',')[0]}
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30">
                    {ev.registeredStudentIds.length} / {ev.capacityLimit} ro‘yxatda
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements quick card */}
        <div className={`${cardClass} rounded-xl border p-5 shadow-xs space-y-3`}>
          <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-rose-500" />
                So‘nggi E‘lonlar
              </h3>
              <p className="text-xs opacity-60">Talabalar va grantlar uchun muhim xabarnomalar</p>
            </div>
            <button
              onClick={() => onNavigateTab('announcements')}
              className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
            >
              Barchasi <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {announcements.slice(0, 2).map((ann) => (
              <div
                key={ann.id}
                onClick={() => onNavigateTab('announcements')}
                className={`p-3 rounded-lg border border-slate-200/80 dark:border-slate-700/80 hover:border-sky-400 ${subtleClass} transition cursor-pointer`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs line-clamp-1">{ann.title}</span>
                  <span className="text-[10px] opacity-50 shrink-0 ml-2">{ann.date}</span>
                </div>
                <p className="text-[11px] opacity-70 mt-1 line-clamp-1">
                  {ann.content}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Official Telegram Channel Widget */}
      <div className={`rounded-2xl ${bannerClass} p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm relative overflow-hidden transition-colors duration-150`}>
        <div className="flex items-center gap-3.5 z-10">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/30 shrink-0">
            <Send className="w-6 h-6 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-sm text-white">TKTI Yosh Olimlar Rasmiy Telegram Kanali</h4>
              <span className="px-2 py-0.5 rounded-full bg-sky-400/20 text-sky-300 text-[10px] font-bold border border-sky-400/30">
                @yosh_olimlar_tktiyf
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Institut miqyosidagi barcha tanlovlar, olimpiada, grantlar va ilmiy e'lonlardan xabardor bo'ling.
            </p>
          </div>
        </div>

        <div className="z-10 shrink-0 w-full sm:w-auto">
          <a
            id="dash-bottom-telegram-btn"
            href="https://t.me/yosh_olimlar_tktiyf"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-black flex items-center justify-center gap-2 transition shadow-md shadow-sky-500/20"
          >
            <Send className="w-3.5 h-3.5 fill-current" />
            <span>Kanalga A‘zo Bo‘lish</span>
            <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
          </a>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-sky-500/10 to-transparent pointer-events-none" />
      </div>
    </div>
  );
};
