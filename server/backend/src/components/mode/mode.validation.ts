import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateModeDto {
  @IsString()
  @IsNotEmpty()
  public mode: string;
}

export class UpdateModeDto {
  @IsString()
  @IsNotEmpty()
  public mode: string;
}
