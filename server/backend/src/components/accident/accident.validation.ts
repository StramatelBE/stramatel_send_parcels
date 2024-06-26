import { IsBoolean, IsInt, IsDate } from "class-validator";

export class CreateAccidentDto {
  @IsInt()
  days_without_accident: number;

  @IsInt()
  record_days_without_accident: number;

  @IsInt()
  accidents_this_year: number;

  @IsBoolean()
  reset_on_new_year: boolean;
}
