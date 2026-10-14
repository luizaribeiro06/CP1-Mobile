import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';

import { Loading } from './src/components/Loading';
import { AuthProvider } from './src/contexts/AuthContext';
import { TaskProvider } from './src/contexts/TaskContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { useAuth } from './src/hooks/useAuth';
import { useAppFonts } from './src/hooks/useFonts';
import { useTheme } from './src/hooks/useTheme';
import { AppNavigator } from './src/navigation/AppNavigator';

SplashScreen.preventAutoHideAsync();

function MainContent() {
  const [fontsLoaded] = useAppFonts();
  const { loading: authLoading } = useAuth();
  const { isDark } = useTheme();

  useEffect(() => {
    if (fontsLoaded && !authLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, authLoading]);

  if (!fontsLoaded || authLoading) {
    return (
      <>
        <Loading fullScreen message="Carregando FielFlow..." />
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </>
    );
  }

  return (
    <>
      <AppNavigator />
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TaskProvider>
          <MainContent />
        </TaskProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
