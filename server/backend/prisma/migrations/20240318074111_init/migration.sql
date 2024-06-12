/*
  Warnings:

  - You are about to drop the `SlideshowMedia` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SlideshowMedia";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "PlaylistMedia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "media_id" INTEGER NOT NULL,
    "playlist_id" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 1,
    "position" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "PlaylistMedia_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "Media" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlaylistMedia_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "Playlist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
