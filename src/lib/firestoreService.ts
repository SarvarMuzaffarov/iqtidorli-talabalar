import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  writeBatch 
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  Student, 
  Project, 
  UniversityEvent, 
  Announcement, 
  Certificate 
} from '../types';

// Collection references
export const COLLECTIONS = {
  STUDENTS: 'students',
  PROJECTS: 'projects',
  EVENTS: 'events',
  ANNOUNCEMENTS: 'announcements',
  CERTIFICATES: 'certificates',
};

// Seed or load initial data to Firestore
export async function syncInitialDataToFirestore(
  initialStudents: Student[],
  initialProjects: Project[],
  initialEvents: UniversityEvent[],
  initialAnnouncements: Announcement[],
  initialCertificates: Certificate[]
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

      return {
        students,
        projects,
        events,
        announcements,
        certificates,
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

    await batch.commit();

    return {
      students: initialStudents,
      projects: initialProjects,
      events: initialEvents,
      announcements: initialAnnouncements,
      certificates: initialCertificates,
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
