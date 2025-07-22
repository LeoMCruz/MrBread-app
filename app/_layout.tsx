import '../global.css';
import { Stack, router } from 'expo-router';
import { View, ActivityIndicator, StatusBar, Platform } from 'react-native';
import { useAuthStore } from '@/stores/authStore';
import { useEffect } from 'react';

export default function RootLayout() {
  const { isAuthenticated, isLoading } = useAuthStore();
  
  console.log('RootLayout - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/auth/home');
      } else {
        router.replace('/public/login');
      }
    }, 0);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated]);
  
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-900">
        <ActivityIndicator size="large" color="#F3F5F7" />
      </View>
    );
  }
  
  return (
    <View className="flex-1 font-sans">
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#111827"
        translucent={false}
      />
      <Stack screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // Rotas autenticadas
          <Stack.Screen name="auth" />
        ) : (
          // Rotas públicas
          <Stack.Screen name="public" />
        )}
      </Stack>
    </View>
  );
} 