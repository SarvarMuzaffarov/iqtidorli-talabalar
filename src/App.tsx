import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { NavigationTabs, ActiveTab } from './components/NavigationTabs';
import { DashboardView } from './components/DashboardView';
import { StudentsView } from './components/StudentsView';
import { ProjectsView } from './components/ProjectsView';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { EventsView } from './components/EventsView';
import { AnnouncementsView } from './components/AnnouncementsView';
import { CertificatesView } from './components/CertificatesView';
import { CertificateModal } from './components/CertificateModal';
import { VerifyCertificateModal } from './components/VerifyCertificateModal';
import { RatingView } from './components/RatingView';
import { AnalyticsView } from './components/AnalyticsView';
import { StudentProfileModal } from './components/StudentProfileModal';
import { AddStudentModal } from './components/AddStudentModal';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { useEyeCare } from './context/EyeCareContext';

// Dedicated Role-Specific Views
import { StudentPortalView } from './components/StudentPortalView';
import { TeacherView } from './components/TeacherView';
import { SuperAdminControlView } from './components/SuperAdminControlView';

import { 
  Student, 
  Project, 
  UniversityEvent, 
  Announcement, 
  Certificate, 
  UserRole, 
  Achievement,
  ScoringRule
} from './types';
import { 
  loadFromStorage, 
  saveToStorage, 
  STORAGE_KEYS 
} from './utils/storage';
import { 
  INITIAL_STUDENTS, 
  INITIAL_PROJECTS, 
  INITIAL_EVENTS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_CERTIFICATES,
  SCORING_RULES
} from './mockData';
import { 
  syncInitialDataToFirestore,
  saveStudentToFirestore,
  saveProjectToFirestore,
  saveEventToFirestore,
  saveAnnouncementToFirestore,
  saveCertificateToFirestore
} from './lib/firestoreService';

export default function App() {
  const { mode } = useEyeCare();

  // Application Data States (persisted via localStorage)
  const [students, setStudents] = useState<Student[]>(() => 
    loadFromStorage<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS)
  );
  const [projects, setProjects] = useState<Project[]>(() => 
    loadFromStorage<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS)
  );
  const [events, setEvents] = useState<UniversityEvent[]>(() => 
    loadFromStorage<UniversityEvent[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS)
  );
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => 
    loadFromStorage<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS)
  );
  const [certificates, setCertificates] = useState<Certificate[]>(() => 
    loadFromStorage<Certificate[]>(STORAGE_KEYS.CERTIFICATES, INITIAL_CERTIFICATES)
  );
  const [scoringRules, setScoringRules] = useState<ScoringRule[]>(() => 
    loadFromStorage<ScoringRule[]>(STORAGE_KEYS.RULES, SCORING_RULES)
  );

  // Authentication State: defaults to false so initial entry shows Landing Page
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => 
    loadFromStorage<boolean>(STORAGE_KEYS.IS_AUTHENTICATED, false)
  );
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Active Role and Navigation Tab
  const [currentRole, setCurrentRole] = useState<UserRole>(() => 
    loadFromStorage<UserRole>(STORAGE_KEYS.ACTIVE_ROLE, 'super_admin')
  );
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    const savedRole = loadFromStorage<UserRole>(STORAGE_KEYS.ACTIVE_ROLE, 'super_admin');
    if (savedRole === 'student') return 'student_portal';
    if (savedRole === 'faculty' || savedRole === 'teacher') return 'teacher_portal';
    return 'dashboard';
  });

  // Currently authenticated/active student ID (for student view mode)
  const [activeStudentId, setActiveStudentId] = useState<string>(() =>
    loadFromStorage<string>(STORAGE_KEYS.ACTIVE_STUDENT_ID, students[0]?.id || 'stud-1')
  );

  // Modal / Selection States
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [verifyInitialNumber, setVerifyInitialNumber] = useState<string>('');
  const [addStudentModalOpen, setAddStudentModalOpen] = useState(false);
  const [preselectedEventForCert, setPreselectedEventForCert] = useState<string>('');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Initial Firestore sync
  useEffect(() => {
    let isMounted = true;
    syncInitialDataToFirestore(
      INITIAL_STUDENTS,
      INITIAL_PROJECTS,
      INITIAL_EVENTS,
      INITIAL_ANNOUNCEMENTS,
      INITIAL_CERTIFICATES
    ).then((res) => {
      if (res && isMounted) {
        if (res.students && res.students.length > 0) setStudents(res.students);
        if (res.projects && res.projects.length > 0) setProjects(res.projects);
        if (res.events && res.events.length > 0) setEvents(res.events);
        if (res.announcements && res.announcements.length > 0) setAnnouncements(res.announcements);
        if (res.certificates && res.certificates.length > 0) setCertificates(res.certificates);
      }
    });
    return () => { isMounted = false; };
  }, []);

  // Persist state changes (both localStorage cache and Firestore cloud persistence)
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.STUDENTS, students);
  }, [students]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PROJECTS, projects);
  }, [projects]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.EVENTS, events);
  }, [events]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ANNOUNCEMENTS, announcements);
  }, [announcements]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CERTIFICATES, certificates);
  }, [certificates]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.RULES, scoringRules);
  }, [scoringRules]);

  // Handler: Add Achievement to Student
  const handleAddAchievement = (studentId: string, achievement: Achievement) => {
    setStudents((prev) => 
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const updatedAchievements = [achievement, ...s.achievements];
        const newTotalPoints = s.totalPoints + (achievement.points || 0);
        const updatedStudent = {
          ...s,
          achievements: updatedAchievements,
          totalPoints: newTotalPoints
        };
        if (selectedStudent?.id === studentId) {
          setSelectedStudent(updatedStudent);
        }
        saveStudentToFirestore(updatedStudent);
        return updatedStudent;
      })
    );
  };

  // Handler: Student submits new achievement for verification
  const handleSubmitAchievementFromStudent = (studentId: string, achievement: Achievement) => {
    setStudents((prev) => 
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const updated = {
          ...s,
          achievements: [achievement, ...(s.achievements || [])],
        };
        saveStudentToFirestore(updated);
        return updated;
      })
    );
  };

  // Handler: Teacher verifies or rejects student achievement
  const handleVerifyAchievement = (studentId: string, achievementId: string, approved: boolean) => {
    setStudents((prev) => 
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const updatedAchievements = (s.achievements || []).map((ach) => {
          if (ach.id !== achievementId) return ach;
          return {
            ...ach,
            verified: approved,
            verifiedBy: approved ? (s.scientificSupervisor || 'Ilmiy rahbar') : undefined
          };
        });

        // Recalculate total points for verified achievements
        const verifiedPoints = updatedAchievements.reduce((sum, a) => sum + (a.verified ? a.points : 0), 0);
        const projectPoints = (s.projectIds?.length || 0) * 40;
        const newTotalPoints = verifiedPoints + projectPoints;

        const updatedStudent = {
          ...s,
          achievements: updatedAchievements,
          totalPoints: newTotalPoints
        };
        saveStudentToFirestore(updatedStudent);
        return updatedStudent;
      })
    );
  };

  // Handler: Teacher updates recommendation
  const handleUpdateRecommendation = (studentId: string, recommendation: string) => {
    setStudents((prev) => 
      prev.map((s) => {
        if (s.id === studentId) {
          const updated = { ...s, facultyRecommendation: recommendation };
          saveStudentToFirestore(updated);
          return updated;
        }
        return s;
      })
    );
  };

  // Handler: Add New Project
  const handleAddProject = (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);
    saveProjectToFirestore(newProject);
    const leaderId = newProject.teamMembers[0]?.id;
    if (leaderId) {
      setStudents((prev) => 
        prev.map((s) => {
          if (s.id === leaderId && !s.projectIds.includes(newProject.id)) {
            const updated = { ...s, projectIds: [...s.projectIds, newProject.id], totalPoints: s.totalPoints + 40 };
            saveStudentToFirestore(updated);
            return updated;
          }
          return s;
        })
      );
    }
  };

  // Handler: Add New Student
  const handleAddStudent = (newStudent: Student) => {
    setStudents((prev) => [newStudent, ...prev]);
    saveStudentToFirestore(newStudent);
  };

  // Handler: Create University Event
  const handleCreateEvent = (newEvent: UniversityEvent) => {
    setEvents((prev) => [newEvent, ...prev]);
    saveEventToFirestore(newEvent);
  };

  // Handler: Register for Event
  const handleRegisterForEvent = (eventId: string, studentId: string) => {
    setEvents((prev) => 
      prev.map((ev) => {
        if (ev.id !== eventId) return ev;
        if (ev.registeredStudentIds.includes(studentId)) return ev;
        const updated = {
          ...ev,
          registeredStudentIds: [...ev.registeredStudentIds, studentId]
        };
        saveEventToFirestore(updated);
        return updated;
      })
    );
  };

  // Handler: Unregister from Event
  const handleUnregisterForEvent = (eventId: string, studentId: string) => {
    setEvents((prev) => 
      prev.map((ev) => {
        if (ev.id !== eventId) return ev;
        const updated = {
          ...ev,
          registeredStudentIds: ev.registeredStudentIds.filter((id) => id !== studentId)
        };
        saveEventToFirestore(updated);
        return updated;
      })
    );
  };

  // Handler: Create Announcement
  const handleCreateAnnouncement = (newAnnouncement: Announcement) => {
    setAnnouncements((prev) => [newAnnouncement, ...prev]);
    saveAnnouncementToFirestore(newAnnouncement);
  };

  // Handler: Create Certificates Batch
  const handleCreateCertificates = (newCertificates: Certificate[]) => {
    setCertificates((prev) => [...newCertificates, ...prev]);
    newCertificates.forEach((cert) => {
      saveCertificateToFirestore(cert);
      setStudents((prev) => 
        prev.map((s) => {
          if (s.id === cert.studentId && !s.certificateIds.includes(cert.id)) {
            const updated = {
              ...s,
              certificateIds: [...s.certificateIds, cert.id],
              totalPoints: s.totalPoints + 15
            };
            saveStudentToFirestore(updated);
            return updated;
          }
          return s;
        })
      );
    });
  };

  // Switch to certificate issuance preselected for an event
  const handleNavigateToCertificatesForEvent = (event: UniversityEvent) => {
    setPreselectedEventForCert(event.id);
    setActiveTab('certificates');
  };

  // Open Verify modal with prefilled number
  const handleOpenVerifyWithNumber = (certNumber?: string) => {
    setVerifyInitialNumber(certNumber || '');
    setVerifyModalOpen(true);
  };

  // Handler: Role change with automatic view routing
  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    saveToStorage(STORAGE_KEYS.ACTIVE_ROLE, role);
    if (role === 'student') {
      setActiveTab('student_portal');
    } else if (role === 'faculty' || role === 'teacher') {
      setActiveTab('teacher_portal');
    } else if (role === 'super_admin') {
      setActiveTab('dashboard');
    } else {
      setActiveTab('dashboard');
    }
  };

  // Authentication Handlers
  const handleLogin = (role: UserRole, studentId?: string) => {
    setCurrentRole(role);
    saveToStorage(STORAGE_KEYS.ACTIVE_ROLE, role);
    if (studentId) {
      setActiveStudentId(studentId);
      saveToStorage(STORAGE_KEYS.ACTIVE_STUDENT_ID, studentId);
    }
    setIsAuthenticated(true);
    saveToStorage(STORAGE_KEYS.IS_AUTHENTICATED, true);
    setAuthModalOpen(false);

    if (role === 'student') {
      setActiveTab('student_portal');
    } else if (role === 'faculty' || role === 'teacher') {
      setActiveTab('teacher_portal');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleRegisterStudent = (newStudent: Student) => {
    setStudents((prev) => [newStudent, ...prev]);
    setActiveStudentId(newStudent.id);
    setCurrentRole('student');
    setIsAuthenticated(true);
    saveToStorage(STORAGE_KEYS.IS_AUTHENTICATED, true);
    saveToStorage(STORAGE_KEYS.ACTIVE_ROLE, 'student');
    saveToStorage(STORAGE_KEYS.ACTIVE_STUDENT_ID, newStudent.id);
    setActiveTab('student_portal');
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    saveToStorage(STORAGE_KEYS.IS_AUTHENTICATED, false);
  };

  // Export official report
  const handleExportReport = () => {
    window.print();
  };

  // Find active student for Student Portal
  const currentActiveStudent = students.find((s) => s.id === activeStudentId) || students[0];
  const sortedStudents = [...students].sort((a, b) => b.totalPoints - a.totalPoints);
  const activeStudentRank = sortedStudents.findIndex((s) => s.id === currentActiveStudent?.id) + 1;

  // Calculate pending approvals count
  const pendingApprovalsCount = students.reduce(
    (sum, s) => sum + (s.achievements || []).filter((a) => !a.verified).length,
    0
  );

  // If user is not yet authenticated, show the initial TKTI Landing Page with "Kirish" and "Ro'yxatdan o'tish"
  if (!isAuthenticated) {
    const unauthThemeClass = mode === 'warm-sepia'
      ? 'bg-[#faf6ef] text-[#2d2621]'
      : mode === 'calm-dark'
      ? 'bg-[#121824] text-slate-100'
      : 'bg-[#f8fafc] text-slate-800';

    return (
      <div className={`min-h-screen ${unauthThemeClass} font-sans antialiased transition-colors duration-150`}>
        <LandingPage
          onOpenLogin={() => {
            setAuthModalMode('login');
            setAuthModalOpen(true);
          }}
          onOpenRegister={() => {
            setAuthModalMode('register');
            setAuthModalOpen(true);
          }}
          onOpenVerify={() => handleOpenVerifyWithNumber()}
          students={students}
          projects={projects}
          events={events}
          certificates={certificates}
        />

        {/* Auth Modal (Tizimga kirish yoki Ro'yxatdan o'tish) */}
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authModalMode}
          students={students}
          onLogin={handleLogin}
          onRegisterStudent={handleRegisterStudent}
        />

        {/* Public Certificate Verification Modal */}
        {verifyModalOpen && (
          <VerifyCertificateModal
            certificates={certificates}
            initialCertNumber={verifyInitialNumber}
            onClose={() => setVerifyModalOpen(false)}
            onViewCertificateDetails={(cert) => {
              setVerifyModalOpen(false);
              setSelectedCertificate(cert);
            }}
          />
        )}

        {/* Certificate Display if verified and clicked */}
        {selectedCertificate && (
          <CertificateModal
            certificate={selectedCertificate}
            onClose={() => setSelectedCertificate(null)}
            onOpenVerifyWithNumber={(num) => {
              setSelectedCertificate(null);
              handleOpenVerifyWithNumber(num);
            }}
          />
        )}
      </div>
    );
  }

  const authThemeClass = mode === 'warm-sepia'
    ? 'bg-[#faf6ef] text-[#2d2621]'
    : mode === 'calm-dark'
    ? 'bg-[#121824] text-slate-100'
    : 'bg-[#f8fafc] text-slate-800';

  return (
    <div className={`min-h-screen ${authThemeClass} flex flex-col font-sans antialiased selection:bg-sky-500 selection:text-white transition-colors duration-150`}>
      
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        students={students}
        activeStudentId={activeStudentId}
        onActiveStudentChange={(id) => {
          setActiveStudentId(id);
          saveToStorage(STORAGE_KEYS.ACTIVE_STUDENT_ID, id);
        }}
        onOpenVerifyModal={() => handleOpenVerifyWithNumber()}
        onOpenAddStudent={() => setAddStudentModalOpen(true)}
        onLogout={handleLogout}
        unreadAnnouncementsCount={announcements.filter((a) => a.urgent).length}
        searchQuery={globalSearchQuery}
        onSearchChange={(q) => {
          setGlobalSearchQuery(q);
          if (q.trim() && activeTab !== 'students') {
            setActiveTab('students');
          }
        }}
      />

      {/* Navigation Tabs - Role Filtered */}
      <NavigationTabs
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setPreselectedEventForCert('');
        }}
        currentRole={currentRole}
        counts={{
          students: students.length,
          projects: projects.length,
          events: events.length,
          certificates: certificates.length,
          announcements: announcements.length,
          pendingApprovals: pendingApprovalsCount
        }}
      />

      {/* Main View Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* VIEW 1: TALABA MAXSUS SHAXSIY KABINETI & PORTFOLIOSI */}
        {activeTab === 'student_portal' && currentActiveStudent && (
          <StudentPortalView
            student={currentActiveStudent}
            allProjects={projects}
            allEvents={events}
            allCertificates={certificates}
            onSelectProject={(project) => setSelectedProject(project)}
            onSelectCertificate={(cert) => setSelectedCertificate(cert)}
            onOpenVerifyModal={(num) => handleOpenVerifyWithNumber(num)}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onAddProject={handleAddProject}
            onSubmitAchievement={handleSubmitAchievementFromStudent}
            rank={activeStudentRank}
          />
        )}

        {/* VIEW 2: O'QITUVCHI / ILMIY RAHBAR BIRIKTIRILGAN TALABALAR KABINETI */}
        {(activeTab === 'teacher_portal' || activeTab === 'faculty') && (
          <TeacherView
            students={students}
            projects={projects}
            onSelectStudent={(student) => setSelectedStudent(student)}
            onSelectProject={(project) => setSelectedProject(project)}
            onVerifyAchievement={handleVerifyAchievement}
            onUpdateRecommendation={handleUpdateRecommendation}
            onAddProject={handleAddProject}
          />
        )}

        {/* VIEW 3: SUPER ADMIN TO'LIQ BOSHQARUV VA TIZIM SOZLAMALARI */}
        {activeTab === 'superadmin_control' && (
          <SuperAdminControlView
            scoringRules={scoringRules}
            onUpdateScoringRules={(rules) => setScoringRules(rules)}
            students={students}
            projects={projects}
            events={events}
            certificates={certificates}
            onExportReport={handleExportReport}
          />
        )}

        {/* VIEW 4: GENERAL DASHBOARD (ADMIN & SUPER ADMIN) */}
        {activeTab === 'dashboard' && (
          <DashboardView
            students={students}
            projects={projects}
            events={events}
            certificates={certificates}
            announcements={announcements}
            currentRole={currentRole}
            onSelectStudent={(student) => setSelectedStudent(student)}
            onSelectProject={(project) => setSelectedProject(project)}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenAddStudent={() => setAddStudentModalOpen(true)}
            onOpenCreateEvent={() => setActiveTab('events')}
            onOpenIssueCertificate={() => setActiveTab('certificates')}
            onOpenCreateAnnouncement={() => setActiveTab('announcements')}
            onOpenAddProject={() => setActiveTab('projects')}
            onOpenVerifyModal={() => handleOpenVerifyWithNumber()}
          />
        )}

        {/* VIEW 5: STUDENTS DIRECTORY */}
        {activeTab === 'students' && (
          <StudentsView
            students={students}
            currentRole={currentRole}
            onSelectStudent={(student) => setSelectedStudent(student)}
            onOpenAddStudent={() => setAddStudentModalOpen(true)}
            initialSearchQuery={globalSearchQuery}
          />
        )}

        {/* VIEW 6: PROJECTS REPOSITORY */}
        {activeTab === 'projects' && (
          <ProjectsView
            projects={projects}
            students={students}
            currentRole={currentRole}
            onSelectProject={(project) => setSelectedProject(project)}
            onAddProject={handleAddProject}
          />
        )}

        {/* VIEW 7: EVENTS CALENDAR */}
        {activeTab === 'events' && (
          <EventsView
            events={events}
            students={students}
            currentRole={currentRole}
            activeStudentId={activeStudentId}
            onRegisterForEvent={handleRegisterForEvent}
            onUnregisterForEvent={handleUnregisterForEvent}
            onCreateEvent={handleCreateEvent}
            onNavigateToCertificatesForEvent={handleNavigateToCertificatesForEvent}
          />
        )}

        {/* VIEW 8: ANNOUNCEMENTS */}
        {activeTab === 'announcements' && (
          <AnnouncementsView
            announcements={announcements}
            students={students}
            currentRole={currentRole}
            onCreateAnnouncement={handleCreateAnnouncement}
          />
        )}

        {/* VIEW 9: CERTIFICATES & QR VERIFY */}
        {activeTab === 'certificates' && (
          <CertificatesView
            certificates={certificates}
            events={events}
            students={students}
            currentRole={currentRole}
            activeStudentId={activeStudentId}
            onSelectCertificate={(cert) => setSelectedCertificate(cert)}
            onOpenVerifyModal={handleOpenVerifyWithNumber}
            onCreateCertificates={handleCreateCertificates}
            preselectedEventId={preselectedEventForCert}
          />
        )}

        {/* VIEW 10: RATING & LEADERBOARD */}
        {activeTab === 'rating' && (
          <RatingView
            students={students}
            onSelectStudent={(student) => setSelectedStudent(student)}
            currentRole={currentRole}
          />
        )}

        {/* VIEW 11: REKTORAT ANALYTICS & REPORTS */}
        {activeTab === 'analytics' && (
          <AnalyticsView
            students={students}
            projects={projects}
            events={events}
            certificates={certificates}
          />
        )}

      </main>

      {/* FOOTER */}
      <footer className={`border-t mt-12 py-6 text-xs transition-colors duration-150 ${
        mode === 'warm-sepia' 
          ? 'bg-[#f4ede2] border-[#dfd4c5] text-[#796e65]' 
          : mode === 'calm-dark' 
          ? 'bg-[#1a2232] border-[#2a364d] text-slate-400' 
          : 'bg-white border-slate-200 text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">TKTI Yangiyer filiali TalentHub</span>
            <span>• Toshkent kimyo-texnologiya instituti Yangiyer filiali iqtidorli talabalar boshqaruv platformasi</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
            <a 
              href="https://t.me/yosh_olimlar_tktiyf" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sky-600 dark:text-sky-400 hover:underline font-semibold"
            >
              @yosh_olimlar_tktiyf
            </a>
            <span>•</span>
            <span>© 2019 - 2026 TKTIYF</span>
            <span>•</span>
            <button 
              onClick={() => handleOpenVerifyWithNumber()} 
              className="text-sky-600 dark:text-sky-400 hover:underline font-semibold"
            >
              QR Tekshiruv
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Student Unified 4-Year Profile Modal */}
      {selectedStudent && (
        <StudentProfileModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onAddAchievement={handleAddAchievement}
          currentRole={currentRole}
          projects={projects}
          certificates={certificates}
          onSelectProject={(project) => {
            setSelectedStudent(null);
            setSelectedProject(project);
          }}
        />
      )}

      {/* 2. Project Detail Passport Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onSelectStudent={(studentId) => {
            const found = students.find((s) => s.id === studentId);
            if (found) {
              setSelectedProject(null);
              setSelectedStudent(found);
            }
          }}
        />
      )}

      {/* 3. Certificate Full View Modal */}
      {selectedCertificate && (
        <CertificateModal
          certificate={selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
          onOpenVerifyWithNumber={(num) => {
            setSelectedCertificate(null);
            handleOpenVerifyWithNumber(num);
          }}
        />
      )}

      {/* 4. Global QR-Code Verification Modal */}
      {verifyModalOpen && (
        <VerifyCertificateModal
          certificates={certificates}
          initialCertNumber={verifyInitialNumber}
          onClose={() => setVerifyModalOpen(false)}
          onViewCertificateDetails={(cert) => {
            setVerifyModalOpen(false);
            setSelectedCertificate(cert);
          }}
        />
      )}

      {/* 5. Add New Student Modal */}
      {addStudentModalOpen && (
        <AddStudentModal
          isOpen={addStudentModalOpen}
          onClose={() => setAddStudentModalOpen(false)}
          onAddStudent={handleAddStudent}
        />
      )}

    </div>
  );
}
