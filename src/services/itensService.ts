import { apiService } from './axios';

// Interfaces base
interface BaseItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  organizationId: string | null;
  createdAt: number;
  updatedAt: number;
}

// Interface para o retorno real da API
interface ProductResponse {
  id: string;
  nomeProduto: string;
  descricao: string;
  precoBase: number;
  organizacaoId: string | null;
  status: string;
  dataCriacao: string;
  dataAlteracao: string;
}

interface ServiceResponse {
  id: string;
  nomeServico: string;
  descricao: string;
  precoBase: number;
  organizacaoId: string | null;
  status: string;
  dataCriacao: string;
  dataAlteracao: string;
}

interface Product extends BaseItem {
  type: 'product';
  status: string;
}

// Interface para parâmetros de busca
interface GetProductsParams {
  search?: string;
  page?: number;
  limit?: number;
}

interface GetServicesParams {
  search?: string;
  page?: number;
  limit?: number;
}

interface Service extends BaseItem {
  type: 'service';
  status: string;
}

type Item = Product | Service;

// Interfaces para requisições
interface CreateItemRequest {
  name: string;
  description?: string;
  price: number;
}

interface UpdateItemRequest {
  name: string;
  description: string;
  price: number;
}

// Funções para Produtos
export const createProduct = async (data: CreateItemRequest): Promise<Product> => {
  try {
    const response = await apiService.post<ProductResponse>('/produtos', {
      nomeProduto: data.name,
      descricao: data.description,
      precoBase: data.price,
    });
    
    // Converter o retorno da API para o formato interno
    return {
      id: response.id,
      name: response.nomeProduto,
      description: response.descricao,
      price: response.precoBase,
      organizationId: response.organizacaoId,
      status: response.status,
      type: 'product' as const,
      createdAt: new Date(response.dataCriacao).getTime(),
      updatedAt: new Date(response.dataAlteracao).getTime(),
    };
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    throw error;
  }
};

export const getProducts = async (params?: GetProductsParams): Promise<Product[]> => {
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
    
    const url = `/produtos${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiService.get<ProductResponse[]>(url);
    
    // Converter o retorno da API para o formato interno
    return response.map((product) => ({
      id: product.id,
      name: product.nomeProduto,
      description: product.descricao,
      price: product.precoBase,
      organizationId: product.organizacaoId,
      status: product.status,
      type: 'product' as const,
      createdAt: new Date(product.dataCriacao).getTime(),
      updatedAt: new Date(product.dataAlteracao).getTime(),
    }));
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error;
  }
};

export const updateProduct = async (id: string, data: UpdateItemRequest): Promise<Product> => {
  try {
    const response = await apiService.put<ProductResponse>(`/produtos/${id}`, {
      nomeProduto: data.name,
      descricao: data.description,
      precoBase: data.price,
    });
    
    // Converter o retorno da API para o formato interno
    return {
      id: response.id,
      name: response.nomeProduto,
      description: response.descricao,
      price: response.precoBase,
      organizationId: response.organizacaoId,
      status: response.status,
      type: 'product' as const,
      createdAt: new Date(response.dataCriacao).getTime(),
      updatedAt: new Date(response.dataAlteracao).getTime(),
    };
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await apiService.delete(`/produtos/${id}`);
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    throw error;
  }
};

// Funções para Serviços
export const createService = async (data: CreateItemRequest): Promise<Service> => {
  try {
    const response = await apiService.post<ServiceResponse>('/servicos', {
      nomeServico: data.name,
      descricao: data.description,
      precoBase: data.price,
    });
    
    // Converter o retorno da API para o formato interno
    return {
      id: response.id,
      name: response.nomeServico,
      description: response.descricao,
      price: response.precoBase,
      organizationId: response.organizacaoId,
      status: response.status,
      type: 'service' as const,
      createdAt: new Date(response.dataCriacao).getTime(),
      updatedAt: new Date(response.dataAlteracao).getTime(),
    };
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    throw error;
  }
};

export const getServices = async (params?: GetServicesParams): Promise<Service[]> => {
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
    
    const url = `/servicos${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiService.get<ServiceResponse[]>(url);
    
    // Converter o retorno da API para o formato interno
    return response.map((service) => ({
      id: service.id,
      name: service.nomeServico,
      description: service.descricao,
      price: service.precoBase,
      organizationId: service.organizacaoId,
      status: service.status,
      type: 'service' as const,
      createdAt: new Date(service.dataCriacao).getTime(),
      updatedAt: new Date(service.dataAlteracao).getTime(),
    }));
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    throw error;
  }
};

export const updateService = async (id: string, data: UpdateItemRequest): Promise<Service> => {
  try {
    const response = await apiService.put<ServiceResponse>(`/servicos/${id}`, {
      nomeServico: data.name,
      descricao: data.description,
      precoBase: data.price,
    });
    
    // Converter o retorno da API para o formato interno
    return {
      id: response.id,
      name: response.nomeServico,
      description: response.descricao,
      price: response.precoBase,
      organizationId: response.organizacaoId,
      status: response.status,
      type: 'service' as const,
      createdAt: new Date(response.dataCriacao).getTime(),
      updatedAt: new Date(response.dataAlteracao).getTime(),
    };
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error);
    throw error;
  }
};

export const deleteService = async (id: string): Promise<void> => {
  try {
    await apiService.delete(`/servicos/${id}`);
  } catch (error) {
    console.error('Erro ao deletar serviço:', error);
    throw error;
  }
};

// Exportar tipos para uso em outros arquivos
export type { Product, Service, Item, CreateItemRequest, UpdateItemRequest, GetProductsParams, GetServicesParams }; 