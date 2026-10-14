import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Header } from '../components/Header';
import { ProfileCard } from '../components/ProfileCard';
import { ProfileForm } from '../components/ProfileForm';
import { ThemeSwitch } from '../components/ThemeSwitch';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { getRegisteredUsers } from '../services/storageService';
import type { User } from '../types/user';

export function SettingsScreen() {
  const { user, updateProfile, logout } = useAuth();
  const { colors, fonts, isDark, toggleTheme } = useTheme();
  const styles = getStyles(colors, fonts);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [registeredUsersCount, setRegisteredUsersCount] = useState<number>(0);

  useEffect(() => {
    async function loadStats() {
      try {
        const users = await getRegisteredUsers();
        // Inclui as duas contas fixas (admin e user) + cadastrados dinâmicos
        setRegisteredUsersCount(users.length + 2);
      } catch {
        setRegisteredUsersCount(2);
      }
    }
    if (user?.role === 'admin') {
      loadStats();
    }
  }, [user]);

  async function handleSaveUser(updatedUser: User) {
    const name = updatedUser.name.trim();
    const email = updatedUser.email.trim();

    // =========================
    // VALIDAÇÃO DO NOME
    // =========================
    if (!name) {
      Alert.alert('Campo obrigatório', 'Informe seu nome.');
      return;
    }

    if (name.length < 2) {
      Alert.alert(
        'Nome inválido',
        'O nome deve possuir pelo menos 2 caracteres.',
      );
      return;
    }

    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
    if (!nameRegex.test(name)) {
      Alert.alert(
        'Nome inválido',
        'O nome deve conter apenas letras e espaços.',
      );
      return;
    }

    // =========================
    // VALIDAÇÃO DO E-MAIL
    // =========================
    if (!email) {
      Alert.alert('Campo obrigatório', 'Informe seu e-mail.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert(
        'E-mail inválido',
        'Informe um e-mail válido, como exemplo@email.com.',
      );
      return;
    }

    // =========================
    // VALIDAÇÃO DO TELEFONE
    // =========================
    if (updatedUser.phone?.trim()) {
      const phoneNumbers = updatedUser.phone.replace(/\D/g, '');
      if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
        Alert.alert(
          'Telefone inválido',
          'Informe um telefone válido com DDD.',
        );
        return;
      }
    }

    // =========================
    // VALIDAÇÃO DA CIDADE
    // =========================
    if (updatedUser.city?.trim()) {
      const cityRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
      if (!cityRegex.test(updatedUser.city.trim())) {
        Alert.alert(
          'Cidade inválida',
          'A cidade deve conter apenas letras.',
        );
        return;
      }
    }

    const validatedUser: User = {
      ...updatedUser,
      name,
      email,
      role: user?.role || 'user',
    };

    try {
      setSaving(true);
      await updateProfile(validatedUser);
      setEditing(false);
      Alert.alert('Perfil atualizado', 'Seus dados foram salvos com sucesso.');
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar suas alterações.');
    } finally {
      setSaving(false);
    }
  }

  if (!user) {
    return null;
  }

  const isAdmin = user.role === 'admin';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}
    >
      <Header subtitle="Configurações & Perfil" />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* PAINEL ESPECIAL DO ADMINISTRADOR */}
        {isAdmin ? (
          <View style={styles.adminCard}>
            <View style={styles.adminHeader}>
              <Text style={styles.adminBadge}>PAINEL DO ADMINISTRADOR</Text>
           
            </View>
            <Text style={styles.adminTitle}>Visão Geral Administrativa</Text>
            <Text style={styles.adminDescription}>
              Você está autenticado com privilégios de Administrador. Acesso direto a todas as configurações e métricas do FIEL PROFILE.
            </Text>
            <View style={styles.adminStatsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{registeredUsersCount}</Text>
                <Text style={styles.statLabel}>Contas Ativas</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>100%</Text>
                <Text style={styles.statLabel}>TheSportsDB API</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>Admin</Text>
                <Text style={styles.statLabel}>Permissão</Text>
              </View>
            </View>
          </View>
        ) : null}

        {/* CARTÃO DE DADOS DO PERFIL / FORMULÁRIO DE EDIÇÃO */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>DADOS CADASTRAIS</Text>
        </View>

        {editing ? (
          <ProfileForm
            user={user}
            isDark={isDark}
            loading={saving}
            onSaveUser={handleSaveUser}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <ProfileCard
            user={user}
            isDark={isDark}
            onEdit={() => setEditing(true)}
          />
        )}

        {/* ALTERNÂNCIA DE TEMA LIGHT/DARK */}
        <View style={styles.card}>
          <Text style={styles.cardHeaderTitle}>PREFERÊNCIAS DE TEMA</Text>
          <ThemeSwitch
            theme={isDark ? 'dark' : 'light'}
            onToggle={toggleTheme}
            textColor={colors.text}
          />
        </View>

        {/* LOGOUT */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
          accessibilityRole="button"
          accessibilityLabel="Encerrar sessão da conta"
          accessibilityHint="Sai do FIEL PROFILE e retorna à tela inicial de login"
          activeOpacity={0.7}
        >
          <Text style={styles.logoutButtonText}>SAIR DA CONTA</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function getStyles(
  colors: ReturnType<typeof useTheme>['colors'],
  fonts: ReturnType<typeof useTheme>['theme']['fonts'],
) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    content: {
      padding: 18,
      paddingBottom: 40,
      gap: 18,
    },
    sectionHeader: {
      marginTop: 4,
    },
    sectionTitle: {
      fontSize: 11,
      fontFamily: fonts.extraBold,
      color: colors.muted,
      letterSpacing: 1,
    },
    adminCard: {
      backgroundColor: '#1E1B18',
      borderRadius: 16,
      padding: 18,
      borderWidth: 1,
      borderColor: '#D97706',
      shadowColor: '#D97706',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 3,
    },
    adminHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },
    adminBadge: {
      fontSize: 10,
      fontFamily: fonts.extraBold,
      color: '#D97706',
      letterSpacing: 1,
    },
    adminStatus: {
      fontSize: 11,
      fontFamily: fonts.bold,
      color: '#10B981',
    },
    adminTitle: {
      fontSize: 18,
      fontFamily: fonts.black,
      color: '#FFFFFF',
      marginBottom: 4,
    },
    adminDescription: {
      fontSize: 12,
      fontFamily: fonts.regular,
      color: '#D1D5DB',
      lineHeight: 18,
      marginBottom: 14,
    },
    adminStatsRow: {
      flexDirection: 'row',
      gap: 10,
    },
    statBox: {
      flex: 1,
      backgroundColor: '#2A2620',
      borderRadius: 8,
      padding: 10,
      alignItems: 'center',
    },
    statNumber: {
      fontSize: 16,
      fontFamily: fonts.extraBold,
      color: '#F59E0B',
    },
    statLabel: {
      fontSize: 10,
      fontFamily: fonts.medium,
      color: '#9CA3AF',
      marginTop: 2,
    },
    card: {
      backgroundColor: colors.cardBg,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
      elevation: 2,
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
    },
    cardHeaderTitle: {
      fontSize: 11,
      fontFamily: fonts.extraBold,
      color: colors.muted,
      letterSpacing: 1,
      marginBottom: 12,
    },
    logoutButton: {
      height: 48,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.danger,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 8,
    },
    logoutButtonText: {
      color: colors.danger,
      fontSize: 13,
      fontFamily: fonts.extraBold,
      letterSpacing: 0.5,
    },
  });
}
