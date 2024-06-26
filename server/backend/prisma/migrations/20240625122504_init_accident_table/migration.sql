-- CreateTable
CREATE TABLE "Accident" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "days_without_accident" INTEGER NOT NULL,
    "record_days_without_accident" INTEGER NOT NULL,
    "accidents_this_year" INTEGER NOT NULL,
    "reset_on_new_year" BOOLEAN NOT NULL
);
