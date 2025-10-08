import { useState, useEffect, useCallback } from 'react';
import { db } from '../database/db';
import { Note, NoteType } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const notesData = await db.notes.orderBy('createdAt').toArray();
      setNotes(notesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки заметок');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const createNote = async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newNote: Note = {
        ...noteData,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await db.notes.add(newNote);
      await loadNotes();
      return newNote;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка создания заметки');
      throw err;
    }
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    try {
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };
      
      await db.notes.update(id, updateData);
      await loadNotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка обновления заметки');
      throw err;
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await db.notes.delete(id);
      await loadNotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления заметки');
      throw err;
    }
  };

  return {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    refetch: loadNotes
  };
};
