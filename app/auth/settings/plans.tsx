import React, { useState } from "react";
import { View, ScrollView, Pressable, Platform, Alert } from "react-native";
import { router } from "expo-router";
import {
  ArrowLeft,
  CreditCard,
  Crown,
  Check,
  Calendar,
  DollarSign,
  Zap,
  Star,
  Clock,
  AlertCircle,
} from "lucide-react-native";
import Header from "@/components/ui/Header";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";

interface Plan {
  id: string;
  name: string;
  type: "free" | "premium";
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  popular?: boolean;
  current?: boolean;
}

interface CurrentSubscription {
  plan: Plan;
  type: "monthly" | "yearly";
  startDate: string;
  endDate: string;
  status: "active" | "expired" | "cancelled";
}

export default function Plans() {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly");

  const plans: Plan[] = [
    {
      id: "premium",
      name: "Premium",
      type: "premium",
      price: {
        monthly: 19.90,
        yearly: 199.00,
      },
      features: [
        "Pedidos ilimitados",
        "Usuários ilimitados",
        "Relatórios avançados",
        "Suporte prioritário",
        "Integrações avançadas",
        "Backup automático",
      ],
      popular: true,
    },
  ];

  const currentSubscription: CurrentSubscription = {
    plan: {
      id: "free",
      name: "Gratuito",
      type: "free",
      price: {
        monthly: 0,
        yearly: 0,
      },
      features: [],
    },
    type: "monthly",
    startDate: "2024-01-01T00:00:00Z",
    endDate: "2024-12-31T23:59:59Z",
    status: "active",
  };

  const handleBack = () => {
    router.back();
  };

  const handleUpgrade = (plan: Plan) => {
    Alert.alert(
      "Upgrade de Plano",
      `Deseja fazer upgrade para o plano ${plan.name}?\n\nValor: ${formatCurrency(selectedPlan === "monthly" ? plan.price.monthly : plan.price.yearly)}/${selectedPlan === "monthly" ? "mês" : "ano"}`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Fazer Upgrade", style: "default" },
      ]
    );
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      "Cancelar Assinatura",
      "Tem certeza que deseja cancelar sua assinatura? Você perderá acesso aos recursos premium ao final do período atual.",
      [
        { text: "Manter", style: "cancel" },
        { text: "Cancelar", style: "destructive" },
      ]
    );
  };

  const formatCurrency = (amount: number) => {
    if (amount === 0) return "Grátis";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "active":
        return {
          label: "Ativo",
          color: "#10B981",
          bgColor: "#10B98120",
          icon: <Check size={16} color="#10B981" />,
        };
      case "expired":
        return {
          label: "Expirado",
          color: "#EF4444",
          bgColor: "#EF444420",
          icon: <AlertCircle size={16} color="#EF4444" />,
        };
      case "cancelled":
        return {
          label: "Cancelado",
          color: "#6B7280",
          bgColor: "#6B728020",
          icon: <Clock size={16} color="#6B7280" />,
        };
      default:
        return {
          label: "Desconhecido",
          color: "#6B7280",
          bgColor: "#6B728020",
          icon: <AlertCircle size={16} color="#6B7280" />,
        };
    }
  };

  const renderCurrentPlan = () => {
    const statusInfo = getStatusInfo(currentSubscription.status);
    const plan = currentSubscription.plan;

    return (
      <View className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-6">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-3">
            <View className="p-2 rounded-lg bg-blue-900/20">
              <CreditCard size={20} color="#3B82F6" />
            </View>
            <View>
              <Typography variant="h3" className="text-white font-semibold">
                Plano Atual
              </Typography>
              <Typography variant="body-secondary" className="text-gray-400">
                {plan.name}
              </Typography>
            </View>
          </View>
          <View
            className="px-3 py-1 rounded-full flex-row items-center gap-1"
            style={{ backgroundColor: statusInfo.bgColor }}
          >
            {statusInfo.icon}
            <Typography
              variant="caption"
              size="xs"
              style={{ color: statusInfo.color }}
            >
              {statusInfo.label}
            </Typography>
          </View>
        </View>

        <View className="space-y-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Calendar size={16} color="#6b7280" />
              <Typography variant="body-secondary" className="text-gray-400">
                Tipo de Assinatura
              </Typography>
            </View>
            <Typography variant="body" className="text-white font-medium">
              {currentSubscription.type === "monthly" ? "Mensal" : "Anual"}
            </Typography>
          </View>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <DollarSign size={16} color="#6b7280" />
              <Typography variant="body-secondary" className="text-gray-400">
                Valor
              </Typography>
            </View>
            <Typography variant="body" className="text-emerald-500 font-semibold">
              {formatCurrency(
                currentSubscription.type === "monthly"
                  ? plan.price.monthly
                  : plan.price.yearly
              )}
            </Typography>
          </View>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Clock size={16} color="#6b7280" />
              <Typography variant="body-secondary" className="text-gray-400">
                Expira em
              </Typography>
            </View>
            <Typography variant="body" className="text-white font-medium">
              {formatDate(currentSubscription.endDate)}
            </Typography>
          </View>
        </View>

        {currentSubscription.plan.type === "free" && (
          <View className="mt-4 p-3 rounded-lg bg-blue-900/20 border border-blue-700/30">
            <View className="flex-row items-center gap-2 mb-2">
              <Zap size={16} color="#3B82F6" />
              <Typography variant="body" className="text-blue-400 font-medium">
                Upgrade Disponível
              </Typography>
            </View>
            <Typography variant="caption" className="text-blue-300">
              Faça upgrade para o plano Premium e aproveite recursos ilimitados!
            </Typography>
          </View>
        )}
      </View>
    );
  };

  const renderPlanCard = (plan: Plan) => {
    const price = selectedPlan === "monthly" ? plan.price.monthly : plan.price.yearly;
    const savings = selectedPlan === "yearly" && plan.type === "premium" 
      ? (plan.price.monthly * 12) - plan.price.yearly 
      : 0;

    return (
      <View
        key={plan.id}
        className={`bg-gray-800 rounded-xl border p-6 mb-4 ${
          plan.popular
            ? "border-yellow-500/50 bg-gradient-to-br from-gray-800 to-yellow-900/10"
            : "border-gray-700"
        }`}
      >
        {plan.popular && (
          <View className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <View className="bg-yellow-500 px-3 py-1 rounded-full">
              <Typography variant="caption" size="xs" className="text-yellow-900 font-bold">
                MAIS POPULAR
              </Typography>
            </View>
          </View>
        )}

        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-3">
            <View className={`p-2 rounded-lg ${
              plan.type === "premium" ? "bg-yellow-900/20" : "bg-gray-700"
            }`}>
              {plan.type === "premium" ? (
                <Crown size={20} color="#F59E0B" />
              ) : (
                <Star size={20} color="#6b7280" />
              )}
            </View>
            <View>
              <Typography variant="h3" className="text-white font-semibold">
                {plan.name}
              </Typography>
              <Typography variant="body-secondary" className="text-gray-400">
                {plan.type === "premium" ? "Recursos completos" : "Recursos básicos"}
              </Typography>
            </View>
          </View>
        </View>

        <View className="mb-6">
          <View className="flex-row items-baseline gap-2 mb-1">
            <Typography variant="h2" className="text-white font-bold">
              {formatCurrency(price)}
            </Typography>
            <Typography variant="body-secondary" className="text-gray-400">
              /{selectedPlan === "monthly" ? "mês" : "ano"}
            </Typography>
          </View>
          
          {savings > 0 && (
            <View className="flex-row items-center gap-1">
              <Typography variant="caption" className="text-emerald-400">
                Economia de {formatCurrency(savings)} por ano
              </Typography>
            </View>
          )}
        </View>

        <View className="space-y-3 mb-6">
          {plan.features.map((feature, index) => (
            <View key={index} className="flex-row items-center gap-3">
              <View className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Check size={12} color="#10B981" />
              </View>
              <Typography variant="body-secondary" className="text-gray-300 flex-1">
                {feature}
              </Typography>
            </View>
          ))}
        </View>

        <Button
          title="Fazer Upgrade"
          onPress={() => handleUpgrade(plan)}
          className="w-full"
        />
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-900">
      <Header
        title="Planos e Assinatura"
        leftIcon={
          <Pressable
            onPress={handleBack}
            className="p-1.5 rounded-lg hover:bg-gray-700"
          >
            <ArrowLeft size={20} color="#F3F5F7" />
          </Pressable>
        }
      />

      <ScrollView
        className={`flex-1 px-6 mb-6 ${Platform.OS === "ios" ? "pt-6" : "pt-4"}`}
        showsVerticalScrollIndicator={false}
      >
        {/* Plano Atual */}
        {renderCurrentPlan()}

        {/* Seletor de Período */}
        <View className="bg-gray-800 rounded-xl border border-gray-700 p-4 mb-6">
          <Typography variant="h3" className="text-white font-semibold mb-3">
            Escolha o Período
          </Typography>
          <View className="flex-row gap-2">
            <Pressable
              onPress={() => setSelectedPlan("monthly")}
              className={`flex-1 py-3 px-4 rounded-lg border ${
                selectedPlan === "monthly"
                  ? "bg-blue-900/20 border-blue-700/30"
                  : "bg-gray-700 border-gray-600"
              }`}
            >
              <Typography
                variant="body"
                className={`text-center font-medium ${
                  selectedPlan === "monthly" ? "text-blue-400" : "text-white"
                }`}
              >
                Mensal
              </Typography>
            </Pressable>
            <Pressable
              onPress={() => setSelectedPlan("yearly")}
              className={`flex-1 py-3 px-4 rounded-lg border ${
                selectedPlan === "yearly"
                  ? "bg-blue-900/20 border-blue-700/30"
                  : "bg-gray-700 border-gray-600"
              }`}
            >
              <Typography
                variant="body"
                className={`text-center font-medium ${
                  selectedPlan === "yearly" ? "text-blue-400" : "text-white"
                }`}
              >
                Anual
              </Typography>
            </Pressable>
          </View>
        </View>

        {/* Planos Disponíveis */}
        <View className="mb-6">
          <Typography variant="h3" className="text-white font-semibold mb-4">
            Planos Disponíveis
          </Typography>
          {plans.map(renderPlanCard)}
        </View>
      </ScrollView>
    </View>
  );
} 