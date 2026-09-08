import React, { useState } from 'react';
import { 
  Award, 
  Plus, 
  Search, 
  CheckCircle2, 
  QrCode, 
  Eye, 
  Printer, 
  Sparkles,
  Calendar,
  Building,
  UserCheck,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Certificate, UniversityEvent, Student, UserRole } from '../types';

interface CertificatesViewProps {
  certificates: Certificate[];
  events: UniversityEvent[];
  students: Student[];
  currentRole: UserRole;
  activeStudentId: string;
  onSelectCertificate: (cert: Certificate) => void;
  onOpenVerifyModal: (certNumber?: string) => void;
  onCreateCertificates: (newCerts: Certificate[]) => void;
  preselectedEventId?: string;
}

export const CertificatesView: React.FC<CertificatesViewProps> = ({
  certificates,
  events,
  students,
  currentRole,
  activeStudentId,
  onSelectCertificate,
  onOpenVerifyModal,
  onCreateCertificates,
  preselectedEventId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showIssueModal, setShowIssueModal] = useState(false);

  // Issue modal state
  const [selectedEventId, setSelectedEventId] = useState<string>(
    preselectedEventId || events[0]?.id || ''
  );
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [reasonTemplate, setReasonTemplate] = useState('Dasturda faol ishtirok etganligi va yuqori ilmiy natijalari uchun');
  const [signatory, setSignatory] = useState('Prof. U. Nigmatov');
  const [signatoryTitle, setSignatoryTitle] = useState('TKTI Ilmiy ishlar va innovatsiyalar bo‘yicha prorektori');

  // Filter certificates
  const filteredCertificates = certificates.filter((c) => {
    // If student role, prioritize student's certificates or show all verified
    if (currentRole === 'student') {
      if (c.studentId !== activeStudentId) return false;
    }

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.certificateNumber.toLowerCase().includes(q) ||
      c.studentName.toLowerCase().includes(q) ||
      c.eventName.toLowerCase().includes(q) ||
      c.studentFaculty.toLowerCase().includes(q)
    );
  });

  const selectedEvent = (events || []).find((e) => e.id === selectedEventId) || events?.[0];

  // Candidates for issuing certificates (registered students of the selected event)
  const candidateStudents = (students || []).filter((s) => 
    selectedEvent?.registeredStudentIds?.includes(s.id) || true // allow choosing any talented student if needed
  );

  const toggleStudentSelection = (id: string) => {
    setSelectedStudentIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllCandidates = () => {
    if (selectedStudentIds.length === candidateStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(candidateStudents.map((s) => s.id));
    }
  };

  const handleGenerateCertificatesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStudentIds.length === 0 || !selectedEvent) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const generated: Certificate[] = [];

    selectedStudentIds.forEach((sId, index) => {
      const student = (students || []).find((s) => s.id === sId);
      if (!student) return;

      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const certNum = `TKTI-2026-${randomSuffix}`;

      generated.push({
        id: `cert-${Date.now()}-${index}`,
        certificateNumber: certNum,
        studentId: student.id,
        studentName: student.fullName,
        studentFaculty: student.faculty,
        eventId: selectedEvent.id,
        eventName: selectedEvent.title,
        issueDate: todayStr,
        qrVerificationUrl: `https://talenthub.tkti.uz/verify/${certNum}`,
        reason: reasonTemplate,
        signatory,
        signatoryTitle,
        status: 'valid',
      });
    });

    onCreateCertificates(generated);
    setShowIssueModal(false);
    setSelectedStudentIds([]);

    // Celebrate with confetti!
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Sertifikatlar va QR Verifikatsiya Tizimi
          </h1>
          <p className="text-xs text-slate-500">
            Tadbirlar qatnashchilariga avtomatik sertifikat berish, bosmaga chiqarish va QR-kodli tekshiruv ({filteredCertificates.length} ta sertifikat)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="open-qr-verify-modal-btn"
            onClick={() => onOpenVerifyModal()}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 text-xs font-bold rounded-lg transition"
          >
            <QrCode className="w-4 h-4 text-emerald-600" />
            <span>QR orqali tekshirish</span>
          </button>

          {currentRole !== 'student' && (
            <button
              id="open-issue-cert-modal-btn"
              onClick={() => {
                if (preselectedEventId) setSelectedEventId(preselectedEventId);
                setShowIssueModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg transition shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Sertifikat yaratish</span>
            </button>
          )}
        </div>
      </div>

      {/* Search and filter bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Sertifikat raqami (IL-2026-...), talaba ismi yoki tadbir bo‘yicha qidiruv..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30"
          />
        </div>
      </div>

      {/* Certificates Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCertificates.map((cert) => (
          <div
            key={cert.id}
            onClick={() => onSelectCertificate(cert)}
            className="bg-white rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition cursor-pointer p-4 flex flex-col justify-between space-y-3 group relative overflow-hidden"
          >
            {/* Top gold ribbon bar */}
            <div className="h-1 bg-gradient-to-r from-amber-400 via-sky-500 to-indigo-600 -mx-4 -mt-4 mb-2" />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                  № {cert.certificateNumber}
                </span>
                <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" /> Haqiqiy
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-amber-800 transition line-clamp-1">
                  {cert.studentName}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  {cert.studentFaculty}
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-amber-50/50 border border-amber-200/60">
                <div className="text-[10px] uppercase font-bold text-amber-800">Tadbir:</div>
                <div className="font-bold text-xs text-slate-900 line-clamp-1">{cert.eventName}</div>
                <div className="text-[10px] text-slate-500 mt-1 line-clamp-1">{cert.reason}</div>
              </div>
            </div>

            {/* Footer with QR action & date */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Sana: <strong className="text-slate-700">{cert.issueDate}</strong></span>
              <span className="text-sky-600 font-bold flex items-center gap-1 group-hover:underline">
                <Eye className="w-3.5 h-3.5" /> Ko‘rish / Chop etish
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Issue Certificate Modal (Prompt Section 5 workflow) */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  Ishtirokchilarga Rasmiy Sertifikat Yaratish
                </h3>
                <p className="text-xs text-slate-500">
                  Tadbirni tanlang, qatnashgan talabalarni belgilang va avtomatik QR-kodli sertifikatlar chiqaring
                </p>
              </div>
              <button
                onClick={() => setShowIssueModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateCertificatesSubmit} className="space-y-4 text-xs">
              {/* Event selection */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tadbirni tanlang *
                </label>
                <select
                  value={selectedEventId}
                  onChange={(e) => {
                    setSelectedEventId(e.target.value);
                    setSelectedStudentIds([]);
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 font-medium"
                >
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title} ({ev.date})
                    </option>
                  ))}
                </select>
              </div>

              {/* Student Checklist selection (Prompt Section 5: ☑ Aliyev Ali, ☑ Karimov Vali...) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-700">
                    Sertifikat beriladigan talabalar ro‘yxati ({selectedStudentIds.length} ta tanlandi) *
                  </label>
                  <button
                    type="button"
                    onClick={handleSelectAllCandidates}
                    className="text-xs font-semibold text-sky-600 hover:text-sky-700"
                  >
                    {selectedStudentIds.length === candidateStudents.length ? 'Barchasini bekor qilish' : 'Barchasini belgilash'}
                  </button>
                </div>

                <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl p-2 space-y-1 bg-slate-50">
                  {candidateStudents.map((stud) => {
                    const isChecked = selectedStudentIds.includes(stud.id);
                    return (
                      <label
                        key={stud.id}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition ${
                          isChecked ? 'bg-amber-50 border border-amber-300' : 'hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleStudentSelection(stud.id)}
                            className="w-4 h-4 text-amber-600 rounded border-slate-300"
                          />
                          <img
                            src={stud.avatarUrl}
                            alt={stud.fullName}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{stud.fullName}</div>
                            <div className="text-[10px] text-slate-500">{stud.faculty}</div>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono text-slate-400">
                          {stud.studentIdNumber}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Reason template */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Sertifikat matni / Berilish asosi
                </label>
                <input
                  type="text"
                  value={reasonTemplate}
                  onChange={(e) => setReasonTemplate(e.target.value)}
                  placeholder="Masalan: dasturida faol ishtirok etganligi va loyihasi uchun"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Signatory */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Imzo chekuvchi mas‘ul
                  </label>
                  <input
                    type="text"
                    value={signatory}
                    onChange={(e) => setSignatory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Lavozimi
                  </label>
                  <input
                    type="text"
                    value={signatoryTitle}
                    onChange={(e) => setSignatoryTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={selectedStudentIds.length === 0}
                  className={`px-5 py-2 text-white rounded-lg font-bold shadow-xs flex items-center gap-1.5 ${
                    selectedStudentIds.length === 0
                      ? 'bg-slate-300 cursor-not-allowed'
                      : 'bg-amber-600 hover:bg-amber-500'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Sertifikat yaratish ({selectedStudentIds.length} ta)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
