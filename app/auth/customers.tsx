import React, { useState } from 'react';
import { View, ScrollView, Pressable, FlatList, SafeAreaView, Platform } from 'react-native';
import { router } from 'expo-router';
import Typography from '@/components/ui/Typography';
import Button from '@/components/ui/Button';
import Header from '@/components/ui/Header';
import IconButton from '@/components/ui/IconButton';
import Input from '@/components/ui/Input';

import { 
  ArrowLeft, 
  Building, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Mail,
  Phone
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

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      tradeName: 'Empresa ABC Ltda',
      companyName: 'Empresa ABC Comércio Ltda',
      cnpj: '12.345.678/0001-90',
      state: 'São Paulo',
      city: 'São Paulo',
      address: 'Rua das Flores, 123 - Centro',
      email: 'contato@empresaabc.com',
      phone: '(11) 99999-9999'
    },
    {
      id: '2',
      tradeName: 'Tech Solutions',
      companyName: 'Tech Solutions Tecnologia Ltda',
      cnpj: '98.765.432/0001-10',
      state: 'Rio de Janeiro',
      city: 'Rio de Janeiro',
      address: 'Av. Copacabana, 456 - Copacabana',
      email: 'info@techsolutions.com',
      phone: '(21) 88888-8888'
    },
    {
      id: '3',
      tradeName: 'Construções XYZ',
      companyName: 'Construções XYZ Ltda',
      cnpj: '55.444.333/0001-22',
      state: 'Minas Gerais',
      city: 'Belo Horizonte',
      address: 'Rua da Construção, 789 - Centro',
      email: 'contato@construcoesxyz.com',
      phone: '(31) 77777-7777'
    },
    {
      id: '4',
      tradeName: 'Distribuidora 123',
      companyName: 'Distribuidora 123 Comércio Ltda',
      cnpj: '11.222.333/0001-44',
      state: 'Paraná',
      city: 'Curitiba',
      address: 'Av. das Indústrias, 321 - Industrial',
      email: 'vendas@distribuidora123.com',
      phone: '(41) 66666-6666'
    }
  ]);

  const handleBack = () => {
    router.back();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.tradeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.cnpj.includes(searchQuery) ||
    customer.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCustomer = () => {
    router.push('/auth/new-customer');
  };



  const handleEditCustomer = (customer: Customer) => {
    // Implementar edição
    console.log('Editar cliente:', customer);
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
  };

  const renderCustomerItem = ({ item }: { item: Customer }) => (
    <View className="bg-gray-800 rounded-xl p-4 mb-2 border border-gray-700">
      <View className="flex-row justify-between items-start mb-1">
        <View className="flex-1">
          <Typography variant="h3" className="text-white mb-1">
            {item.tradeName}
          </Typography>
          <Typography variant="body-secondary" className="text-sm mb-1">
            {item.companyName}
          </Typography>
          <Typography variant="body-secondary" className="text-sm mb-1">
            CNPJ: {item.cnpj}
          </Typography>
          <Typography variant="body-secondary" className="text-sm mb-1">
            {item.city} - {item.state}
          </Typography>
          <View className="flex-row items-center gap-4 mt-2">
            <View className="flex-row items-center gap-2">
              <Mail size={15} color="#6b7280" />
              <Typography variant="body-secondary" className="text-xs">
                {item.email}
              </Typography>
            </View>
            <View className="flex-row items-center gap-2">
              <Phone size={15} color="#6b7280" />
              <Typography variant="body-secondary" className="text-xs">
                {item.phone}
              </Typography>
            </View>
          </View>
        </View>
        <View className="flex-row justify-end items-start gap-5">
          <Pressable
            onPress={() => handleEditCustomer(item)}
          >
            <Edit size={16} color="#4A90E2" />
          </Pressable>
          <Pressable
            onPress={() => handleDeleteCustomer(item.id)}
          >
            <Trash2 size={16} color="#ef4444" />
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-900 pt-7 pb-6">
      {/* Header */}
      <Header
        title="Clientes"
        leftIcon={
          <IconButton
            icon={<ArrowLeft size={20} color="#F3F5F7" />}
            onPress={handleBack}
            variant="ghost"
          />
        }
      />

      {/* Content */}
      <View className={`flex-1 px-6 ${Platform.OS === 'ios' ? 'pt-6' : 'pt-4'}`}>
        {/* Search */}
        <View className="mb-6">
          <Input
            placeholder="Buscar clientes..."
            leftIcon={<Search size={20} color="#6b7280" />}
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
          />
        </View>

        {/* Novo Cliente Button */}
        <View className="mb-6">
          <Button
            title="Novo Cliente"
            variant="outlined"
            leftIcon={<Plus size={16} color="#3b82f6" />}
            onPress={handleAddCustomer}
            fullWidth
          />
        </View>

        {/* Customers List */}
        <View className="flex-1 mb-6">
          {filteredCustomers.length === 0 ? (
            <View className="flex-1 justify-center items-center">
              <Building size={48} color="#6b7280" />
              <Typography variant="h3" className="text-gray-400 mt-4 mb-2">
                Nenhum cliente encontrado
              </Typography>
              <Typography variant="body-secondary" className="text-center">
                {searchQuery ? 'Tente ajustar sua busca' : 'Cadastre seu primeiro cliente'}
              </Typography>
              {!searchQuery && (
                <Button
                  title="Adicionar Cliente"
                  onPress={handleAddCustomer}
                  className="mt-4"
                />
              )}
            </View>
          ) : (
            <FlatList
              data={filteredCustomers}
              renderItem={renderCustomerItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </View>
      </View>

    </SafeAreaView>
  );
} 