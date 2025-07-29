import React, { useState } from "react";
import { View, ScrollView, Pressable, Platform, Alert } from "react-native";
import { router } from "expo-router";
import {
  ChevronDown,
  ChevronRight,
  User,
  Building,
  CreditCard,
  Settings as SettingsIcon,
  Shield,
  LogOut,
  Bell,
  Palette,
  FileText,
  Users,
  Key,
  ArrowLeft,
  Trash2,
} from "lucide-react-native";
import Header from "@/components/ui/Header";
import Typography from "@/components/ui/Typography";
import { useAuthStore } from "@/stores/authStore";

interface ConfigSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  items: ConfigItem[];
}

interface ConfigItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  onPress?: () => void;
}

export default function Settings() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const { logout, clearSavedCredentials, savedCredentials } = useAuthStore();

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const handleLogout = () => {
    Alert.alert(
      "Sair",
      "Tem certeza que deseja sair da sua conta?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sair",
          style: "destructive",
          onPress: () => {
            logout();
            router.replace('/public/login');
          },
        },
      ]
    );
  };

  const configSections: ConfigSection[] = [
    {
      id: "perfil",
      title: "Perfil",
      icon: <User size={20} color="#3B82F6" />,
      color: "#3B82F6",
      items: [
        {
          id: "dados-pessoais",
          title: "Dados Pessoais",
          subtitle: "Nome, email, telefone",
          icon: <User size={16} color="#ffffff" />,
          color: "#3B82F6",
          onPress: () => console.log("Dados Pessoais"),
        },
        {
          id: "alterar-senha",
          title: "Alterar Senha",
          subtitle: "Segurança da conta",
          icon: <Key size={16} color="#ffffff" />,
          color: "#10B981",
          onPress: () => console.log("Alterar Senha"),
        },
        {
          id: "privacidade",
          title: "Privacidade",
          subtitle: "Configurações de privacidade",
          icon: <Shield size={16} color="#ffffff" />,
          color: "#8B5CF6",
          onPress: () => console.log("Privacidade"),
        },
      ],
    },
    {
      id: "organizacao",
      title: "Organização",
      icon: <Building size={20} color="#10B981" />,
      color: "#10B981",
      items: [
        {
          id: "dados-empresa",
          title: "Dados da Empresa",
          subtitle: "Razão social, CNPJ",
          icon: <Building size={16} color="#ffffff" />,
          color: "#3B82F6",
          onPress: () => console.log("Dados da Empresa"),
        },
        {
          id: "contas",
          title: "Contas",
          subtitle: "Gerenciar contas da organização",
          icon: <Users size={16} color="#ffffff" />,
          color: "#F59E0B",
          onPress: () => console.log("Contas"),
        },
        {
          id: "preferencias",
          title: "Preferências",
          subtitle: "Configurações gerais",
          icon: <SettingsIcon size={16} color="#ffffff" />,
          color: "#10B981",
          onPress: () => console.log("Preferências"),
        },
      ],
    },
    {
      id: "pagamento",
      title: "Pagamento",
      icon: <CreditCard size={20} color="#F59E0B" />,
      color: "#F59E0B",
      items: [
        {
          id: "planos",
          title: "Planos e Assinatura",
          subtitle: "Gerenciar plano atual",
          icon: <CreditCard size={16} color="#ffffff" />,
          color: "#8B5CF6",
          onPress: () => console.log("Planos e Assinatura"),
        },
        {
          id: "historico",
          title: "Histórico de Pagamentos",
          subtitle: "Faturas e recibos",
          icon: <FileText size={16} color="#ffffff" />,
          color: "#10B981",
          onPress: () => console.log("Histórico de Pagamentos"),
        },
      ],
    },
    {
      id: "sistema",
      title: "Sistema",
      icon: <SettingsIcon size={20} color="#EF4444" />,
      color: "#EF4444",
      items: [
        {
          id: "notificacoes",
          title: "Notificações",
          subtitle: "Configurar alertas",
          icon: <Bell size={16} color="#ffffff" />,
          color: "#3B82F6",
          onPress: () => console.log("Notificações"),
        },
        {
          id: "tema",
          title: "Tema",
          subtitle: "Claro ou escuro",
          icon: <Palette size={16} color="#ffffff" />,
          color: "#F59E0B",
          onPress: () => console.log("Tema"),
        },
        {
          id: "sair",
          title: "Sair",
          subtitle: "Fazer logout",
          icon: <LogOut size={16} color="#ffffff" />,
          color: "#EF4444",
          onPress: handleLogout,
        },
      ],
    },
  ];

  return (
    <View className="flex-1 bg-gray-900 ">
      <Header
        title="Configurações"
        leftIcon={
          <Pressable
            onPress={() => router.back()}
            className="p-1.5 rounded-lg hover:bg-gray-700"
          >
            <ArrowLeft size={20} color="#F3F5F7" />
          </Pressable>
        }
      />

      <ScrollView
        className={`flex-1 px-6 mb-6 ${
          Platform.OS === "ios" ? "pt-6" : "pt-4"
        }`}
      >
        <View className="space-y-4">
          {configSections.map((section) => (
            <View
              key={section.id}
              className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden mb-4"
            >
              <Pressable
                onPress={() => toggleSection(section.id)}
                className="w-full p-4 transition-colors hover:bg-gray-700"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    {section.icon}
                    <Typography
                      variant="h3"
                      size="base"
                      className="text-white font-semibold"
                    >
                      {section.title}
                    </Typography>
                  </View>
                  {expandedSection === section.id ? (
                    <ChevronDown size={20} color="#9ca3af" />
                  ) : (
                    <ChevronRight size={20} color="#9ca3af" />
                  )}
                </View>
              </Pressable>

              {expandedSection === section.id && (
                <View className="px-4 pb-4 space-y-2">
                  {section.items.map((item) => (
                    <Pressable
                      key={item.id}
                      onPress={item.onPress}
                      className="w-full bg-gray-700 hover:bg-gray-600 rounded-lg p-3 transition-colors mb-2"
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-3 p-2">
                          <View
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: item.color }}
                          >
                            {item.icon}
                          </View>
                          <View className="flex-1">
                            <Typography
                              variant="body"
                              size="sm"
                              className="text-white font-medium"
                            >
                              {item.title}
                            </Typography>
                            <Typography
                              variant="caption"
                              size="xs"
                              className="text-gray-400"
                            >
                              {item.subtitle}
                            </Typography>
                          </View>
                          <ChevronRight size={16} color="#9ca3af" />
                        </View>
                      </View>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
