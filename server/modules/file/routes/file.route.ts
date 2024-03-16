import express, { NextFunction, Request, Response } from "express";
import { currentUser } from "../../auth/middlewares/current-user";
import { requireAuth } from "../../auth/middlewares/require-auth";
import { File } from "../models/file.model";
import { NotFoundError } from "../../common/errors/not-found-error";
import { NotAuthorizedError } from "../../common/errors/not-authorized-error";
import * as fs from "fs";
import uploadFile from "../../../file";
import { BadRequestError } from "../../common/errors/bad-request-error";

const router = express.Router();

router.get(
  "/api/files/:id",

  currentUser,
  requireAuth,
  async (req, res, next) => {
    const { id } = req.params;
    const { currentUser } = req;
    const file = await File.findById(id);
    if (!file) return next(new NotFoundError());

    if (file.creator != currentUser.id) return next(new NotAuthorizedError());

    console.log(file);
    const fileData = fs.createReadStream(file?.path);

    fileData.pipe(res);
  }
);

router.post(
  "/api/files",
  uploadFile.single("file"),
  currentUser,
  requireAuth,
  async (req, res, next) => {
    const file = req.file;
    if (!file) return next(new BadRequestError("file not found"));
    const { currentUser } = req;
    const fileData = await File.create({
      creator: currentUser.id,
      path: file.path,
      name: file.originalname,
    });
    return res.status(201).json(fileData);
  }
);

export { router as FilesRouter };
