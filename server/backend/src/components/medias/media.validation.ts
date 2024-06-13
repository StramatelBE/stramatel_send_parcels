import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsNumber,
  IsDate,
  IsOptional,
} from "class-validator";
import { Type } from "class-transformer";

export class FileDto {
  @IsNumber()
  id: number;

  @IsString()
  original_file_name: string;

  @IsString()
  file_name: string;

  @IsString()
  path: string;

  @IsString()
  format: string;

  @IsString()
  type: string;

  @IsNumber()
  size: number;

  @IsDate()
  uploaded_at: Date;

  @IsNumber()
  user_id: number;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsNumber()
  position: number;

  @IsNumber()
  playlistId: number;
}

export class CreateMediaDto {
  @ValidateNested()
  @Type(() => FileDto)
  file: FileDto;
}
