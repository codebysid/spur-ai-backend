import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { initRedis } from "./lib/redis";

const PORT = process.env.PORT || 4000;

async function startServer() {
    await initRedis();

    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}

startServer();