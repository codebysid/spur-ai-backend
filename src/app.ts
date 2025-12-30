import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat.routes";
import { apiRateLimiter } from "./middleware/rate-limit";
import { concurrencyGuard } from "./middleware/concurrency-guard";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/chat", apiRateLimiter)

app.use("/chat", concurrencyGuard, chatRoutes);

export default app;
