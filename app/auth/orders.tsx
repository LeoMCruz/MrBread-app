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
  FileText, 
  Search, 
  Eye, 
  Trash2,
  User,
  Calendar,
  DollarSign
} from 'lucide-react-native';

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  customer: {
    name: string;
    companyName: string;
  };
  createdAt: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export default function Orders() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'PED-001',
      total: 1250.50,
      customer: {
        name: 'Empresa ABC Ltda',
        companyName: 'Empresa ABC Comércio Ltda'
      },
      createdAt: '2024-01-15T10:30:00Z',
      status: 'completed'
    },
    {
      id: '2',
      orderNumber: 'PED-002',
      total: 890.75,
      customer: {
        name: 'Tech Solutions',
        companyName: 'Tech Solutions Tecnologia Ltda'
      },
      createdAt: '2024-01-14T14:20:00Z',
      status: 'pending'
    },
    {
      id: '3',
      orderNumber: 'PED-003',
      total: 2150.00,
      customer: {
        name: 'Construções XYZ',
        companyName: 'Construções XYZ Ltda'
      },
      createdAt: '2024-01-13T09:15:00Z',
      status: 'completed'
    },
    {
      id: '4',
      orderNumber: 'PED-004',
      total: 675.25,
      customer: {
        name: 'Distribuidora 123',
        companyName: 'Distribuidora 123 Comércio Ltda'
      },
      createdAt: '2024-01-12T16:45:00Z',
      status: 'cancelled'
    },
    {
      id: '5',
      orderNumber: 'PED-005',
      total: 1890.30,
      customer: {
        name: 'Empresa ABC Ltda',
        companyName: 'Empresa ABC Comércio Ltda'
      },
      createdAt: '2024-01-11T11:30:00Z',
      status: 'pending'
    }
  ]);

  const handleBack = () => {
    router.back();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredOrders = orders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewOrder = (order: Order) => {
    const orderData = JSON.stringify(order);
    router.push(`/auth/view-order?orderData=${encodeURIComponent(orderData)}`);
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <View className="bg-gray-800 rounded-xl p-4 mb-2 border border-gray-700">
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-1">
            <Typography variant="h3" className="text-white">
              {item.orderNumber}
            </Typography>
            <View 
              className="px-2 py-1 rounded-full"
              style={{ backgroundColor: getStatusColor(item.status) + '20' }}
            >
              <Typography 
                variant="caption" 
                size="xs"
                style={{ color: getStatusColor(item.status) }}
              >
                {getStatusText(item.status)}
              </Typography>
            </View>
          </View>
          <Typography variant="body-secondary" className="text-sm mb-1">
            {item.customer.name}
          </Typography>
          <Typography variant="body-secondary" className="text-sm mb-2">
            {item.customer.companyName}
          </Typography>
          <View className="flex-row items-center gap-4">
            <View className="flex-row items-center gap-2">
              <Calendar size={15} color="#6b7280" />
              <Typography variant="body-secondary" className="text-xs">
                {formatDate(item.createdAt)}
              </Typography>
            </View>
          </View>
        </View>
        <View className="flex-col justify-between items-end gap-4">
          <View className="flex-row justify-end items-end gap-3">
            <Pressable
              onPress={() => handleViewOrder(item)}
            >
              <Eye size={16} color="#4A90E2" />
            </Pressable>
            <Pressable
              onPress={() => handleDeleteOrder(item.id)}
            >
              <Trash2 size={16} color="#ef4444" />
            </Pressable>
          </View>
          <View className="items-end">
            <Typography variant="h3" className="text-green-500 font-bold">
              R$ {item.total.toFixed(2).replace('.', ',')}
            </Typography>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-900 pt-7 pb-6">
      {/* Header */}
      <Header
        title="Pedidos"
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
            placeholder="Buscar pedidos..."
            leftIcon={<Search size={20} color="#6b7280" />}
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
          />
        </View>

        {/* Orders List */}
        <View className="flex-1 mb-6">
          {filteredOrders.length === 0 ? (
            <View className="flex-1 justify-center items-center">
              <FileText size={48} color="#6b7280" />
              <Typography variant="h3" className="text-gray-400 mt-4 mb-2">
                Nenhum pedido encontrado
              </Typography>
              <Typography variant="body-secondary" className="text-center">
                {searchQuery ? 'Tente ajustar sua busca' : 'Nenhum pedido foi criado ainda'}
              </Typography>
            </View>
          ) : (
            <FlatList
              data={filteredOrders}
              renderItem={renderOrderItem}
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