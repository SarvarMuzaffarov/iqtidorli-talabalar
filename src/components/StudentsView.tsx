import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Trophy, 
  GraduationCap, 
  Mail, 
  Phone, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  SlidersHorizontal,
  LayoutGrid,
  List
} from 'lucide-react';
import { Student, UserRole } from '../types';

interface StudentsViewProps {
  students: Student[];
  currentRole: UserRole;
  onSelectStudent: (student: Student) => void;
  onOpenAddStudent: () => void;
  initialSearchQuery?: string;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students = [],
  currentRole,
  onSelectStudent,
  onOpenAddStudent,
  initialSearchQuery = '',
}) => {
  const safeStudents = Array.isArray(students) ? students : [];
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedFaculty, setSelectedFaculty] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedCompetency, setSelectedCompetency] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'points' | 'gpa' | 'name'>('points');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Quick preset search buttons as specified in Prompt Section 8:
  // "Sun'iy intellekt bo‘yicha iqtidorli talabalar", "Ingliz tilini yaxshi biladigan 3-kurs talabalar"
  const quickFilters = [
    { label: "Barchasi", query: "", course: "all" },
    { label: "🤖 Sun'iy intellekt bo'yicha", query: "Sun'iy intellekt", course: "all" },
    { label: "🇬🇧 Ingliz tili (IELTS / C1)", query: "IELTS", course: "all" },
    { label: "🌱 Biotexnologiya & Ekologiya", query: "Biotexnologiya", course: "all" },
    { label: "💡 Startap mualliflari", query: "Startap", course: "all" },
    { label: "🥇 Olimpiada g'oliblari", query: "Olimpiada", course: "all" },
  ];

  // Distinct faculties
  const faculties = useMemo(() => {
    const set = new Set(safeStudents.map((s) => s.faculty));
    return Array.from(set);
  }, [safeStudents]);

  // Filtered & sorted student list
  const filteredStudents = useMemo(() => {
    return safeStudents
      .filter((s) => {
        // Faculty filter
        if (selectedFaculty !== 'all' && s.faculty !== selectedFaculty) return false;
        // Course filter
        if (selectedCourse !== 'all' && s.course.toString() !== selectedCourse) return false;

        // Competency filter
        if (selectedCompetency !== 'all') {
          const matchComp = s.competencies.some(c => c.toLowerCase().includes(selectedCompetency.toLowerCase()));
          const matchInter = s.interests.some(i => i.toLowerCase().includes(selectedCompetency.toLowerCase()));
          if (!matchComp && !matchInter) return false;
        }

        // Text search query
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        const inName = s.fullName.toLowerCase().includes(q);
        const inId = s.studentIdNumber.toLowerCase().includes(q);
        const inFaculty = s.faculty.toLowerCase().includes(q);
        const inDirection = s.direction.toLowerCase().includes(q);
        const inSupervisor = s.scientificSupervisor.toLowerCase().includes(q);
        const inInterests = s.interests.some((item) => item.toLowerCase().includes(q));
        const inCompetencies = s.competencies.some((item) => item.toLowerCase().includes(q));
        const inAchievements = s.achievements.some(
          (a) => a.title.toLowerCase().includes(q) || (a.description && a.description.toLowerCase().includes(q))
        );

        return inName || inId || inFaculty || inDirection || inSupervisor || inInterests || inCompetencies || inAchievements;
      })
      .sort((a, b) => {
        if (sortBy === 'points') return b.totalPoints - a.totalPoints;
        if (sortBy === 'gpa') return b.gpa - a.gpa;
        return a.fullName.localeCompare(b.fullName);
      });
  }, [students, searchQuery, selectedFaculty, selectedCourse, selectedCompetency, sortBy]);

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Iqtidorli Talabalar Bazasi
          </h1>
          <p className="text-xs text-slate-500">
            Talabalarning yagona profillari, portfoliosi, GPA va erishgan yutuqlari (jami: {filteredStudents.length} ta)
          </p>
        </div>

        {currentRole !== 'student' && (
          <button
            id="add-student-btn"
            onClick={onOpenAddStudent}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg transition shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi talaba kiritish</span>
          </button>
        )}
      </div>

      {/* Smart Search Bar & Quick Filters (Prompt Section 8) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="student-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Qidiruv: Masalan: 'Sun'iy intellekt bo'yicha talabalar', 'IELTS', 'Muminov'..."
            className="w-full pl-9 pr-24 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              Tozalash
            </button>
          )}
        </div>

        {/* Quick Filter chips */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> Tezkor saralash:
          </span>
          {quickFilters.map((qf, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSearchQuery(qf.query);
                setSelectedCourse(qf.course);
              }}
              className={`text-xs px-2.5 py-1 rounded-full border transition font-medium ${
                searchQuery === qf.query
                  ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {qf.label}
            </button>
          ))}
        </div>

        {/* Dropdown Filters Row */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Faculty filter */}
            <select
              id="filter-faculty"
              aria-label="Fakultet bo'yicha filtrlash"
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-sky-500 text-xs font-medium"
            >
              <option value="all">Barcha fakultetlar</option>
              {faculties.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>

            {/* Course filter */}
            <select
              id="filter-course"
              aria-label="Kurs bo'yicha filtrlash"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-sky-500 text-xs font-medium"
            >
              <option value="all">Barcha kurslar</option>
              <option value="1">1-kurs</option>
              <option value="2">2-kurs</option>
              <option value="3">3-kurs</option>
              <option value="4">4-kurs</option>
            </select>

            {/* Sort by */}
            <select
              id="sort-by"
              aria-label="Saralash tartibi"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-sky-500 text-xs font-medium"
            >
              <option value="points">Reyting balli bo‘yicha</option>
              <option value="gpa">GPA o‘zlashtirish bo‘yicha</option>
              <option value="name">Alifbo bo‘yicha (A-Z)</option>
            </select>
          </div>

          {/* View toggle (Grid / Table) */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              title="Karta ko'rinishi"
              className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-xs text-sky-600' : 'text-slate-500'}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              title="Jadval ko'rinishi"
              className={`p-1.5 rounded-md ${viewMode === 'table' ? 'bg-white shadow-xs text-sky-600' : 'text-slate-500'}`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Results presentation */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">Hech qanday talaba topilmadi</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Qidiruv so‘rovingizni o‘zgartirib ko‘ring yoki filtrlarni tozalang.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedFaculty('all');
              setSelectedCourse('all');
            }}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 rounded-lg transition"
          >
            Filtrlarni tozalash
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Cards View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => {
            return (
              <div
                key={student.id}
                id={`student-card-${student.id}`}
                onClick={() => onSelectStudent(student)}
                className="bg-white rounded-xl border border-slate-200 hover:border-sky-300 hover:shadow-md transition cursor-pointer flex flex-col justify-between group overflow-hidden"
              >
                {/* Header info */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={student.avatarUrl}
                          alt={student.fullName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 shadow-2xs group-hover:border-sky-200 transition"
                        />
                        <span className="absolute -bottom-1 -right-1 px-1 py-0.2 bg-amber-400 text-slate-950 font-black text-[9px] rounded-full border border-white">
                          #{student.course}k
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm group-hover:text-sky-600 transition line-clamp-1">
                          {student.fullName}
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          ID: <span className="font-mono font-medium text-slate-700">{student.studentIdNumber}</span>
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {student.faculty}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="px-2 py-0.5 bg-amber-50 border border-amber-200/80 rounded-lg text-amber-800 font-black text-xs">
                        {student.totalPoints} ball
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1 font-semibold">
                        GPA: <span className="text-emerald-700">{student.gpa}</span>
                      </div>
                    </div>
                  </div>

                  {/* Competencies Tags */}
                  <div className="flex flex-wrap gap-1">
                    {student.competencies.slice(0, 3).map((comp, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700"
                      >
                        {comp}
                      </span>
                    ))}
                    {student.competencies.length > 3 && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-slate-50 text-slate-400">
                        +{student.competencies.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Achievements Summary pills */}
                  <div className="grid grid-cols-3 gap-1.5 pt-1 text-center">
                    <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="font-bold text-xs text-slate-800">{student.achievements.length}</div>
                      <div className="text-[9px] text-slate-400">Yutuqlar</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="font-bold text-xs text-slate-800">{student.projectIds.length}</div>
                      <div className="text-[9px] text-slate-400">Loyihalar</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="font-bold text-xs text-slate-800">{student.certificateIds.length}</div>
                      <div className="text-[9px] text-slate-400">Sertifikatlar</div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-sky-600 group-hover:bg-sky-50/50 transition">
                  <span className="flex items-center gap-1.5 text-slate-600 group-hover:text-sky-700">
                    <Eye className="w-3.5 h-3.5 text-sky-500" />
                    Profil & Raqamli Portfolio
                  </span>
                  <span className="text-[11px] text-slate-400 group-hover:text-sky-600">
                    Batafsil →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-2xs">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">F.I.Sh. va Talaba ID</th>
                <th className="py-3 px-4">Fakultet & Yo‘nalish</th>
                <th className="py-3 px-4">Kurs / Guruh</th>
                <th className="py-3 px-4">GPA</th>
                <th className="py-3 px-4">Ilmiy rahbar</th>
                <th className="py-3 px-4">Reyting Balli</th>
                <th className="py-3 px-4 text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => onSelectStudent(s)}
                  className="hover:bg-sky-50/40 cursor-pointer transition"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={s.avatarUrl}
                        alt={s.fullName}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{s.fullName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{s.studentIdNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-800 line-clamp-1">{s.faculty}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-1">{s.direction}</div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700">
                    {s.course}-kurs • {s.group}
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-600">
                    {s.gpa}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {s.scientificSupervisor}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">
                      {s.totalPoints} ball
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStudent(s);
                      }}
                      className="px-2.5 py-1 text-xs font-semibold text-sky-700 hover:bg-sky-100 rounded-md transition"
                    >
                      Portfolio →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
