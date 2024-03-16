import axiosInstance from "../../services/api/api.service";
import { IPagintation } from "../../services/api/types";
import { IMonthlyReportFilterExpensesInput } from "./types";

export const fetchExpensesMonthlyReport = async (
  filter: IMonthlyReportFilterExpensesInput
) => {
  let queryParams = `?`;
  Object.entries(filter).forEach(([key, value]) => {
    if (value && value != "") queryParams += `filter[${key}]=${value}&`;
  });
  try {
    const expenses = await axiosInstance.get(
      "/expenses/monthlyReport" + queryParams
    );
    return expenses.data;
  } catch (err) {
    throw err;
  }
};
