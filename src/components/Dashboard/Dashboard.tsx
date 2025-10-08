import React, { useEffect, useState } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { useProjects } from '../../hooks/useProjects';
import { usePayments } from '../../hooks/usePayments';
import { DashboardStats as Stats } from '../../types';
import { DashboardStats } from './DashboardStats';
import { QuickActions } from './QuickActions';
import { RecentTasks } from './RecentTasks';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { tasks, loading: tasksLoading } = useTasks();
  const { projects, loading: projectsLoading } = useProjects();
  const { payments, getFinancialStats, loading: paymentsLoading } = usePayments();
  const [stats, setStats] = useState<Stats>({
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    totalProjects: 0,
    activeProjects: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    tasksByStatus: {
      new: 0,
      in_progress: 0,
      review: 0,
      completed: 0,
      cancelled: 0,
      on_hold: 0
    },
    upcomingDeadlines: []
  });

  useEffect(() => {
    if (!tasksLoading && !projectsLoading && !paymentsLoading) {
      const completedTasks = tasks.filter(task => task.status === 'completed').length;
      const overdueTasks = tasks.filter(task => {
        if (!task.dueDate || task.status === 'completed') return false;
        return new Date(task.dueDate) < new Date();
      }).length;
      
      const activeProjects = projects.filter(project => project.status === 'active').length;
      
      const financialStats = getFinancialStats();
      
      const tasksByStatus = tasks.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const upcomingDeadlines = tasks
        .filter(task => {
          if (!task.dueDate || task.status === 'completed') return false;
          const dueDate = new Date(task.dueDate);
          const threeDaysFromNow = new Date();
          threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
          return dueDate <= threeDaysFromNow;
        })
        .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
        .slice(0, 5);

      setStats({
        totalTasks: tasks.length,
        completedTasks,
        overdueTasks,
        totalProjects: projects.length,
        activeProjects,
        monthlyIncome: financialStats.monthlyIncome,
        monthlyExpenses: financialStats.monthlyExpenses,
        tasksByStatus: {
          new: tasksByStatus.new || 0,
          in_progress: tasksByStatus.in_progress || 0,
          review: tasksByStatus.review || 0,
          completed: tasksByStatus.completed || 0,
          cancelled: tasksByStatus.cancelled || 0,
          on_hold: tasksByStatus.on_hold || 0
        },
        upcomingDeadlines
      });
    }
  }, [tasks, projects, payments, tasksLoading, projectsLoading, paymentsLoading, getFinancialStats]);

  const handleQuickAction = (action: string) => {
    onNavigate(action);
  };

  const handleTaskClick = (taskId: string) => {
    if (taskId === 'all') {
      onNavigate('tasks');
    } else {
      // Здесь можно открыть модальное окно с деталями задачи
      console.log('Открыть задачу:', taskId);
    }
  };

  if (tasksLoading || projectsLoading || paymentsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen -m-8 p-8 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #1a1d1f, #292d2f, #1f2224)' }}>
      {/* Анимированный фон */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 space-y-8">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-heading mb-4 drop-shadow-lg" style={{ color: '#c0c0c0' }}>
            Добро пожаловать!
          </h1>
          <p className="text-lg font-accent drop-shadow-lg" style={{ color: '#a0a0a0' }}>Вот обзор ваших задач и проектов</p>
        </div>

        {/* Быстрые действия сверху */}
        <QuickActions onAction={handleQuickAction} />

        {/* Статистика */}
        <DashboardStats stats={stats} onNavigate={onNavigate} />
        
        {/* Задачи и дедлайны */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RecentTasks tasks={tasks} onTaskClick={handleTaskClick} />
          
          {/* Ближайшие дедлайны с glassmorphism */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl p-6" style={{ background: 'linear-gradient(135deg, rgba(41, 45, 47, 0.9), rgba(35, 39, 41, 0.9))' }}>
            {/* Фоновые эффекты */}
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }} />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }} />
            
            <h2 className="relative text-2xl font-heading mb-6 drop-shadow-lg" style={{ color: '#c0c0c0' }}>Ближайшие дедлайны</h2>
            <div className="relative space-y-4">
              {stats.upcomingDeadlines.length === 0 ? (
                <div className="text-center py-8" style={{ color: '#808080' }}>
                  <p>Нет ближайших дедлайнов</p>
                </div>
              ) : (
                stats.upcomingDeadlines.map((task) => (
                  <div 
                    key={task.id} 
                    className="p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]"
                    style={{ 
                      background: 'rgba(41, 45, 47, 0.5)',
                      borderColor: 'rgba(120, 120, 120, 0.2)'
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-accent font-medium" style={{ color: '#c0c0c0' }}>{task.title}</h3>
                      <span className="text-sm px-2 py-1 rounded-lg" style={{ 
                        color: '#b0b0b0',
                        backgroundColor: 'rgba(80, 80, 80, 0.3)'
                      }}>
                        {task.dueDate && new Date(task.dueDate).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: '#a0a0a0' }}>{task.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
