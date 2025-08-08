import { create } from "zustand";
import { 
  Order, 
  OrderDetail,
  GetOrdersParams,
  getOrders as getOrdersService,
  getOrderById as getOrderByIdService,
  createOrder as createOrderService,
  updateOrder as updateOrderService,
  CreateOrderRequest,
  CreateOrderResponse,
  UpdateOrderRequest,
  UpdateOrderResponse,
  formatOrderDate,
  formatOrderNumber
} from "@/services/ordersService";
import { showSuccessToast, showErrorToast } from "@/services/axios";

// Interface para Order com dados formatados
interface FormattedOrder extends Omit<Order, 'idPedido' | 'dataCriacao'> {
  idPedido: string; // Agora é string (PED-0001)
  dataCriacao: string; // Data formatada
}

// Interface para OrderDetail com dados formatados
interface FormattedOrderDetail extends Omit<OrderDetail, 'idPedido' | 'dataCriacao' | 'dataAlteracao'> {
  idPedido: string; // Agora é string (PED-0001)
  dataCriacao: string; // Data formatada
  dataAlteracao: string; // Data formatada
}

interface OrdersState {
  // Estados
  orders: FormattedOrder[];
  selectedOrder: FormattedOrderDetail | null;

  // Ações para Orders
  getOrders: (params?: GetOrdersParams) => Promise<FormattedOrder[]>;
  getOrderById: (id: string) => Promise<FormattedOrderDetail>;
  createOrder: (data: CreateOrderRequest) => Promise<CreateOrderResponse>;
  updateOrder: (data: UpdateOrderRequest) => Promise<UpdateOrderResponse>;

  // Ações gerais
  clearOrders: () => void;
  clearSelectedOrder: () => void;
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  // Estados iniciais
  orders: [],
  selectedOrder: null,

  // Ações para Orders
  getOrders: async (params?: GetOrdersParams) => {
    try {
      const orders = await getOrdersService(params);
      
      // Formatar as datas e números de pedido antes de salvar no store
      const ordersWithFormattedData = orders.map(order => ({
        ...order,
        dataCriacao: formatOrderDate(order.dataCriacao),
        idPedido: formatOrderNumber(order.idPedido)
      }));
      
      // Se é a primeira página (sem page ou page 0), substituir
      // Se é uma página subsequente, acumular sem duplicatas
      if (!params?.page || params.page === 0) {
        set({ orders: ordersWithFormattedData });
      } else {
        set((state) => {
          // Filtrar duplicatas baseado no ID
          const existingIds = new Set(state.orders.map(o => o.id));
          const newOrders = ordersWithFormattedData.filter(o => !existingIds.has(o.id));
          
          return {
            orders: [...state.orders, ...newOrders]
          };
        });
      }
      
      return ordersWithFormattedData;
    } catch (error) {
      console.error('Erro ao buscar orders:', error);
      showErrorToast('Erro ao carregar pedidos', 'Tente novamente mais tarde.');
      throw error;
    }
  },

  getOrderById: async (id: string) => {
    try {
      const orderDetail = await getOrderByIdService(id);
      
      // Formatar as datas e números de pedido
      const formattedOrderDetail: FormattedOrderDetail = {
        ...orderDetail,
        idPedido: formatOrderNumber(orderDetail.idPedido),
        dataCriacao: formatOrderDate(orderDetail.dataCriacao),
        dataAlteracao: formatOrderDate(orderDetail.dataAlteracao)
      };
      
      set({ selectedOrder: formattedOrderDetail });
      return formattedOrderDetail;
    } catch (error) {
      console.error('Erro ao buscar detalhes do pedido:', error);
      showErrorToast('Erro ao carregar detalhes do pedido', 'Tente novamente mais tarde.');
      set({ selectedOrder: null });
      throw error;
    }
  },

  createOrder: async (data: CreateOrderRequest) => {
    try {
      const response = await createOrderService(data);
      showSuccessToast('Pedido criado com sucesso!');
      return response;
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      showErrorToast('Erro ao criar pedido', 'Tente novamente mais tarde.');
      throw error;
    }
  },

  updateOrder: async (data: UpdateOrderRequest) => {
    try {
      const response = await updateOrderService(data);
      showSuccessToast('Pedido atualizado com sucesso!');
      return response;
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
      showErrorToast('Erro ao atualizar pedido', 'Tente novamente mais tarde.');
      throw error;
    }
  },

  // Ações gerais
  clearOrders: () => {
    set({ orders: [] });
  },

  clearSelectedOrder: () => {
    set({ selectedOrder: null });
  },
}));
