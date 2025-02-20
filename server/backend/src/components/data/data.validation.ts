import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class CreateDataDto {
  @IsString()
  @MaxLength(50)
  public name: string;

  @IsString()
  @IsOptional()
  public backgroundColor?: string;

  @IsString()
  public value: string;

  @IsIn(["INT", "BOOLEAN", "STRING", "EDIT", "DATA"])
  @IsString()
  public type: string;

  @IsString()
  @IsOptional()
  public backgroundImage?: string;

  @IsNumber()
  @IsOptional()
  public user_id?: number;
}

export class UpdateDataDto {
  @IsString()
  @IsOptional()
  public name?: string;

  @IsString()
  @IsOptional()
  public value?: string;

  @IsNumber()
  @IsOptional()
  public background_id?: number;

  @IsString()
  @IsOptional()
  public backgroundColor?: string;
}
