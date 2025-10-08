import React from 'react';
import { 
  Home, 
  Plus, 
  CheckSquare, 
  FolderOpen, 
  Users, 
  Calendar, 
  CreditCard, 
  FileText, 
  Archive,
  Upload,
  BarChart3,
  Settings
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Главная', icon: Home },
  { id: 'add-task', label: 'Добавить задачу', icon: Plus },
  { id: 'add-project', label: 'Добавить проект', icon: Plus },
  { id: 'tasks', label: 'Мои задачи', icon: CheckSquare },
  { id: 'projects', label: 'Проекты', icon: FolderOpen },
  { id: 'clients', label: 'Клиенты', icon: Users },
  { id: 'calendar', label: 'Календарь', icon: Calendar },
  { id: 'notes', label: 'Заметки', icon: FileText },
  { id: 'archive', label: 'Архив', icon: Archive },
  { id: 'files', label: 'Файлы', icon: Upload },
  { id: 'analytics', label: 'Аналитика', icon: BarChart3 },
  { id: 'settings', label: 'Настройки', icon: Settings }
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, currentPage, onNavigate }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`
          fixed top-0 left-0 h-full w-80 shadow-lg transform transition-transform duration-300 ease-in-out z-50 backdrop-blur-xl
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:shadow-none lg:w-64
        `}
        style={{ 
          background: 'linear-gradient(135deg, rgba(41, 45, 47, 0.95), rgba(35, 39, 41, 0.95))',
          borderRight: '1px solid rgba(120, 120, 120, 0.3)'
        }}
      >
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-lg"
              style={{ 
                background: 'linear-gradient(135deg, rgba(41, 45, 47, 0.9), rgba(35, 39, 41, 0.9))',
                border: '2px solid rgba(120, 120, 120, 0.4)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}
            >
              <CheckSquare className="w-7 h-7" style={{ color: '#d0d0d0' }} />
            </div>
            <h2 className="text-xl font-display" style={{ color: '#c0c0c0' }}>TaskManager Pro</h2>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onClose();
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: isActive ? 'rgba(80, 80, 80, 0.3)' : 'transparent',
                    borderRight: isActive ? '3px solid #c0c0c0' : 'none',
                    color: isActive ? '#d0d0d0' : '#b0b0b0'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'rgba(80, 80, 80, 0.1)';
                      e.currentTarget.style.color = '#c0c0c0';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#b0b0b0';
                    }
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-accent font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};
