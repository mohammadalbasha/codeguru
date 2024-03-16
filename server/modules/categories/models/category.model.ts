import mongoose from "mongoose";
import { UserDoc } from "../../auth/models/user.model";

export interface CategoryDocument extends mongoose.Document {
  name: string;
  creator: UserDoc | string;
  createdAt: string;
  description: string;
}

interface CategoryModel extends mongoose.Model<CategoryDocument> {}

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    creator: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      require: true,
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
    description: {
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
categorySchema.index({ creator: 1 });

export const Category = mongoose.model<CategoryDocument, CategoryModel>(
  "Category",
  categorySchema
);
