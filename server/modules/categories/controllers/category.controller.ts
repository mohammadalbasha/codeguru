import express, { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";
import {
  ValidateBody,
  ValidateQuery,
} from "../../common/validation/validation.decorators";
import { CurrentUser } from "../../auth/decorators/currentUser.decorator";
import { UserDoc } from "../../auth/models/user.model";
import { currentUser } from "../../auth/middlewares/current-user";
import { CreateCategoryInput } from "../validation/createCategory.validation";
import { Category } from "../models/category.model";
import { ListInput, PaginationInput } from "../../common/validation/input";
import { ListCategoriesInput } from "../validation/listCategories.validation";
import { classToPlain, plainToInstance } from "class-transformer";
import { NotAuthorizedError } from "../../common/errors/not-authorized-error";
import ExpensesService from "../../expenses/services/expenses.service";
import { BadRequestError } from "../../common/errors/bad-request-error";
import { CacheController } from "../../common/caching/cache";

// ***********************
//  BUSINESS LOGIC IS BETTER TO BE IN A SEPARATED SERVICES
// ***********************

export default class CategoryController {
  //@ValidateQuery(PaginationRequestModel)

  @ValidateBody(CreateCategoryInput)
  static async create(
    req: Request,
    res: Response
    //@CurrentUser() currentUser
  ) {
    const { currentUser } = req;
    const { name, description } = req.body;

    const category = await Category.create({
      name,
      description,
      creator: currentUser,
    });

    const cacheKey = `categories${currentUser.id}`;
    await CacheController.instance().clearCache(cacheKey);

    delete category.creator;
    return res.status(200).json(category);
  }

  @ValidateQuery(ListCategoriesInput)
  static async list(req, res) {
    let { pagination, order, filter } = req.query;
    const { currentUser } = req;

    pagination = plainToInstance(PaginationInput, pagination);

    const skip = pagination?.skip || 0;
    const limit = pagination?.limit || 0;
    const orderField = order?.field || "createdAt";
    const orderDirection = order?.direction || "desc";

    // TODO:
    // add filter and pagination to cache key
    const cacheKey = `categories${currentUser.id}`;
    let categories = await CacheController.instance().getCache(cacheKey);
    if (categories) return res.status(200).json(categories);

    categories = await Category.find({
      creator: currentUser.id,
      ...(filter?.name && {
        name: { $regex: `${filter.name}`, $options: "i" },
      }),
    })
      .skip(skip)
      .limit(limit)
      .sort({ [orderField]: orderDirection });
    await CacheController.instance().setCache(cacheKey, categories);

    return res.status(200).json(categories);
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    console.log(req.params.id);
    let { id } = req.params;
    const { currentUser } = req;

    const categroy = await Category.findById(id);
    if (categroy.creator != currentUser.id)
      return next(new NotAuthorizedError());

    const expenses = await ExpensesService.findByCategory(id);
    if (expenses.length > 0) {
      return next(
        new BadRequestError(
          "category is related with expenses, please delete the related expenses before,"
        )
      );
    }
    await Category.findByIdAndDelete(id);

    const cacheKey = `categories${currentUser.id}`;
    await CacheController.instance().clearCache(cacheKey);

    return res.status(200).json("category deleted successfully");
  }
}
