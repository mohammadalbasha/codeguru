import { response } from "express";
import transporter from "../index";
import handlebars from "handlebars";
const fs = require("fs");
import { join, resolve } from "path";
import { ConfigService } from "../../config/config";

export class MailService {
  static async sendResetPasswordEmail(email: string, resetPasswordToken: any) {
    const resetPasswordTemplateSource = fs.readFileSync(
      resolve(__dirname, "../templates/sendResetPasswordLink.hbs"),
      "utf8"
    );
    const resetPasswordTemplate = handlebars.compile(
      resetPasswordTemplateSource
    );

    const link = `${
      ConfigService.getFrontendDomainsConfiguration().RESET_PASSWORD_LINK
    }?email=${email}&resetPasswordToken=${resetPasswordToken}`;
    const resetPasswordLink = {
      link,
    };

    const compiledresetPassowrdTemplate =
      resetPasswordTemplate(resetPasswordLink);

    // IT IS BETTER TO USE HANDLEBARS TEMPLATES
    // BUT GET SOME COMPILATION ISSUES

    // GOT SOME ISSUES WHEN SENDING EMAIL INSIDE A DOCKER CONTAINER
    if (
      ConfigService.getEnvironmentConfiguration().RUN_ENVIRONMENT != "docker"
    ) {
      try {
        await transporter.sendMail({
          from: '"CodeGuru"', // sender address
          to: email, // list of receivers
          subject: " Reset Password ✔", // Subject line
          html: `
                      <div
                      style="width:100%;height:80vh; display:flex; flex-direction:column; align-items:center;background-color:#FACA15 ;border-radius:10px;color:white"
                    >
                      <h1>
                        CodeGuru
                      </h1>
                      <h3>
                        Forget Your Password
                      </h3>
                      <p>for resetting your password, click the link below:</p>
                      <a
                        style="margin-top: 1rem;padding:2rem;background-color:#155e75 ;border-radius:10px;color:white"
                        href=${link}
                      >please click</a>
                    </div>`,
        });
      } catch (err) {
        console.log(err);
      }
    }
  }
}
