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

export class CreateExpenseInput {
  @IsNumber()
  amount: number;

  @IsString()
  description: string;

  @IsCustomDate()
  date: string;

  @IsString()
  @IsOptional()
  category: string;
}
