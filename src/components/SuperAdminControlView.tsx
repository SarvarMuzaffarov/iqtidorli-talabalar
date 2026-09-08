import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Settings, 
  Award, 
  Plus, 
  Edit3, 
  Trash2, 
  Download, 
  Users, 
  CheckCircle2, 
  FileText, 
  Sparkles, 
  Database,
  History,
  Lock,
  Search
} from 'lucide-react';
import { ScoringRule, Student, Project, UniversityEvent, Certificate } from '../types';

interface SuperAdminControlViewProps {
  scoringRules: ScoringRule[];
  onUpdateScoringRules: (rules: ScoringRule[]) => void;
  students: Student[];
  projects: Project[];
  events: UniversityEvent[];
  certificates: Certificate[];
  onExportReport: () => void;
}

export const SuperAdminControlView: React.FC<SuperAdminControlViewProps> = ({
  scoringRules = [],
  onUpdateScoringRules,
  students = [],
  projects = [],
  events = [],
  certificates = [],
  onExportReport,
}) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'roles' | 'audit' | 'reports'>('rules');
  const [newRuleModalOpen, setNewRuleModalOpen] = useState(false);

  // New Rule state
  const [ruleActivity, setRuleActivity] = useState('');
  const [rulePoints, setRulePoints] = useState(50);
  const [ruleCategory, setRuleCategory] = useState<any>('maqola');
  const [ruleDescription, setRuleDescription] = useState('');

  // Audit Mock Logs
  const auditLogs = [
    { id: 'log-1', action: 'QR Sertifikat berildi', user: 'Rektorat Mas’uli', target: 'Aliyev Ali (TKTI-2022-458)', date: 'Bugun, 10:45', status: 'muvaffaqiyatli' },
    { id: 'log-2', action: 'Ball tasdiqlandi (+100 ball)', user: 'Dots. O.X. Ergashev', target: 'Saidova Nilufar (Olimpiada 1-o‘rin)', date: 'Bugun, 09:30', status: 'tasdiqlangan' },
    { id: 'log-3', action: 'Yangi startap loyiha qo‘shildi', user: 'Administrator (Iqtidorlilar bo‘limi)', target: 'BioPlast-Eco loyihasi', date: 'Kecha, 16:20', status: 'saqlangan' },
    { id: 'log-4', action: 'Yangi talaba ro‘yxatga olindi', user: 'Super Admin', target: 'Karimova Madina', date: 'Kecha, 14:15', status: 'yaratilgan' },
    { id: 'log-5', action: 'Baholash mezoni yangilandi', user: 'Super Admin (Rektorat)', target: 'Xalqaro tanlov = 120 ball', date: '2026-09-01', status: 'sozlangan' },
  ];

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleActivity.trim()) return;

    const newRule: ScoringRule = {
      activity: ruleActivity.trim(),
      points: Number(rulePoints) || 50,
      category: ruleCategory,
      description: ruleDescription.trim() || 'Institut mezoniga muvofiq'
    };

    onUpdateScoringRules([...scoringRules, newRule]);
    setNewRuleModalOpen(false);
    setRuleActivity('');
    setRuleDescription('');
  };

  const handleDeleteRule = (index: number) => {
    const updated = [...scoringRules];
    updated.splice(index, 1);
    onUpdateScoringRules(updated);
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Super Admin Top Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 rounded-2xl border border-amber-500/30 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 p-0.5 shadow-lg flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-9 h-9" />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-bold mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Rektorat & Super Administrator Boshqaruv Markazi
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Tizim To‘liq Sozlamalari & Nazorati
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Baholash mezonlari (Scoring Rules), xodimlar rollari, audit jurnali va vazirlik hisobotlari
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onExportReport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition"
            >
              <Download className="w-4 h-4" />
              <span>Vazirlik Hisobotini Yuklab Olish (PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('rules')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'rules'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Baholash Mezonlari (Scoring Rules)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-600 text-white">
            {scoringRules.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'roles'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Foydalanuvchi Rollari</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'audit'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Tizim Audit Logi (Jurnal)</span>
        </button>
      </div>

      {/* TAB A: SCORING RULES */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                Iqtidorli Talabalarni Baholash Mezonlari va Ballari
              </h2>
              <p className="text-xs text-slate-500">
                Talabalar va o‘qituvchilar uchun umumiy reytingni hisoblash qoidalari
              </p>
            </div>

            <button
              onClick={() => setNewRuleModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi mezon qo‘shish</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Faoliyat / Yutuq Turi</th>
                    <th className="p-3.5">Kategoriya</th>
                    <th className="p-3.5">Ball</th>
                    <th className="p-3.5">Tavsif</th>
                    <th className="p-3.5 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {scoringRules.map((rule, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition">
                      <td className="p-3.5 font-bold text-slate-900">
                        {rule.activity}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                          {rule.category}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-black text-amber-600 text-sm">
                          +{rule.points} ball
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-500 max-w-xs truncate">
                        {rule.description}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleDeleteRule(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="O‘chirish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB B: SYSTEM ROLES */}
      {activeTab === 'roles' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-600" />
              Tizim Rollari va Vakolatlari Taqsimoti
            </h2>
            <p className="text-xs text-slate-500">
              TKTI TalentHub platformasidagi 4 ta asosiy foydalanuvchi qatlami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-amber-200 p-5 space-y-3 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Super Admin (Rektorat)</h3>
                  <span className="text-[11px] text-amber-600 font-semibold">To‘liq boshqaruv huquqi</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Institut bo‘yicha to‘liq strategik nazorat, baholash mezonlarini tahrirlash, vazirlik hisobotlarini eksport qilish, barcha talabalar, o‘qituvchilar va sertifikatlar ustidan nazorat.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-sky-200 p-5 space-y-3 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-sky-50 text-sky-600">
                  <Users className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Administrator (Iqtidorlilar bo‘limi)</h3>
                  <span className="text-[11px] text-sky-600 font-semibold">Operatsion boshqaruv</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Talabalar bazasini yuritish, yangi startap loyihalarni ro‘yxatga olish, tadbirlar tashkil etish, QR-kodli sertifikatlar generatsiya qilish va rasmiy e‘lonlar tarqatish.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-purple-200 p-5 space-y-3 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
                  <Users className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">O‘qituvchi (Ilmiy Rahbar)</h3>
                  <span className="text-[11px] text-purple-600 font-semibold">Biriktirilgan talabalar faoliyati</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                O‘ziga biriktirilgan iqtidorli talabalarning ilmiy maqolalari, startap loyihalarini boshqarish, talabalar yutuqlarini tasdiqlash va rasmiy tavsiyanomalar yozish.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-emerald-200 p-5 space-y-3 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <Award className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Talaba (Shaxsiy Portfolio)</h3>
                  <span className="text-[11px] text-emerald-600 font-semibold">Shaxsiy kabinet va yutuqlar</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                O‘zining 4 yillik portfoliosi, erishgan yutuqlari, startap loyihalari, QR-kodli rasmiy sertifikatlari va ro‘yxatdan o‘tgan institut tadbirlarini boshqarish.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB C: AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-slate-700" />
              Tizim Audit Logi (Faoliyat Jurnali)
            </h2>
            <p className="text-xs text-slate-500">
              Barcha ball berish, sertifikat generatsiya qilish va ro‘yxatga olish jarayonlari xavfsizlik nazorati
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="divide-y divide-slate-100 text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/70 transition">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <div>
                      <div className="font-bold text-slate-900">{log.action}</div>
                      <div className="text-[11px] text-slate-500">
                        Obyekt: <strong className="text-slate-700">{log.target}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <span className="text-xs text-slate-600">Mas’ul: <strong className="text-slate-900">{log.user}</strong></span>
                    <span className="text-[11px] text-slate-400">{log.date}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {log.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* NEW RULE MODAL */}
      {newRuleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">Yangi Baholash Mezoni Qo‘shish</h3>
              <button
                onClick={() => setNewRuleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddRule} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Faoliyat Nomi *</label>
                <input
                  type="text"
                  required
                  value={ruleActivity}
                  onChange={(e) => setRuleActivity(e.target.value)}
                  placeholder="masalan: Qishloq xo‘jaligi startap tanlovi g‘olibi"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Beriladigan Ball</label>
                  <input
                    type="number"
                    value={rulePoints}
                    onChange={(e) => setRulePoints(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-amber-600 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kategoriya</label>
                  <select
                    value={ruleCategory}
                    onChange={(e) => setRuleCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:border-amber-500 focus:outline-none"
                  >
                    <option value="maqola">Maqola</option>
                    <option value="tanlov">Tanlov</option>
                    <option value="olimpiada">Olimpiada</option>
                    <option value="grant">Grant</option>
                    <option value="startap">Startap</option>
                    <option value="sertifikat">Sertifikat</option>
                    <option value="xalqaro">Xalqaro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tavsif</label>
                <textarea
                  rows={2}
                  value={ruleDescription}
                  onChange={(e) => setRuleDescription(e.target.value)}
                  placeholder="Mezon bo‘yicha qisqacha tushuntirish..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewRuleModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs"
                >
                  Mezonni saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
