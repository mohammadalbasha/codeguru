import "reflect-metadata";
import { validate, IsEmail, Length } from "class-validator";
import express from "express";

export class SendResetPasswordLinkInput {
  @IsEmail()
  email: string;
}
