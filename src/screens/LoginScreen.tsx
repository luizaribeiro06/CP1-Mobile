import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { CustomInput } from '../components/CustomInput';
import { ThemeSwitch } from '../components/ThemeSwitch';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import type { User } from '../types/user';

type LoginScreenProps = {
  onGoToRegister?: () => void;
  onLogin?: (user: User) => void;
  navigation?: {
    navigate: (screen: string) => void;
  };
};

type LoginErrors = {
  username?: string;
  password?: string;
  credentials?: string;
};

export function LoginScreen({ onGoToRegister, onLogin, navigation }: LoginScreenProps) {
  const { login } = useAuth();
  const { colors, fonts, isDark, toggleTheme } = useTheme();
  const styles = getStyles(colors, fonts);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState(false);

  function handleNavigateRegister() {
    if (onGoToRegister) {
      onGoToRegister();
    } else if (navigation) {
      navigation.navigate('Register');
    }
  }

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
      const result = await login(username, password);

      if (!result.success) {
        setErrors({ credentials: result.error || 'Nome de usuário ou senha incorretos.' });
        return;
      }

      setErrors({});
      if (onLogin) {
        // Compatibilidade legada se chamado via callback
        onLogin({
          id: 'logged_user',
          username,
          name: username,
          email: '',
          phone: '',
          city: '',
          bio: '',
          role: result.role || 'user',
        });
      }
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
            accessibilityRole="image"
            accessibilityLabel="Escudo do Corinthians"
          />

          <Text style={styles.logo}>FIELFLOW</Text>
          <Text style={styles.subtitle}>MatchDay Checklist do Timão</Text>

          {/* Dica de credenciais de teste para o avaliador */}
          <View style={styles.hintBox}>
            <Text style={styles.hintTitle}>Contas de teste:</Text>
            <Text style={styles.hintText}>• Admin: <Text style={styles.hintBold}>admin</Text> / senha: <Text style={styles.hintBold}>123</Text></Text>
            <Text style={styles.hintText}>• Usuário: <Text style={styles.hintBold}>user</Text> / senha: <Text style={styles.hintBold}>123</Text></Text>
          </View>
        </View>

        <View style={styles.form}>
          <CustomInput
            label="NOME DE USUÁRIO"
            placeholder="Digite seu usuário (ex: admin ou user)"
            autoCapitalize="none"
            value={username}
            onChangeText={(val) => {
              setUsername(val);
              if (errors.username || errors.credentials) {
                setErrors((prev) => ({ ...prev, username: undefined, credentials: undefined }));
              }
            }}
            error={errors.username}
            labelColor={colors.subtext}
            inputBackgroundColor={colors.inputBg}
            inputTextColor={colors.text}
            inputBorderColor={colors.inputBorder}
            placeholderColor={colors.placeholder}
            accessibilityRole="none"
            accessibilityLabel="Nome de usuário para login"
            accessibilityHint="Digite o nome de usuário da sua conta"
          />

          <CustomInput
            label="SENHA"
            placeholder="Digite sua senha"
            secureTextEntry
            value={password}
            onChangeText={(val) => {
              setPassword(val);
              if (errors.password || errors.credentials) {
                setErrors((prev) => ({ ...prev, password: undefined, credentials: undefined }));
              }
            }}
            error={errors.password}
            labelColor={colors.subtext}
            inputBackgroundColor={colors.inputBg}
            inputTextColor={colors.text}
            inputBorderColor={colors.inputBorder}
            placeholderColor={colors.placeholder}
            accessibilityRole="none"
            accessibilityLabel="Senha para login"
            accessibilityHint="Digite sua senha de acesso"
          />

          {errors.credentials ? (
            <Text style={styles.credentialsError}>{errors.credentials}</Text>
          ) : null}

          <Pressable
            disabled={loading}
            onPress={handleLogin}
            accessibilityRole="button"
            accessibilityLabel="Entrar no aplicativo"
            accessibilityHint="Autentica suas credenciais e entra no FielFlow"
            style={({ pressed }) => [
              styles.primaryButton,
              pressed ? styles.buttonPressed : undefined,
              loading ? styles.buttonDisabled : undefined,
            ]}
          >
            {loading ? (
              <ActivityIndicator color={colors.buttonText} />
            ) : (
              <Text style={styles.primaryButtonText}>ENTRAR</Text>
            )}
          </Pressable>

          <Pressable
            onPress={handleNavigateRegister}
            accessibilityRole="button"
            accessibilityLabel="Ir para cadastro de nova conta"
            accessibilityHint="Abre o formulário para criar uma conta de torcedor"
            style={styles.linkButton}
          >
            <Text style={styles.link}>
              Ainda não tem cadastro? <Text style={styles.linkBold}>Cadastrar</Text>
            </Text>
          </Pressable>

          {/* ALTERNÂNCIA DE TEMA DARK/LIGHT NA TELA DE LOGIN */}
          <View style={styles.themeContainer}>
            <ThemeSwitch
              theme={isDark ? 'dark' : 'light'}
              onToggle={toggleTheme}
              textColor={colors.text}
            />
          </View>
        </View>
      </View>
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
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 28,
    },
    brand: {
      alignItems: 'center',
      marginBottom: 24,
    },
    logo: {
      fontSize: 22,
      fontFamily: fonts.black,
      color: colors.text,
      letterSpacing: 1,
      marginTop: 8,
    },
    crest: {
      width: 64,
      height: 64,
      resizeMode: 'contain',
    },
    subtitle: {
      fontSize: 13,
      fontFamily: fonts.regular,
      color: colors.subtext,
      marginTop: 4,
    },
    hintBox: {
      marginTop: 12,
      paddingVertical: 6,
      paddingHorizontal: 14,
      borderRadius: 8,
      backgroundColor: colors.circleBg,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
    },
    hintTitle: {
      fontSize: 11,
      fontFamily: fonts.bold,
      color: colors.muted,
      marginBottom: 2,
    },
    hintText: {
      fontSize: 11,
      fontFamily: fonts.medium,
      color: colors.subtext,
    },
    hintBold: {
      fontFamily: fonts.bold,
      color: colors.text,
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
    },
    themeContainer: {
      alignItems: 'center',
      marginTop: 6,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
  });
}