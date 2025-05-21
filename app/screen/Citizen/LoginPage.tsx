import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Modal,
  // Image,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import * as WebBrowser from 'expo-web-browser';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { handleResponse } from "@/utils/responseHandler";
import { loginSchema } from "@/constants/schema/login.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

WebBrowser.maybeCompleteAuthSession();

type TLoginSchema = z.infer<typeof loginSchema>;

const CustomProgressBar = ({ visible }:{visible:boolean}) => (
  <Modal onRequestClose={() => null} visible={visible} transparent>
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={{ fontSize: 20, fontWeight: "200" }}>Loading</Text>
        <ActivityIndicator size="large" />
      </View>
    </View>
  </Modal>
);

const LoginPage = () => {
  const insets = useSafeAreaInsets();  
  const router =useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigateToSignup = () => {
    router.push("/screen/Citizen/CitizenNormalSignUp");

  };

  const PasswordEmailForget = () => {
    router.push("/screen/Citizen/PasswordEmailForget");
  };

  const navigateToPatientsDashbord = () => {
    router.replace("/(PatientDashboard)/(home)/home")

  };

  const handleFormSubmit = async (data: TLoginSchema) => {
    try {
      setIsLoading(true);

      // Use the provided API endpoint for login
      const response = await fetch("https://cces-be.onrender.com/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed! Please try again.");
      }

      const result = await response.json();
      console.log("response:", result);

      // Store token and role in AsyncStorage
      const { token, roles } = result.data;
      await AsyncStorage.setItem("accessToken", token);
      await AsyncStorage.setItem("role", roles[0]);

      setShowProgress(true);
      setTimeout(() => {
        setShowProgress(false);
        navigateToPatientsDashbord();
      }, 1000);
    } catch (error: any) {
      const errorMessage = error.message || "Login failed! Please try again.";
      handleResponse({ response: null, errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
    <ScrollView style={styles.formInputField}
          showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
            <View className="mb-6 mt-20 items-center">
                      <Image
                        source={require("@/assets/cceslogo.png")}
                        className="h-48 w-48 mb-2 rounded-3xl shadow-3xl border-4 border-gray-200"
                      />
                      </View>

          <View style={styles.loginContainer}>
            <Text style={styles.loginTitle}>LOG IN</Text>
            <Pressable style={styles.signupButton} onPress={navigateToSignup}>
              <Text style={styles.signupText}>
                Don't have an account? 
                <Text style={{color:'#0e395f'}}>
                Sign UP
                </Text>
                
              </Text>
            </Pressable>
            <View style={styles.lineOrLog}>
              <Text style={styles.line}></Text>
              <Text style={styles.orText}>or Log with email</Text>
              <Text style={styles.line}></Text>
            </View>
            <View style={[
                styles.inputContainer,
                errors.email ? styles.errorBorder:null,
              ]}>
              {/* <Image
                source={require("@/assets/User.png")}
                style={styles.inputIcon}
              /> */}
                  <TextInput
                    style={styles.input}
                    placeholder="email or phone number"
                    placeholderTextColor={'gray'}
                    onChangeText={(text) => setValue("email", text)}
                  />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
            <View style={[
                styles.inputContainer,
                errors.password ? styles.errorBorder:null,
              ]}>
              {/* <Image
                source={require("@/assets/lock.png")}
                style={styles.inputIcon}
              /> */}
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={'gray'}
                    secureTextEntry={!isPasswordVisible} 
                    onChangeText={(text) => setValue("password", text)}
                  />
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                style={styles.visibilityToggle}
              >
                <Ionicons
                  name={isPasswordVisible ? "eye-off" : "eye"}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
            <View style={styles.forgotContainer}>
              <Pressable>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </Pressable>
              <Pressable  onPress={PasswordEmailForget}>
                <Text style={[styles.forgotText, {textDecorationLine:'underline'}]}>Get Help</Text>
              </Pressable>
            </View>
            <Pressable
              style={styles.loginButton}
              onPress={handleSubmit(handleFormSubmit)}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.loginText}>Log In</Text>
              )}
            </Pressable>
            <CustomProgressBar visible={showProgress} />
            <View style={styles.termsContainer}>
            </View>
          </View>
          
        </View>
        </ScrollView>
    </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    fontFamily: "Poppins",
  },
  welcomeContainer: {
    width: "100%",
    paddingTop: 30,
    fontFamily: "Poppins-Regular",
  },

  content: {
    top: 40,
    height: "100%",
    fontFamily: "Poppins-Regular",
  },
  welcomeText: {
    color: "#0e395f",
    fontSize: width * 0.06,
    fontWeight: "bold",
    letterSpacing: 1,
    fontFamily: "Poppins-Bold",
  },
  errorBorder: {
    borderColor: "red",
    borderWidth: 1,
    fontFamily: "Poppins-Regular",
  },
  subText: {
    color: "#888888",
    paddingVertical:10,
    fontSize: width * 0.04, 
    fontWeight: "400",
    fontFamily: "Poppins-Regular",
  },
  formInputField: {
    width: "100%",
    backgroundColor: "white",
    
    padding: Platform.OS === "ios" ? 20 : 20,
    fontFamily: "Poppins-Regular",
  },
  loginContainer: {
    marginBottom: 20,
    fontFamily: "Poppins-SemiBold",
  },
  loginTitle: {
    color: "#0e395f",
    fontSize: width * 0.06, 
    fontWeight: "bold",
    marginBottom: 8,
    fontFamily: "Poppins",
  },
  continue: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  signupButton: {
    marginBottom: 30,
    // fontSize: width * 0.06, 

  },
  signupText: {
    color: "#A5A5A5",
    fontSize: width * 0.035, 
    fontFamily: "Poppins",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 6,
    paddingVertical: 12,
    marginBottom: 10,
    borderColor: "#888888",
    borderWidth: 1,
    width: "100%",
  },
  socialIcon: {
    marginRight: 10,
  },
  socialText: {
    color: "#202020",
    fontSize: width * 0.04, 
    fontFamily: "Poppins",
  },
  orText: {
    color: "#A5A5A5",
    fontSize: width * 0.035, 
    textAlign: "center",
    marginVertical: 20,
    fontFamily: "Poppins",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F4F4",
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize:  width*0.04,
    fontFamily: "Poppins",
  },
  loginButton: {
    backgroundColor: "#0e395f",
    borderRadius: width*0.08,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  loginText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Poppins",
  },
  forgotContainer: {
    flexDirection: "row",
    marginBottom: 10,
    gap: 3,
  },
  forgotText: {
    color: "#A5A5A5",
    fontSize: width * 0.035, 
    paddingVertical:10,
    fontFamily: "Poppins",
  },
  fingerprintButton: {
    alignItems: "center",
    marginBottom: 20,
  },
  fingerprintIcon: {
    width: 50,
    height: 50,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  termsText: {
    color: "#A5A5A5",
    fontSize:  width*0.035,
    fontFamily: "Poppins",
  },
  line: {
    width: 77,
    height: 1,
    backgroundColor: "#9B9B9B",
  },
  lineOrLog: {
    display: "flex",
    flexDirection: "row",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 10,
    fontFamily: "Poppins",
  },
  errorInput: {
    borderColor: "red",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "Poppins",
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
    fontFamily: "Poppins",
  },
  modalButton: {
    backgroundColor: "#0e395f",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Poppins",
  },
  visibilityToggle: {
    marginLeft: 10,
  },
  checkbox: {
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
