export type DATABASE_CONFIGURATION = {
  USERNAME: string;
  PASSWORD: string;
  ENVIRONMENT: string;
  DB: string;
};

export type FRONTEND_DOMAINS_CONFIGURATION = {
  RESET_PASSWORD_LINK: string;
  DOMAIN: string;
};

export type MAIL_CONFIGURATION = {
  MAIL_HOST: string;
  MAIL_PORT: number;
  MAIL_DEFAULT_FROM_USER: string;
  MAIL_IS_SECURE: boolean;
  MAIL_AUTH_USER: string;
  MAIL_AUTH_PASSWORD: string;
  MAIL_SMTP: string;
};

export type JWT_CONFIGURATION = {
  ACCESS_SECRET: string;
  REFRESH_SECRET: string;
};
export type SECURITY_CONFIGURATION = {
  JWT_ACCESS_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;
};

export type REDIS_CONFIGURATION = {
  URL: string;
};

export type ENVIRONMENT_CONFIGURATION = {
  RUN_ENVIRONMENT: string;
  NODE_ENV: string;
};
