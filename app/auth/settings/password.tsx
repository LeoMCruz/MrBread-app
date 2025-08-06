import React, { useState } from "react";
import { View, ScrollView, Pressable, Platform, Alert } from "react-native";
import { router } from "expo-router";
import Toast from 'react-native-toast-message';
import { ArrowLeft, Key, Shield, Save, Eye, EyeOff } from "lucide-react-native";
import Header from "@/components/ui/Header";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "@/lib/validations";

export default function PasswordSettings() {
  const [formData, setFormData] = useState<ChangePasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<ChangePasswordFormData>>({});


  const validateField = (
    field: keyof ChangePasswordFormData,
    value: string
  ) => {
    // Só validar se o campo foi tocado ou se já tem erro
    if (value.length === 0 && !errors[field]) return;

    const fieldSchema = changePasswordSchema.shape[field];
    const result = fieldSchema.safeParse(value);

    if (result.success) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } else {
      const errorMessage = result.error.issues[0]?.message || "Campo inválido";
      setErrors((prev) => ({ ...prev, [field]: errorMessage }));
    }
  };

  // Função para verificar se o formulário está válido
  const isFormValid = () => {
    const hasCurrentPassword = formData.currentPassword.length >= 8;
    const hasNewPassword = formData.newPassword.length >= 8;
    const hasConfirmPassword = formData.confirmPassword.length >= 8;
    const passwordsMatch = formData.newPassword === formData.confirmPassword;
    
    const valid = hasCurrentPassword && hasNewPassword && hasConfirmPassword && passwordsMatch ;
    
    console.log('🔍 Debug do formulário:', {
      currentPassword: formData.currentPassword.length,
      newPassword: formData.newPassword.length,
      confirmPassword: formData.confirmPassword.length,
      hasCurrentPassword,
      hasNewPassword,
      hasConfirmPassword,
      passwordsMatch,
      isValid: valid
    });
    
    return valid;
  };

  const handleFieldChange = (
    field: keyof ChangePasswordFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Validar em tempo real sempre que o campo mudar
    validateField(field, value);
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

  const handleBack = () => {
    router.back();
  };

  const handleSave = async () => {
    const result = changePasswordSchema.safeParse(formData);

    if (result.success) {
      try {
        // Simular delay de API
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        showToast('success', 'Senha alterada!', 'Sua senha foi alterada com sucesso.');
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setErrors({});
      } catch (error) {
        showToast('error', 'Erro ao alterar senha', 'Não foi possível alterar a senha.');
      }
    } else {
      const fieldErrors: Partial<ChangePasswordFormData> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ChangePasswordFormData;
        fieldErrors[field] = issue.message;
      });

      setErrors(fieldErrors);
      showToast('error', 'Dados inválidos', 'Verifique os campos e tente novamente.');
    }
  };



  return (
    <View className="flex-1 bg-gray-900">
      <Header
        title="Alterar Senha"
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
        <View className="space-y-6 gap-6">
          {/* Informações de Segurança */}
          <View className="bg-gray-800 rounded-xl border border-gray-700 p-4">
            <View className="flex-row items-center gap-3 mb-4">
              <Shield size={20} color="#10B981" />
              <Typography variant="h3" className="text-white font-semibold">
                Segurança da Conta
              </Typography>
            </View>
            <Typography variant="body-secondary" className="text-gray-400">
              Para sua segurança, você precisará confirmar sua senha atual antes
              de fazer alterações.
            </Typography>
          </View>

          {/* Alterar Senha */}
          <View className="bg-gray-800 rounded-xl border border-gray-700 p-4">
            <View className="flex-row items-center gap-3 mb-4">
              <Key size={20} color="#3B82F6" />
              <Typography variant="h3" className="text-white font-semibold">
                Alterar Senha
              </Typography>
            </View>

            <View className="space-y-4 gap-2">
              <View>
                                 <Input
                   label="Senha Atual"
                   placeholder="Digite sua senha atual"
                   value={formData.currentPassword}
                   onChangeText={(value) =>
                     handleFieldChange("currentPassword", value)
                   }
                   secureTextEntry
                   error={errors.currentPassword}
                 />
              </View>

              <View>
                                 <Input
                   label="Nova Senha"
                   placeholder="Digite a nova senha"
                   value={formData.newPassword}
                   onChangeText={(value) =>
                     handleFieldChange("newPassword", value)
                   }
                   secureTextEntry
                   error={errors.newPassword}
                 />
              </View>

              <View>
                                 <Input
                   label="Confirmar Nova Senha"
                   placeholder="Confirme a nova senha"
                   value={formData.confirmPassword}
                   onChangeText={(value) =>
                     handleFieldChange("confirmPassword", value)
                   }
                   secureTextEntry
                   error={errors.confirmPassword}
                 />
              </View>
            </View>
          </View>

          {/* Dicas de Segurança */}
          <View className="bg-blue-900/20 rounded-xl border border-blue-700/30 p-4">
            <Typography
              variant="h3"
              className="text-blue-400 font-semibold mb-2"
            >
              💡 Dicas para uma senha segura:
            </Typography>
            <View className="space-y-1">
              <Typography variant="caption" className="text-blue-300">
                • Use pelo menos 8 caracteres
              </Typography>
              <Typography variant="caption" className="text-blue-300">
                • Combine letras maiúsculas e minúsculas
              </Typography>
              <Typography variant="caption" className="text-blue-300">
                • Inclua números e símbolos especiais
              </Typography>
              <Typography variant="caption" className="text-blue-300">
                • Evite informações pessoais óbvias
              </Typography>
            </View>
          </View>

          {/* Botões de Ação */}
          <View className="space-y-3 pb-4 gap-4">
                         <Button
               title="Alterar Senha"
               leftIcon={<Save size={16} color="#ffffff" />}
               onPress={handleSave}
               disabled={!isFormValid()}
               variant="success"
             />
            <Button title="Cancelar" onPress={handleBack} variant="outlined" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
