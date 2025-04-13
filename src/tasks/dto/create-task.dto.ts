/*
  -> DTO - Data Transfer Object (Objeto de transferência de dados)
  -> Valida dados, transformar dados.
  -> Se usa para representar quais dados e em que formatos uma determinada camada aceita e trabalha
*/

import { IsNotEmpty, IsNumber, IsString, minLength, MinLength } from "class-validator";

export class CreateTaskDto {
  @IsNumber()
  @IsNotEmpty()
  readonly userId: number;

  @IsString({message: "O nome precisa ser um texto"})
  @MinLength(5, { message: "O nome precisa ter no mínimo 5 caracteres" })
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  readonly description: string;
}