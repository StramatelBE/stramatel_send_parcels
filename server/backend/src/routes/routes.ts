import express from "express";
import authRouter from "../components/auth/auth.route";
import dataRouter from "../components/data/data.route";
import mediaRouter from "../components/medias/media.route";
import modeRouter from "../components/mode/mode.route";
import playlistRouter from "../components/playlist/playlist.route";
import settingsRouter from "../components/AppSettings/appSettings.route";
import userRouter from "../components/users/users.route";
import playlistItemRouter from "../components/playlistItem/playlistItem.route";
const app = express();

app.use("/auth", authRouter);
app.use("/data", dataRouter);
app.use("/medias", mediaRouter);
app.use("/app-settings", settingsRouter);
app.use("/mode", modeRouter);
app.use("/playlist", playlistRouter);
app.use("/users", userRouter);
app.use("/playlist-item", playlistItemRouter);

export default app;
