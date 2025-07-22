import React, { useState } from 'react';
import { View } from 'react-native';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { 
  Package, 
  DollarSign,
} from 'lucide-react-native';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  code: string;
}

interface NewProductProps {
  visible: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id'>) => void;
  loading?: boolean;
}

export default function NewProduct({ 
  visible, 
  onClose, 
  onSave, 
  loading = false 
}: NewProductProps) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    code: ''
  });

  const handleSave = () => {
    if (!formData.name || !formData.price || !formData.code) {
      // Aqui você pode adicionar validação
      return;
    }

    const newProduct = {
      name: formData.name,
      price: parseFloat(formData.price),
      description: formData.description,
      category: formData.category,
      code: formData.code
    };

    onSave(newProduct);
    
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

  return (
    <Modal
      visible={visible}
      onClose={handleClose}
      title="Novo Produto"
      icon={<Package size={24} color="#3B82F6" />}
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
            title="Salvar"
            onPress={handleSave}
            loading={loading}
            className="flex-1"
          />
        </>
      }
    >
      <View className="gap-4">
        <Input
          label="Nome do Produto"
          placeholder="Ex: Pão Francês"
          value={formData.name}
          onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
          leftIcon={<Package size={20} color="#6b7280" />}
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
          placeholder="Descrição do produto..."
          value={formData.description}
          onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
          multiline
          numberOfLines={3}
        />
      </View>
    </Modal>
  );
} 