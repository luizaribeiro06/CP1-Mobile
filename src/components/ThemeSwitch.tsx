import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import type { ThemeMode } from '../types/theme';

type ThemeSwitchProps = {
  theme: ThemeMode;
  onToggle: () => void;
  textColor: string;
};

export function ThemeSwitch({ theme, onToggle, textColor }: ThemeSwitchProps) {
  const isDark = theme === 'dark';

  return (
    <TouchableOpacity
      onPress={onToggle}
      style={styles.row}
      accessibilityRole="switch"
      accessibilityState={{ checked: isDark }}
      accessibilityLabel={`Alternar tema. Tema atual: ${isDark ? 'Escuro' : 'Claro'}`}
      accessibilityHint="Alterna entre o modo claro e o modo escuro do aplicativo"
      activeOpacity={0.7}
    >
      <Text style={[styles.text, { color: textColor }]}>
        {isDark
          ? '🌙 Dark ativo — trocar para Light ☀️'
          : '☀️ Light ativo — trocar para Dark 🌙'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 6,
  },
  text: {
    fontSize: 14,
    fontWeight: '700',
  },
});
