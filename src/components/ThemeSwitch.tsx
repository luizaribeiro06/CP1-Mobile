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
    <TouchableOpacity onPress={onToggle} style={styles.row}>
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
