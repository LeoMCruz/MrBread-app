import React from "react";
import { View, ScrollView } from "react-native";
import { Platform } from "react-native";
import Skeleton from "../Skeleton";

interface ViewOrderSkeletonProps {
  productsCount?: number;
  servicesCount?: number;
}

export default function ViewOrderSkeleton({
  productsCount = 3,
  servicesCount = 3,
}: ViewOrderSkeletonProps) {
  const products = Array.from({ length: productsCount }, (_, index) => index);
  const services = Array.from({ length: servicesCount }, (_, index) => index);

  return (
    <ScrollView
      className={`flex-1 px-6 mb-6 ${Platform.OS === "ios" ? "pt-6" : "pt-4"}`}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="mb-4 flex-row justify-end">
        <Skeleton width={80} height={24} rounded={true} />
      </View>

      <View className="bg-gray-800 rounded-lg p-4 mb-4 border border-gray-600">
        <View className="flex-row items-center justify-between">
          <View>
            <Skeleton
              width={120}
              height={24}
              rounded={false}
              className="mb-1"
            />
            <Skeleton width={180} height={16} rounded={false} />
          </View>
        </View>
      </View>

      <View className="bg-gray-800 rounded-lg p-3 mb-2 border border-gray-600">
        <View className="flex-row items-center gap-2 mb-3">
          <Skeleton width={16} height={16} rounded={true} />
          <Skeleton width={80} height={20} rounded={false} />
        </View>

        <View className=" rounded-lg p-3 border border-gray-600">
          <Skeleton width="80%" height={18} rounded={false} className="mb-1" />
          <Skeleton width="60%" height={14} rounded={false} className="mb-1" />
          <Skeleton width="50%" height={14} rounded={false} />
        </View>
      </View>

      <View className="bg-gray-800 rounded-lg p-3 mb-2 border border-gray-600">
        <View className="flex-row items-center gap-2 mb-3">
          <Skeleton width={16} height={16} rounded={true} />
          <Skeleton width={80} height={20} rounded={false} />
        </View>

        <View className="space-y-2 gap-1">
          {products.map((index) => (
            <View
              key={index}
              className=" rounded-lg p-3 px-3 border border-gray-600"
            >
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-1">
                  <Skeleton
                    width="70%"
                    height={18}
                    rounded={false}
                    className="mb-1"
                  />
                  <Skeleton width="40%" height={14} rounded={false} />
                </View>
              </View>
              <View className="flex-row gap-4">
                <View>
                  <Skeleton
                    width={60}
                    height={12}
                    rounded={false}
                    className="mb-1"
                  />
                  <Skeleton width={40} height={16} rounded={false} />
                </View>
                <View>
                  <Skeleton
                    width={70}
                    height={12}
                    rounded={false}
                    className="mb-1"
                  />
                  <Skeleton width={60} height={16} rounded={false} />
                </View>
                <View className="flex-1 items-end">
                  <Skeleton
                    width={50}
                    height={12}
                    rounded={false}
                    className="mb-1"
                  />
                  <Skeleton width={80} height={16} rounded={false} />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className="bg-gray-800 rounded-lg p-3 mb-2 border border-gray-600">
        <View className="flex-row items-center gap-2 mb-3">
          <Skeleton width={16} height={16} rounded={true} />
          <Skeleton width={80} height={20} rounded={false} />
        </View>

        <View className="space-y-2 gap-1">
          {services.map((index) => (
            <View
              key={index}
              className="rounded-lg p-3 px-3 border border-gray-600"
            >
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-1">
                  <Skeleton
                    width="70%"
                    height={18}
                    rounded={false}
                    className="mb-1"
                  />
                  <Skeleton width="90%" height={14} rounded={false} />
                </View>
              </View>
              <View className="flex-row gap-4">
                <View>
                  <Skeleton
                    width={60}
                    height={12}
                    rounded={false}
                    className="mb-1"
                  />
                  <Skeleton width={40} height={16} rounded={false} />
                </View>
                <View>
                  <Skeleton
                    width={70}
                    height={12}
                    rounded={false}
                    className="mb-1"
                  />
                  <Skeleton width={60} height={16} rounded={false} />
                </View>
                <View className="flex-1 items-end">
                  <Skeleton
                    width={50}
                    height={12}
                    rounded={false}
                    className="mb-1"
                  />
                  <Skeleton width={80} height={16} rounded={false} />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className="bg-gray-800 rounded-lg p-3 mb-2 border border-gray-600">
        <View className="flex-row items-center gap-2 mb-3">
          <Skeleton width={16} height={16} rounded={true} />
          <Skeleton width={100} height={20} rounded={false} />
        </View>

        <View className="bg-gray-700 rounded-lg p-3 border border-gray-600">
          <Skeleton width="100%" height={16} rounded={false} className="mb-1" />
          <Skeleton width="90%" height={16} rounded={false} className="mb-1" />
          <Skeleton width="80%" height={16} rounded={false} />
        </View>
      </View>

      <View className="bg-gray-800 rounded-lg p-3 mb-6 border border-gray-600">
        <View className="flex-row items-center gap-2 mb-3">
          <Skeleton width={16} height={16} rounded={true} />
          <Skeleton width={80} height={20} rounded={false} />
        </View>

        <View className="space-y-2 gap-1">
          <View className="flex-row justify-between">
            <Skeleton width={120} height={16} rounded={false} />
            <Skeleton width={100} height={16} rounded={false} />
          </View>
          <View className="flex-row justify-between">
            <Skeleton width={130} height={16} rounded={false} />
            <Skeleton width={100} height={16} rounded={false} />
          </View>
          <View className="flex-row justify-between">
            <Skeleton width={80} height={16} rounded={false} />
            <Skeleton width={80} height={16} rounded={false} />
          </View>
          <View className="border-t border-gray-600 pt-2">
            <View className="flex-row justify-between">
              <Skeleton width={60} height={20} rounded={false} />
              <Skeleton width={120} height={20} rounded={false} />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
