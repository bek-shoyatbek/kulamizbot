import express from "express";
import { APP_PORT } from "./shared/configs/index.js";
import { adminJs, router } from "./admin/index.js";
import { connectDB } from "./shared/database/index.js";
import { bot } from "./bot.js";


const app = express();
const port = APP_PORT || 5050;


app.use(adminJs.options.rootPath, router);

app.listen(port, async () => {
    await connectDB();

    await bot.api.setMyCommands([
        { command: "start", description: "Start the bot" },
        { command: "ovozlarim", description: "Ovozlarim" },
    ])
    await bot.start();
    console.log(`Server started on port ${port}`);
})