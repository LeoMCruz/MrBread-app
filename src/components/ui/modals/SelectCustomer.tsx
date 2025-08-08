import React, { useState, useMemo, useEffect, useCallback } from "react";
import { View, FlatList, Pressable, ActivityIndicator } from "react-native";
import Input from "@/components/ui/Input";
import ModalFlatList from "./ModalFlatList";
import Typography from "@/components/ui/Typography";
import { User, Search, Building } from "lucide-react-native";
import { useCustomersStore } from "@/stores/customersStore";
import { Customer } from "@/services/customersService";

interface SelectCustomerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (customer: Customer) => void;
  loading?: boolean;
}

export default function SelectCustomer({
  visible,
  onClose,
  onSelect,
  loading = false,
}: SelectCustomerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);

  // Store
  const { customers, getCustomers } = useCustomersStore();

  // Carregamento inicial
  useEffect(() => {
    if (visible) {
      loadCustomers();
    }
  }, [visible]);



  const loadCustomers = async (params?: { search?: string; page?: number }) => {
    // Se é carregamento inicial, usar loading da página
    if (!params?.page && !params?.search) {
      setIsPageLoading(true);
    } else if (params?.page && params.page > 0) {
      // Se é paginação, usar loading do rodapé
      setIsLoadingMore(true);
    }
    
    try {
      const response = await getCustomers(params);
      
      // Se não há parâmetros de página ou é página 0, resetar paginação
      if (!params?.page || params.page === 0) {
        setCurrentPage(0);
        setHasMoreData(true);
      }
      
      // Se a resposta está vazia (página subsequente), não há mais dados
      if (params?.page && params.page > 0 && response.length === 0) {
        setHasMoreData(false);
      }
      
      // Se é uma página subsequente e a resposta tem menos de 10 itens (assumindo que é o tamanho da página)
      // ou se todos os itens são duplicatas (resposta vazia após filtro)
      if (params?.page && params.page > 0 && response.length < 10) {
        setHasMoreData(false);
      }
      
      setIsPageLoading(false);
      setIsLoadingMore(false);
    } catch (error) {
      console.error('Erro ao carregar customers:', error);
      setIsPageLoading(false);
      setIsLoadingMore(false);
      setIsSearching(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchTerm(query);
    
    // Busca com delay
    const timer = setTimeout(async () => {
      if (query !== "") {
        setIsSearching(true);
        await loadCustomers({ search: query });
        setIsSearching(false);
      } else {
        await loadCustomers();
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  };

  const handleLoadMore = () => {
    if (!hasMoreData || isLoadingMore || isPageLoading || isSearching) return;
    
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    
    loadCustomers({ 
      search: searchTerm, 
      page: nextPage
    });
  };

  // Selecionar cliente
  const handleSelectCustomer = (customer: Customer) => {
    onSelect(customer);
    setSearchTerm("");
    onClose();
  };

  // Renderizar item da lista
  const renderCustomerItem = ({ item }: { item: Customer }) => {
    return (
      <Pressable
        onPress={() => handleSelectCustomer(item)}
        className="bg-gray-700 rounded-lg p-3 border border-gray-600 mb-2 active:bg-gray-600"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Typography variant="body" size="sm" className="font-medium mb-1">
              {item.nomeFantasia}
            </Typography>
            <Typography
              variant="caption"
              size="xs"
              className="text-gray-400 mb-1"
            >
              {item.razaoSocial}
            </Typography>
            <Typography variant="caption" size="xs" className="text-gray-400">
              {item.cnpj.length < 15 ? `CPF: ${item.cnpj}` : `CNPJ: ${item.cnpj}`}
            </Typography>
            <Typography variant="caption" size="xs" className="text-gray-400">
              {item.cidade} - {item.estado}
            </Typography>
          </View>
        </View>
      </Pressable>
    );
  };

  const handleClose = () => {
    setSearchTerm("");
    setCurrentPage(0);
    setHasMoreData(true);
    onClose();
  };

  return (
    <ModalFlatList
      visible={visible}
      onClose={handleClose}
      title="Selecionar Cliente"
      icon={<User size={24} color="#10B981" />}
      saved={!loading}
      height={0.8}
    >
      <View className="flex-1 gap-4">
        <View>
          <Input
            placeholder="Buscar clientes..."
            leftIcon={<Search size={20} color="#6b7280" />}
            value={searchTerm}
            onChangeText={handleSearch}
            autoCapitalize="none"
          />
        </View>

        {isPageLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
        ) : isSearching ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Typography variant="body-secondary" className="text-gray-400 mt-4">
              Buscando customers...
            </Typography>
          </View>
        ) : (
          <FlatList
            data={customers}
            renderItem={renderCustomerItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            className="flex-1"
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.2}
            ListFooterComponent={() => 
              isLoadingMore ? (
                <View className="py-4 items-center">
                  <ActivityIndicator size="small" color="#3b82f6" />
                </View>
              ) : null
            }
            ListEmptyComponent={() => (
              <View className="flex-1 justify-center items-center py-20">
                <Building size={48} color="#6b7280" />
                <Typography variant="h3" className="text-gray-400 mt-4 mb-2">
                  Nenhum customer encontrado
                </Typography>
                <Typography variant="body-secondary" className="text-center">
                  {searchTerm
                    ? "Tente ajustar sua busca"
                    : "Nenhum customer cadastrado"}
                </Typography>
              </View>
            )}
          />
        )}
      </View>
    </ModalFlatList>
  );
}
