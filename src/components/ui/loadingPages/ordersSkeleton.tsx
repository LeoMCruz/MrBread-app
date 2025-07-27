import React from "react";
import { View, ScrollView } from "react-native";
import { Platform } from "react-native";
import Skeleton from "../Skeleton";

interface OrdersSkeletonProps {
  itemCount?: number;
}

export default function OrdersSkeleton({ itemCount = 5 }: OrdersSkeletonProps) {
  // Array para renderizar os cards da lista
  const listItems = Array.from({ length: itemCount }, (_, index) => index);

  return (
    <ScrollView
      className={`flex-1 px-6 ${Platform.OS === "ios" ? "pt-6" : ""}`}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="mb-6">
        <Skeleton width="100%" height={48} rounded={true} />
      </View>

      <View className="space-y-3">
        {listItems.map((index) => (
          <View
            key={index}
            className="bg-gray-800 rounded-xl p-4 mb-2 border border-gray-700"
          >
            <View className="flex-row justify-between items-start mb-3">
              <View className="flex-1">
                <View className="flex-row items-center gap-2 mb-2">
                  <Skeleton width="30%" height={20} rounded={false} />
                  <Skeleton width={80} height={24} rounded={true} />
                </View>

                <Skeleton
                  width="70%"
                  height={16}
                  rounded={false}
                  className="mb-1"
                />
                <Skeleton
                  width="90%"
                  height={16}
                  rounded={false}
                  className="mb-2"
                />

                <View className="flex-row items-center gap-2">
                  <Skeleton width={15} height={15} rounded={true} />
                  <Skeleton width={120} height={12} rounded={false} />
                </View>
              </View>

              <View className="flex-col justify-between items-end gap-4">
                <View className="flex-row justify-end items-end gap-3">
                  <Skeleton width={16} height={16} rounded={true} />
                  <Skeleton width={16} height={16} rounded={true} />
                </View>

                <View className="items-end">
                  <Skeleton width={100} height={20} rounded={false} />
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View className="h-20" />
    </ScrollView>
  );
}
