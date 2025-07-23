import React from 'react';
import { View } from 'react-native';
import LogoIcon from '../../assets/logo.svg';

interface LogoProps {
  size?: number;
  color?: string;
}

export default function Logo({ size = 200 }: LogoProps) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <LogoIcon width={size} height={size * 0.4} />
    </View>
  );
} 