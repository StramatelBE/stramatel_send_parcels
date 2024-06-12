/*
  Warnings:

  - You are about to drop the column `data_boolean_1` on the `Data` table. All the data in the column will be lost.
  - You are about to drop the column `data_boolean_2` on the `Data` table. All the data in the column will be lost.
  - You are about to drop the column `data_boolean_3` on the `Data` table. All the data in the column will be lost.
  - You are about to drop the column `data_int_1` on the `Data` table. All the data in the column will be lost.
  - You are about to drop the column `data_int_2` on the `Data` table. All the data in the column will be lost.
  - You are about to drop the column `data_int_3` on the `Data` table. All the data in the column will be lost.
  - You are about to drop the column `data_string_1` on the `Data` table. All the data in the column will be lost.
  - You are about to drop the column `data_string_2` on the `Data` table. All the data in the column will be lost.
  - You are about to drop the column `data_string_3` on the `Data` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Data" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "data" TEXT,
    "type" TEXT
);
INSERT INTO "new_Data" ("id") SELECT "id" FROM "Data";
DROP TABLE "Data";
ALTER TABLE "new_Data" RENAME TO "Data";
PRAGMA foreign_key_check("Data");
PRAGMA foreign_keys=ON;
