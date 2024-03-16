import express, { NextFunction, Request, Response } from "express";
import { ValidateBody } from "../../common/validation/validation.decorators";
import { CurrentUser } from "../../auth/decorators/currentUser.decorator";
import { UserDoc } from "../../auth/models/user.model";
import { currentUser } from "../../auth/middlewares/current-user";
import { CreateCategoryInput } from "../validation/createCategory.validation";
import { Category } from "../models/category.model";

export default class CategoryService {
  static findById(id: string) {
    return Category.findById(id).populate("creator");
  }
}
