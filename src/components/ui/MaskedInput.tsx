import React, { useState } from "react";
import {
  TextInputProps,
  View,
  Pressable,
  ActivityIndicator,
  Text,
} from "react-native";
import MaskInput from "react-native-mask-input";
import clsx from "clsx";
import { Eye, EyeOff } from "lucide-react-native";
import { useBaseColors } from "@/styles/theme";

interface MaskedInputProps extends Omit<TextInputProps, "style"> {
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
  // Tipo de máscara
  maskType?: "cnpj" | "cpf" | "phone" | "cep" | "date" | "currency";
  // Máscara customizada (array de regex)
  customMask?: (string | RegExp)[];
}

export default function MaskedInput({
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
  maskType,
  customMask,
  ...rest
}: MaskedInputProps) {
  const colors = useBaseColors();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const getMask = (type?: string) => {
    switch (type) {
      case "cnpj":
        return [
          /\d/,
          /\d/,
          ".",
          /\d/,
          /\d/,
          /\d/,
          ".",
          /\d/,
          /\d/,
          /\d/,
          "/",
          /\d/,
          /\d/,
          /\d/,
          /\d/,
          "-",
          /\d/,
          /\d/,
        ];
      case "cpf":
        return [
          /\d/,
          /\d/,
          /\d/,
          ".",
          /\d/,
          /\d/,
          /\d/,
          ".",
          /\d/,
          /\d/,
          /\d/,
          "-",
          /\d/,
          /\d/,
        ];
      case "phone":
        return [
          "(",
          /\d/,
          /\d/,
          ")",
          " ",
          /\d/,
          /\d/,
          /\d/,
          /\d/,
          /\d/,
          "-",
          /\d/,
          /\d/,
          /\d/,
          /\d/,
        ];
      case "cep":
        return [/\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/];
      case "date":
        return [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/];
      case "currency":
        return [
          "R",
          "$",
          " ",
          /\d/,
          /\d/,
          /\d/,
          ".",
          /\d/,
          /\d/,
          /\d/,
          ".",
          /\d/,
          /\d/,
          /\d/,
          ",",
          /\d/,
          /\d/,
        ];
      default:
        return customMask || [];
    }
  };

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
    "flex-row items-center rounded-xl border-2",
    {
      // Tamanhos
      "h-10 px-3": size === "sm",
      "h-12 px-4": size === "md",
      "h-14 px-4": size === "lg",
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
      "pl-0": !leftIcon,
      "pl-12": leftIcon,
      "pr-0": !rightIcon && !secureTextEntry,
      "pr-12": rightIcon || secureTextEntry,
    },
    className
  );

  const errorClass = clsx("text-sm text-red-500 mt-1", errorClassName);

  const iconClass = clsx("absolute z-10", {
    "left-3": leftIcon,
    "right-3": rightIcon || secureTextEntry,
  });

  return (
    <View className={containerClass}>
      {label && <Text className={labelClass}>{label}</Text>}

      <View className={inputContainerClass}>
        {leftIcon && (
          <View className={clsx(iconClass, "left-3")}>{leftIcon}</View>
        )}

        <MaskInput
          className={inputClass}
          placeholderTextColor="#6b7280"
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          mask={getMask(maskType)}
          keyboardType="numeric"
          onChangeText={(text: string, rawText: string) => {
            if (rest.onChangeText) {
              rest.onChangeText(text);
            }
          }}
          {...rest}
        />

        {loading && (
          <View className={clsx(iconClass, "right-3")}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        )}

        {!loading && rightIcon && (
          <View className={clsx(iconClass, "right-3")}>{rightIcon}</View>
        )}
      </View>

      {error && <Text className={errorClass}>{error}</Text>}
    </View>
  );
}
