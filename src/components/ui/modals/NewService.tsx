import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import Typography from '@/components/ui/Typography';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { 
  Wrench, 
  DollarSign,
  Tag,
  Edit
} from 'lucide-react-native';
import Currency from '../Currency';

interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  code: string;
}

interface NewServiceProps {
  visible: boolean;
  onClose: () => void;
  onSave: (service: Omit<Service, 'id'>) => void;
  onEdit?: (service: Service) => void;
  loading?: boolean;
  mode?: 'create' | 'edit';
  initialData?: Service;
}

export default function NewService({ 
  visible, 
  onClose, 
  onSave, 
  onEdit,
  loading = false,
  mode = 'create',
  initialData
}: NewServiceProps) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    code: ''
  });

  // Preencher formulário com dados iniciais quando em modo de edição
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        name: initialData.name,
        price: initialData.price.toString(),
        description: initialData.description,
        category: initialData.category,
        code: initialData.code
      });
    }
  }, [mode, initialData, visible]);

  const handleSave = () => {
    if (!formData.name || !formData.price || !formData.code) {
      // Aqui você pode adicionar validação
      return;
    }

    if (mode === 'edit' && initialData && onEdit) {
      const editedService: Service = {
        id: initialData.id,
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        category: formData.category,
        code: formData.code
      };
      onEdit(editedService);
    } else {
      const newService = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        category: formData.category,
        code: formData.code
      };
      onSave(newService);
    }
    
    // Limpar formulário
    setFormData({
      name: '',
      price: '',
      description: '',
      category: '',
      code: ''
    });
  };

  const handleClose = () => {
    // Limpar formulário ao fechar
    setFormData({
      name: '',
      price: '',
      description: '',
      category: '',
      code: ''
    });
    onClose();
  };

  // Limpar formulário quando o modal é fechado
  useEffect(() => {
    if (!visible) {
      setFormData({
        name: '',
        price: '',
        description: '',
        category: '',
        code: ''
      });
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      onClose={handleClose}
      title={mode === 'edit' ? 'Editar Serviço' : 'Novo Serviço'}
      icon={mode === 'edit' ? <Edit size={24} color="#3B82F6" /> : <Wrench size={24} color="#3B82F6" />}
      saved={!loading}
      height={0.48}
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
            title={mode === 'edit' ? 'Atualizar' : 'Salvar'}
            onPress={handleSave}
            loading={loading}
            className="flex-1"
          />
        </>
      }
    >
      <View className="gap-4">
        <Input
          label="Nome do Serviço"
          placeholder="Ex: Corte de Cabelo"
          value={formData.name}
          onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
          leftIcon={<Wrench size={20} color="#6b7280" />}
        />
                        
        <Input
          label="Preço"
          placeholder="R$ 0,00"
          value={formData.price}
          onChangeText={(text) => setFormData(prev => ({ ...prev, price: text }))}
          leftIcon={<DollarSign size={20} color="#6b7280" />}
          keyboardType="numeric"
        />
        
        <Input
          label="Descrição (opcional)"
          placeholder="Descrição do serviço..."
          value={formData.description}
          onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
          multiline
          numberOfLines={3}
        />
      </View>
    </Modal>
  );
} 