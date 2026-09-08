import React, { useState } from 'react';
import { 
  GraduationCap, 
  Users, 
  Lightbulb, 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  BookOpen, 
  Star, 
  Plus, 
  Search, 
  ExternalLink, 
  Sparkles, 
  ChevronRight,
  Clock,
  Award,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { Student, Project, Achievement } from '../types';
import { INSTITUT_ILMIY_RAHBARLARI } from '../constants/filialData';

interface TeacherViewProps {
  students: Student[];
  projects: Project[];
  onSelectStudent: (student: Student) => void;
  onSelectProject: (project: Project) => void;
  onVerifyAchievement: (studentId: string, achievementId: string, approved: boolean) => void;
  onUpdateRecommendation: (studentId: string, recommendation: string) => void;
  onAddProject: (project: Project) => void;
}

export const TeacherView: React.FC<TeacherViewProps> = ({
  students = [],
  projects = [],
  onSelectStudent,
  onSelectProject,
  onVerifyAchievement,
  onUpdateRecommendation,
  onAddProject,
}) => {
  // Extract all supervisor names from students and projects
  const supervisorList = Array.from(
    new Set([
      ...INSTITUT_ILMIY_RAHBARLARI.map((s) => s.name),
      'Prof. X. Muminov',
      'Dots. D. Azimov',
      'Prof. S. Normatov',
      'Dots. R. Ergashev',
      'Dots. O.X. Ergashev',
      ...students.map((s) => s.scientificSupervisor).filter(Boolean)
    ])
  );

  const [activeSupervisor, setActiveSupervisor] = useState<string>(supervisorList[0] || 'Prof. X. Muminov');
  const [activeTab, setActiveTab] = useState<'students' | 'approvals' | 'projects' | 'publications'>('students');
  const [searchQuery, setSearchQuery] = useState('');

  // Recommendation modal state
  const [recommendModalStudent, setRecommendModalStudent] = useState<Student | null>(null);
  const [recommendationText, setRecommendationText] = useState('');

  // New Project modal state
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);
  const [projName, setProjName] = useState('');
  const [projDirection, setProjDirection] = useState('Biotexnologiya va yashil kimyo');
  const [projStudentId, setProjStudentId] = useState('');
  const [projProblem, setProjProblem] = useState('');
  const [projSolution, setProjSolution] = useState('');

  // Filter students assigned to active supervisor
  const assignedStudents = students.filter((s) => 
    s.scientificSupervisor && 
    (s.scientificSupervisor.toLowerCase().includes(activeSupervisor.toLowerCase().split(' ')[1] || activeSupervisor.toLowerCase()) ||
     activeSupervisor.toLowerCase().includes(s.scientificSupervisor.toLowerCase()))
  );

  // Filter projects supervised by active supervisor
  const supervisedProjects = projects.filter((p) => 
    p.supervisor && 
    (p.supervisor.toLowerCase().includes(activeSupervisor.toLowerCase().split(' ')[1] || activeSupervisor.toLowerCase()) ||
     activeSupervisor.toLowerCase().includes(p.supervisor.toLowerCase()))
  );

  // Collect all achievements from assigned students that need verification
  const pendingApprovals: { student: Student; achievement: Achievement }[] = [];
  assignedStudents.forEach((student) => {
    (student.achievements || []).forEach((ach) => {
      if (!ach.verified) {
        pendingApprovals.push({ student, achievement: ach });
      }
    });
  });

  // Calculate statistics for the active supervisor
  const totalAssignedPoints = assignedStudents.reduce((sum, s) => sum + s.totalPoints, 0);
  const avgGpa = assignedStudents.length > 0
    ? (assignedStudents.reduce((sum, s) => sum + s.gpa, 0) / assignedStudents.length).toFixed(2)
    : '0.00';

  const allArticles = assignedStudents.flatMap((s) => 
    (s.achievements || []).filter((a) => a.category === 'maqola' || a.category === 'konferensiya')
  );

  const filteredAssignedStudents = assignedStudents.filter((s) => 
    s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.studentIdNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.direction && s.direction.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (s.faculty && s.faculty.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenRecommendModal = (student: Student) => {
    setRecommendModalStudent(student);
    setRecommendationText(student.facultyRecommendation || '');
  };

  const handleSaveRecommendation = () => {
    if (recommendModalStudent) {
      onUpdateRecommendation(recommendModalStudent.id, recommendationText.trim());
      setRecommendModalStudent(null);
    }
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projName.trim()) return;

    const leadStudent = students.find((s) => s.id === projStudentId) || assignedStudents[0] || students[0];

    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name: projName.trim(),
      direction: projDirection,
      problem: projProblem.trim() || 'Ilmiy muammo',
      solution: projSolution.trim() || 'Innovatsion yechim',
      description: `${projProblem.trim()} — ${projSolution.trim()}`,
      teamMembers: [
        { id: leadStudent?.id || 'stud-1', name: leadStudent?.fullName || 'Talaba', role: 'Loyiha ijrochisi' }
      ],
      supervisor: activeSupervisor,
      stage: 'tadqiqot',
      hasPrototype: false,
      funding: 'Kafedra ilmiy laboratoriya tadqiqoti',
      awards: 'Ilmiy rahbar biriktirgan mavzu',
      imageUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80',
      status: 'faol',
      createdAt: new Date().toISOString().split('T')[0]
    };

    onAddProject(newProj);
    setNewProjectModalOpen(false);
    setProjName('');
    setProjProblem('');
    setProjSolution('');
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* 1. TEACHER HERO BANNER & SUPERVISOR SWITCHER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl border border-slate-800 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 p-0.5 shadow-lg flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-purple-400">
                <GraduationCap className="w-9 h-9" />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-bold mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Ilmiy Rahbar & Kafedra Mas’uli Profili
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                {activeSupervisor}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Toshkent kimyo-texnologiya instituti • Ilmiy izlanuvchilar va iqtidorli talabalar murabbiysi
              </p>
            </div>
          </div>

          {/* Supervisor Switcher Dropdown */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 flex flex-col gap-2 w-full md:w-auto shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Ilmiy rahbarni tanlash (Profil):
            </span>
            <select
              value={activeSupervisor}
              onChange={(e) => setActiveSupervisor(e.target.value)}
              className="bg-slate-800 text-purple-300 font-bold text-xs border border-purple-500/40 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
            >
              {supervisorList.map((sup) => (
                <option key={sup} value={sup} className="bg-slate-900 text-white">
                  {sup}
                </option>
              ))}
            </select>
            <div className="text-[11px] text-slate-400">
              Biriktirilgan: <strong className="text-white">{assignedStudents.length} nafar iqtidorli talaba</strong>
            </div>
          </div>
        </div>

        {/* Supervisor Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80 text-center">
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 font-semibold">Biriktirilgan talabalar</div>
            <div className="text-xl sm:text-2xl font-black text-white mt-0.5">{assignedStudents.length} ta</div>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 font-semibold">O‘rtacha GPA</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5">{avgGpa}</div>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 font-semibold">Startap loyihalar</div>
            <div className="text-xl sm:text-2xl font-black text-amber-400 mt-0.5">{supervisedProjects.length} ta</div>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 font-semibold">Kutilayotgan tasdiqlar</div>
            <div className="text-xl sm:text-2xl font-black text-rose-400 mt-0.5">
              {pendingApprovals.length} ta
            </div>
          </div>
        </div>
      </div>

      {/* 2. SECTION NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 scrollbar-none">
        <button
          id="teacher-tab-students"
          onClick={() => setActiveTab('students')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'students'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Biriktirilgan Talabalar</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${
            activeTab === 'students' ? 'bg-purple-800 text-white' : 'bg-slate-100 text-slate-700'
          }`}>
            {assignedStudents.length}
          </span>
        </button>

        <button
          id="teacher-tab-approvals"
          onClick={() => setActiveTab('approvals')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'approvals'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Yutuqlarni Tasdiqlash</span>
          {pendingApprovals.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500 text-white animate-pulse">
              {pendingApprovals.length} yangi
            </span>
          )}
        </button>

        <button
          id="teacher-tab-projects"
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'projects'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          <span>Ilmiy Loyihalar</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${
            activeTab === 'projects' ? 'bg-purple-800 text-white' : 'bg-slate-100 text-slate-700'
          }`}>
            {supervisedProjects.length}
          </span>
        </button>

        <button
          id="teacher-tab-publications"
          onClick={() => setActiveTab('publications')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'publications'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Maqola va Tezislar</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${
            activeTab === 'publications' ? 'bg-purple-800 text-white' : 'bg-slate-100 text-slate-700'
          }`}>
            {allArticles.length}
          </span>
        </button>
      </div>

      {/* 3. TAB CONTENTS */}

      {/* TAB A: ASSIGNED STUDENTS LIST */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                {activeSupervisor}ga Biriktirilgan Iqtidorli Talabalar
              </h2>
              <p className="text-xs text-slate-500">
                Talabalarning ilmiy ko‘rsatkichlari, maqolalari, ballari va ilmiy tavsiyanomalari
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Talabani qidirish..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:border-purple-600 focus:outline-none"
              />
            </div>
          </div>

          {filteredAssignedStudents.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-2">
              <Users className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500">Bu ilmiy rahbarga biriktirilgan talabalar topilmadi.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredAssignedStudents.map((st) => (
                <div
                  key={st.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 hover:border-purple-300 hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start gap-3.5">
                      <img
                        src={st.avatarUrl}
                        alt={st.fullName}
                        className="w-14 h-14 rounded-xl object-cover border-2 border-purple-200 shadow-xs shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                            {st.studentIdNumber}
                          </span>
                          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">
                            GPA: {st.gpa}
                          </span>
                          <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded ml-auto">
                            {st.totalPoints} ball
                          </span>
                        </div>
                        <h3 className="font-extrabold text-sm text-slate-900 mt-1 truncate">
                          {st.fullName}
                        </h3>
                        <p className="text-xs text-slate-500 truncate">
                          {st.course}-kurs • {st.faculty}
                        </p>
                      </div>
                    </div>

                    {/* Achievements summary */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Yutuqlar soni:</span>
                        <strong className="text-slate-900">{st.achievements?.length || 0} ta</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Loyihalari:</span>
                        <strong className="text-slate-900">{st.projectIds?.length || 0} ta startap</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Telefon:</span>
                        <strong className="text-slate-800">{st.phone}</strong>
                      </div>
                    </div>

                    {/* Current recommendation preview */}
                    <div className="text-[11px] text-purple-900 bg-purple-50/70 p-2.5 rounded-lg border border-purple-100 line-clamp-2">
                      <span className="font-bold text-purple-950">Tavsiyanoma: </span>
                      {st.facultyRecommendation || 'Hozircha ilmiy tavsiyanoma kiritilmagan.'}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleOpenRecommendModal(st)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Tavsiyanoma yozish</span>
                    </button>

                    <button
                      onClick={() => onSelectStudent(st)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
                    >
                      <span>To‘liq profil</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB B: PENDING APPROVALS */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-500" />
              Talabalar Tomonidan Yuborilgan Yutuqlarni Tasdiqlash
            </h2>
            <p className="text-xs text-slate-500">
              Ilmiy rahbar sifatida tasdiqlaganingizdan so‘ng talabaning umumiy reyting balliga qo‘shiladi
            </p>
          </div>

          {pendingApprovals.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">Kutilayotgan arizalar mavjud emas</h3>
              <p className="text-xs text-slate-500">
                Sizga biriktirilgan talabalarning barcha maqolalari va yutuqlari ko‘rib chiqilgan.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingApprovals.map(({ student, achievement }) => (
                <div
                  key={achievement.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                        {achievement.category}
                      </span>
                      <span className="text-xs text-slate-500">
                        {achievement.date}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        Talaba: <strong className="text-purple-700">{student.fullName}</strong> ({student.group})
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-slate-900">
                      {achievement.title}
                    </h4>

                    {achievement.description && (
                      <p className="text-xs text-slate-600">
                        {achievement.description}
                      </p>
                    )}

                    {achievement.issuer && (
                      <p className="text-[11px] text-slate-500">
                        Tashkilot / Jurnal: <strong>{achievement.issuer}</strong>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                    <div className="text-right mr-2">
                      <div className="text-base font-black text-amber-600">+{achievement.points}</div>
                      <div className="text-[10px] font-bold text-slate-400">reyting bali</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onVerifyAchievement(student.id, achievement.id, false)}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Rad etish</span>
                      </button>

                      <button
                        onClick={() => onVerifyAchievement(student.id, achievement.id, true)}
                        className="flex items-center gap-1 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Tasdiqlash (+ball berish)</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB C: RESEARCH & STARTUP PROJECTS */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                {activeSupervisor} Ilmiy Rahbarligidagi Loyihalar
              </h2>
              <p className="text-xs text-slate-500">
                Institut laboratoriyalarida olib borilayotgan startaplar va tadqiqotlar
              </p>
            </div>

            <button
              onClick={() => setNewProjectModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi loyiha biriktirish</span>
            </button>
          </div>

          {supervisedProjects.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-3">
              <Lightbulb className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">Loyiha topilmadi</h3>
              <p className="text-xs text-slate-500">
                Siz biriktirilgan talabalaringiz bilan yangi startap loyiha boshlashingiz mumkin.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {supervisedProjects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => onSelectProject(proj)}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 hover:border-purple-300 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-purple-700 uppercase bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                          {proj.direction}
                        </span>
                        <h4 className="font-extrabold text-sm text-slate-900 mt-1.5 group-hover:text-purple-700 transition">
                          {proj.name}
                        </h4>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        proj.hasPrototype
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {proj.hasPrototype ? 'Prototip mavjud' : 'Tadqiqotda'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      {proj.description}
                    </p>

                    <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1 border border-slate-100">
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Grant / Mablag‘:</span>
                        <strong className="text-slate-900">{proj.funding}</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Bosh talaba:</span>
                        <strong className="text-purple-700">{proj.teamMembers[0]?.name || 'Talaba'}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Jamoa: {proj.teamMembers.length} nafar</span>
                    <span className="text-purple-700 font-bold flex items-center gap-1">
                      Batafsil <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB D: SCIENTIFIC PUBLICATIONS & PAPERS */}
      {activeTab === 'publications' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600" />
              Biriktirilgan Talabalar Nashr Qilgan Maqola va Tezislar
            </h2>
            <p className="text-xs text-slate-500">
              Scopus, Web of Science, OAK ro‘yxatidagi jurnallar va xalqaro anjuman to‘plamlari
            </p>
          </div>

          {allArticles.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
              <p className="text-xs text-slate-500">Hozircha maqolalar kiritilmagan.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {allArticles.map((art, idx) => {
                const author = students.find((s) => s.id === art.studentId);
                return (
                  <div
                    key={art.id || idx}
                    className="bg-white rounded-2xl border border-slate-200/90 p-4.5 hover:border-slate-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                          {art.category === 'maqola' ? 'Ilmiy Maqola' : 'Konferensiya Tezisi'}
                        </span>
                        <span className="text-xs text-slate-500">{art.date}</span>
                        {author && (
                          <span className="text-xs font-bold text-slate-800">
                            Muallif: <span className="text-purple-700">{author.fullName}</span>
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">
                        {art.title}
                      </h4>
                      {art.description && (
                        <p className="text-xs text-slate-600 mt-0.5">{art.description}</p>
                      )}
                      {art.issuer && (
                        <p className="text-[11px] text-slate-500 mt-1">
                          Nashriyot / Jurnal: <strong>{art.issuer}</strong>
                        </p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm font-black text-purple-700">+{art.points} ball</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. MODAL: WRITE RECOMMENDATION */}
      {recommendModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                  Ilmiy Tavsiyanoma Yozish
                </h3>
                <p className="text-xs text-slate-500">
                  Talaba: <strong className="text-slate-800">{recommendModalStudent.fullName}</strong> ({recommendModalStudent.faculty})
                </p>
              </div>
              <button
                onClick={() => setRecommendModalStudent(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <label className="font-bold text-slate-700 block">
                Ilmiy rahbar rasmiy xulosasi va tavsiyanomasi:
              </label>
              <textarea
                rows={5}
                value={recommendationText}
                onChange={(e) => setRecommendationText(e.target.value)}
                placeholder="Talabaning laboratoriya faoliyati, ilmiy intilishi, grant va stipendiyalarga tavsiya etilishi haqida batafsil xulosa..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-purple-600 focus:outline-none text-xs"
              />
              <p className="text-[11px] text-slate-500">
                Ushbu tavsiyanoma talabaning shaxsiy portfoliosida va Rektorat hisobotida rasmiy qayd etiladi.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setRecommendModalStudent(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSaveRecommendation}
                className="px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs"
              >
                Tavsiyanomani saqlash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL: ASSIGN NEW RESEARCH PROJECT */}
      {newProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 my-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-purple-600" />
                  Yangi Ilmiy Mavzu / Loyiha Biriktirish
                </h3>
                <p className="text-xs text-slate-500">Ilmiy rahbar boshchiligidagi startap</p>
              </div>
              <button
                onClick={() => setNewProjectModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Mavzu / Loyiha Nomi *</label>
                <input
                  type="text"
                  required
                  value={projName}
                  onChange={(e) => setProjName(e.target.value)}
                  placeholder="masalan: Katalizator sintezi va chiqindilarni utilizatsiya qilish"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-purple-600 focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Biriktiriladigan iqtidorli talaba</label>
                <select
                  value={projStudentId}
                  onChange={(e) => setProjStudentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-purple-600 focus:outline-none text-xs"
                >
                  <option value="">Talabani tanlang...</option>
                  {assignedStudents.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.fullName} ({st.group} - {st.faculty})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Ilmiy yo‘nalish</label>
                <input
                  type="text"
                  value={projDirection}
                  onChange={(e) => setProjDirection(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-purple-600 focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Ilmiy muammo</label>
                <textarea
                  rows={2}
                  value={projProblem}
                  onChange={(e) => setProjProblem(e.target.value)}
                  placeholder="Muammo tavsifi..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-purple-600 focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Kutilayotgan ilmiy yechim</label>
                <textarea
                  rows={2}
                  value={projSolution}
                  onChange={(e) => setProjSolution(e.target.value)}
                  placeholder="Qanday natija olinishi kutilmoqda?"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-purple-600 focus:outline-none text-xs"
                />
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
                  className="px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs"
                >
                  Loyihani biriktirish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
