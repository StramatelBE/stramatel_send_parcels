-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "standby" BOOLEAN NOT NULL,
    "standby_start_time" TEXT NOT NULL,
    "standby_end_time" TEXT NOT NULL,
    "restart_at" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "language" TEXT NOT NULL,
    "theme" TEXT NOT NULL
);
INSERT INTO "new_Settings" ("date", "id", "language", "restart_at", "standby", "standby_end_time", "standby_start_time", "theme") SELECT "date", "id", "language", "restart_at", "standby", "standby_end_time", "standby_start_time", "theme" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
PRAGMA foreign_key_check("Settings");
PRAGMA foreign_keys=ON;
