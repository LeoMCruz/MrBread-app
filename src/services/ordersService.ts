import { apiService } from "./axios";

export interface Order {
  id: string;
  idPedido: number;
  precoTotal: number;
  cliente: string;
  razaoSocial: string;
  status: string;
  dataCriacao: string;
}

export interface OrderItem {
  id: string;
  pedido: string | null;
  produto: string | null;
  servico: string | null;
  quantidade: number;
  precoUnitario: number;
  precoTotal: number;
  status: string | null;
  nome: string;
  descricao: string;
  tipo: "Produto" | "Serviço";
}

export interface OrderDetail {
  id: string;
  idPedido: number;
  itens: OrderItem[];
  precoTotal: number;
  organizacao: string;
  user: string;
  cliente: string;
  nomeFantasiaCliente: string;
  cnpj: string;
  cidade: string;
  estado: string;
  status: string;
  dataCriacao: string;
  dataAlteracao: string;
}

export interface GetOrdersParams {
  page?: number;
  size?: number;
}

// Função para formatar data de criação
export const formatOrderDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year}, ${hours}:${minutes}`;
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return dateString;
  }
};

// Função para converter idPedido para formato PED-XXXX
export const formatOrderNumber = (idPedido: number): string => {
  try {
    // Determinar quantos zeros precisamos baseado no número de dígitos
    const numDigits = idPedido.toString().length;
    
    // Se tem 1 dígito: PED-0001 (3 zeros)
    // Se tem 2 dígitos: PED-0010 (2 zeros)
    // Se tem 3 dígitos: PED-0100 (1 zero)
    // Se tem 4 dígitos: PED-1000 (0 zeros)
    // E assim por diante...
    const maxDigits = 4; // Máximo de 4 dígitos para manter o padrão
    const zerosNeeded = Math.max(0, maxDigits - numDigits);
    
    const paddedNumber = idPedido.toString().padStart(maxDigits, '0');
    return `PED-${paddedNumber}`;
  } catch (error) {
    console.error('Erro ao formatar número do pedido:', error);
    return `PED-${idPedido}`;
  }
};

export const getOrders = async (params?: GetOrdersParams): Promise<Order[]> => {
  const response = await apiService.get<Order[]>('/pedidos', { params });
  return response;
};

export const getOrderById = async (id: string): Promise<OrderDetail> => {
  const response = await apiService.get<OrderDetail>(`/pedidos/${id}`);
  return response;
};

// Interfaces para criação de pedido
export interface CreateOrderItem {
  produto: string | null;
  servico: string | null;
  quantidade: number;
  precoUnitario: number;
}

export interface CreateOrderRequest {
  cliente: string;
  itens: CreateOrderItem[];
}

export interface CreateOrderResponse {
  id: string;
  idPedido: number;
  precoTotal: number;
  status: string;
  dataCriacao: string;
}

export const createOrder = async (data: CreateOrderRequest): Promise<CreateOrderResponse> => {
  const response = await apiService.post<CreateOrderResponse>('/pedidos', {
    cliente: data.cliente,
    itens: data.itens
  });
  return response;
};

// Interfaces para atualização de pedido
export interface UpdateOrderItem {
  produto: string | null;
  servico: string | null;
  quantidade: number;
  precoUnitario: number;
}

export interface UpdateOrderRequest {
  id: string;
  itens: UpdateOrderItem[];
  cliente: string;
  status: string;
}

export interface UpdateOrderResponse {
  id: string;
  idPedido: number;
  precoTotal: number;
  status: string;
  dataAlteracao: string;
}

export const updateOrder = async (data: UpdateOrderRequest): Promise<UpdateOrderResponse> => {
  const response = await apiService.put<UpdateOrderResponse>('/pedidos', {
    id: data.id,
    itens: data.itens,
    cliente: data.cliente,
    status: data.status
  });
  return response;
};
