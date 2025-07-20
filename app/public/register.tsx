import { View, Pressable, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Mail, Lock, User, Building, FileText, ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import Input from '@/components/ui/Input';
import MaskedInput from '@/components/ui/MaskedInput';
import Typography from '@/components/ui/Typography';
import Button from '@/components/ui/Button';
import Header from '@/components/ui/Header';
import IconButton from '@/components/ui/IconButton';
import { registerSchema, type RegisterFormData } from '@/lib/validations';
import { useAuthStore } from '@/stores/authStore';

export default function Register() {
  const { login, isLoading } = useAuthStore();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    organization: '',
    cnpj: '',
    password: '',
    confirmPassword: '',
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
      setErrors(prev => ({ ...prev, [field]: undefined }));
    } else {
      const errorMessage = result.error.issues[0]?.message || 'Campo inválido';
      setErrors(prev => ({ ...prev, [field]: errorMessage }));
    }
  };

  const handleFieldChange = (field: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Validar em tempo real sempre que o campo mudar
    validateField(field, value);
  };

  const handleFieldBlur = (field: keyof RegisterFormData) => {
    // Validar quando o usuário sai do campo
    validateField(field, formData[field]);
  };

  const handleRegister = async () => {
    const result = registerSchema.safeParse(formData);
    
    if (result.success) {
      try {
        // Simular cadastro e fazer login automaticamente
        await login(formData.email, formData.password);
        // O redirecionamento acontece automaticamente pelo _layout.tsx
      } catch (error) {
        // Handle error se necessário
        console.error('Erro no registro:', error);
      }
    } else {
      const fieldErrors: Partial<RegisterFormData> = {};
      
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof RegisterFormData;
        fieldErrors[field] = issue.message;
      });
      
      setErrors(fieldErrors);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View className="flex-1 bg-gray-900">
      {/* Header */}
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

            {/* Content */}
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          className="flex-1" 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-6 pt-6">
        {/* Header */}
        <View className="mb-8">
          <Typography variant="h2" className="text-center mb-2">
            MrBread
          </Typography>
          <Typography variant="body-secondary" className="text-center">
            Crie sua conta gratuitamente
          </Typography>
        </View>

        {/* Form */}
        <View className="gap-4">
          <Input
            label="Nome Completo"
            value={formData.name}
            onChangeText={(value) => handleFieldChange('name', value)}
            onBlur={() => handleFieldBlur('name')}
            placeholder="Digite seu nome completo"
            leftIcon={<User size={20} color="#6b7280" />}
            autoComplete="name"
            error={errors.name}
          />

          <Input
            label="E-mail"
            value={formData.email}
            onChangeText={(value) => handleFieldChange('email', value)}
            onBlur={() => handleFieldBlur('email')}
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
            onChangeText={(value) => handleFieldChange('organization', value)}
            onBlur={() => handleFieldBlur('organization')}
            placeholder="Digite o nome da sua empresa"
            leftIcon={<Building size={20} color="#6b7280" />}
            autoComplete="organization"
            error={errors.organization}
          />

          <MaskedInput
            label="CNPJ"
            value={formData.cnpj}
            onChangeText={(value) => handleFieldChange('cnpj', value)}
            onBlur={() => handleFieldBlur('cnpj')}
            placeholder="00.000.000/0000-00"
            leftIcon={<FileText size={20} color="#6b7280" />}
            maskType="cnpj"
            autoComplete="off"
            error={errors.cnpj}
          />

          <Input
            label="Senha"
            value={formData.password}
            onChangeText={(value) => handleFieldChange('password', value)}
            onBlur={() => handleFieldBlur('password')}
            placeholder="Digite sua senha"
            secureTextEntry={!showPassword}
            autoComplete="new-password"
            error={errors.password}
          />

          <Input
            label="Confirmar Senha"
            value={formData.confirmPassword}
            onChangeText={(value) => handleFieldChange('confirmPassword', value)}
            onBlur={() => handleFieldBlur('confirmPassword')}
            placeholder="Confirme sua senha"
            secureTextEntry={!showConfirmPassword}
            autoComplete="new-password"
            error={errors.confirmPassword}
          />

          {/* Register Button */}
          <Button
            title={isLoading ? <ActivityIndicator size="small" color="#F3F5F7" /> : "Criar Conta"}
            onPress={handleRegister}
            disabled={isLoading || !formData.name || !formData.email || !formData.organization || !formData.cnpj || !formData.password || !formData.confirmPassword}
            loading={isLoading}
            fullWidth
            className="mt-4"
          />
        </View>

        {/* Login Link */}
        <View className="mt-8">
          <Typography variant="body-secondary" className="text-center">
            Já tem uma conta?{' '}
            <Link href="/public/login">
              <Typography variant="link" className="inline">
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