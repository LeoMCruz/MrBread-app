import React, { useState } from 'react';
import { View, ScrollView, Pressable, FlatList, SafeAreaView, Platform } from 'react-native';
import { router } from 'expo-router';
import Typography from '@/components/ui/Typography';
import Button from '@/components/ui/Button';
import Header from '@/components/ui/Header';
import IconButton from '@/components/ui/IconButton';
import Input from '@/components/ui/Input';
import NewProduct from '@/components/ui/modals/NewProduct';
import { 
  ArrowLeft, 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  DollarSign,
  Tag
} from 'lucide-react-native';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  code: string;
}

export default function Products() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  
  // Mock data
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Pão Francês',
      price: 0.50,
      description: 'Pão francês tradicional',
      category: 'Pães',
      code: 'PF001'
    },
    {
      id: '2',
      name: 'Pão de Queijo',
      price: 2.50,
      description: 'Pão de queijo caseiro',
      category: 'Pães',
      code: 'PQ002'
    },
    {
      id: '3',
      name: 'Bolo de Chocolate',
      price: 15.00,
      description: 'Bolo de chocolate artesanal',
      category: 'Bolos',
      code: 'BC003'
    },
    {
      id: '4',
      name: 'Croissant',
      price: 4.50,
      description: 'Croissant de manteiga',
      category: 'Pães',
      code: 'CR004'
    }
  ]);



  const handleBack = () => {
    router.back();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProduct = () => {
    setModalMode('create');
    setEditingProduct(undefined);
    setIsModalVisible(true);
  };

  const handleSaveProduct = async (productData: Omit<Product, 'id'>) => {
    setIsLoading(true);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newProduct: Product = {
      id: Date.now().toString(),
      ...productData
    };

    setProducts(prev => [newProduct, ...prev]);
    
    setIsLoading(false);
    setIsModalVisible(false);
  };

  const handleEditProductSave = async (editedProduct: Product) => {
    setIsLoading(true);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));

    setProducts(prev => prev.map(p => 
      p.id === editedProduct.id ? editedProduct : p
    ));
    
    setIsLoading(false);
    setIsModalVisible(false);
  };

  const handleEditProduct = (product: Product) => {
    setModalMode('edit');
    setEditingProduct(product);
    setIsModalVisible(true);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const renderProductItem = ({ item }: { item: Product }) => (
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
              onPress={() => handleEditProduct(item)}
            >
              <Edit size={16} color="#4A90E2" />
            </Pressable>
            <Pressable
              onPress={() => handleDeleteProduct(item.id)}
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
        title="Produtos"
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
            placeholder="Buscar produtos..."
            leftIcon={<Search size={20} color="#6b7280" />}
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
          />
        </View>

        {/* Novo Produto Button */}
        <View className="mb-6">
          <Button
            title="Novo Produto"
            variant="outlined"
            leftIcon={<Plus size={16} color="#3b82f6" />}
            onPress={handleAddProduct}
            fullWidth
          />
        </View>

        {/* Products List */}
        <View className="flex-1 mb-6">
          {filteredProducts.length === 0 ? (
            <View className="flex-1 justify-center items-center">
              <Package size={48} color="#6b7280" />
              <Typography variant="h3" className="text-gray-400 mt-4 mb-2">
                Nenhum produto encontrado
              </Typography>
              <Typography variant="body-secondary" className="text-center">
                {searchQuery ? 'Tente ajustar sua busca' : 'Cadastre seu primeiro produto'}
              </Typography>
              {!searchQuery && (
                <Button
                  title="Adicionar Produto"
                  onPress={handleAddProduct}
                  className="mt-4"
                />
              )}
            </View>
          ) : (
            <FlatList
              data={filteredProducts}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </View>
      </View>

      {/* Add/Edit Product Modal */}
      <NewProduct
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSaveProduct}
        onEdit={handleEditProductSave}
        loading={isLoading}
        mode={modalMode}
        initialData={editingProduct}
      />
    </SafeAreaView>
  );
} 