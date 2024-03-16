import express, { NextFunction, Request, Response } from "express";
import PDFDocument from "pdfkit";
import * as uuid from "uuid";
import {
  ValidateBody,
  ValidateQuery,
} from "../../common/validation/validation.decorators";
import { CreateExpenseInput } from "../validation/createExpense.validation";
import { UserDoc } from "../../auth/models/user.model";
import { ObjectId } from "mongodb";
import CategoryService from "../../categories/services/category.service";
import { NotAuthorizedError } from "../../common/errors/not-authorized-error";
import { Expense } from "../models/expense.model";
import {
  ListExpensesInput,
  ListMonthlyReportExpensesInput,
  MonthlyReportInput,
} from "../validation/listExpenses.validation";
import { File } from "../../file/models/file.model";
import { PaginationInput } from "../../common/validation/input";
import { plainToInstance } from "class-transformer";
import path from "path";
import * as fs from "fs";
import { NotFoundError } from "../../common/errors/not-found-error";

declare global {
  namespace Express {
    interface Request {
      session: any;
    }
  }
}

// ***********************
//  BUSINESS LOGIC IS BETTER TO BE IN A SEPARATED SERVICES
// ******

export default class ExpenseController {
  @ValidateBody(CreateExpenseInput)
  static async create(
    req: Request,
    res: Response,
    next: NextFunction
    //@CurrentUser() currentUser
  ) {
    const { currentUser } = req;
    const { amount, description, category, date, mediaFileId } = req.body;

    if (category) {
      const categoryDoc = await CategoryService.findById(category);
      if ((categoryDoc?.creator as UserDoc).id != currentUser.id)
        return next(new NotAuthorizedError());
    }

    const expense = await Expense.create({
      amount,
      description,
      category,
      date,
      creator: currentUser,
      mediaFileId,
    });
    delete expense.creator;

    return res.status(201).json(expense);
  }

  @ValidateBody(CreateExpenseInput)
  static async update(
    req: Request,
    res: Response,
    next: NextFunction
    //@CurrentUser() currentUser
  ) {
    const { currentUser } = req;
    const { id } = req.params;
    const { amount, description, category, date, mediaFileId } = req.body;

    const expense = await Expense.findById(id);
    if (!expense) return next(new NotFoundError());
    if (expense.creator != currentUser.id)
      return next(new NotAuthorizedError());

    if (category) {
      const categoryDoc = await CategoryService.findById(category);
      if ((categoryDoc?.creator as UserDoc).id != currentUser.id)
        return next(new NotAuthorizedError());
    }

    await Expense.findByIdAndUpdate(id, { ...req.body });

    return res.status(201).json("expesnse updated successfully");
  }

  @ValidateQuery(ListExpensesInput)
  static async list(req, res) {
    let { pagination, order, filter } = req.query;
    const { currentUser } = req;

    pagination = plainToInstance(PaginationInput, pagination);

    const skip = pagination?.offset || 0;
    const limit = pagination?.limit || 0;
    const orderField = order?.field || "createdAt";
    const orderDirection = order?.direction || "desc";

    let dateFilter;
    if (filter?.dateFrom && filter?.dateTo) {
      dateFilter = { $gte: filter.dateFrom, $lte: filter.dateTo };
    } else if (filter?.dateFrom) {
      dateFilter = { $gte: filter.dateFrom };
    } else if (filter?.dateTo) {
      dateFilter = { $lte: filter.dateTo };
    }

    const expenses = await Expense.find({
      creator: currentUser.id,
      ...(filter?.description && {
        description: { $regex: `${filter.description}`, $options: "i" },
      }),
      ...(filter?.category && {
        category: filter.category,
      }),
      ...(dateFilter && {
        date: dateFilter,
      }),
    })
      .skip(skip)
      .limit(limit)
      .populate("category")
      .sort({ [orderField]: orderDirection });

    const count = await Expense.countDocuments({
      creator: currentUser.id,
      ...(filter?.description && {
        description: { $regex: `${filter.description}`, $options: "i" },
      }),
      ...(filter?.category && {
        category: filter.category,
      }),
      ...(dateFilter && {
        date: dateFilter,
      }),
    });

    return res.status(200).json({ expenses, count });
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    console.log(req.params.id);
    let { id } = req.params;
    const { currentUser } = req;

    const expense = await Expense.findById(id);
    if (expense.creator != currentUser.id)
      return next(new NotAuthorizedError());

    await Expense.findByIdAndDelete(id);
    return res.status(200).json("expense deleted successfully");
  }

  @ValidateQuery(ListExpensesInput)
  static async download(req, res) {
    let { filter } = req.query;
    const { currentUser } = req;

    let dateFilter;
    if (filter?.dateFrom && filter?.dateTo) {
      dateFilter = {
        $gte: new Date(filter.dateFrom),
        $lte: new Date(filter.dateTo),
      };
    } else if (filter?.dateFrom) {
      dateFilter = { $gte: new Date(filter.dateFrom) };
    } else if (filter?.dateTo) {
      dateFilter = { $lte: new Date(filter.dateTo) };
    }

    const mongoAggregation = [
      {
        $match: {
          creator: new ObjectId(currentUser.id),
          ...(filter?.description && {
            description: { $regex: `${filter.description}`, $options: "i" },
          }),
          ...(filter?.category && {
            category: filter.category,
          }),
          ...(dateFilter && {
            date: dateFilter,
          }),
        },
      },

      {
        $lookup: {
          from: "categories", // Replace with your actual collection name for categories
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $group: {
          _id: "$category",
          expenses: { $push: "$$ROOT" },
          categoryData: { $first: { $arrayElemAt: ["$categoryData", 0] } },
          count: { $sum: 1 },
          avgAmount: { $avg: "$amount" },
        },
      },
      {
        $project: {
          _id: 0, // Exclude _id field from the response
          category: "$_id",
          categoryDate: 1,
          count: 1,
          avgAmount: 1,
        },
      },
    ];

    const report = await Expense.aggregate(mongoAggregation);
    const category = await CategoryService.findById(filter?.category);

    const expensesName = "expense-" + uuid.v1() + ".pdf";
    const expensesPath = path.join("data", "expenses", expensesName);
    const file = File.create({
      name: expensesName,
      path: expensesPath,
      creator: currentUser.id,
    });

    const pdfDoc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'inline; filename="' + expensesName + '"'
    );
    pdfDoc.pipe(fs.createWriteStream(expensesPath));
    pdfDoc.pipe(res);

    pdfDoc.fontSize(26).text("Report", {
      underline: true,
    });
    pdfDoc.text("-----------------------");

    if (filter?.dateFrom)
      pdfDoc.fontSize(12).text(`date from: ${filter?.dateFrom.toString()} \n`);
    if (filter?.dateTo)
      pdfDoc.fontSize(12).text(`date to: ${filter?.dateTo.toString()} \n`);
    if (category) pdfDoc.fontSize(18).text(`category: ${category.name} \n`);
    pdfDoc.fontSize(24).text("-----------------------");

    let totalAmount = 0;
    report.forEach((entry) => {
      totalAmount += entry.avgAmount;
      pdfDoc
        .fontSize(14)
        .text(
          "category: " +
            entry.category?.name +
            " - " +
            "count: " +
            entry.count +
            " - " +
            "avg amount: " +
            entry.avgAmount +
            " \n "
        );
    });
    pdfDoc.text("---");
    pdfDoc.fontSize(20).text("Total Amount: $" + totalAmount);

    pdfDoc.end();

    //    return res.status(200).json(report);
  }

  @ValidateQuery(ListMonthlyReportExpensesInput)
  static async generateMonthlyReport(req, res) {
    const { month, year } = req.query?.filter;
    const { currentUser } = req;

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);

    const mongoAggregation = [
      {
        $match: {
          creator: new ObjectId(currentUser.id),
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },

      {
        $lookup: {
          from: "categories", // Replace with your actual collection name for categories
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $group: {
          _id: "$category",
          expenses: { $push: "$$ROOT" },
          categoryData: { $first: { $arrayElemAt: ["$categoryData", 0] } },
          count: { $sum: 1 },
          avgAmount: { $avg: "$amount" },
        },
      },
      {
        $project: {
          _id: 0, // Exclude _id field from the response
          category: "$_id",
          categoryDate: 1,
          count: 1,
          avgAmount: 1,
        },
      },
    ];

    const report = await Expense.aggregate(mongoAggregation);

    return res.status(200).json(report);
  }
}
