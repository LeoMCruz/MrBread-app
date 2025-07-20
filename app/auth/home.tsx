import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import Counter from '@/components/Counter';
import clsx from 'clsx';

export default function AuthHome() {
  const isDarkMode = false;
  const userName = "Usuário"; // Aqui você pegaria do contexto de autenticação

  const handleLogout = () => {
    // Aqui você faria o logout
    router.replace('/public/index');
  };

  return (
    <ScrollView className={clsx(
      "flex-1",
      isDarkMode ? "bg-gray-900" : "bg-white"
    )}>
      <View className="px-6 py-8">
        <Text className={clsx(
          "text-2xl font-bold mb-2",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          Olá, {userName}! 👋
        </Text>
        
        <Text className={clsx(
          "text-lg mb-8",
          isDarkMode ? "text-gray-300" : "text-gray-600"
        )}>
          Bem-vindo à área autenticada do MrBread App
        </Text>

        {/* Cards de Navegação */}
        <View className="space-y-4 mb-8">
          <Link href="/auth/profile" asChild>
            <TouchableOpacity className={clsx(
              "p-6 rounded-lg shadow-lg",
              isDarkMode ? "bg-gray-800" : "bg-white border border-gray-200"
            )}>
              <Text className={clsx(
                "text-xl font-semibold mb-2",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                👤 Perfil
              </Text>
              <Text className={clsx(
                "text-base",
                isDarkMode ? "text-gray-300" : "text-gray-600"
              )}>
                Gerencie suas informações pessoais
              </Text>
            </TouchableOpacity>
          </Link>

          <Link href="/auth/settings" asChild>
            <TouchableOpacity className={clsx(
              "p-6 rounded-lg shadow-lg",
              isDarkMode ? "bg-gray-800" : "bg-white border border-gray-200"
            )}>
              <Text className={clsx(
                "text-xl font-semibold mb-2",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                ⚙️ Configurações
              </Text>
              <Text className={clsx(
                "text-base",
                isDarkMode ? "text-gray-300" : "text-gray-600"
              )}>
                Personalize suas preferências
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Componente Counter */}
        <View className="mb-8">
          <Text className={clsx(
            "text-xl font-semibold mb-4 text-center",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            Contador Interativo
          </Text>
          <Counter />
        </View>

        {/* Botão de Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          className={clsx(
            "p-4 rounded-lg",
            isDarkMode ? "bg-red-600" : "bg-red-500"
          )}
        >
          <Text className="text-white font-semibold text-center">
            Sair da Conta
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
} 