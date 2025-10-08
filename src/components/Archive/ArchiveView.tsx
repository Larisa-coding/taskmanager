import React, { useState, useMemo } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { useProjects } from '../../hooks/useProjects';
import { useClients } from '../../hooks/useClients';
import { useNotes } from '../../hooks/useNotes';
import { usePayments } from '../../hooks/usePayments';
import { 
  Archive, 
  Trash2, 
  RotateCcw, 
  Search, 
  Filter,
  Calendar,
  User,
  FolderOpen,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const ArchiveView: React.FC = () => {
  const { tasks, updateTaskStatus, deleteTask } = useTasks();
  const { projects, updateProject, deleteProject } = useProjects();
  const { clients, updateClient, deleteClient } = useClients();
  const { notes, updateNote, deleteNote } = useNotes();
  const { payments, updatePayment, deletePayment } = usePayments();
  
  const [activeTab, setActiveTab] = useState<'tasks' | 'projects' | 'clients' | 'notes' | 'payments'>('tasks');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Фильтруем данные для архива
  const archivedTasks = useMemo(() => {
    return tasks.filter(task => 
      task.status === 'completed' || task.status === 'cancelled'
    );
  }, [tasks]);

  const archivedProjects = useMemo(() => {
    return projects.filter(project => 
      project.status === 'completed' || project.status === 'cancelled'
    );
  }, [projects]);

  const archivedClients = useMemo(() => {
    return clients.filter(client => client.archived);
  }, [clients]);

  const archivedNotes = useMemo(() => {
    return notes.filter(note => note.archived);
  }, [notes]);

  const archivedPayments = useMemo(() => {
    return payments.filter(payment => payment.archived);
  }, [payments]);

  // Фильтрация по поиску и статусу
  const filteredTasks = useMemo(() => {
    let filtered = archivedTasks;

    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    return filtered;
  }, [archivedTasks, searchQuery, statusFilter]);

  const filteredProjects = useMemo(() => {
    let filtered = archivedProjects;

    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    return filtered;
  }, [archivedProjects, searchQuery, statusFilter]);

  const filteredClients = useMemo(() => {
    let filtered = archivedClients;

    if (searchQuery) {
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.company?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [archivedClients, searchQuery]);

  const filteredNotes = useMemo(() => {
    let filtered = archivedNotes;

    if (searchQuery) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(note => note.type === statusFilter);
    }

    return filtered;
  }, [archivedNotes, searchQuery, statusFilter]);

  const filteredPayments = useMemo(() => {
    let filtered = archivedPayments;

    if (searchQuery) {
      filtered = filtered.filter(payment =>
        payment.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.type === statusFilter);
    }

    return filtered;
  }, [archivedPayments, searchQuery, statusFilter]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'completed': 'bg-green-900/30 text-green-300 border-green-500/20',
      'cancelled': 'bg-red-900/30 text-red-300 border-red-500/20',
      'on_hold': 'bg-orange-900/30 text-orange-300 border-orange-500/20'
    };
    return colors[status] || 'bg-gray-900/30 text-gray-300 border-gray-500/20';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'completed': 'Завершено',
      'cancelled': 'Отменено',
      'on_hold': 'Приостановлено'
    };
    return labels[status] || status;
  };

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleRestoreTask = async (taskId: string) => {
    await updateTaskStatus(taskId, 'new');
  };

  const handleRestoreProject = async (projectId: string) => {
    await updateProject(projectId, { status: 'active' });
  };

  const handleRestoreClient = async (clientId: string) => {
    await updateClient(clientId, { archived: false, archivedAt: undefined });
  };

  const handleRestoreNote = async (noteId: string) => {
    await updateNote(noteId, { archived: false, archivedAt: undefined });
  };

  const handleRestorePayment = async (paymentId: string) => {
    await updatePayment(paymentId, { archived: false, archivedAt: undefined });
  };

  const handlePermanentDeleteTask = async (taskId: string) => {
    if (window.confirm('Вы уверены, что хотите навсегда удалить эту задачу?')) {
      await deleteTask(taskId);
    }
  };

  const handlePermanentDeleteProject = async (projectId: string) => {
    if (window.confirm('Вы уверены, что хотите навсегда удалить этот проект?')) {
      await deleteProject(projectId);
    }
  };

  const handlePermanentDeleteClient = async (clientId: string) => {
    if (window.confirm('Вы уверены, что хотите навсегда удалить этого клиента?')) {
      await deleteClient(clientId);
    }
  };

  const handlePermanentDeleteNote = async (noteId: string) => {
    if (window.confirm('Вы уверены, что хотите навсегда удалить эту заметку?')) {
      await deleteNote(noteId);
    }
  };

  const handlePermanentDeletePayment = async (paymentId: string) => {
    if (window.confirm('Вы уверены, что хотите навсегда удалить этот платеж?')) {
      await deletePayment(paymentId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading drop-shadow-lg flex items-center" style={{ color: '#c0c0c0' }}>
          <Archive className="w-6 h-6 mr-2" style={{ color: '#b0b0b0' }} />
          Архив
        </h2>
        <div className="text-sm font-accent" style={{ color: '#a0a0a0' }}>
          {archivedTasks.length} задач, {archivedProjects.length} проектов, {archivedClients.length} клиентов, {archivedNotes.length} заметок, {archivedPayments.length} платежей
        </div>
      </div>

      {/* Табы */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1 p-1 rounded-lg backdrop-blur-sm" style={{ backgroundColor: 'rgba(80, 80, 80, 0.2)', border: '1px solid rgba(120, 120, 120, 0.3)' }}>
        {[
          { key: 'tasks', label: 'Задачи', count: archivedTasks.length },
          { key: 'projects', label: 'Проекты', count: archivedProjects.length },
          { key: 'clients', label: 'Клиенты', count: archivedClients.length },
          { key: 'notes', label: 'Заметки', count: archivedNotes.length },
          { key: 'payments', label: 'Платежи', count: archivedPayments.length }
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`px-2 py-2 rounded-md text-xs sm:text-sm font-accent transition-all duration-300 ${
              activeTab === key
                ? 'backdrop-blur-sm shadow-lg'
                : 'hover:bg-white/5'
            }`}
            style={{
              backgroundColor: activeTab === key ? 'rgba(80, 80, 80, 0.4)' : 'transparent',
              color: activeTab === key ? '#d0d0d0' : '#b0b0b0',
              border: activeTab === key ? '1px solid rgba(120, 120, 120, 0.3)' : 'none'
            }}
          >
            <div className="hidden sm:block">{label}</div>
            <div className="block sm:hidden">{label.charAt(0)}</div>
            <div className="text-xs" style={{ color: activeTab === key ? '#c0c0c0' : '#909090' }}>
              ({count})
            </div>
          </button>
        ))}
      </div>

      {/* Поиск и фильтры */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="🔍 Поиск в архиве..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg backdrop-blur-sm border transition-all duration-300 focus:ring-2 focus:ring-gray-500/50 focus:border-transparent"
            style={{
              backgroundColor: 'rgba(80, 80, 80, 0.2)',
              borderColor: 'rgba(120, 120, 120, 0.3)',
              color: '#c0c0c0'
            }}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4" style={{ color: '#808080' }} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg backdrop-blur-sm border transition-all duration-300 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
            style={{
              backgroundColor: 'rgba(80, 80, 80, 0.2)',
              borderColor: 'rgba(120, 120, 120, 0.3)',
              color: '#c0c0c0'
            }}
          >
            <option value="all" style={{ backgroundColor: '#292d2f', color: '#c0c0c0' }}>Все статусы</option>
            <option value="completed" style={{ backgroundColor: '#292d2f', color: '#c0c0c0' }}>Завершено</option>
            <option value="cancelled" style={{ backgroundColor: '#292d2f', color: '#c0c0c0' }}>Отменено</option>
            <option value="on_hold" style={{ backgroundColor: '#292d2f', color: '#c0c0c0' }}>Приостановлено</option>
          </select>
        </div>
      </div>

      {/* Список задач */}
      {activeTab === 'tasks' && (
        <div className="space-y-2">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <Archive className="w-12 h-12 mx-auto mb-4" style={{ color: '#606060' }} />
              <h3 className="text-lg font-heading mb-2" style={{ color: '#c0c0c0' }}>
                {searchQuery || statusFilter !== 'all' ? 'Ничего не найдено' : 'Архив пуст'}
              </h3>
              <p style={{ color: '#a0a0a0' }}>
                {searchQuery || statusFilter !== 'all' 
                  ? 'Попробуйте изменить параметры поиска'
                  : 'Завершенные и отмененные задачи появятся здесь'
                }
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => {
              const isExpanded = expandedItems.has(task.id);
              return (
                <div key={task.id} className="backdrop-blur-sm border rounded-lg transition-all duration-300 hover:scale-[1.01]" style={{ 
                  backgroundColor: 'rgba(80, 80, 80, 0.1)',
                  borderColor: 'rgba(120, 120, 120, 0.2)'
                }}>
                  {/* Компактная строка */}
                  <div 
                    className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => toggleExpanded(task.id)}
                  >
                    <button className="p-1 hover:bg-white/10 rounded transition-colors flex-shrink-0">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" style={{ color: '#b0b0b0' }} />
                      ) : (
                        <ChevronRight className="w-4 h-4" style={{ color: '#b0b0b0' }} />
                      )}
                    </button>
                    
                    <h3 className="font-accent break-words flex-1 text-sm sm:text-base" style={{ color: '#c0c0c0' }}>{task.title}</h3>
                  </div>

                  {/* Развернутые детали */}
                  {isExpanded && (
                    <div className="px-3 pb-3 border-t" style={{ borderColor: 'rgba(120, 120, 120, 0.1)' }}>
                      <div className="pt-3 space-y-3">
                        {/* Статус */}
                        <div className="flex items-center space-x-2">
                          <span className="text-sm" style={{ color: '#909090' }}>Статус:</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium backdrop-blur-sm ${getStatusColor(task.status)}`}>
                            {getStatusLabel(task.status)}
                          </span>
                        </div>

                        {task.description && (
                          <p className="text-xs sm:text-sm break-words" style={{ color: '#a0a0a0' }}>{task.description}</p>
                        )}
                        
                        <div className="flex items-center justify-between flex-wrap gap-3">
                          <div className="flex items-center space-x-4 text-sm" style={{ color: '#909090' }}>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              Создано: {format(new Date(task.createdAt), 'dd MMM yyyy', { locale: ru })}
                            </div>
                            {task.completedAt && (
                              <div className="flex items-center">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Завершено: {format(new Date(task.completedAt), 'dd MMM yyyy', { locale: ru })}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRestoreTask(task.id);
                              }}
                              className="btn-sm flex items-center space-x-1"
                              title="Восстановить"
                            >
                              <RotateCcw className="w-4 h-4" />
                              <span>Восстановить</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePermanentDeleteTask(task.id);
                              }}
                              className="btn-danger flex items-center space-x-1"
                              title="Удалить навсегда"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Удалить</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Список проектов */}
      {activeTab === 'projects' && (
        <div className="space-y-2">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="w-12 h-12 mx-auto mb-4" style={{ color: '#606060' }} />
              <h3 className="text-lg font-heading mb-2" style={{ color: '#c0c0c0' }}>
                {searchQuery || statusFilter !== 'all' ? 'Ничего не найдено' : 'Архив пуст'}
              </h3>
              <p style={{ color: '#a0a0a0' }}>
                {searchQuery || statusFilter !== 'all' 
                  ? 'Попробуйте изменить параметры поиска'
                  : 'Завершенные и отмененные проекты появятся здесь'
                }
              </p>
            </div>
          ) : (
            filteredProjects.map((project) => {
              const isExpanded = expandedItems.has(project.id);
              return (
                <div key={project.id} className="backdrop-blur-sm border rounded-lg transition-all duration-300 hover:scale-[1.01]" style={{ 
                  backgroundColor: 'rgba(80, 80, 80, 0.1)',
                  borderColor: 'rgba(120, 120, 120, 0.2)'
                }}>
                  {/* Компактная строка */}
                  <div 
                    className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => toggleExpanded(project.id)}
                  >
                    <button className="p-1 hover:bg-white/10 rounded transition-colors flex-shrink-0">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" style={{ color: '#b0b0b0' }} />
                      ) : (
                        <ChevronRight className="w-4 h-4" style={{ color: '#b0b0b0' }} />
                      )}
                    </button>
                    
                    <FolderOpen className="w-4 h-4 flex-shrink-0" style={{ color: '#b0b0b0' }} />
                    <h3 className="font-accent break-words flex-1 text-sm sm:text-base" style={{ color: '#c0c0c0' }}>{project.name}</h3>
                  </div>

                  {/* Развернутые детали */}
                  {isExpanded && (
                    <div className="px-3 pb-3 border-t" style={{ borderColor: 'rgba(120, 120, 120, 0.1)' }}>
                      <div className="pt-3 space-y-3">
                        {/* Статус */}
                        <div className="flex items-center space-x-2">
                          <span className="text-sm" style={{ color: '#909090' }}>Статус:</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium backdrop-blur-sm ${getStatusColor(project.status)}`}>
                            {getStatusLabel(project.status)}
                          </span>
                        </div>

                        {project.description && (
                          <p className="text-xs sm:text-sm break-words" style={{ color: '#a0a0a0' }}>{project.description}</p>
                        )}
                        
                        <div className="flex items-center justify-between flex-wrap gap-3">
                          <div className="flex items-center space-x-4 text-sm" style={{ color: '#909090' }}>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              Создан: {format(new Date(project.createdAt), 'dd MMM yyyy', { locale: ru })}
                            </div>
                            {project.completedAt && (
                              <div className="flex items-center">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Завершен: {format(new Date(project.completedAt), 'dd MMM yyyy', { locale: ru })}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRestoreProject(project.id);
                              }}
                              className="btn-sm flex items-center space-x-1"
                              title="Восстановить"
                            >
                              <RotateCcw className="w-4 h-4" />
                              <span>Восстановить</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePermanentDeleteProject(project.id);
                              }}
                              className="btn-danger flex items-center space-x-1"
                              title="Удалить навсегда"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Удалить</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Список клиентов */}
      {activeTab === 'clients' && (
        <div className="space-y-2">
          {filteredClients.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-12 h-12 mx-auto mb-4" style={{ color: '#606060' }} />
              <h3 className="text-lg font-heading mb-2" style={{ color: '#c0c0c0' }}>
                {searchQuery ? 'Ничего не найдено' : 'Архив пуст'}
              </h3>
              <p style={{ color: '#a0a0a0' }}>
                {searchQuery ? 'Попробуйте изменить параметры поиска' : 'Архивированные клиенты появятся здесь'}
              </p>
            </div>
          ) : (
            filteredClients.map((client) => {
              const isExpanded = expandedItems.has(client.id);
              return (
                <div key={client.id} className="backdrop-blur-sm border rounded-lg transition-all duration-300 hover:scale-[1.01]" style={{ 
                  backgroundColor: 'rgba(80, 80, 80, 0.1)',
                  borderColor: 'rgba(120, 120, 120, 0.2)'
                }}>
                  <div 
                    className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => toggleExpanded(client.id)}
                  >
                    <button className="p-1 hover:bg-white/10 rounded transition-colors flex-shrink-0">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" style={{ color: '#b0b0b0' }} />
                      ) : (
                        <ChevronRight className="w-4 h-4" style={{ color: '#b0b0b0' }} />
                      )}
                    </button>
                    
                    <User className="w-4 h-4 flex-shrink-0" style={{ color: '#b0b0b0' }} />
                    <h3 className="font-accent break-words flex-1 text-sm sm:text-base" style={{ color: '#c0c0c0' }}>{client.name}</h3>
                  </div>

                  {isExpanded && (
                    <div className="px-3 pb-3 border-t" style={{ borderColor: 'rgba(120, 120, 120, 0.1)' }}>
                      <div className="pt-3 space-y-3">
                        {client.email && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm" style={{ color: '#909090' }}>Email:</span>
                            <span className="text-sm" style={{ color: '#a0a0a0' }}>{client.email}</span>
                          </div>
                        )}
                        {client.company && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm" style={{ color: '#909090' }}>Компания:</span>
                            <span className="text-sm" style={{ color: '#a0a0a0' }}>{client.company}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between flex-wrap gap-3">
                          <div className="flex items-center space-x-4 text-sm" style={{ color: '#909090' }}>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              Создан: {format(new Date(client.createdAt), 'dd MMM yyyy', { locale: ru })}
                            </div>
                            {client.archivedAt && (
                              <div className="flex items-center">
                                <Archive className="w-4 h-4 mr-1" />
                                Архивирован: {format(new Date(client.archivedAt), 'dd MMM yyyy', { locale: ru })}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRestoreClient(client.id);
                              }}
                              className="btn-sm flex items-center space-x-1"
                              title="Восстановить"
                            >
                              <RotateCcw className="w-4 h-4" />
                              <span>Восстановить</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePermanentDeleteClient(client.id);
                              }}
                              className="btn-danger flex items-center space-x-1"
                              title="Удалить навсегда"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Удалить</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Список заметок */}
      {activeTab === 'notes' && (
        <div className="space-y-2">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-12">
              <Archive className="w-12 h-12 mx-auto mb-4" style={{ color: '#606060' }} />
              <h3 className="text-lg font-heading mb-2" style={{ color: '#c0c0c0' }}>
                {searchQuery || statusFilter !== 'all' ? 'Ничего не найдено' : 'Архив пуст'}
              </h3>
              <p style={{ color: '#a0a0a0' }}>
                {searchQuery || statusFilter !== 'all' ? 'Попробуйте изменить параметры поиска' : 'Архивированные заметки появятся здесь'}
              </p>
            </div>
          ) : (
            filteredNotes.map((note) => {
              const isExpanded = expandedItems.has(note.id);
              return (
                <div key={note.id} className="backdrop-blur-sm border rounded-lg transition-all duration-300 hover:scale-[1.01]" style={{ 
                  backgroundColor: 'rgba(80, 80, 80, 0.1)',
                  borderColor: 'rgba(120, 120, 120, 0.2)'
                }}>
                  <div 
                    className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => toggleExpanded(note.id)}
                  >
                    <button className="p-1 hover:bg-white/10 rounded transition-colors flex-shrink-0">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" style={{ color: '#b0b0b0' }} />
                      ) : (
                        <ChevronRight className="w-4 h-4" style={{ color: '#b0b0b0' }} />
                      )}
                    </button>
                    
                    <div 
                      className="w-4 h-4 rounded flex-shrink-0" 
                      style={{ backgroundColor: note.color || '#808080' }}
                    />
                    <h3 className="font-accent break-words flex-1 text-sm sm:text-base" style={{ color: '#c0c0c0' }}>{note.title}</h3>
                  </div>

                  {isExpanded && (
                    <div className="px-3 pb-3 border-t" style={{ borderColor: 'rgba(120, 120, 120, 0.1)' }}>
                      <div className="pt-3 space-y-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm" style={{ color: '#909090' }}>Тип:</span>
                          <span className="text-sm" style={{ color: '#a0a0a0' }}>{note.type}</span>
                        </div>
                        <p className="text-xs sm:text-sm break-words" style={{ color: '#a0a0a0' }}>{note.content}</p>
                        
                        <div className="flex items-center justify-between flex-wrap gap-3">
                          <div className="flex items-center space-x-4 text-sm" style={{ color: '#909090' }}>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              Создана: {format(new Date(note.createdAt), 'dd MMM yyyy', { locale: ru })}
                            </div>
                            {note.archivedAt && (
                              <div className="flex items-center">
                                <Archive className="w-4 h-4 mr-1" />
                                Архивирована: {format(new Date(note.archivedAt), 'dd MMM yyyy', { locale: ru })}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRestoreNote(note.id);
                              }}
                              className="btn-sm flex items-center space-x-1"
                              title="Восстановить"
                            >
                              <RotateCcw className="w-4 h-4" />
                              <span>Восстановить</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePermanentDeleteNote(note.id);
                              }}
                              className="btn-danger flex items-center space-x-1"
                              title="Удалить навсегда"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Удалить</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Список платежей */}
      {activeTab === 'payments' && (
        <div className="space-y-2">
          {filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <Archive className="w-12 h-12 mx-auto mb-4" style={{ color: '#606060' }} />
              <h3 className="text-lg font-heading mb-2" style={{ color: '#c0c0c0' }}>
                {searchQuery || statusFilter !== 'all' ? 'Ничего не найдено' : 'Архив пуст'}
              </h3>
              <p style={{ color: '#a0a0a0' }}>
                {searchQuery || statusFilter !== 'all' ? 'Попробуйте изменить параметры поиска' : 'Архивированные платежи появятся здесь'}
              </p>
            </div>
          ) : (
            filteredPayments.map((payment) => {
              const isExpanded = expandedItems.has(payment.id);
              return (
                <div key={payment.id} className="backdrop-blur-sm border rounded-lg transition-all duration-300 hover:scale-[1.01]" style={{ 
                  backgroundColor: 'rgba(80, 80, 80, 0.1)',
                  borderColor: 'rgba(120, 120, 120, 0.2)'
                }}>
                  <div 
                    className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => toggleExpanded(payment.id)}
                  >
                    <button className="p-1 hover:bg-white/10 rounded transition-colors flex-shrink-0">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" style={{ color: '#b0b0b0' }} />
                      ) : (
                        <ChevronRight className="w-4 h-4" style={{ color: '#b0b0b0' }} />
                      )}
                    </button>
                    
                    <div className={`w-4 h-4 rounded-full flex-shrink-0 ${payment.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <h3 className="font-accent break-words flex-1 text-sm sm:text-base" style={{ color: '#c0c0c0' }}>
                      {payment.description}
                    </h3>
                    <span className="text-sm font-medium" style={{ color: payment.type === 'income' ? '#80c080' : '#c08080' }}>
                      {payment.type === 'income' ? '+' : '-'}{payment.amount.toLocaleString()} ₽
                    </span>
                  </div>

                  {isExpanded && (
                    <div className="px-3 pb-3 border-t" style={{ borderColor: 'rgba(120, 120, 120, 0.1)' }}>
                      <div className="pt-3 space-y-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm" style={{ color: '#909090' }}>Тип:</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${payment.type === 'income' ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'}`}>
                            {payment.type === 'income' ? 'Доход' : 'Расход'}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between flex-wrap gap-3">
                          <div className="flex items-center space-x-4 text-sm" style={{ color: '#909090' }}>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              Создан: {format(new Date(payment.createdAt), 'dd MMM yyyy', { locale: ru })}
                            </div>
                            {payment.archivedAt && (
                              <div className="flex items-center">
                                <Archive className="w-4 h-4 mr-1" />
                                Архивирован: {format(new Date(payment.archivedAt), 'dd MMM yyyy', { locale: ru })}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRestorePayment(payment.id);
                              }}
                              className="btn-sm flex items-center space-x-1"
                              title="Восстановить"
                            >
                              <RotateCcw className="w-4 h-4" />
                              <span>Восстановить</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePermanentDeletePayment(payment.id);
                              }}
                              className="btn-danger flex items-center space-x-1"
                              title="Удалить навсегда"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Удалить</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default ArchiveView;
