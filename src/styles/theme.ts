// Cores base do tema
export const baseColors = {
  // Cores principais
  background: '#131517',
  text: '#F3F5F7',
  primary: '#4A90E2',
  
  // Variantes do background
  backgroundLight: '#1E2124',
  backgroundLighter: '#2A2D30',
  backgroundDark: '#0F1113',
  
  // Variantes do texto
  textPrimary: '#F3F5F7',
  textSecondary: '#D1D5DB',
  textTertiary: '#9CA3AF',
  textMuted: '#6B7280',
  
  // Variantes do primary
  primaryLight: '#6BAED6',
  primaryLighter: '#8BC4E8',
  primaryDark: '#3B7BC8',
  primaryDarker: '#2E5AA8',
  
  // Cores de estado
  success: '#00B894',
  successLight: '#00CEC9',
  successDark: '#00A085',
  
  warning: '#F39C12',
  warningLight: '#F7DC6F',
  warningDark: '#E67E22',
  
  error: '#E74C3C',
  errorLight: '#FF6B6B',
  errorDark: '#C0392B',
  
  info: '#3498DB',
  infoLight: '#5DADE2',
  infoDark: '#2980B9',
  
  // Cores neutras
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

// Hook para usar as cores base
export const useBaseColors = (colorScheme?: any) => {
  // Por enquanto, sempre retorna as cores escuras
  // Você pode expandir isso para suportar tema claro/escuro baseado no colorScheme
  return baseColors;
};

// Tipos TypeScript
export type BaseColors = typeof baseColors; 