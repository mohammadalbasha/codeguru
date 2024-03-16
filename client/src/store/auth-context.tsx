import * as React from "react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { listCategories } from "./redux/actions/category-action";
import axiosInstance from "../services/api/api.service";

interface AuthContextType {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  isLoggedIn: boolean;
  login: (profile: any) => any;
  logout: () => void;
  profile: any;
  profileHandler: (profile: any) => any;
}

const AuthContext = React.createContext<AuthContextType>({
  tokens: {
    accessToken: "",
    refreshToken: "",
  },
  isLoggedIn: false,
  login: (profile) => {},
  logout: () => {},
  profile: {},
  profileHandler: (profile) => {},
});

export const AuthContextProvider: React.FC = (props: any) => {
  // required for some cases when tokens have to be send in request headers such as socketIO authentication
  // httpOnly must be false
  const accessToken = Cookies.get("accessToken");
  const refreshToken = Cookies.get("refreshToken");

  const [tokens, setTokens] = React.useState<{
    accessToken: string;
    refreshToken: string;
  }>({ accessToken: accessToken || "", refreshToken: refreshToken || "" });

  const [profile, setProfile] = React.useState({});

  const userIsLoggedIn = !!accessToken;

  const [isLoggedIn, setIsLoggedIn] = React.useState(userIsLoggedIn);

  const dispatch = useDispatch();

  React.useEffect(() => {
    // TODO:
    // CONVERT TO ASYNC/AWAIT STYLE
    axiosInstance
      .get("/users/currentuser")
      .then((response) => {
        profileHandler(response?.data?.currentUser);
        dispatch(listCategories());
      })
      .catch((err: any) => {
        if (
          err.response?.data?.error?.statusCode == 401 ||
          err.response?.data?.error?.message === "Unauthorized"
        ) {
          logoutHandler();
        }
      });
  }, []);

  const logoutHandler = async () => {
    setTokens({
      accessToken: "",
      refreshToken: "",
    });
    setIsLoggedIn(false);
    setProfile({});

    // required if the client has access to tokens
    // for example when sending tokens in request headers
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    await axiosInstance.post("/users/signout");
  };

  const loginHandler = (data: any) => {
    // required for some cases when tokens have to be send in request headers such as socketIO authentication
    // httpOnly must be false
    const accessToken = Cookies.get("accessToken") || "";
    const refreshToken = Cookies.get("refreshToken") || "";

    setTokens({ accessToken, refreshToken });
    profileHandler(data?.user);
    setIsLoggedIn(true);
    dispatch(listCategories());

    //navigate("/login"); // react router 6
  };

  const profileHandler = (data: any) => {
    setProfile(data);
  };
  const contextValue: AuthContextType = {
    tokens: tokens,
    isLoggedIn: isLoggedIn,
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
