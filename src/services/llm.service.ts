import OpenAI from "openai";
import { Message } from "../types/chat";
import { buildPrompt } from "../utils/prompt";
import { redis } from "../lib/redis";
import { normalize } from "../utils/helper";

const client = new OpenAI({
    apiKey: process.env.LLM_API_KEY,
    baseURL: process.env.LLM_BASE_URL, // Groq/OpenAI compatible
});

const CACHE_TTL = 60 * 60 * 24;

const FALLBACK_REPLY =
    "Sorry, I'm having trouble responding right now. Please try again later.";

export async function generateReply(
    history: Message[],
    userMessage: string
): Promise<string> {
    try {

        const normalized = normalize(userMessage);
        const cacheKey = `faq:${normalized}`;

        const cached = await redis.get<string>(cacheKey);
        if (cached) return cached;

        const completion = await client.chat.completions.create({
            model: process.env.LLM_MODEL!,
            messages: buildPrompt(history, userMessage),
            max_tokens: 300,
            temperature: 0.3,
        });
        const reply = completion.choices[0].message.content ?? FALLBACK_REPLY

        if (reply.length < 500) {
            await redis.set(cacheKey, reply, {
                ex: CACHE_TTL,
            });
        }

        return reply
    } catch (error) {
        console.error("LLM Error:", error);
        return FALLBACK_REPLY;
    }
}

