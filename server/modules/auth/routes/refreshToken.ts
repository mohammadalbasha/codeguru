import express, { NextFunction, Request, Response } from "express";
import AuthController from "../controllers/auth.controller";

const router = express.Router();

router.get("/api/users/refreshToken", AuthController.refreshToken);

export { router as refreshTokenRoute };
