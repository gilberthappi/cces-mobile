import { AuthResponse } from "@/types";
import httpClient from "./httpClient";

export const getPatientProfile = async (): Promise<AuthResponse> => {
    try {
        const response = await httpClient.get("/auth/me/");
        console.log("getPatientProfile response:", response.data); // Debug log
        return response.data.data; // Ensure this matches the API response structure
    } catch (error: any) {
        if (error.response) {
            console.error("Error response data:", error.response.data); // Log error response
            console.error("Error response status:", error.response.status); // Log status code
            console.error("Error response headers:", error.response.headers); // Log headers

            if (error.response.status === 403) {
                throw new Error("You are not authorized to access this resource. Please contact support.");
            }
        } else {
            console.error("Error fetching patient profile:", error); // Log generic error
        }
        throw error; // Re-throw the error for further handling
    }
};
