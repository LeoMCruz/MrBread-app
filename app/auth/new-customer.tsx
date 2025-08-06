import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Toast from 'react-native-toast-message';
import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import IconButton from "@/components/ui/IconButton";
import Input from "@/components/ui/Input";
import MaskedInput from "@/components/ui/MaskedInput";
import DocumentInput from "@/components/ui/DocumentInput";
import { useCustomersStore } from "@/stores/customersStore";
import { Customer } from "@/services/customersService";
import {
  ArrowLeft,
  Building,
  MapPin,
  Mail,
  Phone,
  FileText,
  Home,
} from "lucide-react-native";

export default function NewCustomer() {
  const params = useLocalSearchParams();
  const mode = (params.mode as "create" | "edit") || "create";
  
  // Parse do customerData apenas quando necessário
  const customerData = (() => {
    const customerDataParam = params.customerData;
    if (customerDataParam && typeof customerDataParam === 'string') {
      try {
        return JSON.parse(customerDataParam) as Customer;
      } catch (error) {
        console.error('Erro ao fazer parse do customerData:', error);
        return null;
      }
    }
    return null;
  })();

  const { createCustomer, updateCustomer } = useCustomersStore();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nomeFantasia: "",
    razaoSocial: "",
    cnpj: "",
    estado: "",
    cidade: "",
    endereco: "",
    email: "",
    telefone: "",
  });

  // Preencher formulário com dados iniciais quando em modo de edição
  useEffect(() => {
    if (mode === "edit" && customerData?.id) {
      setFormData({
        nomeFantasia: customerData.nomeFantasia || "",
        razaoSocial: customerData.razaoSocial || "",
        cnpj: customerData.cnpj || "",
        estado: customerData.estado || "",
        cidade: customerData.cidade || "",
        endereco: customerData.endereco || "",
        email: customerData.email || "",
        telefone: customerData.telefone || "",
      });
    }
  }, [mode, params.customerData]);



  const handleBack = () => {
    router.back();
  };

  const handleSave = async () => {
    if (!formData.nomeFantasia || !formData.razaoSocial || !formData.cnpj) {
      Toast.show({
        type: 'error',
        text1: 'Campos obrigatórios',
        text2: 'Preencha todos os campos obrigatórios.',
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 60,
      });
      return;
    }

    setIsLoading(true);

    try {
      if (mode === "edit" && customerData) {
        const updatedCustomer = await updateCustomer(customerData.id, {
          nomeFantasia: formData.nomeFantasia,
          razaoSocial: formData.razaoSocial,
          cnpj: formData.cnpj,
          estado: formData.estado,
          cidade: formData.cidade,
          endereco: formData.endereco,
          email: formData.email,
          telefone: formData.telefone,
        });
        if (updatedCustomer) {
          console.log("Customer atualizado:", updatedCustomer);
          router.back();
        }
      } else {
        const newCustomer = await createCustomer({
          nomeFantasia: formData.nomeFantasia,
          razaoSocial: formData.razaoSocial,
          cnpj: formData.cnpj,
          estado: formData.estado,
          cidade: formData.cidade,
          endereco: formData.endereco,
          telefone: formData.telefone,
          email: formData.email,
        });
        if (newCustomer) {
          console.log("Customer criado:", newCustomer);
          router.back();
        }
      }
    } catch (error) {
      console.error('Erro ao salvar customer:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao salvar',
        text2: 'Não foi possível salvar o customer. Tente novamente.',
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 60,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-900">
      <Header
        title={mode === "edit" ? "Editar Cliente" : "Novo Cliente"}
        leftIcon={
          <IconButton
            icon={<ArrowLeft size={20} color="#F3F5F7" />}
            onPress={handleBack}
            variant="ghost"
          />
        }
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          className="flex-1 px-6 "
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-4 mb-6">
            <Input
              label="Nome Fantasia"
              placeholder="Ex: Empresa ABC Ltda"
              value={formData.nomeFantasia}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, nomeFantasia: text }))
              }
              leftIcon={<Building size={20} color="#6b7280" />}
            />

            <Input
              label="Razão Social"
              placeholder="Ex: Empresa ABC Comércio Ltda"
              value={formData.razaoSocial}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, razaoSocial: text }))
              }
              leftIcon={<FileText size={20} color="#6b7280" />}
            />

            <DocumentInput
              value={formData.cnpj}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, cnpj: text }))
              }
              leftIcon={<FileText size={20} color="#6b7280" />}
            />

            <Input
              label="Estado"
              placeholder="Ex: São Paulo"
              value={formData.estado}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, estado: text }))
              }
              leftIcon={<MapPin size={20} color="#6b7280" />}
            />

            <Input
              label="Cidade"
              placeholder="Ex: São Paulo"
              value={formData.cidade}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, cidade: text }))
              }
              leftIcon={<MapPin size={20} color="#6b7280" />}
            />

            <Input
              label="Endereço"
              placeholder="Ex: Rua das Flores, 123"
              value={formData.endereco}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, endereco: text }))
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
              value={formData.telefone}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, telefone: text }))
              }
              leftIcon={<Phone size={20} color="#6b7280" />}
              maskType="phone"
            />
            <Button
              title={
                isLoading ? (
                  <ActivityIndicator size="small" color="#F3F5F7" />
                ) : mode === "edit" ? (
                  "Atualizar"
                ) : (
                  "Salvar"
                )
              }
              onPress={handleSave}
              disabled={
                isLoading ||
                !formData.nomeFantasia ||
                !formData.razaoSocial ||
                !formData.cnpj
              }
              loading={isLoading}
              fullWidth
              className="mt-4"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
