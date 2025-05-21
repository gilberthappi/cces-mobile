import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
  Modal,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { BaseUrl } from "@/utils/apiEnv";
import { handleResponse } from "@/utils/responseHandler";

interface VerificationModalProps {
  visible:boolean;
  onClose:() =>void;
  onVerify:() =>void;
  
  }

const VerificationModal:React.FC<VerificationModalProps> = ({ visible, onClose, onVerify }) => (
  <Modal onRequestClose={onClose} visible={visible} transparent>
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Code Sent Successfully</Text>
        <Text style={styles.modalText}>
          A verification code has been sent to your email address. Please check your inbox and enter the code to verify your account.
        </Text>
        <Pressable style={styles.modalButton} onPress={onVerify}>
          <Text style={styles.modalButtonText}>Proceed to Verify Account</Text>
        </Pressable>
      </View>
    </View>
  </Modal>
);
const ResendCodeForEmailField = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationModalVisible, setVerificationModalVisible] = useState(false);
  const router = useRouter()

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
      const response = await axios.post(`${BaseUrl}/users/resend-verfication-code/`, { email });
      const isSuccess = handleResponse({ response });
      if (isSuccess) {
        setVerificationModalVisible(true);
        router.push({
          pathname: "/screen/Patient/Verifyaccount",
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

  const handleProceedToVerifyAccount = () => {
    setVerificationModalVisible(false);
    router.push("/screen/Patient/Verifyaccount");
  };

  return (
<View style={styles.mainContainer}>
            <View style={styles.VerifyaccountContainer}>
              <View style={styles.WelcomeText}>
                <Text style={styles.welcomet}>You're</Text>
                <Text style={styles.welcomet}>almost there</Text>
              </View>
            </View>
            <ScrollView style={styles.formInputField} showsVerticalScrollIndicator={false}>
            <View style={styles.formInput}>
          <Text style={styles.yourAccount}>Enter Email To Resend OPT Code</Text>
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


        {/* Verification Success Modal */}
        <VerificationModal
          visible={verificationModalVisible}
          onClose={() => setVerificationModalVisible(false)}
          onVerify={handleProceedToVerifyAccount}
        />
                  </ScrollView>
                  </View>
  );
};

export default ResendCodeForEmailField;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formInput: {
    height: "100%",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  contain: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "#93BD68",
    fontFamily: "Poppins",
  },
  VerifyaccountContainer: {
    backgroundColor: "#93BD68",
    width: "100%",
    padding: 20,
    paddingTop: 50,
    top: 10,
    fontFamily: "Poppins",
  },
  WelcomeText: {
    marginBottom: 50,
    fontFamily: "Poppins",
  },
  welcomet: {
    color: "white",
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 3,
    fontFamily: "Poppins",
  },
  formInputField: {
    flex: 1,
    height: 720,
    backgroundColor: "white",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    padding: 20,
    paddingTop: 50,
    fontFamily: "Poppins",
  },

  yourAccount: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#93BD68",
    textAlign: "center",
    width: "100%",
    fontFamily: "Poppins",
  },
  emailInput: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#93BD68",
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 10,
    fontFamily: "Poppins",
  },
  submitButton: {
    backgroundColor: "#93BD68",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 18,
    display: "flex",
    width: "100%",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Poppins",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Poppins",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    fontWeight: "bold",
    fontFamily: "Poppins",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    fontFamily: "Poppins",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    fontFamily: "Poppins",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "Poppins",
  },
  modalText: {
    fontSize: 16,
    color: "black",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Poppins",
  },
  modalButton: {
    backgroundColor: "#93BD68",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    fontFamily: "Poppins",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Poppins",
  },
});
