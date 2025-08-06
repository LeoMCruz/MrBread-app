import React, { useState, useEffect, useCallback } from "react";
import { View, Pressable, FlatList, Platform, Vibration, Alert, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import Toast from 'react-native-toast-message';
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import IconButton from "@/components/ui/IconButton";
import Input from "@/components/ui/Input";
import NewService from "@/components/ui/modals/NewService";
import ListSkeleton from "@/components/ui/loadingPages/listSkeleton";
import { useItensStore } from "@/stores/itensStore";
import { Service } from "@/services/itensService";
import {
  ArrowLeft,
  Wrench,
  Plus,
  Search,
} from "lucide-react-native";

export default function Services() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingService, setEditingService] = useState<Service | undefined>(
    undefined
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);

  // Store
  const { services, getServices, createService, updateService, deleteService } = useItensStore();

  // Carregamento inicial
  useEffect(() => {
    loadServices();
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
        await loadServices({ search: query });
        setIsSearching(false);
      } else {
        await loadServices();
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  };

  const loadServices = async (params?: { search?: string; page?: number }) => {
    // Se é carregamento inicial, usar loading da página
    if (!params?.page && !params?.search) {
      setIsPageLoading(true);
    } else if (params?.page && params.page > 0) {
      // Se é paginação, usar loading do rodapé
      setIsLoadingMore(true);
    }
    
    try {
      const response = await getServices(params);
      
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
      console.error('Erro ao carregar serviços:', error);
      setIsPageLoading(false);
      setIsLoadingMore(false);
      setIsSearching(false);
    }
  };

  const handleLoadMore = () => {
    if (!hasMoreData || isLoading || isLoadingMore || isPageLoading || isSearching) return;
    
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    
    loadServices({ 
      search: searchQuery, 
      page: nextPage
    });
  };

  const handleAddService = () => {
    setModalMode("create");
    setEditingService(undefined);
    setIsModalVisible(true);
  };

  const handleSaveService = async (serviceData: { name: string; description?: string; price: number }) => {
    setIsLoading(true);

    try {
      await createService(serviceData);
      showToast('success', 'Serviço adicionado!', 'Serviço foi adicionado com sucesso.');
      await loadServices({ page: 0 });
    } catch (error) {
      showToast('error', 'Erro ao adicionar', 'Não foi possível adicionar o serviço.');
    } finally {
      setIsLoading(false);
      setIsModalVisible(false);
    }
  };

  const handleEditServiceSave = async (editedService: { id: string; name: string; description: string; price: number }) => {
    setIsLoading(true);

    try {
      await updateService(editedService.id, {
        name: editedService.name,
        description: editedService.description,
        price: editedService.price,
      });
      showToast('success', 'Serviço atualizado!', 'Serviço foi atualizado com sucesso.');
      await loadServices({ page: 0 });
    } catch (error) {
      showToast('error', 'Erro ao atualizar', 'Não foi possível atualizar o serviço.');
    } finally {
      setIsLoading(false);
      setIsModalVisible(false);
    }
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

  const handleEditService = (service: Service) => {
    triggerVibration(false);
    setModalMode("edit");
    setEditingService(service);
    setIsModalVisible(true);
  };

  const handleDeleteService = (serviceId: string) => {
    Alert.alert(
      "Excluir Serviço",
      "Tem certeza que deseja excluir este serviço?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteService(serviceId);
              showToast('success', 'Serviço removido!', 'Serviço foi removido com sucesso.');
              await loadServices({ page: 0 });
            } catch (error) {
              showToast('error', 'Erro ao remover', 'Não foi possível remover o serviço.');
            }
          },
        },
      ]
    );
  };

  const renderServiceItem = ({ item }: { item: Service }) => (
    <Pressable
      onPress={() => handleEditService(item)}
      onLongPress={() => {
        triggerVibration(true);
        handleDeleteService(item.id);
      }}
      className="bg-gray-800 rounded-xl p-4 mb-4 border border-gray-700 active:bg-gray-700"
      android_ripple={{ color: "#374151", borderless: false }}
    >
      <View className="flex-row justify-between items-start mb-1">
        <View className="flex-1">
          <Typography variant="h3" className="text-white mb-1">
            {item.name}
          </Typography>
          {item.description && (
            <Typography variant="body-secondary" className="text-sm">
              {item.description}
            </Typography>
          )}
        </View>
        <View className=" gap-6 flex-col justify-between pt-6">
          <View className="items-center">
            <Typography variant="h3" className="text-green-500 ml-1">
              R$ {item.price?.toFixed(2) || '0.00'}
            </Typography>
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
          title="Serviços"
          leftIcon={
            <IconButton
              icon={<ArrowLeft size={20} color="#F3F5F7" />}
              onPress={handleBack}
              variant="ghost"
            />
          }
        />
        <ListSkeleton itemCount={7} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900">
      <Header
        title="Serviços"
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
            placeholder="Buscar serviços..."
            leftIcon={<Search size={20} color="#6b7280" />}
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
          />
        </View>

        <View className="mb-6">
          <Button
            title="Novo Serviço"
            variant="outlined"
            leftIcon={<Plus size={16} color="#3b82f6" />}
            onPress={handleAddService}
            fullWidth
          />
        </View>

        <View className="flex-1 mb-6">
          {isSearching ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#3b82f6" />
              <Typography variant="body-secondary" className="text-gray-400 mt-4">
                Buscando serviços...
              </Typography>
            </View>
          ) : (
            <FlatList
              data={services}
              renderItem={renderServiceItem}
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
                  <Wrench size={48} color="#6b7280" />
                  <Typography variant="h3" className="text-gray-400 mt-4 mb-2">
                    Nenhum serviço encontrado
                  </Typography>
                  <Typography variant="body-secondary" className="text-center">
                    {searchQuery
                      ? "Tente ajustar sua busca"
                      : "Cadastre seu primeiro serviço"}
                  </Typography>
                </View>
              )}
            />
          )}
        </View>
      </View>

      <NewService
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSaveService}
        onEdit={handleEditServiceSave}
        loading={isLoading}
        mode={modalMode}
        initialData={editingService ? {
          id: editingService.id,
          name: editingService.name,
          description: editingService.description || '',
          price: editingService.price,
        } : undefined}
      />
    </View>
  );
}
