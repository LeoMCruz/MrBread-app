import React from "react";
import { View, ScrollView } from "react-native";
import { Platform } from "react-native";
import Skeleton from "../Skeleton";

export default function HomeSkeleton() {
  const menuCards = Array.from({ length: 6 }, (_, index) => index);

  return (
    <View className="flex-1 bg-gray-900">
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-800">
        <Skeleton width={120} height={24} rounded={false} />
        <Skeleton width={40} height={40} rounded={true} />
      </View>

      <ScrollView
        className={`flex-1 px-6 ${Platform.OS === "ios" ? "pt-6" : ""}`}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="mb-8">
          <Skeleton
            width="80%"
            height={32}
            rounded={false}
            className="mx-auto mb-2"
          />
          <Skeleton
            width="90%"
            height={16}
            rounded={false}
            className="mx-auto"
          />
        </View>

        <View className="bg-gray-800 rounded-xl p-4 mb-6">
          <Skeleton width={120} height={24} rounded={false} className="mb-3" />
          <View className="flex-row justify-between">
            <View className="items-center">
              <Skeleton
                width={40}
                height={32}
                rounded={false}
                className="mb-1"
              />
              <Skeleton width={60} height={12} rounded={false} />
            </View>
            <View className="items-center">
              <Skeleton
                width={100}
                height={32}
                rounded={false}
                className="mb-1"
              />
              <Skeleton width={120} height={12} rounded={false} />
            </View>
          </View>
        </View>

        <View className="mb-6">
          <Skeleton width={140} height={24} rounded={false} className="mb-4" />
          <View className="flex-row flex-wrap justify-between">
            {menuCards.map((index) => (
              <View key={index} className="w-[48%] mb-4">
                <View className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <Skeleton
                    width={48}
                    height={48}
                    rounded={true}
                    className="mb-3"
                  />
                  <Skeleton
                    width="80%"
                    height={20}
                    rounded={false}
                    className="mb-1"
                  />
                  <Skeleton width="90%" height={12} rounded={false} />
                </View>
              </View>
            ))}
          </View>

          <Skeleton width="100%" height={48} rounded={true} className="mt-4" />
        </View>
      </ScrollView>
    </View>
  );
}
