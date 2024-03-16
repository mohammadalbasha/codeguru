import axiosInstance from "../../services/api/api.service";
import { setAuthorizationHeader } from "../../services/api/api.service";

export const fetchExpensesMonthlyReport = async (filter) => {
  let queryParams = `?`;
  Object.entries(filter).forEach(([key, value]) => {
    if (value && value != "") queryParams += `filter[${key}]=${value}&`;
  });
  try {
    await setAuthorizationHeader();
    const expenses = await axiosInstance.get(
      "/expenses/monthlyReport" + queryParams
    );
    return expenses.data;
  } catch (err) {
    throw err;
  }
};
