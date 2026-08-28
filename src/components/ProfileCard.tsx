import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getTheme } from '../theme/theme';
import type { User } from '../types/user';

type ProfileCardProps = {
  user: User;
  isDark: boolean;
  onEdit: () => void;
};

export function ProfileCard({ user, isDark, onEdit }: ProfileCardProps) {
  const { colors, fonts } = getTheme(isDark);
  const styles = getStyles(colors, fonts);

  return (
    <View style={styles.card}>
      <ProfileRow label="Nome" value={user.name} styles={styles} />
      <ProfileRow label="Usuário" value={user.username} styles={styles} />
      <ProfileRow label="E-mail" value={user.email} styles={styles} />
      <ProfileRow label="Telefone" value={user.phone || '-'} styles={styles} />
      <ProfileRow label="Cidade" value={user.city || '-'} styles={styles} />
      <ProfileRow label="Biografia" value={user.bio || '-'} styles={styles} />
      <ProfileRow
        label="Tema atual"
        value={isDark ? 'Dark' : 'Light'}
        styles={styles}
        last
      />

      <TouchableOpacity style={styles.primaryButton} onPress={onEdit}>
        <Text style={styles.primaryButtonText}>EDITAR PERFIL</Text>
      </TouchableOpacity>
    </View>
  );
}

function ProfileRow({
  label,
  value,
  styles,
  last,
}: {
  label: string;
  value: string;
  styles: ReturnType<typeof getStyles>;
  last?: boolean;
}) {
  return (
    <View style={[styles.row, last ? { borderBottomWidth: 0 } : undefined]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
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
      elevation: 3,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
    },
    row: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingVertical: 10,
    },
    rowLabel: {
      fontSize: 11,
      fontFamily: fonts.extraBold,
      color: colors.muted,
      letterSpacing: 0.5,
      marginBottom: 3,
    },
    rowValue: {
      fontSize: 15,
      fontFamily: fonts.semiBold,
      color: colors.text,
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
  });
}
