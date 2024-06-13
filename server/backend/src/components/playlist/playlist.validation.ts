import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { FileDto } from "../medias/media.validation";

export class CreatePlaylistDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(32)
  public name: string;

  user_id: number;
}

export class UpdatePlaylistDto extends CreatePlaylistDto {}

export class updateMediasInPlaylist {
  @IsNotEmpty()
  medias: FileDto[];
}
