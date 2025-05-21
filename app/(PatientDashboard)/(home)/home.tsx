import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header1 from "@/components/ReusableComponent/Header1";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IFeedback } from "@/types";
import { useRouter } from "expo-router";
import { formatDate } from "@/constants/utils/tools";

const PatientDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("resolved");
  const [resolvedComplaints, setResolvedComplaints] = useState([]);
  const [unresolvedComplaints, setUnresolvedComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        const response = await fetch("https://cces-be.onrender.com/api/feedback/citizen", {
          method: "GET",
          headers: {
            accept: "application/json",
            authorization: token || "",
          },
        });
        const result = await response.json();
        if (response.ok) {
          const resolved = result.data.filter(
            (item: IFeedback) => item.feedbackStatus === "RESOLVED"
          );
          const unresolved = result.data.filter(
            (item: IFeedback) => item.feedbackStatus === "UNRESOLVED"
          );
          setResolvedComplaints(resolved);
          setUnresolvedComplaints(unresolved);
        } else {
          console.error("Failed to fetch complaints:", result.message);
        }
      } catch (error) {
        console.error("Error fetching complaints:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const renderComplaints = () => {
    const complaints =
      activeTab === "resolved" ? resolvedComplaints : unresolvedComplaints;

    return complaints.map((complaint: IFeedback) => (
      <TouchableOpacity
        key={complaint.id}
        className={`${
          activeTab === "resolved" ? "bg-green-100" : "bg-red-100"
        } p-4 rounded-lg shadow-md mb-4`}
        onPress={() => router.push(`/screen/complaint/complaintDetails?id=${complaint.id}`)}
      >
        <Text
          className={`text-lg font-bold ${
            activeTab === "resolved" ? "text-green-600" : "text-red-600"
          }`}
        >
          {complaint.ticket || "No Ticket"}
        </Text>
        <Text className="text-sm text-gray-600 mt-1">
          {`${complaint.feedbackStatus} - ${formatDate(complaint.createdAt)}`}
        </Text>
      </TouchableOpacity>
    ));
  };

  const resolvedPercentage = Math.round(
    (resolvedComplaints.length /
      (resolvedComplaints.length + unresolvedComplaints.length)) *
      100
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0e395f" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Header1 subtitle="Dashboard" showLogoutButton />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 16, paddingTop: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Statistics Section */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-brand-darkblue mb-4">Statistics</Text>
          <View className="flex-row justify-between mb-4">
            <View className="bg-gray-100 p-4 rounded-lg shadow-md w-[48%] flex items-center">
              <Ionicons name="stats-chart" size={24} color="#0e395f" />
              <Text className="text-lg font-bold text-brand-darkblue mt-2">Total Complaints</Text>
              <Text className="text-2xl font-bold text-gray-700 mt-2">
                {resolvedComplaints.length + unresolvedComplaints.length}
              </Text>
            </View>
            <View className="bg-gray-100 p-4 rounded-lg shadow-md w-[48%] flex items-center">
              <Ionicons name="checkmark-done" size={24} color="green" />
              <Text className="text-lg font-bold text-brand-darkblue mt-2">Resolved</Text>
              <Text className="text-2xl font-bold text-green-600 mt-2">
                {resolvedComplaints.length}
              </Text>
            </View>
          </View>
          <View className="bg-gray-100 p-4 rounded-lg shadow-md flex items-center">
            <Ionicons name="alert-circle" size={24} color="red" />
            <Text className="text-lg font-bold text-brand-darkblue mt-2">Unresolved</Text>
            <Text className="text-2xl font-bold text-red-600 mt-2">
              {unresolvedComplaints.length}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-brand-darkblue mb-2">Resolution Progress</Text>
          <View className="w-full bg-gray-200 rounded-full h-4">
            <View
              className="bg-green-600 h-4 rounded-full"
              style={{ width: `${resolvedPercentage}%` }}
            />
          </View>
          <Text className="text-sm text-gray-600 mt-2">{resolvedPercentage}% Resolved</Text>
        </View>

        {/* Tabs Section */}
        <View className="mb-6">
          <View className="flex-row justify-between mb-4">
            <TouchableOpacity
              className={`flex-1 mx-2 p-3 rounded-lg ${
                activeTab === "resolved" ? "bg-brand-darkblue" : "bg-gray-200"
              } shadow-md`}
              onPress={() => setActiveTab("resolved")}
            >
              <Text
                className={`text-center text-base font-bold ${
                  activeTab === "resolved" ? "text-white" : "text-gray-700"
                }`}
              >
                Resolved Complaints
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 mx-2 p-3 rounded-lg ${
                activeTab === "unresolved" ? "bg-brand-darkblue" : "bg-gray-200"
              } shadow-md`}
              onPress={() => setActiveTab("unresolved")}
            >
              <Text
                className={`text-center text-base font-bold ${
                  activeTab === "unresolved" ? "text-white" : "text-gray-700"
                }`}
              >
                Unresolved Complaints
              </Text>
            </TouchableOpacity>
          </View>
          {renderComplaints()}
        </View>
      </ScrollView>
    </View>
  );
};

export default PatientDashboard;


