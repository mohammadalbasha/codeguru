import axios from "axios";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { listCategories } from "./redux/actions/category-action";

const AuthContext = React.createContext({
  tokens: {
    accessToken: "",
    refreshToken: "",
  },
  isLoggedIn: false,
  isLoading: true,
  login: async (profile) => {},
  logout: () => {},
  profile: {},
  profileHandler: (profile) => {},
});

export const AuthContextProvider = (props) => {
  const [tokens, setTokens] = useState({
    accessToken: "",
    refreshToken: "",
  });

  const [profile, setProfile] = useState({});

  const userIsLoggedIn = !!tokens.accessToken;

  const [isLoggedIn, setIsLoggedIn] = useState(userIsLoggedIn);

  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    const authenticateUser = async () => {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const refreshToken = await AsyncStorage.getItem("refreshToken");

      try {
        const response = await axios.get(
          "http://localhost:4000/api/users/currentuser",
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
            withCredentials: true,
          }
        );
        setTokens({ accessToken, refreshToken });
        setIsLoggedIn(true);
        profileHandler(response?.data?.currentUser);
        dispatch(listCategories());
      } catch (err) {
        if (
          err.response?.data?.error?.statusCode == 401 ||
          err.response?.data?.error?.message === "Unauthorized"
        ) {
          logoutHandler();
        }
      } finally {
        setIsLoading(false);
      }
    };
    authenticateUser();
  }, []);

  const logoutHandler = async () => {
    setTokens({
      accessToken: "",
      refreshToken: "",
    });
    setIsLoggedIn(false);
    setProfile({});
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");

    // MUST send a request to the server to blacklist tokens,
  };

  const loginHandler = async (data) => {
    await AsyncStorage.setItem("accessToken", data?.token?.accessToken);
    await AsyncStorage.setItem("refreshToken", data?.token?.refreshToken);

    const accessToken = data?.token?.accessToken;
    const refreshToken = data?.token?.refreshToken;
    setTokens({ accessToken, refreshToken });
    profileHandler(data?.user);
    setIsLoggedIn(true);
    dispatch(listCategories());

    //navigate("/login"); // react router 6
  };

  const profileHandler = (data) => {
    setProfile(data);
    //dispatch(fetchConverations({ conversations: data?.conversations }));
  };

  const contextValue = {
    tokens,
    isLoggedIn,
    isLoading,
    login: loginHandler,
    logout: logoutHandler,
    profile,
    profileHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
