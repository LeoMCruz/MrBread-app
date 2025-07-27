import '../global.css';
import { Slot } from 'expo-router';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/authStore';
import HomeSkeleton from '@/components/ui/loadingPages/homeSkeleton';

export default function RootLayout() {
  const { isLoading } = useAuthStore();
  
  if (isLoading) {
    return <HomeSkeleton />;
  }
  
  return (
    <SafeAreaView className="flex-1 bg-gray-900 font-sans">
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#111827"
        translucent={false}
      />
      <Slot />
    </SafeAreaView>
  );
} 