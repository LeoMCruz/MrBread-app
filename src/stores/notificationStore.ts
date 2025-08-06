import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

interface NotificationState {
  notifications: NotificationSetting[];
  isLoading: boolean;

  // Ações
  toggleNotification: (id: string) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  loadSettings: () => Promise<void>;
  saveSettings: () => Promise<void>;
  applyNotificationSettings: (id: string, enabled: boolean) => Promise<void>;
}

// Chave para AsyncStorage
const NOTIFICATION_SETTINGS_KEY = '@mrbread_notification_settings';

// Configurações padrão
const DEFAULT_NOTIFICATIONS: NotificationSetting[] = [
  {
    id: "push",
    title: "Notificações Push",
    description: "Receber notificações no dispositivo",
    enabled: true,
  },
  {
    id: "orders",
    title: "Novos Pedidos",
    description: "Notificar quando houver novos pedidos",
    enabled: true,
  },
  {
    id: "sound",
    title: "Som",
    description: "Tocar som nas notificações",
    enabled: true,
  },
];

export const useNotificationStore = create<NotificationState>((set, get) => ({
  // Estados iniciais
  notifications: DEFAULT_NOTIFICATIONS,
  isLoading: false,

  // Carregar configurações salvas
  loadSettings: async () => {
    set({ isLoading: true });
    try {
      const savedSettings = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      
      if (savedSettings) {
        const parsedSettings: NotificationSetting[] = JSON.parse(savedSettings);
        set({ notifications: parsedSettings });
        console.log('Configurações de notificação carregadas:', parsedSettings);
      } else {
        // Se não há configurações salvas, usar padrões
        set({ notifications: DEFAULT_NOTIFICATIONS });
        console.log('Usando configurações padrão de notificação');
      }
    } catch (error) {
      console.error('Erro ao carregar configurações de notificação:', error);
      // Em caso de erro, usar configurações padrão
      set({ notifications: DEFAULT_NOTIFICATIONS });
    } finally {
      set({ isLoading: false });
    }
  },

  // Salvar configurações
  saveSettings: async () => {
    try {
      const { notifications } = get();
      await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(notifications));
      console.log('Configurações de notificação salvas:', notifications);
    } catch (error) {
      console.error('Erro ao salvar configurações de notificação:', error);
    }
  },

  // Alternar configuração
  toggleNotification: async (id: string) => {
    try {
      const { notifications } = get();
      
      // Atualizar estado local
      const updatedNotifications = notifications.map(notification =>
        notification.id === id
          ? { ...notification, enabled: !notification.enabled }
          : notification
      );
      
      set({ notifications: updatedNotifications });
      
      // Salvar no AsyncStorage
      await get().saveSettings();
      
      // Aplicar configurações em tempo real
      const updatedNotification = updatedNotifications.find(n => n.id === id);
      if (updatedNotification) {
        await get().applyNotificationSettings(id, updatedNotification.enabled);
      }
      
    } catch (error) {
      console.error('Erro ao alternar configuração de notificação:', error);
      throw error;
    }
  },

  // Restaurar configurações padrão
  resetToDefaults: async () => {
    try {
      set({ notifications: DEFAULT_NOTIFICATIONS });
      await get().saveSettings();
      console.log('Configurações de notificação restauradas para padrão');
    } catch (error) {
      console.error('Erro ao restaurar configurações padrão:', error);
      throw error;
    }
  },

  // Aplicar configurações em tempo real
  applyNotificationSettings: async (id: string, enabled: boolean) => {
    console.log(`Aplicando configuração: ${id} = ${enabled}`);
    
    try {
      switch (id) {
        case 'push':
          // Lógica para notificações push
          if (enabled) {
            // Solicitar permissão para notificações push
            console.log('Solicitando permissão para notificações push...');
            // Aqui você pode integrar com Expo Notifications ou outro serviço
            // await Notifications.requestPermissionsAsync();
          } else {
            // Desabilitar notificações push
            console.log('Desabilitando notificações push...');
            // await Notifications.cancelAllScheduledNotificationsAsync();
          }
          break;
          
        case 'orders':
          // Lógica para notificações de pedidos
          if (enabled) {
            console.log('Habilitando notificações de novos pedidos...');
            // Configurar webhook ou listener para novos pedidos
            // await setupOrderNotifications();
          } else {
            console.log('Desabilitando notificações de novos pedidos...');
            // Remover webhook ou listener
            // await removeOrderNotifications();
          }
          break;
          
        case 'sound':
          // Lógica para sons de notificação
          if (enabled) {
            console.log('Habilitando sons de notificação...');
            // Configurar som padrão para notificações
            // await Audio.setAudioModeAsync({ playsInSilentMode: true });
          } else {
            console.log('Desabilitando sons de notificação...');
            // Configurar modo silencioso
            // await Audio.setAudioModeAsync({ playsInSilentMode: false });
          }
          break;
          
        default:
          console.log('Configuração desconhecida:', id);
      }
    } catch (error) {
      console.error(`Erro ao aplicar configuração ${id}:`, error);
      throw error;
    }
  },
})); 