import React, { useState, useMemo, useEffect, useCallback } from "react";
import { View, FlatList, Pressable, ActivityIndicator } from "react-native";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ModalFlatList from "./ModalFlatList";
import Typography from "@/components/ui/Typography";
import { Wrench, Search, CheckCircle, Circle } from "lucide-react-native";
import { useItensStore } from "@/stores/itensStore";
import { Service } from "@/services/itensService";

interface SelectServiceProps {
  visible: boolean;
  onClose: () => void;
  onSave: (services: Service[]) => void;
  loading?: boolean;
  existingServiceIds?: string[];
}

export default function SelectService({
  visible,
  onClose,
  onSave,
  loading = false,
  existingServiceIds = [],
}: SelectServiceProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Store
  const { services, getServices } = useItensStore();

  // Carregamento inicial
  useEffect(() => {
    if (visible) {
      loadServices();
    }
  }, [visible]);

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

  const handleSearch = async (query: string) => {
    setSearchTerm(query);
    
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

  const handleLoadMore = () => {
    if (!hasMoreData || isLoadingMore || isPageLoading || isSearching) return;
    
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    
    loadServices({ 
      search: searchTerm, 
      page: nextPage
    });
  };

  // Verificar se serviço está selecionado
  const isServiceSelected = (service: Service) => {
    return selectedServices.some((s) => s.id === service.id);
  };

  // Verificar se serviço já existe na lista principal
  const isServiceAlreadyInList = (service: Service) => {
    return existingServiceIds.includes(service.id);
  };

  // Toggle seleção do serviço
  const toggleServiceSelection = (service: Service) => {
    // Não permitir selecionar serviços que já estão na lista principal
    if (isServiceAlreadyInList(service)) {
      return;
    }

    if (isServiceSelected(service)) {
      setSelectedServices((prev) => prev.filter((s) => s.id !== service.id));
    } else {
      setSelectedServices((prev) => [...prev, service]);
    }
  };

  // Renderizar item da lista
  const renderServiceItem = ({ item }: { item: Service }) => {
    const isSelected = isServiceSelected(item);
    const isAlreadyInList = isServiceAlreadyInList(item);

    return (
      <Pressable
        onPress={() => toggleServiceSelection(item)}
        disabled={isAlreadyInList}
        className={`rounded-lg p-3 border mb-2 ${
          isSelected
            ? "border-orange-500 bg-orange-900/20"
            : "bg-gray-700 border-gray-600"
        } ${isAlreadyInList ? "opacity-50" : ""}`}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <View className="flex-row items-center gap-2 mb-1">
              {isSelected ? (
                <CheckCircle size={16} color="#10b981" />
              ) : (
                <Circle size={16} color="#6b7280" />
              )}
                           <Typography variant="body" size="sm" className="font-medium">
               {item.name}
             </Typography>
            </View>
            <Typography
              variant="caption"
              size="xs"
              className="text-gray-400 ml-6"
            >
              {item.description}
            </Typography>
          </View>
          <View className="items-end">
            <Typography
              variant="body"
              size="sm"
              className="text-emerald-500 font-semibold"
            >
              R$ {item.price.toFixed(2).replace(".", ",")}
            </Typography>
          </View>
        </View>
      </Pressable>
    );
  };

  const handleSave = () => {
    onSave(selectedServices);
    setSelectedServices([]);
    setSearchTerm("");
  };

  const handleClose = () => {
    setSelectedServices([]);
    setSearchTerm("");
    setCurrentPage(0);
    setHasMoreData(true);
    setIsPageLoading(false);
    setIsLoadingMore(false);
    setIsSearching(false);
    onClose();
  };

  return (
    <ModalFlatList
      visible={visible}
      onClose={handleClose}
      title="Selecionar Serviços"
      icon={<Wrench size={24} color="#F59E0B" />}
      saved={!loading}
      height={0.8}
      onSave={handleSave}
      footer={
        <>
          <Button
            title="Cancelar"
            variant="outlined"
            onPress={handleClose}
            className="flex-1"
          />
          <Button
            title={`Salvar (${selectedServices.length})`}
            onPress={handleSave}
            loading={loading}
            disabled={selectedServices.length === 0}
            className="flex-1"
          />
        </>
      }
    >
      <View className="flex-1 gap-4">
        <View>
          <Input
            placeholder="Buscar serviços..."
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
              Buscando serviços...
            </Typography>
          </View>
        ) : (
          <FlatList
            data={services}
            renderItem={renderServiceItem}
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
                <Wrench size={48} color="#6b7280" />
                <Typography variant="h3" className="text-gray-400 mt-4 mb-2">
                  Nenhum serviço encontrado
                </Typography>
                <Typography variant="body-secondary" className="text-center">
                  {searchTerm
                    ? "Tente ajustar sua busca"
                    : "Nenhum serviço cadastrado"}
                </Typography>
              </View>
            )}
          />
        )}

        {selectedServices.length > 0 && (
          <View className="bg-orange-900/20 border border-orange-500 rounded-lg p-3">
            <Typography
              variant="body"
              size="sm"
              className="text-orange-400 text-center"
            >
              {selectedServices.length} serviço(s) selecionado(s)
            </Typography>
          </View>
        )}
      </View>
    </ModalFlatList>
  );
}
