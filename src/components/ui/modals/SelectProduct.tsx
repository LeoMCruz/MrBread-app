import React, { useState, useMemo, useEffect, useCallback } from "react";
import { View, FlatList, Pressable, ActivityIndicator } from "react-native";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ModalFlatList from "./ModalFlatList";
import Typography from "@/components/ui/Typography";
import { Package, Search, CheckCircle, Circle } from "lucide-react-native";
import { useItensStore } from "@/stores/itensStore";
import { Product } from "@/services/itensService";

interface SelectProductProps {
  visible: boolean;
  onClose: () => void;
  onSave: (products: Product[]) => void;
  loading?: boolean;
  existingProductIds?: string[];
}

export default function SelectProduct({
  visible,
  onClose,
  onSave,
  loading = false,
  existingProductIds = [],
}: SelectProductProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Store
  const { products, getProducts } = useItensStore();

  // Carregamento inicial
  useEffect(() => {
    if (visible) {
      loadProducts();
    }
  }, [visible]);

  const loadProducts = async (params?: { search?: string; page?: number }) => {
    // Se é carregamento inicial, usar loading da página
    if (!params?.page && !params?.search) {
      setIsPageLoading(true);
    } else if (params?.page && params.page > 0) {
      // Se é paginação, usar loading do rodapé
      setIsLoadingMore(true);
    }
    
    try {
      const response = await getProducts(params);
      
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
      console.error('Erro ao carregar produtos:', error);
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
        await loadProducts({ search: query });
        setIsSearching(false);
      } else {
        await loadProducts();
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  };

  const handleLoadMore = () => {
    if (!hasMoreData || isLoadingMore || isPageLoading || isSearching) return;
    
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    
    loadProducts({ 
      search: searchTerm, 
      page: nextPage
    });
  };

  // Verificar se produto está selecionado
  const isProductSelected = (product: Product) => {
    return selectedProducts.some((p) => p.id === product.id);
  };

  // Verificar se produto já existe na lista principal
  const isProductAlreadyInList = (product: Product) => {
    return existingProductIds.includes(product.id);
  };

  // Toggle seleção do produto
  const toggleProductSelection = (product: Product) => {
    // Não permitir selecionar produtos que já estão na lista principal
    if (isProductAlreadyInList(product)) {
      return;
    }

    if (isProductSelected(product)) {
      setSelectedProducts((prev) => prev.filter((p) => p.id !== product.id));
    } else {
      setSelectedProducts((prev) => [...prev, product]);
    }
  };

  // Renderizar item da lista
  const renderProductItem = ({ item }: { item: Product }) => {
    const isSelected = isProductSelected(item);
    const isAlreadyInList = isProductAlreadyInList(item);

    return (
      <Pressable
        onPress={() => toggleProductSelection(item)}
        disabled={isAlreadyInList}
        className={`rounded-lg p-3 border mb-2 ${
          isSelected
            ? "border-blue-500 bg-blue-900/20"
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
    onSave(selectedProducts);
    setSelectedProducts([]);
    setSearchTerm("");
  };

  const handleClose = () => {
    setSelectedProducts([]);
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
      title="Selecionar Produtos"
      icon={<Package size={24} color="#3B82F6" />}
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
            title={`Salvar (${selectedProducts.length})`}
            onPress={handleSave}
            loading={loading}
            disabled={selectedProducts.length === 0}
            className="flex-1"
          />
        </>
      }
    >
      <View className="flex-1 gap-4">
        <View>
          <Input
            placeholder="Buscar produtos..."
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
              Buscando produtos...
            </Typography>
          </View>
        ) : (
          <FlatList
            data={products}
            renderItem={renderProductItem}
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
                <Package size={48} color="#6b7280" />
                <Typography variant="h3" className="text-gray-400 mt-4 mb-2">
                  Nenhum produto encontrado
                </Typography>
                <Typography variant="body-secondary" className="text-center">
                  {searchTerm
                    ? "Tente ajustar sua busca"
                    : "Nenhum produto cadastrado"}
                </Typography>
              </View>
            )}
          />
        )}

        {selectedProducts.length > 0 && (
          <View className="bg-blue-900/20 border border-blue-500 rounded-lg p-3">
            <Typography
              variant="body"
              size="sm"
              className="text-blue-400 text-center"
            >
              {selectedProducts.length} produto(s) selecionado(s)
            </Typography>
          </View>
        )}
      </View>
    </ModalFlatList>
  );
}
