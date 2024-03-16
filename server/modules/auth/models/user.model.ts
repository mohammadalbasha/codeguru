import mongoose, { Schema } from "mongoose";
import { Password } from "../utils/password";
import { CategoryDocument } from "../../categories/models/category.model";
import { ExpenseDocument } from "../../expenses/models/expense.model";

export interface UserDoc extends mongoose.Document {
  id: string;
  name: string;
  email: string;
  password: string;
  resetPasswordToken: string;
  categories?: CategoryDocument[];
  expenses?: ExpenseDocument[];
}

interface UserAttrs {
  name: string;
  password: string;
  email: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema<UserDoc>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    resetPasswordToken: {
      type: String,
      default: "",
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        //delete ret._id;
      },
      virtuals: true,
    },
    toObject: {
      transform(doc, ret) {
        ret.id = ret._id;
        //delete ret._id;
      },
      virtuals: true,
    },
  }
);

userSchema.virtual("expenses", {
  ref: "Expense", //The Model to use
  localField: "_id", //Find in Model, where localField
  foreignField: "creator", // is equal to foreignField
});

userSchema.virtual("categories", {
  ref: "Category", //The Model to use
  localField: "_id", //Find in Model, where localField
  foreignField: "creator", // is equal to foreignField
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

export const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
