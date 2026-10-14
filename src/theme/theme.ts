import type { ThemeMode } from '../types/theme';

// ---- FONTES ----
export const fonts = {
    regular: 'Poppins_400Regular',
    medium: 'Poppins_500Medium',
    semiBold: 'Poppins_600SemiBold',
    bold: 'Poppins_700Bold',
    extraBold: 'Poppins_800ExtraBold',
    black: 'Poppins_900Black',
} as const;

// ---- CORES POR TEMA ----
const lightColors = {
    bg: '#F5F5F5',
    headerBg: '#000000',
    cardBg: '#FFFFFF',
    text: '#111111',
    subtext: '#555555',
    muted: '#888888',
    border: '#EEEEEE',
    circleBg: '#F1F1F1',
    inputBg: '#F7F7F7',
    inputBorder: '#EEEEEE',
    placeholder: '#999999',
    buttonBg: '#000000',
    buttonText: '#FFFFFF',
    danger: '#C62828',
    onDark: '#FFFFFF',
} as const;

const darkColors = {
    bg: '#121212',
    headerBg: '#000000',
    cardBg: '#1E1E1E',
    text: '#FFFFFF',
    subtext: '#AAAAAA',
    muted: '#888888',
    border: '#333333',
    circleBg: '#2A2A2A',
    inputBg: '#2A2A2A',
    inputBorder: '#333333',
    placeholder: '#777777',
    buttonBg: '#FFFFFF',
    buttonText: '#000000',
    danger: '#E57373',
    onDark: '#000000',
} as const;

export type ThemeColors = typeof lightColors | typeof darkColors;

// ---- ESPAÇAMENTO ----
export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 20,
    xl: 28,
} as const;

export const radius = {
    sm: 8,
    md: 12,
    lg: 16,
    full: 999,
} as const;

// ---- HELPER PRINCIPAL ----
export function getTheme(isDark: boolean) {
    return {
        colors: isDark ? darkColors : lightColors,
        fonts,
        spacing,
        radius,
    };
}

export function isValidThemeMode(value: string | null): value is ThemeMode {
    return value === 'light' || value === 'dark';
}