import express, { NextFunction, Request, Response } from "express";
import { currentUser } from "../../auth/middlewares/current-user";
import { requireAuth } from "../../auth/middlewares/require-auth";
import ExpenseController from "../controllers/category.controller";
import CategoryController from "../controllers/category.controller";

declare global {
  namespace Express {
    interface Request {
      session: any;
    }
  }
}

const router = express.Router();

router.get(
  "/api/categories",

  currentUser,
  requireAuth,
  CategoryController.list
);

export { router as listCategoriesRoute };
