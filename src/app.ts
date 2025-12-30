import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat.routes";
import { rateLimiter } from "./middleware/rate-limit";
import { concurrencyGuard } from "./middleware/concurrency-guard";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/chat", rateLimiter(30, 60))

app.use("/chat", concurrencyGuard, chatRoutes);

export default app;
