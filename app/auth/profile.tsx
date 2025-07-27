import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useState } from 'react';
import clsx from 'clsx';

export default function Profile() {
  const [name, setName] = useState('João Silva');
  const [email, setEmail] = useState('joao@email.com');
  const [phone, setPhone] = useState('(11) 99999-9999');
  const [isEditing, setIsEditing] = useState(false);
  const isDarkMode = false;

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <ScrollView className={clsx(
      "flex-1",
      isDarkMode ? "bg-gray-900" : "bg-white"
    )}>
      <View className="px-6 py-8">
        <Text className={clsx(
          "text-2xl font-bold mb-8",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          Meu Perfil
        </Text>

        <View className="space-y-6">
          <View className="items-center mb-8">
            <View className={clsx(
              "w-24 h-24 rounded-full items-center justify-center mb-4",
              isDarkMode ? "bg-gray-700" : "bg-gray-200"
            )}>
              <Text className={clsx(
                "text-3xl font-bold",
                isDarkMode ? "text-white" : "text-gray-600"
              )}>
                {name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-lg">
              <Text className="text-white font-semibold">
                Alterar Foto
              </Text>
            </TouchableOpacity>
          </View>

          <View className="space-y-4">
            <Text className={clsx(
              "text-lg font-semibold",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              Informações Pessoais
            </Text>

            <View>
              <Text className={clsx(
                "text-sm font-medium mb-2",
                isDarkMode ? "text-gray-300" : "text-gray-700"
              )}>
                Nome Completo
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                editable={isEditing}
                className={clsx(
                  "p-4 border rounded-lg text-base",
                  isDarkMode 
                    ? "bg-gray-800 border-gray-600 text-white" 
                    : "bg-white border-gray-300 text-gray-900",
                  !isEditing && "bg-gray-100"
                )}
              />
            </View>

            <View>
              <Text className={clsx(
                "text-sm font-medium mb-2",
                isDarkMode ? "text-gray-300" : "text-gray-700"
              )}>
                Email
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                editable={isEditing}
                keyboardType="email-address"
                autoCapitalize="none"
                className={clsx(
                  "p-4 border rounded-lg text-base",
                  isDarkMode 
                    ? "bg-gray-800 border-gray-600 text-white" 
                    : "bg-white border-gray-300 text-gray-900",
                  !isEditing && "bg-gray-100"
                )}
              />
            </View>

            <View>
              <Text className={clsx(
                "text-sm font-medium mb-2",
                isDarkMode ? "text-gray-300" : "text-gray-700"
              )}>
                Telefone
              </Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                editable={isEditing}
                keyboardType="phone-pad"
                className={clsx(
                  "p-4 border rounded-lg text-base",
                  isDarkMode 
                    ? "bg-gray-800 border-gray-600 text-white" 
                    : "bg-white border-gray-300 text-gray-900",
                  !isEditing && "bg-gray-100"
                )}
              />
            </View>
          </View>

          <View className="space-y-4 mt-8">
            {isEditing ? (
              <View className="flex-row space-x-4">
                <TouchableOpacity
                  onPress={() => setIsEditing(false)}
                  className="flex-1 p-4 border border-gray-300 rounded-lg"
                >
                  <Text className="text-gray-700 font-semibold text-center">
                    Cancelar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSave}
                  className="flex-1 p-4 bg-blue-500 rounded-lg"
                >
                  <Text className="text-white font-semibold text-center">
                    Salvar
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                className={clsx(
                  "p-4 rounded-lg",
                  isDarkMode ? "bg-blue-600" : "bg-blue-500"
                )}
              >
                <Text className="text-white font-semibold text-center">
                  Editar Perfil
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
} 