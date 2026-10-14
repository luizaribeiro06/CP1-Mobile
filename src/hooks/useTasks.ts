import { useContext } from 'react';
import { TaskContext, type TaskContextType } from '../contexts/TaskContext';

export function useTasks(): TaskContextType {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks deve ser utilizado dentro de um TaskProvider');
  }
  return context;
}
