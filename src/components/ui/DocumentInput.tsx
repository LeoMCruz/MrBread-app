import React, { useState } from "react";
import {
  View,
  Pressable,
  Text,
} from "react-native";
import MaskInput from "react-native-mask-input";
import clsx from "clsx";
import { FileText } from "lucide-react-native";

interface DocumentInputProps {
  value: string;
  onChangeText: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
}

type DocumentType = "cnpj" | "cpf";

export default function DocumentInput({
  value,
  onChangeText,
  onBlur,
  placeholder,
  error,
  leftIcon = <FileText size={20} color="#6b7280" />,
  disabled = false,
  className,
  containerClassName,
  labelClassName,
  errorClassName,
}: DocumentInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [documentType, setDocumentType] = useState<DocumentType>("cnpj");

  const getMask = (type: DocumentType) => {
    switch (type) {
      case "cnpj":
        return [
          /\d/,
          /\d/,
          ".",
          /\d/,
          /\d/,
          /\d/,
          ".",
          /\d/,
          /\d/,
          /\d/,
          "/",
          /\d/,
          /\d/,
          /\d/,
          /\d/,
          "-",
          /\d/,
          /\d/,
        ];
      case "cpf":
        return [
          /\d/,
          /\d/,
          /\d/,
          ".",
          /\d/,
          /\d/,
          /\d/,
          ".",
          /\d/,
          /\d/,
          /\d/,
          "-",
          /\d/,
          /\d/,
        ];
      default:
        return [];
    }
  };

  const getPlaceholder = (type: DocumentType) => {
    switch (type) {
      case "cnpj":
        return "00.000.000/0000-00";
      case "cpf":
        return "000.000.000-00";
      default:
        return placeholder;
    }
  };

  const handleDocumentTypeChange = (type: DocumentType) => {
    setDocumentType(type);
    // Limpar o valor quando trocar o tipo
    onChangeText("");
  };

  const containerClass = clsx(
    "flex-col",
    containerClassName
  );

  const labelClass = clsx(
    "text-sm font-medium mb-2",
    error ? "text-red-500" : "text-white",
    labelClassName
  );

  const inputContainerClass = clsx(
    "flex-row items-center rounded-xl border-2 h-12 px-4",
    {
      "bg-gray-800 border-gray-600": !disabled,
      "bg-gray-900 border-gray-700": disabled,
    },
    {
      "border-blue-500 bg-gray-900": isFocused && !error,
      "border-red-500 bg-red-900/20": error,
    }
  );

  const inputClass = clsx(
    "flex-1 text-white text-base",
    {
      "pl-12": leftIcon,
      "pl-0": !leftIcon,
    },
    className
  );

  const errorClass = clsx("text-sm text-red-500 mt-1", errorClassName);

  const iconClass = clsx("absolute z-10 left-3");

  return (
    <View className={containerClass}>
      <View className="flex-row items-center mb-2">
        <Pressable
          onPress={() => handleDocumentTypeChange("cnpj")}
          disabled={disabled}
        >
          <Text className={clsx(
            labelClass,
            documentType === "cnpj" ? "text-blue-400" : "text-gray-500"
          )}>
            CNPJ
          </Text>
        </Pressable>
        
        <Text className={clsx(labelClass, "mx-2 text-gray-500")}>
          |
        </Text>
        
        <Pressable
          onPress={() => handleDocumentTypeChange("cpf")}
          disabled={disabled}
        >
          <Text className={clsx(
            labelClass,
            documentType === "cpf" ? "text-blue-400" : "text-gray-500"
          )}>
            CPF
          </Text>
        </Pressable>
      </View>

      {/* Input com máscara */}
      <View className={inputContainerClass}>
        {leftIcon && (
          <View className={iconClass}>{leftIcon}</View>
        )}

        <MaskInput
          className={inputClass}
          placeholderTextColor="#6b7280"
          placeholder={getPlaceholder(documentType)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          mask={getMask(documentType)}
          keyboardType="numeric"
          value={value}
          onChangeText={(text: string, rawText: string) => {
            onChangeText(text);
          }}
          editable={!disabled}
        />
      </View>

      {error && <Text className={errorClass}>{error}</Text>}
    </View>
  );
} 