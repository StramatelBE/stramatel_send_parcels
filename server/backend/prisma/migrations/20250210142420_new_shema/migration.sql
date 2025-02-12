/*
  Warnings:

  - You are about to drop the `Accident` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Settings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `duration` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `playlistId` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Media` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `Data` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Accident";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Settings";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "PlaylistItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "playlist_id" INTEGER NOT NULL,
    "media_id" INTEGER,
    "data_id" INTEGER,
    "position" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    CONSTRAINT "PlaylistItem_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "Playlist" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PlaylistItem_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "Media" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "PlaylistItem_data_id_fkey" FOREIGN KEY ("data_id") REFERENCES "Data" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AppSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "standby" BOOLEAN NOT NULL,
    "standby_start_time" TEXT NOT NULL,
    "standby_end_time" TEXT NOT NULL,
    "restart_at" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL,
    "language" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "brightness" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "days_without_accident" INTEGER NOT NULL,
    "record_days_without_accident" INTEGER NOT NULL,
    "accidents_this_year" INTEGER NOT NULL,
    "reset_on_new_year" BOOLEAN NOT NULL,
    "language" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "UserSettings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Data" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "value" TEXT,
    "type" TEXT,
    "edit" BOOLEAN NOT NULL DEFAULT true,
    "user_id" INTEGER NOT NULL,
    "background_id" INTEGER,
    CONSTRAINT "Data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Data_background_id_fkey" FOREIGN KEY ("background_id") REFERENCES "Media" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Data" ("edit", "id", "name", "type", "value") SELECT "edit", "id", "name", "type", "value" FROM "Data";
DROP TABLE "Data";
ALTER TABLE "new_Data" RENAME TO "Data";
CREATE TABLE "new_Media" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "original_file_name" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "uploaded_at" DATETIME NOT NULL,
    "thumbnail_id" INTEGER,
    CONSTRAINT "Media_thumbnail_id_fkey" FOREIGN KEY ("thumbnail_id") REFERENCES "Media" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Media" ("file_name", "format", "id", "original_file_name", "path", "size", "type", "uploaded_at") SELECT "file_name", "format", "id", "original_file_name", "path", "size", "type", "uploaded_at" FROM "Media";
DROP TABLE "Media";
ALTER TABLE "new_Media" RENAME TO "Media";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
