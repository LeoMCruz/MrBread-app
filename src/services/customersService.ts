import { apiService } from './axios';

// Interface para o retorno real da API
export interface Customer {
  id: string;
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  endereco: string;
  cidade: string;
  estado: string;
  email: string;
  telefone: string | null;
  organizacao: string;
  usuarioCriacao: string;
  status: string;
  dataCriacao: string;
  dataAlteracao: string;
}

// Interface para parâmetros de busca
export interface GetCustomersParams {
  search?: string;
  page?: number;
  limit?: number;
}

// Interfaces para requisições
export interface CreateCustomerRequest {
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  endereco: string;
  cidade: string;
  estado: string;
  email: string;
  telefone: string;
}

export interface UpdateCustomerRequest {
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  endereco: string;
  cidade: string;
  estado: string;
  email: string;
  telefone: string;
}

// Funções para Customers
export const createCustomer = async (data: CreateCustomerRequest): Promise<Customer> => {
  try {
    const response = await apiService.post<Customer>('/clientes', {
      nomeFantasia: data.nomeFantasia,
      razaoSocial: data.razaoSocial,
      cnpj: data.cnpj,
      endereco: data.endereco,
      cidade: data.cidade,
      estado: data.estado,
      email: data.email,
      telefone: data.telefone,
    });
    
    // Converter o retorno da API para o formato interno
    return {
      id: response.id,
      nomeFantasia: response.nomeFantasia,
      razaoSocial: response.razaoSocial,
      cnpj: response.cnpj,
      endereco: response.endereco,
      cidade: response.cidade,
      estado: response.estado,
      email: response.email,
      telefone: response.telefone,
      organizacao: response.organizacao,
      usuarioCriacao: response.usuarioCriacao,
      status: response.status,
      dataCriacao: response.dataCriacao,
      dataAlteracao: response.dataAlteracao,
    };
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    throw error;
  }
};

export const getCustomers = async (params?: GetCustomersParams): Promise<Customer[]> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.search) {
      queryParams.append('search', params.search);
    }
    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    
    const url = `/clientes${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiService.get<Customer[]>(url);
    
    // Converter o retorno da API para o formato interno
          return response.map((customer) => ({
        id: customer.id,
        nomeFantasia: customer.nomeFantasia,
        razaoSocial: customer.razaoSocial,
        cnpj: customer.cnpj,
        endereco: customer.endereco,
        cidade: customer.cidade,
        estado: customer.estado,
        email: customer.email,
        telefone: customer.telefone,
        organizacao: customer.organizacao,
        usuarioCriacao: customer.usuarioCriacao,
        status: customer.status,
        dataCriacao: customer.dataCriacao,
        dataAlteracao: customer.dataAlteracao,
      }));
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    throw error;
  }
};

export const updateCustomer = async (id: string, data: UpdateCustomerRequest): Promise<Customer> => {
  try {
    const response = await apiService.put<Customer>(`/clientes/${id}`, {
      nomeFantasia: data.nomeFantasia,
      razaoSocial: data.razaoSocial,
      cnpj: data.cnpj,
      endereco: data.endereco,
      cidade: data.cidade,
      estado: data.estado,
      telefone: data.telefone,
      email: data.email,
    });
    
    // Converter o retorno da API para o formato interno
    return {
      id: response.id,
      nomeFantasia: response.nomeFantasia,
      razaoSocial: response.razaoSocial,
      cnpj: response.cnpj,
      endereco: response.endereco,
      cidade: response.cidade,
      estado: response.estado,
      email: response.email,
      telefone: response.telefone,
      organizacao: response.organizacao,
      usuarioCriacao: response.usuarioCriacao,
      status: response.status,
      dataCriacao: response.dataCriacao,
      dataAlteracao: response.dataAlteracao,
    };
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    throw error;
  }
};

export const deleteCustomer = async (id: string): Promise<void> => {
  try {
    await apiService.delete(`/clientes/${id}`);
  } catch (error) {
    console.error('Erro ao deletar cliente:', error);
    throw error;
  }
}; 