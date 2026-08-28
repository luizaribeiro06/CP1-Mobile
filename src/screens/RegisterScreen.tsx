import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';

import { CustomInput } from '../components/CustomInput';
import { getTheme } from '../theme/theme';
import { saveUser } from '../services/storageService';
import type { User } from '../types/user';

type RegisterScreenProps = {
  onGoToLogin: () => void;
  onRegistered: (user: User) => void;
  isDark: boolean;
};

type RegisterField =
  | 'name'
  | 'username'
  | 'email'
  | 'password'
  | 'confirmPassword';

type RegisterErrors = Partial<Record<RegisterField, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RegisterScreen({
  onGoToLogin,
  onRegistered,
  isDark
}: RegisterScreenProps) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [loading, setLoading] = useState(false);

  const { colors, fonts } = getTheme(isDark);
  const styles = getStyles(colors, fonts);

  function validateForm(): RegisterErrors {
    const nextErrors: RegisterErrors = {};

    if (!name.trim()) {
      nextErrors.name = 'Informe seu nome.';
    }

    if (!username.trim()) {
      nextErrors.username = 'Informe um nome de usuário.';
    }

    if (!email.trim()) {
      nextErrors.email = 'Informe seu e-mail.';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      nextErrors.email = 'Informe um e-mail válido.';
    }

    if (!password) {
      nextErrors.password = 'Informe sua senha.';
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Confirme sua senha.';
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = 'As senhas não são iguais.';
    }

    return nextErrors;
  }

  async function handleRegister() {
    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: name.trim(),
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password,
      phone: '',
      city: '',
      bio: '',
    };

    try {
      setLoading(true);
      await saveUser(newUser);

      Alert.alert(
        'Cadastro realizado',
        'Seu usuário foi salvo. Agora faça o login.',
      );

      onRegistered(newUser);
    } catch {
      Alert.alert(
        'Erro no cadastro',
        'Não foi possível salvar seu usuário no dispositivo.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Image
            source={require('../../assets/icon_corinthians.png')}
            style={styles.crest}
          />
          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.subtitle}>
            Preencha os dados para cadastrar seu perfil localmente.
          </Text>
        </View>

        <View style={styles.form}>
          <CustomInput
            label="NOME"
            placeholder="Digite seu nome completo"
            value={name}
            onChangeText={setName}
            error={errors.name}
          />

          <CustomInput
            label="NOME DE USUÁRIO"
            placeholder="Ex.: anderson123"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
            error={errors.username}
          />

          <CustomInput
            label="E-MAIL"
            placeholder="anderson@email.com"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
          />

          <CustomInput
            label="SENHA"
            placeholder="Digite sua senha"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            error={errors.password}
          />

          <CustomInput
            label="CONFIRMAÇÃO DE SENHA"
            placeholder="Digite a senha novamente"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={errors.confirmPassword}
          />

          <Pressable
            disabled={loading}
            onPress={handleRegister}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed ? styles.buttonPressed : undefined,
              loading ? styles.buttonDisabled : undefined,
            ]}
          >
            {loading ? (
              <ActivityIndicator color={colors.buttonText} />
            ) : (
              <Text style={styles.primaryButtonText}>CADASTRAR</Text>
            )}
          </Pressable>

          <Pressable onPress={onGoToLogin} style={styles.linkButton}>
            <Text style={styles.link}>
              Já tem cadastro? <Text style={styles.linkBold}>Entrar</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
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
      flexGrow: 1,
      justifyContent: 'center',
      padding: 24,
      gap: 28,
    },
    header: {
      alignItems: 'center',
      gap: 6,
    },
    crest: {
      width: 70,
      height: 70,
      resizeMode: 'contain',
    },
    title: {
      color: colors.text,
      fontSize: 24,
      fontFamily: fonts.extraBold,
    },
    subtitle: {
      color: colors.subtext,
      fontSize: 13,
      fontFamily: fonts.regular,
      textAlign: 'center',
      lineHeight: 20,
    },
    form: {
      gap: 16,
    },
    primaryButton: {
      height: 52,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      backgroundColor: colors.buttonBg,
      marginTop: 6,
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
  });
}