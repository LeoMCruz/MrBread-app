import React, { useState, useEffect } from "react";
import { View } from "react-native";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { Product } from "@/services/itensService";
import { Package, DollarSign, Edit } from "lucide-react-native";

interface NewProductProps {
  visible: boolean;
  onClose: () => void;
  onSave: (product: { name: string; description?: string; price: number }) => void;
  onEdit?: (product: { id: string; name: string; description: string; price: number }) => void;
  loading?: boolean;
  mode?: "create" | "edit";
  initialData?: { id: string; name: string; description?: string; price: number };
}

export default function NewProduct({
  visible,
  onClose,
  onSave,
  onEdit,
  loading = false,
  mode = "create",
  initialData,
}: NewProductProps) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
  });

  // Preencher formulário com dados iniciais quando em modo de edição
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        name: initialData.name,
        price: initialData.price.toString(),
        description: initialData.description || "",
      });
    }
  }, [mode, initialData, visible]);

  const handleSave = () => {
    if (!formData.name || !formData.price) {
      return;
    }

    if (mode === "edit" && initialData && onEdit) {
      const editedProduct = {
        id: initialData.id,
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
      };
      onEdit(editedProduct);
    } else {
      const newProduct = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description || undefined,
      };
      onSave(newProduct);
    }

    // Limpar formulário
    setFormData({
      name: "",
      price: "",
      description: "",
    });
  };

  const handleClose = () => {
    // Limpar formulário ao fechar
    setFormData({
      name: "",
      price: "",
      description: "",
    });
    onClose();
  };

  // Limpar formulário quando o modal é fechado
  useEffect(() => {
    if (!visible) {
      setFormData({
        name: "",
        price: "",
        description: "",
      });
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      onClose={handleClose}
      title={mode === "edit" ? "Editar Produto" : "Novo Produto"}
      icon={
        mode === "edit" ? (
          <Edit size={24} color="#3B82F6" />
        ) : (
          <Package size={24} color="#3B82F6" />
        )
      }
      saved={!loading}
      height={0.48}
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
            title={mode === "edit" ? "Atualizar" : "Salvar"}
            onPress={handleSave}
            loading={loading}
            className="flex-1"
          />
        </>
      }
    >
      <View className="gap-4">
        <Input
          label="Nome do Produto"
          placeholder="Ex: Pão Francês"
          value={formData.name}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, name: text }))
          }
          leftIcon={<Package size={20} color="#6b7280" />}
        />
        <Input
          label="Preço"
          placeholder="R$ 0,00"
          value={formData.price}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, price: text }))
          }
          leftIcon={<DollarSign size={20} color="#6b7280" />}
          keyboardType="numeric"
        />

        <Input
          label="Descrição (opcional)"
          placeholder="Descrição do produto..."
          value={formData.description}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, description: text }))
          }
          multiline
          numberOfLines={3}
        />
      </View>
    </Modal>
  );
}
