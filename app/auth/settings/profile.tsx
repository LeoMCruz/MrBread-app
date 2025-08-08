import React, { useState } from "react";
import { View, ScrollView, Pressable, Platform, Alert } from "react-native";
import { router } from "expo-router";
import Toast from 'react-native-toast-message';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Save,
} from "lucide-react-native";
import Header from "@/components/ui/Header";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import MaskedInput from "@/components/ui/MaskedInput";
import { useAuthStore } from "@/stores/authStore";

export default function ProfileSettings() {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.nome || "",
    email: user?.username || "",
    phone: "", // Campo telefone não existe no user, deixando vazio
  });

  const handleBack = () => {
    router.back();
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

  const handleSave = () => {
    try {
      // Simular delay de API
      setTimeout(() => {
        showToast('success', 'Perfil atualizado!', 'Seus dados foram atualizados com sucesso.');
        setIsEditing(false);
      }, 500);
    } catch (error) {
      showToast('error', 'Erro ao atualizar', 'Não foi possível atualizar o perfil.');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <View className="flex-1 bg-gray-900 ">
      <Header
        title="Dados Pessoais"
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
          {/* Informações Básicas */}
          <View className="bg-gray-800 rounded-xl border border-gray-700 p-4">
            <View className="flex-row items-center gap-3 mb-4">
              <User size={20} color="#3B82F6" />
              <Typography variant="h3" className="text-white font-semibold">
                Informações Básicas
              </Typography>
            </View>

            <View className="gap-2">
              <Input
                label="Nome Completo"
                placeholder="Seu nome completo"
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                leftIcon={<User size={20} color="#6b7280" />}
                editable={isEditing}
              />

              <Input
                label="Email"
                placeholder="seu@email.com"
                value={formData.email}
                onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                leftIcon={<Mail size={20} color="#6b7280" />}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={isEditing}
              />

              <MaskedInput
                label="Telefone"
                placeholder="(11) 99999-9999"
                value={formData.phone}
                onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                leftIcon={<Phone size={20} color="#6b7280" />}
                maskType="phone"
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
                title="Editar Perfil"
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