import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={{
          title: 'Início',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="products"
        options={{
          title: 'Produtos',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="services"
        options={{
          title: 'Serviços',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="customers"
        options={{
          title: 'Clientes',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="new-customer"
        options={{
          title: 'Novo Cliente',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="new-order"
        options={{
          title: 'Novo Pedido',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="orders"
        options={{
          title: 'Pedidos',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: 'Perfil',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: 'Configurações',
          headerShown: true,
        }}
      />
    </Stack>
  );
} 