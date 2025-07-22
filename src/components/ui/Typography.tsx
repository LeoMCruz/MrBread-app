import clsx from "clsx";
import { Text, TextProps, TextStyle } from "react-native";
import { useBaseColors } from "@/styles/theme";

interface TypographyProps extends TextProps {
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "body"
    | "body-secondary"
    | "caption"
    | "link";
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
  color?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "muted"
    | "success"
    | "warning"
    | "error"
    | "white";
  className?: string;
  style?: TextStyle;
  children: React.ReactNode;
}

export default function Typography({
  variant = "body",
  size,
  color,
  className,
  style,
  children,
  ...rest
}: TypographyProps) {
  const colors = useBaseColors();

  // 🎨 Mapeamento de cores
  const colorMap: Record<string, string> = {
    primary: colors.textPrimary,
    secondary: colors.textSecondary,
    tertiary: colors.textTertiary,
    muted: colors.textMuted,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    white: colors.white,
  };

  // 🔠 Mapeamento de tamanhos do Tailwind
  const sizeClassMap: Record<string, string> = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
  };

  // 🧬 Mapeamento de variantes para classes (sem cores para permitir override)
  const variantClassMap: Record<string, string> = {
    h1: "text-3xl font-bold",
    h2: "text-2xl font-semibold",
    h3: "text-xl font-semibold",
    body: "text-base",
    "body-secondary": "text-base text-gray-300",
    caption: "text-sm text-gray-400",
    link: "text-base font-medium text-blue-500",
  };

  // Determinar o tamanho baseado na variante se não especificado
  const getSizeFromVariant = (variant: string): string => {
    switch (variant) {
      case "h1": return "3xl";
      case "h2": return "2xl";
      case "h3": return "xl";
      case "body":
      case "body-secondary":
      case "link": return "base";
      case "caption": return "sm";
      default: return "base";
    }
  };

  const finalSize = size || getSizeFromVariant(variant);
  const variantClass = variantClassMap[variant];
  const sizeClass = sizeClassMap[finalSize];
  const computedFontColor = color ? colorMap[color] : undefined;

  const textClassName = clsx(
    variantClass, 
    sizeClass, 
    // Adiciona cor branca padrão se não houver cor customizada
    !className?.includes('text-') && !color && 'text-white',
    className
  );

  return (
    <Text
      className={textClassName}
      style={[
        computedFontColor && { color: computedFontColor },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
} 