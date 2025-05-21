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
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { maskEmail, maskPhone } from "@/constants/utils/tools";
import { handleResponse } from "@/utils/responseHandler";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifySchema } from "@/constants/schema/verify.schema";
import { z } from "zod";
import { verifyAccount } from "@/services/citizenAuth";

type TVerifySchema = z.infer<typeof verifySchema>;

const Verifyaccount = () => {
  const { email, phone } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TVerifySchema>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      otp: "",
    },
  });

  const handleFormSubmit = async (data: TVerifySchema) => {
    try {
      setLoading(true);
      await verifyAccount(data.otp);
      // Handle success response
    } catch (error) {
      handleResponse({
        response: { status: 500, data: { message: "Invalid OTP or an error occurred." } },
      });
    } finally {
      setLoading(false);
    }
  };

  interface CustomProgressBarProps {
    visible: boolean;
  }
  const CustomProgressBar: React.FC<CustomProgressBarProps> = ({ visible }) => (
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
              We have sent you a verification code to
              <Text style={styles.highlightText}> {maskEmail(email as string)}</Text>
              {phone && (
                <>
                  {" "}and
                  <Text style={styles.highlightText}> {maskPhone(phone as string)}</Text>.
                </>
              )}
            </Text>
          </View>
          <View>
            <View style={styles.otpInputContainer}>
              <TextInput
                style={[
                  styles.otpInput,
                  errors.otp ? { borderColor: "red" } : { borderColor: "#93BD68" },
                ]}
                maxLength={4}
                keyboardType="number-pad"
                placeholder="Enter OTP"
                onChangeText={(text) => setValue("otp", text)}
              />
            </View>
            {errors.otp && <Text style={styles.errorText}>{errors.otp.message}</Text>}
            <View style={styles.verifyCodeContainer}>
              <Pressable
                style={styles.submitButton}
                onPress={handleSubmit(handleFormSubmit)}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Verify Code</Text>
                )}
              </Pressable>
            </View>
            <View style={styles.recieveCode}>
              <Text style={styles.resendDidnt}>Didn’t Receive code? </Text>
              <Pressable
                onPress={() => {
                  router.push("/screen/Patient/ResendCodeForEmailField");
                }}
              >
                <Text style={styles.resend}>Resend</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* OTP Expired Modal */}
        <CustomProgressBar visible={loading} />
      </ScrollView>
    </View>
  );
};

export default Verifyaccount;

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
    justifyContent: "center",
    marginTop: 20,
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

