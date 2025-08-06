import {
  View,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Link, router } from "expo-router";
import { useState } from "react";
import Toast from 'react-native-toast-message';
import { Mail, User, Building, FileText, ArrowLeft } from "lucide-react-native";
import Input from "@/components/ui/Input";
import DocumentInput from "@/components/ui/DocumentInput";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import IconButton from "@/components/ui/IconButton";
import { registerSchema, type RegisterFormData } from "@/lib/validations";
import { useAuthStore } from "@/stores/authStore";

export default function Register() {
  const { login, isLoading } = useAuthStore();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    organization: "",
    document: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateField = (field: keyof RegisterFormData, value: string) => {
    // Só validar se o campo foi tocado ou se já tem erro
    if (value.length === 0 && !errors[field]) return;

    const fieldSchema = registerSchema.shape[field];
    const result = fieldSchema.safeParse(value);

    if (result.success) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } else {
      const errorMessage = result.error.issues[0]?.message || "Campo inválido";
      setErrors((prev) => ({ ...prev, [field]: errorMessage }));
    }
  };

  const handleFieldChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Validar em tempo real sempre que o campo mudar
    validateField(field, value);
  };

  const handleFieldBlur = (field: keyof RegisterFormData) => {
    // Validar quando o usuário sai do campo
    validateField(field, formData[field]);
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

  const handleRegister = async () => {
    const result = registerSchema.safeParse(formData);

    if (result.success) {
      try {
        await login(formData.email, formData.password, false);
        showToast('success', 'Conta criada!', 'Sua conta foi criada com sucesso.');
      } catch (error) {
        console.error("Erro no registro:", error);
        showToast('error', 'Erro ao criar conta', 'Não foi possível criar sua conta. Tente novamente.');
      }
    } else {
      const fieldErrors: Partial<RegisterFormData> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof RegisterFormData;
        fieldErrors[field] = issue.message;
      });

      setErrors(fieldErrors);
      showToast('error', 'Dados inválidos', 'Verifique os campos e tente novamente.');
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View className="flex-1 bg-gray-900">
      <Header
        title="Criar Conta"
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
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-6 pt-6">
            <View className="mb-8">
              <Typography variant="h2" className="text-center text-white mb-2">
                MrBread
              </Typography>
              <Typography variant="body-secondary" className="text-center">
                Crie sua conta gratuitamente
              </Typography>
            </View>

            <View className="gap-4">
              <Input
                label="Nome Completo"
                value={formData.name}
                onChangeText={(value) => handleFieldChange("name", value)}
                onBlur={() => handleFieldBlur("name")}
                placeholder="Digite seu nome completo"
                leftIcon={<User size={20} color="#6b7280" />}
                autoComplete="name"
                error={errors.name}
              />

              <Input
                label="E-mail"
                value={formData.email}
                onChangeText={(value) => handleFieldChange("email", value)}
                onBlur={() => handleFieldBlur("email")}
                placeholder="Digite seu e-mail"
                leftIcon={<Mail size={20} color="#6b7280" />}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={errors.email}
              />

              <Input
                label="Organização"
                value={formData.organization}
                onChangeText={(value) =>
                  handleFieldChange("organization", value)
                }
                onBlur={() => handleFieldBlur("organization")}
                placeholder="Digite o nome da sua empresa"
                leftIcon={<Building size={20} color="#6b7280" />}
                autoComplete="organization"
                error={errors.organization}
              />

              <DocumentInput
                value={formData.document}
                onChangeText={(value) => handleFieldChange("document", value)}
                onBlur={() => handleFieldBlur("document")}
                leftIcon={<FileText size={20} color="#6b7280" />}
                error={errors.document}
              />

              <Input
                label="Senha"
                value={formData.password}
                onChangeText={(value) => handleFieldChange("password", value)}
                onBlur={() => handleFieldBlur("password")}
                placeholder="Digite sua senha"
                secureTextEntry={!showPassword}
                autoComplete="new-password"
                error={errors.password}
              />

              <Input
                label="Confirmar Senha"
                value={formData.confirmPassword}
                onChangeText={(value) =>
                  handleFieldChange("confirmPassword", value)
                }
                onBlur={() => handleFieldBlur("confirmPassword")}
                placeholder="Confirme sua senha"
                secureTextEntry={!showConfirmPassword}
                autoComplete="new-password"
                error={errors.confirmPassword}
              />

              <Button
                title={
                  isLoading ? (
                    <ActivityIndicator size="small" color="#F3F5F7" />
                  ) : (
                    "Criar Conta"
                  )
                }
                onPress={handleRegister}
                disabled={
                  isLoading ||
                  !formData.name ||
                  !formData.email ||
                  !formData.organization ||
                  !formData.document ||
                  !formData.password ||
                  !formData.confirmPassword
                }
                loading={isLoading}
                fullWidth
                className="mt-4"
              />
            </View>

            <View className="mt-8">
              <Typography variant="body-secondary" className="text-center">
                Já tem uma conta?{" "}
                <Link href="/public/login">
                  <Typography variant="link" className="text-base">
                    Fazer login
                  </Typography>
                </Link>
              </Typography>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
