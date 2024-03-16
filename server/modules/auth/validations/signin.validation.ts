import "reflect-metadata";
import { validate, IsEmail, Length } from "class-validator";
import express from "express";

export class SigninInput {
  @IsEmail()
  email: string;

  @Length(8, 30)
  password: string;
}
