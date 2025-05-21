import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
  Modal,
  Dimensions,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import { BaseUrl } from "@/utils/apiEnv";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { handleResponse } from "@/utils/responseHandler";
const { width, height } = Dimensions.get("window");

const PasswordEmailForget = () => {

  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationModalVisible, setVerificationModalVisible] = useState(false);
    const insets = useSafeAreaInsets();
  

  const handleEmailSubmit = async () => {
    if (!email) {
      setErrorMessage("Email is required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Invalid email format.");
      return;
    }

    setErrorMessage(""); 
    setLoading(true); 

    try {
      const response = await axios.post(`${BaseUrl}/users/reset-password/`, { email });
      const isSuccess = handleResponse({ response });

      if (isSuccess) {
        setVerificationModalVisible(true);
        router.push({
          pathname: "/screen/Patient/ConfirmResetPassword",
          params: { email },
        });
      }
    } catch (error) {
      handleResponse({
        response: { status: 500, data: { message: "Failed to resend verification code. Please try again." } },
      });
    } finally {
      setLoading(false); 
    }
  };

  const router =useRouter()

  const handleProceedToVerifyAccount = () => {
    setVerificationModalVisible(false);
    router.push("/screen/Patient/ConfirmResetPassword");
  };

  return (
    <KeyboardAvoidingView
                         style={{ flex: 1 }}
                         behavior={Platform.OS === "ios" ? "padding" : undefined}
                       >
          <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
            <View style={styles.VerifyaccountContainer}>
              <View style={styles.WelcomeText}>
                <Text style={styles.welcomet}>You're</Text>
                <Text style={styles.welcomet}>almost there</Text>
              </View>
            </View>
                    <ScrollView style={styles.formInputField}
                          showsVerticalScrollIndicator={false}
                      >
                        <View style={styles.formInput}>
              <Text style={styles.yourAccount}>Reset Your Password</Text>
              <Text style={styles.lostText}>Lost your password? Please enter your email address. You will recieve a code to create a new password via email.</Text>
              <TextInput
                style={styles.emailInput}
                placeholder="Enter your email"
                placeholderTextColor={'gray'}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrorMessage(""); 
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
              ) : null}
              <Pressable style={styles.submitButton} onPress={handleEmailSubmit}>
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Continue</Text>
                )}
              </Pressable>
              </View>
            </ScrollView>
          </View>
    
          {/* Verification Success Modal */}
          <VerificationModal
            visible={verificationModalVisible}
            onClose={() => setVerificationModalVisible(false)}
            onVerify={handleProceedToVerifyAccount}
          />
       </KeyboardAvoidingView>
      );
    };
    type VerificationModelProps = {
      visible: boolean;
      onClose: () => void;
      onVerify: () => void;
    };
    const VerificationModal = ({ visible, onClose, onVerify }:VerificationModelProps) => (
      <Modal onRequestClose={onClose} visible={visible} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Code Sent Successfully</Text>
            <Text style={styles.modalText}>
              A verification code has been sent to your email address. Please check your inbox and enter the code to verify your account.
            </Text>
            <Pressable style={styles.modalButton} onPress={onVerify}>
              <Text style={styles.modalButtonText}>Proceed to Reset Password</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
    
    export default PasswordEmailForget;
    
    const styles = StyleSheet.create({
      VerifyaccountContainer: {
        backgroundColor: "#93BD68",
        width: "100%",
        padding: 20,
        paddingTop: 50,
      },
      WelcomeText: {
        marginBottom: 50,
      },
      welcomet: {
        color: "white",
        fontWeight: "bold",
        marginBottom: 3,
        fontSize: width * 0.06,
        letterSpacing: 1,
        fontFamily: "Poppins-Bold",
      },
      formInputField: {
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        borderTopLeftRadius: 36,
        borderTopRightRadius: 36,
        padding: 20,
        paddingTop: 20,
      },
      formInput: {
        height: "100%",
      },
      mainContainer: {
        flex: 1,
        backgroundColor: "#93BD68",
      },
      yourAccount: {
        fontSize: width * 0.05,
        fontWeight: "bold",
        marginBottom: 30,
        color: "black",
        width: "100%",
      },
      emailInput: {
        width: "100%",
        height: 50,
        borderWidth: 1,
        borderColor: "#93BD68",
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: width * 0.04,
    
        marginBottom: 10,
      },
      submitButton: {
        backgroundColor: "#93BD68",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        display: "flex",
        width: "100%",
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 30,
      },
      submitButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: width * 0.05,
    
      },
      errorText: {
        color: "red",
        marginBottom: 10,
        fontWeight: "bold",
        fontSize: width * 0.04,
    
      },
      modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
      modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
        alignItems: "center",
      },
      modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
      },
      modalText: {
        fontSize: 16,
        color: "black",
        textAlign: "center",
        marginBottom: 20,
      },
      modalButton: {
        backgroundColor: "#93BD68",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
      },
      modalButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
      },
      lostText:{
        lineHeight:25,
        fontSize: width * 0.04,
        fontWeight:"semibold",
        marginBottom:20
      }
    });
    