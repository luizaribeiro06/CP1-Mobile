import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

type LoadingProps = {
  message?: string;
  fullScreen?: boolean;
};

export function Loading({ message, fullScreen = false }: LoadingProps) {
  return (
    <View
      style={[styles.container, fullScreen ? styles.fullScreen : undefined]}
      accessibilityRole="progressbar"
      accessibilityLabel={message || 'Carregando informações'}
    >
      <ActivityIndicator size="large" />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  fullScreen: {
    flex: 1,
  },
  message: {
    fontSize: 13,
    color: '#666666',
  },
});
