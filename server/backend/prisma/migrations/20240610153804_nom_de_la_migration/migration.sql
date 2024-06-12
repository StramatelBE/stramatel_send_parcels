-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Data" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data_string_1" TEXT,
    "data_string_2" TEXT,
    "data_string_3" TEXT,
    "data_int_1" INTEGER,
    "data_int_2" INTEGER,
    "data_int_3" INTEGER,
    "data_boolean_1" BOOLEAN,
    "data_boolean_2" BOOLEAN,
    "data_boolean_3" BOOLEAN
);
INSERT INTO "new_Data" ("data_boolean_1", "data_boolean_2", "data_boolean_3", "data_int_1", "data_int_2", "data_int_3", "data_string_1", "data_string_2", "data_string_3", "id") SELECT "data_boolean_1", "data_boolean_2", "data_boolean_3", "data_int_1", "data_int_2", "data_int_3", "data_string_1", "data_string_2", "data_string_3", "id" FROM "Data";
DROP TABLE "Data";
ALTER TABLE "new_Data" RENAME TO "Data";
PRAGMA foreign_key_check("Data");
PRAGMA foreign_keys=ON;
