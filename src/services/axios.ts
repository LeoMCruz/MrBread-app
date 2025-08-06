import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';

// Tipos para configuração
interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

interface ErrorResponse {
  message: string;
  status: number;
  code?: string;
}

// Configuração base da API
const API_CONFIG: ApiConfig = {
  baseURL: 'http://192.168.1.3:8080',
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Chave para SecureStore
const TOKEN_KEY = 'mrbread_auth_token';

// Classe para gerenciar tokens
class TokenManager {
  private static instance: TokenManager;
  private accessToken: string | null = null;
  private isInitialized: boolean = false;

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  async initialize(): Promise<void> {
    if (!this.isInitialized) {
      await this.loadToken();
      this.isInitialized = true;
    }
  }

  async loadToken(): Promise<void> {
    try {
      this.accessToken = await SecureStore.getItemAsync(TOKEN_KEY);
      console.log('Token carregado:', this.accessToken ? 'Sim' : 'Não');
    } catch (error) {
      console.error('Erro ao carregar token:', error);
    }
  }

  async saveToken(accessToken: string): Promise<void> {
    try {
      this.accessToken = accessToken;
      await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
      // Configurar o token no header do Axios imediatamente
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      console.log('Token salvo e configurado no header:', accessToken.substring(0, 20) + '...');
    } catch (error) {
      console.error('Erro ao salvar token:', error);
    }
  }

  async clearToken(): Promise<void> {
    try {
      this.accessToken = null;
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      // Remover o token do header do Axios
      delete api.defaults.headers.common['Authorization'];
      console.log('Token removido do header');
    } catch (error) {
      console.error('Erro ao limpar token:', error);
    }
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }
}

// Função para mostrar toast de erro
const showErrorToast = (message: string, title: string = 'Erro') => {
  Toast.show({
    type: 'error',
    text1: title,
    text2: message,
    position: 'top',
    visibilityTime: 4000,
    autoHide: true,
    topOffset: 60,
  });
};

// Função para mostrar toast de sucesso
const showSuccessToast = (message: string, title: string = 'Sucesso') => {
  Toast.show({
    type: 'success',
    text1: title,
    text2: message,
    position: 'top',
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 60,
  });
};

// Função para tratar erros de rede
const handleNetworkError = (error: AxiosError): ErrorResponse => {
  if (error.code === 'ECONNABORTED') {
    return {
      message: 'Tempo limite excedido. Verifique sua conexão.',
      status: 408,
      code: 'TIMEOUT',
    };
  }

  if (!error.response) {
    return {
      message: 'Erro de conexão. Verifique sua internet.',
      status: 0,
      code: 'NETWORK_ERROR',
    };
  }

  return {
    message: (error.response.data as any)?.message || 'Erro desconhecido',
    status: error.response.status,
    code: error.code,
  };
};

// Função para tratar erros HTTP
const handleHttpError = (error: AxiosError): ErrorResponse => {
  const status = error.response?.status || 0;
  
  switch (status) {
    case 400:
      return {
        message: 'Dados inválidos. Verifique as informações enviadas.',
        status,
        code: 'BAD_REQUEST',
      };
    
    case 401:
      return {
        message: 'Sessão expirada. Faça login novamente.',
        status,
        code: 'UNAUTHORIZED',
      };
    
    case 403:
      return {
        message: 'Acesso negado. Você não tem permissão para esta ação.',
        status,
        code: 'FORBIDDEN',
      };
    
    case 404:
      return {
        message: 'Recurso não encontrado.',
        status,
        code: 'NOT_FOUND',
      };
    
    case 422:
      return {
        message: 'Dados inválidos. Verifique os campos obrigatórios.',
        status,
        code: 'VALIDATION_ERROR',
      };
    
    case 429:
      return {
        message: 'Muitas requisições. Tente novamente em alguns minutos.',
        status,
        code: 'RATE_LIMIT',
      };
    
    case 500:
      return {
        message: 'Erro interno do servidor. Tente novamente mais tarde.',
        status,
        code: 'INTERNAL_ERROR',
      };
    
    case 502:
    case 503:
    case 504:
      return {
        message: 'Serviço indisponível. Tente novamente mais tarde.',
        status,
        code: 'SERVICE_UNAVAILABLE',
      };
    
           default:
         return {
           message: (error.response?.data as any)?.message || 'Erro inesperado',
           status,
           code: 'UNKNOWN_ERROR',
         };
  }
};

// Função para verificar se o token é válido
const isTokenValid = (token: string): boolean => {
  try {
    // Decodificar o token JWT (sem verificar assinatura)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Verificar se o token não expirou
    return payload.exp > currentTime;
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return false;
  }
};

// Criar instância do Axios
const api: AxiosInstance = axios.create(API_CONFIG);

// Interceptor de requisição
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const tokenManager = TokenManager.getInstance();
      await tokenManager.initialize();
      
      const token = tokenManager.getAccessToken();
      
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('Token adicionado ao header:', token.substring(0, 20) + '...');
      } else {
        console.log('Nenhum token encontrado');
        delete api.defaults.headers.common['Authorization'];
      }
      
      // Log da requisição (apenas em desenvolvimento)
      if (__DEV__) {
        console.log('🌐 API Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          headers: config.headers,
          data: config.data,
        });
      }
      
      return config;
    } catch (error) {
      console.error('Erro no interceptor de requisição:', error);
      return config;
    }
  },
  (error: AxiosError) => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor de resposta
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log da resposta (apenas em desenvolvimento)
    if (__DEV__) {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    // Log do erro (apenas em desenvolvimento)
    if (__DEV__) {
      console.log('❌ API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data,
      });
    }
    
    // Se for erro 401, limpar token e redirecionar para login
    if (error.response?.status === 401) {
      console.log('Token inválido ou expirado. Redirecionando para login...');
      await TokenManager.getInstance().clearToken();
      // Redirecionar para login
      // router.replace('/login');
    }
    
    // Tratar erro
    const errorResponse = error.response 
      ? handleHttpError(error)
      : handleNetworkError(error);
    
    // Mostrar toast de erro (exceto para erros de validação)
    if (errorResponse.status !== 422) {
      showErrorToast(errorResponse.message);
    }
    
    return Promise.reject(errorResponse);
  }
);

// Funções utilitárias para requisições
export const apiService = {
  // GET
  get: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.get<T>(url, config);
    return response.data;
  },

  // POST
  post: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.post<T>(url, data, config);
    return response.data;
  },

  // PUT
  put: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.put<T>(url, data, config);
    return response.data;
  },

  // PATCH
  patch: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.patch<T>(url, data, config);
    return response.data;
  },

  // DELETE
  delete: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.delete<T>(url, config);
    return response.data;
  },

  // Upload de arquivo
  upload: async <T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.post<T>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Exportar instância do Axios e TokenManager
export { api, TokenManager };

// Exportar tipos
export type { ErrorResponse, ApiConfig };

// Exportar funções de toast
export { showErrorToast, showSuccessToast };
