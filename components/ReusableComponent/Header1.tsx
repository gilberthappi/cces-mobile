import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const defaultImage = "https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg";

interface Header1Props {
  subtitle?: string;
  showLogoutButton?: boolean;
  showBackButton?: boolean;
}

const fetchUserProfile = async () => {
  try {
    const token = await AsyncStorage.getItem("accessToken");
    const response = await fetch("https://cces-be.onrender.com/api/auth/me", {
      method: "GET",
      headers: {
        accept: "application/json",
        authorization: token || "",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

const Header1: React.FC<Header1Props> = ({ subtitle, showLogoutButton, showBackButton }) => {
  const router = useRouter();
  const [userProfile, setUserProfile] = React.useState<any>(null);

  React.useEffect(() => {
    const loadUserProfile = async () => {
      const profile = await fetchUserProfile();
      setUserProfile(profile);
    };
    loadUserProfile();
  }, []);

  const navigateToLogout = async () => {
    await AsyncStorage.clear();
    router.replace("/screen/CitizenSignupMix");
  };

  const fullName = `${userProfile?.firstName || "Guest"} ${userProfile?.lastName || ""}`;
  const profileImageUrl = userProfile?.photo || defaultImage;

  return (
    <View className="bg-brand-sky">
      <View className="flex-row items-center justify-between p-2 bg-brand-sky rounded-b-lg top-10 left-0 right-0 z-10">
        <View className="relative">
          <Image
            className="rounded-full w-20 h-20 object-cover"
            source={{ uri: profileImageUrl }}
          />
          <View className="absolute top-4 right-0 w-4 h-4 rounded-full bg-[#18B415]" />
        </View>
        <View className="flex w-1/2 justify-center items-center">
          <Text className="text-white text-xl font-bold">{fullName}</Text>
          <Text className="text-white text-base mt-2">{subtitle}</Text>
        </View>
        <View className="flex flex-col justify-center items-center">
          {showLogoutButton && (
            <TouchableOpacity
              className="relative bg-white flex justify-center items-center mb-2 w-16 h-7 rounded-lg"
              onPress={navigateToLogout}
            >
              <Text className="text-bg-brand-darkblue text-base font-bold">Logout</Text>
            </TouchableOpacity>
          )}
          {showBackButton && (
            <TouchableOpacity
              className="relative bg-white flex justify-center items-center mb-2 w-20 h-7 rounded-lg"
              onPress={() => router.back()}
            >
              <Text className="text-bg-brand-darkblue text-base font-bold ml-1 mr-1">Go back</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default Header1;