import React, { useState, useEffect, useCallback } from "react";
import { View, Pressable, FlatList, Platform, Vibration, Alert, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import Toast from 'react-native-toast-message';
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import IconButton from "@/components/ui/IconButton";
import Input from "@/components/ui/Input";
import NewProduct from "@/components/ui/modals/NewProduct";
import ListSkeleton from "@/components/ui/loadingPages/listSkeleton";
import { useItensStore } from "@/stores/itensStore";
import { Product } from "@/services/itensService";
import {
  ArrowLeft,
  Package,
  Plus,
  Search,
} from "lucide-react-native";

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(
    undefined
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);

  // Store
  const { products, getProducts, createProduct, updateProduct, deleteProduct } = useItensStore();

  // Carregamento inicial
  useEffect(() => {
    loadProducts();
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
        await loadProducts({ search: query, page: 0 });
        setIsSearching(false);
      } else {
        await loadProducts();
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  };

  const loadProducts = async (params?: { search?: string; page?: number }) => {
    // Se é carregamento inicial, usar loading da página
    if (!params?.page && !params?.search) {
      setIsPageLoading(true);
    }else if (params?.page && params.page > 0) {
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

  const handleLoadMore = () => {
    if (!hasMoreData || isLoading || isLoadingMore || isPageLoading || isSearching) return;
    
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    
    loadProducts({ 
      search: searchQuery, 
      page: nextPage
    });
  };

  const handleAddProduct = () => {
    setModalMode("create");
    setEditingProduct(undefined);
    setIsModalVisible(true);
  };

  const handleSaveProduct = async (productData: { name: string; description?: string; price: number }) => {
    setIsLoading(true);

    try {
      await createProduct(productData);
      showToast('success', 'Produto adicionado!', 'Produto foi adicionado com sucesso.');
      await loadProducts({ page: 0 });
    } catch (error) {
      showToast('error', 'Erro ao adicionar', 'Não foi possível adicionar o produto.');
    } finally {
      setIsLoading(false);
      setIsModalVisible(false);
    }
  };

  const handleEditProductSave = async (editedProduct: { id: string; name: string; description: string; price: number }) => {
    setIsLoading(true);

    try {
      await updateProduct(editedProduct.id, {
        name: editedProduct.name,
        description: editedProduct.description,
        price: editedProduct.price,
      });
      showToast('success', 'Produto atualizado!', 'Produto foi atualizado com sucesso.');
      await loadProducts({ page: 0 });
    } catch (error) {
      showToast('error', 'Erro ao atualizar', 'Não foi possível atualizar o produto.');
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

  const handleEditProduct = (product: Product) => {
    triggerVibration(false);
    setModalMode("edit");
    setEditingProduct(product);
    setIsModalVisible(true);
  };

  const handleDeleteProduct = (productId: string) => {
    Alert.alert(
      "Excluir Produto",
      "Tem certeza que deseja excluir este produto?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProduct(productId);
              showToast('success', 'Produto removido!', 'Produto foi removido com sucesso.');
              await loadProducts({ page: 0 });
            } catch (error) {
              showToast('error', 'Erro ao remover', 'Não foi possível remover o produto.');
            }
          },
        },
      ]
    );
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <Pressable
      onPress={() => handleEditProduct(item)}
      onLongPress={() => {
        triggerVibration(true);
        handleDeleteProduct(item.id);
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
              R$ {item.price.toFixed(2)}
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
          title="Produtos"
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
        title="Produtos"
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
            placeholder="Buscar produtos..."
            leftIcon={<Search size={20} color="#6b7280" />}
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
          />
        </View>

        <View className="mb-6">
          <Button
            title="Novo Produto"
            variant="outlined"
            leftIcon={<Plus size={16} color="#3b82f6" />}
            onPress={handleAddProduct}
            fullWidth
          />
        </View>
        <View className="flex-1 mb-6">
          {isSearching ? (
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
              contentContainerStyle={{ 
                paddingBottom: 20,
                flexGrow: 1,
              }}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.1}
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
                    {searchQuery
                      ? "Tente ajustar sua busca"
                      : "Cadastre seu primeiro produto"}
                  </Typography>
                </View>
              )}
            />
          )}
        </View>
      </View>

      <NewProduct
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSaveProduct}
        onEdit={handleEditProductSave}
        loading={isLoading}
        mode={modalMode}
        initialData={editingProduct ? {
          id: editingProduct.id,
          name: editingProduct.name,
          description: editingProduct.description || '',
          price: editingProduct.price,
        } : undefined}
      />
    </View>
  );
}
