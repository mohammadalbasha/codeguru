// COULD USE SINGLETON DESIGN PATTERN

import axios from "axios";
import { Config } from "../config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const axiosInstance = axios.create({
  baseURL: Config.getServerDomain().url + "/api",
  withCredentials: true,
});

export const setAuthorizationHeader = async () => {
  const authToken = await AsyncStorage.getItem("accessToken");

  if (authToken) {
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${authToken}`;
  }
};

export const getAccessToken = async () => {
  const authToken = await AsyncStorage.getItem("accessToken");
  return authToken;
};

export const getHost = () => {
  return Config.getServerDomain().url + "/api";
};

export default axiosInstance;
