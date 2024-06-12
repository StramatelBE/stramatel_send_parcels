import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreatePlaylistDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(32)
  public name: string;

  @IsNotEmpty()
  @IsNumber()
  @MinLength(1)
  @MaxLength(32)
  public user_id: number;
}
