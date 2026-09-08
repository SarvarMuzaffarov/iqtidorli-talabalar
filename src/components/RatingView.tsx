import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Award, 
  Medal, 
  Search, 
  Filter, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2,
  TrendingUp,
  Download,
  Info
} from 'lucide-react';
import { Student, ScoringRule, UserRole } from '../types';
import { SCORING_RULES } from '../mockData';

interface RatingViewProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  currentRole: UserRole;
}

export const RatingView: React.FC<RatingViewProps> = ({
  students = [],
  onSelectStudent,
  currentRole,
}) => {
  const safeStudents = Array.isArray(students) ? students : [];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');

  const faculties = useMemo(() => {
    return Array.from(new Set(safeStudents.map((s) => s.faculty)));
  }, [safeStudents]);

  // Sort students strictly by totalPoints descending
  const sortedStudents = useMemo(() => {
    return [...safeStudents]
      .filter((s) => {
        if (selectedFaculty !== 'all' && s.faculty !== selectedFaculty) return false;
        if (selectedCourse !== 'all' && s.course.toString() !== selectedCourse) return false;
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return s.fullName.toLowerCase().includes(q) || s.faculty.toLowerCase().includes(q);
      })
      .sort((a, b) => b.totalPoints - a.totalPoints);
  }, [safeStudents, selectedFaculty, selectedCourse, searchQuery]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            Reyting Tizimi — “Eng Faol 100 Talaba”
          </h1>
          <p className="text-xs text-slate-500">
            Talabalarning tanlovlar, startaplar, maqolalar va olimpiadalarda to‘plagan umumiy ballari reyestri
          </p>
        </div>

        <button
          onClick={() => alert("Talabalar reytingi Excel formatida yuklab olindi (Simulatsiya)")}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Eksport (Excel/PDF)</span>
        </button>
      </div>

      {/* Prompt Section 9: Ball Berish Qoidalari Jadvali */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs space-y-3 p-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Avtomatlashtirilgan Ball Berish Standarti
            </h3>
            <p className="text-[11px] text-slate-500">
              Har bir faoliyat turi bo‘yicha talaba profiliga qo‘shiladigan reyting ballari
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
            O‘zbekiston Respublikasi OTM mezonlari
          </span>
        </div>

        {/* Scoring Table matching prompt exact table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          {SCORING_RULES.map((rule, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-slate-800 text-[11px] line-clamp-1">{rule.activity}</div>
                <div className="text-[9px] text-slate-400 capitalize">{rule.category}</div>
              </div>
              <span className="font-black text-xs text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md shrink-0 ml-1">
                +{rule.points}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Talaba F.I.Sh. bo‘yicha qidiruv..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            aria-label="Fakultet filtri"
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 font-medium focus:outline-none focus:border-sky-500"
          >
            <option value="all">Barcha fakultetlar</option>
            {faculties.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>

          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            aria-label="Kurs filtri"
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 font-medium focus:outline-none focus:border-sky-500"
          >
            <option value="all">Barcha kurslar</option>
            <option value="1">1-kurs</option>
            <option value="2">2-kurs</option>
            <option value="3">3-kurs</option>
            <option value="4">4-kurs</option>
          </select>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {sortedStudents.slice(0, 3).map((student, idx) => {
          const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉';
          const place = idx === 0 ? '1-O‘rin (Chempion)' : idx === 1 ? '2-O‘rin' : '3-O‘rin';
          const bgCard = idx === 0 
            ? 'bg-gradient-to-b from-amber-50 to-white border-amber-300 shadow-md' 
            : idx === 1 
            ? 'bg-gradient-to-b from-slate-50 to-white border-slate-300' 
            : 'bg-gradient-to-b from-orange-50 to-white border-orange-300';

          return (
            <div
              key={student.id}
              onClick={() => onSelectStudent(student)}
              className={`p-5 rounded-2xl border-2 ${bgCard} text-center space-y-3 hover:shadow-lg transition cursor-pointer relative overflow-hidden group`}
            >
              <span className="text-3xl">{medal}</span>
              <div className="text-xs font-black text-amber-900 uppercase tracking-wider">
                {place}
              </div>

              <div className="relative w-16 h-16 mx-auto">
                <img
                  src={student.avatarUrl}
                  alt={student.fullName}
                  className="w-full h-full rounded-full object-cover border-2 border-white shadow-md group-hover:scale-105 transition"
                />
              </div>

              <div>
                <h4 className="font-black text-sm text-slate-900 group-hover:text-sky-600 transition line-clamp-1">
                  {student.fullName}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                  {student.course}-kurs • {student.faculty}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-3 text-xs">
                <span className="font-extrabold text-amber-900 bg-amber-100 px-3 py-1 rounded-lg">
                  {student.totalPoints} BALL
                </span>
                <span className="font-semibold text-emerald-700">
                  GPA: {student.gpa}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-100 bg-slate-50 font-bold text-xs text-slate-700 flex items-center justify-between">
          <span>Eng Faol Iqtidorli Talabalar Reyting Jadvali ({sortedStudents.length} ta)</span>
          <span className="text-slate-400 font-normal text-[11px]">Ballar bo‘yicha avtomat hisoblangan</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-white text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4 text-center w-12">O‘rin</th>
                <th className="py-3 px-4">Talaba F.I.Sh.</th>
                <th className="py-3 px-4">Fakultet & Kurs</th>
                <th className="py-3 px-4 text-center">Yutuqlar</th>
                <th className="py-3 px-4 text-center">Loyihalar</th>
                <th className="py-3 px-4 text-center">GPA</th>
                <th className="py-3 px-4 text-right">Reyting Balli</th>
                <th className="py-3 px-4 text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedStudents.map((s, idx) => {
                const rank = idx + 1;
                const isTop3 = rank <= 3;
                const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}`;

                return (
                  <tr
                    key={s.id}
                    onClick={() => onSelectStudent(s)}
                    className="hover:bg-slate-50/80 cursor-pointer transition"
                  >
                    <td className="py-3 px-4 text-center font-bold text-slate-700">
                      {isTop3 ? <span className="text-base">{medal}</span> : <span className="text-slate-400">#{rank}</span>}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={s.avatarUrl}
                          alt={s.fullName}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900 hover:text-sky-600">
                            {s.fullName}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {s.studentIdNumber}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800 line-clamp-1">{s.faculty}</div>
                      <div className="text-[10px] text-slate-400">{s.course}-kurs • {s.group}</div>
                    </td>

                    <td className="py-3 px-4 text-center font-semibold text-slate-700">
                      {s.achievements.length} ta
                    </td>

                    <td className="py-3 px-4 text-center font-semibold text-slate-700">
                      {s.projectIds.length} ta
                    </td>

                    <td className="py-3 px-4 text-center font-bold text-emerald-700">
                      {s.gpa}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 font-black text-xs">
                        {s.totalPoints} ball
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStudent(s);
                        }}
                        className="px-2.5 py-1 text-sky-700 font-bold hover:bg-sky-100 rounded-md transition"
                      >
                        Portfolio →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
