import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, User, Mail, Phone, Building2, CheckCircle2, AlertTriangle, Key } from 'lucide-react';
import { UserAccount, UserRole } from '../types';
import { useEyeCare } from '../context/EyeCareContext';

interface EditAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: UserAccount | null;
  onSaveAccount: (updatedAccount: UserAccount) => void;
  onDeleteAccount?: (accountId: string) => void;
}

export const EditAccountModal: React.FC<EditAccountModalProps> = ({
  isOpen,
  onClose,
  account,
  onSaveAccount,
  onDeleteAccount
}) => {
  const { mode } = useEyeCare();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [department, setDepartment] = useState('');
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<'active' | 'blocked'>('active');
  const [newPassword, setNewPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (account) {
      setFullName(account.fullName || '');
      setEmail(account.email || '');
      setPhone(account.phone || '');
      setRole(account.role || 'student');
      setDepartment(account.department || '');
      setTitle(account.title || '');
      setStatus(account.status || 'active');
      setNewPassword('');
      setIsSuccess(false);
    }
  }, [account, isOpen]);

  if (!isOpen || !account) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    const updated: UserAccount = {
      ...account,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role,
      department: department.trim(),
      title: title.trim(),
      status
    };

    onSaveAccount(updated);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 700);
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
        id="edit-account-modal" 
        className={`w-full max-w-xl rounded-2xl shadow-2xl border ${modalBg} overflow-hidden my-6 transition-all`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-inherit bg-gradient-to-r from-amber-500/10 via-slate-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight">
                Foydalanuvchi Akkountini Nazorat Qilish
              </h3>
              <p className="text-xs opacity-75">
                Rol, kirish ruxsati, ma’lumotlar va akkaunt statusini boshqarish
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg opacity-70 hover:opacity-100 hover:bg-slate-500/15 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        {isSuccess ? (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-emerald-500">
              Akkount muvaffaqiyatli yangilandi!
            </h4>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            
            {/* Status toggle alert */}
            <div className={`p-3 rounded-xl border flex items-center justify-between ${
              status === 'active' 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300' 
                : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
            }`}>
              <div className="flex items-center gap-2 text-xs">
                <span className={`w-2.5 h-2.5 rounded-full ${status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                <span className="font-bold">
                  Hozirgi holat: {status === 'active' ? 'Faol (Tizimga kirish ochiq)' : 'Bloklangan (Kirish cheklangan)'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setStatus(status === 'active' ? 'blocked' : 'active')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                  status === 'active'
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {status === 'active' ? 'Bloklash' : 'Faollashtirish'}
              </button>
            </div>

            {/* Name & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-7">
                <label className="block text-xs font-bold mb-1 opacity-90">
                  Foydalanuvchi F.I.Sh. *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500 ${inputClass}`}
                  />
                </div>
              </div>

              <div className="sm:col-span-5">
                <label className="block text-xs font-bold mb-1 opacity-90">
                  Tizimdagi Roli *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer ${inputClass}`}
                >
                  <option value="super_admin">Super Admin (Rektorat)</option>
                  <option value="admin">Admin (Iqtidorlilar bo‘limi)</option>
                  <option value="faculty">O‘qituvchi / Rahbar</option>
                  <option value="student">Iqtidorli Talaba</option>
                </select>
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1 opacity-90">
                  Email / Login *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500 ${inputClass}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 opacity-90">
                  Telefon raqami
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500 ${inputClass}`}
                  />
                </div>
              </div>
            </div>

            {/* Department & Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1 opacity-90">
                  Bo‘lim / Kafedra / Fakultet
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500 ${inputClass}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 opacity-90">
                  Lavozim / Izoh
                </label>
                <input
                  type="text"
                  placeholder="Masalan: Dotsent, PhD yoki 4-kurs talaba"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500 ${inputClass}`}
                />
              </div>
            </div>

            {/* Reset Password Optional */}
            <div>
              <label className="block text-xs font-bold mb-1 opacity-90">
                Parolni qayta o‘rnatish (Ixtiyoriy)
              </label>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
                <input
                  type="text"
                  placeholder="Bo‘sh qoldirilsa avvalgi parol saqlanadi"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono ${inputClass}`}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-inherit flex items-center justify-between">
              {onDeleteAccount && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Haqiqatdan ham ushbu akkountni (${account.fullName}) tizimdan o‘chirmoqchimisiz?`)) {
                      onDeleteAccount(account.id);
                      onClose();
                    }
                  }}
                  className="text-xs text-rose-600 hover:text-rose-700 font-bold hover:underline"
                >
                  Akkountni o‘chirish
                </button>
              )}

              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-400/30 hover:bg-slate-500/10 transition"
                >
                  Bekor qilish
                </button>

                <button
                  id="submit-edit-account-btn"
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition"
                >
                  Saqlash
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
