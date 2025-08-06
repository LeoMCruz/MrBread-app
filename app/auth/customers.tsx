import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView, Pressable, FlatList, Platform, Vibration, Alert, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import Toast from 'react-native-toast-message';
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import IconButton from "@/components/ui/IconButton";
import Input from "@/components/ui/Input";
import CustomersSkeleton from "@/components/ui/loadingPages/customersSkeleton";
import { useCustomersStore } from "@/stores/customersStore";
import { Customer } from "@/services/customersService";

import {
  ArrowLeft,
  Building,
  Plus,
  Search,
  Edit,
  Trash2,
  Mail,
  Phone,
} from "lucide-react-native";

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);

  // Store
  const { customers, getCustomers, deleteCustomer } = useCustomersStore();

  // Carregamento inicial
  useEffect(() => {
    loadCustomers();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
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

  const handleLoadMore = () => {
    if (!hasMoreData ||  isLoadingMore || isPageLoading || isSearching) return;
    
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    
    loadCustomers({ 
      search: searchQuery, 
      page: nextPage
    });
  };

  const handleAddCustomer = () => {
    router.push("/auth/new-customer?mode=create");
  };

  const triggerVibration = (isLongPress: boolean = false) => {
    if (Platform.OS === "android") {
      Vibration.vibrate(isLongPress ? 100 : 50);
    }
  };

  const showToast = (type: 'success' | 'error', title: string, message?: string) => {
    Toast.show({
      type,
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 60,
    });
  };

  const handleEditCustomer = (customer: Customer) => {
    triggerVibration(false);
    const customerData = JSON.stringify(customer);
    router.push(
      `/auth/new-customer?mode=edit&customerData=${encodeURIComponent(
        customerData
      )}`
    );
  };

  const handleDeleteCustomer = (customerId: string) => {
    Alert.alert(
      "Excluir Customer",
      "Tem certeza que deseja excluir este cliente?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCustomer(customerId);
              showToast('success', 'Cliente removido!', 'Cliente foi removido com sucesso.');
              await loadCustomers({ page: 0 });
            } catch (error) {
              showToast('error', 'Erro ao remover', 'Não foi possível remover o cliente.');
            }
          },
        },
      ]
    );
  };

  const renderCustomerItem = ({ item }: { item: Customer }) => (
    <Pressable
      onPress={() => handleEditCustomer(item)}
      onLongPress={() => {
        triggerVibration(true);
        handleDeleteCustomer(item.id);
      }}
      className="bg-gray-800 rounded-xl p-4 mb-4 border border-gray-700 active:bg-gray-700"
      android_ripple={{ color: "#374151", borderless: false }}
    >
      <View className="flex-row justify-between items-start mb-1">
        <View className="flex-1">
          <Typography variant="h3" className="text-white mb-1">
            {item.nomeFantasia}
          </Typography>
          <Typography variant="body-secondary" className="text-sm mb-1">
            {item.razaoSocial}
          </Typography>
          <Typography variant="body-secondary" className="text-sm mb-1">
            {item.cnpj.length < 15 ? `CPF: ${item.cnpj}` : `CNPJ: ${item.cnpj}`}
          </Typography>
          <Typography variant="body-secondary" className="text-sm mb-1">
            {item.cidade} - {item.estado}
          </Typography>
          <View className="flex-row items-center gap-4 mt-2">
            <View className="flex-row items-center gap-2">
              <Mail size={15} color="#6b7280" />
              <Typography variant="body-secondary" className="text-sm">
                {item.email}
              </Typography>
            </View>
            {item.telefone && (
              <View className="flex-row items-center gap-2">
                <Phone size={15} color="#6b7280" />
                <Typography variant="body-secondary" className="text-sm">
                  {item.telefone}
                </Typography>
              </View>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );

  // Renderizar skeleton durante carregamento
  if (isPageLoading) {
    return (
      <View className="flex-1 bg-gray-900">
        <Header
          title="Clientes"
          leftIcon={
            <IconButton
              icon={<ArrowLeft size={20} color="#F3F5F7" />}
              onPress={handleBack}
              variant="ghost"
            />
          }
        />
        <CustomersSkeleton itemCount={4} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900">
      <Header
        title="Clientes"
        leftIcon={
          <IconButton
            icon={<ArrowLeft size={20} color="#F3F5F7" />}
            onPress={handleBack}
            variant="ghost"
          />
        }
      />

      <View
        className={`flex-1 px-6 ${Platform.OS === "ios" ? "pt-6" : "pt-4"}`}
      >
        <View className="mb-6">
          <Input
            placeholder="Buscar clientes..."
            leftIcon={<Search size={20} color="#6b7280" />}
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
          />
        </View>

        <View className="mb-6">
          <Button
            title="Novo Cliente"
            variant="outlined"
            leftIcon={<Plus size={16} color="#3b82f6" />}
            onPress={handleAddCustomer}
            fullWidth
          />
        </View>

        <View className="flex-1 mb-6">
          {isSearching ? (
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
              contentContainerStyle={{ 
                paddingBottom: 20,
                flexGrow: 1,
              }}
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
                    {searchQuery
                      ? "Tente ajustar sua busca"
                      : "Cadastre seu primeiro customer"}
                  </Typography>
                </View>
              )}
            />
          )}
        </View>
      </View>
    </View>
  );
}
