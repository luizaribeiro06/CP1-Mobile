import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

import { useAppFonts } from './src/hooks/useFonts';
import { Loading } from './src/components/Loading';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';

import {
  clearSession,
  getSession,
  getTheme,
  getUser,
  saveTheme,
  updateUser,
} from './src/services/storageService';

import type { User } from './src/types/user';

type AppRoute = 'welcome' | 'login' | 'register' | 'perfil';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [route, setRoute] = useState<AppRoute>('welcome');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const systemScheme = useColorScheme();

  const [isDark, setIsDark] = useState(
    systemScheme === 'dark',
  );

  const [fontsLoaded] = useAppFonts();

  useEffect(() => {
    restoreSession();
  }, []);

  useEffect(() => {
    if (fontsLoaded && !loading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, loading]);

  async function restoreSession() {
    try {
      const [
        storedUser,
        storedSession,
        storedTheme,
      ] = await Promise.all([
        getUser(),
        getSession(),
        getTheme(),
      ]);

      // Recupera o tema salvo
      if (storedTheme) {
        setIsDark(storedTheme === 'dark');
      }

      setUser(storedUser);

      if (
        storedUser &&
        storedSession?.userId === storedUser.id
      ) {
        setRoute('perfil');
        return;
      }

      if (storedSession) {
        await clearSession();
      }

      setRoute('welcome');
    } catch {
      Alert.alert(
        'Erro',
        'Não foi possível recuperar os dados salvos no dispositivo.',
      );

      setRoute('welcome');
    } finally {
      setLoading(false);
    }
  }

  // LOGIN
  function handleLogin(loggedUser: User) {
    setUser(loggedUser);
    setRoute('perfil');
  }

  // ALTERAR TEMA
  async function handleToggleTheme() {
    const nextIsDark = !isDark;

    setIsDark(nextIsDark);

    try {
      await saveTheme(
        nextIsDark ? 'dark' : 'light',
      );
    } catch {
      Alert.alert(
        'Erro',
        'Não foi possível salvar sua preferência de tema.',
      );
    }
  }

  // SALVAR ALTERAÇÕES DO USUÁRIO
  async function handleSaveUser(updatedUser: User) {
    await updateUser(updatedUser);

    setUser((previousUser) => {
      if (!previousUser) {
        return updatedUser;
      }

      return {
        ...previousUser,
        ...updatedUser,
      };
    });
  }

  // LOGOUT
  async function handleLogout() {
    try {
      await clearSession();

      setUser(null);

      // NÃO altera o isDark aqui.
      // Assim o tema continua salvo.
      setRoute('login');
    } catch {
      Alert.alert(
        'Erro ao sair',
        'Não foi possível encerrar sua sessão. Tente novamente.',
      );
    }
  }

  if (loading || !fontsLoaded) {
    return (
      <>
        <Loading
          fullScreen
          message="Carregando..."
        />

        <StatusBar style="dark" />
      </>
    );
  }

  // WELCOME
  if (route === 'welcome') {
    return (
      <>
        <WelcomeScreen
          onEnter={() => setRoute('login')}
        />

        <StatusBar style="light" />
      </>
    );
  }

  // CADASTRO
  if (route === 'register') {
    return (
      <>
        <RegisterScreen
          onGoToLogin={() => setRoute('login')}
          onRegistered={(registeredUser) => {
            setUser(registeredUser);
            setRoute('login');
          }}
          isDark={isDark}
        />

        <StatusBar style={isDark ? 'light' : 'dark'} />
      </>
    );
  }

  // PERFIL
  if (route === 'perfil' && user) {
    return (
      <>
        <ProfileScreen
          user={user}
          isDark={isDark}
          onToggleTheme={handleToggleTheme}
          onBack={() => setRoute('login')}
          onLogout={handleLogout}
          onSaveUser={handleSaveUser}
        />

        <StatusBar
          style={isDark ? 'light' : 'dark'}
        />
      </>
    );
  }

  // LOGIN
  return (
    <>
      <LoginScreen
        onGoToRegister={() => setRoute('register')}
        onLogin={handleLogin}
        isDark={isDark}
      />

      <StatusBar
        style={isDark ? 'light' : 'dark'}
      />
    </>
  );
}
