import React, { useState, useEffect } from 'react';
import { 
  Database, 
  CheckCircle2, 
  ExternalLink, 
  RefreshCw, 
  X, 
  Copy, 
  Check, 
  Server, 
  Cloud, 
  Layers, 
  Send 
} from 'lucide-react';
import { 
  getDatabaseStatus, 
  sendTestPing, 
  FIREBASE_INFO 
} from '../lib/firestoreService';

interface FirebaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseStatusModal: React.FC<FirebaseStatusModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [pingLoading, setPingLoading] = useState(false);
  const [pingSuccess, setPingSuccess] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    const res = await getDatabaseStatus();
    setStatus(res);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
      setPingSuccess(null);
    }
  }, [isOpen]);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleTestPing = async () => {
    setPingLoading(true);
    try {
      const ping = await sendTestPing();
      setPingSuccess(`Muvaffaqiyatli yozildi: ${ping.timestamp} (${ping.id})`);
      await fetchStatus();
    } catch (e: any) {
      setPingSuccess('Xatolik: ' + (e?.message || 'Yozib bo‘lmadi'));
    } finally {
      setPingLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl text-slate-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Google Firebase Firestore Baza</h3>
                <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Ulangan & Faol
                </span>
              </div>
              <p className="text-xs text-slate-400">Bulutli ma'lumotlar bazasi va real-time sinxronizatsiya</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Direct Firebase Console Alert Note */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-2">
            <div className="flex items-start gap-2.5">
              <Cloud className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-amber-300">
                  Firebase Console'da ko‘rish uchun muhim ko‘rsatma:
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Firebase Console (<a href={FIREBASE_INFO.consoleUrl} target="_blank" rel="noreferrer" className="text-amber-400 underline font-semibold">ushbu havola orqali oching</a>) da ochganingizda, yuqoridagi ma'lumotlar bazasi tanlash ro‘yxatida <strong className="text-white bg-slate-800 px-1.5 py-0.5 rounded font-mono">(default)</strong> emas, balki <strong className="text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded font-mono">{FIREBASE_INFO.databaseId}</strong> bazasi tanlangan bo‘lishi lozim!
                </p>
              </div>
            </div>
          </div>

          {/* Configuration Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-800/60 border border-slate-700/70 p-3.5 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Firebase Project ID</span>
                <button
                  onClick={() => handleCopy(FIREBASE_INFO.projectId, 'project')}
                  className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-700 transition"
                >
                  {copiedField === 'project' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="font-mono text-xs font-bold text-sky-400 truncate">
                {FIREBASE_INFO.projectId}
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/70 p-3.5 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Firestore Database ID</span>
                <button
                  onClick={() => handleCopy(FIREBASE_INFO.databaseId, 'database')}
                  className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-700 transition"
                >
                  {copiedField === 'database' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="font-mono text-xs font-bold text-amber-300 truncate" title={FIREBASE_INFO.databaseId}>
                {FIREBASE_INFO.databaseId}
              </div>
            </div>
          </div>

          {/* Live Collections Counts */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                Bulut bazasidagi jonli ma'lumotlar (Firestore Collections):
              </span>
              <button
                onClick={fetchStatus}
                disabled={loading}
                className="flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 font-medium transition"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                Yangilash
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <div className="bg-slate-800/40 border border-slate-700/60 p-3 rounded-xl text-center">
                <div className="text-base font-extrabold text-white">
                  {status ? status.studentsCount : '...'}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">👨‍🎓 Talabalar</div>
              </div>
              <div className="bg-slate-800/40 border border-slate-700/60 p-3 rounded-xl text-center">
                <div className="text-base font-extrabold text-white">
                  {status ? status.projectsCount : '...'}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">💡 Loyihalar</div>
              </div>
              <div className="bg-slate-800/40 border border-slate-700/60 p-3 rounded-xl text-center">
                <div className="text-base font-extrabold text-white">
                  {status ? status.eventsCount : '...'}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">📅 Tadbirlar</div>
              </div>
              <div className="bg-slate-800/40 border border-slate-700/60 p-3 rounded-xl text-center">
                <div className="text-base font-extrabold text-white">
                  {status ? status.announcementsCount : '...'}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">📢 E'lonlar</div>
              </div>
              <div className="bg-slate-800/40 border border-slate-700/60 p-3 rounded-xl text-center">
                <div className="text-base font-extrabold text-white">
                  {status ? status.certificatesCount : '...'}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">📜 Sertifikatlar</div>
              </div>
            </div>
          </div>

          {/* Test Ping action */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-emerald-400" />
                Firestore yozish testini o‘tkazish
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Bazaga sinov so‘rovi yuborib, yozish huquqini darhol tekshiring
              </p>
              {pingSuccess && (
                <p className="text-[11px] text-emerald-400 font-medium mt-1">
                  ✓ {pingSuccess}
                </p>
              )}
            </div>
            <button
              onClick={handleTestPing}
              disabled={pingLoading}
              className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              {pingLoading ? 'Yuborilmoqda...' : 'Sinov so‘rovi yuborish'}
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-800 bg-slate-900/90 text-xs">
          <a
            href={FIREBASE_INFO.consoleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold transition"
          >
            <span>Firebase Console'da bazani ochish</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition"
          >
            Yopish
          </button>
        </div>

      </div>
    </div>
  );
};
