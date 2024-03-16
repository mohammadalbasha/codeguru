import mongoose, { Schema } from "mongoose";
import { UserDoc } from "../../auth/models/user.model";

export interface FileDoc extends mongoose.Document {
  id: string;
  path: string;
  creator: UserDoc | string;
  name: string;
}

interface FileModel extends mongoose.Model<FileDoc> {}

const fileSchema = new mongoose.Schema<FileDoc>(
  {
    name: {
      type: String,
    },
    path: {
      type: String,
      required: true,
    },
    creator: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      require: true,
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

export const File = mongoose.model<FileDoc, FileModel>("File", fileSchema);
