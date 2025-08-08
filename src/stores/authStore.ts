import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TokenManager } from "@/services/axios";
import { login as authLogin, getUserLoggedData } from "@/services/authService";
import { showSuccessToast, showErrorToast } from "@/services/axios";

interface User {
  id: string;
  username: string;
  nome: string;
  status: string;
  perfilAcesso: string;
  nomeOrganizacao: string;
  organizacaoId: string;
  cnpj: string;
  telefone?: string;
  cidade?: string;
  estado?: string;
  endereco?: string;
  dataCriacao: string;
  dataAlteracao: string;
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
  getUserLoggedData: () => Promise<void>;
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
    console.log("Login iniciado");
    // set({ isLoading: true })

    try {
      // Fazer login na API
      const { user, token } = await authLogin(email, password);
      
      // Salvar token no SecureStore
      const tokenManager = TokenManager.getInstance();
      await tokenManager.saveToken(token);
      await get().getUserLoggedData();
      
      // Salvar credenciais se "lembrar login" estiver marcado
      if (remember) {
        await get().saveCredentials(email, password);
      } else {
        await get().clearSavedCredentials();
      }

      set({
        isAuthenticated: true,
        isLoading: false,
        rememberMe: remember,
      });

      showSuccessToast('Login realizado com sucesso!', 'Bem-vindo!');
      console.log("Login realizado com sucesso:", user.email);
    } catch (error: any) {
      // set({ isLoading: false })
      console.error("Erro no login:", error);
      showErrorToast(error.message);
      throw error;
    }
  },

  logout: async () => {
    console.log("Logout iniciado");
    set({ isLoading: true });

    try {
      // Limpar token do SecureStore
      const tokenManager = TokenManager.getInstance();
      await tokenManager.clearToken();
      
      // Limpar credenciais salvas
      // await get().clearSavedCredentials();

      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        rememberMe: false,
      });

      showSuccessToast('Logout realizado com sucesso!', 'Até logo!');
      console.log("Logout realizado com sucesso");
    } catch (error) {
      console.error("Erro no logout:", error);
      // Mesmo com erro, limpar estado local
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        rememberMe: false,
      });
    }
  },

  getUserLoggedData: async () => {
    console.log("Verificando status de autenticação");
    set({ isLoading: true });

    try {
      const tokenManager = TokenManager.getInstance();
      await tokenManager.initialize();
      
      const token = tokenManager.getAccessToken();
      
      if (token) {
        // Buscar dados do usuário na API
        const user = await getUserLoggedData();
        
        if (user) {
          set({
            isAuthenticated: true,
            user: user,
            isLoading: false,
          });
          
          console.log("Usuário autenticado:", user.username);
        } else {
          // Falha ao buscar dados do usuário (token inválido ou erro na API)
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
          });
          
          console.log("Falha ao buscar dados do usuário");
        }
      } else {
        // Token não existe
        set({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
        
        console.log("Usuário não autenticado");
      }
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    }
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
