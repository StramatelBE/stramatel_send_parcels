/*
  Warnings:

  - Added the required column `user_id` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Media" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "original_file_name" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "uploaded_at" DATETIME NOT NULL,
    "thumbnail_id" INTEGER,
    CONSTRAINT "Media_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Media_thumbnail_id_fkey" FOREIGN KEY ("thumbnail_id") REFERENCES "Media" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Media" ("file_name", "format", "id", "original_file_name", "path", "size", "thumbnail_id", "type", "uploaded_at") SELECT "file_name", "format", "id", "original_file_name", "path", "size", "thumbnail_id", "type", "uploaded_at" FROM "Media";
DROP TABLE "Media";
ALTER TABLE "new_Media" RENAME TO "Media";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
