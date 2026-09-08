import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  GraduationCap, 
  Sparkles, 
  CheckCircle2, 
  Upload, 
  Phone, 
  Mail, 
  Send 
} from 'lucide-react';
import { Student } from '../types';
import { FILIAL_YONALISHLARI, INSTITUT_ILMIY_RAHBARLARI } from '../constants/filialData';

interface AddStudentModalProps {
  onClose: () => void;
  onAddStudent: (student: Student) => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  onClose,
  onAddStudent,
}) => {
  const [fullName, setFullName] = useState('');
  const [studentIdNumber, setStudentIdNumber] = useState(`TKTI-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [faculty, setFaculty] = useState('TKTI Filiali');
  const [direction, setDirection] = useState<string>(FILIAL_YONALISHLARI[0]);
  const [course, setCourse] = useState<number>(1);
  const [group, setGroup] = useState('24-01 Guruh');
  const [phone, setPhone] = useState('+998 90 123-45-67');
  const [email, setEmail] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [scientificSupervisor, setScientificSupervisor] = useState(INSTITUT_ILMIY_RAHBARLARI[0].name);
  const [gpa, setGpa] = useState<number>(4.8);
  const [interestsStr, setInterestsStr] = useState('Polimerlar sintezi, Kataliz, Biotexnologiya');
  const [competenciesStr, setCompetenciesStr] = useState('Python, Laboratoriya tahlili, IELTS 7.5, Startap');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const newStudent: Student = {
      id: `stud-${Date.now()}`,
      fullName,
      studentIdNumber,
      faculty,
      direction,
      course,
      group,
      phone,
      email: email || `${studentIdNumber.toLowerCase()}@tkti.uz`,
      telegramUsername: telegramUsername.startsWith('@') ? telegramUsername : `@${telegramUsername || 'talaba'}`,
      avatarUrl,
      interests: interestsStr.split(',').map((s) => s.trim()).filter(Boolean),
      competencies: competenciesStr.split(',').map((s) => s.trim()).filter(Boolean),
      gpa: Number(gpa) || 4.5,
      scientificSupervisor,
      totalPoints: 100, // starting welcome points
      bio: bio || 'Toshkent kimyo-texnologiya instituti iqtidorli talabalar kengashi a‘zosi.',
      achievements: [
        {
          id: `ach-${Date.now()}`,
          studentId: `stud-${Date.now()}`,
          category: 'sertifikat',
          title: 'Institut iqtidorli talabalar safiga qabul',
          level: 'universitet',
          date: new Date().toISOString().split('T')[0],
          points: 100,
          description: 'TKTI saralash komissiyasi xulosasiga ko‘ra qabul qilindi',
          verified: true
        }
      ],
      projectIds: [],
      certificateIds: []
    };

    onAddStudent(newStudent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">
                Yangi Iqtidorli Talabani Ro‘yxatga Olish
              </h3>
              <p className="text-[11px] text-slate-400">
                TKTI yagona talaba profil pasportini shakllantirish
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                F.I.Sh. (Familiya Ism Sharif) *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Masalan: Qodirov Jamshidbek Rustam o‘g‘li"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Talaba ID raqami *
              </label>
              <input
                type="text"
                required
                value={studentIdNumber}
                onChange={(e) => setStudentIdNumber(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>Filial Ta'lim Yo‘nalishi *</span>
              <span className="text-xs text-sky-600 font-normal">18 ta filial yo‘nalishi</span>
            </label>
            <select
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 font-medium text-slate-800"
            >
              {FILIAL_YONALISHLARI.map((yon) => (
                <option key={yon} value={yon}>{yon}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Kurs *
              </label>
              <select
                value={course}
                onChange={(e) => setCourse(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
              >
                <option value={1}>1-kurs</option>
                <option value={2}>2-kurs</option>
                <option value={3}>3-kurs</option>
                <option value={4}>4-kurs</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Akademik Guruh *
              </label>
              <input
                type="text"
                required
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                placeholder="21-42 OXT"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                O‘zlashtirish (GPA) *
              </label>
              <input
                type="number"
                step="0.01"
                min="2.0"
                max="5.0"
                value={gpa}
                onChange={(e) => setGpa(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 font-bold text-emerald-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Telefon raqami
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 90 123-45-67"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Elektron pochta
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="talaba@tkti.uz"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Telegram username
              </label>
              <input
                type="text"
                value={telegramUsername}
                onChange={(e) => setTelegramUsername(e.target.value)}
                placeholder="@username"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Ilmiy Rahbar (Biriktiriladigan o‘qituvchi)
            </label>
            <select
              value={scientificSupervisor}
              onChange={(e) => setScientificSupervisor(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 font-medium text-slate-800"
            >
              {INSTITUT_ILMIY_RAHBARLARI.map((sup) => (
                <option key={sup.name} value={sup.name}>
                  {sup.name} ({sup.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Iqtidor & Kompetensiyalar (vergul bilan ajrating)
            </label>
            <input
              type="text"
              value={competenciesStr}
              onChange={(e) => setCompetenciesStr(e.target.value)}
              placeholder="Python, IELTS 7.5, Sun'iy intellekt, Startap..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Qiziqish Yo‘nalishlari
            </label>
            <input
              type="text"
              value={interestsStr}
              onChange={(e) => setInterestsStr(e.target.value)}
              placeholder="Kimyo, Biotexnologiya, Robototexnika..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Qisqacha Tarjimai hol / Portfolio tavsifi
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Talabaning erishgan yutuqlari va ilmiy yo'nalishi haqida qisqacha ma'lumot..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-bold shadow-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Talabani Saqlash</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
