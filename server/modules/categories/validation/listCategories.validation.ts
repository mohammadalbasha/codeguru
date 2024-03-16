import { IsOptional, IsString } from "class-validator";
import { ListInput } from "../../common/validation/input";

export class CategoriesFilter {
  @IsString()
  @IsOptional()
  name: string;
}

export class ListCategoriesInput extends ListInput<CategoriesFilter> {}
