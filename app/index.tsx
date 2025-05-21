import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "@/global.css";

const SplashScreen = () => {
  const router = useRouter();

  const GetStartedPage = () => {
    router.push("/screen/GetStarted");
  };

  useFocusEffect(
    React.useCallback(() => {
      const checkToken = async () => {
        const token = await AsyncStorage.getItem("accessToken");
        const role = await AsyncStorage.getItem("role");
        setTimeout(() => {
          if (token && role) {
            if (role === "CITIZEN") {
              router.push("/(PatientDashboard)/(home)/home");
            }
          } else {
            router.push("/screen/GetStarted");
          }
        }, 3000);
      };
      checkToken();
    }, [router])
  );

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center">
        <Pressable className="items-center" onPress={GetStartedPage}>
          <Image
            source={require("@/assets/cceslogo.png")}
            className="h-48 w-48 mb-2 rounded-3xl shadow-3xl border-4 border-gray-200"
          />
          <Text className="mt-8 text-brand-darkblue font-extrabold text-xl">CCES</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default SplashScreen;