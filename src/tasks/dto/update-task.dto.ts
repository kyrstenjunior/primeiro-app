/*
  -> DTO - Data Transfer Object (Objeto de transferência de dados)
  -> Valida dados, transformar dados.
  -> Se usa para representar quais dados e em que formatos uma determinada camada aceita e trabalha
*/

import { PartialType } from "@nestjs/mapped-types";
import { CreateTaskDto } from "./create-task.dto";
import { IsBoolean, IsOptional } from "class-validator";

// import { IsBoolean, IsOptional, IsString } from "class-validator";

// export class UpdateTaskDto {
//   @IsString()
//   @IsOptional()
//   readonly name?: string;

//   @IsString()
//   @IsOptional()
//   readonly description?: string;

//   @IsBoolean()
//   @IsOptional()
//   readonly completed?: boolean;
// }

// O PartialType da lib mapped-types traz os itens de CreateTaskDto como opcionais
export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsBoolean()
  @IsOptional()
  readonly completed?: boolean;
}