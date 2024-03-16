import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/landing-page/landing-page";
import { ErrorPage } from "../pages/error/error";
import Main from "../pages/main/main";
import { Authenticated } from "./protected-routes/authenticated";
import { SigninPage } from "../pages/signin/signin";
import { ReportsPage } from "../pages/reports/report";
import { CategoriesPage } from "../pages/categories/categories";
import { ExpensesPage } from "../pages/expenses/expenses";
import { SignupPage } from "../pages/signup/signup";
import { SendResetPasswordsPage } from "../pages/sendResetPassword/sendResetPassowrd";
import ResetPassword from "../components/auth/resetPassword";
import { ResetPasswordsPage } from "../pages/resetPassword/resetPassowrd";

export const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    element: <Main />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },

      {
        path: "/reports",
        element: (
          <Authenticated>
            <ReportsPage />
          </Authenticated>
        ),
      },
      {
        path: "/expenses",
        element: (
          <Authenticated>
            <ExpensesPage />
          </Authenticated>
        ),
      },

      {
        path: "/categories",
        element: <CategoriesPage />,
      },

      {
        path: "/signin",
        element: <SigninPage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
      {
        path: "/sendResetPasswordLink",
        element: <SendResetPasswordsPage />,
      },
      {
        path: "/resetPassword",
        element: <ResetPasswordsPage />,
      },
    ],
  },
]);
