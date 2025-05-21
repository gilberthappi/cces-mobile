import axios, { type AxiosResponse } from "axios";

const axiosCLient = axios.create({
	baseURL: "https://cces-be.onrender.com/api/",
});

axiosCLient.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	if (config.data instanceof FormData) {
		config.headers["Content-Type"] = "multipart/form-data";
	}
	return config;
});

axiosCLient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			localStorage.removeItem("token");
			window.location.href = "/login";
		}
		return Promise.reject(error);
	},
);

export const request = async ({ ...options }) => {
	return axiosCLient(options);
};
