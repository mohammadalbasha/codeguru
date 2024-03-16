import mongoose, { Document, Schema } from "mongoose";
import { UserDoc } from "../../auth/models/user.model";
import {
  Category,
  CategoryDocument,
} from "../../categories/models/category.model";

export interface ExpenseDocument extends Document {
  id: string;
  amount: string;
  category: CategoryDocument;
  creator: UserDoc | string;
  date: Date;
  description: string;
  mediaFileId: string;
}

interface ExpenseModel extends mongoose.Model<ExpenseDocument> {}

const expenseSchema = new Schema(
  {
    amount: { type: "Number" },
    date: { type: Date, default: Date.now, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    description: {
      type: String,
    },
    mediaFileId: {
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
      },
    },
    toObject: {
      transform(doc, ret) {
        ret.id = ret._id;
      },
    },
  }
);

// Creating indexes on the date and creator fields
expenseSchema.index({ date: 1 });
expenseSchema.index({ creator: 1 });
expenseSchema.index({ category: 1 });

// Creating a text index on the description field
expenseSchema.index({
  description: "text",
});

export const Expense = mongoose.model<ExpenseDocument, ExpenseModel>(
  "Expense",
  expenseSchema
);
