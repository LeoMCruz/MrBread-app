import React, { useState, useEffect } from "react";
import { View, ScrollView, Pressable, FlatList, Platform, Vibration, Alert, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Typography from "@/components/ui/Typography";
import Header from "@/components/ui/Header";
import IconButton from "@/components/ui/IconButton";
import Input from "@/components/ui/Input";
import OrdersSkeleton from "@/components/ui/loadingPages/ordersSkeleton";
import { useOrdersStore } from "@/stores/ordersStore";
import { Order } from "@/services/ordersService";

// Interface para Order com dados formatados (mesma do store)
interface FormattedOrder extends Omit<Order, 'idPedido' | 'dataCriacao'> {
  idPedido: string; // Agora é string (PED-0001)
  dataCriacao: string; // Data formatada
}
import {
  ArrowLeft,
  FileText,
  User,
  Calendar,
  DollarSign,
} from "lucide-react-native";

export default function Orders() {
  const { orders, getOrders } = useOrdersStore();
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);

  // Carregar orders da API
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async (params?: { page?: number }) => {
    // Se é carregamento inicial, usar loading da página
    if (!params?.page) {
      setIsPageLoading(true);
    } else if (params?.page && params.page > 0) {
      // Se é paginação, usar loading do rodapé
      setIsLoadingMore(true);
    }
    
    try {
      const response = await getOrders(params);
      
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
      console.error('Erro ao carregar orders:', error);
      setIsPageLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleLoadMore = () => {
    if (!hasMoreData || isLoadingMore || isPageLoading) return;
    
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    
    loadOrders({ page: nextPage });
  };

  const triggerHaptic = async (style: Haptics.ImpactFeedbackStyle) => {
    try {
      await Haptics.impactAsync(style);
    } catch {
      // Fallback silencioso - não quebra a experiência
      if (Platform.OS === "android") {
        Vibration.vibrate(style === Haptics.ImpactFeedbackStyle.Heavy ? 100 : 50);
      }
    }
  };

  const handleViewOrder = async (order: FormattedOrder) => {
    await triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/auth/view-order?id=${order.id}`);
  };

  const handleDeleteOrder = (orderId: string) => {
    Alert.alert(
      "Excluir Pedido",
      "Tem certeza que deseja excluir este pedido?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            // TODO: Implementar delete quando tivermos a API
            console.log('Delete order:', orderId);
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONCLUIDO":
        return "#10B981";
      case "PENDENTE":
        return "#F59E0B";
      case "CANCELADO":
        return "#EF4444";
      case "ATIVO":
        return "#3B82F6";
      default:
        return "#6B7280";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "CONCLUIDO":
        return "Concluído";
      case "PENDENTE":
        return "Pendente";
      case "CANCELADO":
        return "Cancelado";
      case "ATIVO":
        return "Ativo";
      default:
        return "Desconhecido";
    }
  };

  const renderOrderItem = ({ item }: { item: FormattedOrder }) => (
    <Pressable
      onPress={() => handleViewOrder(item)}
      onLongPress={async () => {
        await triggerHaptic(Haptics.ImpactFeedbackStyle.Heavy);
        handleDeleteOrder(item.id);
      }}
      className="bg-gray-800 rounded-xl p-4 mb-4 border border-gray-700 active:bg-gray-700"
      android_ripple={{ color: "#374151", borderless: false }}
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-1">
            <Typography variant="h3" className="text-white">
              {item.idPedido}
            </Typography>
            <View
              className="px-2 py-1 rounded-full"
              style={{ backgroundColor: getStatusColor(item.status) + "20" }}
            >
              <Typography
                variant="caption"
                size="xs"
                style={{ color: getStatusColor(item.status) }}
              >
                {getStatusText(item.status)}
              </Typography>
            </View>
          </View>
          <Typography variant="body-secondary" className="text-sm mb-1">
            {item.cliente}
          </Typography>
          <Typography variant="body-secondary" className="text-sm mb-2">
            {item.razaoSocial}
          </Typography>
          <View className="flex-row items-center gap-4">
            <View className="flex-row items-center gap-2">
              <Calendar size={15} color="#6b7280" />
              <Typography variant="body-secondary" className="text-sm">
                {item.dataCriacao}
              </Typography>
            </View>
          </View>
        </View>
        <View className="flex-col justify-between items-end pt-8 ">
          <View className="items-end">
            <Typography variant="h3" className="text-green-500 font-bold">
              R$ {item.precoTotal.toFixed(2).replace(".", ",")}
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
          title="Pedidos"
          leftIcon={
            <IconButton
              icon={<ArrowLeft size={20} color="#F3F5F7" />}
              onPress={handleBack}
              variant="ghost"
            />
          }
        />
        <OrdersSkeleton itemCount={5} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900 ">
      <Header
        title="Pedidos"
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
        <View className="flex-1 mb-6">
          <FlatList
            data={orders}
            renderItem={renderOrderItem}
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
                <FileText size={48} color="#6b7280" />
                <Typography variant="h3" className="text-gray-400 mt-4 mb-2">
                  Nenhum pedido encontrado
                </Typography>
                <Typography variant="body-secondary" className="text-center">
                  Nenhum pedido foi criado ainda
                </Typography>
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
}
