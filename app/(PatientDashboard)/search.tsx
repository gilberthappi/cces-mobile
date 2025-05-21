import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import Header1 from "@/components/ReusableComponent/Header1";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IFeedback } from "@/types";
import { useRouter } from "expo-router";

const Search = () => {
  const [query, setQuery] = useState("");
  const [allComplaints, setAllComplaints] = useState<IFeedback[]>([]);
  const [results, setResults] = useState<IFeedback[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
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
          setAllComplaints(result.data);
          setResults(result.data);
        } else {
          Alert.alert("Error", result.message || "Failed to fetch complaints.");
        }
      } catch (error) {
        console.error("Error fetching complaints:", error);
        Alert.alert("Error", "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const handleSearch = (text: string) => {
    setQuery(text);
    if (text.trim() === "") {
      setResults(allComplaints);
    } else {
      setResults(
        allComplaints.filter(
          (item) =>
            item.category.toLowerCase().includes(text.toLowerCase()) ||
            item.description.toLowerCase().includes(text.toLowerCase()) ||
            (item.ticket && item.ticket.toLowerCase().includes(text.toLowerCase()))
        )
      );
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0e395f" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Header1 subtitle="Search" showLogoutButton />
      <View className="px-4 pt-14">
        <TextInput
          className="w-full h-12 px-4 border border-gray-300 rounded-lg"
          placeholder="Search by category, description, or ticket..."
          value={query}
          onChangeText={handleSearch}
        />
      </View>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 16, paddingTop: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {results.length > 0 ? (
          results.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="mb-4 bg-gray-100 p-4 rounded-lg shadow-md"
              onPress={() => router.push(`/screen/complaint/complaintDetails?id=${item.id}`)}
            >
              <Text className="text-lg font-bold text-brand-darkblue">
                {item.ticket || "No Ticket"}
              </Text>
              <Text className="text-sm text-gray-600 mt-1">{item.category}</Text>
              <Text className="text-xs text-gray-500 mt-2">{item.description}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text className="text-center text-gray-500 mt-4">
            No results found.
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default Search;


