import "reflect-metadata";
import { validate, IsEmail, Length, IsString } from "class-validator";
import express from "express";

export class ResetPasswordInput {
  @IsEmail()
  email: string;

  @Length(8, 30)
  password: string;

  @IsString()
  resetPasswordToken: string;
}
