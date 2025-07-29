import { View, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import Typography from '@/components/ui/Typography';
import Header from '@/components/ui/Header';
import IconButton from '@/components/ui/IconButton';
import { 
  ArrowLeft, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Package,
  ArrowUp,
  Wrench
} from 'lucide-react-native';

interface MetricCard {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  trend: string;
  trendIcon: React.ReactNode;
  color: string;
}

interface TopItem {
  id: string;
  name: string;
  quantity: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

export default function Dashboard() {
  const metricCards: MetricCard[] = [
    {
      id: 'sales-today',
      title: 'Vendas de Hoje',
      value: 'R$ 150,00',
      subtitle: '5 pedidos realizados',
      icon: <DollarSign size={24} color="#FFFFFF" />,
      trend: '+12%',
      trendIcon: <ArrowUp size={12} color="#10B981" />,
      color: '#10B981'
    },
    {
      id: 'sales-month',
      title: 'Vendas do Mês',
      value: 'R$ 3.500,00',
      subtitle: '45 pedidos no período',
      icon: <TrendingUp size={24} color="#FFFFFF" />,
      trend: '+8%',
      trendIcon: <ArrowUp size={12} color="#3B82F6" />,
      color: '#3B82F6'
    },
    {
      id: 'active-clients',
      title: 'Clientes Ativos',
      value: '12',
      subtitle: 'este mês',
      icon: <Users size={24} color="#FFFFFF" />,
      trend: '+3',
      trendIcon: <ArrowUp size={12} color="#8B5CF6" />,
      color: '#8B5CF6'
    },
    {
      id: 'items-sold',
      title: 'Itens Vendidos',
      value: '101',
      subtitle: 'produtos e serviços',
      icon: <Package size={24} color="#FFFFFF" />,
      trend: '+15%',
      trendIcon: <ArrowUp size={12} color="#F59E0B" />,
      color: '#F59E0B'
    }
  ];

  const topItems: TopItem[] = [
    {
      id: 'pao-frances',
      name: 'Pão Francês',
      quantity: '45 unidades',
      value: 'R$ 22,50',
      icon: <Package size={20} color="#FFFFFF" />,
      color: '#3B82F6'
    },
    {
      id: 'bolo-chocolate',
      name: 'Bolo de Chocolate',
      quantity: '8 unidades',
      value: 'R$ 120,00',
      icon: <Package size={20} color="#FFFFFF" />,
      color: '#10B981'
    },
    {
      id: 'entrega-especial',
      name: 'Entrega Especial',
      quantity: '8 unidades',
      value: 'R$ 15,00',
      icon: <Wrench size={20} color="#FFFFFF" />,
      color: '#F59E0B'
    }
  ];

  const handleBack = () => {
    router.back();
  };

  const handlePeriodFilter = (period: string) => {
    console.log('Filtro selecionado:', period);
  };

  return (
    <View className="flex-1 bg-gray-900">
      <Header
        title="Dashboard"
        leftIcon={
          <IconButton
            icon={<ArrowLeft size={20} color="#F3F5F7" />}
            onPress={handleBack}
            variant="ghost"
          />
        }
      />

      <ScrollView className="flex-1 px-4 mb-6" showsVerticalScrollIndicator={false}>
        <View className="flex-row justify-center mb-4 mt-4">
          <Pressable
            onPress={() => handlePeriodFilter('hoje')}
            className="px-4 py-2 bg-blue-500 rounded-lg mr-2"
          >
            <Typography variant="body" className="text-white font-medium text-sm">
              Hoje
            </Typography>
          </Pressable>
          <Pressable
            onPress={() => handlePeriodFilter('semana')}
            className="px-4 py-2 bg-gray-700 rounded-lg mr-2"
          >
            <Typography variant="body" className="text-gray-300 font-medium text-sm">
              Semana
            </Typography>
          </Pressable>
          <Pressable
            onPress={() => handlePeriodFilter('mes')}
            className="px-4 py-2 bg-gray-700 rounded-lg"
          >
            <Typography variant="body" className="text-gray-300 font-medium text-sm">
              Mês
            </Typography>
          </Pressable>
        </View>

        <View className="flex-row flex-wrap justify-between mb-6">
          {metricCards.map((card) => (
            <Pressable
              key={card.id}
              className="w-[48%] bg-gray-800 rounded-xl p-5 border border-gray-700 mb-4"
            >
              <View className="flex-row justify-between items-start mb-4">
                <View 
                  className="w-12 h-12 rounded-lg items-center justify-center"
                  style={{ backgroundColor: card.color }}
                >
                  {card.icon}
                </View>
                <View className="flex-row items-center space-x-1">
                  {card.trendIcon}
                  <Typography 
                    variant="body" 
                    className="font-semibold text-sm"
                    style={{ color: card.color }}
                  >
                    {card.trend}
                  </Typography>
                </View>
              </View>
              <Typography variant="h2" className="text-white font-bold mb-2">
                {card.value}
              </Typography>
              <Typography variant="body" className="text-gray-400 font-medium mb-1">
                {card.title}
              </Typography>
              <Typography variant="body-secondary" className="text-sm">
                {card.subtitle}
              </Typography>
            </Pressable>
          ))}
        </View>

        <View className="bg-gray-800 rounded-xl border border-gray-700 mb-6">
          <View className="p-4 border-b border-gray-700">
            <Typography variant="h3" className="text-white font-semibold">
              Mais Vendidos
            </Typography>
            <Typography variant="body-secondary" className="text-xs mt-1">
              Top 3 do período
            </Typography>
          </View>
          <View>
            {topItems.map((item, index) => (
              <Pressable
                key={item.id}
                className={`p-4 ${index !== topItems.length - 1 ? 'border-b border-gray-700' : ''}`}
              >
                <View className="flex-row items-center justify-between">
                                  <View className="flex-row items-center">
                  <View 
                    className="w-10 h-10 rounded-lg items-center justify-center mr-3"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.icon}
                  </View>
                  <View>
                      <Typography variant="body" className="text-white font-medium">
                        {item.name}
                      </Typography>
                      <Typography variant="body-secondary" className="text-sm">
                        {item.quantity}
                      </Typography>
                    </View>
                  </View>
                  <View className="items-end">
                    <Typography variant="body" className="text-green-400 font-semibold">
                      {item.value}
                    </Typography>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        <View className="bg-gray-800 rounded-xl border border-gray-700 p-5 mb-24">
          <View className="items-center">
            <Typography variant="body" className="text-gray-400 mb-2">
              Faturamento Total
            </Typography>
            <Typography variant="h1" className="text-green-400 font-bold mb-1">
              R$ 42.000,00
            </Typography>
            <Typography variant="body-secondary" className="text-sm">
              desde janeiro/2024 • Ticket médio R$ 77,78
            </Typography>
          </View>
        </View>
      </ScrollView>
    </View>
  );
} 