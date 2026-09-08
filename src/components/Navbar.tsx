import React from 'react';
import { UserRole, Student } from '../types';
import { TktiyfLogo } from './TktiyfLogo';
import { EyeCareControls } from './EyeCareControls';
import { useEyeCare } from '../context/EyeCareContext';
import { UserAvatar } from './UserAvatar';
import { 
  ShieldCheck, 
  GraduationCap, 
  Building2, 
  UserCheck, 
  QrCode, 
  Bell, 
  Search, 
  RotateCcw,
  Sparkles,
  UserPlus,
  LogOut,
  Send,
  Database
} from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  students?: Student[];
  activeStudentId?: string;
  onActiveStudentChange?: (id: string) => void;
  onOpenVerifyModal: () => void;
  onOpenFirebaseStatus?: () => void;
  onOpenAddStudent?: () => void;
  onOpenAddTeacher?: () => void;
  onResetData?: () => void;
  onLogout?: () => void;
  unreadAnnouncementsCount?: number;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole = 'super_admin',
  onRoleChange,
  students = [],
  activeStudentId = '',
  onActiveStudentChange,
  onOpenVerifyModal,
  onOpenFirebaseStatus,
  onOpenAddStudent,
  onOpenAddTeacher,
  onResetData,
  onLogout,
  unreadAnnouncementsCount = 0,
  searchQuery = '',
  onSearchChange,
  onOpenSearch,
}) => {
  const { mode } = useEyeCare();
  const safeStudents = Array.isArray(students) ? students : [];
  const activeStudent = safeStudents.length > 0 
    ? (safeStudents.find((s) => s.id === activeStudentId) || safeStudents[0]) 
    : null;

  const headerBgClass = mode === 'warm-sepia'
    ? 'bg-[#29221c] border-[#3d332b]'
    : mode === 'calm-dark'
    ? 'bg-[#161f2e] border-[#253347]'
    : 'bg-[#1e293b] border-slate-750';

  return (
    <header id="main-header" className={`${headerBgClass} text-white border-b sticky top-0 z-30 shadow-xs transition-colors duration-150 w-full max-w-full overflow-hidden`}>
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-3">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <TktiyfLogo size="sm" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                  <span className="sm:hidden">TKTIYF</span>
                  <span className="hidden sm:inline">TKTI Yangiyer filiali</span>
                </span>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-1.5 py-0.5 rounded border border-amber-400/30">
                  TalentHub
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium hidden sm:block line-clamp-1">
                Toshkent kimyo-texnologiya instituti Yangiyer filiali
              </p>
            </div>
          </div>

          {/* Center Search Input or Quick Search Trigger */}
          <div className="flex-1 max-w-md hidden md:block">
            {onSearchChange ? (
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Tezkor qidiruv (talaba, loyiha, soha)..."
                  className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-slate-800/90 text-slate-200 placeholder-slate-400 text-xs border border-slate-700/80 focus:outline-none focus:border-sky-500 focus:bg-slate-800 transition"
                />
              </div>
            ) : (
              <button
                id="global-search-btn"
                onClick={onOpenSearch}
                className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs border border-slate-700/70 transition"
              >
                <span className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <span>Qidiruv (masalan: “Sun'iy intellekt”, “Olimpiada”)...</span>
                </span>
                <kbd className="px-1.5 py-0.5 bg-slate-700 text-slate-300 text-[10px] rounded font-mono border border-slate-600">
                  ⌘K
                </kbd>
              </button>
            )}
          </div>

          {/* Right Action Controls: Add Student, QR Verify, Role Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* Quick Add Student Button (for Admin & SuperAdmin) */}
            {currentRole !== 'student' && onOpenAddStudent && (
              <button
                onClick={onOpenAddStudent}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition"
                title="Yangi talaba kiritish"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Talaba qo‘shish</span>
              </button>
            )}

            {/* Quick Add Teacher Button (for Admin & SuperAdmin) */}
            {currentRole !== 'student' && onOpenAddTeacher && (
              <button
                onClick={onOpenAddTeacher}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
                title="Yangi o‘qituvchi profilini qo‘shish"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>+ O‘qituvchi</span>
              </button>
            )}

            {/* Telegram Channel Link */}
            <a
              id="navbar-telegram-btn"
              href="https://t.me/yosh_olimlar_tktiyf"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-semibold transition"
              title="TKTI Yosh Olimlar Telegram Kanali: @yosh_olimlar_tktiyf"
            >
              <Send className="w-3.5 h-3.5 text-sky-400 fill-sky-400/20" />
              <span className="hidden xl:inline">@yosh_olimlar_tktiyf</span>
              <span className="xl:hidden">Telegram</span>
            </a>

            {/* Quick QR Code Verify Tool */}
            <button
              id="verify-qr-nav-btn"
              onClick={onOpenVerifyModal}
              title="Sertifikatni QR-kod orqali tekshirish"
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition shrink-0"
            >
              <QrCode className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="hidden md:inline">QR Tekshirish</span>
            </button>

            {/* Firebase Database Status Modal Button */}
            {onOpenFirebaseStatus && (
              <button
                id="firebase-status-nav-btn"
                onClick={onOpenFirebaseStatus}
                title="Firebase Firestore bulutli baza ma'lumotlari"
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold transition shrink-0"
              >
                <Database className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="hidden md:inline">Firebase</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              </button>
            )}

            {/* Eye-Care Visual Comfort Toggle */}
            <EyeCareControls variant="button" />

            {/* Role Switcher Pill */}
            <div className="flex items-center bg-slate-800/90 p-0.5 sm:p-1 rounded-xl border border-slate-700 shrink-0">
              <span className="text-[10px] uppercase font-bold text-slate-400 px-1.5 hidden xl:inline">
                Rol:
              </span>
              <select
                id="role-selector"
                value={currentRole}
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
                aria-label="Tizimdagi rol"
                className="bg-transparent text-xs font-semibold text-amber-300 focus:outline-none cursor-pointer pr-1 py-0.5 max-w-[85px] sm:max-w-[140px] truncate"
              >
                <option value="super_admin" className="bg-slate-900 text-white">Super Admin</option>
                <option value="admin" className="bg-slate-900 text-white">Admin</option>
                <option value="faculty" className="bg-slate-900 text-white">O‘qituvchi</option>
                <option value="student" className="bg-slate-900 text-white">Talaba</option>
              </select>
            </div>

            {/* If Student role active, pick active student */}
            {currentRole === 'student' && onActiveStudentChange && safeStudents.length > 0 && (
              <div className="hidden md:flex items-center shrink-0">
                <select
                  id="active-student-selector"
                  value={activeStudentId}
                  onChange={(e) => onActiveStudentChange(e.target.value)}
                  aria-label="Talabani tanlash"
                  className="bg-slate-800 text-xs text-sky-300 border border-sky-500/40 rounded-lg px-2 py-1.5 focus:outline-none max-w-[120px] truncate"
                >
                  {safeStudents.map((s) => (
                    <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                      {s.fullName.split(' ')[0]} {s.fullName.split(' ')[1] || ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Reset Data to original state if handler passed */}
            {onResetData && (
              <button
                id="reset-data-btn"
                onClick={onResetData}
                title="Namunaviy ma'lumotlarni qayta tiklash"
                className="hidden sm:block p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition shrink-0"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            {/* Current user avatar / badge */}
            <div className="flex items-center gap-1.5 pl-1 border-l border-slate-800 shrink-0">
              <div className="relative">
                {currentRole === 'student' && activeStudent ? (
                  <UserAvatar
                    src={activeStudent.avatarUrl}
                    name={activeStudent.fullName}
                    size="sm"
                    className="rounded-full border border-amber-400/60"
                  />
                ) : (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-[11px] sm:text-xs text-white">
                    {currentRole === 'super_admin' ? 'SA' : currentRole === 'admin' ? 'AD' : 'FK'}
                  </div>
                )}
                {unreadAnnouncementsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-900 animate-pulse" />
                )}
              </div>

              {/* Chiqish (Logout) button to return to Asosiy Sahifa */}
              {onLogout && (
                <button
                  id="navbar-logout-btn"
                  onClick={onLogout}
                  title="Tizimdan chiqish (Asosiy sahifaga qaytish)"
                  className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-700/80 hover:border-rose-500/30 text-xs font-semibold transition"
                >
                  <LogOut className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden xl:inline text-[11px]">Chiqish</span>
                </button>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
