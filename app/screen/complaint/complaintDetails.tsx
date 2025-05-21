import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Header1 from "@/components/ReusableComponent/Header1";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IFeedback } from "@/types";
import { formatDate } from "@/constants/utils/tools";

export default function ComplaintDetails() {
  const { id } = useLocalSearchParams();
  const [complaint, setComplaint] = useState<IFeedback | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchComplaintDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        const response = await fetch(
          `https://cces-be.onrender.com/api/feedback/${id}`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              authorization: token || "",
            },
          }
        );
        const result = await response.json();
        if (response.ok) {
          setComplaint(result.data);
        } else {
          Alert.alert("Error", result.message || "Failed to fetch complaint details.");
        }
      } catch (error) {
        console.error("Error fetching complaint details:", error);
        Alert.alert("Error", "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchComplaintDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0e395f" />
      </View>
    );
  }

  if (!complaint) {
    return (
      <View className="flex-1 bg-white">
        <Header1 subtitle="Complaint Details" showBackButton />
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg font-bold text-red-500">Complaint not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Header1 subtitle="Complaint Details" showBackButton />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 16, paddingTop: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-2xl font-bold text-brand-darkblue mb-4">
          {complaint.category}
        </Text>
        <Text className="text-sm text-gray-500 mb-4">
          Status: {complaint.feedbackStatus}
        </Text>
        <Text className="text-base text-gray-700 mb-4">
          {complaint.description}
        </Text>
        <Text className="text-base text-gray-700 mb-4">
          Location: {complaint.location}
        </Text>
        <Text className="text-base text-gray-700 mb-4">
          Phone Number: {complaint.phoneNumber}
        </Text>
        <Text className="text-base text-gray-700 mb-4">
          Created At: {formatDate(complaint.createdAt)}
        </Text>

        {/* Gallery Images */}
        {complaint.galleryImages.length > 0 && (
          <View className="mb-4">
            <Text className="text-lg font-bold text-gray-700 mb-2">Gallery</Text>
            <ScrollView horizontal>
              {complaint.galleryImages.map((uri, index) => (
                <Image
                  key={index}
                  source={{ uri }}
                  className="w-40 h-40 rounded-lg mr-4"
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Responses */}
        {complaint.response.length > 0 && (
          <View className="mt-4">
            <Text className="text-lg font-bold text-gray-700 mb-2">Responses</Text>
            {complaint.response.map((res, index) => (
              <View
                key={index}
                className="p-4 mb-4 bg-gray-100 rounded-lg shadow-md"
              >
                <Text className="text-base font-bold text-gray-700">
                  {res.subject}
                </Text>
                <Text className="text-sm text-gray-600 mt-2">
                  {res.description}
                </Text>
                <Text className="text-xs text-gray-500 mt-2">
                  Organization: {res.organization.name}
                </Text>
                <Text className="text-xs text-gray-500">
                  Address: {res.organization.address}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
