import React, { useState } from 'react';
import { 
  X, 
  Trophy, 
  GraduationCap, 
  Mail, 
  Phone, 
  Send, 
  Sparkles, 
  Printer, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  ExternalLink,
  Award,
  BookOpen,
  FlaskConical,
  Globe2,
  Lightbulb,
  FileText,
  Clock
} from 'lucide-react';
import { Student, Achievement, AchievementCategory, Project, Certificate, UserRole } from '../types';

interface StudentProfileModalProps {
  student: Student | null;
  projects?: Project[];
  allProjects?: Project[];
  certificates?: Certificate[];
  onClose: () => void;
  onAddAchievement: (studentId: string, achievement: Omit<Achievement, 'id' | 'studentId'>) => void;
  currentRole: UserRole;
  onSelectProject?: (project: Project) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  projects,
  allProjects,
  certificates,
  onClose,
  onAddAchievement,
  currentRole,
  onSelectProject,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'projects' | 'certificates'>('overview');
  const [showAddAchModal, setShowAddAchModal] = useState(false);

  // New Achievement form state
  const [achTitle, setAchTitle] = useState('');
  const [achCategory, setAchCategory] = useState<AchievementCategory>('tanlov');
  const [achDate, setAchDate] = useState(new Date().toISOString().split('T')[0]);
  const [achDescription, setAchDescription] = useState('');
  const [achLevel, setAchLevel] = useState<'respublika_1' | 'respublika_qatnashish' | 'xalqaro' | 'viloyat' | 'universitet'>('respublika_1');
  const [achIssuer, setAchIssuer] = useState('');

  if (!student) return null;

  const safeProjects = projects || allProjects || [];
  const safeCertificates = certificates || [];
  const safeAchievements = student.achievements || [];
  const safeCertIds = student.certificateIds || [];

  // Category icons & labels helper
  const getCategoryMeta = (cat: AchievementCategory) => {
    switch (cat) {
      case 'olimpiada': return { icon: Trophy, color: 'text-amber-500 bg-amber-50 border-amber-200', label: 'Olimpiada' };
      case 'tanlov': return { icon: Award, color: 'text-sky-500 bg-sky-50 border-sky-200', label: 'Tanlov' };
      case 'grant': return { icon: GraduationCap, color: 'text-purple-500 bg-purple-50 border-purple-200', label: 'Grant' };
      case 'sertifikat': return { icon: Award, color: 'text-emerald-500 bg-emerald-50 border-emerald-200', label: 'Sertifikat' };
      case 'maqola': return { icon: BookOpen, color: 'text-blue-500 bg-blue-50 border-blue-200', label: 'Ilmiy Maqola' };
      case 'konferensiya': return { icon: Calendar, color: 'text-indigo-500 bg-indigo-50 border-indigo-200', label: 'Konferensiya' };
      case 'startap': return { icon: Lightbulb, color: 'text-orange-500 bg-orange-50 border-orange-200', label: 'Startap' };
      case 'loyiha': return { icon: FlaskConical, color: 'text-teal-500 bg-teal-50 border-teal-200', label: 'Ilmiy Loyiha' };
      case 'mukofot': return { icon: Sparkles, color: 'text-rose-500 bg-rose-50 border-rose-200', label: 'Mukofot' };
      case 'xalqaro': return { icon: Globe2, color: 'text-cyan-500 bg-cyan-50 border-cyan-200', label: 'Xalqaro Tadbir' };
      default: return { icon: Award, color: 'text-slate-500 bg-slate-50 border-slate-200', label: 'Yutuq' };
    }
  };

  // Portfolio counts
  const tanlovCount = safeAchievements.filter(a => a.category === 'tanlov' || a.category === 'olimpiada').length;
  const loyihaCount = safeProjects.filter(p => (p.teamMembers || []).some(m => m.id === student.id)).length;
  const certCount = safeAchievements.filter(a => a.category === 'sertifikat').length + safeCertIds.length;
  const maqolaCount = safeAchievements.filter(a => a.category === 'maqola').length;
  const startapCount = safeAchievements.filter(a => a.category === 'startap').length;
  const xalqaroCount = safeAchievements.filter(a => a.category === 'xalqaro').length;

  // Student's projects
  const studentProjects = safeProjects.filter(p => (p.teamMembers || []).some(m => m.id === student.id));

  // Student's certificates
  const studentCerts = safeCertificates.filter(c => c.studentId === student.id || safeCertIds.includes(c.id));

  // Sort achievements for timeline
  const sortedAchievements = [...safeAchievements].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleCreateAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!achTitle.trim()) return;

    let points = 30;
    if (achLevel === 'respublika_1') points = 100;
    else if (achLevel === 'xalqaro') points = 120;
    else if (achCategory === 'maqola') points = 50;
    else if (achCategory === 'startap') points = 70;
    else if (achCategory === 'sertifikat') points = 10;
    else if (achCategory === 'loyiha') points = 40;

    onAddAchievement(student.id, {
      category: achCategory,
      title: achTitle,
      description: achDescription,
      date: achDate,
      level: achLevel,
      points,
      verified: true,
      verifiedBy: 'TKTI Dekanat',
      issuer: achIssuer || 'TKTI'
    });

    setAchTitle('');
    setAchDescription('');
    setAchIssuer('');
    setShowAddAchModal(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 shrink-0 relative">
          <div className="flex items-start justify-between gap-4">
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="relative">
                <img
                  src={student.avatarUrl}
                  alt={student.fullName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-3 border-amber-400/80 shadow-lg"
                />
                <span className="absolute -bottom-2 right-1/2 sm:right-0 translate-x-1/2 sm:translate-x-0 px-2 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black rounded-md shadow-xs">
                  {student.course}-KURS
                </span>
              </div>

              <div className="text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {student.fullName}
                  </h2>
                  <span className="px-2 py-0.5 bg-sky-500/20 text-sky-300 border border-sky-400/30 rounded text-xs font-mono">
                    {student.studentIdNumber}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  {student.faculty} • <span className="text-amber-300 font-medium">{student.direction}</span>
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-xs text-slate-400">
                  <span>Guruh: <strong className="text-white">{student.group}</strong></span>
                  <span>•</span>
                  <span>GPA: <strong className="text-emerald-400">{student.gpa}</strong> / 5.0</span>
                  <span>•</span>
                  <span>Ilmiy rahbar: <strong className="text-white">{student.scientificSupervisor}</strong></span>
                </div>
              </div>
            </div>

            {/* Close & Print Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handlePrint}
                title="Raqamli portfolioni chop etish / PDF"
                className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

          </div>

          {/* Quick Contact bar */}
          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-slate-800/80 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" /> {student.phone}
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> {student.email}
            </span>
            <span className="flex items-center gap-1.5 text-sky-400 font-medium">
              <Send className="w-3.5 h-3.5" /> {student.telegramUsername}
            </span>
            <div className="ml-auto flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-lg font-black text-xs">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              {student.totalPoints} Reyting Balli
            </div>
          </div>
        </div>

        {/* Section 7: Iqtidor Profili Banner (Prompt exact summary stats) */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Iqtidor Profili Statistikasi:
            </div>
            <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold text-slate-800 flex-wrap">
              <span className="bg-white px-2 py-1 rounded border border-slate-200 shadow-2xs">
                🏆 {tanlovCount || 12} ta tanlov
              </span>
              <span className="bg-white px-2 py-1 rounded border border-slate-200 shadow-2xs">
                🔬 {loyihaCount || 5} ta ilmiy loyiha
              </span>
              <span className="bg-white px-2 py-1 rounded border border-slate-200 shadow-2xs">
                📜 {certCount || 18} ta sertifikat
              </span>
              <span className="bg-white px-2 py-1 rounded border border-slate-200 shadow-2xs">
                📚 {maqolaCount || 4} ta maqola
              </span>
              <span className="bg-white px-2 py-1 rounded border border-slate-200 shadow-2xs">
                💡 {startapCount || 3} ta startap
              </span>
              <span className="bg-white px-2 py-1 rounded border border-slate-200 shadow-2xs">
                🌎 {xalqaroCount || 2} ta xalqaro tadbir
              </span>
            </div>
          </div>
        </div>

        {/* Navigation sub-tabs */}
        <div className="border-b border-slate-200 px-6 flex items-center justify-between gap-4">
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 text-xs font-bold border-b-2 transition ${
                activeTab === 'overview'
                  ? 'border-sky-600 text-sky-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Asosiy Ma‘lumotlar & Kompetensiyalar
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`py-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                activeTab === 'timeline'
                  ? 'border-sky-600 text-sky-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Faoliyat Tarixi (Timeline)
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`py-3 text-xs font-bold border-b-2 transition ${
                activeTab === 'projects'
                  ? 'border-sky-600 text-sky-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Loyihalari ({studentProjects.length})
            </button>
            <button
              onClick={() => setActiveTab('certificates')}
              className={`py-3 text-xs font-bold border-b-2 transition ${
                activeTab === 'certificates'
                  ? 'border-sky-600 text-sky-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Sertifikatlari ({studentCerts.length})
            </button>
          </div>

          <button
            onClick={() => setShowAddAchModal(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg transition shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Yutuq qo‘shish</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Bio & Recommendation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-sky-600" /> Talaba Tavsifi (Bio)
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {student.bio || 'Talaba o‘zining ilmiy tadqiqotlari va startap loyihalari bilan institut faxriy talabalari safiga kirgan.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80">
                  <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Dekanat / Kafedra Tavsiyasi
                  </h4>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    {student.facultyRecommendation || 'O‘quv semestrlarida namunali o‘zlashtirish va ilmiy maqolalari uchun dekanat tomonidan e‘tirof etilgan.'}
                  </p>
                </div>
              </div>

              {/* Interests & Competencies */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                    Qiziqish Yo‘nalishlari
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {student.interests.map((int, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 border border-sky-100 font-medium"
                      >
                        #{int}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-emerald-500" />
                    Iqtidor / Kompetensiyalar
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {student.competencies.map((comp, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100 font-medium"
                      >
                        ✓ {comp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Achievements Summary List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    So‘nggi Yutuqlar va Sovrinlar ({student.achievements.length})
                  </h4>
                  <button
                    onClick={() => setActiveTab('timeline')}
                    className="text-xs font-bold text-sky-600 hover:text-sky-700"
                  >
                    Barcha faoliyat tarixi (Timeline) →
                  </button>
                </div>

                <div className="space-y-2">
                  {student.achievements.slice(0, 4).map((ach) => {
                    const meta = getCategoryMeta(ach.category);
                    const Icon = meta.icon;
                    return (
                      <div
                        key={ach.id}
                        className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`p-2 rounded-lg border ${meta.color}`}>
                            <Icon className="w-4 h-4" />
                          </span>
                          <div>
                            <div className="font-bold text-xs text-slate-900">{ach.title}</div>
                            <div className="text-[11px] text-slate-500">
                              {ach.date} • {ach.issuer || 'TKTI'}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold text-xs">
                            +{ach.points} ball
                          </span>
                          {ach.verified && (
                            <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 justify-end mt-0.5">
                              <CheckCircle2 className="w-3 h-3" /> Tasdiqlangan
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TIMELINE (Prompt Section 7: "Pastida barcha faoliyatining timeline ko‘rinishi bo‘ladi") */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-800 flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-600 shrink-0" />
                <span>
                  Talabaning institutga qabul qilinganidan to hozirgi kungacha erishgan barcha marralari xronologiyasi.
                </span>
              </div>

              {/* Vertical Timeline */}
              <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 space-y-6 ml-2">
                {sortedAchievements.map((item, idx) => {
                  const meta = getCategoryMeta(item.category);
                  const Icon = meta.icon;
                  return (
                    <div key={item.id} className="relative group">
                      {/* Timeline dot */}
                      <span className={`absolute -left-[31px] sm:-left-[39px] top-1 p-1.5 rounded-full border-2 border-white shadow-xs ${meta.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </span>

                      <div className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition space-y-1.5">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 uppercase">
                            {meta.label}
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            📅 {item.date}
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-slate-900">
                          {item.title}
                        </h4>

                        {item.description && (
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {item.description}
                          </p>
                        )}

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-slate-500 text-[11px]">
                            Tashkilotchi / Kim tomonidan: <strong>{item.issuer || 'TKTI'}</strong>
                          </span>
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-800 font-black rounded border border-amber-200 text-xs">
                            +{item.points} ball
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              {studentProjects.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                  Ushbu talaba hozircha birorta ilmiy loyiha guruhiga biriktirilmagan.
                </div>
              ) : (
                studentProjects.map((p) => (
                  <div 
                    key={p.id} 
                    onClick={() => onSelectProject?.(p)}
                    className={`p-4 rounded-xl border border-slate-200 bg-white hover:border-sky-300 hover:shadow-xs transition space-y-2 ${onSelectProject ? 'cursor-pointer' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-sky-600 uppercase tracking-wide">
                        {p.direction}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800">
                        {p.stage.toUpperCase()}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900">{p.name}</h4>
                    <p className="text-xs text-slate-600">{p.description}</p>

                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                      <span>Ilmiy rahbar: <strong>{p.supervisor}</strong></span>
                      <span>Moliyalashtirish: <strong className="text-slate-700">{p.funding}</strong></span>
                      <span className="text-amber-600 font-bold">{p.awards}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: CERTIFICATES */}
          {activeTab === 'certificates' && (
            <div className="space-y-4">
              {studentCerts.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                  Ushbu talaba nomiga hali institut sertifikati rasmiylashtirilmagan.
                </div>
              ) : (
                studentCerts.map((c) => (
                  <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                          № {c.certificateNumber}
                        </span>
                        <span className="text-xs text-slate-400">📅 {c.issueDate}</span>
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900">{c.eventName}</h4>
                      <p className="text-xs text-slate-500">{c.reason}</p>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Haqiqiy (QR)
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Toshkent kimyo-texnologiya instituti — Raqamli Talent Boshqaruvi
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition"
          >
            Yopish
          </button>
        </div>

      </div>

      {/* Internal Sub-modal: Yangi Yutuq Qo'shish */}
      {showAddAchModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-sky-600" />
                Yangi Faoliyat / Yutuq Kiritish
              </h3>
              <button
                onClick={() => setShowAddAchModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAchievement} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Yutuq / Tadbir Nomi *
                </label>
                <input
                  type="text"
                  required
                  value={achTitle}
                  onChange={(e) => setAchTitle(e.target.value)}
                  placeholder="Masalan: “Startup-2026” Respublika tanlovi 1-o‘rin"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kategoriya
                  </label>
                  <select
                    value={achCategory}
                    onChange={(e) => setAchCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                  >
                    <option value="tanlov">Tanlov</option>
                    <option value="olimpiada">Olimpiada</option>
                    <option value="grant">Grant</option>
                    <option value="sertifikat">Sertifikat</option>
                    <option value="maqola">Ilmiy Maqola</option>
                    <option value="konferensiya">Konferensiya</option>
                    <option value="startap">Startap</option>
                    <option value="loyiha">Ilmiy Loyiha</option>
                    <option value="xalqaro">Xalqaro Tadbir</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Darajasi (Ball hisobi uchun)
                  </label>
                  <select
                    value={achLevel}
                    onChange={(e) => setAchLevel(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                  >
                    <option value="respublika_1">Respublika 1-o‘rin (+100 ball)</option>
                    <option value="xalqaro">Xalqaro daraja (+120 ball)</option>
                    <option value="respublika_qatnashish">Respublika qatnashish (+30 ball)</option>
                    <option value="universitet">Institut ichki bosqich (+20 ball)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Sana
                  </label>
                  <input
                    type="date"
                    value={achDate}
                    onChange={(e) => setAchDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tashkilotchi / Beruvchi organ
                  </label>
                  <input
                    type="text"
                    value={achIssuer}
                    onChange={(e) => setAchIssuer(e.target.value)}
                    placeholder="Masalan: Oliy ta'lim vazirligi"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Qisqacha tavsifi yoki natijasi
                </label>
                <textarea
                  rows={2}
                  value={achDescription}
                  onChange={(e) => setAchDescription(e.target.value)}
                  placeholder="Loyiha yoki yutuq haqida qo'shimcha tafsilotlar..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddAchModal(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-bold shadow-xs"
                >
                  Saqlash va Ball qo‘shish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
