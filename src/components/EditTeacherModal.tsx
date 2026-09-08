import React, { useState } from 'react';
import { X, Save, GraduationCap, Phone, Mail, BookOpen, Users, Image } from 'lucide-react';
import { Teacher, Student } from '../types';

interface EditTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher;
  students: Student[];
  onSave: (updatedTeacher: Teacher) => void;
}

export const EditTeacherModal: React.FC<EditTeacherModalProps> = ({
  isOpen,
  onClose,
  teacher,
  students = [],
  onSave,
}) => {
  const [fullName, setFullName] = useState(teacher.fullName);
  const [role, setRole] = useState(teacher.role);
  const [department, setDepartment] = useState(teacher.department);
  const [faculty, setFaculty] = useState(teacher.faculty || 'Kimyo-texnologiya');
  const [phone, setPhone] = useState(teacher.phone || '+998 9');
  const [email, setEmail] = useState(teacher.email || '');
  const [specialization, setSpecialization] = useState(teacher.specialization || '');
  const [avatarUrl, setAvatarUrl] = useState(teacher.avatarUrl || '');
  const [status, setStatus] = useState<'active' | 'blocked'>(teacher.status || 'active');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(teacher.assignedStudentIds || []);

  if (!isOpen) return null;

  const toggleStudent = (sId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(sId) ? prev.filter((id) => id !== sId) : [...prev, sId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: Teacher = {
      ...teacher,
      fullName: fullName.trim(),
      role: role.trim(),
      department: department.trim(),
      faculty: faculty.trim(),
      phone: phone.trim(),
      email: email.trim(),
      specialization: specialization.trim(),
      avatarUrl: avatarUrl.trim() || teacher.avatarUrl,
      status,
      assignedStudentIds: selectedStudentIds,
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
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-700 dark:text-purple-300 mb-1">
              <GraduationCap className="w-3 h-3" />
              O‘qituvchi Profilini Boshqarish
            </span>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">
              O‘qituvchi / Ilmiy Rahbar Ma‘lumotlarini Tahrirlash
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Kafedra, ilmiy unvon va biriktirilgan talabalarni boshqarish
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
              src={avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
              alt={fullName}
              className="w-14 h-14 rounded-full object-cover border-2 border-purple-500 shadow-sm shrink-0"
            />
            <div className="flex-1 space-y-1">
              <label className="block font-bold text-slate-700 dark:text-slate-300">
                Profil Rasmi (URL)
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="Rasm URL manzili"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Full Name & Title */}
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
                placeholder="masalan: Prof. Rahimov Sherzod Aliyevich"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Ilmiy Daraja / Lavozim *
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="masalan: Professor, DSc yoki Dotsent, PhD"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Department & Faculty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kafedra *
              </label>
              <input
                type="text"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="masalan: Biotexnologiya kafedrasi"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Fakultet
              </label>
              <input
                type="text"
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                placeholder="masalan: Kimyo-texnologiya fakulteti"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Contacts & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                Telefon
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-400" />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teacher@tkti.uz"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Holati (Status)
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'active' | 'blocked')}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-purple-500 font-semibold"
              >
                <option value="active">Faol (Aktiv)</option>
                <option value="blocked">Bloklangan</option>
              </select>
            </div>
          </div>

          {/* Specialization */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-purple-400" />
              Ilmiy yo‘nalishi va ixtisosligi
            </label>
            <input
              type="text"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              placeholder="masalan: Polimerlar va kompozit materiallar texnologiyasi"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Assigned Students Selector */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-purple-500" />
                Biriktirilgan Talabalar ({selectedStudentIds.length} nafar tanlangan)
              </span>
              <span className="text-[11px] text-slate-400 font-normal">
                Belgilash yoki olib tashlash uchun bosing
              </span>
            </label>
            <div className="max-h-40 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl p-2 space-y-1 bg-slate-50/50 dark:bg-slate-900/40">
              {students.map((s) => {
                const isSelected = selectedStudentIds.includes(s.id);
                return (
                  <div
                    key={s.id}
                    onClick={() => toggleStudent(s.id)}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition text-xs ${
                      isSelected
                        ? 'bg-purple-500/15 border border-purple-500/30 text-purple-900 dark:text-purple-200 font-bold'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="rounded text-purple-600"
                      />
                      <span>{s.fullName}</span>
                      <span className="text-[10px] text-slate-400">({s.direction} - {s.group})</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{s.studentIdNumber}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
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
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition flex items-center gap-1.5 shadow-sm text-xs"
            >
              <Save className="w-4 h-4" />
              <span>O‘zgarishlarni Saqlash</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
