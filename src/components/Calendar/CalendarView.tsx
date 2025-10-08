import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { Task } from '../../types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday, isPast, isFuture } from 'date-fns';
import { ru } from 'date-fns/locale';

export const CalendarView: React.FC = () => {
  const { tasks } = useTasks();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Добавляем пустые дни в начале месяца для правильного отображения
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - monthStart.getDay());
  const endDate = new Date(monthEnd);
  endDate.setDate(endDate.getDate() + (6 - monthEnd.getDay()));
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => 
      task.dueDate && isSameDay(new Date(task.dueDate), date)
    );
  };

  const getTasksForSelectedDate = () => {
    if (!selectedDate) return [];
    return getTasksForDate(selectedDate);
  };

  const isOverdue = (task: Task) => {
    return task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'completed';
  };

  const isDueSoon = (task: Task) => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays > 0 && task.status !== 'completed';
  };

  const getTaskStatusColor = (task: Task) => {
    if (isOverdue(task)) return 'bg-red-100 text-red-800';
    if (isDueSoon(task)) return 'bg-yellow-100 text-yellow-800';
    if (task.status === 'completed') return 'bg-green-100 text-green-800';
    return 'bg-blue-100 text-blue-800';
  };

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  return (
    <div className="space-y-6">
      {/* Заголовок календаря */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-heading drop-shadow-lg" style={{ color: '#c0c0c0' }}>Календарь дедлайнов</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-semibold text-gray-700 min-w-[200px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Календарь */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Дни недели */}
            <div className="grid grid-cols-7 bg-gray-50">
              {dayNames.map(day => (
                <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            {/* Дни месяца */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, index) => {
                const dayTasks = getTasksForDate(day);
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isCurrentDay = isToday(day);
                const isSelected = selectedDate && isSameDay(day, selectedDate);

                return (
                  <div
                    key={index}
                    className={`
                      min-h-[100px] p-2 border-r border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors
                      ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''}
                      ${isCurrentDay ? 'bg-blue-50' : ''}
                      ${isSelected ? 'bg-blue-100' : ''}
                    `}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium ${isCurrentDay ? 'text-blue-600' : ''}`}>
                        {format(day, 'd')}
                      </span>
                      {dayTasks.length > 0 && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">
                          {dayTasks.length}
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      {dayTasks.slice(0, 2).map(task => (
                        <div
                          key={task.id}
                          className={`text-xs p-1 rounded truncate ${getTaskStatusColor(task)}`}
                          title={task.title}
                        >
                          {task.title}
                        </div>
                      ))}
                      {dayTasks.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{dayTasks.length - 2} еще
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Список задач на выбранную дату */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              {selectedDate ? format(selectedDate, 'dd MMMM yyyy', { locale: ru }) : 'Выберите дату'}
            </h3>
            
            {selectedDate ? (
              <div className="space-y-3">
                {getTasksForSelectedDate().length === 0 ? (
                  <p className="text-gray-500 text-sm">На эту дату нет задач</p>
                ) : (
                  getTasksForSelectedDate().map(task => (
                    <div
                      key={task.id}
                      className={`p-3 rounded-lg border ${getTaskStatusColor(task)}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{task.title}</h4>
                        <div className="flex items-center space-x-1">
                          {isOverdue(task) && (
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                          )}
                          {isDueSoon(task) && (
                            <Clock className="w-4 h-4 text-yellow-600" />
                          )}
                        </div>
                      </div>
                      
                      {task.description && (
                        <p className="text-xs opacity-75 mb-2 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="capitalize">
                          {task.status === 'completed' ? 'Выполнено' :
                           task.status === 'in_progress' ? 'В работе' :
                           task.status === 'review' ? 'На согласовании' :
                           task.status === 'cancelled' ? 'Отменено' :
                           task.status === 'on_hold' ? 'Приостановлено' : 'Новая'}
                        </span>
                        <span>
                          {format(new Date(task.dueDate!), 'HH:mm')}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Выберите дату в календаре, чтобы посмотреть задачи</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
