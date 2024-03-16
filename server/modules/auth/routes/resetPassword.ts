import express, { Request, Response } from "express";

import AuthController from "../controllers/auth.controller";

const router = express.Router();

router.post("/api/users/resetPassword", AuthController.resetPassword);

export { router as resetPasswordRouter };
