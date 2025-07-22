import React, { useState, useMemo } from 'react';
import { View, FlatList, Pressable } from 'react-native';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ModalFlatList from './ModalFlatList';
import Typography from '@/components/ui/Typography';
import { 
  User, 
  Search
} from 'lucide-react-native';

interface Customer {
  id: number;
  name: string;
  companyName: string;
  cnpj: string;
  city: string;
}

interface SelectCustomerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (customer: Customer) => void;
  loading?: boolean;
}

export default function SelectCustomer({ 
  visible, 
  onClose, 
  onSelect, 
  loading = false 
}: SelectCustomerProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Dados mockados de clientes
  const customers: Customer[] = [
    { 
      id: 1, 
      name: 'Empresa ABC Ltda', 
      companyName: 'ABC Comércio e Indústria Ltda',
      cnpj: '12.345.678/0001-90', 
      city: 'São Paulo - SP' 
    },
    { 
      id: 2, 
      name: 'Tech Solutions', 
      companyName: 'Tech Solutions Consultoria Ltda',
      cnpj: '98.765.432/0001-10', 
      city: 'Rio de Janeiro - RJ' 
    },
    { 
      id: 3, 
      name: 'Construções XYZ', 
      companyName: 'XYZ Construções e Obras Ltda',
      cnpj: '55.444.333/0001-22', 
      city: 'Belo Horizonte - MG' 
    },
    { 
      id: 4, 
      name: 'Padaria Central', 
      companyName: 'Padaria Central do Brasil Ltda',
      cnpj: '11.222.333/0001-44', 
      city: 'Curitiba - PR' 
    },
    { 
      id: 5, 
      name: 'Restaurante Sabor', 
      companyName: 'Sabor Gastronomia Ltda',
      cnpj: '66.777.888/0001-55', 
      city: 'Salvador - BA' 
    },
    { 
      id: 6, 
      name: 'Hotel Luxo', 
      companyName: 'Luxo Hotelaria e Turismo Ltda',
      cnpj: '99.000.111/0001-66', 
      city: 'Fortaleza - CE' 
    }
  ];

  // Filtrar clientes baseado na busca
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.cnpj.includes(searchTerm)
    );
  }, [searchTerm]);

  // Selecionar cliente
  const handleSelectCustomer = (customer: Customer) => {
    onSelect(customer);
    setSearchTerm('');
    onClose();
  };

  // Renderizar item da lista
  const renderCustomerItem = ({ item }: { item: Customer }) => {
    return (
      <Pressable
        onPress={() => handleSelectCustomer(item)}
        className="bg-gray-700 rounded-lg p-3 border border-gray-600 mb-2 active:bg-gray-600"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Typography variant="body" size="sm" className="font-medium mb-1">
              {item.name}
            </Typography>
            <Typography variant="caption" size="xs" className="text-gray-400 mb-1">
              {item.companyName}
            </Typography>
            <Typography variant="caption" size="xs" className="text-gray-400">
              CNPJ: {item.cnpj}
            </Typography>
            <Typography variant="caption" size="xs" className="text-gray-400">
              {item.city}
            </Typography>
          </View>
        </View>
      </Pressable>
    );
  };

  const handleClose = () => {
    setSearchTerm('');
    onClose();
  };

  return (
    <ModalFlatList
      visible={visible}
      onClose={handleClose}
      title="Selecionar Cliente"
      icon={<User size={24} color="#10B981" />}
      saved={!loading}
      height={0.8}
    >
      <View className="flex-1 gap-4">
        {/* Campo de busca */}
        <View >
          <Input
            placeholder="Buscar clientes..."
            leftIcon={<Search size={20} color="#6b7280" />}
            value={searchTerm}
            onChangeText={setSearchTerm}
            autoCapitalize="none"
          />
        </View>

        {/* Lista de clientes */}
        <FlatList
          data={filteredCustomers}
          renderItem={renderCustomerItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          className="flex-1"
        />
      </View>
    </ModalFlatList>
  );
} 