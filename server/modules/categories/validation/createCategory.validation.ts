import "reflect-metadata";
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  isDate,
} from "class-validator";
import express from "express";
import { IsCustomDate } from "../../common/validation/decorators/isDate.decorator";

export class CreateCategoryInput {
  @IsString()
  name: string;

  @IsString()
  @Length(4, 30)
  description: string;
}
