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
import { db, auth } from './firebase';
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
} as const;

export const FIREBASE_INFO = {
  projectId: firebaseConfigJson.projectId,
  databaseId: firebaseConfigJson.firestoreDatabaseId || '(default)',
  consoleUrl: `https://console.firebase.google.com/project/${firebaseConfigJson.projectId}/firestore/databases/${firebaseConfigJson.firestoreDatabaseId || '(default)'}/data`
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): FirestoreErrorInfo {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error Log: ', JSON.stringify(errInfo));
  return errInfo;
}

// Real-time snapshot subscribers
export function subscribeToStudents(callback: (students: Student[]) => void): Unsubscribe {
  return onSnapshot(collection(db, COLLECTIONS.STUDENTS), (snapshot) => {
    const data = snapshot.docs.map((d) => d.data() as Student);
    callback(data);
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, COLLECTIONS.STUDENTS);
  });
}

export function subscribeToProjects(callback: (projects: Project[]) => void): Unsubscribe {
  return onSnapshot(collection(db, COLLECTIONS.PROJECTS), (snapshot) => {
    const data = snapshot.docs.map((d) => d.data() as Project);
    callback(data);
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, COLLECTIONS.PROJECTS);
  });
}

export function subscribeToEvents(callback: (events: UniversityEvent[]) => void): Unsubscribe {
  return onSnapshot(collection(db, COLLECTIONS.EVENTS), (snapshot) => {
    const data = snapshot.docs.map((d) => d.data() as UniversityEvent);
    callback(data);
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, COLLECTIONS.EVENTS);
  });
}

export function subscribeToAnnouncements(callback: (announcements: Announcement[]) => void): Unsubscribe {
  return onSnapshot(collection(db, COLLECTIONS.ANNOUNCEMENTS), (snapshot) => {
    const data = snapshot.docs.map((d) => d.data() as Announcement);
    callback(data);
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, COLLECTIONS.ANNOUNCEMENTS);
  });
}

export function subscribeToCertificates(callback: (certificates: Certificate[]) => void): Unsubscribe {
  return onSnapshot(collection(db, COLLECTIONS.CERTIFICATES), (snapshot) => {
    const data = snapshot.docs.map((d) => d.data() as Certificate);
    callback(data);
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, COLLECTIONS.CERTIFICATES);
  });
}

export function subscribeToTeachers(callback: (teachers: Teacher[]) => void): Unsubscribe {
  return onSnapshot(collection(db, COLLECTIONS.TEACHERS), (snapshot) => {
    const data = snapshot.docs.map((d) => d.data() as Teacher);
    callback(data);
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, COLLECTIONS.TEACHERS);
  });
}

export function subscribeToAccounts(callback: (accounts: UserAccount[]) => void): Unsubscribe {
  return onSnapshot(collection(db, COLLECTIONS.USERS), (snapshot) => {
    const data = snapshot.docs.map((d) => d.data() as UserAccount);
    callback(data);
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, COLLECTIONS.USERS);
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
      let teachers: Teacher[] = [];
      if (teachersSnap.empty && initialTeachers && initialTeachers.length > 0) {
        teachers = initialTeachers;
        const tBatch = writeBatch(db);
        initialTeachers.forEach(t => tBatch.set(doc(db, COLLECTIONS.TEACHERS, t.id), t));
        await tBatch.commit().catch(e => console.warn('Could not seed missing teachers:', e));
      } else {
        teachers = teachersSnap.docs.map(d => d.data() as Teacher);
      }

      const accountsSnap = await getDocs(collection(db, COLLECTIONS.USERS));
      let accounts: UserAccount[] = [];
      if (accountsSnap.empty && initialAccounts && initialAccounts.length > 0) {
        accounts = initialAccounts;
        const aBatch = writeBatch(db);
        initialAccounts.forEach(a => aBatch.set(doc(db, COLLECTIONS.USERS, a.id), a));
        await aBatch.commit().catch(e => console.warn('Could not seed missing accounts:', e));
      } else {
        accounts = accountsSnap.docs.map(d => d.data() as UserAccount);
      }

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
    handleFirestoreError(e, OperationType.WRITE, `${COLLECTIONS.STUDENTS}/${student.id}`);
  }
}

export async function saveProjectToFirestore(project: Project) {
  try {
    await setDoc(doc(db, COLLECTIONS.PROJECTS, project.id), project, { merge: true });
  } catch (e) {
    handleFirestoreError(e, OperationType.WRITE, `${COLLECTIONS.PROJECTS}/${project.id}`);
  }
}

export async function saveEventToFirestore(event: UniversityEvent) {
  try {
    await setDoc(doc(db, COLLECTIONS.EVENTS, event.id), event, { merge: true });
  } catch (e) {
    handleFirestoreError(e, OperationType.WRITE, `${COLLECTIONS.EVENTS}/${event.id}`);
  }
}

export async function saveAnnouncementToFirestore(announcement: Announcement) {
  try {
    await setDoc(doc(db, COLLECTIONS.ANNOUNCEMENTS, announcement.id), announcement, { merge: true });
  } catch (e) {
    handleFirestoreError(e, OperationType.WRITE, `${COLLECTIONS.ANNOUNCEMENTS}/${announcement.id}`);
  }
}

export async function saveCertificateToFirestore(certificate: Certificate) {
  try {
    await setDoc(doc(db, COLLECTIONS.CERTIFICATES, certificate.id), certificate, { merge: true });
  } catch (e) {
    handleFirestoreError(e, OperationType.WRITE, `${COLLECTIONS.CERTIFICATES}/${certificate.id}`);
  }
}

export async function saveTeacherToFirestore(teacher: Teacher) {
  try {
    await setDoc(doc(db, COLLECTIONS.TEACHERS, teacher.id), teacher, { merge: true });
  } catch (e) {
    handleFirestoreError(e, OperationType.WRITE, `${COLLECTIONS.TEACHERS}/${teacher.id}`);
  }
}

export async function deleteTeacherFromFirestore(teacherId: string) {
  try {
    await deleteDoc(doc(db, COLLECTIONS.TEACHERS, teacherId));
  } catch (e) {
    handleFirestoreError(e, OperationType.DELETE, `${COLLECTIONS.TEACHERS}/${teacherId}`);
  }
}

export async function saveAccountToFirestore(account: UserAccount) {
  try {
    await setDoc(doc(db, COLLECTIONS.USERS, account.id), account, { merge: true });
  } catch (e) {
    handleFirestoreError(e, OperationType.WRITE, `${COLLECTIONS.USERS}/${account.id}`);
  }
}

export async function deleteAccountFromFirestore(accountId: string) {
  try {
    await deleteDoc(doc(db, COLLECTIONS.USERS, accountId));
  } catch (e) {
    handleFirestoreError(e, OperationType.DELETE, `${COLLECTIONS.USERS}/${accountId}`);
  }
}

export async function deleteStudentFromFirestore(studentId: string) {
  try {
    await deleteDoc(doc(db, COLLECTIONS.STUDENTS, studentId));
  } catch (e) {
    handleFirestoreError(e, OperationType.DELETE, `${COLLECTIONS.STUDENTS}/${studentId}`);
  }
}

export async function deleteProjectFromFirestore(projectId: string) {
  try {
    await deleteDoc(doc(db, COLLECTIONS.PROJECTS, projectId));
  } catch (e) {
    handleFirestoreError(e, OperationType.DELETE, `${COLLECTIONS.PROJECTS}/${projectId}`);
  }
}

