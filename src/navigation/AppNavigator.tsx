import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View } from 'react-native';

import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { TasksScreen } from '../screens/TasksScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import type { MainTabParamList, RootStackParamList } from '../types/navigation';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabNavigator() {
  const { user } = useAuth();
  const { colors, fonts } = useTheme();

  // Roteamento obrigatório por perfil:
  // admin -> aba 'Configuracoes'
  // user  -> aba 'Home'
  const initialRoute = user?.role === 'admin' ? 'Configuracoes' : 'Home';

  return (
    <Tab.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.headerBg,
          borderTopColor: '#262626',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#737373',
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: fonts.semiBold,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarAccessibilityLabel: 'Aba Início: Jogos do Corinthians e Resumo do Matchday',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabIconContainer}>
              <Text style={[styles.tabIconSymbol, { color }]}>{focused ? '⚽' : '🏟️'}</Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Checklist"
        component={TasksScreen}
        options={{
          tabBarLabel: 'Checklist',
          tabBarAccessibilityLabel: 'Aba Checklist: Tarefas e preparativos de dia de jogo',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabIconContainer}>
              <Text style={[styles.tabIconSymbol, { color }]}>{focused ? '📋' : '📝'}</Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Configuracoes"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Configurações',
          tabBarAccessibilityLabel: 'Aba Configurações: Perfil, Dados e Tema',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabIconContainer}>
              <Text style={[styles.tabIconSymbol, { color }]}>{focused ? '⚙️' : '👤'}</Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AuthStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

export function AppNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabNavigator /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
  },
  tabIconSymbol: {
    fontSize: 18,
  },
});
