import React, { useState } from "react";
import { View, Pressable, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Typography from "@/components/ui/Typography";
import {
  Users,
  User,
  Mail,
  Shield,
  UserCheck,
  Key,
} from "lucide-react-native";

interface Account {
  id: string;
  name: string;
  email: string;
  password: string;
  accessLevel: "admin" | "manager" | "user";
  status: "active" | "inactive";
  lastAccess?: string;
}

interface NewAccountProps {
  visible: boolean;
  onClose: () => void;
  onSave: (account: Omit<Account, "id" | "status" | "lastAccess">) => void;
  loading?: boolean;
}

export default function NewAccount({
  visible,
  onClose,
  onSave,
  loading = false,
}: NewAccountProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    accessLevel: "user" as "admin" | "manager" | "user",
  });

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.password) {
      return;
    }

    const newAccount = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      accessLevel: formData.accessLevel,
    };

    onSave(newAccount);

    // Limpar formulário
    setFormData({
      name: "",
      email: "",
      password: "",
      accessLevel: "user",
    });
  };

  const handleClose = () => {
    // Limpar formulário ao fechar
    setFormData({
      name: "",
      email: "",
      password: "",
      accessLevel: "user",
    });
    onClose();
  };

  const accessLevelOptions = [
    { value: "user", label: "Usuário", icon: <User size={16} color="#10B981" /> },
    { value: "manager", label: "Gerente", icon: <UserCheck size={16} color="#3B82F6" /> },
    { value: "admin", label: "Administrador", icon: <Shield size={16} color="#F59E0B" /> },
  ];

  return (
    <Modal
      visible={visible}
      onClose={handleClose}
      title="Nova Conta"
      icon={<Users size={24} color="#3B82F6" />}
      saved={!loading}
      height={0.65}
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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-4">
            <Input
              label="Nome Completo"
              placeholder="Digite o nome completo"
              value={formData.name}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, name: text }))
              }
              leftIcon={<User size={20} color="#6b7280" />}
            />

            <Input
              label="Email"
              placeholder="usuario@empresa.com"
              value={formData.email}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, email: text }))
              }
              leftIcon={<Mail size={20} color="#6b7280" />}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Senha"
              placeholder="Digite a senha"
              value={formData.password}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, password: text }))
              }
              secureTextEntry
            />

            {/* Nível de Acesso */}
            <View>
              <View className="flex-row items-center gap-2 mb-3">
                <Shield size={20} color="#6b7280" />
                <Typography variant="body" className="text-white font-medium">
                  Nível de Acesso
                </Typography>
              </View>
              <View className="gap-2">
                {accessLevelOptions.map((option) => (
                  <Pressable
                    key={option.value}
                    onPress={() =>
                      setFormData((prev) => ({ ...prev, accessLevel: option.value as any }))
                    }
                    className={`flex-row items-center gap-3 p-3 rounded-lg border ${
                      formData.accessLevel === option.value
                        ? "bg-blue-900/20 border-blue-700/30"
                        : "bg-gray-700 border-gray-600"
                    }`}
                  >
                    {option.icon}
                    <Typography
                      variant="body"
                      className={`font-medium ${
                        formData.accessLevel === option.value
                          ? "text-blue-400"
                          : "text-white"
                      }`}
                    >
                      {option.label}
                    </Typography>
                    {formData.accessLevel === option.value && (
                      <View className="ml-auto w-2 h-2 rounded-full bg-blue-400" />
                    )}
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
} 