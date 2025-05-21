import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  Alert,
} from "react-native";
import Header1 from "@/components/ReusableComponent/Header1";
import { Ionicons } from "@expo/vector-icons";

const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => console.log("Logged out") },
    ]);
  };

  return (
    <View className="flex-1 bg-white">
      <Header1 subtitle="Settings" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 16, paddingTop: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View className="items-center mb-6">
          <Image
            source={{
              uri: "https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg",
            }}
            className="w-24 h-24 rounded-full mb-4"
          />
          <Text className="text-brand-darkblue text-xl font-bold">SETI</Text>
          <Text className="text-brand-darkblue text-sm">seti@edu.com</Text>
          <TouchableOpacity className="bg-brand-darkblue px-4 py-2 rounded-lg mt-4">
            <Text className="text-white text-sm font-bold">Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* General Settings */}
        <View className="bg-gray-100  p-4 rounded-lg mb-6">
          <Text className="text-brand-darkblue text-sm font-bold mb-4">General</Text>
          <TouchableOpacity className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <Ionicons name="lock-closed" size={20} color="#0e395f" />
              <Text className="text-brand-darkblue text-base font-regular ml-4">Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#0e395f" />
          </TouchableOpacity>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="moon" size={20} color="#0e395f" />
              <Text className="text-brand-darkblue text-base font-regular ml-4">Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              thumbColor={isDarkMode ? "#0e395f" : "#f4f3f4"}
              trackColor={{ false: "#767577", true: "#FFCB3C" }}
            />
          </View>
        </View>

        {/* Help & Legal */}
        <View className="bg-gray-100 p-4 rounded-lg mb-6">
          <Text className="text-brand-darkblue text-sm font-bold mb-4">Help & Legal</Text>
          <TouchableOpacity className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <Ionicons name="help-circle" size={20} color="#0e395f" />
              <Text className="text-brand-darkblue text-base font-regular ml-4">Help</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#0e395f" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <Ionicons name="document-text" size={20} color="#0e395f" />
              <Text className="text-brand-darkblue text-base font-regular ml-4">Policies</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#0e395f" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="bug" size={20} color="#0e395f" />
              <Text className="text-brand-darkblue text-base font-regular ml-4">Report Problem</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#0e395f" />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity
          className="bg-red-400 p-4 rounded-lg flex-row items-center justify-center"
          onPress={handleLogout}
        >
          <Ionicons name="log-out" size={20} color="white" />
          <Text className="text-white text-base font-bold ml-2">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Settings;


