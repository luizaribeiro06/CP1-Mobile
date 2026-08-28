import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';

import { CustomInput } from '../components/CustomInput';
import { getTheme } from '../theme/theme';
import { getUser, saveSession } from '../services/storageService';
import type { User } from '../types/user';

type LoginScreenProps = {
  onGoToRegister: () => void;
  onLogin: (user: User) => void;
  isDark: boolean;
};

type LoginErrors = {
  username?: string;
  password?: string;
  credentials?: string;
};

export function LoginScreen({ onGoToRegister, onLogin, isDark }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState(false);

  const { colors, fonts } = getTheme(isDark);
  const styles = getStyles(colors, fonts);

  async function handleLogin() {
    const nextErrors: LoginErrors = {};

    if (!username.trim()) {
      nextErrors.username = 'Informe seu nome de usuário.';
    }

    if (!password) {
      nextErrors.password = 'Informe sua senha.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);

      const storedUser = await getUser();

      if (
        !storedUser ||
        storedUser.username !== username.trim() ||
        storedUser.password !== password
      ) {
        setErrors({ credentials: 'Nome de usuário ou senha incorretos.' });
        return;
      }

      await saveSession({ userId: storedUser.id });
      setErrors({});
      onLogin(storedUser);
    } catch {
      setErrors({
        credentials: 'Não foi possível realizar o login. Tente novamente.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}
    >
      <View style={styles.content}>
        <View style={styles.brand}>
          <Image
            source={require('../../assets/icon_corinthians.png')}
            style={styles.crest}
          />

          <Text style={styles.logo}>FIEL PROFILE</Text>
          <Text style={styles.subtitle}>Entre com seu usuário cadastrado</Text>
        </View>

        <View style={styles.form}>
          <CustomInput
            label="NOME DE USUÁRIO"
            placeholder="Digite seu usuário"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
            error={errors.username}
          />

          <CustomInput
            label="SENHA"
            placeholder="Digite sua senha"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            error={errors.password}
          />

          {errors.credentials ? (
            <Text style={styles.credentialsError}>{errors.credentials}</Text>
          ) : null}

          <Pressable
            disabled={loading}
            onPress={handleLogin}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed ? styles.buttonPressed : undefined,
              loading ? styles.buttonDisabled : undefined,
            ]}
          >
            {loading ? (
              <ActivityIndicator color={colors.buttonText} />
            ) : (
              <Text style={styles.primaryButtonText}>Entrar</Text>
            )}
          </Pressable>

          <Pressable onPress={onGoToRegister} style={styles.linkButton}>
            <Text style={styles.link}>
              Ainda não tem cadastro? <Text style={styles.linkBold}>Cadastrar</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function getStyles(
  colors: ReturnType<typeof getTheme>['colors'],
  fonts: ReturnType<typeof getTheme>['fonts'],
) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 28,
    },
    brand: {
      alignItems: 'center',
      marginBottom: 44,
    },
    logo: {
      fontSize: 22,
      fontFamily: fonts.black,
      color: colors.text,
      letterSpacing: 1,
    },
    crest: {
      width: 70,
      height: 70,
      resizeMode: 'contain',
    },
    subtitle: {
      fontSize: 13,
      fontFamily: fonts.regular,
      color: colors.subtext,
      marginTop: 6,
    },
    form: {
      gap: 16,
    },
    credentialsError: {
      color: colors.danger,
      fontSize: 13,
      textAlign: 'center',
      fontFamily: fonts.semiBold,
    },
    primaryButton: {
      height: 52,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      backgroundColor: colors.buttonBg,
      marginTop: 8,
    },
    primaryButtonText: {
      color: colors.buttonText,
      fontSize: 13,
      fontFamily: fonts.extraBold,
      letterSpacing: 1,
    },
    buttonPressed: {
      opacity: 0.85,
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    linkButton: {
      paddingVertical: 8,
    },
    link: {
      textAlign: 'center',
      color: colors.danger,
      fontFamily: fonts.regular,
      fontSize: 13,
    },
    linkBold: {
      color: colors.danger,
      fontFamily: fonts.extraBold,
    }
  });
}