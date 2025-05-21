import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Modal,
} from "react-native";
import axios from "axios";
import { useRouter, useLocalSearchParams } from "expo-router";
import { BaseUrl } from "@/utils/apiEnv";
import { maskEmail, maskPhone } from "@/constants/utils/tools";
import { handleResponse } from "@/utils/responseHandler";

const ConfirmResetPassword = () => {
  const { email } = useLocalSearchParams();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [otpErrorMessage, setOtpErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [otpExpired, setOtpExpired] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [ToLoginModalVisible, setToLoginModalVisible] = useState(false);

  const otpInputRefs = useRef([
    React.createRef<TextInput>(),
    React.createRef<TextInput>(),
    React.createRef<TextInput>(),
    React.createRef<TextInput>(),
  ]);

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setShowError(false);
    setOtpErrorMessage("");

    if (value && index < 3) {
      otpInputRefs.current[index + 1].current?.focus();
    }
  };

  const handleVerifyCode = async () => {
    if (otp.includes("") || !newPassword || !confirmPassword) {
      setShowError(true);
      setPasswordErrorMessage("Please fill in all fields before submitting!");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordErrorMessage("New Password and Confirm Password do not match!");
      return;
    }

    setLoading(true);

    try {
      const code = otp.join("");
      const response = await axios.patch(`${BaseUrl}/users/reset-password/`, {
        code,
        password: newPassword,
      });

      const isSuccess = handleResponse({ response });
      if (isSuccess) {
        setToLoginModalVisible(true);
      }
    } catch (error) {
      handleResponse({
        response: { status: 500, data: { message: "An error occurred. Please try again later." } },
      });
    } finally {
      setLoading(false);
    }
  };

  const router= useRouter();
  const handleProceedToLoginPage = () => {
    setToLoginModalVisible(false);
    setShowLoader(true);
    setTimeout(() => {
      setShowLoader(false);
      router.push("/screen/Patient/LoginPage")
    }, 1000); 
  };

  const CustomProgressBar = ({ visible } : { visible: boolean}) => (
    <Modal onRequestClose={() => null} visible={visible} transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={{ fontSize: 20, fontWeight: "200" }}>Loading</Text>
          <ActivityIndicator size="large" />
        </View>
      </View>
    </Modal>
  );

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
              <Text style={styles.yourAccount}>Verify your account</Text>
              <View style={styles.VerifyaccountSubcontainer}>
                <Text style={styles.subText}>
                  We have sent you a verification code to here
                 <Text style={styles.highlightText}> {maskEmail(email as string)}</Text> 
                  
                </Text>
              </View>
              <View>
                <View style={styles.otpInputContainer}>
                  {otp.map((_, index) => (
                    <TextInput
                      key={index}
                      ref={otpInputRefs.current[index]}
                      style={[
                        styles.otpInput,
                        {
                          borderColor:
                            showError && otp[index] === ""
                              ? "red"
                              : focusedIndex === index
                              ? "#000"
                              : "#0C7751",
                        },
                      ]}
                      maxLength={1}
                      keyboardType="number-pad"
                      value={otp[index]}
                      onChangeText={(value) => handleOtpChange(index, value)}
                      onFocus={() => setFocusedIndex(index)}
                      onBlur={() => setFocusedIndex(null)}
                    />
                  ))}
                </View>
                {showError && (
                  <Text style={styles.errorText}>
                    Please fill in all OTP boxes and password fields before
                    submitting!
                  </Text>
                )}
                {otpErrorMessage && (
                  <Text style={styles.errorText}>{otpErrorMessage}</Text>
                )}
                <TextInput
                  style={styles.passwordInput}
                  secureTextEntry
                  placeholder="New Password"
                  placeholderTextColor={'gray'}
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TextInput
                  style={styles.passwordInput}
                  secureTextEntry
                  placeholder="Confirm New Password"
                  placeholderTextColor={'gray'}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                {passwordErrorMessage && (
                  <Text style={styles.errorText}>{passwordErrorMessage}</Text>
                )}
                <View style={styles.verifyCodeContainer}>
                  <Pressable style={styles.submitButton} onPress={handleVerifyCode}>
                    {loading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.submitButtonText}>
                       Verify Code & Reset Password
                      </Text>
                    )}
                  </Pressable>
                </View>
                <View style={styles.recieveCode}>
                  <Text style={styles.resendDidnt}>Didn’t Receive code? </Text>
                  <Pressable
                    onPress={() => router.push("/screen/Patient/PasswordEmailForget")}
                  >
                    <Text style={styles.resend}>Resend</Text>
                  </Pressable>
                </View>
              </View>
            </View>
    
            {/* OTP Expired Modal */}
            {otpExpired && (
              <Modal
                transparent={true}
                animationType="slide"
                visible={otpExpired}
                onRequestClose={() => setOtpExpired(false)}
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalText}>
                      Your OTP code has expired. Please request a new one.
                    </Text>
                    <Pressable
                      style={styles.modalButton}
                      onPress={() => setOtpExpired(false)}
                    >
                      <Text style={styles.modalButtonText}>OK</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>
            )}
    
            <CustomProgressBar visible={showLoader} />
    
            <LoginModal
              visible={ToLoginModalVisible}
              onClose={() => setToLoginModalVisible(false)}
              onVerify={handleProceedToLoginPage}
            />
             </ScrollView>
          </View>
       
      );
    };
    
    type LoginModalProps = {
      visible: boolean;
      onClose: () => void;
      onVerify: () => void;
    };
    
    const LoginModal = ({ visible, onClose, onVerify }: LoginModalProps) => (
      <Modal onRequestClose={onClose} visible={visible} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Your Password Reset Successfully</Text>
            <Pressable style={styles.modalButton} onPress={onVerify}>
              <Text style={styles.modalButtonText}>Proceed To Login</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
    
    
    export default ConfirmResetPassword;
    
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
        fontSize: 24,
        marginBottom: 3,
      },
      VerifyaccountSubcontainer: {
        width: "90%",
        marginBottom: 10,
      },
      subText: {
        color: "#686868",
      },
      highlightText: {
        color: "black",
        fontWeight: "bold",
      },
      formInputField: {
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        borderTopLeftRadius: 36,
        borderTopRightRadius: 36,
        padding: 20,
        paddingTop: 50,
      },
      formInput: {
        height: "100%",
      },
      mainContainer: {
        height: "100%",
        backgroundColor: "#93BD68",
      },
      otpInputContainer: {
        flexDirection: "row",
        justifyContent: 'center',
        marginBottom: 20,
        gap: 10,
      },
      otpInput: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        textAlign: "center",
        fontSize: 24,
        fontWeight: "bold",
      },
      passwordInput: {
        borderWidth: 1,
        borderColor: "#93BD68",
        borderRadius: 8,
        padding: 12,
        marginVertical: 10,
        fontSize: 16,
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
        marginBottom: 20,
      },
      submitButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
      },
      yourAccount: {
        fontWeight: "bold",
        fontSize: 20,
        color: "#000",
        marginBottom: 20,
      },
      recieveCode: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
      },
      resendDidnt: {
        fontSize: 16,
        color: "#686868",
      },
      resend: {
        fontSize: 16,
        color: "#93BD68",
        fontWeight: "bold",
      },
      errorText: {
        color: "red",
        fontSize: 14,
        textAlign: "center",
        marginTop: 10,
      },
      verifyCodeContainer: {
        marginTop: 20,
        alignItems: "center",
      },
      modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
      modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
        width: 300,
      },
      modalText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: "center",
      },
      modalButton: {
        backgroundColor: "#93BD68",
        padding: 10,
        borderRadius: 5,
        // width: 100,
        alignItems: "center",
      },
      modalButtonText: {
        color: "white",
        fontWeight: "bold",
      },
      modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
      },
    });
    
    