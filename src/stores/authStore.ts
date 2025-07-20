import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  // Estados
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Estados iniciais
  isAuthenticated: false,
  user: null,
  isLoading: false,
  
  // Actions
  login: async (email: string, password: string) => {
    console.log('Login'); 
    set({ isLoading: true });
    
    try {
      // Mock: simula delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock: dados do usuário
      const mockUser: User = {
        id: '1',
        name: 'Usuário Mock',
        email: email
      };
      
      set({
        isAuthenticated: true,
        user: mockUser,
        isLoading: false
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  logout: () => {
    console.log('Logout chamado - mudando isAuthenticated para false');
    set({
      isAuthenticated: false,
      user: null,
      isLoading: false
    });
    console.log('Estado atualizado - isAuthenticated deve ser false');
  },
  
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  }
})); 