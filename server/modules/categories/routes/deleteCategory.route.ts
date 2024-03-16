import express, { NextFunction, Request, Response } from "express";
import { currentUser } from "../../auth/middlewares/current-user";
import { requireAuth } from "../../auth/middlewares/require-auth";
import ExpenseController from "../controllers/category.controller";
import CategoryController from "../controllers/category.controller";

const router = express.Router();

router.delete(
  "/api/categories/:id",

  currentUser,
  requireAuth,
  CategoryController.delete
);

export { router as deleteCategoryRoute };
