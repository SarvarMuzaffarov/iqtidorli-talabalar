import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  FileText, 
  Building, 
  Users, 
  Lightbulb, 
  Award, 
  BookOpen, 
  Sparkles,
  CheckCircle2,
  Printer
} from 'lucide-react';
import { Student, Project, UniversityEvent, Certificate } from '../types';

interface AnalyticsViewProps {
  students: Student[];
  projects: Project[];
  events: UniversityEvent[];
  certificates: Certificate[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  students = [],
  projects = [],
  events = [],
  certificates = [],
}) => {
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const safeStudents = Array.isArray(students) ? students : [];
  const safeProjects = Array.isArray(projects) ? projects : [];
  const safeEvents = Array.isArray(events) ? events : [];
  const safeCertificates = Array.isArray(certificates) ? certificates : [];

  // Key KPI metrics
  const totalStudents = safeStudents.length;
  const totalProjects = safeProjects.length;
  const prototypesCount = safeProjects.filter((p) => p.hasPrototype).length;

  let totalArticles = 0;
  let totalOlympiadWins = 0;
  let totalStartupWins = 0;
  let totalScholarships = 0;

  safeStudents.forEach((s) => {
    (s.achievements || []).forEach((a) => {
      if (a.category === 'maqola') totalArticles++;
      if (a.category === 'olimpiada') totalOlympiadWins++;
      if (a.category === 'tanlov' || a.category === 'startap') totalStartupWins++;
      if (a.category === 'grant') totalScholarships++;
    });
  });

  // Faculty breakdown
  const facultyCounts: Record<string, { count: number; totalPoints: number; projects: number }> = {};
  safeStudents.forEach((s) => {
    if (!facultyCounts[s.faculty]) {
      facultyCounts[s.faculty] = { count: 0, totalPoints: 0, projects: 0 };
    }
    facultyCounts[s.faculty].count += 1;
    facultyCounts[s.faculty].totalPoints += s.totalPoints || 0;
    facultyCounts[s.faculty].projects += (s.projectIds || []).length;
  });

  const facultyList = Object.entries(facultyCounts).sort((a, b) => b[1].totalPoints - a[1].totalPoints);

  const handleDownloadExcel = () => {
    // Generate CSV data for Ministry report
    const headers = "F.I.Sh.,Talaba ID,Fakultet,Kurs,GPA,Reyting Balli,Loyihalar soni,Yutuqlar soni\n";
    const rows = students.map(s => 
      `"${s.fullName}","${s.studentIdNumber}","${s.faculty}",${s.course},${s.gpa},${s.totalPoints},${s.projectIds.length},${s.achievements.length}`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `TKTI_Iqtidorli_Talabalar_Hisoboti_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-sky-600" />
            Hisobotlar va Tahliliy Statistika
          </h1>
          <p className="text-xs text-slate-500">
            Fakultetlar bo‘yicha iqtidorli talabalar faolligi, olimpiadalar, maqolalar va startaplar tahlili
          </p>
        </div>

        {/* Prompt Section 6: "1 klikda Vazirlikka hisobot (PDF / Excel) yuklab olish" */}
        <div className="flex items-center gap-2">
          <button
            id="download-excel-btn"
            onClick={handleDownloadExcel}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Excel Yuklab Olish</span>
          </button>

          <button
            id="open-ministry-pdf-btn"
            onClick={() => setReportModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition shadow-xs"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Vazirlikka Hisobot (PDF)</span>
          </button>
        </div>
      </div>

      {/* Answer to Prompt Section 6 Questions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
          <div className="text-slate-400 text-[11px] font-semibold">Iqtidorli talabalar soni</div>
          <div className="text-2xl font-black text-slate-900">{totalStudents} nafar</div>
          <div className="text-[10px] text-emerald-600 font-medium">Barcha fakultetlar qamrovi</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
          <div className="text-slate-400 text-[11px] font-semibold">Startaplar va loyihalar</div>
          <div className="text-2xl font-black text-sky-600">{totalProjects} ta</div>
          <div className="text-[10px] text-sky-700 font-medium">{prototypesCount} tasi amaliy prototip</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
          <div className="text-slate-400 text-[11px] font-semibold">Ilmiy maqolalar</div>
          <div className="text-2xl font-black text-purple-600">{totalArticles} ta</div>
          <div className="text-[10px] text-purple-700 font-medium">Scopus, OAK va konferensiyalar</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
          <div className="text-slate-400 text-[11px] font-semibold">Olimpiada & Tanlov g‘oliblari</div>
          <div className="text-2xl font-black text-amber-600">{totalOlympiadWins + totalStartupWins} ta</div>
          <div className="text-[10px] text-amber-700 font-medium">Respublika va xalqaro miqyos</div>
        </div>
      </div>

      {/* Faculty Ranking Table ("Qaysi fakultet eng faol?") */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-xs sm:text-sm text-slate-800 flex items-center gap-2">
            <Building className="w-4 h-4 text-sky-600" />
            Fakultetlar Faollik Reytingi
          </h3>
          <span className="text-[11px] text-slate-400">Umumiy ballar yig‘indisi bo‘yicha</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-white text-slate-400 font-bold border-b border-slate-200 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4 w-12 text-center">№</th>
                <th className="py-3 px-4">Fakultet nomi</th>
                <th className="py-3 px-4 text-center">Talabalar soni</th>
                <th className="py-3 px-4 text-center">Loyihalar</th>
                <th className="py-3 px-4 text-right">Jamg‘arilgan Ballar</th>
                <th className="py-3 px-4 text-center">Faollik darajasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {facultyList.map(([facultyName, stats], idx) => {
                const percentage = Math.min(100, Math.round((stats.totalPoints / 600) * 100));

                return (
                  <tr key={facultyName} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 text-center font-bold text-slate-700">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {facultyName}
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-slate-700">
                      {stats.count} nafar
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-slate-700">
                      {stats.projects} ta
                    </td>
                    <td className="py-3 px-4 text-right font-black text-amber-900">
                      {stats.totalPoints} ball
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-32 mx-auto bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-sky-600 h-full rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ministry Official Report Modal Preview */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-sm">
                  Oliy ta'lim, fan va innovatsiyalar vazirligiga hisobot (Namunaviy)
                </span>
              </div>
              <button
                onClick={() => setReportModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs font-serif leading-relaxed text-slate-800">
              <div className="text-center space-y-1 border-b border-slate-200 pb-3">
                <div className="font-bold text-xs uppercase text-slate-600">
                  O‘zbekiston Respublikasi Oliy ta'lim, fan va innovatsiyalar vazirligiga
                </div>
                <h2 className="text-base font-bold text-slate-950">
                  TOSHKENT KIMYO-TEXNOLOGIYA INSTITUTI IQTIDORLI TALABALAR HISOBOTI
                </h2>
                <div className="text-[11px] text-slate-500 italic">
                  Davr: 2025/2026 o‘quv yili (Holat: {new Date().toLocaleDateString('uz-UZ')})
                </div>
              </div>

              <div className="space-y-2">
                <p>
                  Toshkent kimyo-texnologiya institutida jami <strong>{totalStudents} nafar</strong> iqtidorli va salohiyatli talabalar rasmiy reyestrga kiritilgan bo‘lib, ularning erishgan natijalari quyidagicha shakllandi:
                </p>

                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Startap va amaliy loyihalar:</strong> Jami {totalProjects} ta loyiha, shundan {prototypesCount} tasi tayyor amaliy va fizik prototipga ega.</li>
                  <li><strong>Ilmiy maqola va tezislar:</strong> Xalqaro va Respublika miqyosida jami {totalArticles} ta maqola chop etildi.</li>
                  <li><strong>Olimpiada va tanlovlar g‘oliblari:</strong> {totalOlympiadWins + totalStartupWins} nafar talaba respublika va xalqaro sovrinlarni qo‘lga kiritdi.</li>
                  <li><strong>Eng faol fakultet:</strong> “{facultyList[0]?.[0]}” ({facultyList[0]?.[1]?.totalPoints} ball bilan birinchi o‘rinda).</li>
                  <li><strong>Berilgan rasmiy sertifikatlar:</strong> {certificates.length} ta sertifikat QR-kodli yagona bazaga joylashtirildi.</li>
                </ul>

                <p className="pt-2">
                  Ushbu hisobot TKTI “TalentHub” avtomatlashtirilgan boshqaruv platformasi ma‘lumotlar bazasi asosida shakllantirildi.
                </p>
              </div>

              <div className="pt-6 border-t border-slate-200 flex justify-between items-end">
                <div>
                  <div className="font-bold">Iqtidorli talabalar bilan ishlash bo‘limi boshlig‘i</div>
                  <div className="text-[10px] text-slate-500">TKTI Innovatsiyalar va ilmiy ishlar boshqarmasi</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[10px] text-slate-400">Tasdiqlandi: Elektron raqamli imzo bilan</div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg transition flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Hisobotni Chop etish
              </button>
              <button
                onClick={() => setReportModalOpen(false)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
