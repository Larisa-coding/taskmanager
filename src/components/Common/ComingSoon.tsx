import React from 'react';
import { 
  Users, 
  CreditCard, 
  Calendar, 
  Upload, 
  Archive, 
  BarChart3,
  Settings,
  FileText
} from 'lucide-react';

interface ComingSoonProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

export const ComingSoon: React.FC<ComingSoonProps> = ({ title, description, icon: Icon }) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md mx-auto">
        <div className="p-6 bg-blue-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <Icon className="w-12 h-12 text-blue-600" />
        </div>
        
        <h1 className="text-3xl font-heading text-gray-900 mb-4">{title}</h1>
        <p className="text-gray-600 mb-8 text-lg">{description}</p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            🚧 Этот раздел находится в разработке. Скоро здесь появится полнофункциональный интерфейс!
          </p>
        </div>
      </div>
    </div>
  );
};

// Предустановленные компоненты для разных разделов
export const ClientsComingSoon = () => (
  <ComingSoon
    title="Клиенты"
    description="Управление базой клиентов и контактной информацией"
    icon={Users}
  />
);

export const PaymentsComingSoon = () => (
  <ComingSoon
    title="Финансы"
    description="Учет доходов, расходов и платежей"
    icon={CreditCard}
  />
);

export const CalendarComingSoon = () => (
  <ComingSoon
    title="Календарь"
    description="Просмотр дедлайнов и планирование задач"
    icon={Calendar}
  />
);

export const FilesComingSoon = () => (
  <ComingSoon
    title="Файлы"
    description="Загрузка и управление файлами"
    icon={Upload}
  />
);

export const ArchiveComingSoon = () => (
  <ComingSoon
    title="Архив"
    description="Завершенные проекты и задачи"
    icon={Archive}
  />
);

export const AnalyticsComingSoon = () => (
  <ComingSoon
    title="Аналитика"
    description="Статистика и отчеты по продуктивности"
    icon={BarChart3}
  />
);

export const SettingsComingSoon = () => (
  <ComingSoon
    title="Настройки"
    description="Персонализация приложения"
    icon={Settings}
  />
);
