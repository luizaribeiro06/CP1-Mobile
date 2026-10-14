import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CustomInput } from './CustomInput';
import { getTheme } from '../theme/theme';
import type { User } from '../types/user';

type ProfileFormProps = {
  user: User;
  isDark: boolean;
  loading: boolean;
  onSaveUser: (updatedUser: User) => Promise<void>;
  onCancel: () => void;
};

type ProfileErrors = Partial<Record<'name' | 'email', string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ProfileForm({
  user,
  isDark,
  loading,
  onSaveUser,
  onCancel,
}: ProfileFormProps) {
  const { colors, fonts } = getTheme(isDark);
  const styles = getStyles(colors, fonts);

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [city, setCity] = useState(user.city);
  const [bio, setBio] = useState(user.bio);
  const [errors, setErrors] = useState<ProfileErrors>({});

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone);
    setCity(user.city);
    setBio(user.bio);
    setErrors({});
  }, [user]);

  function validate(): ProfileErrors {
    const nextErrors: ProfileErrors = {};

    if (!name.trim()) nextErrors.name = 'Informe seu nome.';

    if (!email.trim()) {
      nextErrors.email = 'Informe seu e-mail.';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      nextErrors.email = 'Informe um e-mail válido.';
    }

    return nextErrors;
  }

  async function handleSave() {
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    const updatedUser: User = {
      ...user,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      city: city.trim(),
      bio: bio.trim(),
    };

    await onSaveUser(updatedUser);
  }

  return (
    <View style={styles.card}>
      <CustomInput
        label="NOME"
        value={name}
        onChangeText={setName}
        error={errors.name}
        labelColor={colors.subtext}
        inputBackgroundColor={colors.inputBg}
        inputTextColor={colors.text}
        inputBorderColor={colors.inputBorder}
        placeholderColor={colors.placeholder}
        accessibilityRole="none"
        accessibilityLabel="Campo de nome completo"
        accessibilityHint="Altere seu nome completo"
      />

      <CustomInput
        label="E-MAIL"
        value={email}
        onChangeText={setEmail}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        labelColor={colors.subtext}
        inputBackgroundColor={colors.inputBg}
        inputTextColor={colors.text}
        inputBorderColor={colors.inputBorder}
        placeholderColor={colors.placeholder}
        accessibilityRole="none"
        accessibilityLabel="Campo de e-mail"
        accessibilityHint="Altere seu endereço de e-mail"
      />

      <CustomInput
        label="TELEFONE"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        labelColor={colors.subtext}
        inputBackgroundColor={colors.inputBg}
        inputTextColor={colors.text}
        inputBorderColor={colors.inputBorder}
        placeholderColor={colors.placeholder}
        accessibilityRole="none"
        accessibilityLabel="Campo de telefone"
        accessibilityHint="Altere seu telefone para contato"
      />

      <CustomInput
        label="CIDADE"
        value={city}
        onChangeText={setCity}
        labelColor={colors.subtext}
        inputBackgroundColor={colors.inputBg}
        inputTextColor={colors.text}
        inputBorderColor={colors.inputBorder}
        placeholderColor={colors.placeholder}
        accessibilityRole="none"
        accessibilityLabel="Campo de cidade"
        accessibilityHint="Altere sua cidade de residência"
      />

      <CustomInput
        label="BIOGRAFIA"
        value={bio}
        onChangeText={setBio}
        multiline
        style={styles.inputMultiline}
        labelColor={colors.subtext}
        inputBackgroundColor={colors.inputBg}
        inputTextColor={colors.text}
        inputBorderColor={colors.inputBorder}
        placeholderColor={colors.placeholder}
        accessibilityRole="none"
        accessibilityLabel="Campo de biografia"
        accessibilityHint="Escreva uma breve descrição sobre você"
      />

      <TouchableOpacity
        disabled={loading}
        style={styles.primaryButton}
        onPress={handleSave}
        accessibilityRole="button"
        accessibilityLabel="Salvar alterações do perfil"
        accessibilityHint="Confirma e salva suas alterações cadastrais"
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator color={colors.buttonText} />
        ) : (
          <Text style={styles.primaryButtonText}>SALVAR ALTERAÇÕES</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        disabled={loading}
        style={styles.secondaryButton}
        onPress={onCancel}
        accessibilityRole="button"
        accessibilityLabel="Cancelar edição do perfil"
        accessibilityHint="Descarta as alterações e volta à visualização"
        activeOpacity={0.7}
      >
        <Text style={styles.secondaryButtonText}>CANCELAR</Text>
      </TouchableOpacity>
    </View>
  );
}

function getStyles(
  colors: ReturnType<typeof getTheme>['colors'],
  fonts: ReturnType<typeof getTheme>['fonts'],
) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.cardBg,
      borderRadius: 16,
      padding: 20,
      gap: 0,
      elevation: 3,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
    },
    primaryButton: {
      height: 48,
      backgroundColor: colors.buttonBg,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 16,
    },
    primaryButtonText: {
      color: colors.buttonText,
      fontSize: 13,
      fontFamily: fonts.extraBold,
    },
    secondaryButton: {
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
    },
    secondaryButtonText: {
      color: colors.subtext,
      fontSize: 13,
      fontFamily: fonts.bold,
    },
    inputMultiline: {
      minHeight: 80,
      textAlignVertical: 'top',
    },
  });
}
