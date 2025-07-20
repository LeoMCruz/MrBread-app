import React from 'react';
import IconSvg from '../../assets/icon.svg';

interface IconProps {
  size?: number;
  color?: string;
}

export default function Icon({ size = 24, color = '#000' }: IconProps) {
  return <IconSvg width={size} height={size} color={color} />;
} 