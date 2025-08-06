import { create } from "zustand";
import { 
  Product, 
  Service, 
  CreateItemRequest, 
  UpdateItemRequest,
  GetProductsParams,
  GetServicesParams,
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  createService,
  getServices,
  updateService,
  deleteService
} from "@/services/itensService";
import { showSuccessToast, showErrorToast } from "@/services/axios";

interface ItensState {
  // Estados
  products: Product[];
  services: Service[];

  // Ações para Produtos
  createProduct: (data: CreateItemRequest) => Promise<void>;
  getProducts: (params?: GetProductsParams) => Promise<Product[]>;
  updateProduct: (id: string, data: UpdateItemRequest) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  // Ações para Serviços
  createService: (data: CreateItemRequest) => Promise<void>;
  getServices: (params?: GetServicesParams) => Promise<Service[]>;
  updateService: (id: string, data: UpdateItemRequest) => Promise<void>;
  deleteService: (id: string) => Promise<void>;

  // Ações gerais
  clearProducts: () => void;
  clearServices: () => void;
}

export const useItensStore = create<ItensState>((set, get) => ({
  // Estados iniciais
  products: [],
  services: [],

  // Ações para Produtos
  createProduct: async (data: CreateItemRequest) => {
    try {
      const newProduct = await createProduct(data);
      set((state) => ({
        products: [...state.products, newProduct],
      }));
      showSuccessToast('Produto criado com sucesso!', 'Produto adicionado à lista.');
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      showErrorToast('Erro ao criar produto', 'Verifique os dados e tente novamente.');
      throw error;
    }
  },

  getProducts: async (params?: GetProductsParams) => {
    try {
      const products = await getProducts(params);
      
      // Se é a primeira página (sem page ou page 0), substituir
      // Se é uma página subsequente, acumular sem duplicatas
      if (!params?.page || params.page === 0) {
        set({ products });
      } else {
        set((state) => {
          // Filtrar duplicatas baseado no ID
          const existingIds = new Set(state.products.map(p => p.id));
          const newProducts = products.filter(p => !existingIds.has(p.id));
          
          return {
            products: [...state.products, ...newProducts]
          };
        });
      }
      
      return products; // Retornar os produtos para verificar se está vazio
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      showErrorToast('Erro ao carregar produtos', 'Tente novamente mais tarde.');
      throw error;
    }
  },

  updateProduct: async (id: string, data: UpdateItemRequest) => {
    try {
      const updatedProduct = await updateProduct(id, data);
      set((state) => ({
        products: state.products.map((product) =>
          product.id === id ? updatedProduct : product
        ),
      }));
      showSuccessToast('Produto atualizado com sucesso!', 'Alterações salvas.');
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      showErrorToast('Erro ao atualizar produto', 'Verifique os dados e tente novamente.');
      throw error;
    }
  },

  deleteProduct: async (id: string) => {
    try {
      await deleteProduct(id);
      set((state) => ({
        products: state.products.filter((product) => product.id !== id),
      }));
      showSuccessToast('Produto removido com sucesso!', 'Produto excluído da lista.');
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      showErrorToast('Erro ao remover produto', 'Tente novamente mais tarde.');
      throw error;
    }
  },

  // Ações para Serviços
  createService: async (data: CreateItemRequest) => {
    try {
      const newService = await createService(data);
      set((state) => ({
        services: [...state.services, newService],
      }));
      showSuccessToast('Serviço criado com sucesso!', 'Serviço adicionado à lista.');
    } catch (error) {
      console.error('Erro ao criar serviço:', error);
      showErrorToast('Erro ao criar serviço', 'Verifique os dados e tente novamente.');
      throw error;
    }
  },

  getServices: async (params?: GetServicesParams) => {
    try {
      const services = await getServices(params);
      
      // Se é a primeira página (sem page ou page 0), substituir
      // Se é uma página subsequente, acumular sem duplicatas
      if (!params?.page || params.page === 0) {
        set({ services });
      } else {
        set((state) => {
          // Filtrar duplicatas baseado no ID
          const existingIds = new Set(state.services.map(s => s.id));
          const newServices = services.filter(s => !existingIds.has(s.id));
          
          return {
            services: [...state.services, ...newServices]
          };
        });
      }
      
      return services; // Retornar os serviços para verificar se está vazio
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      showErrorToast('Erro ao carregar serviços', 'Tente novamente mais tarde.');
      throw error;
    }
  },

  updateService: async (id: string, data: UpdateItemRequest) => {
    try {
      const updatedService = await updateService(id, data);
      set((state) => ({
        services: state.services.map((service) =>
          service.id === id ? updatedService : service
        ),
      }));
      showSuccessToast('Serviço atualizado com sucesso!', 'Alterações salvas.');
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      showErrorToast('Erro ao atualizar serviço', 'Verifique os dados e tente novamente.');
      throw error;
    }
  },

  deleteService: async (id: string) => {
    try {
      await deleteService(id);
      set((state) => ({
        services: state.services.filter((service) => service.id !== id),
      }));
      showSuccessToast('Serviço removido com sucesso!', 'Serviço excluído da lista.');
    } catch (error) {
      console.error('Erro ao deletar serviço:', error);
      showErrorToast('Erro ao remover serviço', 'Tente novamente mais tarde.');
      throw error;
    }
  },

  // Ações gerais

  clearProducts: () => {
    set({ products: [] });
  },

  clearServices: () => {
    set({ services: [] });
  },
})); 