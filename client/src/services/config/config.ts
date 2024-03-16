export class Config {
  static getServerDomain: () => Domain = () => {
    return {
      url: import.meta.env.VITE_SERVER_DOMAIN!,
    };
  };
}
