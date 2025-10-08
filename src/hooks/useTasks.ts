import { useState, useEffect, useCallback } from 'react';
import { db } from '../database/db';
import { Task, TaskStatus, Priority, FilterOptions } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const useTasks = (filters?: FilterOptions) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = db.tasks.orderBy('createdAt');
      
      if (filters?.status && filters.status.length > 0) {
        query = query.filter(task => filters.status!.includes(task.status));
      }
      
      if (filters?.priority && filters.priority.length > 0) {
        query = query.filter(task => filters.priority!.includes(task.priority));
      }
      
      if (filters?.projectId) {
        query = query.filter(task => task.projectId === filters.projectId);
      }
      
      if (filters?.clientId) {
        query = query.filter(task => task.clientId === filters.clientId);
      }
      
      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase();
        query = query.filter(task => 
          task.title.toLowerCase().includes(searchTerm) ||
          task.description?.toLowerCase().includes(searchTerm) ||
          task.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }
      
      if (filters?.dueDate) {
        if (filters.dueDate.from) {
          query = query.filter(task => 
            task.dueDate ? task.dueDate >= filters.dueDate!.from! : false
          );
        }
        if (filters.dueDate.to) {
          query = query.filter(task => 
            task.dueDate ? task.dueDate <= filters.dueDate!.to! : false
          );
        }
      }
      
      if (filters?.tags && filters.tags.length > 0) {
        query = query.filter(task => 
          filters.tags!.some(tag => task.tags.includes(tag))
        );
      }
      
      const tasksData = await query.toArray();
      setTasks(tasksData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки задач');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newTask: Task = {
        ...taskData,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
        comments: []
      };
      
      await db.tasks.add(newTask);
      await loadTasks();
      return newTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка создания задачи');
      throw err;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };
      
      await db.tasks.update(id, updateData);
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка обновления задачи');
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await db.tasks.delete(id);
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления задачи');
      throw err;
    }
  };

  const updateTaskStatus = async (id: string, status: TaskStatus) => {
    try {
      const updateData: Partial<Task> = {
        status,
        updatedAt: new Date()
      };
      
      if (status === 'completed') {
        updateData.completedAt = new Date();
      } else {
        const currentTask = tasks.find(t => t.id === id);
        if (currentTask?.completedAt) {
          updateData.completedAt = undefined;
        }
      }
      
      await db.tasks.update(id, updateData);
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка обновления статуса');
      throw err;
    }
  };

  const addComment = async (taskId: string, comment: Omit<Task['comments'][0], 'id' | 'createdAt'>) => {
    try {
      const task = await db.tasks.get(taskId);
      if (!task) throw new Error('Задача не найдена');
      
      const newComment = {
        ...comment,
        id: uuidv4(),
        createdAt: new Date()
      };
      
      await db.tasks.update(taskId, {
        comments: [...task.comments, newComment],
        updatedAt: new Date()
      });
      
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка добавления комментария');
      throw err;
    }
  };

  const addChecklistItem = async (taskId: string, text: string) => {
    try {
      const task = await db.tasks.get(taskId);
      if (!task) throw new Error('Задача не найдена');
      
      const newItem = {
        id: uuidv4(),
        text,
        completed: false,
        createdAt: new Date()
      };
      
      await db.tasks.update(taskId, {
        checklist: [...(task.checklist || []), newItem],
        updatedAt: new Date()
      });
      
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка добавления пункта чек-листа');
      throw err;
    }
  };

  const toggleChecklistItem = async (taskId: string, itemId: string) => {
    try {
      const task = await db.tasks.get(taskId);
      if (!task || !task.checklist) throw new Error('Задача или чек-лист не найдены');
      
      const updatedChecklist = task.checklist.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      );
      
      await db.tasks.update(taskId, {
        checklist: updatedChecklist,
        updatedAt: new Date()
      });
      
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка обновления чек-листа');
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    addComment,
    addChecklistItem,
    toggleChecklistItem,
    refetch: loadTasks
  };
};
