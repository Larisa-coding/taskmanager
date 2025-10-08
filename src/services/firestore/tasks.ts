import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Task, TaskStatus } from '../../types';

const getTasksCollection = (userId: string) => {
  return collection(db, 'users', userId, 'tasks');
};

export const firebaseTasks = {
  async getAll(userId: string): Promise<Task[]> {
    const tasksCol = getTasksCollection(userId);
    const snapshot = await getDocs(tasksCol);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        dueDate: data.dueDate?.toDate(),
        completedAt: data.completedAt?.toDate()
      } as Task;
    });
  },

  async create(userId: string, task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const tasksCol = getTasksCollection(userId);
    const now = Timestamp.now();
    
    const taskData = {
      ...task,
      createdAt: now,
      updatedAt: now,
      dueDate: task.dueDate ? Timestamp.fromDate(new Date(task.dueDate)) : null,
      completedAt: task.completedAt ? Timestamp.fromDate(new Date(task.completedAt)) : null
    };

    const docRef = await addDoc(tasksCol, taskData);
    
    return {
      id: docRef.id,
      ...task,
      createdAt: now.toDate(),
      updatedAt: now.toDate()
    } as Task;
  },

  async update(userId: string, taskId: string, updates: Partial<Task>): Promise<void> {
    const taskDoc = doc(db, 'users', userId, 'tasks', taskId);
    
    const updateData: any = {
      ...updates,
      updatedAt: Timestamp.now()
    };

    if (updates.dueDate) {
      updateData.dueDate = Timestamp.fromDate(new Date(updates.dueDate));
    }
    if (updates.completedAt) {
      updateData.completedAt = Timestamp.fromDate(new Date(updates.completedAt));
    }

    await updateDoc(taskDoc, updateData);
  },

  async delete(userId: string, taskId: string): Promise<void> {
    const taskDoc = doc(db, 'users', userId, 'tasks', taskId);
    await deleteDoc(taskDoc);
  },

  async updateStatus(userId: string, taskId: string, status: TaskStatus): Promise<void> {
    const updates: any = {
      status,
      updatedAt: Timestamp.now()
    };

    if (status === 'completed') {
      updates.completedAt = Timestamp.now();
    }

    const taskDoc = doc(db, 'users', userId, 'tasks', taskId);
    await updateDoc(taskDoc, updates);
  }
};

