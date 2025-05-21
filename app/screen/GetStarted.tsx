import React from "react";
import { View, Text, Pressable, SafeAreaView, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const GetStarted = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const navigateToSignupMix = () => {
    router.push("/screen/CitizenSignupMix");

  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-4xl font-extrabold text-brand-darkblue mb-4">
            🚀 Welcome!
          </Text>
          <Text className="text-4xl font-extrabold text-brand-darkblue mb-4">
          Citizen Complaints and Engagement System
          </Text>
          <Text className="text-lg text-gray-600 text-center mb-6">
            Empower citizens to voice their concerns and track the resolution of public service issues.
          </Text>

          {/* Features Section */}
          <View className="w-full mb-14">
            <View className="flex-row items-center mb-4">
              <Ionicons name="megaphone" size={24} color="#0e395f" />
              <Text className="ml-4 text-base text-gray-700">
                Raise your voice for better services.
              </Text>
            </View>
            <View className="flex-row items-center mb-4">
              <Ionicons name="checkmark-circle" size={24} color="#0e395f" />
              <Text className="ml-4 text-base text-gray-700">
                Track the status of your complaints.
              </Text>
            </View>
            <View className="flex-row items-center mb-4">
              <Ionicons name="people" size={24} color="#0e395f" />
              <Text className="ml-4 text-base text-gray-700">
                Collaborate with your community.
              </Text>
            </View>
          </View>

          {/* Get Started Button */}
          <Pressable
            className="bg-brand-darkblue px-6 py-4 rounded-lg"
            onPress={navigateToSignupMix}
          >
            <Text className="text-white text-lg font-bold">Get Started 🚀</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GetStarted;
