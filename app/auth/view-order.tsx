import React from "react";
import { View, ScrollView, Platform } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import {
  User,
  Package,
  Wrench,
  FileText,
  Calculator,
  ArrowLeft,
} from "lucide-react-native";
import Header from "@/components/ui/Header";
import Typography from "@/components/ui/Typography";
import IconButton from "@/components/ui/IconButton";

// Tipos
interface Customer {
  id: number;
  name: string;
  cnpj: string;
  city: string;
}

interface OrderProduct {
  id: number;
  productId: number;
  name: string;
  unit: string;
  quantity: number;
  price: number;
  total: number;
}

interface OrderService {
  id: number;
  serviceId: number;
  name: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customer: Customer;
  products: OrderProduct[];
  services: OrderService[];
  observations: string;
  subtotalProducts: number;
  subtotalServices: number;
  discount: number;
  total: number;
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
}

export default function ViewOrderScreen() {
  const params = useLocalSearchParams();
  // const orderData = params.orderData ? JSON.parse(params.orderData as string) : null;

  // Mock data para demonstração (em um app real viria da API)
  // Por enquanto, sempre usamos os dados mockados para ver como fica o layout
  const order: Order = {
    id: "1",
    orderNumber: "PED-001",
    customer: {
      id: 1,
      name: "Empresa ABC Ltda",
      cnpj: "12.345.678/0001-90",
      city: "São Paulo",
    },
    products: [
      {
        id: 1,
        productId: 1,
        name: "Pão Francês",
        unit: "Unidade",
        quantity: 100,
        price: 0.5,
        total: 50.0,
      },
      {
        id: 2,
        productId: 2,
        name: "Bolo de Chocolate",
        unit: "Unidade",
        quantity: 5,
        price: 15.0,
        total: 75.0,
      },
      {
        id: 3,
        productId: 3,
        name: "Croissant",
        unit: "Unidade",
        quantity: 20,
        price: 4.5,
        total: 90.0,
      },
      {
        id: 4,
        productId: 4,
        name: "Pão de Queijo",
        unit: "Unidade",
        quantity: 50,
        price: 2.5,
        total: 125.0,
      },
      {
        id: 5,
        productId: 5,
        name: "Torta de Frango",
        unit: "Unidade",
        quantity: 3,
        price: 35.0,
        total: 105.0,
      },
    ],
    services: [
      {
        id: 1,
        serviceId: 1,
        name: "Entrega",
        description: "Entrega no local do cliente",
        quantity: 1,
        price: 25.0,
        total: 25.0,
      },
      {
        id: 2,
        serviceId: 2,
        name: "Embalagem Especial",
        description: "Embalagem personalizada para evento",
        quantity: 1,
        price: 15.0,
        total: 15.0,
      },
      {
        id: 3,
        serviceId: 3,
        name: "Montagem de Buffet",
        description: "Serviço de montagem e organização do buffet",
        quantity: 1,
        price: 80.0,
        total: 80.0,
      },
    ],
    observations:
      "Entregar até às 18h. Pedido para evento corporativo. Favor embalar com cuidado especial. Incluir talheres descartáveis e guardanapos. Entrada pela portaria principal.",
    subtotalProducts: 445.0,
    subtotalServices: 120.0,
    discount: 25.0,
    total: 540.0,
    status: "completed",
    createdAt: "2024-01-15T10:30:00Z",
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#10B981";
      case "pending":
        return "#F59E0B";
      case "cancelled":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Concluído";
      case "pending":
        return "Pendente";
      case "cancelled":
        return "Cancelado";
      default:
        return "Desconhecido";
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View className="flex-1 bg-gray-900 pt-7 pb-6">
      {/* Header */}
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

      {/* Content */}
      <ScrollView
        className={`flex-1 px-6 mb-6 ${
          Platform.OS === "ios" ? "pt-6" : "pt-4"
        }`}
      >
        {/* Status do Pedido */}
        <View className="mb-4 flex-row justify-end">
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
        </View>

        {/* Número do Pedido */}
        <View className="bg-gray-800 rounded-lg p-4 mb-4 border border-gray-600">
          <View className="flex-row items-center justify-between">
            <View>
              <Typography variant="h2" className="text-white mb-1">
                {order.orderNumber}
              </Typography>
              <Typography variant="body-secondary" className="text-sm">
                Criado em {formatDate(order.createdAt)}
              </Typography>
            </View>
          </View>
        </View>

        {/* Cliente Section */}
        <View
          className="bg-gray-800 rounded-lg p-3 mb-2 border border-gray-600"
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
              {order.customer?.name || "Cliente não informado"}
            </Typography>
            <Typography
              variant="caption"
              size="xs"
              className="text-gray-400 mb-1"
            >
              CNPJ: {order.customer?.cnpj || "Não informado"}
            </Typography>
            <Typography variant="caption" size="xs" className="text-gray-400">
              {order.customer?.city || "Cidade não informada"}
            </Typography>
          </View>
        </View>

        {/* Produtos Section */}
        <View
          className="bg-gray-800 rounded-lg p-3 mb-2 border border-gray-600"
          style={{ borderLeftColor: "#3B82F6", borderLeftWidth: 4 }}
        >
          <View className="flex-row items-center gap-2 mb-3">
            <Package size={16} color="#3b82f6" />
            <Typography variant="h3" size="base">
              Produtos
            </Typography>
          </View>

          <View className="space-y-2 gap-1">
            {order.products && order.products.length > 0 ? (
              order.products.map((product) => (
                <View
                  key={product.id}
                  className="bg-gray-700 rounded-lg p-3 px-3 border border-gray-600"
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-1">
                      <Typography
                        variant="body"
                        size="sm"
                        className="font-medium"
                      >
                        {product.name || "Produto sem nome"}
                      </Typography>
                      <Typography
                        variant="caption"
                        size="xs"
                        className="text-gray-400"
                      >
                        {product.unit || "Unidade"}
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
                        {product.quantity || 0}
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
                        R$ {(product.price || 0).toFixed(2).replace(".", ",")}
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
                        R$ {(product.total || 0).toFixed(2).replace(".", ",")}
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

        {/* Serviços Section */}
        <View
          className="bg-gray-800 rounded-lg p-3 mb-2 border border-gray-600"
          style={{ borderLeftColor: "#F59E0B", borderLeftWidth: 4 }}
        >
          <View className="flex-row items-center gap-2 mb-3">
            <Wrench size={16} color="#f59e0b" />
            <Typography variant="h3" size="base">
              Serviços
            </Typography>
          </View>

          <View className="space-y-2 gap-1">
            {order.services && order.services.length > 0 ? (
              order.services.map((service) => (
                <View
                  key={service.id}
                  className="bg-gray-700 rounded-lg p-3 px-3 border border-gray-600"
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-1">
                      <Typography
                        variant="body"
                        size="sm"
                        className="font-medium"
                      >
                        {service.name || "Serviço sem nome"}
                      </Typography>
                      <Typography
                        variant="caption"
                        size="xs"
                        className="text-gray-400"
                      >
                        {service.description || "Sem descrição"}
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
                        {service.quantity || 0}
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
                        R$ {(service.price || 0).toFixed(2).replace(".", ",")}
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
                        R$ {(service.total || 0).toFixed(2).replace(".", ",")}
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

        {/* Observações Section */}
        {order.observations && (
          <View
            className="bg-gray-800 rounded-lg p-3 mb-2 border border-gray-600"
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
        )}

        {/* Resumo Section */}
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
                R$ {(order.subtotalProducts || 0).toFixed(2).replace(".", ",")}
              </Typography>
            </View>
            <View className="flex-row justify-between">
              <Typography variant="caption" size="sm" className="text-gray-400">
                Subtotal Serviços:
              </Typography>
              <Typography variant="body" size="sm">
                R$ {(order.subtotalServices || 0).toFixed(2).replace(".", ",")}
              </Typography>
            </View>
            <View className="flex-row justify-between">
              <Typography variant="caption" size="sm" className="text-gray-400">
                Desconto:
              </Typography>
              <Typography variant="body" size="sm" className="text-red-400">
                -R$ {(order.discount || 0).toFixed(2).replace(".", ",")}
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
                  R$ {(order.total || 0).toFixed(2).replace(".", ",")}
                </Typography>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
