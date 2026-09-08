import React from 'react';
import { 
  X, 
  Users, 
  Award, 
  CheckCircle2, 
  ExternalLink, 
  DollarSign, 
  Sparkles, 
  Lightbulb, 
  AlertTriangle,
  Play,
  FileText
} from 'lucide-react';
import { Project, Student } from '../types';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  onSelectStudent?: (student: Student) => void;
  students: Student[];
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onSelectStudent,
  students,
}) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Banner with image */}
        <div className="relative h-52 sm:h-60 w-full bg-slate-900 overflow-hidden shrink-0">
          <img
            src={project.imageUrl}
            alt={project.name}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title on banner */}
          <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                {project.direction}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-600 text-white">
                Bosqich: {project.stage.toUpperCase()}
              </span>
              {project.hasPrototype && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Prototip mavjud
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {project.name}
            </h2>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* Problem & Solution Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-rose-50/80 border border-rose-200 space-y-1.5">
              <h4 className="font-bold text-rose-900 uppercase tracking-wide flex items-center gap-1.5 text-xs">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                Aniqlangan Muammo
              </h4>
              <p className="text-rose-950/90 leading-relaxed text-xs">
                {project.problem}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-1.5">
              <h4 className="font-bold text-emerald-900 uppercase tracking-wide flex items-center gap-1.5 text-xs">
                <Lightbulb className="w-3.5 h-3.5 text-emerald-600" />
                Muhandislik / Ilmiy Yechim
              </h4>
              <p className="text-emerald-950/90 leading-relaxed text-xs">
                {project.solution}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
              Loyiha haqida to‘liq ma‘lumot
            </h4>
            <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
              {project.description}
            </p>
          </div>

          {/* Team Members & Scientific Supervisor */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-600" />
              Loyiha Jamoasi va Ilmiy Rahbar
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {project.teamMembers.map((member, idx) => {
                const foundStudent = (students || []).find((s) => s.id === member.id);

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (foundStudent && onSelectStudent) {
                        onClose();
                        onSelectStudent(foundStudent);
                      }
                    }}
                    className={`p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between ${
                      foundStudent ? 'hover:border-sky-300 hover:bg-sky-50/40 cursor-pointer' : ''
                    } transition`}
                  >
                    <div className="flex items-center gap-2.5">
                      {foundStudent ? (
                        <img
                          src={foundStudent.avatarUrl}
                          alt={member.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                          {member.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-slate-900 text-xs">{member.name}</div>
                        <div className="text-[11px] text-slate-500">{member.role}</div>
                      </div>
                    </div>

                    {foundStudent && (
                      <span className="text-[10px] text-sky-600 font-bold">Profil →</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
              <span className="text-slate-600">Ilmiy Maslahatchi / Rahbar:</span>
              <span className="font-bold text-slate-900">{project.supervisor}</span>
            </div>
          </div>

          {/* Funding & Awards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl border border-slate-200 bg-amber-50/50 flex items-center gap-3">
              <Award className="w-6 h-6 text-amber-600 shrink-0" />
              <div>
                <div className="text-[10px] uppercase font-bold text-amber-800">E‘tirof va Yutuqlar</div>
                <div className="font-bold text-slate-900 text-xs">{project.awards}</div>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-emerald-50/50 flex items-center gap-3">
              <DollarSign className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <div className="text-[10px] uppercase font-bold text-emerald-800">Moliyalashtirish / Grant</div>
                <div className="font-bold text-slate-900 text-xs">{project.funding}</div>
              </div>
            </div>
          </div>

        </div>

        {/* Modal footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="text-slate-500">
            Holati: <strong className="text-emerald-600 uppercase">{project.status}</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition"
          >
            Yopish
          </button>
        </div>

      </div>
    </div>
  );
};
