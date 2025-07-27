import React, { useState } from "react";
import { TextInputProps, View, ActivityIndicator, Text } from "react-native";
import { MaskedTextInput } from "react-native-mask-text";
import clsx from "clsx";
import { useBaseColors } from "@/styles/theme";

interface CurrencyProps extends Omit<TextInputProps, "style" | "onChangeText"> {
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
  // Opções específicas de moeda
  prefix?: string;
  decimalSeparator?: string;
  groupSeparator?: string;
  precision?: number;
  onChangeText?: (text: string, rawText: string) => void;
}

export default function Currency({
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
  prefix = "R$ ",
  decimalSeparator = ",",
  groupSeparator = ".",
  precision = 2,
  ...rest
}: CurrencyProps) {
  const colors = useBaseColors();
  const [isFocused, setIsFocused] = useState(false);

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
      "h-10 px-3": size === "sm",
      "h-12 px-4": size === "md",
      "h-14 px-4": size === "lg",
    },
    {
      "bg-gray-800 border-gray-600": variant === "default",
      "bg-gray-900 border-gray-700": variant === "filled",
      "bg-transparent border-gray-600": variant === "outlined",
    },
    {
      "border-blue-500 bg-gray-900": isFocused && !error,
      "border-red-500 bg-red-900/20": error,
      "border-green-500 bg-green-900/20": success && !error,
    }
  );

  const inputClass = clsx(
    "flex-1 text-white text-base",
    {
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

        <MaskedTextInput
          className={inputClass}
          style={{
            flex: 1,
            width: "100%",
            paddingLeft: leftIcon ? 48 : 16,
            paddingRight: rightIcon || secureTextEntry ? 48 : 16,
            color: "#ffffff",
          }}
          placeholderTextColor="#6b7280"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          type="currency"
          options={{
            prefix,
            decimalSeparator,
            groupSeparator,
            precision,
          }}
          onChangeText={(text, rawText) => {
            if (rest.onChangeText) {
              // @ts-ignore - MaskedTextInput retorna dois parâmetros
              rest.onChangeText(text, rawText);
            }
          }}
          {...rest}
        />

        {loading && (
          <View className={clsx(iconClass, "right-3")}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        )}
      </View>

      {error && <Text className={errorClass}>{error}</Text>}
    </View>
  );
}
