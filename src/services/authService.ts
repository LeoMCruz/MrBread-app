import { apiService } from './axios';
import { jwtDecode } from 'jwt-decode';

// Interfaces
interface LoginResponse {
  accessToken: string;
  tokenType: string;
}

export interface UserResponse {
  id: string;
  username: string;
  nome: string;
  status: string;
  perfilAcesso: string;
  nomeOrganizacao: string;
  organizacaoId: string;
  cnpj: string;
  dataCriacao: string;
  dataAlteracao: string;
}

interface DecodedToken {
  sub: string; // email
  aud: string; // organizationId
  roles: string[];
  id: string; // userId
  iat: number; // issuedAt
  exp?: number; // expiresAt
}

interface User {
  id: string;
  email: string;
  organizationId: string;
  roles: string[];
  createdAt: number;
}

// Função para decodificar token JWT
const decodeToken = (token: string): DecodedToken => {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error('Erro ao decodificar token:', error);
    throw new Error('Token inválido');
  }
};

// Função para extrair dados do usuário do token
export const extractUserFromToken = (token: string): User => {
  const decoded = decodeToken(token);
  
  return {
    id: decoded.id,
    email: decoded.sub,
    organizationId: decoded.aud,
    roles: decoded.roles,
    createdAt: decoded.iat,
  };
};

// Função para verificar se o token é válido
export const isTokenValid = (token: string): boolean => {
  try {
    const decoded = decodeToken(token);
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Verificar se o token não expirou
    if (decoded.exp && decoded.exp < currentTime) {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
};

// Função para verificar permissões do usuário
export const hasRole = (user: User | null, role: string): boolean => {
  if (!user || !user.roles) return false;
  return user.roles.includes(role);
};

export const hasAnyRole = (user: User | null, roles: string[]): boolean => {
  if (!user || !user.roles) return false;
  return roles.some(role => user.roles.includes(role));
};

// Função de login
export const login = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  try {
    const response = await apiService.post<LoginResponse>('/login', {
      username: email,
      password: password,
    });

    const { accessToken } = response;
    
    // Decodificar token e extrair dados do usuário
    const user = extractUserFromToken(accessToken);
    
    return { user, token: accessToken };
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
};

//função para buscar dados do usuário logado
export const getUserLoggedData = async (): Promise<UserResponse | null> => {
  try {
    const response = await apiService.get<UserResponse>('/user');
    return response;
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    return null;
  }
};

// Função para refresh do token (se necessário no futuro)
export const refreshToken = async (): Promise<string | null> => {
  try {
    const response = await apiService.post<LoginResponse>('/refresh');
    return response.accessToken;
  } catch (error) {
    console.error('Erro ao renovar token:', error);
    return null;
  }
}; 