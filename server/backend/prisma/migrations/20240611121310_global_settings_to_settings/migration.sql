/*
  Warnings:

  - You are about to drop the `GlobalSettings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserSettings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "GlobalSettings";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserSettings";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "standby" BOOLEAN NOT NULL,
    "standby_start_time" INTEGER NOT NULL,
    "standby_end_time" INTEGER NOT NULL,
    "restart_at" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "language" TEXT NOT NULL,
    "theme" TEXT NOT NULL
);
