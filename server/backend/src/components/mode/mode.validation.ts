import {
  IsNotEmpty,
  IsString
} from "class-validator";

export class CreateModeDto {
  @IsString()
  @IsNotEmpty()
  public mode: string;
}

export class UpdateModeDto {
  @IsString()
  public name?: string;
}
