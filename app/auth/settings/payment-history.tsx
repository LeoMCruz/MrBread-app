import React, { useState } from "react";
import { View, ScrollView, Pressable, Platform, Alert, FlatList } from "react-native";
import { router } from "expo-router";
import {
  ArrowLeft,
  FileText,
  Download,
  Eye,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  Filter,
} from "lucide-react-native";
import Header from "@/components/ui/Header";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";

interface PaymentHistory {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  dueDate: string;
  paymentDate?: string;
  description: string;
  plan: string;
}

export default function PaymentHistory() {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "paid" | "pending" | "overdue">("all");

  const [payments, setPayments] = useState<PaymentHistory[]>([
    {
      id: "1",
      invoiceNumber: "INV-2024-001",
      amount: 99.90,
      status: "paid",
      dueDate: "2024-01-15T00:00:00Z",
      paymentDate: "2024-01-14T10:30:00Z",
      description: "Plano Premium - Janeiro 2024",
      plan: "Premium",
    },
    {
      id: "2",
      invoiceNumber: "INV-2024-002",
      amount: 99.90,
      status: "paid",
      dueDate: "2024-02-15T00:00:00Z",
      paymentDate: "2024-02-13T14:20:00Z",
      description: "Plano Premium - Fevereiro 2024",
      plan: "Premium",
    },
    {
      id: "3",
      invoiceNumber: "INV-2024-003",
      amount: 99.90,
      status: "pending",
      dueDate: "2024-03-15T00:00:00Z",
      description: "Plano Premium - Março 2024",
      plan: "Premium",
    },
    {
      id: "4",
      invoiceNumber: "INV-2024-004",
      amount: 149.90,
      status: "overdue",
      dueDate: "2024-02-28T00:00:00Z",
      description: "Upgrade para Plano Enterprise",
      plan: "Enterprise",
    },
    {
      id: "5",
      invoiceNumber: "INV-2024-005",
      amount: 49.90,
      status: "paid",
      dueDate: "2024-01-10T00:00:00Z",
      paymentDate: "2024-01-09T09:15:00Z",
      description: "Plano Básico - Janeiro 2024",
      plan: "Básico",
    },
  ]);

  const handleBack = () => {
    router.back();
  };

  const handleViewInvoice = (payment: PaymentHistory) => {
    Alert.alert(
      "Detalhes da Fatura",
      `Fatura: ${payment.invoiceNumber}\nValor: R$ ${payment.amount.toFixed(2)}\nStatus: ${getStatusInfo(payment.status).label}\nVencimento: ${formatDate(payment.dueDate)}`,
      [{ text: "OK", style: "default" }]
    );
  };

  const handleDownloadInvoice = (payment: PaymentHistory) => {
    Alert.alert(
      "Download",
      `Baixando fatura ${payment.invoiceNumber}...`,
      [{ text: "OK", style: "default" }]
    );
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "paid":
        return {
          label: "Pago",
          color: "#10B981",
          bgColor: "#10B98120",
          icon: <CheckCircle size={16} color="#10B981" />,
        };
      case "pending":
        return {
          label: "Pendente",
          color: "#F59E0B",
          bgColor: "#F59E0B20",
          icon: <Clock size={16} color="#F59E0B" />,
        };
      case "overdue":
        return {
          label: "Vencido",
          color: "#EF4444",
          bgColor: "#EF444420",
          icon: <XCircle size={16} color="#EF4444" />,
        };
      default:
        return {
          label: "Desconhecido",
          color: "#6B7280",
          bgColor: "#6B728020",
          icon: <XCircle size={16} color="#6B7280" />,
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  const filteredPayments = payments.filter((payment) => {
    if (selectedFilter === "all") return true;
    return payment.status === selectedFilter;
  });

  const filterOptions = [
    { value: "all", label: "Todos", icon: <FileText size={16} color="#6b7280" /> },
    { value: "paid", label: "Pagos", icon: <CheckCircle size={16} color="#10B981" /> },
    { value: "pending", label: "Pendentes", icon: <Clock size={16} color="#F59E0B" /> },
    { value: "overdue", label: "Vencidos", icon: <XCircle size={16} color="#EF4444" /> },
  ];

  const renderPaymentItem = ({ item }: { item: PaymentHistory }) => {
    const statusInfo = getStatusInfo(item.status);

    return (
      <View className="bg-gray-800 rounded-xl p-4 mb-3 border border-gray-700">
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <View className="flex-row items-center gap-2 mb-2">
              <Typography variant="h3" className="text-white">
                {item.invoiceNumber}
              </Typography>
              {statusInfo.icon}
            </View>
            
            <Typography variant="body-secondary" className="text-gray-400 mb-2">
              {item.description}
            </Typography>

            <View className="flex-row items-center gap-3 mb-2">
              <View className="flex-row items-center gap-1">
                <DollarSign size={14} color="#10B981" />
                <Typography variant="body" className="text-emerald-500 font-semibold">
                  {formatCurrency(item.amount)}
                </Typography>
              </View>
              
              <View className="flex-row items-center gap-1">
                <Calendar size={14} color="#6b7280" />
                <Typography variant="caption" className="text-gray-400">
                  Venc: {formatDate(item.dueDate)}
                </Typography>
              </View>
            </View>

            <View className="flex-row items-center gap-3">
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

              <View className="px-2 py-1 rounded-full bg-blue-900/20">
                <Typography variant="caption" size="xs" className="text-blue-400">
                  {item.plan}
                </Typography>
              </View>
            </View>

            {item.paymentDate && (
              <Typography variant="caption" className="text-gray-500 mt-2">
                Pago em: {formatDate(item.paymentDate)}
              </Typography>
            )}
          </View>

          <View className="flex-row gap-2">
            <Pressable
              onPress={() => handleViewInvoice(item)}
              className="p-2 rounded-lg bg-blue-900/20 border border-blue-700/30"
            >
              <Eye size={16} color="#3B82F6" />
            </Pressable>
            <Pressable
              onPress={() => handleDownloadInvoice(item)}
              className="p-2 rounded-lg bg-green-900/20 border border-green-700/30"
            >
              <Download size={16} color="#10B981" />
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-900">
      <Header
        title="Histórico de Pagamentos"
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
            <FileText size={20} color="#10B981" />
            <Typography variant="h3" className="text-white font-semibold">
              Faturas e Recibos
            </Typography>
          </View>
          <Typography variant="body-secondary" className="text-gray-400">
            Visualize e baixe todas as suas faturas e recibos de pagamento.
          </Typography>
        </View>

        {/* Filtros */}
        <View className="mb-6">
          <View className="flex-row items-center gap-2 mb-3">
            <Filter size={16} color="#6b7280" />
            <Typography variant="body" className="text-white font-medium">
              Filtrar por Status
            </Typography>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {filterOptions.map((option) => (
                <Pressable
                  key={option.value}
                  onPress={() => setSelectedFilter(option.value as any)}
                  className={`flex-row items-center gap-2 px-3 py-2 rounded-lg border ${
                    selectedFilter === option.value
                      ? "bg-blue-900/20 border-blue-700/30"
                      : "bg-gray-700 border-gray-600"
                  }`}
                >
                  {option.icon}
                  <Typography
                    variant="caption"
                    className={`font-medium ${
                      selectedFilter === option.value
                        ? "text-blue-400"
                        : "text-white"
                    }`}
                  >
                    {option.label}
                  </Typography>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Lista de Pagamentos */}
        <View className="flex-1">
          {filteredPayments.length === 0 ? (
            <View className="flex-1 justify-center items-center">
              <FileText size={48} color="#6b7280" />
              <Typography variant="h3" className="text-gray-400 mt-4 mb-2">
                Nenhum pagamento encontrado
              </Typography>
              <Typography variant="body-secondary" className="text-center">
                Não há faturas para o filtro selecionado
              </Typography>
            </View>
          ) : (
            <FlatList
              data={filteredPayments}
              renderItem={renderPaymentItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </View>
      </View>
    </View>
  );
} 