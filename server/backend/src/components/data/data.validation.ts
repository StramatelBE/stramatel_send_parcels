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

  @IsIn(["INT", "BOOLEAN", "STRING"])
  @IsString()
  public type: string;
}
