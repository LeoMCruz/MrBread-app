import React, { useRef, useEffect } from "react";
import {
  Modal as RNModal,
  View,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  StatusBar,
} from "react-native";
import { useBaseColors } from "@/styles/theme";
import Typography from "../Typography";
import { Check, X } from "lucide-react-native";
import IconButton from "../IconButton";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface ModalFlatListProps {
  visible: boolean;
  children: React.ReactNode;
  onClose?: () => void;
  saved?: boolean;
  onSave?: () => void;
  icon?: React.ReactNode;
  title?: string;
  subtitle?: string;
  closeEnabled?: boolean;
  showHeader?: boolean;
  footer?: React.ReactNode;
  loading?: React.ReactNode;
  headerActions?: React.ReactNode;
  maxWidth?: number;
  maxHeight?: number;
  height?: number;
}

export default function ModalFlatList({
  visible,
  children,
  icon,
  title,
  subtitle,
  closeEnabled = true,
  showHeader = true,
  onClose,
  saved = false,
  onSave,
  footer,
  loading,
  headerActions,
  maxHeight = SCREEN_HEIGHT * 0.5,
  height,
}: ModalFlatListProps) {
  const colors = useBaseColors();
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Animação de entrada
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animação de saída
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleClose = () => {
    if (!closeEnabled) return;
    onClose?.();
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={{ flex: 1, backgroundColor: "black", opacity: 0.8 }} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: "center",
          alignItems: "center",
          opacity: opacity,
        }}
      >
        <Animated.View
          style={{
            transform: [{ scale }],
            maxHeight: height ? SCREEN_HEIGHT * height : maxHeight,
            width: "90%",
            backgroundColor: colors.background,
            borderRadius: 16,
            overflow: "hidden",
            flex: 1,
          }}
        >
          {showHeader && (
            <View className="flex-row items-center h-[72px] px-4 border-b border-gray-700">
              <View className="flex-row items-center gap-3 flex-grow">
                {icon}
                <View>
                  <Typography variant="h3" className="text-white">
                    {title}
                  </Typography>
                  {subtitle && (
                    <Typography variant="body-secondary" className="text-xs">
                      {subtitle}
                    </Typography>
                  )}
                </View>
              </View>
              {closeEnabled && (
                <View className="flex-row items-center gap-2">
                  {headerActions}
                  <IconButton
                    icon={<X size={20} color="#6b7280" />}
                    onPress={handleClose}
                    variant="ghost"
                  />
                </View>
              )}
            </View>
          )}

          <View
            className="flex-1"
            style={{
              padding: 16,
            }}
          >
            {children}
          </View>

          {footer && (
            <View className="flex-row gap-2 p-4 border-t border-gray-700">
              {footer}
            </View>
          )}

          {loading && loading}
        </Animated.View>
      </Animated.View>
    </RNModal>
  );
}
