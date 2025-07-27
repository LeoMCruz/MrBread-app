import React from "react";
import { View, ScrollView } from "react-native";
import { Platform } from "react-native";
import Skeleton from "../Skeleton";

interface CustomersSkeletonProps {
  itemCount?: number;
}

export default function CustomersSkeleton({
  itemCount = 4,
}: CustomersSkeletonProps) {
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
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-1">
                <Skeleton
                  width="80%"
                  height={20}
                  rounded={false}
                  className="mb-2"
                />
                <Skeleton
                  width="90%"
                  height={16}
                  rounded={false}
                  className="mb-2"
                />
                <Skeleton
                  width="60%"
                  height={16}
                  rounded={false}
                  className="mb-2"
                />
                <Skeleton
                  width="50%"
                  height={16}
                  rounded={false}
                  className="mb-2"
                />

                <View className="flex-row items-center gap-4 mt-2">
                  <View className="flex-row items-center gap-2">
                    <Skeleton width={15} height={15} rounded={true} />
                    <Skeleton width={120} height={12} rounded={false} />
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Skeleton width={15} height={15} rounded={true} />
                    <Skeleton width={100} height={12} rounded={false} />
                  </View>
                </View>
              </View>

              <View className="flex-row justify-end items-start gap-5">
                <Skeleton width={16} height={16} rounded={true} />
                <Skeleton width={16} height={16} rounded={true} />
              </View>
            </View>
          </View>
        ))}
      </View>

      <View className="h-20" />
    </ScrollView>
  );
}
