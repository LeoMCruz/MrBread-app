import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  id: string;
  name: string;
  email: string;
}

interface SavedCredentials {
  email: string;
  password: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  rememberMe: boolean;
  savedCredentials: SavedCredentials | null;

  login: (email: string, password: string, remember: boolean) => Promise<void>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setRememberMe: (remember: boolean) => void;
  saveCredentials: (email: string, password: string) => Promise<void>;
  loadSavedCredentials: () => Promise<SavedCredentials | null>;
  clearSavedCredentials: () => Promise<void>;
}

// Chaves para AsyncStorage
const REMEMBER_ME_KEY = '@mrbread_remember_me';
const SAVED_CREDENTIALS_KEY = '@mrbread_saved_credentials';

export const useAuthStore = create<AuthState>((set, get) => ({
  // Estados iniciais
  isAuthenticated: false,
  user: null,
  isLoading: false,
  rememberMe: false,
  savedCredentials: null,

  login: async (email: string, password: string, remember: boolean) => {
    console.log("Login");
    set({ isLoading: true });

    try {
      // Mock: simula delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock: dados do usuário
      const mockUser: User = {
        id: "1",
        name: "Usuário Mock",
        email: email,
      };

      // Salvar credenciais se "lembrar login" estiver marcado
      if (remember) {
        await get().saveCredentials(email, password);
      } else {
        await get().clearSavedCredentials();
      }

      set({
        isAuthenticated: true,
        user: mockUser,
        isLoading: false,
        rememberMe: remember,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    console.log("Logout chamado - mudando isAuthenticated para false");
    set({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });
    console.log("Estado atualizado - isAuthenticated deve ser false");
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setRememberMe: (remember: boolean) => {
    set({ rememberMe: remember });
  },

  saveCredentials: async (email: string, password: string) => {
    try {
      const credentials: SavedCredentials = { email, password };
      await AsyncStorage.setItem(SAVED_CREDENTIALS_KEY, JSON.stringify(credentials));
      await AsyncStorage.setItem(REMEMBER_ME_KEY, 'true');
      set({ savedCredentials: credentials, rememberMe: true });
      console.log('Credenciais salvas com sucesso');
    } catch (error) {
      console.error('Erro ao salvar credenciais:', error);
    }
  },

  loadSavedCredentials: async () => {
    try {
      const rememberMe = await AsyncStorage.getItem(REMEMBER_ME_KEY);
      const savedCredentialsStr = await AsyncStorage.getItem(SAVED_CREDENTIALS_KEY);
      
      if (rememberMe === 'true' && savedCredentialsStr) {
        const savedCredentials: SavedCredentials = JSON.parse(savedCredentialsStr);
        set({ 
          savedCredentials, 
          rememberMe: true 
        });
        console.log('Credenciais carregadas:', savedCredentials.email);
        return savedCredentials;
      }
      return null;
    } catch (error) {
      console.error('Erro ao carregar credenciais:', error);
      return null;
    }
  },

  clearSavedCredentials: async () => {
    try {
      await AsyncStorage.removeItem(SAVED_CREDENTIALS_KEY);
      await AsyncStorage.removeItem(REMEMBER_ME_KEY);
      set({ savedCredentials: null, rememberMe: false });
      console.log('Credenciais removidas com sucesso');
    } catch (error) {
      console.error('Erro ao remover credenciais:', error);
    }
  },
}));
