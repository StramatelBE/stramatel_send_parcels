import { IsString, IsNotEmpty, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class FileDto {
  @IsString()
  @IsNotEmpty()
  fieldname: string;

  @IsString()
  @IsNotEmpty()
  originalname: string;

  @IsString()
  @IsNotEmpty()
  encoding: string;

  @IsString()
  @IsNotEmpty()
  mimetype: string;

  @Type(() => Number)
  @IsNotEmpty()
  size: number;

  @IsString()
  @IsNotEmpty()
  destination: string;

  @IsString()
  @IsNotEmpty()
  filename: string;

  @IsString()
  @IsNotEmpty()
  path: string;
}

export class CreateMediaDto {
  @ValidateNested()
  @Type(() => FileDto)
  file: FileDto;
}
