import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  REGISTERED_USERS_KEY,
  SESSION_STORAGE_KEY,
  TASKS_STORAGE_PREFIX,
  THEME_STORAGE_KEY,
  USER_STORAGE_KEY,
} from '../constants/storage';
import type { Session } from '../types/session';
import type { Task } from '../types/task';
import type { ThemeMode } from '../types/theme';
import type { User } from '../types/user';

// ---- USUÁRIO ATUAL / LEGADO ----
export async function saveUser(user: User): Promise<void> {
  await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  await appendOrUpdateRegisteredUser(user);
}

export async function getUser(): Promise<User | null> {
  const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    const parsed = JSON.parse(storedUser) as User;
    return parsed;
  } catch {
    return null;
  }
}

export async function updateUser(updatedUser: User): Promise<void> {
  await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
  await appendOrUpdateRegisteredUser(updatedUser);
}

// ---- LISTA DE USUÁRIOS REGISTRADOS LOCALMENTE ----
export async function getRegisteredUsers(): Promise<User[]> {
  const data = await AsyncStorage.getItem(REGISTERED_USERS_KEY);
  if (!data) {
    // Se ainda não existir a lista, mas tiver um usuário no USER_STORAGE_KEY legado
    const legacyUser = await getUser();
    if (legacyUser) {
      return [legacyUser];
    }
    return [];
  }
  try {
    return JSON.parse(data) as User[];
  } catch {
    return [];
  }
}

export async function saveRegisteredUsers(users: User[]): Promise<void> {
  await AsyncStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
}

async function appendOrUpdateRegisteredUser(user: User): Promise<void> {
  const currentList = await getRegisteredUsers();
  const existingIndex = currentList.findIndex(
    (u) => u.id === user.id || u.username.toLowerCase() === user.username.toLowerCase(),
  );

  if (existingIndex >= 0) {
    currentList[existingIndex] = { ...currentList[existingIndex], ...user };
  } else {
    currentList.push(user);
  }

  await saveRegisteredUsers(currentList);
}

// ---- SESSÃO ----
export async function saveSession(session: Session): Promise<void> {
  await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export async function getSession(): Promise<Session | null> {
  const storedSession = await AsyncStorage.getItem(SESSION_STORAGE_KEY);

  if (!storedSession) {
    return null;
  }

  try {
    return JSON.parse(storedSession) as Session;
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
}

// ---- TEMA ----
export async function saveTheme(theme: ThemeMode): Promise<void> {
  await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
}

export async function getTheme(): Promise<ThemeMode | null> {
  const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);

  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }

  return null;
}

// ---- ISOLAMENTO DE TAREFAS POR USER_ID ----
export async function getUserTasks(userId: string): Promise<Task[]> {
  if (!userId) return [];
  const key = `${TASKS_STORAGE_PREFIX}${userId}`;
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return [];
  try {
    const list = JSON.parse(raw) as Task[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export async function saveUserTasks(userId: string, tasks: Task[]): Promise<void> {
  if (!userId) return;
  const key = `${TASKS_STORAGE_PREFIX}${userId}`;
  await AsyncStorage.setItem(key, JSON.stringify(tasks));
}