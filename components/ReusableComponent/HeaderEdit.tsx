import React from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import { getPatientProfile } from "@/services/patientProfile";

const defaultImage = "https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg";

interface HeaderEditProps {
  subtitle?: string;
  showEditIcon?: boolean;
  showSupportAndNotifications?: boolean;
  showLogoutButton?: boolean;
}

const HeaderEdit: React.FC<HeaderEditProps> = ({ subtitle, showEditIcon, showSupportAndNotifications, showLogoutButton }) => {
  const router = useRouter();

  const navigateTCheckSupport = () => {
    router.push("/(PatientDashboard)/(home)/CheckSupport");
  };

  const navigateToEditProfile = () => {
    router.push("/(PatientDashboard)/(home)/EditProfile");
  };

  const navigateToLogout = async () => {
    try {
      await AsyncStorage.clear();
      router.replace("/screen/Join");
    } catch (error) {
      Alert.alert("Logout Failed", "Please try again later");
    }
  };

  const { data: profileData, isLoading } = useQuery({
    queryKey: ["PATIENT_PROFILE"],
    queryFn: getPatientProfile,
  });

  const fullName = profileData?.personal_information?.full_name || "Guest";
  const profileImageUrl = profileData?.personal_information?.profile_image || defaultImage;

  return (
    <View className="bg-[#93BD68]">
      <View className="flex-row items-center justify-between p-2 bg-[#93BD68] rounded-b-lg top-10 left-0 right-0 z-10">
        <TouchableOpacity onPress={navigateToEditProfile} className="relative">
          <Image
            className="rounded-full w-20 h-20 object-cover"
            source={{ uri: profileImageUrl }}
          />
          {showEditIcon && (
            <TouchableOpacity onPress={navigateToEditProfile}>
              <Image
                source={require("@/assets/icons/photoedit.png")}
                className="absolute bottom-0 right-2 w-6 h-6"
                style={{ tintColor: "gray" }}
              />
            </TouchableOpacity>
          )}
          <View className="absolute top-4 right-0 w-4 h-4 rounded-full bg-[#18B415]" />
        </TouchableOpacity>
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
              <Text className="text-[#8BB85C] text-base font-bold">Logout</Text>
            </TouchableOpacity>
          )}
          {showSupportAndNotifications && (
            <View className="flex-row justify-around w-20 relative top-2">
              <TouchableOpacity onPress={navigateTCheckSupport}>
                <MaterialCommunityIcons name="headset" size={26} color="white" />
              </TouchableOpacity>
              <Ionicons name="notifications-sharp" size={26} color="white" />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default HeaderEdit;