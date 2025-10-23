export interface KanbanTask {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  tasks: KanbanTask[];
  maxTasks?: number;
}

export interface KanbanBoard {
  id: string;
  title: string;
  description?: string;
  columns: KanbanColumn[];
  createdAt: string;
  updatedAt: string;
}

export interface KanbanData {
  boards: KanbanBoard[];
}