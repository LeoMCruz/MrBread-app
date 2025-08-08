import React, { useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { router } from "expo-router";
import Toast from 'react-native-toast-message';
import {
  User,
  Package,
  Wrench,
  FileText,
  Calculator,
  Plus,
  Trash2,
  X,
} from "lucide-react-native";
import Header from "@/components/ui/Header";
import Button from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
import Input from "@/components/ui/Input";
import InputMultiLine from "@/components/ui/InputMultiLine";
import SelectProduct from "@/components/ui/modals/SelectProduct";
import SelectService from "@/components/ui/modals/SelectService";
import SelectCustomer from "@/components/ui/modals/SelectCustomer";
import { useOrdersStore } from "@/stores/ordersStore";

// Tipos
interface Customer {
  id: number;
  name: string;
  cnpj: string;
  city: string;
}

interface Product {
  id: number;
  name: string;
  unit: string;
  price: number;
}

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
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

interface OrderState {
  customer: Customer | null;
  products: OrderProduct[];
  services: OrderService[];
  observations: string;
  subtotalProducts: number;
  subtotalServices: number;
  discount: number;
  total: number;
}

export default function NewOrderScreen() {
  // Estados dos modais
  const [customerModalVisible, setCustomerModalVisible] = useState(false);
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [serviceModalVisible, setServiceModalVisible] = useState(false);

  // Store
  const { createOrder } = useOrdersStore();

  // Estado do pedido
  const [orderState, setOrderState] = useState<OrderState>({
    customer: null,
    products: [],
    services: [],
    observations: "",
    subtotalProducts: 0,
    subtotalServices: 0,
    discount: 0,
    total: 0,
  });

  // Função para atualizar o estado do pedido
  const updateOrderState = (updates: Partial<OrderState>) => {
    setOrderState((prev) => {
      const newState = { ...prev, ...updates };

      // Recalcular totais
      const subtotalProducts = newState.products.reduce(
        (sum, p) => sum + p.total,
        0
      );
      const subtotalServices = newState.services.reduce(
        (sum, s) => sum + s.total,
        0
      );
      const subtotal = subtotalProducts + subtotalServices;
      const total = subtotal - newState.discount;

      return {
        ...newState,
        subtotalProducts,
        subtotalServices,
        total,
      };
    });
  };

  // Função para selecionar cliente
  const handleSelectCustomer = (customer: any) => {
    // Mapear dados da API para o formato esperado pela interface local
    const mappedCustomer: Customer = {
      id: customer.id,
      name: customer.nomeFantasia,
      cnpj: customer.cnpj.length < 15 ? `CPF: ${customer.cnpj}` : `CNPJ: ${customer.cnpj}`,
      city: `${customer.cidade} - ${customer.estado}`,
    };
    updateOrderState({ customer: mappedCustomer });
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

  // Função para adicionar produtos selecionados
  const handleAddProducts = (selectedProducts: any[]) => {
    // Filtrar produtos que já existem na lista
    const newProducts = selectedProducts.filter(
      (selectedProduct) =>
        !orderState.products.some(
          (existingProduct) => existingProduct.productId === selectedProduct.id
        )
    );

    if (newProducts.length === 0) {
      // Todos os produtos já existem na lista
      showToast('error', 'Produto já adicionado', 'Este produto já está na lista.');
      setProductModalVisible(false);
      return;
    }

    const newOrderProducts: OrderProduct[] = newProducts.map((product) => ({
      id: Date.now() + Math.random(), // ID único
      productId: product.id,
      name: product.name,
      unit: product.unit,
      quantity: 1,
      price: product.price,
      total: product.price,
    }));

    updateOrderState({
      products: [...orderState.products, ...newOrderProducts],
    });
    showToast('success', 'Produtos adicionados!', `${newProducts.length} produto(s) adicionado(s) ao pedido.`);
    setProductModalVisible(false);
  };

  // Função para adicionar serviços selecionados
  const handleAddServices = (selectedServices: any[]) => {
    // Filtrar serviços que já existem na lista
    const newServices = selectedServices.filter(
      (selectedService) =>
        !orderState.services.some(
          (existingService) => existingService.serviceId === selectedService.id
        )
    );

    if (newServices.length === 0) {
      // Todos os serviços já existem na lista
      showToast('error', 'Serviço já adicionado', 'Este serviço já está na lista.');
      setServiceModalVisible(false);
      return;
    }

    const newOrderServices: OrderService[] = newServices.map((service) => ({
      id: Date.now() + Math.random(), // ID único
      serviceId: service.id,
      name: service.name,
      description: service.description,
      quantity: 1,
      price: service.price,
      total: service.price,
    }));

    updateOrderState({
      services: [...orderState.services, ...newOrderServices],
    });
    showToast('success', 'Serviços adicionados!', `${newServices.length} serviço(s) adicionado(s) ao pedido.`);
    setServiceModalVisible(false);
  };

  // Função para remover item
  const removeItem = (type: "product" | "service", id: number) => {
    if (type === "product") {
      const product = orderState.products.find((p) => p.id === id);
      updateOrderState({
        products: orderState.products.filter((p) => p.id !== id),
      });
      showToast('success', 'Produto removido', `${product?.name} foi removido do pedido.`);
    } else {
      const service = orderState.services.find((s) => s.id === id);
      updateOrderState({
        services: orderState.services.filter((s) => s.id !== id),
      });
      showToast('success', 'Serviço removido', `${service?.name} foi removido do pedido.`);
    }
  };

  // Função para remover cliente
  const removeCustomer = () => {
    const customerName = orderState.customer?.name;
    updateOrderState({ customer: null });
    showToast('success', 'Cliente removido', `${customerName} foi removido do pedido.`);
  };

  // Função para atualizar quantidade de produto
  const updateProductQuantity = (id: number, quantity: string) => {
    const newQuantity = parseInt(quantity) || 0;
    const updatedProducts = orderState.products.map((p) =>
      p.id === id
        ? { ...p, quantity: newQuantity, total: newQuantity * p.price }
        : p
    );
    updateOrderState({ products: updatedProducts });
  };

  // Função para atualizar preço de produto
  const updateProductPrice = (id: number, priceStr: string) => {
    const price =
      parseFloat(priceStr.replace("R$ ", "").replace(",", ".")) || 0;
    const updatedProducts = orderState.products.map((p) =>
      p.id === id ? { ...p, price, total: p.quantity * price } : p
    );
    updateOrderState({ products: updatedProducts });
  };

  // Função para atualizar quantidade de serviço
  const updateServiceQuantity = (id: number, quantity: string) => {
    const newQuantity = parseInt(quantity) || 0;
    const updatedServices = orderState.services.map((s) =>
      s.id === id
        ? { ...s, quantity: newQuantity, total: newQuantity * s.price }
        : s
    );
    updateOrderState({ services: updatedServices });
  };

  // Função para atualizar preço de serviço
  const updateServicePrice = (id: number, priceStr: string) => {
    const price =
      parseFloat(priceStr.replace("R$ ", "").replace(",", ".")) || 0;
    const updatedServices = orderState.services.map((s) =>
      s.id === id ? { ...s, price, total: s.quantity * price } : s
    );
    updateOrderState({ services: updatedServices });
  };

  // Função para confirmar pedido (abre alert)
  const handleConfirmOrder = () => {
    Alert.alert("Confirmar Pedido", "Deseja realmente salvar este pedido?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Salvar",
        onPress: handleSaveOrder,
      },
    ]);
  };

  // Função para salvar pedido (chamada da API)
  const handleSaveOrder = async () => {
    try {
      // Validar se há cliente selecionado
      if (!orderState.customer) {
        showToast('error', 'Cliente obrigatório', 'Selecione um cliente para o pedido.');
        return;
      }

      // Validar se há pelo menos um produto ou serviço
      if (orderState.products.length === 0 && orderState.services.length === 0) {
        showToast('error', 'Itens obrigatórios', 'Adicione pelo menos um produto ou serviço ao pedido.');
        return;
      }

      // Mapear produtos para o formato da API
      const productItems = orderState.products.map(product => ({
        produto: product.productId.toString(),
        servico: null,
        quantidade: product.quantity,
        precoUnitario: product.price
      }));

      // Mapear serviços para o formato da API
      const serviceItems = orderState.services.map(service => ({
        produto: null,
        servico: service.serviceId.toString(),
        quantidade: service.quantity,
        precoUnitario: service.price
      }));

      // Combinar todos os itens
      const allItems = [...productItems, ...serviceItems];

      // Preparar dados para a API
      const orderData = {
        cliente: orderState.customer.id.toString(),
        itens: allItems
      };

      // Chamar a API
      const response = await createOrder(orderData);
      
      // Verificar se a criação foi bem-sucedida
      if (response && response.id) {
        showToast('success', 'Pedido salvo!', `Pedido ${response.idPedido} criado com sucesso.`);
        
        // Limpar dados da tela
        setOrderState({
          customer: null,
          products: [],
          services: [],
          observations: "",
          subtotalProducts: 0,
          subtotalServices: 0,
          discount: 0,
          total: 0,
        });
        
        router.back();
      } else {
        throw new Error('Resposta inválida da API');
      }
    } catch (error) {
      showToast('error', 'Erro ao salvar', 'Não foi possível salvar o pedido. Tente novamente.');
    }
  };

  return (
    <View className="flex-1 bg-gray-900">
      <Header
        title="Novo Pedido"
        leftIcon={
          <Pressable
            onPress={() => router.back()}
            className="p-1.5 rounded-lg hover:bg-gray-700"
          >
            <X size={20} color="#F3F5F7" />
          </Pressable>
        }
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          className={`flex-1 px-6 mb-6 ${
            Platform.OS === "ios" ? "pt-6" : "pt-4"
          }`}
        >
          <View
            className="bg-gray-800 rounded-lg p-3 mb-2 border border-gray-600"
            style={{ borderLeftColor: "#10B981", borderLeftWidth: 4 }}
          >
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-2">
                <User size={16} color="#10b981" />
                <Typography variant="h3" size="base">
                  Cliente
                </Typography>
              </View>
              <Button
                title="Adicionar"
                variant="primary"
                leftIcon={<Plus size={12} color="#ffffff" />}
                className="px-2 py-1 h-8 text-xs"
                fullWidth={false}
                disabled={!!orderState.customer}
                onPress={() => setCustomerModalVisible(true)}
              />
            </View>

            <View>
              {orderState.customer ? (
                <View className="bg-gray-700 rounded-lg p-3 px-3 border border-gray-600">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Typography
                        variant="body"
                        size="sm"
                        className="font-medium"
                      >
                        {orderState.customer.name}
                      </Typography>
                      <Typography variant="caption" size="xs">
                        {orderState.customer.cnpj }
                      </Typography>
                      <Typography variant="caption" size="xs">
                        {orderState.customer.city}
                      </Typography>
                    </View>
                    <Pressable onPress={removeCustomer} className="ml-2">
                      <X size={12} color="#f87171" />
                    </Pressable>
                  </View>
                </View>
              ) : (
                <Typography
                  variant="caption"
                  size="sm"
                  className="text-gray-400"
                >
                  Nenhum cliente selecionado
                </Typography>
              )}
            </View>
          </View>

          <View
            className="bg-gray-800 rounded-lg p-3 mb-2 border border-gray-600"
            style={{ borderLeftColor: "#3B82F6", borderLeftWidth: 4 }}
          >
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-2">
                <Package size={16} color="#3b82f6" />
                <Typography variant="h3" size="base">
                  Produtos
                </Typography>
              </View>
              <Button
                title="Adicionar"
                variant="primary"
                leftIcon={<Plus size={12} color="#ffffff" />}
                className="px-2 py-1 h-8 text-xs"
                fullWidth={false}
                onPress={() => setProductModalVisible(true)}
              />
            </View>

            <View className="space-y-2 gap-1">
              {orderState.products.map((product) => (
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
                        {product.name}
                      </Typography>
                      <Typography variant="caption" size="xs">
                        {product.unit}
                      </Typography>
                    </View>
                    <Pressable
                      onPress={() => removeItem("product", product.id)}
                    >
                      <Trash2 size={12} color="#f87171" />
                    </Pressable>
                  </View>
                  <View className="flex-row gap-2">
                    <View className="flex-1">
                      <Typography
                        variant="caption"
                        size="xs"
                        className="text-gray-400"
                      >
                        Qtd
                      </Typography>
                      <Input
                        value={product.quantity.toString()}
                        onChangeText={(value) =>
                          updateProductQuantity(product.id, value)
                        }
                        keyboardType="numeric"
                        size="md"
                        className="text-xs"
                      />
                    </View>
                    <View className="flex-1">
                      <Typography
                        variant="caption"
                        size="xs"
                        className="text-gray-400"
                      >
                        Preço
                      </Typography>
                      <Input
                        value={`R$ ${product.price
                          .toFixed(2)
                          .replace(".", ",")}`}
                        onChangeText={(value) =>
                          updateProductPrice(product.id, value)
                        }
                        keyboardType="numeric"
                        size="md"
                        className="text-xs"
                      />
                    </View>
                    <View className="flex-1 ml-4 items-end">
                      <Typography
                        variant="caption"
                        size="xs"
                        className="text-gray-400 mb-1"
                      >
                        Total
                      </Typography>
                      <Typography
                        variant="body"
                        size="sm"
                        className="text-emerald-500 font-semibold"
                      >
                        R$ {product.total.toFixed(2).replace(".", ",")}
                      </Typography>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View
            className="bg-gray-800 rounded-lg p-3 mb-2 border border-gray-600"
            style={{ borderLeftColor: "#F59E0B", borderLeftWidth: 4 }}
          >
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-2">
                <Wrench size={16} color="#f59e0b" />
                <Typography variant="h3" size="base">
                  Serviços
                </Typography>
              </View>
              <Button
                title="Adicionar"
                variant="primary"
                leftIcon={<Plus size={12} color="#ffffff" />}
                className="px-2 py-1 h-8 text-xs"
                fullWidth={false}
                onPress={() => setServiceModalVisible(true)}
              />
            </View>

            <View className="space-y-2 gap-1">
              {orderState.services.map((service) => (
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
                        {service.name}
                      </Typography>
                      <Typography variant="caption" size="xs">
                        {service.description}
                      </Typography>
                    </View>
                    <Pressable
                      onPress={() => removeItem("service", service.id)}
                    >
                      <Trash2 size={12} color="#f87171" />
                    </Pressable>
                  </View>
                  <View className="flex-row gap-2">
                    <View className="flex-1">
                      <Typography
                        variant="caption"
                        size="xs"
                        className="text-gray-400"
                      >
                        Qtd
                      </Typography>
                      <Input
                        value={service.quantity.toString()}
                        onChangeText={(value) =>
                          updateServiceQuantity(service.id, value)
                        }
                        keyboardType="numeric"
                        size="md"
                        className="text-xs"
                      />
                    </View>
                    <View className="flex-1">
                      <Typography
                        variant="caption"
                        size="xs"
                        className="text-gray-400"
                      >
                        Preço
                      </Typography>
                      <Input
                        value={`R$ ${service.price
                          .toFixed(2)
                          .replace(".", ",")}`}
                        onChangeText={(value) =>
                          updateServicePrice(service.id, value)
                        }
                        keyboardType="numeric"
                        size="md"
                        className="text-xs"
                      />
                    </View>
                    <View className="flex-1 ml-4 items-end">
                      <Typography
                        variant="caption"
                        size="xs"
                        className="text-gray-400 mb-1"
                      >
                        Total
                      </Typography>
                      <Typography
                        variant="body"
                        size="sm"
                        className="text-emerald-500 font-semibold"
                      >
                        R$ {service.total.toFixed(2).replace(".", ",")}
                      </Typography>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

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

            <InputMultiLine
              placeholder="Adicione observações sobre o pedido..."
              value={orderState.observations}
              onChangeText={(text) => updateOrderState({ observations: text })}
              variant="filled"
              size="md"
              className="text-sm"
            />
          </View>

          <View
            className="bg-gray-800 rounded-lg p-3 mb-2 border border-gray-600"
            style={{ borderLeftColor: "#10B981", borderLeftWidth: 4 }}
          >
            <View className="flex-row items-center gap-2 mb-3">
              <Calculator size={16} color="#f3f5f7" />
              <Typography variant="h3" size="base">
                Resumo
              </Typography>
            </View>

            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Typography
                  variant="caption"
                  size="sm"
                  className="text-gray-400"
                >
                  Subtotal:
                </Typography>
                <Typography variant="body" size="sm">
                  R${" "}
                  {(orderState.subtotalProducts + orderState.subtotalServices)
                    .toFixed(2)
                    .replace(".", ",")}
                </Typography>
              </View>
              <View className="flex-row justify-between">
                <Typography
                  variant="caption"
                  size="sm"
                  className="text-gray-400"
                >
                  Desconto:
                </Typography>
                <Typography variant="body" size="sm" className="text-red-400">
                  -R$ {orderState.discount.toFixed(2).replace(".", ",")}
                </Typography>
              </View>
              <View className="border-t border-gray-600 pt-2">
                <View className="flex-row justify-between">
                  <Typography
                    variant="h3"
                    size="base"
                    className="font-semibold"
                  >
                    Total:
                  </Typography>
                  <Typography
                    variant="h3"
                    size="base"
                    className="text-emerald-500 font-bold"
                  >
                    R$ {orderState.total.toFixed(2).replace(".", ",")}
                  </Typography>
                </View>
              </View>
            </View>
          </View>

          <View className="pt-2 pb-4">
            <Button
              title="Salvar Pedido"
              variant="success"
              onPress={handleConfirmOrder}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <SelectCustomer
        visible={customerModalVisible}
        onClose={() => setCustomerModalVisible(false)}
        onSelect={handleSelectCustomer}
      />

      <SelectProduct
        visible={productModalVisible}
        onClose={() => setProductModalVisible(false)}
        onSave={handleAddProducts}
        existingProductIds={orderState.products.map((p) => p.productId.toString())}
      />

      <SelectService
        visible={serviceModalVisible}
        onClose={() => setServiceModalVisible(false)}
        onSave={handleAddServices}
        existingServiceIds={orderState.services.map((s) => s.serviceId.toString())}
      />
    </View>
  );
}
