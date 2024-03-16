import express, { NextFunction, Request, Response } from "express";
import AuthController from "../controllers/auth.controller";

const router = express.Router();

router.post("/api/users/signin", AuthController.signin);

export { router as signinRouter };
