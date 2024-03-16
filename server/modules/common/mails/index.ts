import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { ConfigService } from "../config/config";

const transport = new SMTPTransport({
  name: "mohammad",
  host: ConfigService.getMailConfiguration().MAIL_HOST,
  port: ConfigService.getMailConfiguration().MAIL_PORT,
  secure: ConfigService.getMailConfiguration().MAIL_IS_SECURE,
  auth: {
    user: ConfigService.getMailConfiguration().MAIL_AUTH_USER,
    pass: ConfigService.getMailConfiguration().MAIL_AUTH_PASSWORD,
  },
});
const transporter = nodemailer.createTransport(transport);
export default transporter;
