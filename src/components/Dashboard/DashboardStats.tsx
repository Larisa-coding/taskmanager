import React from 'react';
import { 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  FolderOpen, 
  TrendingUp, 
  DollarSign,
  Calendar
} from 'lucide-react';
import { DashboardStats as Stats } from '../../types';

interface DashboardStatsProps {
  stats: Stats;
  onNavigate: (page: string) => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, onNavigate }) => {
  const statCards = [
    {
      title: 'Всего задач',
      value: stats.totalTasks,
      icon: CheckSquare,
      color: 'blue',
      change: '+12%',
      link: 'tasks'
    },
    {
      title: 'Выполнено',
      value: stats.completedTasks,
      icon: CheckSquare,
      color: 'green',
      change: '+8%',
      link: 'tasks'
    },
    {
      title: 'Просрочено',
      value: stats.overdueTasks,
      icon: AlertTriangle,
      color: 'red',
      change: '-3%',
      link: 'tasks'
    },
    {
      title: 'Активные проекты',
      value: stats.activeProjects,
      icon: FolderOpen,
      color: 'purple',
      change: '+2',
      link: 'projects'
    },
    {
      title: 'Доход за месяц',
      value: `₽${stats.monthlyIncome.toLocaleString()}`,
      icon: TrendingUp,
      color: 'green',
      change: '+15%',
      link: 'analytics'
    },
    {
      title: 'Расходы за месяц',
      value: `₽${stats.monthlyExpenses.toLocaleString()}`,
      icon: DollarSign,
      color: 'red',
      change: '+5%',
      link: 'analytics'
    }
  ];

  const getColorClasses = (color: string) => {
    // Все используют один и тот же графитовый цвет #292d2f
    return 'border-white/20';
  };

  const getIconColor = (color: string) => {
    // Все иконки одного серого цвета
    return '#b0b0b0';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            onClick={() => onNavigate(stat.link)}
            className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1 cursor-pointer"
          >
            {/* Glassmorphism карточка */}
            <div className={`relative backdrop-blur-xl border ${getColorClasses(stat.color)} shadow-2xl p-6 h-full`} style={{ background: 'linear-gradient(135deg, rgba(41, 45, 47, 0.7), rgba(35, 39, 41, 0.7))' }}>
              {/* Фоновые эффекты */}
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl transition-opacity duration-500" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }} />
              
              <div className="relative flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl backdrop-blur-sm border group-hover:scale-110 transition-transform duration-500" style={{
                  backgroundColor: 'rgba(80, 80, 80, 0.2)',
                  borderColor: 'rgba(120, 120, 120, 0.3)'
                }}>
                  <Icon className="w-6 h-6 drop-shadow-lg" style={{ color: getIconColor(stat.color) }} />
                </div>
                <span className="text-sm font-medium px-3 py-1 rounded-lg backdrop-blur-sm" style={{
                  color: '#b0b0b0',
                  backgroundColor: 'rgba(80, 80, 80, 0.2)'
                }}>{stat.change}</span>
              </div>
              
              <div className="relative">
                <h3 className="text-3xl font-display mb-1 drop-shadow-lg" style={{ color: '#c0c0c0' }}>{stat.value}</h3>
                <p className="text-sm font-accent" style={{ color: '#a0a0a0' }}>{stat.title}</p>
              </div>

              {/* Shimmer эффект */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
