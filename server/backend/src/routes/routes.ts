import express from "express";
import authRouter from "../components/auth/auth.route";
import settingsRouter from "../components/settings/settings.route";
import mediaRouter from "../components/medias/media.route";
import userRouter from "../components/users/users.route";
import playlistRouter from "../components/playlist/playlist.route";
import modeRouter from "../components/mode/mode.route";
import dataRouter from "../components/data/data.route";
import accidentRouter from "../components/accident/accident.route";

const app = express();
app.use("/accident", accidentRouter);
app.use("/auth", authRouter);
app.use("/data", dataRouter);
app.use("/medias", mediaRouter);
app.use("/settings", settingsRouter);
app.use("/mode", modeRouter);
app.use("/playlist", playlistRouter);
app.use("/users", userRouter);

export default app;
