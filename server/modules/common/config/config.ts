import {
  DATABASE_CONFIGURATION,
  ENVIRONMENT_CONFIGURATION,
  FRONTEND_DOMAINS_CONFIGURATION,
  JWT_CONFIGURATION,
  MAIL_CONFIGURATION,
  REDIS_CONFIGURATION,
  SECURITY_CONFIGURATION,
} from "./config.types";

require("dotenv").config();

export class ConfigService {
  static getPORT = () => {
    return process.env.PORT || 3000;
  };

  static getFrontendDomainsConfiguration: () => FRONTEND_DOMAINS_CONFIGURATION =
    () => {
      if (
        !process.env.FRONTEND_DOMAIN ||
        !process.env.FRONTEND_RESET_PASSWORD_LINK
      ) {
        throw new Error("frontend urls must be defined");
      }
      return {
        DOMAIN: process.env.FRONTEND_DOMAIN!,
        RESET_PASSWORD_LINK: process.env.FRONTEND_RESET_PASSWORD_LINK!,
      };
    };
  static getDatabaseConfiguration: () => DATABASE_CONFIGURATION = () => {
    if (!process.env.DATABASE_USERNAME) {
      throw new Error("db must be defined");
    }
    return {
      USERNAME: process.env.DATABASE_USERNAME!,
      PASSWORD: process.env.DATABASE_PASSWORD!,
      ENVIRONMENT: process.env.DATABASE_ENVIRONMENT!,
      DB: process.env.DB!,
    };
  };

  static getMailConfiguration: () => MAIL_CONFIGURATION = () => {
    return {
      MAIL_HOST: process.env.MAIL_HOST,
      MAIL_PORT: +process.env.MAIL_PORT,
      MAIL_DEFAULT_FROM_USER: process.env.MAIL_DEFAULT_FROM_USER,
      MAIL_IS_SECURE: process.env.MAIL_IS_SECURE == "true" ? true : false,
      MAIL_AUTH_USER: process.env.MAIL_AUTH_USER,
      MAIL_AUTH_PASSWORD: process.env.MAIL_AUTH_PASSWORD,
      MAIL_SMTP: process.env.MAIL_SMTP,
    };
  };

  static getJwtConfiguration: () => JWT_CONFIGURATION = () => {
    if (!process.env.JWT_ACCESS_SECRET)
      throw new Error("jwt keys must be defined in .env");
    return {
      ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
      REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    };
  };

  static getSecurityConfiguration: () => SECURITY_CONFIGURATION = () => {
    if (!process.env.JWT_ACCESS_SECRET)
      throw new Error("jwt keys must be defined in .env");
    return {
      JWT_ACCESS_EXPIRES_IN: process.env.SECURITY_JWT_REFRESH_EXPIRESIN,
      JWT_REFRESH_EXPIRES_IN: process.env.SECURITY_JWT_REFRESH_EXPIRESIN,
    };
  };
  static getRedisConfiguration: () => REDIS_CONFIGURATION = () => {
    return {
      URL: process.env.REDIS_URL,
    };
  };

  static getEnvironmentConfiguration: () => ENVIRONMENT_CONFIGURATION = () => {
    return {
      RUN_ENVIRONMENT: process.env.RUN_ENVIRONMENT,
      NODE_ENV: process.env.ENVIRONMENT,
    };
  };
}
