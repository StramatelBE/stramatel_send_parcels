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
    CONSTRAINT "Media_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Media" ("duration", "file_name", "format", "id", "original_file_name", "path", "playlistId", "position", "size", "type", "uploaded_at", "user_id") SELECT "duration", "file_name", "format", "id", "original_file_name", "path", "playlistId", "position", "size", "type", "uploaded_at", "user_id" FROM "Media";
DROP TABLE "Media";
ALTER TABLE "new_Media" RENAME TO "Media";
PRAGMA foreign_key_check("Media");
PRAGMA foreign_keys=ON;
