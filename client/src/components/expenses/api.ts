import axiosInstance from "../../services/api/api.service";
import { IPagintation } from "../../services/api/types";
import {
  IAddExpenseInput,
  IDeleteExpenseInput,
  IFilterExpensesInput,
} from "./types";

export const fetchExpenses = async (
  pagination: IPagintation,
  filter: IFilterExpensesInput
) => {
  let queryParams = `?pagination[limit]=${pagination.limit}&pagination[offset]=${pagination.offset}&`;
  Object.entries(filter).forEach(([key, value]) => {
    if (value && value != "") queryParams += `filter[${key}]=${value}&`;
  });
  try {
    const expenses = await axiosInstance.get("/expenses" + queryParams);
    return expenses.data;
  } catch (err) {
    throw err;
  }
};

export const addExpense = async (data: IAddExpenseInput) => {
  try {
    const expenses = await axiosInstance.post("/expenses", {
      ...data,
      amount: +data.amount!,
    });
    return expenses.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateExpense = async (data: IAddExpenseInput, id: string) => {
  try {
    const expenses = await axiosInstance.put(`/expenses/${id}`, {
      ...data,
      amount: +data.amount!,
    });
    return expenses.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const deleteExpense = async (data: IDeleteExpenseInput) => {
  try {
    await axiosInstance.delete(`/expenses/${data.id}`);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const downloadReport = async (filter: IFilterExpensesInput) => {
  let queryParams = `?`;
  Object.entries(filter).forEach(([key, value]) => {
    if (value && value != "") queryParams += `filter[${key}]=${value}&`;
  });
  try {
    const response = await axiosInstance.get(
      "/expenses/downloadReport" + queryParams,
      {
        responseType: "blob",
      }
    );
    return response.data;
  } catch (error) {
    // Handle error
  }
};

export const downloadInvoice = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/files/${id}`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    // Handle error
  }
};
