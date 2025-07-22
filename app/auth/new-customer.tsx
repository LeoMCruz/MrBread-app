import React, { useState } from 'react';
import { View, ScrollView, SafeAreaView, Platform, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import Typography from '@/components/ui/Typography';
import Button from '@/components/ui/Button';
import Header from '@/components/ui/Header';
import IconButton from '@/components/ui/IconButton';
import Input from '@/components/ui/Input';
import MaskedInput from '@/components/ui/MaskedInput';
import { 
  ArrowLeft, 
  Building, 
  User,
  MapPin,
  Mail,
  Phone,
  FileText
} from 'lucide-react-native';

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

export default function NewCustomer() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    tradeName: '',
    companyName: '',
    cnpj: '',
    state: '',
    city: '',
    address: '',
    email: '',
    phone: ''
  });

  const handleBack = () => {
    router.back();
  };

  const handleSave = async () => {
    if (!formData.tradeName || !formData.companyName || !formData.cnpj) {
      // Aqui você pode adicionar validação
      return;
    }

    setIsLoading(true);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newCustomer = {
      tradeName: formData.tradeName,
      companyName: formData.companyName,
      cnpj: formData.cnpj,
      state: formData.state,
      city: formData.city,
      address: formData.address,
      email: formData.email,
      phone: formData.phone
    };

    // Aqui você salvaria o cliente
    console.log('Novo cliente:', newCustomer);
    
    setIsLoading(false);
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900 pt-7 pb-6">
      {/* Header */}
      <Header
        title="Novo Cliente"
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
          className="flex-1 px-6 " 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
        <View className="gap-4 mb-6">
          <Input
            label="Nome Fantasia"
            placeholder="Ex: Empresa ABC Ltda"
            value={formData.tradeName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, tradeName: text }))}
            leftIcon={<Building size={20} color="#6b7280" />}
          />
          
          <Input
            label="Razão Social"
            placeholder="Ex: Empresa ABC Comércio Ltda"
            value={formData.companyName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, companyName: text }))}
            leftIcon={<FileText size={20} color="#6b7280" />}
          />
          
          <MaskedInput
            label="CNPJ"
            placeholder="00.000.000/0000-00"
            value={formData.cnpj}
            onChangeText={(text) => setFormData(prev => ({ ...prev, cnpj: text }))}
            leftIcon={<FileText size={20} color="#6b7280" />}
            maskType="cnpj"
          />
          
          <Input
            label="Estado"
            placeholder="Ex: São Paulo"
            value={formData.state}
            onChangeText={(text) => setFormData(prev => ({ ...prev, state: text }))}
            leftIcon={<MapPin size={20} color="#6b7280" />}
          />
          
          <Input
            label="Cidade"
            placeholder="Ex: São Paulo"
            value={formData.city}
            onChangeText={(text) => setFormData(prev => ({ ...prev, city: text }))}
            leftIcon={<MapPin size={20} color="#6b7280" />}
          />
          
          <Input
            label="Endereço"
            placeholder="Ex: Rua das Flores, 123"
            value={formData.address}
            onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
            leftIcon={<MapPin size={20} color="#6b7280" />}
            multiline
            numberOfLines={2}
          />
          
          <Input
            label="Email"
            placeholder="exemplo@empresa.com"
            value={formData.email}
            onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
            leftIcon={<Mail size={20} color="#6b7280" />}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <MaskedInput
            label="Telefone"
            placeholder="(11) 99999-9999"
            value={formData.phone}
            onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
            leftIcon={<Phone size={20} color="#6b7280" />}
            maskType="phone"
          />
          <Button
            title={isLoading ? <ActivityIndicator size="small" color="#F3F5F7" /> : "Salvar"}
            onPress={handleSave}
            disabled={isLoading || !formData.tradeName || !formData.companyName || !formData.cnpj}
            loading={isLoading}
            fullWidth
            className="mt-4"
          />
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} 