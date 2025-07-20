import clsx from 'clsx';

// Utilitários para classes condicionais
export const buttonStyles = {
  base: "px-4 py-2 rounded-lg font-semibold",
  primary: "bg-blue-500 text-white",
  secondary: "bg-gray-500 text-white",
  success: "bg-green-500 text-white",
  danger: "bg-red-500 text-white",
  disabled: "bg-gray-400 text-gray-600 cursor-not-allowed",
};

export const cardStyles = {
  base: "p-4 rounded-lg shadow-lg",
  light: "bg-white dark:bg-gray-800",
  colored: "bg-blue-50 dark:bg-blue-900",
};

export const textStyles = {
  base: "font-semibold",
  light: "text-gray-900 dark:text-white",
  colored: "text-blue-800 dark:text-blue-200",
};

// Função utilitária para botões
export const getButtonClasses = (
  variant: 'primary' | 'secondary' | 'success' | 'danger' = 'primary',
  disabled: boolean = false
) => {
  return clsx(
    buttonStyles.base,
    disabled ? buttonStyles.disabled : buttonStyles[variant]
  );
};

// Função utilitária para cards
export const getCardClasses = (
  variant: 'light' | 'colored' = 'light',
  additionalClasses?: string
) => {
  return clsx(
    cardStyles.base,
    cardStyles[variant],
    additionalClasses
  );
};

// Função utilitária para textos
export const getTextClasses = (
  variant: 'light' | 'colored' = 'light',
  additionalClasses?: string
) => {
  return clsx(
    textStyles.base,
    textStyles[variant],
    additionalClasses
  );
}; 