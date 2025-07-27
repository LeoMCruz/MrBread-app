import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import MaskedInput from "@/components/ui/MaskedInput";
import Modal from "@/components/ui/Modal";
import {
  Building,
  User,
  MapPin,
  Mail,
  Phone,
  FileText,
} from "lucide-react-native";

interface Customer {
  id: string;
  tradeName: string;
  companyName: string;
  cnpj: string;
  state: string;
  city: string;
  address: string;
  email: string;
  phone: string;
}

interface NewCustomerProps {
  visible: boolean;
  onClose: () => void;
  onSave: (customer: Omit<Customer, "id">) => void;
  loading?: boolean;
}

export default function NewCustomer({
  visible,
  onClose,
  onSave,
  loading = false,
}: NewCustomerProps) {
  const [formData, setFormData] = useState({
    tradeName: "",
    companyName: "",
    cnpj: "",
    state: "",
    city: "",
    address: "",
    email: "",
    phone: "",
  });

  const handleSave = () => {
    if (!formData.tradeName || !formData.companyName || !formData.cnpj) {
      return;
    }

    const newCustomer = {
      tradeName: formData.tradeName,
      companyName: formData.companyName,
      cnpj: formData.cnpj,
      state: formData.state,
      city: formData.city,
      address: formData.address,
      email: formData.email,
      phone: formData.phone,
    };

    onSave(newCustomer);

    // Limpar formulário
    setFormData({
      tradeName: "",
      companyName: "",
      cnpj: "",
      state: "",
      city: "",
      address: "",
      email: "",
      phone: "",
    });
  };

  const handleClose = () => {
    // Limpar formulário ao fechar
    setFormData({
      tradeName: "",
      companyName: "",
      cnpj: "",
      state: "",
      city: "",
      address: "",
      email: "",
      phone: "",
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      onClose={handleClose}
      title="Novo Cliente"
      icon={<Building size={24} color="#10B981" />}
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
            title="Salvar"
            onPress={handleSave}
            loading={loading}
            className="flex-1"
          />
        </>
      }
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-4">
            <Input
              label="Nome Fantasia"
              placeholder="Ex: Empresa ABC Ltda"
              value={formData.tradeName}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, tradeName: text }))
              }
              leftIcon={<Building size={20} color="#6b7280" />}
            />

            <Input
              label="Razão Social"
              placeholder="Ex: Empresa ABC Comércio Ltda"
              value={formData.companyName}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, companyName: text }))
              }
              leftIcon={<FileText size={20} color="#6b7280" />}
            />

            <MaskedInput
              label="CNPJ"
              placeholder="00.000.000/0000-00"
              value={formData.cnpj}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, cnpj: text }))
              }
              leftIcon={<FileText size={20} color="#6b7280" />}
              maskType="cnpj"
            />

            <Input
              label="Estado"
              placeholder="Ex: São Paulo"
              value={formData.state}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, state: text }))
              }
              leftIcon={<MapPin size={20} color="#6b7280" />}
            />

            <Input
              label="Cidade"
              placeholder="Ex: São Paulo"
              value={formData.city}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, city: text }))
              }
              leftIcon={<MapPin size={20} color="#6b7280" />}
            />

            <Input
              label="Endereço"
              placeholder="Ex: Rua das Flores, 123"
              value={formData.address}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, address: text }))
              }
              leftIcon={<MapPin size={20} color="#6b7280" />}
              multiline
              numberOfLines={2}
            />

            <Input
              label="Email"
              placeholder="exemplo@empresa.com"
              value={formData.email}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, email: text }))
              }
              leftIcon={<Mail size={20} color="#6b7280" />}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <MaskedInput
              label="Telefone"
              placeholder="(11) 99999-9999"
              value={formData.phone}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, phone: text }))
              }
              leftIcon={<Phone size={20} color="#6b7280" />}
              maskType="phone"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
