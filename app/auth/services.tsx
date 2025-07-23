import React, { useState } from 'react';
import { View, ScrollView, Pressable, FlatList, SafeAreaView, Platform } from 'react-native';
import { router } from 'expo-router';
import Typography from '@/components/ui/Typography';
import Button from '@/components/ui/Button';
import Header from '@/components/ui/Header';
import IconButton from '@/components/ui/IconButton';
import Input from '@/components/ui/Input';
import NewService from '@/components/ui/modals/NewService';
import { 
  ArrowLeft, 
  Wrench, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  DollarSign,
  Tag
} from 'lucide-react-native';

interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  code: string;
}

export default function Services() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingService, setEditingService] = useState<Service | undefined>(undefined);
  
  // Mock data
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'Corte de Cabelo',
      price: 25.00,
      description: 'Corte de cabelo masculino',
      category: 'Cabelo',
      code: 'CC001'
    },
    {
      id: '2',
      name: 'Barba',
      price: 15.00,
      description: 'Barba tradicional',
      category: 'Barba',
      code: 'BB002'
    },
    {
      id: '3',
      name: 'Corte + Barba',
      price: 35.00,
      description: 'Corte de cabelo + barba',
      category: 'Combo',
      code: 'CB003'
    },
    {
      id: '4',
      name: 'Hidratação',
      price: 45.00,
      description: 'Hidratação capilar',
      category: 'Tratamento',
      code: 'HD004'
    }
  ]);

  const handleBack = () => {
    router.back();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddService = () => {
    setModalMode('create');
    setEditingService(undefined);
    setIsModalVisible(true);
  };

  const handleSaveService = async (serviceData: Omit<Service, 'id'>) => {
    setIsLoading(true);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newService: Service = {
      id: Date.now().toString(),
      ...serviceData
    };

    setServices(prev => [newService, ...prev]);
    
    setIsLoading(false);
    setIsModalVisible(false);
  };

  const handleEditServiceSave = async (editedService: Service) => {
    setIsLoading(true);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));

    setServices(prev => prev.map(s => 
      s.id === editedService.id ? editedService : s
    ));
    
    setIsLoading(false);
    setIsModalVisible(false);
  };

  const handleEditService = (service: Service) => {
    setModalMode('edit');
    setEditingService(service);
    setIsModalVisible(true);
  };

  const handleDeleteService = (serviceId: string) => {
    setServices(prev => prev.filter(s => s.id !== serviceId));
  };

  const renderServiceItem = ({ item }: { item: Service }) => (
    <View className="bg-gray-800 rounded-xl p-4 mb-2 border border-gray-700">
      <View className="flex-row justify-between items-start mb-1">
        <View className="flex-1">
          <Typography variant="h3" className="text-white mb-1">
            {item.name}
          </Typography>
          <Typography variant="body-secondary" className="text-sm mb-1">
            Código: {item.code}
          </Typography>
          {item.description && (
            <Typography variant="body-secondary" className="text-sm">
              {item.description}
            </Typography>
          )}
        </View>
        <View className=" gap-6 flex-col justify-between">
          <View className="flex-row justify-end items-end gap-5 ">
            <Pressable
              onPress={() => handleEditService(item)}
            >
              <Edit size={16} color="#4A90E2" />
            </Pressable>
            <Pressable
              onPress={() => handleDeleteService(item.id)}
            >
              <Trash2 size={16} color="#ef4444" />
            </Pressable>
          </View>
          <View className="items-center">
            <Typography variant="h3" className="text-green-500 ml-1">
              R$ {item.price.toFixed(2)}
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
        title="Serviços"
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
            placeholder="Buscar serviços..."
            leftIcon={<Search size={20} color="#6b7280" />}
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
          />
        </View>

        {/* Novo Serviço Button */}
        <View className="mb-6">
          <Button
            title="Novo Serviço"
            variant="outlined"
            leftIcon={<Plus size={16} color="#3b82f6" />}
            onPress={handleAddService}
            fullWidth
          />
        </View>

        {/* Services List */}
        <View className="flex-1 mb-6">
          {filteredServices.length === 0 ? (
            <View className="flex-1 justify-center items-center">
              <Wrench size={48} color="#6b7280" />
              <Typography variant="h3" className="text-gray-400 mt-4 mb-2">
                Nenhum serviço encontrado
              </Typography>
              <Typography variant="body-secondary" className="text-center">
                {searchQuery ? 'Tente ajustar sua busca' : 'Cadastre seu primeiro serviço'}
              </Typography>
              {!searchQuery && (
                <Button
                  title="Adicionar Serviço"
                  onPress={handleAddService}
                  className="mt-4"
                />
              )}
            </View>
          ) : (
            <FlatList
              data={filteredServices}
              renderItem={renderServiceItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </View>
      </View>

      {/* Add/Edit Service Modal */}
      <NewService
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSaveService}
        onEdit={handleEditServiceSave}
        loading={isLoading}
        mode={modalMode}
        initialData={editingService}
      />
    </SafeAreaView>
  );
} 