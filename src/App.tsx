import React, { useState, useEffect } from 'react';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { Dashboard } from './components/Dashboard/Dashboard';
import { TaskForm } from './components/Tasks/TaskForm';
import { TaskList } from './components/Tasks/TaskList';
import { ProjectForm } from './components/Projects/ProjectForm';
import { ProjectList } from './components/Projects/ProjectList';
import { NotesList } from './components/Notes/NotesList';
import { ClientForm } from './components/Clients/ClientForm';
import { ClientList } from './components/Clients/ClientList';
import { PaymentForm } from './components/Payments/PaymentForm';
import { NoteForm } from './components/Notes/NoteForm';
import { CalendarView } from './components/Calendar/CalendarView';
import { FileUpload } from './components/Files/FileUpload';
import { SettingsComingSoon } from './components/Common/ComingSoon';
import { EmailAuth } from './components/Auth/EmailAuth';
import FinancialAnalytics from './components/Analytics/FinancialAnalytics';
import ArchiveView from './components/Archive/ArchiveView';
import { initializeDatabase } from './database/db';
import { useAuth } from './hooks/useAuth';
import { DataProvider } from './context/DataContext';
import './App.css';

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [projectFormOpen, setProjectFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [clientFormOpen, setClientFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [paymentFormOpen, setPaymentFormOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<any>(null);
  const [noteFormOpen, setNoteFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);

  useEffect(() => {
    const initApp = async () => {
      try {
        await initializeDatabase();
        setIsLoading(false);
      } catch (error) {
        console.error('Ошибка инициализации приложения:', error);
        setIsLoading(false);
      }
    };

    initApp();
  }, []);

  const handleNavigate = (page: string) => {
    if (page === 'add-task') {
      setEditingTask(null);
      setTaskFormOpen(true);
    } else if (page === 'add-project') {
      setEditingProject(null);
      setProjectFormOpen(true);
    } else if (page === 'add-client') {
      setEditingClient(null);
      setClientFormOpen(true);
    } else if (page === 'add-payment') {
      setEditingPayment(null);
      setPaymentFormOpen(true);
    } else if (page === 'add-note') {
      setEditingNote(null);
      setNoteFormOpen(true);
    } else if (page === 'view-calendar') {
      setCurrentPage('calendar');
    } else if (page === 'upload-file') {
      setCurrentPage('files');
    } else if (page === 'view-tasks') {
      setCurrentPage('tasks');
    } else {
      setCurrentPage(page);
    }
  };

  const handleEditTask = (task: any) => {
    setEditingTask(task);
    setTaskFormOpen(true);
  };

  const handleCloseTaskForm = () => {
    setTaskFormOpen(false);
    setEditingTask(null);
  };

  const handleEditProject = (project: any) => {
    setEditingProject(project);
    setProjectFormOpen(true);
  };

  const handleCloseProjectForm = () => {
    setProjectFormOpen(false);
    setEditingProject(null);
  };

  const handleEditClient = (client: any) => {
    setEditingClient(client);
    setClientFormOpen(true);
  };

  const handleCloseClientForm = () => {
    setClientFormOpen(false);
    setEditingClient(null);
  };

  const handleEditPayment = (payment: any) => {
    setEditingPayment(payment);
    setPaymentFormOpen(true);
  };

  const handleClosePaymentForm = () => {
    setPaymentFormOpen(false);
    setEditingPayment(null);
  };

  const handleEditNote = (note: any) => {
    setEditingNote(note);
    setNoteFormOpen(true);
  };

  const handleCloseNoteForm = () => {
    setNoteFormOpen(false);
    setEditingNote(null);
  };

  const getPageTitle = () => {
    const titles: Record<string, string> = {
      'dashboard': 'Главная',
      'add-task': 'Добавить задачу',
      'add-project': 'Добавить проект',
      'tasks': 'Мои задачи',
      'projects': 'Проекты',
      'clients': 'Клиенты',
      'calendar': 'Календарь',
      'notes': 'Заметки',
      'archive': 'Архив',
      'files': 'Файлы',
      'analytics': 'Аналитика',
      'settings': 'Настройки'
    };
    return titles[currentPage] || 'TaskManager Pro';
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'add-task':
        return <div className="p-6">Форма добавления задачи (в разработке)</div>;
      case 'add-project':
        return <div className="p-6">Форма добавления проекта (в разработке)</div>;
      case 'tasks':
        return <TaskList onAddTask={() => handleNavigate('add-task')} onEditTask={handleEditTask} />;
      case 'projects':
        return <ProjectList onAddProject={() => handleNavigate('add-project')} onEditProject={handleEditProject} />;
      case 'clients':
        return <ClientList onAddClient={() => handleNavigate('add-client')} onEditClient={handleEditClient} />;
      case 'calendar':
        return <CalendarView />;
      case 'notes':
        return <NotesList onAddNote={() => handleNavigate('add-note')} onEditNote={handleEditNote} />;
      case 'archive':
        return <ArchiveView />;
      case 'files':
        return <FileUpload />;
      case 'analytics':
        return <FinancialAnalytics />;
      case 'settings':
        return <SettingsComingSoon />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(to bottom right, #1a1d1f, #292d2f, #1f2224)' }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4" style={{ borderColor: '#c0c0c0' }}></div>
          <p style={{ color: '#a0a0a0' }}>Загрузка приложения...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{ background: 'linear-gradient(to bottom right, #1a1d1f, #292d2f, #1f2224)' }}
    >
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentPage={currentPage}
          onNavigate={handleNavigate}
        />
        
        <div className="flex-1 lg:ml-0">
          <Header 
            onMenuClick={() => setSidebarOpen(true)}
            title={getPageTitle()}
          />
          
          <main className="p-6" style={{ backgroundColor: 'transparent' }}>
            {renderCurrentPage()}
          </main>
        </div>
      </div>
      
      <TaskForm 
        isOpen={taskFormOpen}
        onClose={handleCloseTaskForm}
        task={editingTask}
      />
      
      <ProjectForm 
        isOpen={projectFormOpen}
        onClose={handleCloseProjectForm}
        project={editingProject}
      />
      
      <ClientForm 
        isOpen={clientFormOpen}
        onClose={handleCloseClientForm}
        client={editingClient}
      />
      
      <PaymentForm 
        isOpen={paymentFormOpen}
        onClose={handleClosePaymentForm}
        payment={editingPayment}
      />
      
      <NoteForm 
        isOpen={noteFormOpen}
        onClose={handleCloseNoteForm}
        note={editingNote}
      />
    </div>
  );
}

// Основной компонент с проверкой авторизации
function App() {
  const { user, loading } = useAuth();

  // Показываем загрузку пока проверяем авторизацию
  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(to bottom right, #1a1d1f, #292d2f, #1f2224)' }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4" style={{ borderColor: '#c0c0c0' }}></div>
          <p style={{ color: '#a0a0a0' }}>Загрузка...</p>
        </div>
      </div>
    );
  }

  // Если пользователь не авторизован, показываем экран входа
  if (!user) {
    return <EmailAuth />;
  }

  // Если авторизован, показываем основное приложение
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}

export default App;
