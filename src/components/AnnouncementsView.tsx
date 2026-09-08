import React, { useState } from 'react';
import { 
  Megaphone, 
  Send, 
  Plus, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Share2, 
  Smartphone,
  Sparkles,
  Layers,
  X
} from 'lucide-react';
import { Announcement, Student, UserRole } from '../types';

interface AnnouncementsViewProps {
  announcements: Announcement[];
  students: Student[];
  currentRole: UserRole;
  onCreateAnnouncement: (announcement: Announcement) => void;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({
  announcements,
  students,
  currentRole,
  onCreateAnnouncement,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [telegramSimModal, setTelegramSimModal] = useState<Announcement | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetType, setTargetType] = useState<Announcement['targetType']>('all');
  const [targetValue, setTargetValue] = useState('');
  const [urgent, setUrgent] = useState(false);
  const [sendToTelegram, setSendToTelegram] = useState(true);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title,
      content,
      targetType,
      targetValue: targetValue || undefined,
      date: new Date().toISOString().split('T')[0],
      author: 'TKTI Iqtidorli talabalar bilan ishlash bo‘limi',
      urgent,
      sentToTelegram: sendToTelegram
    };

    onCreateAnnouncement(newAnn);
    setShowCreateModal(false);
    setTitle('');
    setContent('');
    setTargetValue('');
  };

  const getTargetBadge = (type: Announcement['targetType'], val?: string) => {
    switch (type) {
      case 'all': return { label: 'Barcha talabalar', color: 'bg-slate-100 text-slate-800' };
      case 'faculty': return { label: `Fakultet: ${val || 'Belgilangan'}`, color: 'bg-sky-100 text-sky-800' };
      case 'course': return { label: `Kurs: ${val || 'Belgilangan'}`, color: 'bg-indigo-100 text-indigo-800' };
      case 'direction': return { label: `Yo‘nalish: ${val || 'Belgilangan'}`, color: 'bg-purple-100 text-purple-800' };
      case 'talented_only': return { label: 'Faqat iqtidorli talabalar guruhi', color: 'bg-amber-100 text-amber-900 font-bold' };
      case 'project_participants': return { label: 'Loyiha ishtirokchilariga', color: 'bg-emerald-100 text-emerald-800' };
      default: return { label: 'Umumiy', color: 'bg-slate-100 text-slate-800' };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            E‘lonlar va Telegram Xabarnomalar
          </h1>
          <p className="text-xs text-slate-500">
            Fakultet, kurs, iqtidorlilar yoki loyiha ishtirokchilari bo‘yicha maqsadli e‘lonlar ({announcements.length} ta)
          </p>
        </div>

        {currentRole !== 'student' && (
          <button
            id="create-announcement-btn"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg transition shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi e‘lon yuborish</span>
          </button>
        )}
      </div>

      {/* Telegram Bot & Channel Integration Status Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 text-white p-4 sm:p-5 rounded-2xl border border-sky-800/80 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-md">
            <Send className="w-5 h-5 -translate-x-0.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white">
                TKTI Yosh Olimlar Telegram Kanali: @yosh_olimlar_tktiyf
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                FAOL
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Chiqarilgan barcha rasmiy e‘lonlar avtomatik tarzda rasmiy Telegram kanaliga va talabalarga yetkaziladi.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="https://t.me/yosh_olimlar_tktiyf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
          >
            <Send className="w-3.5 h-3.5 fill-current" />
            <span>@yosh_olimlar_tktiyf kanaliga o‘tish</span>
          </a>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((ann) => {
          const badge = getTargetBadge(ann.targetType, ann.targetValue);

          return (
            <div
              key={ann.id}
              className={`bg-white rounded-2xl border ${
                ann.urgent ? 'border-amber-300/80 shadow-xs' : 'border-slate-200'
              } p-5 sm:p-6 space-y-3 transition`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${badge.color}`}>
                    {badge.label}
                  </span>
                  {ann.urgent && (
                    <span className="px-2 py-0.5 rounded-md bg-rose-500 text-white text-[10px] font-bold animate-pulse">
                      MUHIM / SHOSHILINCH
                    </span>
                  )}
                  {ann.sentToTelegram && (
                    <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-semibold flex items-center gap-1">
                      <Send className="w-2.5 h-2.5" /> Telegramga yuborilgan
                    </span>
                  )}
                </div>

                <span className="text-xs font-mono text-slate-400">
                  📅 {ann.date}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
                  {ann.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1.5 whitespace-pre-line">
                  {ann.content}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                <span>Yuboruvchi: <strong className="text-slate-700">{ann.author}</strong></span>
                
                <button
                  onClick={() => setTelegramSimModal(ann)}
                  className="px-2.5 py-1 text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1.5 bg-sky-50 rounded-lg hover:bg-sky-100 transition"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  Telegram ko‘rinishida sinash
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Telegram Live Preview Modal */}
      {telegramSimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="bg-[#17212b] text-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-700 overflow-hidden space-y-3">
            {/* Telegram Header */}
            <div className="bg-[#242f3d] p-3 flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold text-xs">
                  TH
                </div>
                <div>
                  <div className="font-bold text-xs text-white">TKTI TalentHub Bot</div>
                  <div className="text-[10px] text-sky-400">bot • rasmiy xabarnoma</div>
                </div>
              </div>
              <button
                onClick={() => setTelegramSimModal(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Telegram Message Bubble */}
            <div className="p-4 space-y-2">
              <div className="bg-[#1e2c3a] p-3.5 rounded-xl rounded-tl-xs border border-[#2b5278]/40 space-y-2 text-xs">
                <div className="text-amber-400 font-bold text-xs flex items-center gap-1.5">
                  <Megaphone className="w-3.5 h-3.5" />
                  <span>{telegramSimModal.title}</span>
                </div>

                <div className="text-slate-200 text-xs leading-relaxed">
                  {telegramSimModal.content}
                </div>

                <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between text-[10px] text-slate-400">
                  <span>🏛 {telegramSimModal.author}</span>
                  <span>{telegramSimModal.date} • ✓✓</span>
                </div>
              </div>

              {/* Bot keyboard button */}
              <div className="grid grid-cols-1 gap-1">
                <button
                  onClick={() => alert("Platformada to'liq o'qish uchun havola")}
                  className="py-2 bg-[#2b5278]/60 hover:bg-[#2b5278] text-sky-300 font-bold text-xs rounded-lg transition"
                >
                  🔗 Platformada to‘liq o‘qish / Arizalar
                </button>
              </div>
            </div>

            <div className="p-3 bg-[#0e1621] text-center text-[11px] text-slate-400">
              Telegram Bot simulatsiyasi muvaffaqiyatli ishlamoqda
            </div>
          </div>
        </div>
      )}

      {/* Create Announcement Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-rose-500" />
                  Yangi Maqsadli E‘lon Yuborish
                </h3>
                <p className="text-xs text-slate-500">
                  Fakultet, kurs, yo‘nalish yoki barcha iqtidorli talabalarga xabar berish
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  E‘lon Sarlavhasi *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masalan: “Mirzo Ulug‘bek vorislari” tanloviga hujjatlar qabuli boshlandi"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 text-sm font-semibold"
                />
              </div>

              {/* Target Audience Filter (Prompt Section 4) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kimlarga yuborilsin (Target guruhi) *
                  </label>
                  <select
                    value={targetType}
                    onChange={(e) => setTargetType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 font-medium"
                  >
                    <option value="all">Barcha talabalarga</option>
                    <option value="talented_only">Faqat iqtidorli talabalar guruhiga</option>
                    <option value="faculty">Muayyan fakultetga</option>
                    <option value="course">Muayyan kursga</option>
                    <option value="direction">Yo‘nalish bo‘yicha</option>
                    <option value="project_participants">Loyihalar ishtirokchilariga</option>
                  </select>
                </div>

                {targetType !== 'all' && targetType !== 'talented_only' && (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Fakultet / Kurs yoki guruh nomi
                    </label>
                    <input
                      type="text"
                      value={targetValue}
                      onChange={(e) => setTargetValue(e.target.value)}
                      placeholder="Masalan: Oziq-ovqat texnologiyasi yoki 3-kurs"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  E‘lon Matni *
                </label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="E'lonning to'liq mazmuni, muddatlar, talablar va qatnashish shartlari..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 leading-relaxed text-xs"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={urgent}
                    onChange={(e) => setUrgent(e.target.checked)}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                  <span className="font-semibold text-rose-800">Shoshilinch / Muhim belgisini qo‘yish</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendToTelegram}
                    onChange={(e) => setSendToTelegram(e.target.checked)}
                    className="w-4 h-4 text-sky-600 rounded"
                  />
                  <span className="font-semibold text-sky-800">Telegram bot orqali ham yuborish</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-bold shadow-xs"
                >
                  E‘lonni Chiqarish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
