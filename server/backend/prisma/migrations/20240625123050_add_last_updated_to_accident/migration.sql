/*
  Warnings:

  - Added the required column `last_updated` to the `Accident` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Accident" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "days_without_accident" INTEGER NOT NULL,
    "record_days_without_accident" INTEGER NOT NULL,
    "accidents_this_year" INTEGER NOT NULL,
    "reset_on_new_year" BOOLEAN NOT NULL,
    "last_updated" DATETIME NOT NULL
);
INSERT INTO "new_Accident" ("accidents_this_year", "days_without_accident", "id", "record_days_without_accident", "reset_on_new_year") SELECT "accidents_this_year", "days_without_accident", "id", "record_days_without_accident", "reset_on_new_year" FROM "Accident";
DROP TABLE "Accident";
ALTER TABLE "new_Accident" RENAME TO "Accident";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
