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

router.put(
  "/api/expenses/:id",

  currentUser,
  requireAuth,
  ExpenseController.update
);

export { router as updateExpenseRoute };
