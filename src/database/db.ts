import Dexie, { Table } from 'dexie';
import { Task, Project, Client, Payment, Note, FileAttachment } from '../types';

export class TaskManagerDB extends Dexie {
  tasks!: Table<Task>;
  projects!: Table<Project>;
  clients!: Table<Client>;
  payments!: Table<Payment>;
  notes!: Table<Note>;
  files!: Table<FileAttachment>;

  constructor() {
    super('TaskManagerDB');
    
    this.version(1).stores({
      tasks: 'id, title, status, priority, projectId, clientId, dueDate, createdAt, updatedAt, completedAt, tags',
      projects: 'id, name, status, clientId, startDate, endDate, createdAt, updatedAt, tags',
      clients: 'id, name, email, company, createdAt, updatedAt',
      payments: 'id, amount, type, status, projectId, clientId, dueDate, paidDate, createdAt, updatedAt, category',
      notes: 'id, title, type, projectId, taskId, clientId, createdAt, updatedAt, tags',
      files: 'id, name, type, taskId, projectId, uploadedAt'
    });

    // Добавляем индексы для быстрого поиска
    this.version(2).stores({
      tasks: 'id, title, status, priority, projectId, clientId, dueDate, createdAt, updatedAt, completedAt, tags, [status+priority], [projectId+status]',
      projects: 'id, name, status, clientId, startDate, endDate, completedAt, createdAt, updatedAt, tags, [status+clientId]',
      clients: 'id, name, email, company, createdAt, updatedAt',
      payments: 'id, amount, type, status, projectId, clientId, dueDate, paidDate, createdAt, updatedAt, category, [type+status], [clientId+type]',
      notes: 'id, title, type, projectId, taskId, clientId, createdAt, updatedAt, tags, [type+projectId]',
      files: 'id, name, type, taskId, projectId, uploadedAt, [taskId+type]'
    });
  }
}

export const db = new TaskManagerDB();

// Инициализация базы данных с тестовыми данными
export const initializeDatabase = async () => {
  try {
    // Проверяем, есть ли уже данные
    const taskCount = await db.tasks.count();
    
    if (taskCount === 0) {
      // Создаем тестового клиента
      const clientId = 'client-1';
      await db.clients.add({
        id: clientId,
        name: 'ООО "Пример"',
        email: 'info@example.com',
        company: 'ООО "Пример"',
        notes: 'Тестовый клиент',
        createdAt: new Date(),
        updatedAt: new Date(),
        projects: []
      });

      // Создаем тестовый проект
      const projectId = 'project-1';
      await db.projects.add({
        id: projectId,
        name: 'Разработка сайта',
        description: 'Создание корпоративного сайта',
        clientId: clientId,
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 дней
        budget: 150000,
        color: '#3B82F6',
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: ['веб-разработка', 'дизайн'],
        tasks: []
      });

      // Создаем тестовые задачи
      await db.tasks.bulkAdd([
        {
          id: 'task-1',
          title: 'Создать макет главной страницы',
          description: 'Разработать дизайн главной страницы сайта',
          status: 'in_progress',
          priority: 'high',
          projectId: projectId,
          clientId: clientId,
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // +3 дня
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: ['дизайн', 'макет'],
          color: '#EF4444',
          checklist: [
            { id: 'check-1', text: 'Изучить требования', completed: true, createdAt: new Date() },
            { id: 'check-2', text: 'Создать wireframe', completed: false, createdAt: new Date() },
            { id: 'check-3', text: 'Разработать дизайн', completed: false, createdAt: new Date() }
          ],
          comments: [],
          estimatedHours: 8
        },
        {
          id: 'task-2',
          title: 'Настроить сервер',
          description: 'Подготовить серверную инфраструктуру',
          status: 'new',
          priority: 'medium',
          projectId: projectId,
          clientId: clientId,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 дней
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: ['сервер', 'настройка'],
          color: '#10B981',
          checklist: [],
          comments: [],
          estimatedHours: 4
        }
      ]);

      // Обновляем проект с ID задач
      await db.projects.update(projectId, {
        tasks: ['task-1', 'task-2'],
        updatedAt: new Date()
      });

      // Обновляем клиента с ID проекта
      await db.clients.update(clientId, {
        projects: [projectId],
        updatedAt: new Date()
      });

      // Создаем тестовую заметку
      await db.notes.add({
        id: 'note-1',
        title: 'Идеи для улучшения UX',
        content: 'Добавить анимации переходов между страницами, улучшить мобильную версию',
        type: 'idea',
        tags: ['ux', 'анимации'],
        createdAt: new Date(),
        updatedAt: new Date(),
        projectId: projectId
      });

      // Создаем тестовый платеж
      await db.payments.add({
        id: 'payment-1',
        amount: 50000,
        description: 'Предоплата за разработку сайта',
        type: 'income',
        projectId: projectId,
        clientId: clientId,
        dueDate: new Date(),
        paidDate: new Date(),
        status: 'paid',
        createdAt: new Date(),
        updatedAt: new Date(),
        category: 'разработка',
        tags: ['предоплата']
      });
    }
  } catch (error) {
    console.error('Ошибка инициализации базы данных:', error);
  }
};
