import { IsNumber, IsOptional } from "class-validator";

export class CreatePlaylistItemDto {
  @IsNumber()
  playlist_id: number;

  @IsNumber()
  @IsOptional()
  media_id?: number;

  @IsNumber()
  @IsOptional()
  data_id?: number;

  @IsOptional()
  @IsNumber()
  position?: number;

  @IsOptional()
  @IsNumber()
  duration: number;
}

export class UpdateMediasInPlaylistDto {
  @IsNumber()
  @IsOptional()
  media_id?: number;

  @IsNumber()
  @IsOptional()
  data_id?: number;

  @IsOptional()
  @IsNumber()
  position?: number;

  @IsOptional()
  @IsNumber()
  duration?: number;
}
