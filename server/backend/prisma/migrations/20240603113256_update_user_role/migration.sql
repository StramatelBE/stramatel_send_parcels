/*
  Warnings:

  - You are about to drop the `ActiveSession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Button` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Folder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GlobalSetting` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Macro` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Mode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Scoring` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserSetting` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `file_name` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `folder_id` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `original_file_name` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `active_token` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `first_login` on the `User` table. All the data in the column will be lost.
  - Added the required column `fileName` to the `Media` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastModified` to the `Media` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalFileName` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ActiveSession";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Button";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Folder";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "GlobalSetting";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Macro";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Mode";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Scoring";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserSetting";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "UserSettings" (
    "user_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "language" TEXT NOT NULL,
    CONSTRAINT "UserSettings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GlobalSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "standby" BOOLEAN NOT NULL,
    "standby_start_time" INTEGER NOT NULL,
    "standby_end_time" INTEGER NOT NULL,
    "restart_at" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Accident" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "days_without_accident" TEXT NOT NULL,
    "record_days_without_accident" TEXT NOT NULL,
    "number_of_accidents_since_start_of_the_year" TEXT NOT NULL,
    "reset_on_new_year" TEXT NOT NULL,
    "scrolling_text" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PlaylistMedia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "media_id" INTEGER NOT NULL,
    "playlist_id" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    CONSTRAINT "PlaylistMedia_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "Media" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlaylistMedia_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "Playlist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PlaylistMedia" ("id", "duration", "media_id", "position", "playlist_id") SELECT "id", "duration", "media_id", "position", "playlist_id" FROM "PlaylistMedia";
DROP TABLE "PlaylistMedia";
ALTER TABLE "new_PlaylistMedia" RENAME TO "PlaylistMedia";
CREATE TABLE "new_Media" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "originalFileName" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "lastModified" INTEGER NOT NULL,
    "size" INTEGER NOT NULL,
    "uploaded_at" DATETIME NOT NULL,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "Media_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Media" ("format", "id", "path", "size", "type", "uploaded_at", "user_id") SELECT "format", "id", "path", "size", "type", "uploaded_at", "user_id" FROM "Media";
DROP TABLE "Media";
ALTER TABLE "new_Media" RENAME TO "Media";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER'
);
INSERT INTO "new_User" ("id", "password", "role", "username") SELECT "id", "password", "role", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
