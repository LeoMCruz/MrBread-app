import React, { useState, useMemo } from 'react';
import { View, FlatList, Pressable } from 'react-native';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ModalFlatList from './ModalFlatList';
import Typography from '@/components/ui/Typography';
import { 
  Wrench, 
  Search,
  CheckCircle,
  Circle
} from 'lucide-react-native';

interface Service {
  id: number;
  name: string;
  code: string;
  description: string;
  price: number;
}

interface SelectServiceProps {
  visible: boolean;
  onClose: () => void;
  onSave: (services: Service[]) => void;
  loading?: boolean;
  existingServiceIds?: number[];
}

export default function SelectService({ 
  visible, 
  onClose, 
  onSave, 
  loading = false,
  existingServiceIds = []
}: SelectServiceProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);

  // Dados mockados de serviços
  const services: Service[] = [
    { id: 1, name: 'Entrega', code: 'EN001', description: 'Serviço de entrega em domicílio', price: 8.00 },
    { id: 2, name: 'Embalagem', code: 'EM002', description: 'Embalagem especial para presentes', price: 3.00 },
    { id: 3, name: 'Montagem', code: 'MO003', description: 'Montagem de cestas e arranjos', price: 15.00 },
    { id: 4, name: 'Personalização', code: 'PE004', description: 'Personalização de produtos', price: 5.00 },
    { id: 5, name: 'Instalação', code: 'IN005', description: 'Instalação de equipamentos', price: 25.00 },
    { id: 6, name: 'Manutenção', code: 'MA006', description: 'Serviço de manutenção preventiva', price: 30.00 },
    { id: 7, name: 'Consultoria', code: 'CO007', description: 'Consultoria técnica especializada', price: 50.00 },
    { id: 8, name: 'Treinamento', code: 'TR008', description: 'Treinamento de equipe', price: 80.00 }
  ];

  // Filtrar serviços baseado na busca
  const filteredServices = useMemo(() => {
    return services.filter(service => 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Verificar se serviço está selecionado
  const isServiceSelected = (service: Service) => {
    return selectedServices.some(s => s.id === service.id);
  };

  // Verificar se serviço já existe na lista principal
  const isServiceAlreadyInList = (service: Service) => {
    return existingServiceIds.includes(service.id);
  };

  // Toggle seleção do serviço
  const toggleServiceSelection = (service: Service) => {
    // Não permitir selecionar serviços que já estão na lista principal
    if (isServiceAlreadyInList(service)) {
      return;
    }

    if (isServiceSelected(service)) {
      setSelectedServices(prev => prev.filter(s => s.id !== service.id));
    } else {
      setSelectedServices(prev => [...prev, service]);
    }
  };

  // Renderizar item da lista
  const renderServiceItem = ({ item }: { item: Service }) => {
    const isSelected = isServiceSelected(item);
    const isAlreadyInList = isServiceAlreadyInList(item);
    
    return (
      <Pressable
        onPress={() => toggleServiceSelection(item)}
        disabled={isAlreadyInList}
        className={`rounded-lg p-3 border mb-2 ${
          isSelected ? 'border-orange-500 bg-orange-900/20' : 'bg-gray-700 border-gray-600'
        } ${
          isAlreadyInList ? 'opacity-50' : ''
        }`}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <View className="flex-row items-center gap-2 mb-1">
              {isSelected ? (
                <CheckCircle size={16} color="#10b981" />
              ) : (
                <Circle size={16} color="#6b7280" />
              )}
              <Typography variant="body" size="sm" className="font-medium">
                {item.code} - {item.name}
              </Typography>
            </View>
            <Typography variant="caption" size="xs" className="text-gray-400 ml-6">
              {item.description}
            </Typography>
          </View>
          <View className="items-end">
            <Typography variant="body" size="sm" className="text-emerald-500 font-semibold">
              R$ {item.price.toFixed(2).replace('.', ',')}
            </Typography>
          </View>
        </View>
      </Pressable>
    );
  };

  const handleSave = () => {
    onSave(selectedServices);
    setSelectedServices([]);
    setSearchTerm('');
  };

  const handleClose = () => {
    setSelectedServices([]);
    setSearchTerm('');
    onClose();
  };

  return (
    <ModalFlatList
      visible={visible}
      onClose={handleClose}
      title="Selecionar Serviços"
      icon={<Wrench size={24} color="#F59E0B" />}
      saved={!loading}
      height={0.8}
      onSave={handleSave}
      footer={
        <>
          <Button
            title="Cancelar"
            variant="outlined"
            onPress={handleClose}
            className="flex-1"
          />
          <Button
            title={`Salvar (${selectedServices.length})`}
            onPress={handleSave}
            loading={loading}
            disabled={selectedServices.length === 0}
            className="flex-1"
          />
        </>
      }
    >
      <View className="flex-1 gap-4">
        {/* Campo de busca */}
        <View >
          <Input
            placeholder="Buscar serviços..."
            leftIcon={<Search size={20} color="#6b7280" />}
            value={searchTerm}
            onChangeText={setSearchTerm}
            autoCapitalize="none"
          />
        </View>

        {/* Lista de serviços */}
        <FlatList
          data={filteredServices}
          renderItem={renderServiceItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          className="flex-1"
        />

        {/* Contador de selecionados */}
        {selectedServices.length > 0 && (
          <View className="bg-orange-900/20 border border-orange-500 rounded-lg p-3">
            <Typography variant="body" size="sm" className="text-orange-400 text-center">
              {selectedServices.length} serviço(s) selecionado(s)
            </Typography>
          </View>
        )}
      </View>
    </ModalFlatList>
  );
} 