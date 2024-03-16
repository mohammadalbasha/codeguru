import Constants from "expo-constants";
export class Config {
  static getServerDomain = () => {
    return {
      url:
        "http://" +
        Constants.expoConfig.hostUri.split(`:`).shift().concat(`:4000`),
    };
  };
}
