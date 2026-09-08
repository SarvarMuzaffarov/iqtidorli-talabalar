import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc,
  writeBatch,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';
import firebaseConfigJson from '../../firebase-applet-config.json';
import { 
  Student, 
  Project, 
  UniversityEvent, 
  Announcement, 
  Certificate,
  Teacher,
  UserAccount 
} from '../types';

// Collection references
export const COLLECTIONS = {
  STUDENTS: 'students',
  PROJECTS: 'projects',
  EVENTS: 'events',
  ANNOUNCEMENTS: 'announcements',
  CERTIFICATES: 'certificates',
  TEACHERS: 'teachers',
  USERS: 'users',
  SYSTEM: 'system',
};

export const FIREBASE_INFO = {
  projectId: firebaseConfigJson.projectId,
  databaseId: firebaseConfigJson.firestoreDatabaseId || '(default)',
  consoleUrl: `https://console.firebase.google.com/project/${firebaseConfigJson.projectId}/firestore/databases/${firebaseConfigJson.firestoreDatabaseId || '(default)'}/data`
};

// Real-time snapshot subscribers
export function subscribeToStudents(callback: (students: Student[]) => void): Unsubscribe {
  return onSnapshot(collection(db, COLLECTIONS.STUDENTS), (snapshot) => {
    const data = snapshot.docs.map((d) => d.data() as Student);
    if (data.length > 0) {
      callback(data);
    }
  }, (err) => {
    console.warn('Students snapshot listener warning:', err);
  });
}

export function subscribeToProjects(callback: (projects: Project[]) => void): Unsubscribe {
  return onSnapshot(collection(db, COLLECTIONS.PROJECTS), (snapshot) => {
    const data = snapshot.docs.map((d) => d.data() as Project);
    if (data.length > 0) {
      callback(data);
    }
  }, (err) => {
    console.warn('Projects snapshot listener warning:', err);
  });
}

export function subscribeToEvents(callback: (events: UniversityEvent[]) => void): Unsubscribe {
  return onSnapshot(collection(db, COLLECTIONS.EVENTS), (snapshot) => {
    const data = snapshot.docs.map((d) => d.data() as UniversityEvent);
    if (data.length > 0) {
      callback(data);
    }
  }, (err) => {
    console.warn('Events snapshot listener warning:', err);
  });
}

export function subscribeToAnnouncements(callback: (announcements: Announcement[]) => void): Unsubscribe {
  return onSnapshot(collection(db, COLLECTIONS.ANNOUNCEMENTS), (snapshot) => {
    const data = snapshot.docs.map((d) => d.data() as Announcement);
    if (data.length > 0) {
      callback(data);
    }
  }, (err) => {
    console.warn('Announcements snapshot listener warning:', err);
  });
}

export function subscribeToCertificates(callback: (certificates: Certificate[]) => void): Unsubscribe {
  return onSnapshot(collection(db, COLLECTIONS.CERTIFICATES), (snapshot) => {
    const data = snapshot.docs.map((d) => d.data() as Certificate);
    if (data.length > 0) {
      callback(data);
    }
  }, (err) => {
    console.warn('Certificates snapshot listener warning:', err);
  });
}

export function subscribeToTeachers(callback: (teachers: Teacher[]) => void): Unsubscribe {
  return onSnapshot(collection(db, COLLECTIONS.TEACHERS), (snapshot) => {
    const data = snapshot.docs.map((d) => d.data() as Teacher);
    if (data.length > 0) {
      callback(data);
    }
  }, (err) => {
    console.warn('Teachers snapshot listener warning:', err);
  });
}

export function subscribeToAccounts(callback: (accounts: UserAccount[]) => void): Unsubscribe {
  return onSnapshot(collection(db, COLLECTIONS.USERS), (snapshot) => {
    const data = snapshot.docs.map((d) => d.data() as UserAccount);
    if (data.length > 0) {
      callback(data);
    }
  }, (err) => {
    console.warn('Accounts snapshot listener warning:', err);
  });
}

// Check database status and count documents
export async function getDatabaseStatus() {
  try {
    const [sSnap, pSnap, eSnap, aSnap, cSnap, tSnap, uSnap] = await Promise.all([
      getDocs(collection(db, COLLECTIONS.STUDENTS)),
      getDocs(collection(db, COLLECTIONS.PROJECTS)),
      getDocs(collection(db, COLLECTIONS.EVENTS)),
      getDocs(collection(db, COLLECTIONS.ANNOUNCEMENTS)),
      getDocs(collection(db, COLLECTIONS.CERTIFICATES)),
      getDocs(collection(db, COLLECTIONS.TEACHERS)),
      getDocs(collection(db, COLLECTIONS.USERS)),
    ]);

    return {
      connected: true,
      studentsCount: sSnap.docs.length,
      projectsCount: pSnap.docs.length,
      eventsCount: eSnap.docs.length,
      announcementsCount: aSnap.docs.length,
      certificatesCount: cSnap.docs.length,
      teachersCount: tSnap.docs.length,
      usersCount: uSnap.docs.length,
      databaseId: FIREBASE_INFO.databaseId,
      projectId: FIREBASE_INFO.projectId,
      consoleUrl: FIREBASE_INFO.consoleUrl
    };
  } catch (error: any) {
    return {
      connected: false,
      error: error?.message || 'Ulanishda xatolik',
      databaseId: FIREBASE_INFO.databaseId,
      projectId: FIREBASE_INFO.projectId,
      consoleUrl: FIREBASE_INFO.consoleUrl
    };
  }
}

// Test write to verify write permissions
export async function sendTestPing() {
  const pingDoc = {
    id: 'test-ping-' + Date.now(),
    timestamp: new Date().toISOString(),
    status: 'online',
    message: 'TKTIFY Yangiyer filiali - Firebase muvaffaqiyatli ulangan'
  };
  await setDoc(doc(db, COLLECTIONS.SYSTEM, 'connection_test'), pingDoc, { merge: true });
  return pingDoc;
}

// Seed or load initial data to Firestore
export async function syncInitialDataToFirestore(
  initialStudents: Student[],
  initialProjects: Project[],
  initialEvents: UniversityEvent[],
  initialAnnouncements: Announcement[],
  initialCertificates: Certificate[],
  initialTeachers?: Teacher[],
  initialAccounts?: UserAccount[]
) {
  try {
    const studentsSnap = await getDocs(collection(db, COLLECTIONS.STUDENTS));
    
    // If database has already been seeded, fetch existing
    if (!studentsSnap.empty) {
      const students = studentsSnap.docs.map(d => d.data() as Student);
      const projectsSnap = await getDocs(collection(db, COLLECTIONS.PROJECTS));
      const projects = projectsSnap.docs.map(d => d.data() as Project);
      const eventsSnap = await getDocs(collection(db, COLLECTIONS.EVENTS));
      const events = eventsSnap.docs.map(d => d.data() as UniversityEvent);
      const announcementsSnap = await getDocs(collection(db, COLLECTIONS.ANNOUNCEMENTS));
      const announcements = announcementsSnap.docs.map(d => d.data() as Announcement);
      const certificatesSnap = await getDocs(collection(db, COLLECTIONS.CERTIFICATES));
      const certificates = certificatesSnap.docs.map(d => d.data() as Certificate);
      
      const teachersSnap = await getDocs(collection(db, COLLECTIONS.TEACHERS));
      const teachers = teachersSnap.empty && initialTeachers 
        ? initialTeachers 
        : teachersSnap.docs.map(d => d.data() as Teacher);

      const accountsSnap = await getDocs(collection(db, COLLECTIONS.USERS));
      const accounts = accountsSnap.empty && initialAccounts
        ? initialAccounts
        : accountsSnap.docs.map(d => d.data() as UserAccount);

      return {
        students,
        projects,
        events,
        announcements,
        certificates,
        teachers,
        accounts,
        seeded: false
      };
    }

    // Seed batch
    const batch = writeBatch(db);

    initialStudents.forEach((student) => {
      const ref = doc(db, COLLECTIONS.STUDENTS, student.id);
      batch.set(ref, student);
    });

    initialProjects.forEach((project) => {
      const ref = doc(db, COLLECTIONS.PROJECTS, project.id);
      batch.set(ref, project);
    });

    initialEvents.forEach((ev) => {
      const ref = doc(db, COLLECTIONS.EVENTS, ev.id);
      batch.set(ref, ev);
    });

    initialAnnouncements.forEach((ann) => {
      const ref = doc(db, COLLECTIONS.ANNOUNCEMENTS, ann.id);
      batch.set(ref, ann);
    });

    initialCertificates.forEach((cert) => {
      const ref = doc(db, COLLECTIONS.CERTIFICATES, cert.id);
      batch.set(ref, cert);
    });

    if (initialTeachers) {
      initialTeachers.forEach((teacher) => {
        const ref = doc(db, COLLECTIONS.TEACHERS, teacher.id);
        batch.set(ref, teacher);
      });
    }

    if (initialAccounts) {
      initialAccounts.forEach((acc) => {
        const ref = doc(db, COLLECTIONS.USERS, acc.id);
        batch.set(ref, acc);
      });
    }

    await batch.commit();

    return {
      students: initialStudents,
      projects: initialProjects,
      events: initialEvents,
      announcements: initialAnnouncements,
      certificates: initialCertificates,
      teachers: initialTeachers || [],
      accounts: initialAccounts || [],
      seeded: true
    };
  } catch (error) {
    console.warn('Firestore sync note (fallback to offline storage):', error);
    return null;
  }
}

// Single item Firestore save helpers
export async function saveStudentToFirestore(student: Student) {
  try {
    await setDoc(doc(db, COLLECTIONS.STUDENTS, student.id), student, { merge: true });
  } catch (e) {
    console.warn('Could not persist student to Firestore:', e);
  }
}

export async function saveProjectToFirestore(project: Project) {
  try {
    await setDoc(doc(db, COLLECTIONS.PROJECTS, project.id), project, { merge: true });
  } catch (e) {
    console.warn('Could not persist project to Firestore:', e);
  }
}

export async function saveEventToFirestore(event: UniversityEvent) {
  try {
    await setDoc(doc(db, COLLECTIONS.EVENTS, event.id), event, { merge: true });
  } catch (e) {
    console.warn('Could not persist event to Firestore:', e);
  }
}

export async function saveAnnouncementToFirestore(announcement: Announcement) {
  try {
    await setDoc(doc(db, COLLECTIONS.ANNOUNCEMENTS, announcement.id), announcement, { merge: true });
  } catch (e) {
    console.warn('Could not persist announcement to Firestore:', e);
  }
}

export async function saveCertificateToFirestore(certificate: Certificate) {
  try {
    await setDoc(doc(db, COLLECTIONS.CERTIFICATES, certificate.id), certificate, { merge: true });
  } catch (e) {
    console.warn('Could not persist certificate to Firestore:', e);
  }
}

export async function saveTeacherToFirestore(teacher: Teacher) {
  try {
    await setDoc(doc(db, COLLECTIONS.TEACHERS, teacher.id), teacher, { merge: true });
  } catch (e) {
    console.warn('Could not persist teacher to Firestore:', e);
  }
}

export async function deleteTeacherFromFirestore(teacherId: string) {
  try {
    await deleteDoc(doc(db, COLLECTIONS.TEACHERS, teacherId));
  } catch (e) {
    console.warn('Could not delete teacher from Firestore:', e);
  }
}

export async function saveAccountToFirestore(account: UserAccount) {
  try {
    await setDoc(doc(db, COLLECTIONS.USERS, account.id), account, { merge: true });
  } catch (e) {
    console.warn('Could not persist account to Firestore:', e);
  }
}

export async function deleteAccountFromFirestore(accountId: string) {
  try {
    await deleteDoc(doc(db, COLLECTIONS.USERS, accountId));
  } catch (e) {
    console.warn('Could not delete account from Firestore:', e);
  }
}
