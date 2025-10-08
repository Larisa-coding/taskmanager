import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Circle,
  Calendar,
  Tag,
  ChevronDown,
  ChevronRight,
  Trash2,
  Check
} from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { Task, TaskStatus, Priority, FilterOptions } from '../../types';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { ru } from 'date-fns/locale';

interface TaskListProps {
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ onAddTask, onEditTask }) => {
  const { tasks, loading, updateTaskStatus, deleteTask } = useTasks();
  
  const [filters, setFilters] = useState<FilterOptions>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'createdAt' | 'dueDate' | 'priority' | 'status'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  const toggleExpanded = (taskId: string) => {
    setExpandedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-4 h-4" style={{ color: '#808080' }} />;
      case 'review':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'in_progress':
        return 'text-gray-700 bg-gray-100 border-gray-300';
      case 'review':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'cancelled':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'on_hold':
        return 'text-gray-700 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: TaskStatus) => {
    switch (status) {
      case 'completed': return 'Выполнено';
      case 'in_progress': return 'В работе';
      case 'review': return 'На согласовании';
      case 'cancelled': return 'Отменено';
      case 'on_hold': return 'Приостановлено';
      default: return 'Новая';
    }
  };

  const getPriorityText = (priority: Priority) => {
    switch (priority) {
      case 'urgent': return 'Срочно';
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
      default: return 'Средний';
    }
  };

  const isOverdue = (dueDate?: Date) => {
    if (!dueDate) return false;
    return isBefore(dueDate, new Date());
  };

  const isDueSoon = (dueDate?: Date) => {
    if (!dueDate) return false;
    const threeDaysFromNow = addDays(new Date(), 3);
    return isAfter(dueDate, new Date()) && isBefore(dueDate, threeDaysFromNow);
  };

  const filteredTasks = tasks
    .filter(task => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          task.title.toLowerCase().includes(searchLower) ||
          task.description?.toLowerCase().includes(searchLower) ||
          task.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      return true;
    })
    .filter(task => {
      if (filters.status && filters.status.length > 0) {
        return filters.status.includes(task.status);
      }
      return true;
    })
    .filter(task => {
      if (filters.priority && filters.priority.length > 0) {
        return filters.priority.includes(task.priority);
      }
      return true;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'dueDate':
          aValue = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          bValue = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          break;
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          break;
        case 'status':
          const statusOrder = { new: 1, in_progress: 2, review: 3, completed: 4, cancelled: 5, on_hold: 6 };
          aValue = statusOrder[a.status as keyof typeof statusOrder] || 0;
          bValue = statusOrder[b.status as keyof typeof statusOrder] || 0;
          break;
        default:
          return 0;
      }
      
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (error) {
      console.error('Ошибка обновления статуса:', error);
    }
  };

  const handleToggleComplete = async (taskId: string, currentStatus: TaskStatus) => {
    const newStatus = currentStatus === 'completed' ? 'new' : 'completed';
    await handleStatusChange(taskId, newStatus);
  };

  const handleDeleteTask = async (taskId: string, taskTitle: string) => {
    if (window.confirm(`Вы уверены, что хотите удалить задачу "${taskTitle}"?`)) {
      try {
        await deleteTask(taskId);
      } catch (error) {
        console.error('Ошибка удаления задачи:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#c0c0c0' }}></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок и кнопки */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading drop-shadow-lg" style={{ color: '#c0c0c0' }}>Мои задачи</h1>
          <p className="text-sm font-accent" style={{ color: '#a0a0a0' }}>
            Всего задач: {tasks.length} | Показано: {filteredTasks.length}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary"
          >
            <Filter className="w-4 h-4 mr-2" />
            Фильтры
          </button>
          <button
            onClick={onAddTask}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Добавить задачу
          </button>
        </div>
      </div>

      {/* Поиск и сортировка */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="🔍 Поиск задач..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="form-input"
          >
            <option value="createdAt">По дате создания</option>
            <option value="dueDate">По дедлайну</option>
            <option value="priority">По приоритету</option>
            <option value="status">По статусу</option>
          </select>
          
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="btn-secondary"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Фильтры */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Статус</label>
              <div className="space-y-2">
                {['new', 'in_progress', 'review', 'completed', 'cancelled', 'on_hold'].map(status => (
                  <label key={status} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.status?.includes(status as TaskStatus) || false}
                      onChange={(e) => {
                        const currentStatus = filters.status || [];
                        if (e.target.checked) {
                          setFilters({ ...filters, status: [...currentStatus, status as TaskStatus] });
                        } else {
                          setFilters({ ...filters, status: currentStatus.filter(s => s !== status) });
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{getStatusText(status as TaskStatus)}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="form-label">Приоритет</label>
              <div className="space-y-2">
                {['low', 'medium', 'high', 'urgent'].map(priority => (
                  <label key={priority} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.priority?.includes(priority as Priority) || false}
                      onChange={(e) => {
                        const currentPriority = filters.priority || [];
                        if (e.target.checked) {
                          setFilters({ ...filters, priority: [...currentPriority, priority as Priority] });
                        } else {
                          setFilters({ ...filters, priority: currentPriority.filter(p => p !== priority) });
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{getPriorityText(priority as Priority)}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Список задач */}
      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12" style={{ color: '#808080' }}>
            <Circle className="w-16 h-16 mx-auto mb-4" style={{ color: '#606060' }} />
            <h3 className="text-lg font-heading mb-2" style={{ color: '#c0c0c0' }}>Задач не найдено</h3>
            <p style={{ color: '#a0a0a0' }}>Попробуйте изменить фильтры или создать новую задачу</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isExpanded = expandedTasks.has(task.id);
            return (
              <div
                key={task.id}
                className="backdrop-blur-sm border rounded-lg transition-all duration-300 hover:scale-[1.01]"
                style={{
                  backgroundColor: 'rgba(80, 80, 80, 0.1)',
                  borderColor: 'rgba(120, 120, 120, 0.2)'
                }}
              >
                {/* Компактная строка */}
                <div 
                  className="flex items-center space-x-2 p-3 hover:bg-white/5 transition-colors"
                  style={{ minWidth: 0 }}
                >
                  <button 
                    onClick={() => toggleExpanded(task.id)}
                    className="p-1 hover:bg-white/10 rounded transition-colors flex-shrink-0"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" style={{ color: '#b0b0b0' }} />
                    ) : (
                      <ChevronRight className="w-4 h-4" style={{ color: '#b0b0b0' }} />
                    )}
                  </button>
                  
                  <div 
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => toggleExpanded(task.id)}
                  >
                    <h3 className="font-accent break-words text-sm sm:text-base overflow-wrap-anywhere" style={{ color: '#c0c0c0', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                      {task.title}
                    </h3>
                  </div>
                  
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleComplete(task.id, task.status);
                      }}
                      className="p-1.5 hover:bg-green-500/20 rounded-lg transition-colors"
                      title={task.status === 'completed' ? 'Отметить как невыполненную' : 'Отметить как выполненную'}
                    >
                      <Check className="w-4 h-4" style={{ color: task.status === 'completed' ? '#80c080' : '#b0b0b0' }} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditTask(task);
                      }}
                      className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                      title="Редактировать"
                    >
                      <MoreVertical className="w-4 h-4" style={{ color: '#b0b0b0' }} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTask(task.id, task.title);
                      }}
                      className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Удалить"
                    >
                      <Trash2 className="w-4 h-4" style={{ color: '#c08080' }} />
                    </button>
                  </div>
                </div>

                {/* Развернутые детали */}
                {isExpanded && (
                  <div className="px-3 pb-3 border-t" style={{ borderColor: 'rgba(120, 120, 120, 0.1)' }}>
                    <div className="pt-3 space-y-3">
                      {/* Статус и приоритет */}
                      <div className="flex items-center space-x-2 flex-wrap gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium backdrop-blur-sm border ${getStatusColor(task.status)}`}>
                          {getStatusText(task.status)}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium backdrop-blur-sm ${getPriorityColor(task.priority)}`}>
                          {getPriorityText(task.priority)}
                        </span>
                      </div>

                      {task.description && (
                        <p className="text-xs sm:text-sm break-words" style={{ color: '#a0a0a0' }}>{task.description}</p>
                      )}
                      
                      <div className="flex flex-wrap items-center gap-2">
                        {task.dueDate && (
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            isOverdue(task.dueDate) ? 'bg-red-900/30 text-red-300 border border-red-500/20' :
                            isDueSoon(task.dueDate) ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-500/20' :
                            'bg-gray-900/30 text-gray-300 border border-gray-500/20'
                          }`}>
                            <Calendar className="w-3 h-3 inline mr-1" />
                            {format(new Date(task.dueDate), 'dd MMM', { locale: ru })}
                            {isOverdue(task.dueDate) && ' (просрочено)'}
                            {isDueSoon(task.dueDate) && ' (скоро)'}
                          </span>
                        )}
                        
                        {task.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 rounded text-xs font-medium bg-gray-800/30 text-gray-300 border border-gray-600/20">
                            <Tag className="w-3 h-3 inline mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm" style={{ color: '#909090' }}>
                        <span>
                          Обновлено: {format(new Date(task.updatedAt), 'dd MMM HH:mm', { locale: ru })}
                        </span>
                      </div>

                      {/* Чеклист */}
                      {task.checklist && task.checklist.length > 0 && (
                        <div className="pt-3 border-t" style={{ borderColor: 'rgba(120, 120, 120, 0.1)' }}>
                          <div className="space-y-2">
                            {task.checklist.map((item) => (
                              <div key={item.id} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={item.completed}
                                  onChange={() => {
                                    // Здесь можно добавить логику для обновления чек-листа
                                  }}
                                  className="rounded"
                                />
                                <span className={`text-sm ${item.completed ? 'line-through' : ''}`} style={{ color: item.completed ? '#808080' : '#c0c0c0' }}>
                                  {item.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
