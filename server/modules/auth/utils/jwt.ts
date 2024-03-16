import jwt from "jsonwebtoken";
import { UserPayload } from "../middlewares/current-user";
import { ConfigService } from "../../common/config/config";
import { NotAuthorizedError } from "../../common/errors/not-authorized-error";

export interface Token {
  accessToken: string;
  refreshToken: string;
}

interface JWTOptions {
  key: string;
  expiresIn: string;
}

export class JWT {
  static sign(payload: UserPayload, options: JWTOptions): string {
    const userJwt = jwt.sign(payload, options.key, {
      expiresIn: options.expiresIn,
    });
    return userJwt;
  }

  static verify(jwtToken: string, key: string): UserPayload {
    // TODO:
    // CHECK IF JWT IS IN BLACKLIST
    const payload = jwt.verify(jwtToken, key) as UserPayload;
    return payload;
  }

  static generateTokens(payload: UserPayload): Token {
    return {
      accessToken: JWT.generateAccessToken(payload),
      refreshToken: JWT.generateRefreshToken(payload),
    };
  }

  static generateAccessToken(payload: UserPayload): string {
    return JWT.sign(payload, {
      key: ConfigService.getJwtConfiguration().ACCESS_SECRET!,
      expiresIn: ConfigService.getSecurityConfiguration().JWT_ACCESS_EXPIRES_IN,
    });
  }

  static generateRefreshToken(payload: UserPayload): string {
    return JWT.sign(payload, {
      key: ConfigService.getJwtConfiguration().REFRESH_SECRET!,
      expiresIn:
        ConfigService.getSecurityConfiguration().JWT_REFRESH_EXPIRES_IN,
    });
  }

  static refreshToken(token: string) {
    try {
      const { id, email } = JWT.verify(
        token,
        ConfigService.getJwtConfiguration().REFRESH_SECRET!
      );

      return JWT.generateTokens({
        id,
        email,
      });
    } catch (e) {
      throw new NotAuthorizedError();
    }
  }
}
