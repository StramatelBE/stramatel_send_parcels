import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  public username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  public password: string;

  @IsString()
  @IsNotEmpty()
  public language: string;

  @IsString()
  @IsNotEmpty()
  public theme: string;
}

export class UpdateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  public username: string;

  @IsString()
  @MinLength(9)
  @MaxLength(32)
  public password: string;

  @IsString()
  public language: string;

  @IsString()
  public theme: string;
}
