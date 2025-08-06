import React, { useState, useEffect } from "react";
import { View, ScrollView, Pressable, Platform, Switch, Alert, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import Toast from 'react-native-toast-message';
import {
  ArrowLeft,
  Bell,
  Smartphone,
  Volume2,
} from "lucide-react-native";
import Header from "@/components/ui/Header";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import { useNotificationStore } from "@/stores/notificationStore";

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  icon: React.ReactNode;
}

export default function NotificationSettings() {
  const { notifications, isLoading, loadSettings, toggleNotification, resetToDefaults } = useNotificationStore();
  
  // Estado local para os ícones
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([]);

  // Carregar configurações ao montar o componente
  useEffect(() => {
    loadSettings();
  }, []);

  // Atualizar configurações locais quando o store mudar
  useEffect(() => {
    const settingsWithIcons = notifications.map(notification => ({
      ...notification,
      icon: getNotificationIcon(notification.id),
    }));
    setNotificationSettings(settingsWithIcons);
  }, [notifications]);

  // Função para obter o ícone correto baseado no ID
  const getNotificationIcon = (id: string) => {
    switch (id) {
      case "push":
        return <Smartphone size={20} color="#3B82F6" />;
      case "orders":
        return <Bell size={20} color="#F59E0B" />;
      case "sound":
        return <Volume2 size={20} color="#EC4899" />;
      default:
        return <Bell size={20} color="#3B82F6" />;
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleToggleNotification = async (id: string) => {
    try {
      // Pegar o estado atual antes de alterar
      const currentNotification = notifications.find(n => n.id === id);
      const wasEnabled = currentNotification?.enabled || false;
      
      await toggleNotification(id);
      
      // Mostrar toast de confirmação com o estado correto
      if (currentNotification) {
        const newStatus = !wasEnabled; // Estado invertido
        const status = newStatus ? 'ativada' : 'desativada';
        showToast('success', 'Configuração atualizada!', `${currentNotification.title} foi ${status}.`);
      }
    } catch (error) {
      showToast('error', 'Erro ao atualizar', 'Não foi possível alterar a configuração.');
    }
  };

  const showToast = (type: 'success' | 'error', title: string, message?: string) => {
    Toast.show({
      type,
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 60,
    });
  };



  const handleReset = () => {
    Alert.alert(
      "Restaurar Padrões",
      "Deseja restaurar as configurações padrão?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Restaurar",
          style: "destructive",
          onPress: async () => {
            try {
              await resetToDefaults();
              showToast('success', 'Configurações restauradas!', 'Configurações foram restauradas para o padrão.');
            } catch (error) {
              showToast('error', 'Erro ao restaurar', 'Não foi possível restaurar as configurações.');
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-900">
      <Header
        title="Notificações"
        leftIcon={
          <Pressable
            onPress={handleBack}
            className="p-1.5 rounded-lg hover:bg-gray-700"
          >
            <ArrowLeft size={20} color="#F3F5F7" />
          </Pressable>
        }
      />

      <ScrollView
        className={`flex-1 px-6 mb-6 ${
          Platform.OS === "ios" ? "pt-6" : "pt-4"
        }`}
      >
        <View className="gap-4">
          {/* Configurações Gerais */}
          <View className="bg-gray-800 rounded-xl border border-gray-700 p-4">
            <View className="flex-row items-center gap-3 mb-4">
              <Bell size={20} color="#3B82F6" />
              <Typography variant="h3" className="text-white font-semibold">
                Configurações Gerais
              </Typography>
            </View>

            <View className="gap-2">
              {isLoading ? (
                <View className="flex-row items-center justify-center p-8">
                  <ActivityIndicator size="large" color="#3B82F6" />
                  <Typography variant="body" className="text-gray-400 ml-3">
                    Carregando configurações...
                  </Typography>
                </View>
              ) : (
                notificationSettings.map((notification) => (
                  <View
                    key={notification.id}
                    className="flex-row items-center justify-between p-3 bg-gray-700 rounded-lg"
                  >
                    <View className="flex-row items-center gap-3 flex-1">
                      {notification.icon}
                      <View className="flex-1">
                        <Typography variant="body" className="text-white font-medium">
                          {notification.title}
                        </Typography>
                        <Typography variant="caption" className="text-gray-400">
                          {notification.description}
                        </Typography>
                      </View>
                    </View>
                    <Switch
                      value={notification.enabled}
                      onValueChange={() => handleToggleNotification(notification.id)}
                      trackColor={{ false: "#4B5563", true: "#3B82F6" }}
                      thumbColor={notification.enabled ? "#ffffff" : "#6B7280"}
                    />
                  </View>
                ))
              )}
            </View>
          </View>



          {/* Botões de Ação */}
          <View className="pt-2 pb-4 gap-4">
            <Button
              title="Restaurar Padrões"
              onPress={handleReset}
              variant="outlined"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
} 