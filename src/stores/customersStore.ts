import { create } from "zustand";
import { 
  Customer, 
  CreateCustomerRequest, 
  UpdateCustomerRequest,
  GetCustomersParams,
  createCustomer as createCustomerService,
  getCustomers as getCustomersService,
  updateCustomer as updateCustomerService,
  deleteCustomer as deleteCustomerService
} from "@/services/customersService";
import { showSuccessToast, showErrorToast } from "@/services/axios";

interface CustomersState {
  // Estados
  customers: Customer[];

  // Ações para Customers
  createCustomer: (data: CreateCustomerRequest) => Promise<Customer>;
  getCustomers: (params?: GetCustomersParams) => Promise<Customer[]>;
  updateCustomer: (id: string, data: UpdateCustomerRequest) => Promise<Customer>;
  deleteCustomer: (id: string) => Promise<void>;

  // Ações gerais
  clearCustomers: () => void;
}

export const useCustomersStore = create<CustomersState>((set, get) => ({
  // Estados iniciais
  customers: [],

  // Ações para Customers
  createCustomer: async (data: CreateCustomerRequest) => {
    try {
      const newCustomer = await createCustomerService(data);
      set((state) => ({
        customers: [...state.customers, newCustomer],
      }));
      showSuccessToast('Customer criado com sucesso!', 'Customer adicionado à lista.');
      return newCustomer;
    } catch (error) {
      console.error('Erro ao criar customer:', error);
      showErrorToast('Erro ao criar customer', 'Verifique os dados e tente novamente.');
      throw error;
    }
  },

  getCustomers: async (params?: GetCustomersParams) => {
    try {
      const customers = await getCustomersService(params);
      
      // Se é a primeira página (sem page ou page 0), substituir
      // Se é uma página subsequente, acumular sem duplicatas
      if (!params?.page || params.page === 0) {
        set({ customers });
      } else {
        set((state) => {
          // Filtrar duplicatas baseado no ID
          const existingIds = new Set(state.customers.map(c => c.id));
          const newCustomers = customers.filter(c => !existingIds.has(c.id));
          
          return {
            customers: [...state.customers, ...newCustomers]
          };
        });
      }
      
      return customers; // Retornar os customers para verificar se está vazio
    } catch (error) {
      console.error('Erro ao buscar customers:', error);
      showErrorToast('Erro ao carregar customers', 'Tente novamente mais tarde.');
      throw error;
    }
  },

  updateCustomer: async (id: string, data: UpdateCustomerRequest) => {
    try {
      const updatedCustomer = await updateCustomerService(id, data);
      set((state) => ({
        customers: state.customers.map((customer) =>
          customer.id === id ? updatedCustomer : customer
        ),
      }));
      showSuccessToast('Customer atualizado com sucesso!', 'Alterações salvas.');
      return updatedCustomer;
    } catch (error) {
      console.error('Erro ao atualizar customer:', error);
      showErrorToast('Erro ao atualizar customer', 'Verifique os dados e tente novamente.');
      throw error;
    }
  },

  deleteCustomer: async (id: string) => {
    try {
      await deleteCustomerService(id);
      set((state) => ({
        customers: state.customers.filter((customer) => customer.id !== id),
      }));
      showSuccessToast('Customer removido com sucesso!', 'Customer excluído da lista.');
    } catch (error) {
      console.error('Erro ao deletar customer:', error);
      showErrorToast('Erro ao remover customer', 'Tente novamente mais tarde.');
      throw error;
    }
  },

  // Ações gerais
  clearCustomers: () => {
    set({ customers: [] });
  },
})); 