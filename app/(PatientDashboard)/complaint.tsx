import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Header1 from "@/components/ReusableComponent/Header1";
import CustomSelectAndSearch from "@/components/ReusableComponent/CustomSelectAndSearch";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const categories = [
  { label: "Public Transport", value: "public_transport" },
  { label: "Healthcare", value: "healthcare" },
  { label: "Education", value: "education" },
  { label: "Environment", value: "environment" },
];

const Complaint = () => {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePhotoPick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const handleRemovePhoto = (uri: string) => {
    setPhotos(photos.filter((photo) => photo !== uri));
  };

  const handleSubmit = async () => {
    if (!category || !description || !phoneNumber || !location) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);

    const dataToSubmit = {
      phoneNumber,
      category,
      description,
      location,
      galleryImages: photos,
    };

    try {
      const token = await AsyncStorage.getItem("accessToken");
      const response = await fetch("https://cces-be.onrender.com/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          authorization: token || "",
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (response.ok) {
        Alert.alert("Success", "Your complaint has been submitted!");
        setCategory("");
        setDescription("");
        setPhotos([]);
        setPhoneNumber("");
        setLocation("");
      } else {
        const result = await response.json();
        Alert.alert("Error", result.message || "Failed to submit complaint.");
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      Alert.alert("Error", "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <Header1 subtitle="Submit Complaint" showBackButton />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 16, paddingTop: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-lg text-gray-600 mb-4">
          Please describe your complaint. You can track the status later.
        </Text>

        {/* Category Dropdown */}
        <Text className="text-base font-bold text-gray-700 mb-2">Category</Text>
        <View className="w-full px-4 border border-gray-300 rounded-lg mb-4">
          <CustomSelectAndSearch
            data={categories}
            placeholder="Select a category"
            value={category}
            onChange={setCategory}
          />
        </View>

        {/* Description */}
        <Text className="text-base font-bold text-gray-700 mb-2">Description</Text>
        <TextInput
          className="w-full h-24 px-4 border border-gray-300 rounded-lg mb-4"
          placeholder="Enter your complaint description"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {/* Location */}
        <Text className="text-base font-bold text-gray-700 mb-2">Location</Text>
        <TextInput
          className="w-full h-12 px-4 border border-gray-300 rounded-lg mb-4"
          placeholder="Enter location"
          value={location}
          onChangeText={setLocation}
        />

        {/* Contact Info */}
        <Text className="text-base font-bold text-gray-700 mb-2">Contact Info</Text>
        <TextInput
          className="w-full h-12 px-4 border border-gray-300 rounded-lg mb-4"
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

         {/* Photo Upload */}
         <Text className="text-base font-bold text-gray-700 mb-2">Photos/Files</Text>
        <TouchableOpacity
          className="flex-row items-center justify-center border border-gray-300 rounded-lg h-24 mb-4"
          onPress={handlePhotoPick}
        >
          <Text className="text-gray-500">+ Add Photo/File</Text>
        </TouchableOpacity>
        <ScrollView horizontal className="mb-4">
          {photos.map((uri, index) => (
            <View key={index} className="relative mr-4">
              <Image source={{ uri }} className="w-24 h-24 rounded-lg" resizeMode="cover" />
              <TouchableOpacity
                className="absolute top-0 right-0 bg-red-500 rounded-full p-1"
                onPress={() => handleRemovePhoto(uri)}
              >
                <Text className="text-white text-xs">X</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Submit Button */}
        <TouchableOpacity
          className={`p-4 rounded-lg ${loading ? "bg-gray-400" : "bg-brand-darkblue"}`}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text className="text-center text-white font-bold">
            {loading ? "Submitting..." : "Submit"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Complaint;


