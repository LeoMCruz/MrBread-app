import React, { useState } from "react";
import {
  TextInput,
  TextInputProps,
  View,
  Pressable,
  ActivityIndicator,
  Text,
} from "react-native";
import clsx from "clsx";
import { Eye, EyeOff } from "lucide-react-native";
import { useBaseColors } from "@/styles/theme";

interface InputMultiLineProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  success?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "default" | "filled" | "outlined";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
}

export default function InputMultiLine({
  label,
  error,
  success = false,
  loading = false,
  leftIcon,
  rightIcon,
  variant = "default",
  size = "md",
  fullWidth = true,
  className,
  containerClassName,
  labelClassName,
  errorClassName,
  secureTextEntry,
  multiline = true,
  numberOfLines = 4,
  ...rest
}: InputMultiLineProps) {
  const colors = useBaseColors();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // 🔄 Toggle para senha
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // 🎨 Classes base
  const containerClass = clsx(
    "flex-col",
    fullWidth && "w-full",
    containerClassName
  );

  const labelClass = clsx(
    "text-sm font-medium mb-2",
    error ? "text-red-500" : "text-white",
    labelClassName
  );

  const inputContainerClass = clsx(
    "flex-row items-start rounded-xl border-2",
    {
      // Tamanhos - ajustados para multiline
      "min-h-[40px] px-3 py-2": size === "sm",
      "min-h-[48px] px-4 py-3": size === "md",
      "min-h-[56px] px-4 py-3": size === "lg",
    },
    {
      // Variantes
      "bg-gray-800 border-gray-600": variant === "default",
      "bg-gray-900 border-gray-700": variant === "filled",
      "bg-transparent border-gray-600": variant === "outlined",
    },
    {
      // Estados
      "border-blue-500 bg-gray-900": isFocused && !error,
      "border-red-500 bg-red-900/20": error,
      "border-green-500 bg-green-900/20": success && !error,
    }
  );

  const inputClass = clsx(
    "flex-1 text-white text-base",
    {
      // Tamanhos do texto
      "text-sm": size === "sm",
      "text-base": size === "md",
      "text-lg": size === "lg",
    },
    {
      // Padding baseado nos ícones
      "pl-0": !leftIcon,
      "pl-12": leftIcon, // Espaçamento para o ícone esquerdo
      "pr-0": !rightIcon && !secureTextEntry,
      "pr-12": rightIcon || secureTextEntry,
    },
    className
  );

  const errorClass = clsx(
    "text-sm text-red-500 mt-1",
    errorClassName
  );

  const iconClass = clsx(
    "absolute z-10",
    {
      "left-3": leftIcon,
      "right-3": rightIcon || secureTextEntry,
    }
  );

  return (
    <View className={containerClass}>
      {/* Label */}
      {label && (
        <Text className={labelClass}>
          {label}
        </Text>
      )}

      {/* Container do Input */}
      <View className={inputContainerClass}>
        {/* Ícone Esquerdo */}
        {leftIcon && (
          <View className={clsx(iconClass, "left-3 top-3")}>
            {leftIcon}
          </View>
        )}

        {/* Input */}
        <TextInput
          className={inputClass}
          placeholderTextColor="#6b7280"
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical="top"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />

        {/* Loading */}
        {loading && (
          <View className={clsx(iconClass, "right-3 top-3")}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        )}

        {/* Ícone Direito ou Toggle de Senha */}
        {!loading && (rightIcon || secureTextEntry) && (
          <View className={clsx(iconClass, "right-3 top-3")}>
            {secureTextEntry ? (
              <Pressable onPress={togglePasswordVisibility}>
                {isPasswordVisible ? (
                  <EyeOff size={20} color="#6b7280" />
                ) : (
                  <Eye size={20} color="#6b7280" />
                )}
              </Pressable>
            ) : (
              rightIcon
            )}
          </View>
        )}
      </View>

      {/* Mensagem de Erro */}
      {error && (
        <Text className={errorClass}>
          {error}
        </Text>
      )}
    </View>
  );
} 