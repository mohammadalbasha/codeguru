import { Request, Response, NextFunction } from "express";
import { JWT } from "../utils/jwt";
import UserService from "../../auth/services/user.service";
import { UserDoc } from "../models/user.model";
import { ConfigService } from "../../common/config/config";

export interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload | UserDoc;
    }
  }
}

export const currentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.accessToken && !req.headers.authorization) {
    return next();
  }

  const accessToken = req?.session?.accessToken
    ? req?.session?.accessToken
    : req?.headers?.authorization?.split(" ")[1];
  try {
    const payload = JWT.verify(
      accessToken,
      ConfigService.getJwtConfiguration().ACCESS_SECRET
    ) as UserPayload;

    const user = await UserService.findById(payload.id);
    req.currentUser = user!;
  } catch (err) {}

  next();
};
