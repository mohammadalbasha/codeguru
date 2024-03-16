import express, { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model";
import { JWT } from "../utils/jwt";
import { SigninInput } from "../validations/signin.validation";
import { ValidateBody } from "../../common/validation/validation.decorators";
import { Password } from "../utils/password";
import { CustomError } from "../../common/errors/custom-error";
import { SendResetPasswordLinkInput } from "../validations/sendResetPasswordLink.validation";
import { NotFoundError } from "../../common/errors/not-found-error";
import crypto from "crypto";
import { MailService } from "../../common/mails/services/sendMail.service";
import { ResetPasswordInput } from "../validations/resetPassword.validation";
import { BadRequestError } from "../../common/errors/bad-request-error";
import { NotAuthorizedError } from "../../common/errors/not-authorized-error";
import { ConfigService } from "../../common/config/config";
import { UserPayload } from "../middlewares/current-user";

declare global {
  namespace Express {
    interface Request {
      session: any;
    }
  }
}

export default class AuthController {
  // @ValidateQuery(PaginationRequestModel)
  // static signin(req, res){
  //     const {page, page_size, search} = req.query;
  //     // get students based on query params
  // }

  @ValidateBody(SigninInput)
  static async signup(req: Request, res: Response, next: NextFunction) {
    const { name, password, email } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(new Error("Email in use"));
    }

    const user = User.build({ name, password, email });
    await user.save();

    // Generate JWT
    const userJwt = JWT.generateTokens({
      id: user.id,
      email: user.email,
    });

    // Store it on session object
    req.session = {
      accessToken: userJwt.accessToken,
      refreshToken: userJwt.refreshToken,
    };

    // TODO:
    // use CLASS TRANSFORMER to transform response
    delete user.password;

    res.status(201).send({
      user,
      token: {
        accessToken: userJwt.accessToken,
        refreshToken: userJwt.refreshToken,
      },
    });
  }

  @ValidateBody(SigninInput)
  static async signin(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return next(new Error("Invalid credentials"));
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordsMatch) {
      return next(new Error("Invalid credentials"));
    }

    // HERE SHOULD CREATE ACCESS TOKEN AND REFRESH TOKEN

    // Generate JWT
    // Generate JWT
    const userJwt = JWT.generateTokens({
      id: existingUser.id,
      email: existingUser.email,
    });

    // Store it on session object
    req.session = {
      accessToken: userJwt.accessToken,
      refreshToken: userJwt.refreshToken,
    };

    // Store it on session object
    //req.session!!.accessToken = userJwt.accessToken;

    // to be accessed in client
    // res.cookie("jwt", userJwt, {
    //   domain: "localhost",
    //   httpOnly: false,
    // });

    // TODO:
    // use CLASS TRANSFORMER to transform response
    delete existingUser.password;

    res.status(200).send({
      user: existingUser,
      token: {
        accessToken: userJwt.accessToken,
        refreshToken: userJwt.refreshToken,
      },
    });
  }

  @ValidateBody(SendResetPasswordLinkInput)
  static async sendResetPasswordLink(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return next(new NotFoundError());
    }
    if (ConfigService.getEnvironmentConfiguration().RUN_ENVIRONMENT == "docker")
      return next(
        new BadRequestError(
          "sending emails is not available in docker environment"
        )
      );

    const resetPasswordToken = await crypto.randomBytes(16).toString("hex");

    await User.findByIdAndUpdate(existingUser.id, { resetPasswordToken });
    await MailService.sendResetPasswordEmail(email, resetPasswordToken);

    res.status(200).send("link sent successfully");
  }

  @ValidateBody(ResetPasswordInput)
  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    const { email, resetPasswordToken, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser || existingUser.resetPasswordToken == "") {
      return next(new NotFoundError());
    }
    if (existingUser.resetPasswordToken != resetPasswordToken)
      return next(new BadRequestError("token is incorrect"));

    const newPassword = await Password.toHash(password);
    await User.findByIdAndUpdate(existingUser.id, {
      password: newPassword,
      resetPasswordToken: "",
    });

    res.status(200).send("password updated successfully successfully");
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.session?.refreshToken && !req.headers.authorization) {
        return next(new NotAuthorizedError());
      }

      const refreshToken = req?.session?.refreshToken
        ? req?.session?.refreshToken
        : req?.headers?.authorization?.split(" ")[1];

      const payload = JWT.verify(
        refreshToken,
        ConfigService.getJwtConfiguration().REFRESH_SECRET
      ) as UserPayload;

      return JWT.generateTokens(payload);
    } catch (e) {
      next(new NotAuthorizedError());
    }
  }
}
