import { useState, useEffect, useCallback } from 'react';
import { db } from '../database/db';
import { Project, ProjectStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const projectsData = await db.projects.orderBy('createdAt').toArray();
      setProjects(projectsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки проектов');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const createProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'tasks'>) => {
    try {
      const newProject: Project = {
        ...projectData,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
        tasks: []
      };
      
      await db.projects.add(newProject);
      await loadProjects();
      return newProject;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка создания проекта');
      throw err;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };
      
      await db.projects.update(id, updateData);
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка обновления проекта');
      throw err;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      // Удаляем все задачи проекта
      await db.tasks.where('projectId').equals(id).delete();
      
      // Удаляем проект
      await db.projects.delete(id);
      
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления проекта');
      throw err;
    }
  };

  const updateProjectStatus = async (id: string, status: ProjectStatus) => {
    try {
      await db.projects.update(id, {
        status,
        updatedAt: new Date()
      });
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка обновления статуса проекта');
      throw err;
    }
  };

  const addTaskToProject = async (projectId: string, taskId: string) => {
    try {
      const project = await db.projects.get(projectId);
      if (!project) throw new Error('Проект не найден');
      
      if (!project.tasks.includes(taskId)) {
        await db.projects.update(projectId, {
          tasks: [...project.tasks, taskId],
          updatedAt: new Date()
        });
        await loadProjects();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка добавления задачи в проект');
      throw err;
    }
  };

  const removeTaskFromProject = async (projectId: string, taskId: string) => {
    try {
      const project = await db.projects.get(projectId);
      if (!project) throw new Error('Проект не найден');
      
      await db.projects.update(projectId, {
        tasks: project.tasks.filter(id => id !== taskId),
        updatedAt: new Date()
      });
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления задачи из проекта');
      throw err;
    }
  };

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    updateProjectStatus,
    addTaskToProject,
    removeTaskFromProject,
    refetch: loadProjects
  };
};
