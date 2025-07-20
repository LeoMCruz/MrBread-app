import '../global.css';
import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function RootLayout() {
  return (
    <View className="flex-1 font-sans">
      <Stack>
        <Stack.Screen
          name="public"
          options={{
            headerShown: false,
      }}
        />
      <Stack.Screen
          name="auth"
        options={{
            headerShown: false,
        }}
      />
    </Stack>
    </View>
  );
} 