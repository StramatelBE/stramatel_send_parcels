import express from "express";
import authRouter from "../components/auth/auth.route";
import settingsRouter from "../components/settings/settings.route";
import mediaRouter from "../components/medias/media.route";
import userRouter from "../components/users/users.route";
import playlistRouter from "../components/playlist/playlist.route";
import modeRouter from "../components/mode/mode.route";
import dataRouter from "../components/data/data.route";

const app = express();

app.use("/auth", authRouter);
app.use("/settings", settingsRouter);
app.use("/medias", mediaRouter);
app.use("/users", userRouter);
app.use("/playlist", playlistRouter);
app.use("/mode", modeRouter);
app.use("/data", dataRouter);

export default app;
