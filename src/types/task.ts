export type TaskCategory =
  | 'ingresso'
  | 'transporte'
  | 'vestuario'
  | 'estadio'
  | 'geral';

export type Task = {
  id: string;
  userId: string;
  title: string;
  description?: string;
  completed: boolean;
  category: TaskCategory;
  createdAt: string;
};

export type TaskFilter = 'all' | 'pending' | 'completed';
