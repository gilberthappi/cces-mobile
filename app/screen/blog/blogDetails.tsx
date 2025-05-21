import React from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Header1 from "@/components/ReusableComponent/Header1";

const blogs = [
  {
    id: "1a2b3c4d-5678-9101-1121-314151617181",
    title: "Improving Public Transport",
    date: "2023-10-01",
    content: [
      {
        type: "text",
        value: "Public transport is a vital part of urban life. Improving it can significantly enhance the quality of life for citizens.",
      },
      {
        type: "image",
        value: "https://res.cloudinary.com/cld-docs/image/upload/v1719307544/gotjephlnz2jgiu20zni.jpg",
      },
      {
        type: "text",
        value: "Investments in infrastructure, better scheduling, and cleaner vehicles are some of the ways to improve public transport.",
      },
      {
        type: "image",
        value: "https://res.cloudinary.com/cld-docs/image/upload/v1719307544/gotjephlnz2jgiu20zni.jpg",
      },
      {
        type: "text",
        value: "Collaboration between government agencies and private companies is key to achieving these improvements.",
      },
      {
        type: "text",
        value: "Collaboration between government agencies and private companies is key to achieving these improvements.",
      },
      {
        type: "text",
        value: "Collaboration between government agencies and private companies is key to achieving these improvements.",
      },
      {
        type: "image",
        value: "https://res.cloudinary.com/cld-docs/image/upload/v1719307544/gotjephlnz2jgiu20zni.jpg",
      },
    ],
  },
];

export default function BlogDetails() {
  const router = useRouter();
  const { blogId } = useLocalSearchParams();

  const blog = blogs[0];

  if (!blog) {
    return (
      <View className="flex-1 bg-white">
        <Header1 showBackButton />
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg font-bold text-red-500">Blog not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Header1 subtitle="Blog" showBackButton />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 16, paddingTop: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-2xl font-bold text-brand-darkblue mb-2">{blog.title}</Text>
        <Text className="text-sm text-gray-500 mb-4">{blog.date}</Text>
        {blog.content.map((item, index) => {
          if (item.type === "text") {
            return (
              <Text key={index} className="text-base text-gray-700 mb-4">
                {item.value}
              </Text>
            );
          } else if (item.type === "image") {
            return (
              <Image
                key={index}
                source={{ uri: item.value }}
                className="w-full h-60 rounded-lg mb-4"
                resizeMode="cover"
              />
            );
          }
          return null;
        })}
      </ScrollView>
    </View>
  );
}
