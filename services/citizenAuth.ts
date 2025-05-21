import httpClient from "./httpClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const login = async (email: string, password: string): Promise<void> => {
	const response = await httpClient.post("/auth/signin/", { email, password });
	const data = response.data;
	if (data.access && data.refresh) {
		await AsyncStorage.setItem("accessToken", data.data.token);
		await AsyncStorage.setItem("userType", data.data.roles[0]);
	}
	const token = await AsyncStorage.getItem("accessToken");
        const userType = await AsyncStorage.getItem("userType");
        console.log("accessToken,userType:", token, userType)
};

export const verifyAccount = async (otp: string): Promise<void> => {
	const response = await httpClient.post("/users/account-activation/", { code: otp });
	return response.data;
};