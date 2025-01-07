-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Data" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "value" TEXT,
    "type" TEXT,
    "edit" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_Data" ("id", "name", "type", "value") SELECT "id", "name", "type", "value" FROM "Data";
DROP TABLE "Data";
ALTER TABLE "new_Data" RENAME TO "Data";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
