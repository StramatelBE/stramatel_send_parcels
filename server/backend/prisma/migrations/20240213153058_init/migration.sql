-- CreateTable
CREATE TABLE "ActiveSession" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER,
    "active_token" TEXT,
    "last_activity" DATETIME,
    CONSTRAINT "ActiveSession_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SlideshowMedia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "media_id" INTEGER NOT NULL,
    "slideshow_id" INTEGER NOT NULL,
    "media_dur_in_slideshow" INTEGER NOT NULL DEFAULT 1,
    "media_pos_in_slideshow" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "SlideshowMedia_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "Media" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SlideshowMedia_slideshow_id_fkey" FOREIGN KEY ("slideshow_id") REFERENCES "Slideshow" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Slideshow" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "Slideshow_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Macro" (
    "slideshow_id" INTEGER,
    "button_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    PRIMARY KEY ("button_id", "user_id"),
    CONSTRAINT "Macro_slideshow_id_fkey" FOREIGN KEY ("slideshow_id") REFERENCES "Slideshow" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Macro_button_id_fkey" FOREIGN KEY ("button_id") REFERENCES "Button" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Macro_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Button" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Folder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Folder_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Media" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "original_file_name" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "uploaded_at" DATETIME NOT NULL,
    "user_id" INTEGER NOT NULL,
    "folder_id" INTEGER,
    CONSTRAINT "Media_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Media_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "Folder" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Mode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mode" TEXT,
    "slideshow_id" INTEGER,
    CONSTRAINT "Mode_slideshow_id_fkey" FOREIGN KEY ("slideshow_id") REFERENCES "Slideshow" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserSetting" (
    "user_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "event_auto" BOOLEAN NOT NULL DEFAULT false,
    "language" TEXT,
    CONSTRAINT "UserSetting_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Scoring" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "timer" INTEGER,
    "score_team1" INTEGER,
    "score_team2" INTEGER,
    "faute_team1" INTEGER,
    "faute_team2" INTEGER,
    "nom_team1" TEXT,
    "nom_team2" TEXT,
    "option1" INTEGER,
    "option2" INTEGER,
    "option3" INTEGER,
    "option4" INTEGER,
    "option5" INTEGER,
    "option6" INTEGER,
    "option7" TEXT,
    "option8" TEXT,
    CONSTRAINT "Scoring_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "first_login" BOOLEAN NOT NULL,
    "active_token" TEXT
);

-- CreateTable
CREATE TABLE "GlobalSetting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "enable" BOOLEAN NOT NULL,
    "start_time" INTEGER NOT NULL,
    "end_time" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
