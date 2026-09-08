import React, { useState } from 'react';
import { X, Save, User, Phone, Mail, Send, Award, BookOpen, GraduationCap, Image, Sparkles } from 'lucide-react';
import { Student } from '../types';

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  isAdmin?: boolean;
  onSave: (updatedStudent: Student) => void;
}

export const EditStudentModal: React.FC<EditStudentModalProps> = ({
  isOpen,
  onClose,
  student,
  isAdmin = false,
  onSave,
}) => {
  const [fullName, setFullName] = useState(student.fullName);
  const [studentIdNumber, setStudentIdNumber] = useState(student.studentIdNumber || '');
  const [faculty, setFaculty] = useState(student.faculty || 'Kimyo-texnologiya');
  const [direction, setDirection] = useState(student.direction || '');
  const [course, setCourse] = useState<number>(student.course || 1);
  const [group, setGroup] = useState(student.group || '');
  const [phone, setPhone] = useState(student.phone || '+998 9');
  const [email, setEmail] = useState(student.email || '');
  const [telegramUsername, setTelegramUsername] = useState(student.telegramUsername || '');
  const [scientificSupervisor, setScientificSupervisor] = useState(student.scientificSupervisor || '');
  const [bio, setBio] = useState(student.bio || '');
  const [interestsText, setInterestsText] = useState((student.interests || []).join(', '));
  const [competenciesText, setCompetenciesText] = useState((student.competencies || []).join(', '));
  const [avatarUrl, setAvatarUrl] = useState(student.avatarUrl || '');
  const [gpa, setGpa] = useState<number>(student.gpa || 4.5);
  const [totalPoints, setTotalPoints] = useState<number>(student.totalPoints || 0);

  if (!isOpen) return null;

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const interests = interestsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const competencies = competenciesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const updated: Student = {
      ...student,
      fullName: fullName.trim(),
      studentIdNumber: studentIdNumber.trim(),
      faculty: faculty.trim(),
      direction: direction.trim(),
      course: Number(course),
      group: group.trim(),
      phone: phone.trim(),
      email: email.trim(),
      telegramUsername: telegramUsername.trim().replace(/^@/, ''),
      scientificSupervisor: scientificSupervisor.trim(),
      bio: bio.trim(),
      interests,
      competencies,
      avatarUrl: avatarUrl.trim() || student.avatarUrl,
      ...(isAdmin ? { gpa: Number(gpa), totalPoints: Number(totalPoints) } : {}),
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1a2232] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 sm:p-6 my-6 text-slate-800 dark:text-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5 mb-4">
          <div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 mb-1">
              <User className="w-3 h-3" />
              {isAdmin ? "Talaba Profilini To‘liq Boshqarish (Admin)" : "Mening Shaxsiy Ma‘lumotlarim"}
            </span>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">
              Profil Ma‘lumotlarini Tahrirlash va Saqlash
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              O‘zgartirilgan ma‘lumotlar saqlangach, tizimda va ilmiy portfolioda darhol yangilanadi.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Avatar row */}
          <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <img
              src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={fullName}
              className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500 shadow-sm shrink-0"
            />
            <div className="flex-1 space-y-1.5">
              <label className="block font-bold text-slate-700 dark:text-slate-300">
                Profil Rasmi (Avatar)
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition text-xs inline-flex items-center gap-1.5 shadow-sm">
                  <Image className="w-3.5 h-3.5" />
                  <span>Kompyuterdan rasm yuklash</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFileChange}
                    className="hidden"
                  />
                </label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="yoki rasm URL manzilini kiriting"
                  className="flex-1 min-w-[180px] px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Core Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                F.I.Sh. (To‘liq Ism) *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Talaba ID Raqami *
              </label>
              <input
                type="text"
                required
                disabled={!isAdmin}
                value={studentIdNumber}
                onChange={(e) => setStudentIdNumber(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs focus:outline-none focus:border-indigo-500 ${
                  !isAdmin ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-white dark:bg-slate-900'
                }`}
              />
            </div>
          </div>

          {/* Academic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Ta‘lim Yo‘nalishi *
              </label>
              <input
                type="text"
                required
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                placeholder="masalan: Oziq-ovqat texnologiyasi"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kurs *
              </label>
              <select
                value={course}
                onChange={(e) => setCourse(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value={1}>1-kurs</option>
                <option value={2}>2-kurs</option>
                <option value={3}>3-kurs</option>
                <option value={4}>4-kurs</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Guruh *
              </label>
              <input
                type="text"
                required
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                placeholder="masalan: 21-04"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                Telefon Raqam
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-400" />
                Elektron Pochta
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="talaba@tkti.uz"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Send className="w-3 h-3 text-sky-400" />
                Telegram Username
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 font-bold text-xs">@</span>
                <input
                  type="text"
                  value={telegramUsername}
                  onChange={(e) => setTelegramUsername(e.target.value)}
                  placeholder="username"
                  className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Scientific Supervisor */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <GraduationCap className="w-3 h-3 text-indigo-400" />
              Ilmiy Rahbar (F.I.Sh. va ilmiy unvoni)
            </label>
            <input
              type="text"
              value={scientificSupervisor}
              onChange={(e) => setScientificSupervisor(e.target.value)}
              placeholder="masalan: dots. Qurbonov A.B. (Kimyo kafedrasi)"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Bio / About */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              O‘zingiz haqida qisqacha ma‘lumot (Bio)
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Qaysi sohalarga qiziqasiz, qanday ilmiy izlanishlar olib boryapsiz..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Interests & Competencies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Ilmiy qiziqishlar (vergul bilan ajrating)
              </label>
              <input
                type="text"
                value={interestsText}
                onChange={(e) => setInterestsText(e.target.value)}
                placeholder="masalan: Polimerlar, Nanotexnologiya, Yashil kimyo"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Asosiy kompetensiyalar / Ko‘nikmalar
              </label>
              <input
                type="text"
                value={competenciesText}
                onChange={(e) => setCompetenciesText(e.target.value)}
                placeholder="masalan: Laboratoriya tahlillari, Xromatografiya, Python"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Admin only fields: GPA and Points */}
          {isAdmin && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-amber-800 dark:text-amber-300 mb-1">
                  Reyting Bali (Umumiy Ball)
                </label>
                <input
                  type="number"
                  value={totalPoints}
                  onChange={(e) => setTotalPoints(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-amber-500 font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-amber-800 dark:text-amber-300 mb-1">
                  O‘rtacha Ball (GPA)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="2.0"
                  max="5.0"
                  value={gpa}
                  onChange={(e) => setGpa(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-amber-500 font-bold"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition text-xs"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition flex items-center gap-1.5 shadow-sm text-xs"
            >
              <Save className="w-4 h-4" />
              <span>Saqlash va Yangilash</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
