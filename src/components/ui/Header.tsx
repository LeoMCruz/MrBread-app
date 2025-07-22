import React from "react";
import { Platform, View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBaseColors } from "@/styles/theme";
import Typography from "./Typography";
import clsx from "clsx";

interface HeaderProps {
  title?: string;
  leftIcon?: React.ReactNode;
  rightActions?: React.ReactNode;
  variant?: "default" | "transparent" | "blur";
  className?: string;
}

export default function Header({
  title,
  leftIcon,
  rightActions,
  variant = "default",
  className,
}: HeaderProps) {
  const colors = useBaseColors();
  const insets = useSafeAreaInsets();

  // 🎨 Classes base do header
  const headerClass = clsx(
    "flex-row items-center justify-between px-4",
    {
      // Variantes
      "bg-gray-900": variant === "default",
      "bg-transparent": variant === "transparent",
      "bg-gray-900/80": variant === "blur",
    },
    className
  );

  // 📏 Altura baseada na plataforma
  const headerHeight = Platform.OS === 'android' ? " px-4 flex-row items-center justify-between" : "absolute top-0 left-0 right-0 z-10 px-4 flex-row justify-between";

  return (
    <View
      className={headerClass}
      style={{ height: 50 + insets.top, paddingTop: insets.top,  }}
    >
      {/* Lado Esquerdo */}
      <View className="flex-row items-center flex-1">
        {leftIcon}
        {title && (
          <Typography 
            variant="h3" 
            className={clsx("flex-1", leftIcon && "ml-3")}
            numberOfLines={1}
          >
            {title}
          </Typography>
        )}
      </View>

      {/* Lado Direito */}
      {rightActions && (
        <View className="flex-row items-center gap-3">
          {rightActions}
        </View>
      )}
    </View>
  );
} 