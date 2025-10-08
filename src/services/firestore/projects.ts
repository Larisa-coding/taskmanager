import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Project } from '../../types';

const getProjectsCollection = (userId: string) => {
  return collection(db, 'users', userId, 'projects');
};

export const firebaseProjects = {
  async getAll(userId: string): Promise<Project[]> {
    const projectsCol = getProjectsCollection(userId);
    const snapshot = await getDocs(projectsCol);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        startDate: data.startDate?.toDate(),
        endDate: data.endDate?.toDate(),
        completedAt: data.completedAt?.toDate()
      } as Project;
    });
  },

  async create(userId: string, project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const projectsCol = getProjectsCollection(userId);
    const now = Timestamp.now();
    
    const projectData = {
      ...project,
      createdAt: now,
      updatedAt: now,
      startDate: project.startDate ? Timestamp.fromDate(new Date(project.startDate)) : null,
      endDate: project.endDate ? Timestamp.fromDate(new Date(project.endDate)) : null,
      completedAt: project.completedAt ? Timestamp.fromDate(new Date(project.completedAt)) : null
    };

    const docRef = await addDoc(projectsCol, projectData);
    
    return {
      id: docRef.id,
      ...project,
      createdAt: now.toDate(),
      updatedAt: now.toDate()
    } as Project;
  },

  async update(userId: string, projectId: string, updates: Partial<Project>): Promise<void> {
    const projectDoc = doc(db, 'users', userId, 'projects', projectId);
    
    const updateData: any = {
      ...updates,
      updatedAt: Timestamp.now()
    };

    if (updates.startDate) {
      updateData.startDate = Timestamp.fromDate(new Date(updates.startDate));
    }
    if (updates.endDate) {
      updateData.endDate = Timestamp.fromDate(new Date(updates.endDate));
    }
    if (updates.completedAt) {
      updateData.completedAt = Timestamp.fromDate(new Date(updates.completedAt));
    }

    await updateDoc(projectDoc, updateData);
  },

  async delete(userId: string, projectId: string): Promise<void> {
    const projectDoc = doc(db, 'users', userId, 'projects', projectId);
    await deleteDoc(projectDoc);
  }
};

