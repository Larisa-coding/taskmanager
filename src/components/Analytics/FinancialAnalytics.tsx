import React, { useMemo } from 'react';
import { usePayments } from '../../hooks/usePayments';
import { useTasks } from '../../hooks/useTasks';
import { useProjects } from '../../hooks/useProjects';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const FinancialAnalytics: React.FC = () => {
  const { payments, deletePayment } = usePayments();
  const { tasks } = useTasks();
  const { projects } = useProjects();

  const handleDeletePayment = async (paymentId: string, description: string) => {
    if (window.confirm(`Вы уверены, что хотите удалить операцию "${description}"?`)) {
      try {
        await deletePayment(paymentId);
      } catch (error) {
        console.error('Ошибка удаления платежа:', error);
      }
    }
  };

  const analytics = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Фильтруем платежи за текущий месяц
    const currentMonthPayments = payments.filter(payment => {
      const paymentDate = new Date(payment.createdAt);
      return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
    });

    // Доходы и расходы
    const income = currentMonthPayments
      .filter(p => p.type === 'income')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const expenses = currentMonthPayments
      .filter(p => p.type === 'expense')
      .reduce((sum, p) => sum + p.amount, 0);

    const netIncome = income - expenses;

    // Статистика по задачам
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Задачи по статусам
    const tasksByStatus = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Проекты
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;

    return {
      income,
      expenses,
      netIncome,
      completedTasks,
      totalTasks,
      completionRate,
      tasksByStatus,
      activeProjects,
      completedProjects,
      currentMonthPayments
    };
  }, [payments, tasks, projects]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading drop-shadow-lg" style={{ color: '#c0c0c0' }}>Аналитика</h2>
        <div className="text-sm font-accent" style={{ color: '#a0a0a0' }}>
          {new Date().toLocaleDateString('ru-RU', { 
            month: 'long', 
            year: 'numeric' 
          })}
        </div>
      </div>

      {/* Финансовые карточки */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Доходы */}
        <div className="group relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl p-6 transition-all duration-500 hover:scale-105 hover:-translate-y-1" style={{ background: 'linear-gradient(135deg, rgba(41, 45, 47, 0.9), rgba(35, 39, 41, 0.9))' }}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(80, 200, 80, 0.1)' }} />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-accent mb-1" style={{ color: '#80c080' }}>Доходы</p>
              <p className="text-2xl font-heading drop-shadow-lg" style={{ color: '#c0c0c0' }}>
                {formatCurrency(analytics.income)}
              </p>
            </div>
            <div className="p-3 rounded-xl backdrop-blur-sm" style={{ backgroundColor: 'rgba(80, 200, 80, 0.15)', border: '1px solid rgba(80, 200, 80, 0.3)' }}>
              <TrendingUp className="w-6 h-6" style={{ color: '#80c080' }} />
            </div>
          </div>
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* Расходы */}
        <div className="group relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl p-6 transition-all duration-500 hover:scale-105 hover:-translate-y-1" style={{ background: 'linear-gradient(135deg, rgba(41, 45, 47, 0.9), rgba(35, 39, 41, 0.9))' }}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(200, 80, 80, 0.1)' }} />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-accent mb-1" style={{ color: '#c08080' }}>Расходы</p>
              <p className="text-2xl font-heading drop-shadow-lg" style={{ color: '#c0c0c0' }}>
                {formatCurrency(analytics.expenses)}
              </p>
            </div>
            <div className="p-3 rounded-xl backdrop-blur-sm" style={{ backgroundColor: 'rgba(200, 80, 80, 0.15)', border: '1px solid rgba(200, 80, 80, 0.3)' }}>
              <TrendingDown className="w-6 h-6" style={{ color: '#c08080' }} />
            </div>
          </div>
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* Чистая прибыль */}
        <div className="group relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl p-6 transition-all duration-500 hover:scale-105 hover:-translate-y-1" style={{ background: 'linear-gradient(135deg, rgba(41, 45, 47, 0.9), rgba(35, 39, 41, 0.9))' }}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl" style={{ backgroundColor: analytics.netIncome >= 0 ? 'rgba(200, 200, 200, 0.1)' : 'rgba(200, 150, 80, 0.1)' }} />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-accent mb-1" style={{ color: analytics.netIncome >= 0 ? '#b0b0b0' : '#c0a080' }}>
                Чистая прибыль
              </p>
              <p className="text-2xl font-heading drop-shadow-lg" style={{ color: '#c0c0c0' }}>
                {formatCurrency(analytics.netIncome)}
              </p>
            </div>
            <div className="p-3 rounded-xl backdrop-blur-sm" style={{ 
              backgroundColor: analytics.netIncome >= 0 ? 'rgba(200, 200, 200, 0.15)' : 'rgba(200, 150, 80, 0.15)', 
              border: analytics.netIncome >= 0 ? '1px solid rgba(200, 200, 200, 0.3)' : '1px solid rgba(200, 150, 80, 0.3)' 
            }}>
              <DollarSign className="w-6 h-6" style={{ color: analytics.netIncome >= 0 ? '#b0b0b0' : '#c0a080' }} />
            </div>
          </div>
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </div>

      {/* Продуктивность */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Статистика задач */}
        <div className="group relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl p-6 transition-all duration-500 hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, rgba(41, 45, 47, 0.9), rgba(35, 39, 41, 0.9))' }}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(80, 200, 80, 0.08)' }} />
          <h3 className="relative text-lg font-heading mb-4 flex items-center drop-shadow-lg" style={{ color: '#c0c0c0' }}>
            <CheckCircle className="w-5 h-5 mr-2" style={{ color: '#80c080' }} />
            Продуктивность задач
          </h3>
          
          <div className="relative space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-accent" style={{ color: '#a0a0a0' }}>Выполнено задач</span>
              <span className="font-semibold" style={{ color: '#c0c0c0' }}>
                {analytics.completedTasks} из {analytics.totalTasks}
              </span>
            </div>
            
            <div className="w-full rounded-full h-3 backdrop-blur-sm" style={{ backgroundColor: 'rgba(80, 80, 80, 0.3)' }}>
              <div 
                className="h-3 rounded-full transition-all duration-300"
                style={{ 
                  width: `${analytics.completionRate}%`,
                  background: 'linear-gradient(to right, rgba(80, 200, 80, 0.6), rgba(100, 220, 100, 0.8))',
                  boxShadow: '0 0 10px rgba(80, 200, 80, 0.3)'
                }}
              ></div>
            </div>
            
            <div className="text-center">
              <span className="text-2xl font-heading drop-shadow-lg" style={{ color: '#80c080' }}>
                {analytics.completionRate.toFixed(1)}%
              </span>
              <p className="text-sm font-accent" style={{ color: '#a0a0a0' }}>Процент выполнения</p>
            </div>
          </div>
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* Статусы задач */}
        <div className="group relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl p-6 transition-all duration-500 hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, rgba(41, 45, 47, 0.9), rgba(35, 39, 41, 0.9))' }}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }} />
          <h3 className="relative text-lg font-heading mb-4 flex items-center drop-shadow-lg" style={{ color: '#c0c0c0' }}>
            <Clock className="w-5 h-5 mr-2" style={{ color: '#b0b0b0' }} />
            Статусы задач
          </h3>
          
          <div className="relative space-y-3">
            {Object.entries(analytics.tasksByStatus).map(([status, count]) => {
              const statusLabels: Record<string, string> = {
                'new': 'Новые',
                'in_progress': 'В работе',
                'completed': 'Выполнены',
                'review': 'На проверке',
                'cancelled': 'Отменены',
                'on_hold': 'Приостановлены'
              };
              
              const statusColors: Record<string, string> = {
                'new': 'bg-gray-800/30 text-gray-300 border border-gray-600/20',
                'in_progress': 'bg-gray-700/30 text-gray-300 border border-gray-500/20',
                'completed': 'bg-green-900/30 text-green-300 border border-green-500/20',
                'review': 'bg-yellow-900/30 text-yellow-300 border border-yellow-500/20',
                'cancelled': 'bg-red-900/30 text-red-300 border border-red-500/20',
                'on_hold': 'bg-orange-900/30 text-orange-300 border border-orange-500/20'
              };

              return (
                <div key={status} className="flex items-center justify-between backdrop-blur-sm p-2 rounded-lg" style={{ backgroundColor: 'rgba(80, 80, 80, 0.1)' }}>
                  <span className={`px-3 py-1 rounded text-sm font-medium ${statusColors[status]}`}>
                    {statusLabels[status] || status}
                  </span>
                  <span className="font-semibold" style={{ color: '#c0c0c0' }}>{count}</span>
                </div>
              );
            })}
          </div>
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </div>

      {/* Проекты */}
      <div className="group relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl p-6 transition-all duration-500 hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, rgba(41, 45, 47, 0.9), rgba(35, 39, 41, 0.9))' }}>
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }} />
        <h3 className="relative text-lg font-heading mb-4 flex items-center drop-shadow-lg" style={{ color: '#c0c0c0' }}>
          <Calendar className="w-5 h-5 mr-2" style={{ color: '#b0b0b0' }} />
          Статистика проектов
        </h3>
        
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center p-4 rounded-xl backdrop-blur-sm border border-green-500/20" style={{ backgroundColor: 'rgba(80, 200, 80, 0.1)' }}>
            <div className="text-3xl font-heading drop-shadow-lg mb-2" style={{ color: '#80c080' }}>
              {analytics.completedProjects}
            </div>
            <div className="font-accent" style={{ color: '#a0a0a0' }}>Завершено проектов</div>
          </div>
          
          <div className="text-center p-4 rounded-xl backdrop-blur-sm border border-gray-500/20" style={{ backgroundColor: 'rgba(120, 120, 120, 0.1)' }}>
            <div className="text-3xl font-heading drop-shadow-lg mb-2" style={{ color: '#c0c0c0' }}>
              {analytics.activeProjects}
            </div>
            <div className="font-accent" style={{ color: '#a0a0a0' }}>Активных проектов</div>
          </div>
        </div>
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Последние платежи */}
      {analytics.currentMonthPayments.length > 0 && (
        <div className="group relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl p-6 transition-all duration-500 hover:scale-[1.01]" style={{ background: 'linear-gradient(135deg, rgba(41, 45, 47, 0.9), rgba(35, 39, 41, 0.9))' }}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }} />
          <h3 className="relative text-lg font-heading mb-4 flex items-center drop-shadow-lg" style={{ color: '#c0c0c0' }}>
            <DollarSign className="w-5 h-5 mr-2" style={{ color: '#b0b0b0' }} />
            Последние операции
          </h3>
          
          <div className="relative space-y-2">
            {analytics.currentMonthPayments.slice(0, 5).map((payment) => (
              <div key={payment.id} className="group/item flex items-center justify-between p-3 rounded-lg transition-all duration-300 hover:bg-white/5 backdrop-blur-sm" style={{ backgroundColor: 'rgba(80, 80, 80, 0.1)', border: '1px solid rgba(120, 120, 120, 0.2)' }}>
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 shadow-lg ${
                    payment.type === 'income' ? 'bg-green-400' : 'bg-red-400'
                  }`} style={{ 
                    boxShadow: payment.type === 'income' ? '0 0 8px rgba(80, 200, 80, 0.5)' : '0 0 8px rgba(200, 80, 80, 0.5)'
                  }}></div>
                  <div className="min-w-0 flex-1">
                    <span className="font-accent break-words" style={{ color: '#c0c0c0' }}>{payment.description}</span>
                    <div className="text-xs" style={{ color: '#909090' }}>
                      {payment.paidDate ? format(new Date(payment.paidDate), 'dd MMM yyyy', { locale: ru }) : 'Дата не указана'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-2">
                  <span className={`font-semibold whitespace-nowrap ${
                    payment.type === 'income' ? '' : ''
                  }`} style={{ color: payment.type === 'income' ? '#80c080' : '#c08080' }}>
                    {payment.type === 'income' ? '+' : '-'}{formatCurrency(payment.amount)}
                  </span>
                  <button
                    onClick={() => handleDeletePayment(payment.id, payment.description)}
                    className="opacity-0 group-hover/item:opacity-100 p-1.5 rounded-lg transition-all duration-200 flex-shrink-0"
                    style={{ backgroundColor: 'rgba(200, 80, 80, 0.1)' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(200, 80, 80, 0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(200, 80, 80, 0.1)'}
                    title="Удалить операцию"
                  >
                    <Trash2 className="w-4 h-4" style={{ color: '#c08080' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      )}
    </div>
  );
};

export default FinancialAnalytics;
