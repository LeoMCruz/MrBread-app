import React, { useState, useEffect } from "react";
import { View } from "react-native";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { Service } from "@/services/itensService";
import { Wrench, DollarSign, Tag, Edit } from "lucide-react-native";

interface NewServiceProps {
  visible: boolean;
  onClose: () => void;
  onSave: (service: { name: string; description?: string; price: number }) => void;
  onEdit?: (service: { id: string; name: string; description: string; price: number }) => void;
  loading?: boolean;
  mode?: "create" | "edit";
  initialData?: { id: string; name: string; description?: string; price: number };
}

export default function NewService({
  visible,
  onClose,
  onSave,
  onEdit,
  loading = false,
  mode = "create",
  initialData,
}: NewServiceProps) {
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
      const editedService = {
        id: initialData.id,
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
      };
      onEdit(editedService);
    } else {
      const newService = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description || undefined,
      };
      onSave(newService);
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
      title={mode === "edit" ? "Editar Serviço" : "Novo Serviço"}
      icon={
        mode === "edit" ? (
          <Edit size={24} color="#3B82F6" />
        ) : (
          <Wrench size={24} color="#3B82F6" />
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
          label="Nome do Serviço"
          placeholder="Ex: Corte de Cabelo"
          value={formData.name}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, name: text }))
          }
          leftIcon={<Wrench size={20} color="#6b7280" />}
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
          placeholder="Descrição do serviço..."
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
