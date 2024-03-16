import { Category } from "../categroies/types";

export interface IExpenses {
  id?: string;
  description?: string;
  date?: string | Date;
  amount?: string;
  category?: string | Category;
  mediaFileId: string;
}

export interface IAddExpenseInput {
  description?: string;
  date?: string | Date;
  amount?: string;
  category?: string;
}

export interface IFilterExpensesInput {
  description?: string;
  dateFrom?: string | Date;
  dateTo?: string | Date;
  category?: string;
}

export interface IDeleteExpenseInput {
  id: string;
}
