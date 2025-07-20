import { View, Pressable, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import clsx from 'clsx';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import Input from '@/components/ui/Input';
import Typography from '@/components/ui/Typography';
import Button from '@/components/ui/Button';
import GoogleIcon from '@/components/assets/google-color-icon.svg';
import { loginSchema, type LoginFormData } from '@/lib/validations';
import { useAuthStore } from '@/stores/authStore';

export default function Login() {
  const { login, isLoading } = useAuthStore();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateField = (field: keyof LoginFormData, value: string) => {
    // Só validar se o campo foi tocado ou se já tem erro
    if (value.length === 0 && !errors[field]) return;
    
    const fieldSchema = loginSchema.shape[field];
    const result = fieldSchema.safeParse(value);
    
    if (result.success) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    } else {
      const errorMessage = result.error.issues[0]?.message || 'Campo inválido';
      setErrors(prev => ({ ...prev, [field]: errorMessage }));
    }
  };

  const handleFieldChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Validar em tempo real sempre que o campo mudar
    validateField(field, value);
  };

  const handleFieldBlur = (field: keyof LoginFormData) => {
    // Validar quando o usuário sai do campo
    validateField(field, formData[field]);
  };

  const handleLogin = async () => {
    const result = loginSchema.safeParse(formData);
    
    if (result.success) {
      try {
        await login(formData.email, formData.password);
        // O redirecionamento acontece automaticamente pelo _layout.tsx
      } catch (error) {
        // Handle error se necessário
        console.error('Erro no login:', error);
      }
    } else {
      const fieldErrors: Partial<LoginFormData> = {};
      
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginFormData;
        fieldErrors[field] = issue.message;
      });
      
      setErrors(fieldErrors);
    }
  };

  return (
    <View className="flex-1 bg-gray-900">
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        className="flex-1 " 
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-6 py-8">
        {/* Header */}
        <View className="mb-20">
          <Typography variant="h1" className="text-center mb-2">
            MrBread
          </Typography>
          <Typography variant="body-secondary" className="text-center">
            Faça login na sua conta
          </Typography>
        </View>

        {/* Form */}
        <View className="gap-4">
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
            label="Senha"
            value={formData.password}
            onChangeText={(value) => handleFieldChange('password', value)}
            onBlur={() => handleFieldBlur('password')}
            placeholder="Digite sua senha"
            secureTextEntry={!showPassword}
            autoComplete="password"
            error={errors.password}
          />

          {/* Forgot Password */}
          <View className="items-end ">
            <Pressable>
              <Typography variant="link" size="sm">
                Esqueceu sua senha?
              </Typography>
            </Pressable>
          </View>

          {/* Login Button */}
          <Button
            title={isLoading ? <ActivityIndicator size="small" color="#F3F5F7" /> : "Entrar"}
            onPress={handleLogin}
            disabled={isLoading || !formData.email || !formData.password}
            loading={isLoading}
            fullWidth
          />
        </View>

        {/* Divider */}
        <View className="mt-8 mb-6">
          <View className="flex-row items-center">
            <View className="flex-1 h-px bg-gray-600" />
            <Typography variant="body-secondary" className="mx-4">
              ou
            </Typography>
            <View className="flex-1 h-px bg-gray-600" />
          </View>
        </View>

        {/* Social Login */}
        <View className="mb-8">
          <Pressable
            onPress={() => console.log('Google login')}
            className="flex-row items-center justify-center rounded-xl border-2 border-gray-600 bg-gray-800 h-12 px-4"
          >
            <GoogleIcon width={20} height={20} />
            <Typography variant="body" color="white" className="font-semibold ml-3">
              Google
            </Typography>
          </Pressable>
        </View>

        {/* Sign Up Link */}
        <View>
          <Typography variant="body-secondary" className="text-center">
            Não tem uma conta?{' '}
            <Link href="/public/register">
              <Typography variant="link" className="inline">
                Criar conta
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