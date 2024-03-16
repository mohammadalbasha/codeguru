import { Transform, Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class PaginationInput {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit: number;

  @IsOptional()
  @Min(5)
  @Max(50)
  @Type(() => Number)
  offset: number;
}

export class OrderInput {
  @IsOptional()
  @IsString()
  field: string;

  @IsOptional()
  @IsString()
  direction: string;
}

export class ListInput<Filter> {
  pagination: PaginationInput;
  filter: Filter;
  order: OrderInput;
}
