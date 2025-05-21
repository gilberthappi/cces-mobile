import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Dimensions,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { handleResponse } from "@/utils/responseHandler";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

interface FormErrors {
  [key: string]: string;
}

const PatientNormalSignUp = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [errors, setErrors] = useState<FormErrors>({});
  const [showProgress, setShowProgress] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
  });
  const navigateToPatientsDashbord = () => {
    router.replace("/(PatientDashboard)/(home)/home")

  };
  const validateForm = () => {
    const newErrors: FormErrors = {};

    for (const [key, value] of Object.entries(formData)) {
      if (!value) {
        newErrors[key] = "This field is required";
      }
    }

    // Validate phone number
    const phoneRegex = /^\+?[0-9]*$/;
    if (!phoneRegex.test(formData.phone_number)) {
      newErrors.phone_number = "Phone number can only contain numbers and an optional '+' sign";
    } else if (formData.phone_number.startsWith("+")) {
      if (formData.phone_number.length < 11 || formData.phone_number.length > 15) {
        newErrors.phone_number = "Phone number with '+' must be between 11 and 15 digits";
      }
    } else {
      if (formData.phone_number.length !== 10) {
        newErrors.phone_number = "Phone number without '+' must be exactly 10 digits";
      }
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    // Validate password
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });

    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setShowProgress(true);

      const requestData = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
        phoneNumber: formData.phone_number,
        photo: "",
        role: "CITIZEN",
      };

      const response = await fetch("https://cces-be.onrender.com/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Signup failed! Please try again.");
      }

      const result = await response.json();
      console.log("Signup response:", result);

      // Save token and role in AsyncStorage
      const { token, roles } = result.data;
      await AsyncStorage.setItem("accessToken", token);
      await AsyncStorage.setItem("role", roles[0]);

      setShowProgress(true);
      setTimeout(() => {
        setShowProgress(false);
        navigateToPatientsDashbord();
      }, 1000);
    } catch (error: any) {
      const errorMessage = error.message || "An error occurred during registration.";
      handleResponse({
        response: { status: 500, data: { message: errorMessage } },
      });
    } finally {
      setIsLoading(false);
      setShowProgress(false);
    }
  };

  const LoginPage = () => {
    router.push("./LoginPage");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.mainContainer}>
          <View style={styles.NormalSignUpContainer}>
            <Text style={styles.welcomet}>You’re almost there</Text>
            <Text style={styles.subText}>
              Please fill in the details below to create your account.
            </Text>
          </View>
          <ScrollView style={styles.formInputField} showsVerticalScrollIndicator={false}>
            <View style={styles.textSignup}>
              <Text style={styles.signup}>SIGN UP</Text>
              <View style={styles.Alreadyhave}>
                <Text style={{ fontSize: width * 0.035 }}>Already have an account?</Text>
                <Pressable onPress={LoginPage}>
                  <Text style={styles.loginText}>LOG IN</Text>
                </Pressable>
              </View>
            </View>
            <View style={styles.inputFieldsContainer}>
              <View
                style={[
                  styles.inputFieldContainer,
                  errors.firstName ? styles.errorBorder : null,
                ]}
              >
                <Entypo name="user" size={20} color="#BDBDBD" style={styles.icon} />
                <TextInput
                  style={styles.inputField}
                  placeholder="First Name"
                  placeholderTextColor="gray"
                  value={formData.firstName}
                  onChangeText={(text) => handleChange("firstName", text)}
                />
              </View>
              <View
                style={[
                  styles.inputFieldContainer,
                  errors.lastName ? styles.errorBorder : null,
                ]}
              >
                <Entypo name="user" size={20} color="#BDBDBD" style={styles.icon} />
                <TextInput
                  style={styles.inputField}
                  placeholder="Last Name"
                  placeholderTextColor="gray"
                  value={formData.lastName}
                  onChangeText={(text) => handleChange("lastName", text)}
                />
              </View>
              <View
                style={[
                  styles.inputFieldContainer,
                  errors.email ? styles.errorBorder : null,
                ]}
              >
                <MaterialCommunityIcons
                  name="email"
                  size={20}
                  color="#BDBDBD"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.inputField}
                  placeholder="Email"
                  placeholderTextColor="gray"
                  value={formData.email}
                  onChangeText={(text) => handleChange("email", text)}
                />
              </View>
              <View
                style={[
                  styles.inputFieldContainer,
                  errors.phone_number ? styles.errorBorder : null,
                ]}
              >
                <MaterialCommunityIcons
                  name="phone"
                  size={20}
                  color="#BDBDBD" style={styles.icon}
                />
                <TextInput
                  style={styles.inputField}
                  placeholder="Phone Number"
                  placeholderTextColor="gray"
                  value={formData.phone_number}
                  onChangeText={(text) => handleChange("phone_number", text)}
                />
              </View>
              <View
                style={[
                  styles.inputFieldContainer,
                  errors.password ? styles.errorBorder : null,
                ]}
              >
                <MaterialCommunityIcons name="lock" size={20} color="#BDBDBD" style={styles.icon} />
                <TextInput
                  style={styles.inputField}
                  placeholder="Password"
                  placeholderTextColor="gray"
                  secureTextEntry
                  value={formData.password}
                  onChangeText={(text) => handleChange("password", text)}
                />
              </View>
              <View
                style={[
                  styles.inputFieldContainer,
                  errors.confirmPassword ? styles.errorBorder : null,
                ]}
              >
                <MaterialCommunityIcons name="lock" size={20} color="#BDBDBD" style={styles.icon} />
                <TextInput
                  style={styles.inputField}
                  placeholder="Confirm Password"
                  placeholderTextColor="gray"
                  secureTextEntry
                  value={formData.confirmPassword}
                  onChangeText={(text) => handleChange("confirmPassword", text)}
                />
              </View>
              <Pressable
                style={styles.createAccountButton}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.createAccountText}>Create Account</Text>
                )}
              </Pressable>
            </View>
            <View style={styles.termsContainer}>
              <TouchableOpacity
                style={[
                  styles.tcheckbox,
                  isTermsAccepted ? styles.checkboxChecked : null,
                ]}
                onPress={() => setIsTermsAccepted(!isTermsAccepted)}
              >
                {isTermsAccepted && <Ionicons name="checkmark" size={16} color="white" />}
              </TouchableOpacity>
              <Text style={styles.termsText}>
                I agree to the <Text style={{ color: "#0e395f" }}>Terms of Service</Text> and{" "}
                <Text style={{ color: "#0e395f" }}>Privacy Policy</Text>
              </Text>
            </View>
          </ScrollView>
        </View>
        {showProgress && (
          <View style={styles.modalContainer}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#96b4c7",
  },
  NormalSignUpContainer: {
    backgroundColor: "#96b4c7",
    width: "100%",
    padding: 20,
    paddingTop: 30,
  },
  welcomet: {
    color: "white",
    fontWeight: "bold",
    fontSize: width * 0.06,
  },
  subText: {
    color: "#FFFFFF",
    paddingVertical: 10,
    fontSize: width * 0.04,
    fontWeight: "400",
  },
  formInputField: {
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    padding: 20,
    paddingTop: 15,
  },
  mainContainer: {
    height: "100%",
    backgroundColor: "#96b4c7",
  },
  textSignup: {
    marginBottom: 20,
  },
  signup: {
    color: "black",
    fontSize: width * 0.05,
    fontWeight: "600",
  },
  Alreadyhave: {
    flexDirection: "row",
    alignItems: "center",
    textAlign: "center",
    marginTop: 10,
  },
  loginText: {
    fontSize: width * 0.035,
    fontWeight: "bold",
    color: "#96b4c7",
    borderBottomWidth: 1,
    borderBottomColor: "#96b4c7",
    marginLeft: 5,
  },
  inputFieldsContainer: {
    alignItems: "center",
  },
  inputFieldContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#0e395f",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 10,
  },
  inputField: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
    fontSize: width * 0.04,
  },
  icon: {
    marginRight: 0,
  },
  createAccountButton: {
    backgroundColor: "#0e395f",
    borderRadius: 10,
    marginTop: 0,
    marginBottom: 5,
    width: "100%",
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  createAccountText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  errorBorder: {
    borderColor: "red",
    borderWidth: 1,
  },
  termsText: {
    color: "#A5A5A5",
    fontSize: width * 0.03,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
    marginTop: 10,
  },
  tcheckbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#888888",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  checkboxChecked: {
    backgroundColor: "#0e395f",
  },
});

export default PatientNormalSignUp;