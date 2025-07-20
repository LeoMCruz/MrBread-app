import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAppStore } from '@/stores/useAppStore';
import { getButtonClasses, getCardClasses, getTextClasses } from '@/utils/styles';

export default function Counter() {
  const { count, increment, decrement, reset } = useAppStore();

  return (
    <View className={getCardClasses(
      count > 0 ? 'colored' : 'light',
      "p-6"
    )}>
      <Text className={getTextClasses(
        count > 0 ? 'colored' : 'light',
        "text-2xl text-center mb-4"
      )}>
        Contador: {count}
      </Text>
      
      <View className="flex-row justify-center space-x-4">
        <TouchableOpacity
          onPress={decrement}
          className={getButtonClasses(
            'danger',
            count <= 0
          )}
          disabled={count <= 0}
        >
          <Text className="text-white font-semibold">-</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={increment}
          className={getButtonClasses('success')}
        >
          <Text className="text-white font-semibold">+</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity
        onPress={reset}
        className={getButtonClasses(
          'secondary',
          count === 0
        )}
        disabled={count === 0}
      >
        <Text className="text-white font-semibold text-center">Reset</Text>
      </TouchableOpacity>
    </View>
  );
} 