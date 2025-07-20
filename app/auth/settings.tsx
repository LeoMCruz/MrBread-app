import { View, Text, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { useState } from 'react';
import clsx from 'clsx';

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [biometric, setBiometric] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const isDarkMode = false;

  const settingsItems = [
    {
      title: 'Notificações',
      subtitle: 'Receber notificações push',
      type: 'switch',
      value: notifications,
      onValueChange: setNotifications,
      icon: '🔔'
    },
    {
      title: 'Modo Escuro',
      subtitle: 'Ativar tema escuro',
      type: 'switch',
      value: darkMode,
      onValueChange: setDarkMode,
      icon: '🌙'
    },
    {
      title: 'Login Biométrico',
      subtitle: 'Usar impressão digital ou Face ID',
      type: 'switch',
      value: biometric,
      onValueChange: setBiometric,
      icon: '👆'
    },
    {
      title: 'Salvamento Automático',
      subtitle: 'Salvar alterações automaticamente',
      type: 'switch',
      value: autoSave,
      onValueChange: setAutoSave,
      icon: '💾'
    }
  ];

  const actionItems = [
    {
      title: 'Alterar Senha',
      subtitle: 'Atualizar sua senha de acesso',
      icon: '🔒',
      action: () => console.log('Alterar senha')
    },
    {
      title: 'Privacidade',
      subtitle: 'Configurar privacidade da conta',
      icon: '🛡️',
      action: () => console.log('Privacidade')
    },
    {
      title: 'Sobre o App',
      subtitle: 'Informações sobre o MrBread App',
      icon: 'ℹ️',
      action: () => console.log('Sobre')
    }
  ];

  return (
    <ScrollView className={clsx(
      "flex-1",
      isDarkMode ? "bg-gray-900" : "bg-white"
    )}>
      <View className="px-6 py-8">
        <Text className={clsx(
          "text-2xl font-bold mb-8",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          Configurações
        </Text>

        {/* Configurações Gerais */}
        <View className="mb-8">
          <Text className={clsx(
            "text-lg font-semibold mb-4",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            Configurações Gerais
          </Text>
          
          <View className="space-y-2">
            {settingsItems.map((item, index) => (
              <View key={index} className={clsx(
                "flex-row items-center justify-between p-4 rounded-lg",
                isDarkMode ? "bg-gray-800" : "bg-gray-50"
              )}>
                <View className="flex-row items-center flex-1">
                  <Text className="text-2xl mr-3">{item.icon}</Text>
                  <View className="flex-1">
                    <Text className={clsx(
                      "text-base font-medium",
                      isDarkMode ? "text-white" : "text-gray-900"
                    )}>
                      {item.title}
                    </Text>
                    <Text className={clsx(
                      "text-sm",
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    )}>
                      {item.subtitle}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={item.value}
                  onValueChange={item.onValueChange}
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  thumbColor={item.value ? '#3b82f6' : '#f4f3f4'}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Ações */}
        <View className="mb-8">
          <Text className={clsx(
            "text-lg font-semibold mb-4",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            Ações
          </Text>
          
          <View className="space-y-2">
            {actionItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={item.action}
                className={clsx(
                  "flex-row items-center p-4 rounded-lg",
                  isDarkMode ? "bg-gray-800" : "bg-gray-50"
                )}
              >
                <Text className="text-2xl mr-3">{item.icon}</Text>
                <View className="flex-1">
                  <Text className={clsx(
                    "text-base font-medium",
                    isDarkMode ? "text-white" : "text-gray-900"
                  )}>
                    {item.title}
                  </Text>
                  <Text className={clsx(
                    "text-sm",
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  )}>
                    {item.subtitle}
                  </Text>
                </View>
                <Text className={clsx(
                  "text-lg",
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                )}>
                  ›
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Informações do App */}
        <View className={clsx(
          "p-4 rounded-lg",
          isDarkMode ? "bg-gray-800" : "bg-gray-50"
        )}>
          <Text className={clsx(
            "text-center text-sm",
            isDarkMode ? "text-gray-400" : "text-gray-600"
          )}>
            MrBread App v1.0.0
          </Text>
          <Text className={clsx(
            "text-center text-sm mt-1",
            isDarkMode ? "text-gray-400" : "text-gray-600"
          )}>
            Desenvolvido com ❤️
          </Text>
        </View>
      </View>
    </ScrollView>
  );
} 