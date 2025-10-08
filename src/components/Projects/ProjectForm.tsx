import React, { useState, useEffect } from 'react';
import { X, FolderOpen, Calendar, Tag } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import { Project, ProjectStatus } from '../../types';

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ 
  isOpen, 
  onClose, 
  project
}) => {
  const { createProject, updateProject } = useProjects();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning' as ProjectStatus,
    startDate: '',
    endDate: '',
    tags: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description || '',
        status: project.status,
        startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
        endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
        tags: project.tags.join(', ')
      });
    } else {
      setFormData({
        name: '',
        description: '',
        status: 'planning',
        startDate: '',
        endDate: '',
        tags: ''
      });
    }
  }, [project]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Название проекта обязательно';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const projectData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        status: formData.status,
        startDate: formData.startDate ? new Date(formData.startDate) : undefined,
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      if (project) {
        await updateProject(project.id, projectData);
      } else {
        await createProject(projectData);
      }
      
      onClose();
    } catch (error) {
      console.error('Ошибка сохранения проекта:', error);
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
            {project ? 'Редактировать проект' : 'Добавить проект'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors flex-shrink-0"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'}
          >
            <X className="w-5 h-5" style={{ color: '#2c2c2e' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Название проекта */}
          <div>
            <label className="form-label">
              Название проекта *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`form-input ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Введите название проекта"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
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
              placeholder="Добавьте описание проекта"
            />
          </div>

          {/* Статус */}
          <div>
            <label className="form-label">
              Статус
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="form-input"
            >
              <option value="planning">Планирование</option>
              <option value="active">Активный</option>
              <option value="on_hold">Приостановлен</option>
              <option value="completed">Завершен</option>
              <option value="cancelled">Отменен</option>
            </select>
          </div>

          {/* Даты */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">
                <Calendar className="w-4 h-4 inline mr-1" />
                Дата начала
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">
                <Calendar className="w-4 h-4 inline mr-1" />
                Дата окончания
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                className="form-input"
              />
            </div>
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
              placeholder="веб-разработка, дизайн, срочно"
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
              {isSubmitting ? 'Сохранение...' : (project ? 'Сохранить' : 'Создать')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
