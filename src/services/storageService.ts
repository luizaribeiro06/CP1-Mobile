import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  SESSION_STORAGE_KEY,
  THEME_STORAGE_KEY,
  USER_STORAGE_KEY,
} from '../constants/storage';
import type { Session } from '../types/session';
import type { ThemeMode } from '../types/theme';
import type { User } from '../types/user';

export async function saveUser(user: User): Promise<void> {
  await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export async function getUser(): Promise<User | null> {
  const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);

  if (!storedUser) {
    return null;
  }

  return JSON.parse(storedUser) as User;
}

export async function updateUser(updatedUser: User): Promise<void> {
  await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
}

export async function saveSession(session: Session): Promise<void> {
  await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export async function getSession(): Promise<Session | null> {
  const storedSession = await AsyncStorage.getItem(SESSION_STORAGE_KEY);

  if (!storedSession) {
    return null;
  }

  return JSON.parse(storedSession) as Session;
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
}

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