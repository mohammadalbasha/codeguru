import { User } from "../models/user.model";
import { ObjectId } from "mongoose";

export default {
  findById(id: string) {
    return User.findById(id);
    // .populate({
    //   path: "expenses",
    //   populate: [{ path: "category" }],
    // });
  },
};
