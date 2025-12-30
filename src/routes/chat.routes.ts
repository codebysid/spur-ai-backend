import { Router } from "express";
import { getRecentMessages, handleChatMessage } from "../services/chat.service";

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
})
    .post("/all-messages", async (req, res) => {
        const { sessionId, limit = null } = req.body

        if (!sessionId) {
            return res.status(400).json({ error: "sessionId is required" });
        }
        const result = await getRecentMessages(sessionId, limit)
        res.json(result)
    });

export default router;
