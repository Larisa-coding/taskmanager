import React, { useState, useEffect } from 'react';
import { X, Calendar, Tag } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { Task, Priority, TaskStatus } from '../../types';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
}

export const TaskForm: React.FC<TaskFormProps> = ({ 
  isOpen, 
  onClose, 
  task
}) => {
  const { createTask, updateTask } = useTasks();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'new' as TaskStatus,
    priority: 'medium' as Priority,
    dueDate: '',
    tags: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        tags: task.tags.join(', ')
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'new',
        priority: 'medium',
        dueDate: '',
        tags: ''
      });
    }
  }, [task]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Название задачи обязательно';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        comments: []
      };

      if (task) {
        await updateTask(task.id, taskData);
      } else {
        await createTask(taskData);
      }
      
      onClose();
    } catch (error) {
      console.error('Ошибка сохранения задачи:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="rounded-xl shadow-xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#f5f5f7' }}>
        <div className="flex items-center justify-between p-4 sm:p-6 border-b" style={{ borderColor: '#e0e0e0' }}>
          <h2 className="text-base sm:text-xl font-heading break-words pr-2" style={{ color: '#2c2c2e' }}>
            {task ? 'Редактировать задачу' : 'Добавить задачу'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors flex-shrink-0"
            style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'}
          >
            <X className="w-5 h-5" style={{ color: '#2c2c2e' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Название задачи */}
          <div>
            <label className="form-label">
              Название задачи *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={`form-input ${errors.title ? 'border-red-500' : ''}`}
              placeholder="Введите название задачи"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Описание */}
          <div>
            <label className="form-label">
              Описание
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="form-input h-24 resize-none"
              placeholder="Добавьте описание задачи"
            />
          </div>

          {/* Дедлайн */}
          <div>
            <label className="form-label">
              <Calendar className="w-4 h-4 inline mr-1" />
              Дедлайн (необязательно)
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              className="form-input"
            />
          </div>

          {/* Теги */}
          <div>
            <label className="form-label">
              <Tag className="w-4 h-4 inline mr-1" />
              Теги (необязательно)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => handleChange('tags', e.target.value)}
              className="form-input"
              placeholder="дизайн, срочно, важное"
            />
            <p className="text-xs text-gray-500 mt-1">
              Разделяйте теги запятыми
            </p>
          </div>

          {/* Кнопки */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Сохранение...' : (task ? 'Сохранить' : 'Создать')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
