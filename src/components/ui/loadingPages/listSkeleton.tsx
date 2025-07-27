import React from "react";
import { View, ScrollView } from "react-native";
import { Platform } from "react-native";
import Skeleton from "../Skeleton";

interface ListSkeletonProps {
  title?: string;
  itemCount?: number;
}

export default function ListSkeleton({
  title = "Lista",
  itemCount = 7,
}: ListSkeletonProps) {
  // Array para renderizar os cards da lista
  const listItems = Array.from({ length: itemCount }, (_, index) => index);

  return (
    <ScrollView
      className={`flex-1 px-6 ${Platform.OS === "ios" ? "pt-6" : ""}`}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="mb-6 mt-6">
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
                  width="70%"
                  height={20}
                  rounded={false}
                  className="mb-2"
                />
                <Skeleton width="40%" height={14} rounded={false} />
              </View>
              <Skeleton width={32} height={32} rounded={true} />
            </View>

            <View className="flex-row justify-between">
              <View className="flex-1">
                <Skeleton width="60%" height={18} rounded={false} />
              </View>
            </View>
          </View>
        ))}
      </View>

      <View className="h-20" />
    </ScrollView>
  );
}
