import { Router } from "express";
import { handleChatMessage } from "../services/chat.service";

const router = Router();

router.post("/message", async (req, res) => {
    try {
        const { message, sessionId } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const result = await handleChatMessage(message, sessionId);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error",
        });
    }
});

export default router;
