// components/ui/Skeleton.tsx
import React, { useEffect } from "react";
import { ViewStyle, StyleProp } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import clsx from "clsx";

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  rounded?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

const Skeleton = ({
  width = 16,
  height = 16,
  rounded = true,
  className = "",
  style,
}: SkeletonProps) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      className={clsx(
        "bg-gray-700",
        rounded ? "rounded-full" : "rounded-md",
        className
      )}
      style={[
        {
          width: width as ViewStyle["width"],
          height: height as ViewStyle["height"],
        },
        style,
        animatedStyle,
      ]}
    />
  );
};

export default Skeleton;
