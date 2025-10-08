import React from 'react';
import { 
  Plus, 
  CheckSquare, 
  FolderOpen, 
  Users, 
  CreditCard, 
  FileText,
  Calendar,
  Upload
} from 'lucide-react';

interface QuickActionsProps {
  onAction: (action: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onAction }) => {
  const actions = [
    {
      id: 'add-task',
      label: 'Добавить задачу',
      icon: Plus,
      description: 'Создать новую задачу'
    },
    {
      id: 'add-project',
      label: 'Добавить проект',
      icon: FolderOpen,
      description: 'Создать новый проект'
    },
    {
      id: 'add-client',
      label: 'Добавить клиента',
      icon: Users,
      description: 'Добавить нового клиента'
    },
    {
      id: 'add-payment',
      label: 'Добавить оплату',
      icon: CreditCard,
      description: 'Записать доход или расход'
    },
    {
      id: 'add-note',
      label: 'Добавить заметку',
      icon: FileText,
      description: 'Записать идею или мысль'
    },
    {
      id: 'view-calendar',
      label: 'Календарь',
      icon: Calendar,
      description: 'Посмотреть дедлайны'
    },
    {
      id: 'upload-file',
      label: 'Загрузить файл',
      icon: Upload,
      description: 'Прикрепить документ'
    },
    {
      id: 'view-tasks',
      label: 'Мои задачи',
      icon: CheckSquare,
      description: 'Посмотреть все задачи'
    }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-3xl font-heading mb-6 drop-shadow-lg" style={{ color: '#c0c0c0' }}>Быстрые действия</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => onAction(action.id)}
              className="group relative overflow-hidden rounded-2xl p-[1px] transition-all duration-500 hover:scale-105 hover:-translate-y-1"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              {/* Градиентная обводка */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-400/50 via-gray-500/30 to-gray-600/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              
              {/* Glassmorphism карточка */}
              <div className="relative backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(41, 45, 47, 0.9), rgba(35, 39, 41, 0.9))' }}>
                {/* Светящийся эффект при наведении */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Анимированные частицы на фоне */}
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl transition-opacity duration-500" style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', opacity: 0.5 }} />
                <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full blur-2xl transition-opacity duration-500" style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', opacity: 0.5 }} />
                
                {/* Контент */}
                <div className="relative flex flex-col items-center text-center z-10">
                  {/* Иконка с анимацией */}
                  <div className="mb-3 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                    <Icon className="w-8 h-8 drop-shadow-lg" style={{ color: '#c0c0c0' }} />
                  </div>
                  
                  {/* Текст */}
                  <h3 className="font-accent text-sm mb-1 drop-shadow-lg transition-colors duration-300" style={{ color: '#c0c0c0' }}>
                    {action.label}
                  </h3>
                  <p className="text-xs font-accent opacity-80 group-hover:opacity-100 transition-opacity duration-300" style={{ color: '#a0a0a0' }}>
                    {action.description}
                  </p>
                </div>

                {/* Shimmer эффект */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Добавляем CSS анимации */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
