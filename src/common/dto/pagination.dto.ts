import { Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, Max, Min } from "class-validator";

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(50)
  @Type(() => Number)
  limit: number;
  
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  offset: number;
}