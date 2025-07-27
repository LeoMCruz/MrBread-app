import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import clsx from "clsx";
import { useBaseColors } from "@/styles/theme";

interface Props {
  title: string | React.ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "warning"
    | "outlined";
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
  className,
}: Props) {
  const colors = useBaseColors();
  const baseClass =
    "flex-row rounded-lg items-center justify-center gap-2 flex-shrink-0";

  const buttonClass = clsx(
    baseClass,
    className,
    fullWidth && "flex-grow",
    // Altura e padding padrão apenas se não for especificada na className
    !className?.includes("h-") && "h-12 px-4 py-3",
    // Para botões pequenos, ajustar padding
    className?.includes("h-8") && "px-2 py-1",
    className?.includes("h-10") && "px-3 py-2",

    // Estilo para botão ativo
    !disabled && {
      "bg-blue-500": variant === "primary",
      "bg-gray-800 border border-blue-500": variant === "secondary",
      "bg-green-500": variant === "success",
      "bg-red-500": variant === "error",
      "bg-yellow-500": variant === "warning",
      "bg-transparent border border-blue-500": variant === "outlined",
    },

    // Estilo para botão desabilitado
    disabled && "bg-gray-600 opacity-50"
  );

  const textClass = clsx(
    "font-semibold",
    // Tamanho do texto baseado na className
    className?.includes("text-xs") && "text-xs",
    className?.includes("text-sm") && "text-sm",
    className?.includes("text-lg") && "text-lg",
    // Tamanho padrão se não especificado
    !className?.includes("text-") && "text-base",

    // Texto ativo
    !disabled && {
      "text-white": ["primary", "success", "error", "warning"].includes(
        variant
      ),
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
          color={
            variant === "outlined" || variant === "secondary"
              ? colors.primary
              : colors.white
          }
          size="small"
        />
      )}
    </Pressable>
  );
}
