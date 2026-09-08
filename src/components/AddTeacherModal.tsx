import React, { useState } from 'react';
import { X, UserPlus, GraduationCap, Building2, Phone, Mail, Lock, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import { Teacher, UserAccount, Student } from '../types';
import { useEyeCare } from '../context/EyeCareContext';

interface AddTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTeacher: (teacher: Teacher, account: UserAccount) => void;
  students?: Student[];
}

const DEPARTMENTS = [
  'Oziq-ovqat va biotexnologiya kafedrasi',
  'Kompyuter injiniringi va AI kafedrasi',
  'Kimyo muhandisligi va neft-gaz kafedrasi',
  'Avtomatlashtirish va energetika kafedrasi',
  'Qishloq xo‘jaligi va agronomik fanlar kafedrasi',
  'Iqtisodiyot va menejment kafedrasi',
  'Atrof-muhit muhandisligi va ekologiya kafedrasi',
  'Umumtexnika va matematika kafedrasi',
  'Ijtimoiy-gumanitar fanlar kafedrasi'
];

const ACADEMIC_TITLES = [
  'Professor, DSc',
  'Dotsent, PhD',
  'Katta o‘qituvchi',
  'Assistent / O‘qituvchi',
  'Kafedra mudiri, PhD',
  'Yetakchi ilmiy xodim'
];

const FACULTIES = [
  'Kimyoviy texnologiya fakulteti',
  'Oziq-ovqat texnologiyalari fakulteti',
  'Axborot texnologiyalari va avtomatlashtirish',
  'Muhandislik va energetika',
  'Iqtisodiyot va boshqaruv'
];

export const AddTeacherModal: React.FC<AddTeacherModalProps> = ({
  isOpen,
  onClose,
  onAddTeacher,
  students = []
}) => {
  const { mode } = useEyeCare();

  const [fullName, setFullName] = useState('');
  const [roleTitle, setRoleTitle] = useState(ACADEMIC_TITLES[1]); // Dotsent, PhD
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [faculty, setFaculty] = useState(FACULTIES[0]);
  const [phone, setPhone] = useState('+998 ');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Tkti@2026');
  const [specialization, setSpecialization] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const teacherId = `teacher-${Date.now()}`;
    const accountId = `acc-${teacherId}`;

    const cleanEmail = email.trim() || `${fullName.toLowerCase().replace(/[^a-z]/g, '')}@tktiyf.uz`;

    const newTeacher: Teacher = {
      id: teacherId,
      fullName: fullName.trim(),
      role: roleTitle,
      department,
      faculty,
      phone: phone.trim() || '+998 90 000 00 00',
      email: cleanEmail,
      specialization: specialization.trim() || 'Ilmiy tadqiqotlar va loyihalar',
      assignedStudentIds: selectedStudentIds,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };

    const newAccount: UserAccount = {
      id: accountId,
      fullName: fullName.trim(),
      email: cleanEmail,
      phone: phone.trim() || '+998 90 000 00 00',
      role: 'faculty', // faculty/teacher role
      department,
      title: `${roleTitle} (${department.split(' ')[0]})`,
      status: 'active',
      teacherId: teacherId,
      lastActive: 'Hozirgina qo‘shildi',
      createdAt: new Date().toISOString().split('T')[0]
    };

    onAddTeacher(newTeacher, newAccount);
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      // Reset form
      setFullName('');
      setEmail('');
      setPhone('+998 ');
      setSpecialization('');
      setSelectedStudentIds([]);
    }, 900);
  };

  const toggleStudent = (id: string) => {
    setSelectedStudentIds(prev => 
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    );
  };

  const modalBg = mode === 'warm-sepia'
    ? 'bg-[#fcfaf6] text-[#2d2621] border-[#e8e0d5]'
    : mode === 'calm-dark'
    ? 'bg-[#151e2e] text-slate-100 border-[#26354a]'
    : 'bg-white text-slate-900 border-slate-200';

  const inputClass = mode === 'warm-sepia'
    ? 'bg-[#f5efe6] border-[#decbb7] text-[#2d2621]'
    : mode === 'calm-dark'
    ? 'bg-[#1e293b] border-slate-700 text-slate-200'
    : 'bg-slate-50 border-slate-300 text-slate-900';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        id="add-teacher-modal" 
        className={`w-full max-w-2xl rounded-2xl shadow-2xl border ${modalBg} overflow-hidden my-6 transition-all`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-inherit bg-gradient-to-r from-indigo-900/15 via-sky-900/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight">
                Yangi O‘qituvchi / Ilmiy Rahbar Qo‘shish
              </h3>
              <p className="text-xs opacity-75">
                Filial kafedrasi o‘qituvchisini ro‘yxatdan o‘tkazish va shaxsiy profilini yaratish
              </p>
            </div>
          </div>

          <button
            id="close-add-teacher-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg opacity-70 hover:opacity-100 hover:bg-slate-500/15 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {isSuccess ? (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-lg font-bold text-emerald-500">
              O‘qituvchi muvaffaqiyatli ro‘yxatga olindi!
            </h4>
            <p className="text-xs opacity-75 max-w-md">
              O‘qituvchi profili va tizimga kirish akkounti yaratildi, kafedra ro‘yxatiga biriktirildi.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            
            {/* Full Name & Title */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-7">
                <label className="block text-xs font-bold mb-1 opacity-90">
                  F.I.Sh. (Familiya, Ism, Sharif) *
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
                  <input
                    type="text"
                    required
                    placeholder="Masalan: Prof. Karimov Jamshid Aliyevich"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (!email) {
                        const translit = e.target.value
                          .toLowerCase()
                          .replace(/prof\.|dots\.|katta o‘qituvchi/g, '')
                          .trim()
                          .replace(/\s+/g, '.');
                        if (translit) setEmail(`${translit}@tktiyf.uz`);
                      }
                    }}
                    className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${inputClass}`}
                  />
                </div>
              </div>

              <div className="sm:col-span-5">
                <label className="block text-xs font-bold mb-1 opacity-90">
                  Ilmiy daraja / Lavozim *
                </label>
                <select
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer ${inputClass}`}
                >
                  {ACADEMIC_TITLES.map(title => (
                    <option key={title} value={title}>{title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Department & Faculty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1 opacity-90">
                  Kafedra *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer ${inputClass}`}
                  >
                    {DEPARTMENTS.map(dep => (
                      <option key={dep} value={dep}>{dep}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 opacity-90">
                  Fakultet
                </label>
                <select
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer ${inputClass}`}
                >
                  {FACULTIES.map(fac => (
                    <option key={fac} value={fac}>{fac}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contacts: Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1 opacity-90">
                  Telefon raqami *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
                  <input
                    type="tel"
                    required
                    placeholder="+998 90 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${inputClass}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 opacity-90">
                  Email / Tizim logini *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
                  <input
                    type="email"
                    required
                    placeholder="masalan: j.karimov@tktiyf.uz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${inputClass}`}
                  />
                </div>
              </div>
            </div>

            {/* Initial Password & Specialization */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-5">
                <label className="block text-xs font-bold mb-1 opacity-90">
                  Boshlang‘ich Parol
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono ${inputClass}`}
                  />
                </div>
                <span className="text-[10px] opacity-60 mt-0.5 block">O‘qituvchi keyinroq parolini o‘zgartira oladi</span>
              </div>

              <div className="sm:col-span-7">
                <label className="block text-xs font-bold mb-1 opacity-90">
                  Ilmiy Yo‘nalishi & Mutaxassisligi
                </label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
                  <input
                    type="text"
                    placeholder="Masalan: Nanokompozitlar, organik sintez, biotexnologiya"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${inputClass}`}
                  />
                </div>
              </div>
            </div>

            {/* Assign Students (Optional) */}
            {students.length > 0 && (
              <div>
                <label className="block text-xs font-bold mb-1.5 opacity-90 flex items-center justify-between">
                  <span>Biriktiriladigan Iqtidorli Talabalar (Ixtiyoriy)</span>
                  <span className="text-[11px] font-normal opacity-70">
                    Tanlandi: {selectedStudentIds.length} ta
                  </span>
                </label>
                <div className={`p-2.5 rounded-xl border max-h-36 overflow-y-auto space-y-1.5 ${inputClass}`}>
                  {students.slice(0, 10).map((st) => {
                    const isSelected = selectedStudentIds.includes(st.id);
                    return (
                      <div
                        key={st.id}
                        onClick={() => toggleStudent(st.id)}
                        className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition ${
                          isSelected 
                            ? 'bg-indigo-600 text-white font-semibold' 
                            : 'hover:bg-slate-500/10'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{st.fullName}</span>
                          <span className={`text-[10px] opacity-75 ${isSelected ? 'text-indigo-100' : ''}`}>
                            ({st.faculty})
                          </span>
                        </div>
                        <span className="text-[10px] font-mono opacity-80">
                          {st.totalPoints} ball
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-3 border-t border-inherit flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-400/30 hover:bg-slate-500/10 transition"
              >
                Bekor qilish
              </button>

              <button
                id="submit-new-teacher-btn"
                type="submit"
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition"
              >
                <UserPlus className="w-4 h-4" />
                <span>O‘qituvchini Saqlash & Profil Ochish</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
