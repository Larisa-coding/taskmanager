import React, { useState } from 'react';
import { Clock, AlertTriangle, CheckCircle, Circle, ChevronDown, ChevronRight } from 'lucide-react';
import { Task, TaskStatus } from '../../types';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { ru } from 'date-fns/locale';

interface RecentTasksProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
}

export const RecentTasks: React.FC<RecentTasksProps> = ({ tasks, onTaskClick }) => {
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
        return <CheckCircle className="w-4 h-4" style={{ color: '#80c080' }} />;
      case 'in_progress':
        return <Clock className="w-4 h-4" style={{ color: '#80a0c0' }} />;
      case 'review':
        return <AlertTriangle className="w-4 h-4" style={{ color: '#c0c080' }} />;
      default:
        return <Circle className="w-4 h-4" style={{ color: '#808080' }} />;
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-900/30 text-green-300 border-green-500/20';
      case 'in_progress':
        return 'bg-gray-800/30 text-gray-300 border-gray-600/20';
      case 'review':
        return 'bg-yellow-900/30 text-yellow-300 border-yellow-500/20';
      case 'cancelled':
        return 'bg-red-900/30 text-red-300 border-red-500/20';
      case 'on_hold':
        return 'bg-gray-900/30 text-gray-300 border-gray-500/20';
      default:
        return 'bg-gray-900/30 text-gray-300 border-gray-500/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-900/30 text-red-300 border-red-500/20';
      case 'high':
        return 'bg-orange-900/30 text-orange-300 border-orange-500/20';
      case 'medium':
        return 'bg-yellow-900/30 text-yellow-300 border-yellow-500/20';
      case 'low':
        return 'bg-green-900/30 text-green-300 border-green-500/20';
      default:
        return 'bg-gray-900/30 text-gray-300 border-gray-500/20';
    }
  };

  const isOverdue = (dueDate?: Date) => {
    if (!dueDate) return false;
    return isBefore(dueDate, new Date()) && !tasks.find(t => t.dueDate === dueDate)?.completedAt;
  };

  const isDueSoon = (dueDate?: Date) => {
    if (!dueDate) return false;
    const threeDaysFromNow = addDays(new Date(), 3);
    return isAfter(dueDate, new Date()) && isBefore(dueDate, threeDaysFromNow);
  };

  const recentTasks = tasks
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl p-6" style={{ background: 'linear-gradient(135deg, rgba(41, 45, 47, 0.9), rgba(35, 39, 41, 0.9))' }}>
      {/* Фоновые эффекты */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }} />
      <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }} />
      
      <div className="relative flex items-center justify-between mb-6">
        <h2 className="text-2xl font-heading drop-shadow-lg" style={{ color: '#c0c0c0' }}>Недавние задачи</h2>
        <button 
          onClick={() => onTaskClick('all')}
          className="btn-sm"
        >
          Посмотреть все
        </button>
      </div>
      
      <div className="relative space-y-2">
        {recentTasks.length === 0 ? (
          <div className="text-center py-8" style={{ color: '#808080' }}>
            <CheckCircle className="w-12 h-12 mx-auto mb-3" style={{ color: '#606060' }} />
            <p>Нет задач</p>
          </div>
        ) : (
          recentTasks.map((task) => {
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
                      {/* Статус и приоритет */}
                      <div className="flex items-center space-x-2 flex-wrap gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium backdrop-blur-sm border ${getStatusColor(task.status)}`}>
                          {task.status === 'completed' ? 'Выполнено' :
                           task.status === 'in_progress' ? 'В работе' :
                           task.status === 'review' ? 'На согласовании' :
                           task.status === 'cancelled' ? 'Отменено' :
                           task.status === 'on_hold' ? 'Приостановлено' : 'Новая'}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium backdrop-blur-sm border ${getPriorityColor(task.priority)}`}>
                          {task.priority === 'urgent' ? 'Срочно' :
                           task.priority === 'high' ? 'Высокий' :
                           task.priority === 'medium' ? 'Средний' : 'Низкий'}
                        </span>
                      </div>

                      {task.description && (
                        <p className="text-xs sm:text-sm break-words" style={{ color: '#a0a0a0' }}>{task.description}</p>
                      )}
                      
                      <div className="flex items-center justify-between text-sm flex-wrap gap-2" style={{ color: '#909090' }}>
                        <div className="flex items-center space-x-4">
                          {task.dueDate && (
                            <div className={`flex items-center space-x-1 ${
                              isOverdue(task.dueDate) ? 'text-red-400' :
                              isDueSoon(task.dueDate) ? 'text-yellow-400' : 'text-gray-400'
                            }`}>
                              <Clock className="w-4 h-4" />
                              <span>
                                {isOverdue(task.dueDate) ? 'Просрочено' :
                                 isDueSoon(task.dueDate) ? 'Скоро дедлайн' : ''}
                                {' '}
                                {format(new Date(task.dueDate), 'dd MMM', { locale: ru })}
                              </span>
                            </div>
                          )}
                          
                          {task.tags.length > 0 && (
                            <div className="flex items-center space-x-1">
                              <span className="text-xs bg-white/10 px-2 py-1 rounded-lg backdrop-blur-sm">
                                {task.tags[0]}
                                {task.tags.length > 1 && ` +${task.tags.length - 1}`}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="text-xs" style={{ color: '#808080' }}>
                          {format(new Date(task.updatedAt), 'dd MMM HH:mm', { locale: ru })}
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
    </div>
  );
};
