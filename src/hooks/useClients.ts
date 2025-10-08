import { useState, useEffect, useCallback } from 'react';
import { db } from '../database/db';
import { Client } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const clientsData = await db.clients.orderBy('createdAt').toArray();
      setClients(clientsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки клиентов');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const createClient = async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'projects'>) => {
    try {
      const newClient: Client = {
        ...clientData,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
        projects: []
      };
      
      await db.clients.add(newClient);
      await loadClients();
      return newClient;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка создания клиента');
      throw err;
    }
  };

  const updateClient = async (id: string, updates: Partial<Client>) => {
    try {
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };
      
      await db.clients.update(id, updateData);
      await loadClients();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка обновления клиента');
      throw err;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      // Удаляем все проекты клиента
      const clientProjects = await db.projects.where('clientId').equals(id).toArray();
      for (const project of clientProjects) {
        // Удаляем задачи проектов
        await db.tasks.where('projectId').equals(project.id).delete();
        // Удаляем проект
        await db.projects.delete(project.id);
      }
      
      // Удаляем клиента
      await db.clients.delete(id);
      
      await loadClients();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления клиента');
      throw err;
    }
  };

  return {
    clients,
    loading,
    error,
    createClient,
    updateClient,
    deleteClient,
    refetch: loadClients
  };
};
