import {
  IsIn,
  IsString,
  MaxLength
} from "class-validator";

export class CreateDataDto {
  @IsString()
  @MaxLength(50)
  public name: string;

  @IsString()
  public value: string;

  @IsIn(["INT", "BOOLEAN", "STRING", "EDIT"])
  @IsString()
  public type: string;
}

export class UpdateDataDto {


  @IsString()
  public value?: string;


}