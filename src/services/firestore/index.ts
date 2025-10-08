// Единая точка экспорта всех Firestore сервисов
export { firebaseTasks } from './tasks';
export { firebaseProjects } from './projects';

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
import { Client, Payment, Note, FileAttachment } from '../../types';

// Клиенты
export const firebaseClients = {
  async getAll(userId: string): Promise<Client[]> {
    const snapshot = await getDocs(collection(db, 'users', userId, 'clients'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    } as Client));
  },

  async create(userId: string, client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, 'users', userId, 'clients'), {
      ...client,
      createdAt: now,
      updatedAt: now
    });
    
    return {
      id: docRef.id,
      ...client,
      createdAt: now.toDate(),
      updatedAt: now.toDate()
    } as Client;
  },

  async update(userId: string, clientId: string, updates: Partial<Client>): Promise<void> {
    await updateDoc(doc(db, 'users', userId, 'clients', clientId), {
      ...updates,
      updatedAt: Timestamp.now()
    });
  },

  async delete(userId: string, clientId: string): Promise<void> {
    await deleteDoc(doc(db, 'users', userId, 'clients', clientId));
  }
};

// Платежи
export const firebasePayments = {
  async getAll(userId: string): Promise<Payment[]> {
    const snapshot = await getDocs(collection(db, 'users', userId, 'payments'));
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        dueDate: data.dueDate?.toDate(),
        paidDate: data.paidDate?.toDate()
      } as Payment;
    });
  },

  async create(userId: string, payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> {
    const now = Timestamp.now();
    const paymentData: any = {
      ...payment,
      createdAt: now,
      updatedAt: now
    };

    if (payment.dueDate) {
      paymentData.dueDate = Timestamp.fromDate(new Date(payment.dueDate));
    }
    if (payment.paidDate) {
      paymentData.paidDate = Timestamp.fromDate(new Date(payment.paidDate));
    }

    const docRef = await addDoc(collection(db, 'users', userId, 'payments'), paymentData);
    
    return {
      id: docRef.id,
      ...payment,
      createdAt: now.toDate(),
      updatedAt: now.toDate()
    } as Payment;
  },

  async update(userId: string, paymentId: string, updates: Partial<Payment>): Promise<void> {
    const updateData: any = {
      ...updates,
      updatedAt: Timestamp.now()
    };

    if (updates.dueDate) {
      updateData.dueDate = Timestamp.fromDate(new Date(updates.dueDate));
    }
    if (updates.paidDate) {
      updateData.paidDate = Timestamp.fromDate(new Date(updates.paidDate));
    }

    await updateDoc(doc(db, 'users', userId, 'payments', paymentId), updateData);
  },

  async delete(userId: string, paymentId: string): Promise<void> {
    await deleteDoc(doc(db, 'users', userId, 'payments', paymentId));
  }
};

// Заметки
export const firebaseNotes = {
  async getAll(userId: string): Promise<Note[]> {
    const snapshot = await getDocs(collection(db, 'users', userId, 'notes'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    } as Note));
  },

  async create(userId: string, note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, 'users', userId, 'notes'), {
      ...note,
      createdAt: now,
      updatedAt: now
    });
    
    return {
      id: docRef.id,
      ...note,
      createdAt: now.toDate(),
      updatedAt: now.toDate()
    } as Note;
  },

  async update(userId: string, noteId: string, updates: Partial<Note>): Promise<void> {
    await updateDoc(doc(db, 'users', userId, 'notes', noteId), {
      ...updates,
      updatedAt: Timestamp.now()
    });
  },

  async delete(userId: string, noteId: string): Promise<void> {
    await deleteDoc(doc(db, 'users', userId, 'notes', noteId));
  }
};

// Файлы
export const firebaseFiles = {
  async getAll(userId: string): Promise<FileAttachment[]> {
    const snapshot = await getDocs(collection(db, 'users', userId, 'files'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      uploadedAt: doc.data().uploadedAt?.toDate() || new Date()
    } as FileAttachment));
  },

  async upload(userId: string, file: Omit<FileAttachment, 'id' | 'uploadedAt'>): Promise<FileAttachment> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, 'users', userId, 'files'), {
      ...file,
      uploadedAt: now
    });
    
    return {
      id: docRef.id,
      ...file,
      uploadedAt: now.toDate()
    } as FileAttachment;
  },

  async delete(userId: string, fileId: string): Promise<void> {
    await deleteDoc(doc(db, 'users', userId, 'files', fileId));
  }
};

