import React, { useState, useMemo } from "react";
import { View, FlatList, Pressable } from "react-native";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ModalFlatList from "./ModalFlatList";
import Typography from "@/components/ui/Typography";
import { Package, Search, CheckCircle, Circle } from "lucide-react-native";

interface Product {
  id: number;
  name: string;
  code: string;
  description: string;
  price: number;
  unit: string;
}

interface SelectProductProps {
  visible: boolean;
  onClose: () => void;
  onSave: (products: Product[]) => void;
  loading?: boolean;
  existingProductIds?: number[];
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

  // Dados mockados de produtos
  const products: Product[] = [
    {
      id: 1,
      name: "Pão Francês",
      code: "PF001",
      description: "Pão francês tradicional",
      price: 0.5,
      unit: "Unidade",
    },
    {
      id: 2,
      name: "Pão de Queijo",
      code: "PQ002",
      description: "Pão de queijo caseiro",
      price: 15.0,
      unit: "Quilo",
    },
    {
      id: 3,
      name: "Croissant",
      code: "CR003",
      description: "Croissant de manteiga",
      price: 2.5,
      unit: "Unidade",
    },
    {
      id: 4,
      name: "Baguete",
      code: "BG004",
      description: "Baguete francesa",
      price: 1.8,
      unit: "Unidade",
    },
    {
      id: 5,
      name: "Pão Integral",
      code: "PI005",
      description: "Pão integral saudável",
      price: 12.0,
      unit: "Quilo",
    },
    {
      id: 6,
      name: "Bolo de Chocolate",
      code: "BC006",
      description: "Bolo de chocolate caseiro",
      price: 25.0,
      unit: "Unidade",
    },
    {
      id: 7,
      name: "Torta de Frango",
      code: "TF007",
      description: "Torta de frango com catupiry",
      price: 18.0,
      unit: "Unidade",
    },
    {
      id: 8,
      name: "Sonho",
      code: "SN008",
      description: "Sonho recheado com creme",
      price: 3.5,
      unit: "Unidade",
    },
  ];

  // Filtrar produtos baseado na busca
  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

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
                {item.code} - {item.name}
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
            <Typography variant="caption" size="xs" className="text-gray-400">
              {item.unit}
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
            onChangeText={setSearchTerm}
            autoCapitalize="none"
          />
        </View>

        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          className="flex-1"
        />

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
