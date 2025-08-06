import React, { useState } from "react";
import { View, ScrollView, Pressable, Platform, Alert } from "react-native";
import { router } from "expo-router";
import Toast from 'react-native-toast-message';
import {
  ArrowLeft,
  Building,
  FileText,
  MapPin,
  Mail,
  Phone,
  Save,
  Globe,
} from "lucide-react-native";
import Header from "@/components/ui/Header";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import DocumentInput from "@/components/ui/DocumentInput";

export default function CompanySettings() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    tradeName: "Empresa ABC Ltda",
    companyName: "Empresa ABC Comércio Ltda",
    cnpj: "12.345.678/0001-90",
    state: "São Paulo",
    city: "São Paulo",
    address: "Rua das Flores, 123 - Centro",
    email: "contato@empresaabc.com",
    phone: "(11) 99999-9999",
    website: "www.empresaabc.com",
  });

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

  const handleBack = () => {
    router.back();
  };

  const handleSave = async () => {
    try {
      // Validar campos obrigatórios
      if (!formData.tradeName || !formData.companyName || !formData.cnpj) {
        showToast('error', 'Campos obrigatórios', 'Preencha todos os campos obrigatórios.');
        return;
      }

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      showToast('success', 'Empresa atualizada!', 'Dados da empresa foram atualizados com sucesso.');
      setIsEditing(false);
    } catch (error) {
      showToast('error', 'Erro ao atualizar', 'Não foi possível atualizar os dados da empresa.');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <View className="flex-1 bg-gray-900">
      <Header
        title="Dados da Empresa"
        leftIcon={
          <Pressable
            onPress={handleBack}
            className="p-1.5 rounded-lg hover:bg-gray-700"
          >
            <ArrowLeft size={20} color="#F3F5F7" />
          </Pressable>
        }
      />

      <ScrollView
        className={`flex-1 px-6 mb-6 ${
          Platform.OS === "ios" ? "pt-6" : "pt-4"
        }`}
      >
        <View className="gap-4">
          {/* Informações da Empresa */}
          <View className="bg-gray-800 rounded-xl border border-gray-700 p-4">
            <View className="flex-row items-center gap-3 mb-4">
              <Building size={20} color="#10B981" />
              <Typography variant="h3" className="text-white font-semibold">
                Informações da Empresa
              </Typography>
            </View>

            <View className="gap-2">
              <Input
                label="Nome Fantasia"
                placeholder="Nome fantasia da empresa"
                value={formData.tradeName}
                onChangeText={(text) => setFormData(prev => ({ ...prev, tradeName: text }))}
                leftIcon={<Building size={20} color="#6b7280" />}
                editable={isEditing}
              />

              <Input
                label="Razão Social"
                placeholder="Razão social completa"
                value={formData.companyName}
                onChangeText={(text) => setFormData(prev => ({ ...prev, companyName: text }))}
                leftIcon={<FileText size={20} color="#6b7280" />}
                editable={isEditing}
              />

              <DocumentInput
                value={formData.cnpj}
                onChangeText={(text) => setFormData(prev => ({ ...prev, cnpj: text }))}
                leftIcon={<FileText size={20} color="#6b7280" />}
              />
            </View>
          </View>

          {/* Endereço */}
          <View className="bg-gray-800 rounded-xl border border-gray-700 p-4">
            <View className="flex-row items-center gap-3 mb-4">
              <MapPin size={20} color="#F59E0B" />
              <Typography variant="h3" className="text-white font-semibold">
                Endereço
              </Typography>
            </View>

            <View className="gap-2">
              <Input
                label="Estado"
                placeholder="Estado"
                value={formData.state}
                onChangeText={(text) => setFormData(prev => ({ ...prev, state: text }))}
                leftIcon={<MapPin size={20} color="#6b7280" />}
                editable={isEditing}
              />

              <Input
                label="Cidade"
                placeholder="Cidade"
                value={formData.city}
                onChangeText={(text) => setFormData(prev => ({ ...prev, city: text }))}
                leftIcon={<MapPin size={20} color="#6b7280" />}
                editable={isEditing}
              />

              <Input
                label="Endereço Completo"
                placeholder="Rua, número, bairro"
                value={formData.address}
                onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
                leftIcon={<MapPin size={20} color="#6b7280" />}
                multiline
                numberOfLines={2}
                editable={isEditing}
              />
            </View>
          </View>

          {/* Contato */}
          <View className="bg-gray-800 rounded-xl border border-gray-700 p-4">
            <View className="flex-row items-center gap-3 mb-4">
              <Mail size={20} color="#8B5CF6" />
              <Typography variant="h3" className="text-white font-semibold">
                Contato
              </Typography>
            </View>

            <View className="gap-2">
              <Input
                label="Email"
                placeholder="contato@empresa.com"
                value={formData.email}
                onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                leftIcon={<Mail size={20} color="#6b7280" />}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={isEditing}
              />

              <Input
                label="Telefone"
                placeholder="(11) 99999-9999"
                value={formData.phone}
                onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                leftIcon={<Phone size={20} color="#6b7280" />}
                keyboardType="phone-pad"
                editable={isEditing}
              />

              <Input
                label="Website"
                placeholder="www.empresa.com"
                value={formData.website}
                onChangeText={(text) => setFormData(prev => ({ ...prev, website: text }))}
                leftIcon={<Globe size={20} color="#6b7280" />}
                autoCapitalize="none"
                editable={isEditing}
              />
            </View>
          </View>

          {/* Botões de Ação */}
          <View className="pt-2 pb-4 gap-4">
            {isEditing ? (
              <>
                <Button
                  title="Salvar Alterações"
                  leftIcon={<Save size={16} color="#ffffff" />}
                  onPress={handleSave}
                  variant="success"
                />
                <Button
                  title="Cancelar"
                  onPress={handleCancel}
                  variant="outlined"
                />
              </>
            ) : (
              <Button
                title="Editar Dados da Empresa"
                onPress={() => setIsEditing(true)}
                variant="primary"
              />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
} 