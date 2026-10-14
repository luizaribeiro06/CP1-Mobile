import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

type HeaderProps = {
  subtitle?: string;
};

export function Header({ subtitle }: HeaderProps) {
  const { user, logout } = useAuth();
  const { colors, fonts } = useTheme();
  const styles = getStyles(colors, fonts);

  const firstName = user?.name ? user.name.split(' ')[0] : 'Torcedor';
  const roleLabel = user?.role === 'admin' ? 'ADMIN' : 'USUÁRIO';
  const isAdmin = user?.role === 'admin';

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.userInfo}>
          <Image
            source={require('../../assets/icon_corinthians.png')}
            style={styles.crest}
            accessibilityRole="image"
            accessibilityLabel="Escudo do Corinthians"
          />
          <View style={styles.nameBlock}>
            <Text style={styles.greeting} numberOfLines={1}>
              Fiel Torcedor, <Text style={styles.nameHighlight}>{firstName}</Text>
            </Text>
            <View style={styles.metaRow}>
              <View style={[styles.roleBadge, isAdmin ? styles.adminBadge : styles.userBadge]}>
                <Text style={[styles.roleText, isAdmin ? styles.adminText : styles.userText]}>
                  {roleLabel}
                </Text>
              </View>
              {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
          accessibilityRole="button"
          accessibilityLabel="Sair da conta"
          accessibilityHint="Encerra a sessão atual e retorna à tela de login"
          activeOpacity={0.7}
        >
          <Text style={styles.logoutText}>SAIR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function getStyles(
  colors: ReturnType<typeof useTheme>['colors'],
  fonts: ReturnType<typeof useTheme>['theme']['fonts'],
) {
  return StyleSheet.create({
    container: {
      backgroundColor: colors.headerBg,
      paddingTop: 52,
      paddingHorizontal: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#222222',
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      marginRight: 12,
    },
    crest: {
      width: 42,
      height: 42,
      resizeMode: 'contain',
      marginRight: 12,
    },
    nameBlock: {
      flex: 1,
    },
    greeting: {
      fontSize: 16,
      fontFamily: fonts.semiBold,
      color: '#FFFFFF',
    },
    nameHighlight: {
      fontFamily: fonts.extraBold,
      color: '#FFFFFF',
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
      gap: 8,
    },
    roleBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
      alignSelf: 'flex-start',
    },
    adminBadge: {
      backgroundColor: '#D97706',
    },
    userBadge: {
      backgroundColor: '#262626',
      borderWidth: 1,
      borderColor: '#404040',
    },
    roleText: {
      fontSize: 10,
      fontFamily: fonts.bold,
      letterSpacing: 0.5,
    },
    adminText: {
      color: '#FFFFFF',
    },
    userText: {
      color: '#E5E5E5',
    },
    subtitle: {
      fontSize: 11,
      fontFamily: fonts.regular,
      color: '#AAAAAA',
    },
    logoutButton: {
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.danger,
      backgroundColor: 'transparent',
    },
    logoutText: {
      color: colors.danger,
      fontSize: 11,
      fontFamily: fonts.bold,
      letterSpacing: 0.5,
    },
  });
}
