import { Expense } from "../models/expense.model";

export default class ExpensesService {
  static findByCategory(category: string) {
    return Expense.find({ category });
  }

  static findTodayExpenses() {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    return Expense.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });
  }
}
