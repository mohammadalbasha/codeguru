import express, {
  Express,
  Request,
  Response,
  NextFunction,
  Application,
} from "express";
import { json } from "body-parser";
import * as http from "http";
import cookieSession from "cookie-session";
//import cookieParser from "cookie-parser";
import cors from "cors";
import SocketIOController from "./io";
import { signinRouter } from "./modules/auth/routes/signin";
import { signupRouter } from "./modules/auth/routes/signup";
import DB from "./db";
import { currentUserRouter } from "./modules/auth/routes/current-user";
import { errorHandler } from "./modules/auth/middlewares/error-handler";
import cookieParser from "cookie-parser";
import { createExpenseRoute } from "./modules/expenses/routes/createExpense.route";
import { createCategoryRoute } from "./modules/categories/routes/createCategory.route";
import { listCategoriesRoute } from "./modules/categories/routes/listCategory.route";
import { listExpensesRoute } from "./modules/expenses/routes/listExpenses.route";
import { monthlyReportRoute } from "./modules/expenses/routes/monthlyExpensesReport.route";
import { downloadReportRoute } from "./modules/expenses/routes/downloadReport,route";
import { FilesRouter } from "./modules/file/routes/file.route";
import { deleteCategoryRoute } from "./modules/categories/routes/deleteCategory.route";
import { ConfigService } from "./modules/common/config/config";
import { sendResetPasswordLinkRouter } from "./modules/auth/routes/sendResetPasswordLink";
import { resetPasswordRouter } from "./modules/auth/routes/resetPassword";
import { deleteExpenseRoute } from "./modules/expenses/routes/deleteExpense.route";
import { NotificationsRouter } from "./modules/notifications/routes/notifications.route";
import { CacheController } from "./modules/common/caching/cache";
import { updateExpenseRoute } from "./modules/expenses/routes/updateExpense.route";

const app: any = express();

// SERVER SETUP

app.use(json());
app.set("trust proxy", 1); // trust first proxy

// THIS FOR STORING SESSIONS AND COOKIES AT THE CLIENT AND GET THEM BACK
app.use(
  cookieSession({
    signed: false,
    //secure: process.env.NODE_ENV !== "test",
    httpOnly: true,
  })
);

// THIS FOR READING COOKIES FROM HEADERS , AND STORE THEM IN REQ.COOKIES
app.use(cookieParser());
// app.use((req: any, res: any, next: any) => {
//   console.log(req.headers.cookie);
//   console.log(req.cookies);
//   next();
// });

app.use(
  cors({
    origin: ConfigService.getFrontendDomainsConfiguration().DOMAIN,
    //origin: "*",
    credentials: true,
    methods: ["POST", "GET", "PUT", "PATCH", "DELETE"],
  })
);

// ROUTES

// AUTH

app.use(signinRouter);
app.use(currentUserRouter);
app.use(signupRouter);
app.use(sendResetPasswordLinkRouter);
app.use(resetPasswordRouter);

// EXPENSES
app.use(createExpenseRoute);
app.use(listExpensesRoute);
app.use(deleteExpenseRoute);
app.use(updateExpenseRoute);
app.use(monthlyReportRoute);
app.use(downloadReportRoute);

// CATEGORIES
app.use(createCategoryRoute);
app.use(listCategoriesRoute);
app.use(deleteCategoryRoute);

// Media File
app.use(FilesRouter);

// NOTIFICATIONS
app.use(NotificationsRouter);

(async () => {
  try {
    // SERVER INITIALIZATION

    const server = http.createServer(app);

    await new Promise<void>((resolve) =>
      server.listen({ port: ConfigService.getPORT() }, resolve)
    );

    console.log(
      `🚀 Server ready at http://localhost:${ConfigService.getPORT()}/`
    );

    //DB AND SOCKET AND REDIS CONNECTION

    // SocketIOController.instance().initialize(server);
    // SocketIOController.instance().start();

    DB.instance().initialize();

    CacheController.instance().initialize();
  } catch (err) {
    console.log(err);
    // SocketIOController.instance().closeServer();
    DB.instance().closeConnection();
  }

  process.on("SIGINT", async () => {
    await DB.instance().closeConnection();
    process.exit(0);
  });

  // ERROR HANDLING
  app.use(errorHandler);
})();
