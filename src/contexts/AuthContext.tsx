import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import {
  clearSession,
  getRegisteredUsers,
  getSession,
  getUser,
  saveSession,
  saveUser as saveUserStorage,
  updateUser as updateUserStorage,
} from '../services/storageService';
import type { User, UserRole } from '../types/user';

export const FIXED_USERS: User[] = [
  {
    id: 'admin_id_01',
    username: 'admin',
    password: '123',
    name: 'Administrador',
    email: 'admin@fielprofile.com.br',
    phone: '(11) 98765-4321',
    city: 'São Paulo',
    bio: 'Gestor da Fiel Torcida e administrador da plataforma FielProfile.',
    role: 'admin',
  },
  {
    id: 'user_id_01',
    username: 'user',
    password: '123',
    name: 'Usuário Comum',
    email: 'usuario@fielprofile.com.br',
    phone: '(11) 91234-5678',
    city: 'São Paulo',
    bio: 'Fiel torcedor do Timão presente em todos os jogos na Arena.',
    role: 'user',
  },
];

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (usernameInput: string, passwordInput: string) => Promise<{ success: boolean; role?: UserRole; error?: string }>;
  register: (newUser: User) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updatedUser: User) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restauração inicial da sessão persistida
  useEffect(() => {
    async function restore() {
      try {
        const session = await getSession();
        if (!session) {
          setUser(null);
          return;
        }

        // Verifica se é um usuário fixo
        const fixedMatch = FIXED_USERS.find((u) => u.id === session.userId);
        if (fixedMatch) {
          // Tenta pegar dados customizados do storage se o admin/user editou o perfil
          const stored = await getUser();
          if (stored && stored.id === fixedMatch.id) {
            setUser(stored);
          } else {
            setUser(fixedMatch);
          }
          return;
        }

        // Verifica usuários cadastrados
        const registered = await getRegisteredUsers();
        const found = registered.find((u) => u.id === session.userId);
        if (found) {
          setUser({ ...found, role: found.role || 'user' });
          return;
        }

        // Usuário legado isolado
        const storedUser = await getUser();
        if (storedUser && storedUser.id === session.userId) {
          setUser({ ...storedUser, role: storedUser.role || 'user' });
          return;
        }

        // Sessão inválida / não encontrada
        await clearSession();
        setUser(null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    restore();
  }, []);

  const login = useCallback(
    async (
      usernameInput: string,
      passwordInput: string,
    ): Promise<{ success: boolean; role?: UserRole; error?: string }> => {
      const cleanUsername = usernameInput.trim().toLowerCase();
      const cleanPassword = passwordInput.trim();

      // 1. Procura nos usuários fixos de teste
      const fixedMatch = FIXED_USERS.find(
        (u) =>
          u.username.toLowerCase() === cleanUsername &&
          u.password === cleanPassword,
      );

      if (fixedMatch) {
        // Checa se já havia dados atualizados dele salvos
        const stored = await getUser();
        const userToSet: User = stored && stored.id === fixedMatch.id ? stored : fixedMatch;
        await saveSession({ userId: userToSet.id });
        await saveUserStorage(userToSet);
        setUser(userToSet);
        return { success: true, role: userToSet.role };
      }

      // 2. Procura nos cadastrados localmente
      const registered = await getRegisteredUsers();
      const foundRegistered = registered.find(
        (u) =>
          u.username.toLowerCase() === cleanUsername &&
          u.password === cleanPassword,
      );

      if (foundRegistered) {
        const userWithRole: User = {
          ...foundRegistered,
          role: foundRegistered.role || 'user',
        };
        await saveSession({ userId: userWithRole.id });
        await saveUserStorage(userWithRole);
        setUser(userWithRole);
        return { success: true, role: userWithRole.role };
      }

      // 3. Usuário legado direto em storage
      const legacyUser = await getUser();
      if (
        legacyUser &&
        legacyUser.username.toLowerCase() === cleanUsername &&
        legacyUser.password === cleanPassword
      ) {
        const userWithRole: User = {
          ...legacyUser,
          role: legacyUser.role || 'user',
        };
        await saveSession({ userId: userWithRole.id });
        setUser(userWithRole);
        return { success: true, role: userWithRole.role };
      }

      return {
        success: false,
        error: 'Nome de usuário ou senha incorretos.',
      };
    },
    [],
  );

  const register = useCallback(async (newUser: User) => {
    const userToSave: User = {
      ...newUser,
      role: 'user', // Todo cadastro pelo app recebe role 'user'
    };
    await saveUserStorage(userToSave);
  }, []);

  const logout = useCallback(async () => {
    await clearSession();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (updatedUser: User) => {
    await updateUserStorage(updatedUser);
    setUser((prev) => (prev ? { ...prev, ...updatedUser } : updatedUser));
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      login,
      register,
      logout,
      updateProfile,
    }),
    [user, loading, login, register, logout, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
