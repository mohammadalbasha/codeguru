import express, { NextFunction, Request, Response } from "express";
import { currentUser } from "../../auth/middlewares/current-user";
import { requireAuth } from "../../auth/middlewares/require-auth";
import ExpenseController from "../controllers/expenses.controller";

declare global {
  namespace Express {
    interface Request {
      session: any;
    }
  }
}

const router = express.Router();

router.post(
  "/api/expenses",

  currentUser,
  requireAuth,
  ExpenseController.create
);

export { router as createExpenseRoute };
