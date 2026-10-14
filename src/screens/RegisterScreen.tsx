import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { CustomInput } from '../components/CustomInput';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import type { RootStackParamList } from '../types/navigation';
import type { User } from '../types/user';

type RegisterScreenProps = {
  onGoToLogin?: () => void;
  onRegistered?: (user: User) => void;
  navigation?: {
    navigate: (screen: string) => void;
  };
  isDark?: boolean;
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
  navigation: propNavigation,
}: RegisterScreenProps) {
  const { register } = useAuth();
  const { colors, fonts } = useTheme();
  const styles = getStyles(colors, fonts);
  const hookNavigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [loading, setLoading] = useState(false);

  function handleNavigateLogin() {
    if (onGoToLogin) {
      onGoToLogin();
    } else if (propNavigation) {
      propNavigation.navigate('Login');
    } else {
      hookNavigation.navigate('Login');
    }
  }

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
      role: 'user', // Todos os cadastros locais recebem perfil de torcedor comum (role: 'user')
    };

    try {
      setLoading(true);
      await register(newUser);

      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          window.alert('Cadastro realizado com sucesso! Agora faça o login.');
        }
        if (onRegistered) {
          onRegistered(newUser);
        } else {
          handleNavigateLogin();
        }
      } else {
        Alert.alert(
          'Cadastro realizado',
          'Seu torcedor foi salvo com sucesso. Agora faça o login.',
          [
            {
              text: 'OK',
              onPress: () => {
                if (onRegistered) {
                  onRegistered(newUser);
                } else {
                  handleNavigateLogin();
                }
              },
            },
          ],
        );
      }
    } catch {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.alert('Não foi possível salvar seu usuário no dispositivo.');
      } else {
        Alert.alert(
          'Erro no cadastro',
          'Não foi possível salvar seu usuário no dispositivo.',
        );
      }
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
            accessibilityRole="image"
            accessibilityLabel="Escudo do Corinthians"
          />
          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.subtitle}>
            Cadastre seu perfil de torcedor do Timão para acessar o MatchDay Checklist.
          </Text>
        </View>

        <View style={styles.form}>
          <CustomInput
            label="NOME"
            placeholder="Digite seu nome completo"
            value={name}
            onChangeText={setName}
            error={errors.name}
            labelColor={colors.subtext}
            inputBackgroundColor={colors.inputBg}
            inputTextColor={colors.text}
            inputBorderColor={colors.inputBorder}
            placeholderColor={colors.placeholder}
            accessibilityRole="none"
            accessibilityLabel="Nome completo"
            accessibilityHint="Digite seu nome completo para o cadastro"
          />

          <CustomInput
            label="NOME DE USUÁRIO"
            placeholder="Ex.: fiel_torcedor"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
            error={errors.username}
            labelColor={colors.subtext}
            inputBackgroundColor={colors.inputBg}
            inputTextColor={colors.text}
            inputBorderColor={colors.inputBorder}
            placeholderColor={colors.placeholder}
            accessibilityRole="none"
            accessibilityLabel="Nome de usuário"
            accessibilityHint="Digite o nome de usuário desejado para login"
          />

          <CustomInput
            label="E-MAIL"
            placeholder="torcedor@email.com"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            labelColor={colors.subtext}
            inputBackgroundColor={colors.inputBg}
            inputTextColor={colors.text}
            inputBorderColor={colors.inputBorder}
            placeholderColor={colors.placeholder}
            accessibilityRole="none"
            accessibilityLabel="Endereço de e-mail"
            accessibilityHint="Digite um e-mail válido para sua conta"
          />

          <CustomInput
            label="SENHA"
            placeholder="Digite sua senha"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            labelColor={colors.subtext}
            inputBackgroundColor={colors.inputBg}
            inputTextColor={colors.text}
            inputBorderColor={colors.inputBorder}
            placeholderColor={colors.placeholder}
            accessibilityRole="none"
            accessibilityLabel="Senha de cadastro"
            accessibilityHint="Digite uma senha para proteger sua conta"
          />

          <CustomInput
            label="CONFIRMAÇÃO DE SENHA"
            placeholder="Digite a senha novamente"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={errors.confirmPassword}
            labelColor={colors.subtext}
            inputBackgroundColor={colors.inputBg}
            inputTextColor={colors.text}
            inputBorderColor={colors.inputBorder}
            placeholderColor={colors.placeholder}
            accessibilityRole="none"
            accessibilityLabel="Confirmação de senha"
            accessibilityHint="Repita a mesma senha informada acima"
          />

          <Pressable
            disabled={loading}
            onPress={handleRegister}
            accessibilityRole="button"
            accessibilityLabel="Cadastrar nova conta"
            accessibilityHint="Salva os dados de cadastro e cria sua conta de torcedor"
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

          <Pressable
            onPress={handleNavigateLogin}
            accessibilityRole="button"
            accessibilityLabel="Voltar para a tela de login"
            accessibilityHint="Retorna à tela de autenticação"
            style={styles.linkButton}
          >
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
  colors: ReturnType<typeof useTheme>['colors'],
  fonts: ReturnType<typeof useTheme>['theme']['fonts'],
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
      width: 64,
      height: 64,
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