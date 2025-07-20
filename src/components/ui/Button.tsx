import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import clsx from "clsx";
import { useBaseColors } from "@/styles/theme";

interface Props {
  title: string | React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "error" | "warning" | "outlined";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onPress?: () => void;
}

export default function Button({
  title,
  variant = "primary",
  leftIcon,
  rightIcon,
  fullWidth = true,
  onPress,
  disabled = false,
  loading = false,
  className
}: Props) {
  const colors = useBaseColors();
  const baseClass = "flex-row rounded-lg items-center justify-center gap-2 h-12 px-4 py-3 flex-shrink-0";

  const buttonClass = clsx(
    baseClass,
    className,
    fullWidth && "flex-grow",

    // Estilo para botão ativo
    !disabled && {
      // Primary
      "bg-blue-500": variant === "primary",
      // Secondary
      "bg-gray-800 border border-blue-500": variant === "secondary",
      // Success
      "bg-green-500": variant === "success",
      // Error
      "bg-red-500": variant === "error",
      // Warning
      "bg-yellow-500": variant === "warning",
      // Outlined
      "bg-transparent border border-blue-500": variant === "outlined",
    },

    // Estilo para botão desabilitado
    disabled && "bg-gray-600 opacity-50"
  );

  const textClass = clsx(
    "text-base font-semibold",

    // Texto ativo
    !disabled && {
      // Primary, Success, Error, Warning
      "text-white": ["primary", "success", "error", "warning"].includes(variant),
      // Secondary e Outlined
      "text-blue-500": variant === "secondary" || variant === "outlined",
    },

    // Texto desativado
    disabled && "text-white"
  );

  return (
    <Pressable
      className={buttonClass}
      onPress={!disabled ? onPress : undefined}
      accessibilityState={{ disabled }}
    >
      {!loading && (
        <>
          {leftIcon && <View>{leftIcon}</View>}
          <Text className={textClass}>{title}</Text>
          {rightIcon && <View>{rightIcon}</View>}
        </>
      )}
      {loading && (
        <ActivityIndicator 
          color={variant === 'outlined' || variant === 'secondary' ? colors.primary : colors.white} 
          size="small" 
        />
      )}
    </Pressable>
  );
} 