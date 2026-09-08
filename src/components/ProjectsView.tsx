import React, { useState } from 'react';
import { 
  Lightbulb, 
  Plus, 
  Search, 
  Users, 
  CheckCircle2, 
  ExternalLink, 
  Award, 
  DollarSign, 
  Cpu, 
  AlertCircle,
  Video,
  FileCheck,
  ChevronRight,
  Filter,
  X
} from 'lucide-react';
import { Project, ProjectStage, Student, UserRole } from '../types';

interface ProjectsViewProps {
  projects: Project[];
  students: Student[];
  currentRole: UserRole;
  onSelectProject: (project: Project) => void;
  onAddProject: (project: Project) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  students,
  currentRole,
  onSelectProject,
  onAddProject,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedDirection, setSelectedDirection] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Project Form State
  const [projectName, setProjectName] = useState('');
  const [direction, setDirection] = useState('Biotexnologiya va kimyo muhandisligi');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [description, setDescription] = useState('');
  const [supervisor, setSupervisor] = useState('');
  const [stage, setStage] = useState<ProjectStage>('prototip');
  const [hasPrototype, setHasPrototype] = useState(true);
  const [funding, setFunding] = useState('');
  const [awards, setAwards] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80');
  const [selectedLeaderId, setSelectedLeaderId] = useState(students[0]?.id || '');

  // Filtered projects
  const filteredProjects = projects.filter((p) => {
    if (selectedStage !== 'all' && p.stage !== selectedStage) return false;
    if (selectedDirection !== 'all' && p.direction !== selectedDirection) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.direction.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.supervisor.toLowerCase().includes(q) ||
      p.teamMembers.some((m) => m.name.toLowerCase().includes(q))
    );
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    const leaderStudent = (students || []).find((s) => s.id === selectedLeaderId) || students?.[0];

    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name: projectName,
      direction,
      problem,
      solution,
      description,
      teamMembers: [
        { 
          id: leaderStudent?.id || `stud-${Date.now()}`, 
          name: leaderStudent?.fullName || 'Iqtidorli talaba', 
          role: 'Loyiha yetakchisi' 
        }
      ],
      supervisor: supervisor || 'Institut ilmiy rahbari',
      stage,
      hasPrototype,
      funding: funding || 'Kafedra homiyligi',
      awards: awards || 'Institut saralash bosqichi',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
      status: 'faol',
      createdAt: new Date().toISOString().split('T')[0]
    };

    onAddProject(newProj);
    setShowAddModal(false);
    // Reset form
    setProjectName('');
    setProblem('');
    setSolution('');
    setDescription('');
    setSupervisor('');
    setFunding('');
    setAwards('');
  };

  const stagesMeta: Record<ProjectStage, { label: string; bg: string; text: string }> = {
    goya: { label: 'G‘oya bosqichida', bg: 'bg-purple-100', text: 'text-purple-800' },
    tadqiqot: { label: 'Ilmiy tadqiqotda', bg: 'bg-blue-100', text: 'text-blue-800' },
    prototip: { label: 'Prototip tayyor', bg: 'bg-emerald-100', text: 'text-emerald-800' },
    sinovda: { label: 'Sinov & Testda', bg: 'bg-amber-100', text: 'text-amber-800' },
    tijoratlashtirish: { label: 'Tijoratlashtirilmoqda', bg: 'bg-rose-100', text: 'text-rose-800' },
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Iqtidorli Talabalar Loyihalar Moduli
          </h1>
          <p className="text-xs text-slate-500">
            Talabalarning ilmiy ishlanmalari, startaplari, muammo-yechim tahlili va prototiplari ({filteredProjects.length} ta)
          </p>
        </div>

        <button
          id="add-new-project-btn"
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg transition shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi loyiha kiritish</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Loyihalar, jamoa a'zolari yoki ilmiy rahbar bo'yicha qidiruv..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              aria-label="Loyiha bosqichi"
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 text-xs font-medium focus:outline-none focus:border-sky-500"
            >
              <option value="all">Barcha bosqichlar</option>
              <option value="prototip">Prototip tayyor</option>
              <option value="sinovda">Sinovda</option>
              <option value="tadqiqot">Tadqiqotda</option>
              <option value="goya">G‘oya bosqichida</option>
              <option value="tijoratlashtirish">Tijoratlashtirish</option>
            </select>
          </div>
        </div>
      </div>

      {/* Project Cards Grid (matching Prompt Section 2: "Aqlli issiqxona", etc.) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project) => {
          const stageBadge = stagesMeta[project.stage] || stagesMeta.prototip;

          return (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-sky-300 hover:shadow-lg transition cursor-pointer flex flex-col justify-between group"
            >
              {/* Image & Stage banner */}
              <div className="h-44 w-full relative overflow-hidden bg-slate-100">
                <img
                  src={project.imageUrl}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                
                <div className="absolute top-3 left-3">
                  <span className={`px-2.5 py-1 rounded-md font-bold text-[10px] ${stageBadge.bg} ${stageBadge.text} shadow-xs`}>
                    {stageBadge.label}
                  </span>
                </div>

                {project.hasPrototype && (
                  <div className="absolute top-3 right-3 bg-emerald-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <CheckCircle2 className="w-3 h-3" /> Prototip mavjud
                  </div>
                )}

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                    {project.direction}
                  </span>
                  <h3 className="font-extrabold text-base leading-tight text-white drop-shadow-xs line-clamp-1">
                    {project.name}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3 text-xs">
                  {/* Problem & Solution Snippet */}
                  <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>
                      <span className="font-bold text-rose-700">Muammo: </span>
                      <span className="text-slate-600 line-clamp-2">{project.problem}</span>
                    </div>
                    <div>
                      <span className="font-bold text-emerald-700">Yechim: </span>
                      <span className="text-slate-600 line-clamp-2">{project.solution}</span>
                    </div>
                  </div>

                  {/* Team Members & Supervisor */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-700 font-semibold">
                        Jamoa: <strong className="text-slate-900">{project.teamMembers.length} talaba</strong>
                      </span>
                    </div>
                    <div className="text-slate-500">
                      Rahbar: <strong className="text-slate-700">{project.supervisor}</strong>
                    </div>
                  </div>

                  {/* Funding & Awards badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <div className="text-amber-700 font-bold flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>{project.awards}</span>
                    </div>
                    <div className="text-slate-500 font-medium">
                      {project.funding}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-sky-600 font-bold group-hover:text-sky-700 transition">
                  <span>Loyiha pasportini to‘liq ko‘rish</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  Yangi Ilmiy / Startap Loyihasini Kiritish
                </h3>
                <p className="text-xs text-slate-500">
                  Talaba yoki ilmiy rahbar tomonidan institut bazasiga kiritiladigan pasport
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Loyiha Nomi *
                </label>
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Masalan: “Aqlli issiqxona (Smart GreenHouse)”"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Yo‘nalishi / Sohasi *
                  </label>
                  <input
                    type="text"
                    required
                    value={direction}
                    onChange={(e) => setDirection(e.target.value)}
                    placeholder="Masalan: Biotexnologiya, IoT, Kimyo"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Loyiha Rahbari (Talaba) *
                  </label>
                  <select
                    value={selectedLeaderId}
                    onChange={(e) => setSelectedLeaderId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.fullName} ({s.course}-kurs, {s.faculty.split(' ')[0]})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Ilmiy Maslahatchi / Rahbar (O‘qituvchi/Professor)
                  </label>
                  <input
                    type="text"
                    value={supervisor}
                    onChange={(e) => setSupervisor(e.target.value)}
                    placeholder="Masalan: Prof. X. Muminov"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Loyiha Bosqichi
                  </label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value as ProjectStage)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                  >
                    <option value="goya">G‘oya bosqichida</option>
                    <option value="tadqiqot">Ilmiy tadqiqotda</option>
                    <option value="prototip">Prototip tayyor</option>
                    <option value="sinovda">Sinov va aprobatsiyada</option>
                    <option value="tijoratlashtirish">Tijoratlashtirish</option>
                  </select>
                </div>
              </div>

              {/* Problem & Solution */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mavjud Muammo *
                </label>
                <textarea
                  rows={2}
                  required
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="Loyiha qaysi amaliy muammo yoki yetishmovchilikni hal qiladi?"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Taklif etilayotgan Yechim *
                </label>
                <textarea
                  rows={2}
                  required
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  placeholder="Muammoni qanday texnologiya yoki usul bilan bartaraf etasiz?"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Moliyalashtirish / Grant
                  </label>
                  <input
                    type="text"
                    value={funding}
                    onChange={(e) => setFunding(e.target.value)}
                    placeholder="Masalan: 50 mln so‘m (Agentlik granti)"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Yutuqlari / Tanlov natijalari
                  </label>
                  <input
                    type="text"
                    value={awards}
                    onChange={(e) => setAwards(e.target.value)}
                    placeholder="Masalan: Startup-2026 tanlovida 1-o‘rin"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="has-prototype-check"
                  checked={hasPrototype}
                  onChange={(e) => setHasPrototype(e.target.checked)}
                  className="w-4 h-4 text-sky-600 rounded"
                />
                <label htmlFor="has-prototype-check" className="font-semibold text-slate-700">
                  Ushbu loyihaning amaldagi fizik yoki dasturiy prototipi mavjud
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-bold shadow-xs"
                >
                  Loyihani Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
