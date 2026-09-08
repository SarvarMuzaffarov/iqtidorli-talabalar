import React, { useState } from 'react';
import { X, Calendar, MapPin, Lightbulb, FileText, CheckCircle2, Clock, Users } from 'lucide-react';
import { UniversityEvent, Project, Student } from '../types';

interface RegisterEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: UniversityEvent;
  student: Student;
  studentProjects: Project[];
  onConfirmRegistration: (
    eventId: string,
    studentId: string,
    projectId?: string,
    projectName?: string,
    topicOrNote?: string
  ) => void;
}

export const RegisterEventModal: React.FC<RegisterEventModalProps> = ({
  isOpen,
  onClose,
  event,
  student,
  studentProjects = [],
  onConfirmRegistration,
}) => {
  const [participationType, setParticipationType] = useState<'project' | 'topic' | 'listener'>('project');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    studentProjects.length > 0 ? studentProjects[0].id : ''
  );
  const [customTopic, setCustomTopic] = useState('');
  const [note, setNote] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    let finalProjectId: string | undefined;
    let finalProjectName: string | undefined;
    let finalTopicOrNote: string | undefined;

    if (participationType === 'project') {
      if (!selectedProjectId && studentProjects.length > 0) {
        setErrorMsg('Iltimos, ishtirok etish uchun loyihangizni tanlang');
        return;
      }
      const proj = studentProjects.find((p) => p.id === selectedProjectId);
      finalProjectId = proj?.id;
      finalProjectName = proj?.name || 'Talaba ilmiy startapi';
      finalTopicOrNote = note.trim() || undefined;
    } else if (participationType === 'topic') {
      if (!customTopic.trim()) {
        setErrorMsg('Iltimos, taqdimot yoki ma‘ruza mavzusini kiriting');
        return;
      }
      finalTopicOrNote = `Mavzu: ${customTopic.trim()}${note.trim() ? ` (Izoh: ${note.trim()})` : ''}`;
    } else {
      finalTopicOrNote = note.trim() ? `Tinglovchi / Kuzatuvchi: ${note.trim()}` : 'Tinglovchi / Kuzatuvchi sifatida';
    }

    onConfirmRegistration(event.id, student.id, finalProjectId, finalProjectName, finalTopicOrNote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1a2232] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 sm:p-6 my-6 text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5 mb-4">
          <div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/15 text-sky-700 dark:text-sky-300 mb-1">
              <Calendar className="w-3 h-3" />
              Tanlovga Ro‘yxatdan O‘tish
            </span>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">
              {event.title}
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {event.date} • {event.time}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {event.location}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-3.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Student Info Card */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900 dark:text-white text-xs">{student.fullName}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {student.direction} • {student.group} ({student.studentIdNumber})
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              GPA: {student.gpa.toFixed(2)}
            </span>
          </div>

          {/* Participation Mode Selection */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2">
              Qanday formatda ishtirok etasiz? *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setParticipationType('project')}
                className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                  participationType === 'project'
                    ? 'border-sky-500 bg-sky-500/10 text-sky-800 dark:text-sky-300 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <Lightbulb className="w-4 h-4 mb-1 text-amber-500" />
                <span className="text-xs">Mavjud loyiham bilan</span>
              </button>

              <button
                type="button"
                onClick={() => setParticipationType('topic')}
                className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                  participationType === 'topic'
                    ? 'border-sky-500 bg-sky-500/10 text-sky-800 dark:text-sky-300 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <FileText className="w-4 h-4 mb-1 text-indigo-500" />
                <span className="text-xs">Yangi mavzu / Tezis</span>
              </button>

              <button
                type="button"
                onClick={() => setParticipationType('listener')}
                className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                  participationType === 'listener'
                    ? 'border-sky-500 bg-sky-500/10 text-sky-800 dark:text-sky-300 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <Users className="w-4 h-4 mb-1 text-emerald-500" />
                <span className="text-xs">Tinglovchi sifatida</span>
              </button>
            </div>
          </div>

          {/* Conditional Field: Select Existing Project */}
          {participationType === 'project' && (
            <div className="space-y-1.5 p-3 rounded-xl bg-sky-500/5 border border-sky-500/20">
              <label className="block font-bold text-slate-700 dark:text-slate-300">
                Qaysi loyihangiz bilan ro‘yxatdan o‘tasiz? *
              </label>
              {studentProjects.length > 0 ? (
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:border-sky-500"
                >
                  {studentProjects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.direction} - {p.stage})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-amber-600 dark:text-amber-400 text-xs">
                  Sizda hozircha kiritilgan loyihalar yo‘q. Yangi mavzu kiritish variantini tanlashingiz mumkin.
                </div>
              )}
            </div>
          )}

          {/* Conditional Field: Custom Topic */}
          {participationType === 'topic' && (
            <div className="space-y-1.5 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
              <label className="block font-bold text-slate-700 dark:text-slate-300">
                Taqdimot yoki ilmiy ma‘ruza mavzusi *
              </label>
              <input
                type="text"
                required
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="masalan: Qishloq xo‘jaligi chiqindilaridan bioyoqilg‘i olish texnologiyasi"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:border-sky-500"
              />
            </div>
          )}

          {/* Extra Notes / Details */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Qo‘shimcha izoh yoki annotatsiya (ixtiyoriy)
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Masalan: Taqdimot 10 slaydli, laboratoriya namunalari ham namoyish etiladi..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition text-xs"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold transition flex items-center gap-1.5 shadow-sm text-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Ro‘yxatdan o‘tishni tasdiqlash</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
