// COULD USE SINGLETON DESIGN PATTERN

import axios from "axios";
import { Config } from "../config/config";

const axiosInstance = axios.create({
  baseURL: Config.getServerDomain().url + "/api",
  withCredentials: true,
});

axios.interceptors.response.use(
  (response) => {
    // Return a successful response
    return response;
  },
  async (error) => {
    // Handle response error
    if (error.response && error.response.status === 403) {
      // Refresh the token
      try {
        const refreshedTokens = await axiosInstance.post("/users/refreshToken"); // Implement the token refresh logic

        // if using autorization headers instead of cookies
        //  Update the original request configuration with the new token
        // error.config.headers.Authorization = `Bearer ${refreshedTokens.data.accessToken}`;

        // Retry the original request
        return axiosInstance.request(error.config);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
