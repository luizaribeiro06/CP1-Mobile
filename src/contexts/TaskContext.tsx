import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import { getUserTasks, saveUserTasks } from '../services/storageService';
import type { Task, TaskCategory, TaskFilter } from '../types/task';
import { useAuth } from '../hooks/useAuth';

export type TaskContextType = {
  tasks: Task[];
  filteredTasks: Task[];
  filter: TaskFilter;
  loading: boolean;
  setFilter: (filter: TaskFilter) => void;
  addTask: (data: { title: string; description?: string; category: TaskCategory }) => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  refreshTasks: () => Promise<void>;
};

export const TaskContext = createContext<TaskContextType | null>(null);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [loading, setLoading] = useState(false);

  const loadTasksForUser = useCallback(async () => {
    if (!user) {
      setTasks([]);
      return;
    }

    try {
      setLoading(true);
      const stored = await getUserTasks(user.id);
      // O checklist começa vazio caso o usuário não tenha tarefas cadastradas
      const userOnly = stored.filter((t) => t.userId === user.id);
      setTasks(userOnly);
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadTasksForUser();
  }, [loadTasksForUser]);

  const addTask = useCallback(
    async (data: { title: string; description?: string; category: TaskCategory }) => {
      if (!user) return;

      const newTask: Task = {
        id: `${user.id}_${Date.now()}`,
        userId: user.id,
        title: data.title.trim(),
        description: data.description?.trim(),
        completed: false,
        category: data.category,
        createdAt: new Date().toISOString(),
      };

      const updated = [newTask, ...tasks];
      setTasks(updated);
      await saveUserTasks(user.id, updated);
    },
    [user, tasks],
  );

  const toggleTask = useCallback(
    async (taskId: string) => {
      if (!user) return;
      const updated = tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
      setTasks(updated);
      await saveUserTasks(user.id, updated);
    },
    [user, tasks],
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      if (!user) return;
      const updated = tasks.filter((t) => t.id !== taskId);
      setTasks(updated);
      await saveUserTasks(user.id, updated);
    },
    [user, tasks],
  );

  const filteredTasks = useMemo(() => {
    if (filter === 'pending') {
      return tasks.filter((t) => !t.completed);
    }
    if (filter === 'completed') {
      return tasks.filter((t) => t.completed);
    }
    return tasks;
  }, [tasks, filter]);

  const value = useMemo<TaskContextType>(
    () => ({
      tasks,
      filteredTasks,
      filter,
      loading,
      setFilter,
      addTask,
      toggleTask,
      deleteTask,
      refreshTasks: loadTasksForUser,
    }),
    [tasks, filteredTasks, filter, loading, setFilter, addTask, toggleTask, deleteTask, loadTasksForUser],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}
