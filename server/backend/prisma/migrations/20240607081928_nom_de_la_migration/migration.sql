/*
  Warnings:

  - You are about to drop the `PlaylistMedia` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `duration` to the `Media` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PlaylistMedia";
PRAGMA foreign_keys=on;

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
    "duration" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "playlistId" INTEGER,
    CONSTRAINT "Media_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Media_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Media" ("file_name", "format", "id", "original_file_name", "path", "size", "type", "uploaded_at", "user_id") SELECT "file_name", "format", "id", "original_file_name", "path", "size", "type", "uploaded_at", "user_id" FROM "Media";
DROP TABLE "Media";
ALTER TABLE "new_Media" RENAME TO "Media";
PRAGMA foreign_key_check("Media");
PRAGMA foreign_keys=ON;
