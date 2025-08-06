import React, { useState, useEffect } from "react";
import { View, ScrollView, Platform, Alert, Pressable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import {
  User,
  Package,
  Wrench,
  FileText,
  Calculator,
  ArrowLeft,
  MoreVertical,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react-native";
import Header from "@/components/ui/Header";
import Typography from "@/components/ui/Typography";
import IconButton from "@/components/ui/IconButton";
import ViewOrderSkeleton from "@/components/ui/loadingPages/viewOrderSkeleton";
import { useOrdersStore } from "@/stores/ordersStore";

export default function ViewOrderScreen() {
  const params = useLocalSearchParams();
  const { getOrderById, selectedOrder } = useOrdersStore();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadOrderDetails(params.id as string);
    }
  }, [params.id]);

  const loadOrderDetails = async (orderId: string) => {
    try {
      setIsPageLoading(true);
      await getOrderById(orderId);
    } catch (error) {
      console.error("Erro ao carregar detalhes do pedido:", error);
    } finally {
      setIsPageLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
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

  const showToast = (
    type: "success" | "error",
    title: string,
    message?: string
  ) => {
    Toast.show({
      type,
      text1: title,
      text2: message,
      position: "top",
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 60,
    });
  };

  const handleStatusChange = (
    newStatus: "PENDENTE" | "CONCLUIDO" | "CANCELADO"
  ) => {
    const statusText = getStatusText(newStatus);
    const currentStatusText = getStatusText(selectedOrder?.status || "");

    Alert.alert(
      "Alterar Status",
      `Deseja alterar o status do pedido de "${currentStatusText}" para "${statusText}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: async () => {
            try {
              // TODO: Implementar alteração de status na API
              showToast(
                "success",
                "Status alterado!",
                `Pedido ${
                  selectedOrder?.idPedido
                } foi marcado como ${statusText.toLowerCase()}.`
              );
            } catch (error) {
              showToast(
                "error",
                "Erro ao alterar",
                "Não foi possível alterar o status do pedido."
              );
            }
          },
        },
      ]
    );
  };

  const showStatusMenu = () => {
    setShowDropdown(!showDropdown);
  };

  const handleStatusOption = (
    newStatus: "PENDENTE" | "CONCLUIDO" | "CANCELADO"
  ) => {
    setShowDropdown(false);
    handleStatusChange(newStatus);
  };

  // Função para capitalizar primeira letra
  const capitalizeFirstLetter = (text: string): string => {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  // Se não há pedido selecionado, mostrar loading
  if (!selectedOrder) {
    return (
      <View className="flex-1 bg-gray-900">
        <Header
          title="Visualizar Pedido"
          leftIcon={
            <IconButton
              icon={<ArrowLeft size={20} color="#F3F5F7" />}
              onPress={handleBack}
              variant="ghost"
            />
          }
        />
        <ViewOrderSkeleton productsCount={3} servicesCount={3} />
      </View>
    );
  }

  const order = selectedOrder;

  if (isPageLoading) {
    return (
      <View className="flex-1 bg-gray-900">
        <Header
          title="Visualizar Pedido"
          leftIcon={
            <IconButton
              icon={<ArrowLeft size={20} color="#F3F5F7" />}
              onPress={handleBack}
              variant="ghost"
            />
          }
        />
        <ViewOrderSkeleton productsCount={3} servicesCount={3} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900 ">
      <Header
        title="Visualizar Pedido"
        leftIcon={
          <IconButton
            icon={<ArrowLeft size={20} color="#F3F5F7" />}
            onPress={handleBack}
            variant="ghost"
          />
        }
      />

      <ScrollView
        className={`flex-1 px-6 mb-6 ${
          Platform.OS === "ios" ? "pt-6" : "pt-4"
        }`}
      >
        <View className="mb-4 flex-row justify-between items-center">
          <View />
          <View className="flex-row items-center gap-2 relative">
            <View
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: getStatusColor(order.status) + "20" }}
            >
              <Typography
                variant="caption"
                size="xs"
                style={{ color: getStatusColor(order.status) }}
              >
                {getStatusText(order.status)}
              </Typography>
            </View>
            <Pressable
              onPress={showStatusMenu}
              className="p-2 rounded-lg bg-gray-800"
            >
              <MoreVertical size={16} color="#F3F5F7" />
            </Pressable>

            {/* Dropdown Menu */}
            {showDropdown && (
              <View className="absolute top-12 right-0 bg-gray-800 rounded-lg border border-gray-600 shadow-lg z-10 min-w-48">
                <View className="p-1">
                  {order.status !== "PENDENTE" && (
                    <Pressable
                      onPress={() => handleStatusOption("PENDENTE")}
                      className="flex-row items-center gap-3 p-3 rounded-lg hover:bg-gray-700"
                    >
                      <Clock size={16} color="#F59E0B" />
                      <Typography
                        variant="body"
                        size="sm"
                        className="text-white"
                      >
                        Marcar como Pendente
                      </Typography>
                    </Pressable>
                  )}

                  {order.status !== "CONCLUIDO" && (
                    <Pressable
                      onPress={() => handleStatusOption("CONCLUIDO")}
                      className="flex-row items-center gap-3 p-3 rounded-lg hover:bg-gray-700"
                    >
                      <CheckCircle size={16} color="#10B981" />
                      <Typography
                        variant="body"
                        size="sm"
                        className="text-white"
                      >
                        Marcar como Concluído
                      </Typography>
                    </Pressable>
                  )}

                  {order.status !== "CANCELADO" && (
                    <Pressable
                      onPress={() => handleStatusOption("CANCELADO")}
                      className="flex-row items-center gap-3 p-3 rounded-lg hover:bg-gray-700"
                    >
                      <XCircle size={16} color="#EF4444" />
                      <Typography
                        variant="body"
                        size="sm"
                        className="text-white"
                      >
                        Cancelar Pedido
                      </Typography>
                    </Pressable>
                  )}
                </View>
              </View>
            )}
          </View>
        </View>

        <View className="bg-gray-800 rounded-lg p-4 mb-4 border border-gray-600">
          <View className="flex-row items-center justify-between">
            <View>
              <Typography variant="h2" className="text-white mb-1">
                {order.idPedido}
              </Typography>
              <Typography variant="body-secondary" className="text-sm">
                Criado em {order.dataCriacao}
              </Typography>
            </View>
          </View>
        </View>

        <View
          className="bg-gray-800 rounded-lg p-3 mb-4 border border-gray-600"
          style={{ borderLeftColor: "#10B981", borderLeftWidth: 4 }}
        >
          <View className="flex-row items-center gap-2 mb-3">
            <User size={16} color="#10b981" />
            <Typography variant="h3" size="base">
              Cliente
            </Typography>
          </View>

          <View className="bg-gray-700 rounded-lg p-3 border border-gray-600">
            <Typography variant="body" size="sm" className="font-medium mb-1">
              {order.nomeFantasiaCliente || "Cliente não informado"}
            </Typography>
            <Typography
              variant="caption"
              size="xs"
              className="text-gray-400 mb-1"
            >
              {order.cnpj.length < 15
                ? "CPF: " + order.cnpj
                : "CNPJ: " + order.cnpj}
            </Typography>
            <Typography variant="caption" size="xs" className="text-gray-400">
              {capitalizeFirstLetter(order.cidade) +
                " - " +
                capitalizeFirstLetter(order.estado)}
            </Typography>
          </View>
        </View>

        <View
          className="bg-gray-800 rounded-lg p-3 mb-4 border border-gray-600"
          style={{ borderLeftColor: "#3B82F6", borderLeftWidth: 4 }}
        >
          <View className="flex-row items-center gap-2 mb-3">
            <Package size={16} color="#3b82f6" />
            <Typography variant="h3" size="base">
              Produtos
            </Typography>
          </View>

          <View className="space-y-2 gap-1">
            {order.itens.filter((item) => item.tipo === "Produto").length >
            0 ? (
              order.itens
                .filter((item) => item.tipo === "Produto")
                .map((item) => (
                  <View
                    key={item.id}
                    className="bg-gray-700 rounded-lg p-3 px-3 border border-gray-600 mb-2"
                  >
                    <View className="flex-row items-center justify-between mb-2">
                      <View className="flex-1">
                        <Typography
                          variant="body"
                          size="sm"
                          className="font-medium"
                        >
                          {item.nome || "Produto sem nome"}
                        </Typography>
                        <Typography
                          variant="caption"
                          size="xs"
                          className="text-gray-400"
                        >
                          {item.descricao || "Unidade"}
                        </Typography>
                      </View>
                    </View>
                    <View className="flex-row gap-4">
                      <View>
                        <Typography
                          variant="caption"
                          size="xs"
                          className="text-gray-400"
                        >
                          Quantidade
                        </Typography>
                        <Typography variant="body" size="sm">
                          {item.quantidade || 0}
                        </Typography>
                      </View>
                      <View>
                        <Typography
                          variant="caption"
                          size="xs"
                          className="text-gray-400"
                        >
                          Preço Unit.
                        </Typography>
                        <Typography variant="body" size="sm">
                          R${" "}
                          {(item.precoUnitario || 0)
                            .toFixed(2)
                            .replace(".", ",")}
                        </Typography>
                      </View>
                      <View className="flex-1 items-end">
                        <Typography
                          variant="caption"
                          size="xs"
                          className="text-gray-400"
                        >
                          Total
                        </Typography>
                        <Typography
                          variant="body"
                          size="sm"
                          className="text-emerald-500 font-semibold"
                        >
                          R${" "}
                          {(item.precoTotal || 0).toFixed(2).replace(".", ",")}
                        </Typography>
                      </View>
                    </View>
                  </View>
                ))
            ) : (
              <Typography variant="body-secondary" className="text-center py-4">
                Nenhum produto adicionado
              </Typography>
            )}
          </View>
        </View>

        <View
          className="bg-gray-800 rounded-lg p-3 mb-4 border border-gray-600"
          style={{ borderLeftColor: "#F59E0B", borderLeftWidth: 4 }}
        >
          <View className="flex-row items-center gap-2 mb-3">
            <Wrench size={16} color="#f59e0b" />
            <Typography variant="h3" size="base">
              Serviços
            </Typography>
          </View>

          <View className="space-y-2 gap-1">
            {order.itens.filter((item) => item.tipo === "Serviço").length >
            0 ? (
              order.itens
                .filter((item) => item.tipo === "Serviço")
                .map((item) => (
                  <View
                    key={item.id}
                    className="bg-gray-700 rounded-lg p-3 px-3 border border-gray-600 mb-2"
                  >
                    <View className="flex-row items-center justify-between mb-2">
                      <View className="flex-1">
                        <Typography
                          variant="body"
                          size="sm"
                          className="font-medium"
                        >
                          {item.nome || "Serviço sem nome"}
                        </Typography>
                        <Typography
                          variant="caption"
                          size="xs"
                          className="text-gray-400"
                        >
                          {item.descricao || "Sem descrição"}
                        </Typography>
                      </View>
                    </View>
                    <View className="flex-row gap-4">
                      <View>
                        <Typography
                          variant="caption"
                          size="xs"
                          className="text-gray-400"
                        >
                          Quantidade
                        </Typography>
                        <Typography variant="body" size="sm">
                          {item.quantidade || 0}
                        </Typography>
                      </View>
                      <View>
                        <Typography
                          variant="caption"
                          size="xs"
                          className="text-gray-400"
                        >
                          Preço Unit.
                        </Typography>
                        <Typography variant="body" size="sm">
                          R${" "}
                          {(item.precoUnitario || 0)
                            .toFixed(2)
                            .replace(".", ",")}
                        </Typography>
                      </View>
                      <View className="flex-1 items-end">
                        <Typography
                          variant="caption"
                          size="xs"
                          className="text-gray-400"
                        >
                          Total
                        </Typography>
                        <Typography
                          variant="body"
                          size="sm"
                          className="text-emerald-500 font-semibold"
                        >
                          R${" "}
                          {(item.precoTotal || 0).toFixed(2).replace(".", ",")}
                        </Typography>
                      </View>
                    </View>
                  </View>
                ))
            ) : (
              <Typography variant="body-secondary" className="text-center py-4">
                Nenhum serviço adicionado
              </Typography>
            )}
          </View>
        </View>
        {/* 
        {order.observations && (
          <View
            className="bg-gray-800 rounded-lg p-3 mb-4 border border-gray-600"
            style={{ borderLeftColor: "#10B981", borderLeftWidth: 4 }}
          >
            <View className="flex-row items-center gap-2 mb-3">
              <FileText size={16} color="#1e40af" />
              <Typography variant="h3" size="base">
                Observações
              </Typography>
            </View>

            <View className="bg-gray-700 rounded-lg p-3 border border-gray-600">
              <Typography variant="body" size="sm">
                {order.observations}
              </Typography>
            </View>
          </View>
        )} */}

        <View
          className="bg-gray-800 rounded-lg p-3 mb-6 border border-gray-600"
          style={{ borderLeftColor: "#10B981", borderLeftWidth: 4 }}
        >
          <View className="flex-row items-center gap-2 mb-3">
            <Calculator size={16} color="#f3f5f7" />
            <Typography variant="h3" size="base">
              Resumo
            </Typography>
          </View>

          <View className="space-y-2 gap-1">
            <View className="flex-row justify-between">
              <Typography variant="caption" size="sm" className="text-gray-400">
                Subtotal Produtos:
              </Typography>
              <Typography variant="body" size="sm">
                R${" "}
                {order.itens
                  .filter((item) => item.tipo === "Produto")
                  .reduce((sum, item) => sum + item.precoTotal, 0)
                  .toFixed(2)
                  .replace(".", ",")}
              </Typography>
            </View>
            <View className="flex-row justify-between">
              <Typography variant="caption" size="sm" className="text-gray-400">
                Subtotal Serviços:
              </Typography>
              <Typography variant="body" size="sm">
                R${" "}
                {order.itens
                  .filter((item) => item.tipo === "Serviço")
                  .reduce((sum, item) => sum + item.precoTotal, 0)
                  .toFixed(2)
                  .replace(".", ",")}
              </Typography>
            </View>
            <View className="border-t border-gray-600 pt-2">
              <View className="flex-row justify-between">
                <Typography variant="h3" size="base" className="font-semibold">
                  Total:
                </Typography>
                <Typography
                  variant="h3"
                  size="base"
                  className="text-emerald-500 font-bold"
                >
                  R$ {(order.precoTotal || 0).toFixed(2).replace(".", ",")}
                </Typography>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
