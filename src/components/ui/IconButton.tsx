import React from "react";
import { Pressable, View } from "react-native";
import clsx from "clsx";

interface IconButtonProps {
  icon: React.ReactNode;
  onPress?: () => void;
  variant?: "default" | "outlined" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  hitSlop?: number;
}

export default function IconButton({
  icon,
  onPress,
  variant = "default",
  size = "md",
  disabled = false,
  className,
  hitSlop = 8,
}: IconButtonProps) {
  const buttonClass = clsx(
    "items-center justify-center rounded-full",
    {
      // Tamanhos
      "w-8 h-8": size === "sm",
      "w-10 h-10": size === "md",
      "w-12 h-12": size === "lg",
    },
    {
      // Variantes
      "bg-gray-800": variant === "default" && !disabled,
      "bg-transparent border border-gray-600": variant === "outlined" && !disabled,
      "bg-transparent": variant === "ghost" && !disabled,
      "bg-gray-700 opacity-50": disabled,
    },
    className
  );

  return (
    <Pressable
      className={buttonClass}
      onPress={!disabled ? onPress : undefined}
      hitSlop={{ top: hitSlop, bottom: hitSlop, left: hitSlop, right: hitSlop }}
      disabled={disabled}
    >
      <View className="items-center justify-center">
        {icon}
      </View>
    </Pressable>
  );
} 