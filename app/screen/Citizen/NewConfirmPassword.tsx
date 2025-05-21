import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
const ResetPassword = () => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleEmailSubmit = () => {
        router.push("/screen/Patient/LoginPage");
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.mainContainer}>
        <View style={styles.verifyAccountContainer}>
          <View style={styles.welcomeText}>
            <Text style={styles.welcomeText}>You're</Text>
            <Text style={styles.welcomeText}>almost there</Text>
          </View>
        </View>
        <View style={styles.formInputField}>
          <Text style={styles.yourAccount}>Reset Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="New Password"
              placeholderTextColor={'gray'}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
            />
            <Pressable
              style={styles.eyeIcon}
              onPress={() => setShowNewPassword(!showNewPassword)}
            >
              <Ionicons
                name={showNewPassword ? "eye-off" : "eye"}
                size={24}
                color="gray"
              />
            </Pressable>
          </View>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm Password"
              placeholderTextColor={'gray'}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <Pressable
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={24}
                color="gray"
              />
            </Pressable>
          </View>
          <Pressable style={styles.submitButton} onPress={handleEmailSubmit}>
            <Text style={styles.submitButtonText}>Reset</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  verifyAccountContainer: {
    backgroundColor: "#93BD68",
    width: "100%",
    padding: 20,
    paddingTop: 50,
  },
  welcomeText: {
    marginBottom: 10,
    color: "white",
    fontWeight: "bold",
    fontSize: 24,
  },
  formInputField: {
    width: "100%",
    height: 720,
    backgroundColor: "white",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    padding: 20,
    paddingTop: 50,
    alignItems: "center",
  },
  mainContainer: {
    height: "100%",
    backgroundColor: "#93BD68",
  },
  yourAccount: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#93BD68",
    textAlign: "center",
    width: "100%",
  },
  emailInput: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#93BD68",
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  passwordContainer: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#93BD68",
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
  },
  eyeIcon: {
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: "#93BD68",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    display:"flex",
    width:"100%",
    textAlign:"center",
    alignItems:"center",
    justifyContent:"center"
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
