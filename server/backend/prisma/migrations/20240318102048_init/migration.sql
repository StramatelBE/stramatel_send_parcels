/*
  Warnings:

  - You are about to drop the column `created_at` on the `Folder` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Folder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "parent_id" INTEGER,
    "updated_at" DATETIME NOT NULL,
    "folderId" INTEGER,
    CONSTRAINT "Folder_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Folder_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Folder" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Folder" ("id", "name", "updated_at", "user_id") SELECT "id", "name", "updated_at", "user_id" FROM "Folder";
DROP TABLE "Folder";
ALTER TABLE "new_Folder" RENAME TO "Folder";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
