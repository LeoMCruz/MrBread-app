import React, { useState } from "react";
import { View, ScrollView, Pressable, Platform, Alert, FlatList } from "react-native";
import { router } from "expo-router";
import {
  ArrowLeft,
  Users,
  Plus,
  Trash2,
  Mail,
  User,
  Shield,
  UserCheck,
  UserX,
} from "lucide-react-native";
import Header from "@/components/ui/Header";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import NewAccount from "@/components/ui/modals/NewAccount";

interface Account {
  id: string;
  name: string;
  email: string;
  password?: string;
  accessLevel: "admin" | "manager" | "user";
  status: "active" | "inactive";
  lastAccess?: string;
}

export default function AccountsSettings() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: "1",
      name: "João Silva",
      email: "joao@empresaabc.com",
      accessLevel: "admin",
      status: "active",
      lastAccess: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      name: "Maria Santos",
      email: "maria@empresaabc.com",
      accessLevel: "admin",
      status: "active",
      lastAccess: "2024-01-14T15:20:00Z",
    },
    {
      id: "3",
      name: "Pedro Costa",
      email: "pedro@empresaabc.com",
      accessLevel: "manager",
      status: "active",
      lastAccess: "2024-01-13T09:45:00Z",
    },
    {
      id: "4",
      name: "Ana Oliveira",
      email: "ana@empresaabc.com",
      accessLevel: "user",
      status: "inactive",
      lastAccess: "2024-01-10T14:15:00Z",
    },
  ]);

  const handleBack = () => {
    router.back();
  };

  const handleAddAccount = () => {
    setIsModalVisible(true);
  };

  const handleSaveAccount = async (accountData: { name: string; email: string; password: string; accessLevel: "admin" | "manager" | "user" }) => {
    setIsLoading(true);

    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newAccount: Account = {
      id: Date.now().toString(),
      name: accountData.name,
      email: accountData.email,
      password: accountData.password,
      accessLevel: accountData.accessLevel,
      status: "active",
      lastAccess: new Date().toISOString(),
    };

    setAccounts((prev) => [newAccount, ...prev]);
    setIsLoading(false);
  };

  const handleDeleteAccount = (account: Account) => {
    Alert.alert(
      "Excluir Conta",
      `Tem certeza que deseja excluir a conta de ${account.name}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            setAccounts((prev) => prev.filter((a) => a.id !== account.id));
          },
        },
      ]
    );
  };

  const getAccessLevelInfo = (level: string) => {
    switch (level) {
      case "admin":
        return {
          label: "Administrador",
          color: "#F59E0B",
          icon: <Shield size={16} color="#F59E0B" />,
        };
      case "manager":
        return {
          label: "Gerente",
          color: "#3B82F6",
          icon: <UserCheck size={16} color="#3B82F6" />,
        };
      case "user":
        return {
          label: "Usuário",
          color: "#10B981",
          icon: <User size={16} color="#10B981" />,
        };
      default:
        return {
          label: "Desconhecido",
          color: "#6B7280",
          icon: <UserX size={16} color="#6B7280" />,
        };
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "active":
        return {
          label: "Ativo",
          color: "#10B981",
          bgColor: "#10B98120",
        };
      case "inactive":
        return {
          label: "Inativo",
          color: "#6B7280",
          bgColor: "#6B728020",
        };
      default:
        return {
          label: "Desconhecido",
          color: "#6B7280",
          bgColor: "#6B728020",
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderAccountItem = ({ item }: { item: Account }) => {
    const accessInfo = getAccessLevelInfo(item.accessLevel);
    const statusInfo = getStatusInfo(item.status);

    return (
      <View className="bg-gray-800 rounded-xl p-4 mb-3 border border-gray-700">
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <View className="flex-row items-center gap-2 mb-2">
              <Typography variant="h3" className="text-white">
                {item.name}
              </Typography>
              {accessInfo.icon}
            </View>
            
            <View className="flex-row items-center gap-2 mb-2">
              <Mail size={14} color="#6b7280" />
              <Typography variant="body-secondary" className="text-sm">
                {item.email}
              </Typography>
            </View>

            <View className="flex-row items-center gap-3">
              <View
                className="px-2 py-1 rounded-full"
                style={{ backgroundColor: accessInfo.color + "20" }}
              >
                <Typography
                  variant="caption"
                  size="xs"
                  style={{ color: accessInfo.color }}
                >
                  {accessInfo.label}
                </Typography>
              </View>

              <View
                className="px-2 py-1 rounded-full"
                style={{ backgroundColor: statusInfo.bgColor }}
              >
                <Typography
                  variant="caption"
                  size="xs"
                  style={{ color: statusInfo.color }}
                >
                  {statusInfo.label}
                </Typography>
              </View>
            </View>

            {item.lastAccess && (
              <Typography variant="caption" className="text-gray-500 mt-2">
                Último acesso: {formatDate(item.lastAccess)}
              </Typography>
            )}
          </View>

          <Pressable
            onPress={() => handleDeleteAccount(item)}
          >
            <Trash2 size={16} color="#EF4444" />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-900">
      <Header
        title="Gerenciar Contas"
        leftIcon={
          <Pressable
            onPress={handleBack}
            className="p-1.5 rounded-lg hover:bg-gray-700"
          >
            <ArrowLeft size={20} color="#F3F5F7" />
          </Pressable>
        }
      />

      <View
        className={`flex-1 px-6 ${Platform.OS === "ios" ? "pt-6" : "pt-4"}`}
      >
        {/* Informações */}
        <View className="bg-gray-800 rounded-xl border border-gray-700 p-4 mb-6">
          <View className="flex-row items-center gap-3 mb-3">
            <Users size={20} color="#3B82F6" />
            <Typography variant="h3" className="text-white font-semibold">
              Contas da Organização
            </Typography>
          </View>
          <Typography variant="body-secondary" className="text-gray-400">
            Gerencie as contas de usuários que têm acesso ao sistema da sua empresa.
          </Typography>
        </View>

        {/* Botão Adicionar */}
        <View className="mb-6">
          <Button
            title="Adicionar Nova Conta"
            leftIcon={<Plus size={16} color="#ffffff" />}
            onPress={handleAddAccount}
            variant="primary"
            fullWidth
          />
        </View>

        {/* Lista de Contas */}
        <View className="flex-1 mb-6">
          {accounts.length === 0 ? (
            <View className="flex-1 justify-center items-center">
              <Users size={48} color="#6b7280" />
              <Typography variant="h3" className="text-gray-400 mt-4 mb-2">
                Nenhuma conta encontrada
              </Typography>
              <Typography variant="body-secondary" className="text-center">
                Adicione a primeira conta da sua organização
              </Typography>
              <Button
                title="Adicionar Conta"
                onPress={handleAddAccount}
                className="mt-4"
              />
            </View>
          ) : (
            <FlatList
              data={accounts}
              renderItem={renderAccountItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </View>
      </View>

      {/* Modal Adicionar Conta */}
      <NewAccount
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSaveAccount}
        loading={isLoading}
      />
    </View>
  );
} 