import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Settings, 
  Award, 
  Plus, 
  Edit3, 
  Trash2, 
  Download, 
  Users, 
  CheckCircle2, 
  XCircle,
  FileText, 
  Sparkles, 
  Database,
  History,
  Lock,
  Search,
  UserPlus,
  Phone,
  Mail,
  Building2,
  GraduationCap,
  Ban,
  RefreshCw,
  Filter
} from 'lucide-react';
import { ScoringRule, Student, Project, UniversityEvent, Certificate, Teacher, UserAccount, UserRole } from '../types';
import { AddTeacherModal } from './AddTeacherModal';
import { EditAccountModal } from './EditAccountModal';
import { useEyeCare } from '../context/EyeCareContext';

interface SuperAdminControlViewProps {
  scoringRules: ScoringRule[];
  onUpdateScoringRules: (rules: ScoringRule[]) => void;
  students: Student[];
  projects: Project[];
  events: UniversityEvent[];
  certificates: Certificate[];
  teachers?: Teacher[];
  accounts?: UserAccount[];
  onAddTeacher?: (teacher: Teacher, account: UserAccount) => void;
  onUpdateTeacher?: (teacher: Teacher) => void;
  onDeleteTeacher?: (teacherId: string) => void;
  onUpdateAccount?: (account: UserAccount) => void;
  onDeleteAccount?: (accountId: string) => void;
  onExportReport: () => void;
  currentRole?: UserRole;
}

export const SuperAdminControlView: React.FC<SuperAdminControlViewProps> = ({
  scoringRules = [],
  onUpdateScoringRules,
  students = [],
  projects = [],
  events = [],
  certificates = [],
  teachers = [],
  accounts = [],
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
  onUpdateAccount,
  onDeleteAccount,
  onExportReport,
  currentRole = 'super_admin'
}) => {
  const { mode } = useEyeCare();

  const [activeTab, setActiveTab] = useState<'accounts' | 'teachers' | 'rules' | 'roles' | 'audit'>('accounts');
  
  // Modals
  const [newRuleModalOpen, setNewRuleModalOpen] = useState(false);
  const [addTeacherModalOpen, setAddTeacherModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<UserAccount | null>(null);

  // Search & Filters for Accounts
  const [accountSearch, setAccountSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Search for Teachers
  const [teacherSearch, setTeacherSearch] = useState('');

  // New Rule state
  const [ruleActivity, setRuleActivity] = useState('');
  const [rulePoints, setRulePoints] = useState(50);
  const [ruleCategory, setRuleCategory] = useState<any>('maqola');
  const [ruleDescription, setRuleDescription] = useState('');

  // Audit Mock Logs
  const auditLogs = [
    { id: 'log-1', action: 'Yangi o‘qituvchi ro‘yxatdan o‘tkazildi', user: 'Super Admin', target: 'Prof. X. Muminov', date: 'Bugun, 10:45', status: 'muvaffaqiyatli' },
    { id: 'log-2', action: 'Akkount roli yangilandi (Admin -> Super Admin)', user: 'Rektorat Mas’uli', target: 'admin@tktiyf.uz', date: 'Bugun, 09:30', status: 'tasdiqlangan' },
    { id: 'log-3', action: 'QR Sertifikat berildi', user: 'Rektorat Mas’uli', target: 'Aliyev Ali (TKTI-2022-458)', date: 'Bugun, 08:45', status: 'muvaffaqiyatli' },
    { id: 'log-4', action: 'Yangi startap loyiha qo‘shildi', user: 'Administrator (Iqtidorlilar bo‘limi)', target: 'BioPlast-Eco loyihasi', date: 'Kecha, 16:20', status: 'saqlangan' },
    { id: 'log-5', action: 'Baholash mezoni yangilandi', user: 'Super Admin (Rektorat)', target: 'Xalqaro tanlov = 120 ball', date: '2026-09-01', status: 'sozlangan' },
  ];

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleActivity.trim()) return;

    const newRule: ScoringRule = {
      activity: ruleActivity.trim(),
      points: Number(rulePoints) || 50,
      category: ruleCategory,
      description: ruleDescription.trim() || 'Institut mezoniga muvofiq'
    };

    onUpdateScoringRules([...scoringRules, newRule]);
    setNewRuleModalOpen(false);
    setRuleActivity('');
    setRuleDescription('');
  };

  const handleDeleteRule = (index: number) => {
    const updated = [...scoringRules];
    updated.splice(index, 1);
    onUpdateScoringRules(updated);
  };

  // Filter accounts
  const filteredAccounts = accounts.filter((acc) => {
    const q = accountSearch.toLowerCase();
    const matchSearch = 
      acc.fullName.toLowerCase().includes(q) ||
      acc.email.toLowerCase().includes(q) ||
      (acc.department && acc.department.toLowerCase().includes(q)) ||
      (acc.phone && acc.phone.toLowerCase().includes(q));

    const matchRole = roleFilter === 'all' || acc.role === roleFilter;
    const matchStatus = statusFilter === 'all' || acc.status === statusFilter;

    return matchSearch && matchRole && matchStatus;
  });

  // Filter teachers
  const filteredTeachers = teachers.filter((t) => {
    const q = teacherSearch.toLowerCase();
    return (
      t.fullName.toLowerCase().includes(q) ||
      t.department.toLowerCase().includes(q) ||
      (t.specialization && t.specialization.toLowerCase().includes(q)) ||
      t.email.toLowerCase().includes(q)
    );
  });

  // Card & Container classes
  const cardClass = mode === 'warm-sepia'
    ? 'bg-[#fffdfa] border-[#e8e0d5] text-[#2d2621]'
    : mode === 'calm-dark'
    ? 'bg-[#1a2333] border-[#29384d] text-slate-100'
    : 'bg-white border-slate-200 text-slate-900';

  const subtleClass = mode === 'warm-sepia'
    ? 'bg-[#f7f2ea] text-[#635548]'
    : mode === 'calm-dark'
    ? 'bg-[#141b27] text-slate-300'
    : 'bg-slate-50 text-slate-600';

  return (
    <div className="space-y-6 pb-16 w-full max-w-full overflow-hidden">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 rounded-2xl border border-amber-500/30 text-white p-5 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 p-0.5 shadow-lg flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-8 h-8 sm:w-9 sm:h-9" />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-bold mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {currentRole === 'super_admin' ? 'Super Administrator & Rektorat' : 'Administrator Boshqaruv Markazi'}
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
                Tizim & Barcha Akkountlar Ustidan Nazorat
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                O‘qituvchilar profillarini qo‘shish, talaba va xodimlar akkauntlarini boshqarish, baholash mezonlari hamda audit
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="open-add-teacher-top-btn"
              onClick={() => setAddTeacherModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Yangi O‘qituvchi Qo‘shish</span>
            </button>

            <button
              id="export-vazirlik-report-btn"
              onClick={onExportReport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition"
            >
              <Download className="w-4 h-4" />
              <span>Vazirlik Hisoboti (PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 overflow-x-auto pb-1 scrollbar-none">
        
        <button
          id="tab-accounts-btn"
          onClick={() => setActiveTab('accounts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'accounts'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Barcha Akkountlar Nazorati</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-900 text-amber-300 font-mono">
            {accounts.length}
          </span>
        </button>

        <button
          id="tab-teachers-btn"
          onClick={() => setActiveTab('teachers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'teachers'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>O‘qituvchilar & Rahbarlar</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-600 text-white font-mono">
            {teachers.length}
          </span>
        </button>

        <button
          id="tab-rules-btn"
          onClick={() => setActiveTab('rules')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'rules'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Baholash Mezonlari (Ballar)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
            {scoringRules.length}
          </span>
        </button>

        <button
          id="tab-roles-btn"
          onClick={() => setActiveTab('roles')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'roles'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Rollarning Huquqlari</span>
        </button>

        <button
          id="tab-audit-btn"
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'audit'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Audit Logi</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: ACCOUNTS CONTROL (BUTUN AKKOUNTLAR USTIDAN NAZORAT) */}
      {/* ========================================================= */}
      {activeTab === 'accounts' && (
        <div className="space-y-4">
          
          {/* Top Quick Stats for Accounts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className={`${cardClass} p-4 rounded-xl border shadow-2xs`}>
              <div className="text-xs font-semibold opacity-70">Jami Akkountlar</div>
              <div className="text-2xl font-black mt-1 text-indigo-600 dark:text-indigo-400">
                {accounts.length} ta
              </div>
              <div className="text-[11px] opacity-60 mt-0.5">Tizimda ro‘yxatdan o‘tgan</div>
            </div>

            <div className={`${cardClass} p-4 rounded-xl border shadow-2xs`}>
              <div className="text-xs font-semibold opacity-70">O‘qituvchilar</div>
              <div className="text-2xl font-black mt-1 text-sky-600 dark:text-sky-400">
                {teachers.length} ta
              </div>
              <div className="text-[11px] opacity-60 mt-0.5">Kafedra va ilmiy rahbarlar</div>
            </div>

            <div className={`${cardClass} p-4 rounded-xl border shadow-2xs`}>
              <div className="text-xs font-semibold opacity-70">Talabalar Portfoliolari</div>
              <div className="text-2xl font-black mt-1 text-emerald-600 dark:text-emerald-400">
                {students.length} ta
              </div>
              <div className="text-[11px] opacity-60 mt-0.5">Faol iqtidorli yoshlar</div>
            </div>

            <div className={`${cardClass} p-4 rounded-xl border shadow-2xs`}>
              <div className="text-xs font-semibold opacity-70">Administratorlar</div>
              <div className="text-2xl font-black mt-1 text-amber-600 dark:text-amber-400">
                {accounts.filter(a => a.role === 'admin' || a.role === 'super_admin').length} ta
              </div>
              <div className="text-[11px] opacity-60 mt-0.5">Boshqaruv vakolati bilan</div>
            </div>
          </div>

          {/* Search, Filters and Add Buttons Bar */}
          <div className={`${cardClass} p-3.5 rounded-xl border shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3`}>
            
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
              <input
                type="text"
                placeholder="F.I.Sh., login/email, telefon yoki kafedra bo‘yicha qidiruv..."
                value={accountSearch}
                onChange={(e) => setAccountSearch(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-inherit focus:outline-none focus:ring-2 focus:ring-amber-500 ${subtleClass}`}
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs">
                <Filter className="w-3.5 h-3.5 opacity-60" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className={`px-2.5 py-1.5 text-xs rounded-lg border border-inherit focus:outline-none cursor-pointer ${subtleClass}`}
                >
                  <option value="all">Barcha rollar</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="faculty">O‘qituvchi</option>
                  <option value="teacher">O‘qituvchi (Rahbar)</option>
                  <option value="student">Talaba</option>
                </select>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`px-2.5 py-1.5 text-xs rounded-lg border border-inherit focus:outline-none cursor-pointer ${subtleClass}`}
              >
                <option value="all">Barcha holatlar</option>
                <option value="active">Faol</option>
                <option value="blocked">Bloklangan</option>
              </select>

              <button
                onClick={() => setAddTeacherModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shrink-0"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ O‘qituvchi</span>
              </button>
            </div>

          </div>

          {/* Accounts Table */}
          <div className={`${cardClass} rounded-2xl border shadow-2xs overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className={`${subtleClass} font-bold border-b border-inherit`}>
                  <tr>
                    <th className="p-3.5">Foydalanuvchi & Login</th>
                    <th className="p-3.5">Roli</th>
                    <th className="p-3.5">Bo‘lim / Kafedra</th>
                    <th className="p-3.5">Aloqa</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Faollik</th>
                    <th className="p-3.5 text-right">Amallar & Nazorat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-inherit">
                  {filteredAccounts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center opacity-60">
                        Qidiruv bo‘yicha hech qanday akkount topilmadi.
                      </td>
                    </tr>
                  ) : (
                    filteredAccounts.map((acc) => {
                      const isTeacher = acc.role === 'faculty' || acc.role === 'teacher';
                      const isStudent = acc.role === 'student';
                      const isAdmin = acc.role === 'admin' || acc.role === 'super_admin';

                      return (
                        <tr key={acc.id} className="hover:bg-slate-500/5 transition">
                          
                          {/* User Avatar + Name */}
                          <td className="p-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 ${
                                isAdmin ? 'bg-amber-600' : isTeacher ? 'bg-indigo-600' : 'bg-emerald-600'
                              }`}>
                                {acc.fullName.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-bold flex items-center gap-1.5">
                                  <span>{acc.fullName}</span>
                                </div>
                                <div className="text-[11px] opacity-60 font-mono">
                                  {acc.email}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Role Badge with Quick Switcher */}
                          <td className="p-3.5">
                            <select
                              value={acc.role}
                              onChange={(e) => {
                                const newRole = e.target.value as UserRole;
                                if (onUpdateAccount) {
                                  onUpdateAccount({ ...acc, role: newRole });
                                }
                              }}
                              className={`px-2 py-1 rounded-lg text-[11px] font-bold border focus:outline-none cursor-pointer ${
                                acc.role === 'super_admin'
                                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/40'
                                  : acc.role === 'admin'
                                  ? 'bg-sky-500/20 text-sky-600 dark:text-sky-300 border-sky-500/40'
                                  : isTeacher
                                  ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border-indigo-500/40'
                                  : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/40'
                              }`}
                            >
                              <option value="super_admin">Super Admin</option>
                              <option value="admin">Admin</option>
                              <option value="faculty">O‘qituvchi</option>
                              <option value="student">Talaba</option>
                            </select>
                          </td>

                          {/* Department */}
                          <td className="p-3.5 font-medium opacity-90 max-w-[200px] truncate" title={acc.department}>
                            {acc.department || '—'}
                          </td>

                          {/* Contact */}
                          <td className="p-3.5 font-mono text-[11px] opacity-80">
                            {acc.phone || '—'}
                          </td>

                          {/* Status & Toggle button */}
                          <td className="p-3.5">
                            <button
                              onClick={() => {
                                if (onUpdateAccount) {
                                  onUpdateAccount({
                                    ...acc,
                                    status: acc.status === 'active' ? 'blocked' : 'active'
                                  });
                                }
                              }}
                              title={acc.status === 'active' ? 'Akkountni bloklash' : 'Akkountni faollashtirish'}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition ${
                                acc.status === 'active'
                                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 hover:bg-rose-500/20 hover:text-rose-600'
                                  : 'bg-rose-500/15 text-rose-600 dark:text-rose-300 hover:bg-emerald-500/20 hover:text-emerald-600'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${acc.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                              <span>{acc.status === 'active' ? 'Faol' : 'Bloklangan'}</span>
                            </button>
                          </td>

                          {/* Last Active */}
                          <td className="p-3.5 text-[11px] opacity-60">
                            {acc.lastActive || 'Kuni kecha'}
                          </td>

                          {/* Actions */}
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setEditingAccount(acc)}
                                title="Tahrirlash va nazorat"
                                className="p-1.5 rounded-lg border border-inherit hover:bg-amber-500/15 hover:text-amber-600 transition"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              {onDeleteAccount && (
                                <button
                                  onClick={() => {
                                    if (window.confirm(`${acc.fullName} akkountini o‘chirishni tasdiqlaysizmi?`)) {
                                      onDeleteAccount(acc.id);
                                    }
                                  }}
                                  title="O‘chirish"
                                  className="p-1.5 rounded-lg border border-inherit hover:bg-rose-500/15 hover:text-rose-600 transition"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: TEACHERS & SUPERVISORS (O'QITUVCHILAR PROFILI) */}
      {/* ========================================================= */}
      {activeTab === 'teachers' && (
        <div className="space-y-4">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-500" />
                <span>TKTI Yangiyer Filiali O‘qituvchilari & Ilmiy Rahbarlar Bazasi</span>
              </h2>
              <p className="text-xs opacity-75">
                Kafedralar, ilmiy yo‘nalishlar va biriktirilgan iqtidorli talabalar ko‘rsatkichlari
              </p>
            </div>

            <button
              id="add-teacher-tab-btn"
              onClick={() => setAddTeacherModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm transition shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Yangi O‘qituvchi Qo‘shish</span>
            </button>
          </div>

          {/* Teacher Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
            <input
              type="text"
              placeholder="O‘qituvchi ismi, kafedra yoki ilmiy yo‘nalishi bo‘yicha qidiruv..."
              value={teacherSearch}
              onChange={(e) => setTeacherSearch(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-inherit focus:outline-none focus:ring-2 focus:ring-indigo-500 ${subtleClass}`}
            />
          </div>

          {/* Teachers Roster Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTeachers.map((teacher) => {
              // count assigned students
              const assignedCount = teacher.assignedStudentIds ? teacher.assignedStudentIds.length : 
                students.filter(s => s.scientificSupervisor && s.scientificSupervisor.includes(teacher.fullName.split(' ')[1] || teacher.fullName)).length;

              return (
                <div key={teacher.id} className={`${cardClass} p-5 rounded-2xl border shadow-2xs space-y-3 relative group`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                        {teacher.fullName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-black text-sm">{teacher.fullName}</h3>
                        <span className="inline-block text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                          {teacher.role}
                        </span>
                      </div>
                    </div>

                    {onDeleteTeacher && (
                      <button
                        onClick={() => {
                          if (window.confirm(`${teacher.fullName} profilini o‘chirishni tasdiqlaysizmi?`)) {
                            onDeleteTeacher(teacher.id);
                          }
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-500/10 text-rose-500 transition"
                        title="O‘qituvchini o‘chirish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-1.5 text-xs opacity-90 pt-1">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 opacity-50 shrink-0" />
                      <span className="line-clamp-1">{teacher.department}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 opacity-50 shrink-0" />
                      <span className="font-mono text-[11px]">{teacher.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 opacity-50 shrink-0" />
                      <span className="font-mono text-[11px] line-clamp-1">{teacher.email}</span>
                    </div>
                  </div>

                  {teacher.specialization && (
                    <div className={`p-2 rounded-lg text-[11px] ${subtleClass} line-clamp-2`}>
                      <strong>Soha:</strong> {teacher.specialization}
                    </div>
                  )}

                  <div className="pt-2 border-t border-inherit flex items-center justify-between text-xs">
                    <span className="opacity-70">Biriktirilgan shogirdlar:</span>
                    <span className="font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 font-mono">
                      {assignedCount} nafar talaba
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: SCORING RULES */}
      {/* ========================================================= */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                Iqtidorli Talabalarni Baholash Mezonlari va Ballari
              </h2>
              <p className="text-xs opacity-75">
                Talabalar va o‘qituvchilar uchun umumiy reytingni hisoblash qoidalari
              </p>
            </div>

            <button
              onClick={() => setNewRuleModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-950 text-xs font-bold transition"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi mezon qo‘shish</span>
            </button>
          </div>

          <div className={`${cardClass} rounded-2xl border shadow-2xs overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className={`${subtleClass} font-bold border-b border-inherit`}>
                  <tr>
                    <th className="p-3.5">Faoliyat / Yutuq Turi</th>
                    <th className="p-3.5">Kategoriya</th>
                    <th className="p-3.5">Ball</th>
                    <th className="p-3.5">Tavsif</th>
                    <th className="p-3.5 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-inherit">
                  {scoringRules.map((rule, idx) => (
                    <tr key={idx} className="hover:bg-slate-500/5 transition">
                      <td className="p-3.5 font-bold">
                        {rule.activity}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-300 uppercase">
                          {rule.category}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-mono">
                          +{rule.points} ball
                        </span>
                      </td>
                      <td className="p-3.5 opacity-75 max-w-xs truncate">
                        {rule.description}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleDeleteRule(idx)}
                          className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition"
                          title="O‘chirish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: ROLES ARCHITECTURE */}
      {/* ========================================================= */}
      {activeTab === 'roles' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              Tizim Rollari va Vakolatlari Taqsimoti
            </h2>
            <p className="text-xs opacity-75">
              TKTI TalentHub platformasidagi 4 ta asosiy foydalanuvchi qatlami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`${cardClass} rounded-2xl border p-5 space-y-3 shadow-2xs`}>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-sm">Super Admin (Rektorat)</h3>
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">To‘liq boshqaruv huquqi</span>
                </div>
              </div>
              <p className="text-xs opacity-80 leading-relaxed">
                Institut bo‘yicha to‘liq strategik nazorat, baholash mezonlarini tahrirlash, vazirlik hisobotlarini eksport qilish, barcha talabalar va o‘qituvchilar akkauntlari ustidan nazorat.
              </p>
            </div>

            <div className={`${cardClass} rounded-2xl border p-5 space-y-3 shadow-2xs`}>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400">
                  <Users className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-sm">Administrator (Iqtidorlilar bo‘limi)</h3>
                  <span className="text-[11px] text-sky-600 dark:text-sky-400 font-semibold">Operatsion boshqaruv & Akkountlar nazorati</span>
                </div>
              </div>
              <p className="text-xs opacity-80 leading-relaxed">
                Talabalar va o‘qituvchilar akkauntlarini boshqarish, yangi o‘qituvchilarni kiritish, startap loyihalarni ro‘yxatga olish, tadbirlar tashkil etish va QR-kodli sertifikatlar berish.
              </p>
            </div>

            <div className={`${cardClass} rounded-2xl border p-5 space-y-3 shadow-2xs`}>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                  <GraduationCap className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-sm">O‘qituvchi (Ilmiy Rahbar)</h3>
                  <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">Biriktirilgan talabalar faoliyati</span>
                </div>
              </div>
              <p className="text-xs opacity-80 leading-relaxed">
                O‘ziga biriktirilgan iqtidorli talabalarning ilmiy maqolalari, startap loyihalarini boshqarish, talabalar yutuqlarini tasdiqlash va rasmiy tavsiyanomalar yozish.
              </p>
            </div>

            <div className={`${cardClass} rounded-2xl border p-5 space-y-3 shadow-2xs`}>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <Award className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-sm">Talaba (Shaxsiy Portfolio)</h3>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Shaxsiy kabinet va yutuqlar</span>
                </div>
              </div>
              <p className="text-xs opacity-80 leading-relaxed">
                O‘zining 4 yillik portfoliosi, erishgan yutuqlari, startap loyihalari, QR-kodli rasmiy sertifikatlari va ro‘yxatdan o‘tgan institut tadbirlarini boshqarish.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: AUDIT LOG */}
      {/* ========================================================= */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              <History className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              Tizim Audit Logi (Faoliyat Jurnali)
            </h2>
            <p className="text-xs opacity-75">
              Barcha akkount o‘zgarishlari, ball berish, sertifikat generatsiya qilish xavfsizlik nazorati
            </p>
          </div>

          <div className={`${cardClass} rounded-2xl border shadow-2xs overflow-hidden`}>
            <div className="divide-y divide-inherit text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-500/5 transition">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <div>
                      <div className="font-bold">{log.action}</div>
                      <div className="text-[11px] opacity-65">
                        Obyekt: <strong className="opacity-90">{log.target}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <span className="text-xs opacity-80">Mas’ul: <strong>{log.user}</strong></span>
                    <span className="text-[11px] opacity-60">{log.date}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      {log.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Teacher Modal */}
      <AddTeacherModal
        isOpen={addTeacherModalOpen}
        onClose={() => setAddTeacherModalOpen(false)}
        onAddTeacher={(newTeacher, newAccount) => {
          if (onAddTeacher) onAddTeacher(newTeacher, newAccount);
        }}
        students={students}
      />

      {/* Edit Account Modal */}
      <EditAccountModal
        isOpen={!!editingAccount}
        account={editingAccount}
        onClose={() => setEditingAccount(null)}
        onSaveAccount={(updated) => {
          if (onUpdateAccount) onUpdateAccount(updated);
        }}
        onDeleteAccount={(id) => {
          if (onDeleteAccount) onDeleteAccount(id);
        }}
      />

      {/* New Scoring Rule Modal */}
      {newRuleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className={`w-full max-w-lg ${cardClass} rounded-2xl shadow-2xl border p-6 space-y-4`}>
            <div className="flex items-center justify-between border-b border-inherit pb-3">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-500" />
                Yangi Baholash Mezonini Qo‘shish
              </h3>
              <button onClick={() => setNewRuleModalOpen(false)} className="opacity-60 hover:opacity-100">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddRule} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1 opacity-90">Faoliyat / Yutuq nomi *</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Respublika ilmiy maqolasi (Scopus)"
                  value={ruleActivity}
                  onChange={(e) => setRuleActivity(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border border-inherit ${subtleClass}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 opacity-90">Ball miqdori *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={500}
                    value={rulePoints}
                    onChange={(e) => setRulePoints(Number(e.target.value))}
                    className={`w-full p-2.5 rounded-xl border border-inherit font-mono ${subtleClass}`}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 opacity-90">Kategoriya</label>
                  <select
                    value={ruleCategory}
                    onChange={(e) => setRuleCategory(e.target.value as any)}
                    className={`w-full p-2.5 rounded-xl border border-inherit ${subtleClass}`}
                  >
                    <option value="maqola">Ilmiy Maqola</option>
                    <option value="startap">Startap Loyiha</option>
                    <option value="olimpiada">Fan Olimpiadasi</option>
                    <option value="tanlov">Respublika Tanlovi</option>
                    <option value="xalqaro">Xalqaro Yutuq</option>
                    <option value="grant">Davlat Granti</option>
                    <option value="sertifikat">Til / Kasb Sertifikati</option>
                    <option value="konferensiya">Konferensiya</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 opacity-90">Tavsifi</label>
                <textarea
                  rows={2}
                  placeholder="Mezon qaysi rasmiy nizomga asosan hisoblanadi..."
                  value={ruleDescription}
                  onChange={(e) => setRuleDescription(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border border-inherit ${subtleClass}`}
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewRuleModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold border border-inherit"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-bold bg-amber-500 text-slate-950 hover:bg-amber-400"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
