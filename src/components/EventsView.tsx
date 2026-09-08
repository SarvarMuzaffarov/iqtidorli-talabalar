import React, { useState } from 'react';
import { 
  CalendarDays, 
  MapPin, 
  Clock, 
  Users, 
  Plus, 
  CheckCircle2, 
  Award, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  X
} from 'lucide-react';
import { UniversityEvent, Student, UserRole } from '../types';

interface EventsViewProps {
  events: UniversityEvent[];
  students: Student[];
  currentRole: UserRole;
  activeStudentId: string;
  onRegisterForEvent: (eventId: string, studentId: string) => void;
  onUnregisterForEvent: (eventId: string, studentId: string) => void;
  onCreateEvent: (event: UniversityEvent) => void;
  onNavigateToCertificatesForEvent: (event: UniversityEvent) => void;
}

export const EventsView: React.FC<EventsViewProps> = ({
  events,
  students,
  currentRole,
  activeStudentId,
  onRegisterForEvent,
  onUnregisterForEvent,
  onCreateEvent,
  onNavigateToCertificatesForEvent,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEventForDetails, setSelectedEventForDetails] = useState<UniversityEvent | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-09-25');
  const [time, setTime] = useState('10:00 - 16:00');
  const [location, setLocation] = useState('TKTI Bosh binosi, Faollar zali');
  const [description, setDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('Barcha iqtidorli talabalar va magistrlar');
  const [registrationDeadline, setRegistrationDeadline] = useState('2026-09-22');
  const [capacityLimit, setCapacityLimit] = useState(100);
  const [responsiblePerson, setResponsiblePerson] = useState('Iqtidorli talabalar bilan ishlash bo‘limi');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newEv: UniversityEvent = {
      id: `event-${Date.now()}`,
      title,
      date,
      time,
      location,
      description,
      targetAudience,
      registrationDeadline,
      capacityLimit: Number(capacityLimit) || 50,
      registeredStudentIds: [],
      responsiblePerson,
      status: 'active',
      bannerImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'
    };

    onCreateEvent(newEv);
    setShowCreateModal(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Institut Tadbirlari va Tanlovlar
          </h1>
          <p className="text-xs text-slate-500">
            Talabalarni ro‘yxatga olish, ishtirokchilar reyestri va sertifikat berish tizimi ({events.length} ta tadbir)
          </p>
        </div>

        {currentRole !== 'student' && (
          <button
            id="create-event-btn"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg transition shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi tadbir yaratish</span>
          </button>
        )}
      </div>

      {/* Events List Cards */}
      <div className="space-y-4">
        {events.map((event) => {
          const isRegistered = event.registeredStudentIds.includes(activeStudentId);
          const isFull = event.registeredStudentIds.length >= event.capacityLimit;

          return (
            <div
              key={event.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:border-slate-300 transition flex flex-col md:flex-row"
            >
              {/* Event banner thumbnail */}
              <div className="md:w-64 h-44 md:h-auto shrink-0 relative bg-slate-900 overflow-hidden">
                <img
                  src={event.bannerImage || 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80'}
                  alt={event.title}
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    event.status === 'completed'
                      ? 'bg-slate-700 text-white'
                      : event.status === 'active'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-sky-600 text-white'
                  }`}>
                    {event.status === 'completed' ? 'Yakunlangan' : event.status === 'active' ? 'Ro‘yxatdan o‘tish ochiq' : 'Tez kunda'}
                  </span>
                </div>
              </div>

              {/* Event Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
                      {event.title}
                    </h3>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      {event.registeredStudentIds.length} / {event.capacityLimit} ishtirokchi
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                      <span>Sana: <strong className="text-slate-700">{event.date}</strong> ({event.time})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>Joy: <strong className="text-slate-700">{event.location}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Ro‘yxat muddati: <strong className="text-slate-700">{event.registrationDeadline}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>Kimlar uchun: <strong className="text-slate-700">{event.targetAudience}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-400">
                    Mas‘ul: <strong className="text-slate-600">{event.responsiblePerson}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View attendees list button */}
                    <button
                      onClick={() => setSelectedEventForDetails(event)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                    >
                      Ishtirokchilar ro‘yxati ({event.registeredStudentIds.length})
                    </button>

                    {/* Admin: Create Certificates for Attendees button */}
                    {currentRole !== 'student' && (
                      <button
                        onClick={() => onNavigateToCertificatesForEvent(event)}
                        className="px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 border border-amber-300 text-xs font-bold rounded-lg transition flex items-center gap-1.5"
                      >
                        <Award className="w-3.5 h-3.5 text-amber-600" />
                        Sertifikat berish
                      </button>
                    )}

                    {/* Student: Register / Cancel registration button */}
                    {currentRole === 'student' && (
                      isRegistered ? (
                        <button
                          onClick={() => onUnregisterForEvent(event.id, activeStudentId)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-rose-600 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 group"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="group-hover:hidden">Ro‘yxatdan o‘tgansiz ✓</span>
                          <span className="hidden group-hover:inline">Ro‘yxatni bekor qilish</span>
                        </button>
                      ) : (
                        <button
                          disabled={isFull}
                          onClick={() => onRegisterForEvent(event.id, activeStudentId)}
                          className={`px-4 py-1.5 text-xs font-bold rounded-lg transition shadow-xs ${
                            isFull
                              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                              : 'bg-sky-600 hover:bg-sky-500 text-white'
                          }`}
                        >
                          {isFull ? 'Limit to‘lgan' : 'Ro‘yxatdan o‘tish'}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Attendees list modal */}
      {selectedEventForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {selectedEventForDetails.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Ro‘yxatdan o‘tgan talabalar soni: {selectedEventForDetails.registeredStudentIds.length} ta
                </p>
              </div>
              <button
                onClick={() => setSelectedEventForDetails(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2 text-xs divide-y divide-slate-100">
              {selectedEventForDetails.registeredStudentIds.length === 0 ? (
                <div className="py-6 text-center text-slate-400">
                  Hozircha hech kim ro‘yxatdan o‘tmagan.
                </div>
              ) : (
                selectedEventForDetails.registeredStudentIds.map((sId, index) => {
                  const student = (students || []).find((s) => s.id === sId);
                  if (!student) return null;

                  return (
                    <div key={sId} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-slate-400 w-4">{index + 1}.</span>
                        <img
                          src={student.avatarUrl}
                          alt={student.fullName}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{student.fullName}</div>
                          <div className="text-[10px] text-slate-500">{student.faculty}</div>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                        Ro‘yxatda
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
              {currentRole !== 'student' && (
                <button
                  onClick={() => {
                    const ev = selectedEventForDetails;
                    setSelectedEventForDetails(null);
                    onNavigateToCertificatesForEvent(ev);
                  }}
                  className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg hover:bg-amber-400 transition"
                >
                  Ushbu ishtirokchilarga sertifikat yaratish →
                </button>
              )}
              <button
                onClick={() => setSelectedEventForDetails(null)}
                className="ml-auto px-3 py-1.5 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-sky-600" />
                  Yangi Institut Tadbiri / Tanlov Yaratish
                </h3>
                <p className="text-xs text-slate-500">
                  Talabalar uchun ro‘yxatga olish, limit va sertifikat berish tadbiri
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tadbir Nomi *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masalan: “Startaplar kuni — 2026” yoki “IdeaLab — 2026”"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    O‘tkazilish Sanasi *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Vaqti
                  </label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="Masalan: 10:00 - 16:30"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    O‘tkazilish Joyi *
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Masalan: Faollar zali, Texnopark"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Qatnashuvchilar Limiti (soni)
                  </label>
                  <input
                    type="number"
                    value={capacityLimit}
                    onChange={(e) => setCapacityLimit(Number(e.target.value))}
                    min={10}
                    max={1000}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tavsif va Maqsad
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tadbir kimlar uchun, qanday natijalar kutilmoqda..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kimlar uchun (Maqsadli auditoriya)
                  </label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="1-4 kurs talabalari, startapchilar"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Ro‘yxatdan o‘tish muddati
                  </label>
                  <input
                    type="date"
                    value={registrationDeadline}
                    onChange={(e) => setRegistrationDeadline(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mas‘ul bo‘lim / Shaxs
                </label>
                <input
                  type="text"
                  value={responsiblePerson}
                  onChange={(e) => setResponsiblePerson(e.target.value)}
                  placeholder="Masalan: Iqtidorli talabalar bilan ishlash bo‘limi"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                />
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
                  Tadbirni E‘lon Qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
