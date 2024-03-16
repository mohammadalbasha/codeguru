import { IsOptional, IsString } from "class-validator";
import { ListInput } from "../../common/validation/input";
import { IsCustomDate } from "../../common/validation/decorators/isDate.decorator";

export class ExpensesFilter {
  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  category: string;

  @IsCustomDate()
  @IsOptional()
  dateFrom: string;

  @IsCustomDate()
  @IsOptional()
  dateTo: string;
}

export class ListExpensesInput extends ListInput<ExpensesFilter> {}

export class MonthlyReportInput {
  @IsString()
  year: string;

  @IsString()
  month: string;
}

export class ListMonthlyReportExpensesInput extends ListInput<MonthlyReportInput> {}
