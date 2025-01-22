import { IsBoolean, IsString, IsNotEmpty, IsNumber } from "class-validator";

export class SettingsDto {
  @IsBoolean()
  @IsNotEmpty()
  standby: boolean;

  @IsString()
  @IsNotEmpty()
  standby_start_time: string; // Heure au format HH:mm

  @IsString()
  @IsNotEmpty()
  standby_end_time: string; // Heure au format HH:mm

  @IsString()
  @IsNotEmpty()
  restart_at: string; // Heure au format HH:mm

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsString()
  @IsNotEmpty()
  theme: string;

  @IsNumber()
  @IsNotEmpty()
  brightness: number;
}
