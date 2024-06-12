import { IsBoolean, IsInt, IsNotEmpty, IsString } from "class-validator";

export class SettingsDto {
  @IsBoolean()
  @IsNotEmpty()
  standby: boolean;

  @IsInt()
  @IsNotEmpty()
  standby_start_time: number;

  @IsInt()
  @IsNotEmpty()
  standby_end_time: number;

  @IsInt()
  @IsNotEmpty()
  restart_at: number;

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsString()
  @IsNotEmpty()
  theme: string;
}
