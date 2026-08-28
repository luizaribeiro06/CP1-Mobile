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
import { useState } from 'react';

import { ProfileCard } from '../components/ProfileCard';
import { ProfileForm } from '../components/ProfileForm';
import { ThemeSwitch } from '../components/ThemeSwitch';
import { getTheme } from '../theme/theme';
import type { User } from '../types/user';

type ProfileScreenProps = {
  user: User;
  isDark: boolean;
  onToggleTheme: () => void;
  onLogout: () => void;
  onBack: () => void;
  onSaveUser: (updatedUser: User) => Promise<void>;
};

export default function ProfileScreen({
  user,
  isDark,
  onToggleTheme,
  onLogout,
  onBack,
  onSaveUser,
}: ProfileScreenProps) {
  const { colors, fonts } = getTheme(isDark);
  const styles = getStyles(colors, fonts);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSaveUser(updatedUser: User) {
    // Remove espaços desnecessários
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

    // Impede números e caracteres especiais no nome
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

    // =========================
    // SALVAMENTO
    // =========================
    const validatedUser: User = {
      ...updatedUser,
      name,
      email,
    };

    try {
      setSaving(true);

      await onSaveUser(validatedUser);

      setEditing(false);

      Alert.alert(
        'Perfil atualizado',
        'Seus dados foram salvos com sucesso.',
      );
    } catch {
      Alert.alert(
        'Erro',
        'Não foi possível salvar suas alterações.',
      );

      throw new Error('profile-save-failed');
    } finally {
      setSaving(false);
    }
  }

  function handleCancelEdit() {
    setEditing(false);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.header}>

        <Text style={styles.headerTitle}>Meu Perfil</Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.greeting}>
          Olá, {user.name.split(' ')[0]}!
        </Text>

        {editing ? (
          <ProfileForm
            user={user}
            isDark={isDark}
            loading={saving}
            onSaveUser={handleSaveUser}
            onCancel={handleCancelEdit}
          />
        ) : (
          <ProfileCard
            user={user}
            isDark={isDark}
            onEdit={() => setEditing(true)}
          />
        )}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>TEMA</Text>

          <ThemeSwitch
            theme={isDark ? 'dark' : 'light'}
            onToggle={onToggleTheme}
            textColor={colors.text}
          />
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={onLogout}
        >
          <Text style={styles.logoutButtonText}>SAIR</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function getStyles(
  colors: ReturnType<typeof getTheme>['colors'],
  fonts: ReturnType<typeof getTheme>['fonts'],
) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },

    header: {
      backgroundColor: colors.headerBg,
      paddingTop: 55,
      paddingHorizontal: 20,
      paddingBottom: 18,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    backButton: {
      color: '#FFFFFF',
      fontSize: 14,
      fontFamily: fonts.bold,
    },

    headerTitle: {
      color: '#FFFFFF',
      fontSize: 16,
      fontFamily: fonts.extraBold,
    },

    headerSpacer: {
      width: 60,
    },

    content: {
      padding: 20,
      paddingBottom: 40,
      gap: 20,
    },

    greeting: {
      fontSize: 22,
      fontFamily: fonts.extraBold,
      color: colors.text,
    },

    card: {
      backgroundColor: colors.cardBg,
      borderRadius: 16,
      padding: 20,
      elevation: 3,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: {
        width: 0,
        height: 3,
      },
    },

    sectionTitle: {
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
    },

    logoutButtonText: {
      color: colors.danger,
      fontSize: 13,
      fontFamily: fonts.extraBold,
    },
  });
}

