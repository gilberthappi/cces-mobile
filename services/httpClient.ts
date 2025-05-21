import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const httpClient = axios.create({
	baseURL: "https://cces-be.onrender.com/api/",
});

httpClient.interceptors.request.use(async (request) => {
	const accessToken = await AsyncStorage.getItem("accessToken");
	if (accessToken) {
		request.headers.Authorization = `JWT ${accessToken}`;
	}
	if (request.data instanceof FormData) {
		request.headers["Content-Type"] = "multipart/form-data";
	}
	return request;
});

httpClient.interceptors.response.use(
	(response) => response,
	(error) => {
		return Promise.reject(error);
	},
);

export default httpClient;
