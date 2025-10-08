import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  FolderOpen,
  Calendar,
  Tag,
  Edit,
  Trash2
} from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import { Project, ProjectStatus } from '../../types';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface ProjectListProps {
  onAddProject: () => void;
  onEditProject: (project: Project) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({ onAddProject, onEditProject }) => {
  const { projects, loading, deleteProject } = useProjects();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'planning':
        return 'text-gray-700 bg-gray-100 border-gray-300';
      case 'active':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'on_hold':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'completed':
        return 'text-gray-700 bg-gray-50 border-gray-200';
      case 'cancelled':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: ProjectStatus) => {
    switch (status) {
      case 'planning': return 'Планирование';
      case 'active': return 'Активный';
      case 'on_hold': return 'Приостановлен';
      case 'completed': return 'Завершен';
      case 'cancelled': return 'Отменен';
      default: return 'Неизвестно';
    }
  };

  const filteredProjects = projects
    .filter(project => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          project.name.toLowerCase().includes(searchLower) ||
          project.description?.toLowerCase().includes(searchLower) ||
          project.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      return true;
    })
    .filter(project => {
      if (statusFilter !== 'all') {
        return project.status === statusFilter;
      }
      return true;
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот проект? Все связанные задачи также будут удалены.')) {
      try {
        await deleteProject(projectId);
      } catch (error) {
        console.error('Ошибка удаления проекта:', error);
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
          <h1 className="text-xl sm:text-2xl font-heading drop-shadow-lg" style={{ color: '#c0c0c0' }}>Проекты</h1>
          <p className="text-sm font-accent" style={{ color: '#a0a0a0' }}>
            Всего проектов: {projects.length} | Показано: {filteredProjects.length}
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
            onClick={onAddProject}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Добавить проект
          </button>
        </div>
      </div>

      {/* Поиск */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="🔍 Поиск проектов..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
          />
        </div>
      </div>

      {/* Фильтры */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div>
            <label className="form-label">Статус</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'all')}
              className="form-input"
            >
              <option value="all">Все статусы</option>
              <option value="planning">Планирование</option>
              <option value="active">Активный</option>
              <option value="on_hold">Приостановлен</option>
              <option value="completed">Завершен</option>
              <option value="cancelled">Отменен</option>
            </select>
          </div>
        </div>
      )}

      {/* Список проектов */}
      <div className="space-y-4">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FolderOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">Проектов не найдено</h3>
            <p>Попробуйте изменить фильтры или создать новый проект</p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(80, 80, 80, 0.2)' }}>
                    <FolderOpen className="w-6 h-6" style={{ color: '#b0b0b0' }} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {project.name}
                    </h3>
                    
                    {project.description && (
                      <p className="text-gray-600 mb-3 break-words">
                        {project.description}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {getStatusText(project.status)}
                      </span>
                      
                      {project.startDate && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          Начало: {format(new Date(project.startDate), 'dd MMM yyyy', { locale: ru })}
                        </span>
                      )}
                      
                      {project.endDate && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          Окончание: {format(new Date(project.endDate), 'dd MMM yyyy', { locale: ru })}
                        </span>
                      )}
                      
                      {project.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                          <Tag className="w-3 h-3 inline mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>
                        Создан: {format(new Date(project.createdAt), 'dd MMM yyyy', { locale: ru })}
                      </span>
                      <span>
                        Задач: {project.tasks.length}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEditProject(project)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Редактировать"
                  >
                    <Edit className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    title="Удалить"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
