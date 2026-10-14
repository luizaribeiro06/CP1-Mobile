import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { useTheme } from '../hooks/useTheme';

type WelcomeScreenProps = {
  onEnter?: () => void;
  navigation?: {
    navigate: (screen: string) => void;
  };
};

export function WelcomeScreen({ onEnter, navigation }: WelcomeScreenProps) {
  const { colors, fonts } = useTheme();
  const { height, width } = useWindowDimensions();

  const isDesktop = width >= 768;

  const styles = getStyles(
    colors,
    fonts,
    height,
    width,
    isDesktop,
  );

  function handlePressEnter() {
    if (onEnter) {
      onEnter();
    } else if (navigation) {
      navigation.navigate('Login');
    }
  }

  return (
    <View style={styles.container}>
      {/* LADO DA FOTO */}
      <ImageBackground
        source={require('../../assets/torcida.jpg')}
        style={styles.imageSide}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        {/* Conteúdo no mobile */}
        {!isDesktop && (
          <View style={styles.mobileContent}>
            <View>
              <Text style={styles.logo}>FIEL PROFILE</Text>

              <Text style={styles.title}>
                Sua paixão.
                {'\n'}
                Seu perfil.
                {'\n'}
                Sua história.
              </Text>

              <Text style={styles.subtitle}>
                Um espaço feito para você.
              </Text>
            </View>

            <Pressable
              onPress={handlePressEnter}
              accessibilityRole="button"
              accessibilityLabel="Entrar no aplicativo FIEL PROFILE"
              accessibilityHint="Avança para a tela de login"
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.buttonText}>ENTRE NO SEU PERFIL</Text>
            </Pressable>
          </View>
        )}
      </ImageBackground>

      {/* LADO PRETO */}
      {isDesktop && (
        <View style={styles.desktopSide}>
          <View>
            <Text style={styles.logo}>FIEL PROFILE</Text>

            <Text style={styles.title}>
              Sua paixão.
              {'\n'}
              Seu checklist.
              {'\n'}
              Dia de jogo.
            </Text>

            <Text style={styles.subtitle}>
              Um espaço feito para você.
            </Text>
          </View>

          <Pressable
            onPress={handlePressEnter}
            accessibilityRole="button"
            accessibilityLabel="Entrar no aplicativo FIEL PROFILE"
            accessibilityHint="Avança para a tela de login"
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>ENTRE NO SEU PERFIL</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

function getStyles(
  colors: ReturnType<typeof useTheme>['colors'],
  fonts: ReturnType<typeof useTheme>['theme']['fonts'],
  height: number,
  width: number,
  isDesktop: boolean,
) {
  return StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      height: '100%',
      flexDirection: isDesktop ? 'row' : 'column',
      backgroundColor: '#000000',
    },
    imageSide: {
      flex: isDesktop ? 1 : undefined,
      width: isDesktop ? undefined : '100%',
      height: isDesktop ? '100%' : '100%',
      minWidth: 0,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.48)',
    },
    mobileContent: {
      flex: 1,
      justifyContent: 'space-between',
      paddingHorizontal: 28,
      paddingTop: 70,
      paddingBottom: 45,
    },
    desktopSide: {
      flex: 1,
      height: '100%',
      minWidth: 0,
      backgroundColor: '#000000',
      justifyContent: 'space-between',
      paddingHorizontal: 60,
      paddingTop: 70,
      paddingBottom: 60,
    },
    logo: {
      color: '#FFFFFF',
      fontSize: isDesktop ? 16 : 14,
      fontFamily: fonts.bold,
      letterSpacing: 2,
      marginBottom: 25,
    },
    title: {
      color: '#FFFFFF',
      fontSize: isDesktop
        ? Math.min(48, width * 0.04)
        : Math.min(38, width * 0.10),
      lineHeight: isDesktop
        ? Math.min(54, width * 0.045)
        : Math.min(42, width * 0.11),
      fontFamily: fonts.black,
    },
    subtitle: {
      color: '#FFFFFF',
      opacity: 0.85,
      fontSize: isDesktop ? 16 : Math.min(14, width * 0.04),
      lineHeight: isDesktop ? 24 : Math.min(21, width * 0.055),
      fontFamily: fonts.regular,
      marginTop: 18,
    },
    button: {
      width: '100%',
      maxWidth: isDesktop ? 420 : undefined,
      height: Math.min(54, Math.max(45, height * 0.07)),
      alignSelf: 'center',
      borderRadius: 28,
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: '#111111',
      fontSize: isDesktop ? 14 : Math.min(13, width * 0.037),
      fontFamily: fonts.extraBold,
      letterSpacing: 0.5,
    },
    buttonPressed: {
      opacity: 0.8,
    },
  });
}
