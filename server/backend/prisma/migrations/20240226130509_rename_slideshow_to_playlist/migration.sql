/*
  Warnings:

  - You are about to drop the `Slideshow` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `slideshow_id` on the `Macro` table. All the data in the column will be lost.
  - You are about to drop the column `slideshow_id` on the `Mode` table. All the data in the column will be lost.
  - You are about to drop the column `media_dur_in_slideshow` on the `SlideshowMedia` table. All the data in the column will be lost.
  - You are about to drop the column `media_pos_in_slideshow` on the `SlideshowMedia` table. All the data in the column will be lost.
  - You are about to drop the column `slideshow_id` on the `SlideshowMedia` table. All the data in the column will be lost.
  - Added the required column `playlist_id` to the `SlideshowMedia` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Slideshow";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Playlist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "Playlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Macro" (
    "playlist_id" INTEGER,
    "button_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    PRIMARY KEY ("button_id", "user_id"),
    CONSTRAINT "Macro_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "Playlist" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Macro_button_id_fkey" FOREIGN KEY ("button_id") REFERENCES "Button" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Macro_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Macro" ("button_id", "user_id") SELECT "button_id", "user_id" FROM "Macro";
DROP TABLE "Macro";
ALTER TABLE "new_Macro" RENAME TO "Macro";
CREATE TABLE "new_Mode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mode" TEXT,
    "playlist_id" INTEGER,
    CONSTRAINT "Mode_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "Playlist" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Mode" ("id", "mode") SELECT "id", "mode" FROM "Mode";
DROP TABLE "Mode";
ALTER TABLE "new_Mode" RENAME TO "Mode";
CREATE TABLE "new_SlideshowMedia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "media_id" INTEGER NOT NULL,
    "playlist_id" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 1,
    "position" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "SlideshowMedia_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "Media" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SlideshowMedia_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "Playlist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SlideshowMedia" ("id", "media_id") SELECT "id", "media_id" FROM "SlideshowMedia";
DROP TABLE "SlideshowMedia";
ALTER TABLE "new_SlideshowMedia" RENAME TO "SlideshowMedia";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
