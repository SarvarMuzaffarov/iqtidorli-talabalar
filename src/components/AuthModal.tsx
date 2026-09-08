import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  Building2, 
  BookOpen, 
  Sparkles, 
  ShieldCheck, 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  Eye as EyeIcon, 
  EyeOff,
  AlertCircle,
  UserCheck,
  HeartHandshake,
  Shield
} from 'lucide-react';
import { UserRole, Student } from '../types';
import { FILIAL_YONALISHLARI, INSTITUT_ILMIY_RAHBARLARI } from '../constants/filialData';
import { TktiyfLogo } from './TktiyfLogo';
import { useEyeCare } from '../context/EyeCareContext';
import { EyeCareControls } from './EyeCareControls';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  students: Student[];
  onLogin: (role: UserRole, studentId?: string) => void;
  onRegisterStudent: (newStudent: Student) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  students,
  onLogin,
  onRegisterStudent,
}) => {
  const { mode: eyeMode } = useEyeCare();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Keep internal mode in sync with prop if it changes
  useEffect(() => {
    setMode(initialMode);
    setErrorMsg('');
  }, [initialMode, isOpen]);

  // Login Form States
  const [loginIdentifier, setLoginIdentifier] = useState('ali.aliyev@tkti.uz');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState<UserRole>('super_admin');

  // Register Form States (filial yo'nalishlari va ilmiy rahbar)
  const [regFullName, setRegFullName] = useState('');
  const [regDirection, setRegDirection] = useState<string>(FILIAL_YONALISHLARI[0]);
  const [regSupervisor, setRegSupervisor] = useState<string>(INSTITUT_ILMIY_RAHBARLARI[0].name);
  const [customSupervisor, setCustomSupervisor] = useState('');
  const [regCourse, setRegCourse] = useState(1);
  const [regGroup, setRegGroup] = useState('24-01');
  const [regPhone, setRegPhone] = useState('+998 90 123 45 67');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regInterests, setRegInterests] = useState("Sun'iy intellekt, Biotexnologiya, Startap");

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (selectedRole === 'student') {
      const safeStudents = Array.isArray(students) ? students : [];
      const matched = safeStudents.find(
        (s) => 
          s.email.toLowerCase() === loginIdentifier.toLowerCase() ||
          s.studentIdNumber.toLowerCase() === loginIdentifier.toLowerCase() ||
          s.fullName.toLowerCase().includes(loginIdentifier.toLowerCase())
      ) || safeStudents[0];

      onLogin('student', matched?.id || 'stud-1');
    } else {
      onLogin(selectedRole);
    }
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!regFullName.trim()) {
      setErrorMsg('F.I.Sh. (To‘liq ism) kiritilishi shart');
      return;
    }

    const assignedSupervisor = regSupervisor === 'custom'
      ? (customSupervisor.trim() || 'Institut ilmiy rahbari')
      : regSupervisor;

    const newId = `stud-${Date.now()}`;
    const generatedStudentId = `TKTI-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newStudent: Student = {
      id: newId,
      studentIdNumber: generatedStudentId,
      fullName: regFullName.trim(),
      faculty: 'TKTI Filiali',
      direction: regDirection,
      course: Number(regCourse) || 1,
      group: regGroup.trim() || '24-01 Guruh',
      phone: regPhone.trim() || '+998 90 000 00 00',
      email: regEmail.trim() || `${generatedStudentId.toLowerCase()}@tkti.uz`,
      avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?auto=format&fit=crop&q=80&w=400`,
      telegramUsername: `@${regFullName.split(' ')[0].toLowerCase()}_tkti`,
      interests: regInterests.split(',').map((s) => s.trim()).filter(Boolean),
      competencies: [regDirection, "Ilmiy tadqiqot", "Startap loyihalar"],
      gpa: 4.8,
      scientificSupervisor: assignedSupervisor,
      totalPoints: 120,
      bio: `${regDirection} yo‘nalishi iqtidorli talabasi. Ilmiy rahbar: ${assignedSupervisor}.`,
      achievements: [
        {
          id: `ach-${Date.now()}`,
          studentId: newId,
          category: 'sertifikat',
          title: 'TalentHub TKTI platformasidan muvaffaqiyatli ro‘yxatdan o‘tish',
          level: 'universitet',
          date: new Date().toISOString().split('T')[0],
          points: 120,
          description: `Filial talabalar bazasiga kiritildi. Ilmiy rahbar: ${assignedSupervisor}`,
          verified: true,
          verifiedBy: assignedSupervisor
        }
      ],
      projectIds: [],
      certificateIds: []
    };

    onRegisterStudent(newStudent);
    onLogin('student', newStudent.id);
    onClose();
  };

  const handleQuickDemoLogin = (role: UserRole, studentId?: string) => {
    onLogin(role, studentId);
    onClose();
  };

  // Theme-aware styles for eye comfort
  const isDark = eyeMode === 'calm-dark';
  const isSepia = eyeMode === 'warm-sepia';

  const backdropClass = isDark
    ? 'bg-[#0d131d]/75 backdrop-blur-xs'
    : isSepia
    ? 'bg-[#2d2621]/35 backdrop-blur-xs'
    : 'bg-slate-900/40 backdrop-blur-xs';

  const modalContainerClass = isDark
    ? 'bg-[#1a2232] border-[#2a364d] text-slate-100 shadow-2xl'
    : isSepia
    ? 'bg-[#fffdf9] border-[#e8e0d5] text-[#2d2621] shadow-xl'
    : 'bg-white border-slate-200/90 text-slate-800 shadow-xl';

  const headerBgClass = isDark
    ? 'border-[#242e42] bg-[#161e2c]/70'
    : isSepia
    ? 'border-[#f0e8dc] bg-[#faf6ef]/70'
    : 'border-slate-100 bg-slate-50/70';

  const subtlePillClass = isDark
    ? 'bg-[#242e42] text-slate-300 border-[#374563]'
    : isSepia
    ? 'bg-[#f4ede2] text-[#63564c] border-[#dfd4c5]'
    : 'bg-slate-100 text-slate-600 border-slate-200';

  const inputClass = isDark
    ? 'bg-[#121824] border-[#2a364d] text-slate-100 placeholder-slate-500 focus:border-sky-400 focus:bg-[#162030]'
    : isSepia
    ? 'bg-[#faf6ef] border-[#dfd4c5] text-[#2d2621] placeholder-[#9f9387] focus:border-amber-600 focus:bg-[#fffdf9]'
    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:bg-white';

  const textMutedClass = isDark
    ? 'text-slate-400'
    : isSepia
    ? 'text-[#796e65]'
    : 'text-slate-500';

  const tabWrapperClass = isDark
    ? 'bg-[#121824] border-[#2a364d]'
    : isSepia
    ? 'bg-[#f4ede2] border-[#e2d8ca]'
    : 'bg-slate-100 border-slate-200/80';

  const primaryBtnClass = isDark
    ? 'bg-sky-600 hover:bg-sky-500 text-white'
    : isSepia
    ? 'bg-[#7a4823] hover:bg-[#683b1a] text-[#fffdf9]'
    : 'bg-sky-600 hover:bg-sky-500 text-white';

  const registerBtnClass = isDark
    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
    : isSepia
    ? 'bg-[#2d5f3f] hover:bg-[#234b31] text-[#fffdf9]'
    : 'bg-emerald-600 hover:bg-emerald-500 text-white';

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 transition-colors duration-150 ${backdropClass} overflow-y-auto`}>
      <div className={`w-full max-w-lg rounded-2xl border overflow-hidden my-auto max-h-[94vh] flex flex-col transition-all duration-150 ${modalContainerClass}`}>
        
        {/* Modal Header */}
        <div className={`p-5 sm:p-6 border-b relative transition-colors duration-150 ${headerBgClass}`}>
          
          {/* Top Controls: EyeCare + Close Button */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${subtlePillClass}`}>
                <Shield className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>Ko‘zga qulay sokin dizayn</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <EyeCareControls variant="button" />
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition"
                title="Yopish"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Logo & Platform Info */}
          <div className="flex items-center gap-3 mb-4">
            <TktiyfLogo size="md" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">
                  TKTI Yangiyer filiali
                </h2>
                <span className="text-[10px] bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold px-1.5 py-0.5 rounded border border-amber-500/30">
                  TalentHub
                </span>
              </div>
              <p className={`text-[11px] font-medium ${textMutedClass}`}>
                Toshkent kimyo-texnologiya instituti Yangiyer filiali
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className={`grid grid-cols-2 p-1 rounded-xl border ${tabWrapperClass}`}>
            <button
              id="auth-tab-login"
              type="button"
              onClick={() => setMode('login')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'login'
                  ? isDark 
                    ? 'bg-[#1a2232] text-white shadow-xs border border-[#2a364d]' 
                    : isSepia 
                    ? 'bg-[#fffdf9] text-[#2d2621] shadow-xs border border-[#dfd4c5]' 
                    : 'bg-white text-slate-900 shadow-xs border border-slate-200/90'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : isSepia
                  ? 'text-[#796e65] hover:text-[#2d2621]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kirish (Tizimga kirish)
            </button>
            <button
              id="auth-tab-register"
              type="button"
              onClick={() => setMode('register')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'register'
                  ? isDark 
                    ? 'bg-sky-600 text-white shadow-xs' 
                    : isSepia 
                    ? 'bg-[#7a4823] text-white shadow-xs' 
                    : 'bg-sky-600 text-white shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : isSepia
                  ? 'text-[#796e65] hover:text-[#2d2621]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ro‘yxatdan o‘tish (Talabalar)
            </button>
          </div>

        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto max-h-[calc(94vh-180px)]">
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/25 rounded-xl text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}

          {mode === 'login' ? (
            <div>
              {/* Quick Demo Login Presets */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <p className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${textMutedClass}`}>
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Tezkor kirish (Demo rollar):</span>
                  </p>
                  <span className="text-[10px] text-slate-400">1 bosishda kirish</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* Super Admin */}
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('super_admin')}
                    className={`p-2.5 rounded-xl border text-left transition group ${
                      isDark
                        ? 'bg-[#121824] hover:bg-[#162030] border-[#2a364d] hover:border-amber-500/50'
                        : isSepia
                        ? 'bg-[#faf6ef] hover:bg-[#f4ede2] border-[#e2d8ca] hover:border-amber-600/50'
                        : 'bg-amber-50/50 hover:bg-amber-50 border-amber-200/80 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 text-xs font-bold mb-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Super Admin</span>
                    </div>
                    <div className={`text-[10px] truncate ${textMutedClass}`}>Rektorat & Boshqaruv</div>
                  </button>

                  {/* Administrator */}
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('admin')}
                    className={`p-2.5 rounded-xl border text-left transition group ${
                      isDark
                        ? 'bg-[#121824] hover:bg-[#162030] border-[#2a364d] hover:border-sky-500/50'
                        : isSepia
                        ? 'bg-[#faf6ef] hover:bg-[#f4ede2] border-[#e2d8ca] hover:border-sky-600/50'
                        : 'bg-sky-50/50 hover:bg-sky-50 border-sky-200/80 hover:border-sky-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-sky-700 dark:text-sky-300 text-xs font-bold mb-0.5">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Administrator</span>
                    </div>
                    <div className={`text-[10px] truncate ${textMutedClass}`}>Iqtidorlilar bo‘limi</div>
                  </button>

                  {/* O'qituvchi */}
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('teacher')}
                    className={`p-2.5 rounded-xl border text-left transition group ${
                      isDark
                        ? 'bg-[#121824] hover:bg-[#162030] border-[#2a364d] hover:border-purple-500/50'
                        : isSepia
                        ? 'bg-[#faf6ef] hover:bg-[#f4ede2] border-[#e2d8ca] hover:border-purple-600/50'
                        : 'bg-purple-50/50 hover:bg-purple-50 border-purple-200/80 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-purple-700 dark:text-purple-300 text-xs font-bold mb-0.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>O‘qituvchi</span>
                    </div>
                    <div className={`text-[10px] truncate ${textMutedClass}`}>Ilmiy rahbar kabineti</div>
                  </button>

                  {/* Iqtidorli Talaba */}
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('student', students[0]?.id)}
                    className={`p-2.5 rounded-xl border text-left transition group ${
                      isDark
                        ? 'bg-[#121824] hover:bg-[#162030] border-[#2a364d] hover:border-emerald-500/50'
                        : isSepia
                        ? 'bg-[#faf6ef] hover:bg-[#f4ede2] border-[#e2d8ca] hover:border-emerald-600/50'
                        : 'bg-emerald-50/50 hover:bg-emerald-50 border-emerald-200/80 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-0.5">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>Iqtidorli Talaba</span>
                    </div>
                    <div className={`text-[10px] truncate ${textMutedClass}`}>
                      {students[0]?.fullName?.split(' ')[0] || 'Aliyev Ali'}
                    </div>
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-5">
                <div className={`border-t w-full ${isDark ? 'border-[#242e42]' : isSepia ? 'border-[#e8ded1]' : 'border-slate-200'}`} />
                <span className={`px-3 text-[11px] font-medium absolute ${isDark ? 'bg-[#1a2232] text-slate-400' : isSepia ? 'bg-[#fffdf9] text-[#796e65]' : 'bg-white text-slate-500'}`}>
                  yoki hisob orqali kirish
                </span>
              </div>

              {/* Standard Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Rolni tanlang
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs font-medium border transition focus:outline-none ${inputClass}`}
                  >
                    <option value="super_admin">Super Administrator (Rektorat)</option>
                    <option value="admin">Bo‘lim administratori (TKTI)</option>
                    <option value="teacher">O‘qituvchi / Ilmiy rahbar</option>
                    <option value="student">Talaba (Shaxsiy kabinet)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Login / Talaba ID / E-mail
                  </label>
                  <div className="relative">
                    <Mail className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${textMutedClass}`} />
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="ali.aliyev@tkti.uz yoki TKTI-2022-045"
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-xs font-medium border transition focus:outline-none ${inputClass}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Parol
                  </label>
                  <div className="relative">
                    <Lock className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${textMutedClass}`} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full pl-9 pr-10 py-2.5 rounded-xl text-xs font-medium border transition focus:outline-none ${inputClass}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition`}
                      title={showPassword ? "Yashirish" : "Ko'rsatish"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  id="auth-submit-login-btn"
                  type="submit"
                  className={`w-full py-3 px-4 font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-2 mt-3 active:scale-[0.99] ${primaryBtnClass}`}
                >
                  <span>Tizimga kirish</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-center pt-2">
                  <span className={`text-xs ${textMutedClass}`}>
                    Hisobingiz yo‘qmi?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('register')}
                      className="text-amber-600 dark:text-amber-400 hover:underline font-bold"
                    >
                      Ro‘yxatdan o‘tish
                    </button>
                  </span>
                </div>
              </form>
            </div>
          ) : (
            /* Register Mode */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                <span className="leading-relaxed">
                  Ro‘yxatdan o‘tish orqali sizning yagona 4 yillik talaba portfoliangiz shakllanadi va boshlang‘ich <strong>120 ball</strong> beriladi.
                </span>
              </div>

              {/* F.I.Sh. */}
              <div>
                <label className="block text-xs font-semibold mb-1">
                  F.I.Sh. (Familiya, Ism, Sharif) *
                </label>
                <div className="relative">
                  <User className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${textMutedClass}`} />
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="Masalan: Toirov Bobur Ilhom o‘g‘li"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-xs font-medium border transition focus:outline-none ${inputClass}`}
                  />
                </div>
              </div>

              {/* Yo'nalish (Filialda mavjud yo'nalishlar ro'yxati) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold">
                    Filialdagi ta'lim yo‘nalishi *
                  </label>
                  <span className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold">
                    18 ta yo‘nalish
                  </span>
                </div>
                <select
                  value={regDirection}
                  onChange={(e) => setRegDirection(e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-medium border transition focus:outline-none ${inputClass}`}
                >
                  {FILIAL_YONALISHLARI.map((yon) => (
                    <option key={yon} value={yon}>
                      {yon}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ilmiy Rahbar (O'qituvchi) tanlash va biriktirish */}
              <div className={`p-3.5 rounded-xl border space-y-2.5 ${
                isDark ? 'bg-[#121824] border-[#2a364d]' : isSepia ? 'bg-[#faf6ef] border-[#e2d8ca]' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-purple-700 dark:text-purple-300 text-xs font-bold">
                    <UserCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    Ilmiy rahbar (O‘qituvchi)ni tanlang *
                  </span>
                  <span className="text-[10px] text-purple-700 dark:text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full font-semibold">
                    Avtomatik biriktiriladi
                  </span>
                </div>

                <select
                  value={regSupervisor}
                  onChange={(e) => setRegSupervisor(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-medium border transition focus:outline-none ${inputClass}`}
                >
                  {INSTITUT_ILMIY_RAHBARLARI.map((sup) => (
                    <option key={sup.name} value={sup.name}>
                      {sup.name} — {sup.role}
                    </option>
                  ))}
                  <option value="custom">✏️ Boshqa ilmiy rahbar (o‘zingiz kiritish)</option>
                </select>

                {regSupervisor === 'custom' && (
                  <input
                    type="text"
                    required
                    value={customSupervisor}
                    onChange={(e) => setCustomSupervisor(e.target.value)}
                    placeholder="Ilmiy rahbaringizning F.I.Sh. va ilmiy darajasi (masalan: Dots. N. Karimov)"
                    className={`w-full px-3 py-2 rounded-xl text-xs font-medium border transition focus:outline-none ${inputClass}`}
                  />
                )}

                <p className={`text-[11px] leading-relaxed ${textMutedClass}`}>
                  💡 Ro‘yxatdan o‘tganingizdan so‘ng, ushbu ilmiy rahbar o‘zining <strong>O‘qituvchi kabinetida</strong> sizning loyihalaringiz va yutuqlaringizni ko‘rib, tasdiqlaydi.
                </p>
              </div>

              {/* Kurs & Guruh hamda Telefon raqam */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Kurs & Guruh *
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <select
                      value={regCourse}
                      onChange={(e) => setRegCourse(Number(e.target.value))}
                      className={`px-2 py-2 rounded-xl text-xs font-medium border transition focus:outline-none ${inputClass}`}
                    >
                      <option value={1}>1-kurs</option>
                      <option value={2}>2-kurs</option>
                      <option value={3}>3-kurs</option>
                      <option value={4}>4-kurs</option>
                    </select>
                    <input
                      type="text"
                      required
                      value={regGroup}
                      onChange={(e) => setRegGroup(e.target.value)}
                      placeholder="24-01"
                      className={`col-span-2 px-3 py-2 rounded-xl text-xs font-medium border transition focus:outline-none ${inputClass}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Telefon raqam
                  </label>
                  <div className="relative">
                    <Phone className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${textMutedClass}`} />
                    <input
                      type="text"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+998 90 123 45 67"
                      className={`w-full pl-8 pr-3 py-2 rounded-xl text-xs font-medium border transition focus:outline-none ${inputClass}`}
                    />
                  </div>
                </div>
              </div>

              {/* E-mail & Parol */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="talaba@tkti.uz"
                    className={`w-full px-3 py-2 rounded-xl text-xs font-medium border transition focus:outline-none ${inputClass}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Parol
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Kamida 6 belgi"
                    className={`w-full px-3 py-2 rounded-xl text-xs font-medium border transition focus:outline-none ${inputClass}`}
                  />
                </div>
              </div>

              {/* Qiziqish va iqtidor yo'nalishlari */}
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Qiziqish va iqtidor yo‘nalishlari (vergul bilan)
                </label>
                <input
                  type="text"
                  value={regInterests}
                  onChange={(e) => setRegInterests(e.target.value)}
                  placeholder="Sun'iy intellekt, Biotexnologiya, Startap"
                  className={`w-full px-3 py-2 rounded-xl text-xs font-medium border transition focus:outline-none ${inputClass}`}
                />
              </div>

              <button
                id="auth-submit-register-btn"
                type="submit"
                className={`w-full py-3 px-4 font-extrabold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-2 mt-4 active:scale-[0.99] ${registerBtnClass}`}
              >
                <span>Ro‘yxatdan o‘tish va profilni ochish</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-1">
                <span className={`text-xs ${textMutedClass}`}>
                  Hisobingiz bormi?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-sky-600 dark:text-sky-400 hover:underline font-bold"
                  >
                    Kirish
                  </button>
                </span>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
