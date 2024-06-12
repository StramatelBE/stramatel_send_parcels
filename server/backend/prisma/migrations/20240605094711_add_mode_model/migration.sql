/*
  Warnings:

  - You are about to drop the `Accident` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `fileName` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `lastModified` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `originalFileName` on the `Media` table. All the data in the column will be lost.
  - Added the required column `file_name` to the `Media` table without a default value. This is not possible if the table is not empty.
  - Added the required column `original_file_name` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Accident";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Mode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mode" TEXT,
    "playlist_id" INTEGER,
    CONSTRAINT "Mode_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "Playlist" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Data" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data_string_1" TEXT NOT NULL,
    "data_string_2" TEXT NOT NULL,
    "data_string_3" TEXT NOT NULL,
    "data_int_1" INTEGER NOT NULL,
    "data_int_2" INTEGER NOT NULL,
    "data_int_3" INTEGER NOT NULL,
    "data_boolean_1" BOOLEAN NOT NULL,
    "data_boolean_2" BOOLEAN NOT NULL,
    "data_boolean_3" BOOLEAN NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Media" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "original_file_name" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "uploaded_at" DATETIME NOT NULL,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "Media_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Media" ("format", "id", "path", "size", "type", "uploaded_at", "user_id") SELECT "format", "id", "path", "size", "type", "uploaded_at", "user_id" FROM "Media";
DROP TABLE "Media";
ALTER TABLE "new_Media" RENAME TO "Media";
PRAGMA foreign_key_check("Media");
PRAGMA foreign_keys=ON;
