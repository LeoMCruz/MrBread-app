import {
  View,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Mail, FileText, ArrowLeft, CheckCircle } from "lucide-react-native";
import Input from "@/components/ui/Input";
import DocumentInput from "@/components/ui/DocumentInput";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import IconButton from "@/components/ui/IconButton";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/validations";

export default function ForgotPassword() {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: "",
    document: "",
  });
  const [errors, setErrors] = useState<Partial<ForgotPasswordFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateField = (field: keyof ForgotPasswordFormData, value: string) => {
    if (value.length === 0 && !errors[field]) return;

    const fieldSchema = forgotPasswordSchema.shape[field];
    const result = fieldSchema.safeParse(value);

    if (result.success) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } else {
      const errorMessage = result.error.issues[0]?.message || "Campo inválido";
      setErrors((prev) => ({ ...prev, [field]: errorMessage }));
    }
  };

  const handleFieldChange = (field: keyof ForgotPasswordFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleFieldBlur = (field: keyof ForgotPasswordFormData) => {
    validateField(field, formData[field]);
  };

  const handleSubmit = async () => {
    const result = forgotPasswordSchema.safeParse(formData);

    if (result.success) {
      setIsLoading(true);
      
      try {
        // Simular envio de email (mock)
        await new Promise((resolve) => setTimeout(resolve, 2000));
        
        setIsSuccess(true);
        Alert.alert(
          "Email Enviado!",
          "Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.",
          [
            {
              text: "OK",
              onPress: () => router.replace('/public/login'),
            },
          ]
        );
      } catch (error) {
        Alert.alert(
          "Erro",
          "Não foi possível enviar o email de recuperação. Verifique os dados e tente novamente."
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      const fieldErrors: Partial<ForgotPasswordFormData> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ForgotPasswordFormData;
        fieldErrors[field] = issue.message;
      });

      setErrors(fieldErrors);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (isSuccess) {
    return (
      <View className="flex-1 bg-gray-900">
        <Header
          title="Recuperar Senha"
          leftIcon={
            <IconButton
              icon={<ArrowLeft size={20} color="#F3F5F7" />}
              onPress={handleBack}
              variant="ghost"
            />
          }
        />

        <View className="flex-1 justify-center items-center px-6">
          <View className="items-center">
            <View className="w-20 h-20 bg-green-500 rounded-full items-center justify-center mb-6">
              <CheckCircle size={40} color="#ffffff" />
            </View>
            
            <Typography variant="h2" className="text-center text-white mb-4">
              Email Enviado!
            </Typography>
            
            <Typography variant="body-secondary" className="text-center mb-8">
              Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
            </Typography>

            <Button
              title="Voltar ao Login"
              onPress={() => router.replace('/public/login')}
              fullWidth
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900">
      <Header
        title="Recuperar Senha"
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
                Esqueceu sua senha?
              </Typography>
              <Typography variant="body-secondary" className="text-center">
                Digite seu email e documento para receber instruções de recuperação
              </Typography>
            </View>

            <View className="gap-4">
              <Input
                label="E-mail"
                value={formData.email}
                onChangeText={(value) => handleFieldChange("email", value)}
                onBlur={() => handleFieldBlur("email")}
                placeholder="Digite o email da sua conta"
                leftIcon={<Mail size={20} color="#6b7280" />}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={errors.email}
              />

              <DocumentInput
                value={formData.document}
                onChangeText={(value) => handleFieldChange("document", value)}
                onBlur={() => handleFieldBlur("document")}
                leftIcon={<FileText size={20} color="#6b7280" />}
                error={errors.document}
              />

              <Button
                title={
                  isLoading ? (
                    <ActivityIndicator size="small" color="#F3F5F7" />
                  ) : (
                    "Enviar Email de Recuperação"
                  )
                }
                onPress={handleSubmit}
                disabled={
                  isLoading ||
                  !formData.email ||
                  !formData.document ||
                  Object.keys(errors).length > 0
                }
                loading={isLoading}
                fullWidth
                className="mt-4"
              />
            </View>

            <View className="mt-8">
              <Typography variant="body-secondary" className="text-center">
                Lembrou sua senha?{" "}
                <Link href="/public/login">
                  <Typography variant="link" className="text-base">
                    Fazer login
                  </Typography>
                </Link>
              </Typography>
            </View>

            <View className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <Typography variant="body-secondary" className="text-center text-blue-300">
                💡 Dica: Verifique também sua pasta de spam caso não receba o email em alguns minutos.
              </Typography>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
} 