import {
  View,
  Text,
  Pressable,
  Switch,
  ScrollView,
  SafeAreaView,
  Image,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CitizenSignupMix = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((prevState) => !prevState);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const navigateToSignupForm = () => {
    router.push("/screen/Citizen/CitizenNormalSignUp");
  };
  const navigateToPatientLogin = () => {
    router.push("/screen/Citizen/LoginPage");
  };

  return (
    <SafeAreaView className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 16, paddingTop: 30 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full flex-1 justify-center">
          {/* Welcome Section */}
          <View className="mb-6 mt-20 items-center">
            <Image
              source={require("@/assets/cceslogo.png")}
              className="h-48 w-48 mb-2 rounded-3xl shadow-3xl border-4 border-gray-200"
            />
            </View>
            <View className="mb-6 items-center">
            <Text className="text-brand-darkblue font-bold text-2xl mb-2">
              Welcome
            </Text>
            <Text className="text-brand-darkblue font-regular text-base mb-2">
              Sign up to access personalized services, manage your account, and stay connected with the latest updates.
            </Text>
          </View>

          {/* Signup Section */}
          <View className="border border-gray-200 rounded-lg p-4">
            <Text className="text-brand-darkblue font-bold text-2xl mb-4 text-center">
              SIGN UP
            </Text>
            <Pressable
              className="h-12 bg-brand-darkblue rounded-lg flex items-center justify-center mb-6"
              onPress={navigateToSignupForm}
            >
              <Text className="text-white text-lg font-medium">Sign up</Text>
            </Pressable>
            <View className="flex-row items-center justify-center mb-10">
              <Text className="text-brand-darkblue text-base">
                Already have an account?
              </Text>
              <Pressable onPress={navigateToPatientLogin}>
                <Text className="text-brand-darkblue font-bold text-base underline ml-2">
                  LOG IN
                </Text>
              </Pressable>
            </View>
            <View className="flex-row items-center justify-center">
              <Switch
                trackColor={{ false: "#767577", true: "#0C7751" }}
                thumbColor={isEnabled ? "#f4f3f4" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
              <Text className="text-brand-darkblue text-base ml-3">
                Use phone security to login
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CitizenSignupMix;
