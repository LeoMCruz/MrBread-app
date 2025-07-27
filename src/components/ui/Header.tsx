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

  const headerClass = clsx(
    "flex-row items-center justify-between px-4",
    {
      "bg-gray-900": variant === "default",
      "bg-transparent": variant === "transparent",
      "bg-gray-900/80": variant === "blur",
    },
    className
  );

  return (
    <View
      className={headerClass}
      style={{ height: 50 + insets.top, paddingTop: insets.top }}
    >
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

      {rightActions && (
        <View className="flex-row items-center gap-3">{rightActions}</View>
      )}
    </View>
  );
}
