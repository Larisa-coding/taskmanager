export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  projectId?: string;
  clientId?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  tags: string[];
  color?: string;
  checklist?: ChecklistItem[];
  comments: Comment[];
  estimatedHours?: number;
  actualHours?: number;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: Date;
  type: 'comment' | 'status_change' | 'assignment';
}

export type TaskStatus = 
  | 'new' 
  | 'in_progress' 
  | 'review' 
  | 'completed' 
  | 'cancelled' 
  | 'on_hold';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Project {
  id: string;
  name: string;
  description?: string;
  clientId?: string;
  status: ProjectStatus;
  startDate?: Date;
  endDate?: Date;
  completedAt?: Date;
  budget?: number;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  tasks: string[]; // Task IDs
}

export type ProjectStatus = 
  | 'planning' 
  | 'active' 
  | 'on_hold' 
  | 'completed' 
  | 'cancelled';

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  projects: string[]; // Project IDs
  archived?: boolean;
  archivedAt?: Date;
}

export interface Payment {
  id: string;
  amount: number;
  description: string;
  type: PaymentType;
  projectId?: string;
  clientId?: string;
  dueDate?: Date;
  paidDate?: Date;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
  category: string;
  tags: string[];
  archived?: boolean;
  archivedAt?: Date;
}

export type PaymentType = 'income' | 'expense';
export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';

export interface Note {
  id: string;
  title: string;
  content: string;
  type: NoteType;
  tags: string[];
  color?: string;
  createdAt: Date;
  updatedAt: Date;
  projectId?: string;
  taskId?: string;
  clientId?: string;
  archived?: boolean;
  archivedAt?: Date;
}

export type NoteType = 'idea' | 'reminder' | 'link' | 'book' | 'series' | 'other';

export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  taskId?: string;
  projectId?: string;
  uploadedAt: Date;
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  totalProjects: number;
  activeProjects: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  tasksByStatus: Record<TaskStatus, number>;
  upcomingDeadlines: Task[];
}

export interface FilterOptions {
  status?: TaskStatus[];
  priority?: Priority[];
  projectId?: string;
  clientId?: string;
  dueDate?: {
    from?: Date;
    to?: Date;
  };
  tags?: string[];
  search?: string;
}
