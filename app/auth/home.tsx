import { View, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import Typography from '@/components/ui/Typography';
import Button from '@/components/ui/Button';
import Header from '@/components/ui/Header';
import IconButton from '@/components/ui/IconButton';
import { 
  LogOut, 
  Users, 
  Package, 
  Wrench, 
  FileText, 
  ShoppingCart, 
  Settings, 
  TrendingUp,
  User,
  Building,
  Menu
} from 'lucide-react-native';
import { useAuthStore } from '@/stores/authStore';

interface MenuCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  color: string;
  bgColor: string;
}

export default function Home() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    console.log('Logout');
    logout();
    router.replace('/public/login');
  };

  const menuCards: MenuCard[] = [
    {
      id: 'clients',
      title: 'Clientes',
      description: 'Gerenciar clientes',
      icon: <Users size={24} color="#10B981" />,
      route: '/auth/clients',
      color: '#10B981',
      bgColor: '#064E3B'
    },
    {
      id: 'products',
      title: 'Produtos',
      description: 'Cadastrar produtos',
      icon: <Package size={24} color="#3B82F6" />,
      route: '/auth/products',
      color: '#3B82F6',
      bgColor: '#1E3A8A'
    },
    {
      id: 'services',
      title: 'Serviços',
      description: 'Cadastrar serviços',
      icon: <Wrench size={24} color="#F59E0B" />,
      route: '/auth/services',
      color: '#F59E0B',
      bgColor: '#92400E'
    },
    {
      id: 'budgets',
      title: 'Pedidos',
      description: 'Gerenciar Pedidos',
      icon: <FileText size={24} color="#8B5CF6" />,
      route: '/auth/budgets',
      color: '#8B5CF6',
      bgColor: '#5B21B6'
    },
    {
      id: 'reports',
      title: 'Relatórios',
      description: 'Visualizar relatórios',
      icon: <TrendingUp size={24} color="#06B6D4" />,
      route: '/auth/reports',
      color: '#06B6D4',
      bgColor: '#0E7490'
    },
    {
      id: 'settings',
      title: 'Configurações',
      description: 'Gerenciar configurações',
      icon: <Settings size={24} color="#F3F5F7" />,
      route: '/auth/settings',
      color: '#131517',
      bgColor: '#131517'
    }
  ];

  const handleMenuPress = (route: string) => {
    router.push(route);
  };

  return (
    <View className="flex-1 bg-gray-900">
      <Header
        rightActions={
          <IconButton
            icon={<LogOut size={20} color="#F3F5F7" />}
            onPress={handleLogout}
            variant="ghost"
          />
        }
      />

              {/* Content */}
        <ScrollView 
          className="flex-1 px-6 pt-6"
          contentContainerStyle={{ flexGrow: 1 }}
        >
                    {/* Welcome Section */}
          <View className="mb-8 ">
            <Typography variant="h2" className="text-center mb-2">
              Bem-vindo, Usuário!
            </Typography>
            <Typography variant="body-secondary" className="text-center">
              Gerencie seus orçamentos e pedidos de venda
            </Typography>
          </View>

        {/* Quick Stats */}
        <View className="bg-gray-800 rounded-xl p-4 mb-6">
          <Typography variant="h3" className="text-white mb-3">
            Resumo do Dia
          </Typography>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Typography variant="h2" className="text-green-500 font-bold">
                8
              </Typography>
              <Typography variant="body-secondary" className="text-xs">
                Pedidos
              </Typography>
            </View>
            <View className="items-center">
              <Typography variant="h2" className="text-purple-500 font-bold">
                R$ 15.420
              </Typography>
              <Typography variant="body-secondary" className="text-xs">
                Faturamento Previsto
              </Typography>
            </View>
          </View>
        </View>

        {/* Menu Grid */}
        <View className="mb-6">
          <Typography variant="h3" className="text-white mb-4">
            Menu Principal
          </Typography>
          <View className="flex-row flex-wrap justify-between">
            {menuCards.map((card) => (
              <Pressable
                key={card.id}
                onPress={() => handleMenuPress(card.route)}
                className="w-[48%] mb-4"
              >
                <View 
                  className="bg-gray-800 rounded-xl p-4 border border-gray-700"
                  style={{ borderLeftColor: card.color, borderLeftWidth: 4 }}
                >
                  <View 
                    className="w-12 h-12 rounded-lg items-center justify-center mb-3"
                    style={{ backgroundColor: card.bgColor }}
                  >
                    {card.icon}
                  </View>
                  <Typography variant="h3" className="text-white mb-1">
                    {card.title}
                  </Typography>
                  <Typography variant="body-secondary" className="text-xs">
                    {card.description}
                  </Typography>
                </View>
              </Pressable>
            ))}
          </View>
          <Button
            title="Novo Pedido"
            onPress={() => {}}
            variant="outlined"
            fullWidth
            className="mt-4"
          />
        </View>
      </ScrollView>
    </View>
  );
} 