import React from 'react';
import { 
  LogIn, 
  UserPlus, 
  QrCode, 
  Award, 
  Lightbulb, 
  Calendar, 
  TrendingUp, 
  GraduationCap, 
  ShieldCheck, 
  CheckCircle2, 
  Users, 
  FileText, 
  ArrowRight,
  Sparkles,
  ExternalLink,
  Send,
  Eye
} from 'lucide-react';
import { Student, Project, UniversityEvent, Certificate } from '../types';
import { TktiyfLogo } from './TktiyfLogo';
import { EyeCareControls } from './EyeCareControls';
import { useEyeCare } from '../context/EyeCareContext';

interface LandingPageProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenVerify: () => void;
  students: Student[];
  projects: Project[];
  events: UniversityEvent[];
  certificates: Certificate[];
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin,
  onOpenRegister,
  onOpenVerify,
  students,
  projects,
  events,
  certificates,
}) => {
  const { mode } = useEyeCare();
  const safeStudents = Array.isArray(students) ? students : [];
  const safeProjects = Array.isArray(projects) ? projects : [];
  const safeCertificates = Array.isArray(certificates) ? certificates : [];

  // Exact real statistics based strictly on available system data
  const actualStudentsCount = safeStudents.length;
  const actualProjectsCount = safeProjects.length;
  const actualCertificatesCount = safeCertificates.length;
  const actualArticlesCount = safeStudents.reduce((acc, st) => {
    return acc + (st.achievements || []).filter(a => a.category === 'maqola').length;
  }, 0);

  // Top 3 students for preview
  const topStudents = [...safeStudents].sort((a, b) => b.totalPoints - a.totalPoints).slice(0, 3);

  // Theme-aware styles for restful, eye-friendly graphics
  const isDark = mode === 'calm-dark';
  const isSepia = mode === 'warm-sepia';

  const containerClass = isDark
    ? 'bg-[#121824] text-slate-100'
    : isSepia
    ? 'bg-[#faf6ef] text-[#2d2621]'
    : 'bg-[#f8fafc] text-slate-800';

  const headerClass = isDark
    ? 'bg-[#1a2232]/95 border-[#2a364d]'
    : isSepia
    ? 'bg-[#fffdf9]/95 border-[#e8e0d5]'
    : 'bg-white/95 border-slate-200/80';

  const cardClass = isDark
    ? 'bg-[#1a2232] border-[#2a364d] hover:border-slate-600 text-slate-100'
    : isSepia
    ? 'bg-[#fffdf9] border-[#e8e0d5] hover:border-[#d4c8b8] text-[#2d2621]'
    : 'bg-white border-slate-200/90 hover:border-slate-300 text-slate-800 shadow-xs hover:shadow-sm';

  const subtlePillClass = isDark
    ? 'bg-[#242e42] border-[#374563] text-slate-300'
    : isSepia
    ? 'bg-[#f4ede2] border-[#dfd4c5] text-[#63564c]'
    : 'bg-slate-100 border-slate-200 text-slate-700';

  const textMutedClass = isDark
    ? 'text-slate-400'
    : isSepia
    ? 'text-[#796e65]'
    : 'text-slate-500';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${containerClass}`}>
      
      {/* Top Navigation Bar */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b shadow-xs transition-colors duration-200 ${headerClass}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            
            {/* Official TKTI Yangiyer filiali Logo */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              <TktiyfLogo size="md" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm sm:text-base tracking-tight">
                    TKTI Yangiyer filiali
                  </span>
                  <span className="text-[10px] bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold px-1.5 py-0.5 rounded border border-amber-500/30">
                    TalentHub
                  </span>
                </div>
                <p className={`text-[10px] sm:text-[11px] font-medium hidden sm:block ${textMutedClass}`}>
                  Toshkent kimyo-texnologiya instituti Yangiyer filiali
                </p>
              </div>
            </div>

            {/* Right Action buttons */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              
              {/* Eye-Care Quick Controls */}
              <EyeCareControls variant="button" />

              {/* Telegram Channel Link */}
              <a
                id="landing-telegram-header-btn"
                href="https://t.me/yosh_olimlar_tktiyf"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-500/30 text-xs font-semibold transition"
                title="TKTI Yosh Olimlar Telegram Kanali"
              >
                <Send className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>@yosh_olimlar_tktiyf</span>
              </a>

              {/* QR Verification Button (Public) */}
              <button
                id="landing-verify-btn"
                onClick={onOpenVerify}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition"
                title="Sertifikat haqiqiyligini tekshirish"
              >
                <QrCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">QR Tekshirish</span>
              </button>

              {/* Ro'yxatdan o'tish */}
              <button
                id="landing-register-btn"
                onClick={onOpenRegister}
                className={`hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${subtlePillClass} hover:opacity-90`}
              >
                <UserPlus className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Ro‘yxatdan o‘tish</span>
              </button>

              {/* Main "Kirish" Button */}
              <button
                id="landing-login-btn"
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-sm transition active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Kirish</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Eye-Friendly Hero Section */}
        <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200/70 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            
            {/* Institute Tag & Eye-Care Badge */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium shadow-xs ${subtlePillClass}`}>
                <TktiyfLogo size="xs" />
                <span>Oliy ta’lim, fan va innovatsiyalar vazirligi</span>
                <span className="text-slate-400">•</span>
                <span className="font-bold text-sky-700 dark:text-sky-300">TKTI Yangiyer filiali</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-800 dark:text-emerald-300 text-xs font-semibold shadow-xs">
                <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Ko‘zga bezarar sokin grafik & dizayn</span>
              </div>

              <a
                href="https://t.me/yosh_olimlar_tktiyf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-500/10 hover:bg-sky-500/20 border border-sky-400/30 text-sky-800 dark:text-sky-300 text-xs font-bold shadow-xs transition"
              >
                <Send className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>Telegram: @yosh_olimlar_tktiyf</span>
                <ExternalLink className="w-3 h-3 ml-0.5 text-sky-500" />
              </a>
            </div>

            {/* Main Headline with Soothing, High-Legibility Typography */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto mb-5">
              Iqtidorli talabalarni boshqarish va{' '}
              <span className="text-sky-700 dark:text-sky-400 underline decoration-sky-400/40 underline-offset-8">
                rag‘batlantirish platformasi
              </span>
            </h1>

            {/* Subtitle */}
            <p className={`text-sm sm:text-base max-w-3xl mx-auto mb-9 leading-relaxed ${textMutedClass}`}>
              Talaba bir marta ro‘yxatdan o‘tadi → 4 yillik yagona portfoliosi shakllanadi → yutuqlari, startap loyihalari,
              ilmiy maqolalari va QR-kodli sertifikatlari ko‘zga qulay bitta tizimda boshqariladi.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
              <button
                id="hero-login-cta"
                onClick={onOpenLogin}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span>Tizimga kirish</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                id="hero-register-cta"
                onClick={onOpenRegister}
                className={`w-full sm:w-auto px-6 py-3 rounded-xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${cardClass}`}
              >
                <UserPlus className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Talaba sifatida ro‘yxatdan o‘tish</span>
              </button>

              <button
                id="hero-verify-cta"
                onClick={onOpenVerify}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition"
              >
                <QrCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>QR Sertifikatni tekshirish</span>
              </button>
            </div>

            {/* Quick Metrics Bar in Eye-Friendly Cards - Faqat mavjud bo'lgan aniq ma'lumotlar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
              
              <div className={`p-4 rounded-xl border text-center transition ${cardClass}`}>
                <div className="text-2xl sm:text-3xl font-extrabold text-sky-700 dark:text-sky-400 mb-0.5">
                  {actualStudentsCount}
                </div>
                <div className={`text-xs font-semibold ${textMutedClass}`}>Iqtidorli talabalar</div>
                <div className="text-[10px] opacity-65 mt-0.5">Bazada ro‘yxatda</div>
              </div>

              <div className={`p-4 rounded-xl border text-center transition ${cardClass}`}>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-700 dark:text-amber-400 mb-0.5">
                  {actualProjectsCount}
                </div>
                <div className={`text-xs font-semibold ${textMutedClass}`}>Startap va loyihalar</div>
                <div className="text-[10px] opacity-65 mt-0.5">Institut ishlanmalari</div>
              </div>

              <div className={`p-4 rounded-xl border text-center transition ${cardClass}`}>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 mb-0.5">
                  {actualCertificatesCount}
                </div>
                <div className={`text-xs font-semibold ${textMutedClass}`}>QR-kodli sertifikatlar</div>
                <div className="text-[10px] opacity-65 mt-0.5">Berilgan va tekshirilgan</div>
              </div>

              <div className={`p-4 rounded-xl border text-center transition ${cardClass}`}>
                <div className="text-2xl sm:text-3xl font-extrabold text-indigo-700 dark:text-indigo-400 mb-0.5">
                  {actualArticlesCount}
                </div>
                <div className={`text-xs font-semibold ${textMutedClass}`}>Ilmiy maqolalar (Scopus/OAK)</div>
                <div className="text-[10px] opacity-65 mt-0.5">Nashr etilgan ishlar</div>
              </div>

            </div>

          </div>
        </section>

        {/* 6 Core Pillars Section with Gentle, High-Readability Layout */}
        <section className="py-14 lg:py-20 border-b border-slate-200/70 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
                Platformaning asosiy imkoniyatlari
              </h2>
              <p className={`text-xs sm:text-sm ${textMutedClass}`}>
                Toshkent kimyo-texnologiya instituti Yangiyer filialida iqtidorli yoshlar faoliyatini to‘liq raqamlashtirish
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Feature 1 */}
              <div className={`p-5 rounded-2xl border transition ${cardClass}`}>
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-700 dark:text-sky-400 flex items-center justify-center mb-3.5 border border-sky-500/20">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-sm sm:text-base font-bold mb-1.5">
                  Yagona 4 yillik talaba profili
                </h3>
                <p className={`text-xs leading-relaxed ${textMutedClass}`}>
                  Har bir talaba uchun to‘liq pasport: F.I.Sh., Talaba ID, fakultet, yo‘nalish, guruh, GPA, ilmiy rahbar va barcha yutuqlar xronologiyasi.
                </p>
              </div>

              {/* Feature 2 */}
              <div className={`p-5 rounded-2xl border transition ${cardClass}`}>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-3.5 border border-amber-500/20">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <h3 className="text-sm sm:text-base font-bold mb-1.5">
                  Startap va ilmiy ishlanmalar
                </h3>
                <p className={`text-xs leading-relaxed ${textMutedClass}`}>
                  Talabalar loyihalari pasporti: muammo, yechim, jamoa a’zolari, moliyalashtirish va bosqichlar (G‘oya, Prototip, Tijoratlashtirish).
                </p>
              </div>

              {/* Feature 3 */}
              <div className={`p-5 rounded-2xl border transition ${cardClass}`}>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-3.5 border border-emerald-500/20">
                  <QrCode className="w-5 h-5" />
                </div>
                <h3 className="text-sm sm:text-base font-bold mb-1.5">
                  QR-kodli rasmiy sertifikatlar
                </h3>
                <p className={`text-xs leading-relaxed ${textMutedClass}`}>
                  Tadbir qatnashchilariga seriya raqamli va skanerlanuvchi xavfsiz QR-kodga ega rasmiy elektron sertifikatlar taqdim etish.
                </p>
              </div>

              {/* Feature 4 */}
              <div className={`p-5 rounded-2xl border transition ${cardClass}`}>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 flex items-center justify-center mb-3.5 border border-indigo-500/20">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-sm sm:text-base font-bold mb-1.5">
                  Shaffof reyting va ball tizimi
                </h3>
                <p className={`text-xs leading-relaxed ${textMutedClass}`}>
                  Respublika 1-o‘rin (+100), xalqaro tanlov (+120), maqola (+50), startap (+70) mezonlari asosida «Eng faol 100 talaba» reytingi.
                </p>
              </div>

              {/* Feature 5 */}
              <div className={`p-5 rounded-2xl border transition ${cardClass}`}>
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-700 dark:text-rose-400 flex items-center justify-center mb-3.5 border border-rose-500/20">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="text-sm sm:text-base font-bold mb-1.5">
                  Tadbirlar va ishtirokchilar reyestri
                </h3>
                <p className={`text-xs leading-relaxed ${textMutedClass}`}>
                  Institut xakatonlari, seminarlari va tanlovlariga talabalar bir bosishda ro‘yxatdan o‘tadi; ishtirokchilar ro‘yxati avtomatik shakllanadi.
                </p>
              </div>

              {/* Feature 6 */}
              <div className={`p-5 rounded-2xl border transition ${cardClass}`}>
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-700 dark:text-teal-400 flex items-center justify-center mb-3.5 border border-teal-500/20">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-sm sm:text-base font-bold mb-1.5">
                  Vazirlik uchun 1-klikda hisobot
                </h3>
                <p className={`text-xs leading-relaxed ${textMutedClass}`}>
                  Fakultetlar bo‘yicha iqtidorli talabalar ko‘rsatkichlari, maqolalar va startaplar ro‘yxatini rasmiy hisobot formatida yuklab olish.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Top 3 Students Leaderboard Showcase */}
        {topStudents.length > 0 && (
          <section className="py-14 lg:py-18 border-b border-slate-200/70 dark:border-slate-800">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="text-center max-w-xl mx-auto mb-9">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1 block">
                  Reyting yetakchilari
                </span>
                <h2 className="text-2xl font-black">
                  Institutning eng faol iqtidorli talabalari
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {topStudents.map((st, idx) => (
                  <div
                    key={st.id}
                    className={`p-5 rounded-2xl border text-center flex flex-col items-center transition ${cardClass}`}
                  >
                    <div className="text-sm font-bold mb-2">
                      {idx === 0 ? '🥇 1-o‘rin' : idx === 1 ? '🥈 2-o‘rin' : '🥉 3-o‘rin'}
                    </div>
                    <img
                      src={st.avatarUrl}
                      alt={st.fullName}
                      className="w-16 h-16 rounded-full object-cover border-2 border-amber-500/60 mb-3 shadow-xs"
                    />
                    <h4 className="font-bold text-sm mb-0.5">{st.fullName}</h4>
                    <p className={`text-[11px] mb-3 line-clamp-1 ${textMutedClass}`}>{st.faculty}</p>
                    <div className="mt-auto px-3 py-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 font-extrabold text-xs border border-amber-500/25">
                      {st.totalPoints} Ball
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-7">
                <button
                  onClick={onOpenLogin}
                  className="text-xs text-sky-700 dark:text-sky-400 hover:underline font-bold inline-flex items-center gap-1"
                >
                  To‘liq 100 talaba reytingini ko‘rish uchun tizimga kiring <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Official Telegram Channel Banner Section - Restful & Eye-Friendly */}
        <section className="py-12 border-b border-slate-200/70 dark:border-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`rounded-2xl border p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs ${cardClass}`}>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/20">
                  <Send className="w-6 h-6" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider mb-1">
                    <span>Rasmiy Hamjamiyat</span>
                    <span>•</span>
                    <span>TKTI Yosh Olimlar Kengashi</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black mb-1.5">
                    Telegram Kanalimizga A‘zo Bo‘ling
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed max-w-xl ${textMutedClass}`}>
                    Institutdagi barcha ilmiy tanlovlar, davlat stipendiyalari (Prezident, Beruniy), xalqaro grantlar va startap imkoniyatlari bevosita <span className="font-bold text-sky-700 dark:text-sky-300">@yosh_olimlar_tktiyf</span> kanalida e‘lon qilib boriladi.
                  </p>
                </div>
              </div>

              <div className="shrink-0 w-full md:w-auto">
                <a
                  id="landing-telegram-cta-btn"
                  href="https://t.me/yosh_olimlar_tktiyf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>@yosh_olimlar_tktiyf kanaliga ulanish</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </a>
              </div>

            </div>
          </div>
        </section>

        {/* Quick CTA Banner */}
        <section className={`py-12 border-b border-slate-200/70 dark:border-slate-800 ${subtlePillClass}`}>
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h3 className="text-xl sm:text-2xl font-black mb-2">
              TalentHub TKTI tizimidan foydalanishni boshlang
            </h3>
            <p className={`text-xs sm:text-sm max-w-xl mx-auto mb-5 ${textMutedClass}`}>
              Talaba sifatida o‘z ilmiy faoliyatingizni yagona portfolioga jamlang yoki administrator sifatida institut jarayonlarini boshqaring.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={onOpenLogin}
                className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-xs transition flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Kirish</span>
              </button>
              <button
                onClick={onOpenRegister}
                className={`px-6 py-2.5 rounded-xl border font-bold text-xs transition flex items-center gap-2 ${cardClass}`}
              >
                <UserPlus className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Ro‘yxatdan o‘tish</span>
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* Institutional Footer */}
      <footer className={`py-8 text-xs border-t transition-colors ${isDark ? 'bg-[#0d131d] border-[#1e293b] text-slate-400' : isSepia ? 'bg-[#f4ede2] border-[#dfd4c5] text-[#796e65]' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <TktiyfLogo size="sm" />
            <div>
              <span className="font-bold">Toshkent kimyo-texnologiya instituti Yangiyer filiali</span>
              <p className="text-[11px] opacity-75">TalentHub TKTIYF © 2019 - 2026</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 opacity-90">
            <a
              href="https://t.me/yosh_olimlar_tktiyf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sky-700 dark:text-sky-400 hover:underline font-bold"
            >
              <Send className="w-3.5 h-3.5" />
              <span>@yosh_olimlar_tktiyf</span>
            </a>
            <span>•</span>
            <span>Sirdaryo viloyati, Yangiyer shahri, Tinchlik ko‘chasi, 1-uy</span>
            <span>•</span>
            <span>info@tktiyf.uz</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
