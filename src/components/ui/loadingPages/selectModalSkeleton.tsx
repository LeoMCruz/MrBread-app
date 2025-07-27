import React from "react";
import { View, ScrollView } from "react-native";
import Skeleton from "../Skeleton";

interface SelectModalSkeletonProps {
  itemCount?: number;
}

export default function SelectModalSkeleton({ itemCount = 7 }: SelectModalSkeletonProps) {
  const items = Array.from({ length: itemCount }, (_, index) => index);

  return (
    <View className="flex-1 bg-gray-900/50">
      <View className="flex-1 justify-center items-center px-6">
        <View className="bg-gray-800 rounded-xl w-full max-w-md border border-gray-600">
          <View className="p-4 border-b border-gray-600">
            <View className="flex-row items-center gap-3 mb-2">
              <Skeleton width={24} height={24} rounded={true} />
              <Skeleton width={150} height={24} rounded={false} />
            </View>
            <Skeleton width={200} height={16} rounded={false} />
          </View>

          <View className="p-4">
            <View className="mb-4">
              <Skeleton width="100%" height={48} rounded={true} />
            </View>

            <ScrollView className="flex-1 max-h-80">
              <View className="space-y-2">
                {items.map((index) => (
                  <View key={index} className="bg-gray-700 rounded-lg p-3 border border-gray-600">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1">
                        <View className="flex-row items-center gap-2 mb-1">
                          <Skeleton width={16} height={16} rounded={true} />
                          <Skeleton width="70%" height={18} rounded={false} />
                        </View>
                        <Skeleton width="60%" height={14} rounded={false} className="ml-6" />
                      </View>
                      <View className="items-end">
                        <Skeleton width={80} height={16} rounded={false} />
                        <Skeleton width={60} height={12} rounded={false} />
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>

            <View className="mt-4 pt-4 border-t border-gray-600">
              <View className="bg-blue-900/20 border border-blue-500 rounded-lg p-3 mb-4">
                <Skeleton width="100%" height={16} rounded={false} />
              </View>
              
              <View className="flex-row gap-3">
                <Skeleton width="48%" height={48} rounded={true} />
                <Skeleton width="48%" height={48} rounded={true} />
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
} 