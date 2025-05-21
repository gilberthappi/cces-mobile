import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import Header1 from "@/components/ReusableComponent/Header1";

const blogs = [
  {
    id: "1a2b3c4d-5678-9101-1121-314151617181",
    title: "Improving Public Transport",
    description: "A detailed analysis of how public transport can be improved in urban areas.",
    date: "2023-10-01",
    image: "https://res.cloudinary.com/cld-docs/image/upload/v1719307544/gotjephlnz2jgiu20zni.jpg",
    content: "Full content of the blog about improving public transport...",
  },
  {
    id: "9f8e7d6c-5432-1098-7654-321098765eh3",
    title: "Healthcare Accessibility",
    description: "Exploring ways to make healthcare more accessible to citizens.",
    date: "2023-09-25",
    image: "https://res.cloudinary.com/cld-docs/image/upload/v1719307544/gotjephlnz2jgiu20zni.jpg",
    content: "Full content of the blog about healthcare accessibility...",
  },
  {
    id: "9f8e7d6c-5432-1098-7654-321098765432",
    title: "Digital Transformation in Governance",
    description: "How digital tools are reshaping governance and citizen engagement.",
    date: "2023-09-15",
    image: "https://res.cloudinary.com/cld-docs/image/upload/v1719307544/gotjephlnz2jgiu20zni.jpg",
    content: "Full content of the blog about digital transformation...",
  },
  {
    id: "9f8e7d6c-5432-1098-7654-321090765432",
    title: "Digital Transformation in Governance",
    description: "How digital tools are reshaping governance and citizen engagement.",
    date: "2023-09-15",
    image: "https://res.cloudinary.com/cld-docs/image/upload/v1719307544/gotjephlnz2jgiu20zni.jpg",
    content: "Full content of the blog about digital transformation...",
  },
];

const Blog = () => {
  const router = useRouter();

  const handleBlogClick = (blog: any) => {
    router.push({
      pathname: "/screen/blog/blogDetails",
      params: { id: blog.id, title: blog.title, content: blog.content },
    });
  };

  return (
    <View className="flex-1 bg-white">
      <Header1 subtitle="Blog" showLogoutButton />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 16, paddingTop: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {blogs.map((blog) => (
          <TouchableOpacity
            key={blog.id}
            className="mb-4 bg-gray-100 rounded-lg shadow-md"
            onPress={() => handleBlogClick(blog)}
          >
            <Image
              source={{ uri: blog.image }}
              className="w-full h-40 rounded-t-lg"
              resizeMode="cover"
            />
            <View className="p-4">
              <Text className="text-lg font-bold text-brand-darkblue">{blog.title}</Text>
              <Text className="text-sm text-gray-600 mt-1">{blog.description}</Text>
              <Text className="text-xs text-gray-500 mt-2 text-right">{blog.date}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Blog;


