import OpenAI from "openai";
import { Message } from "../types/chat";
import { buildPrompt } from "../utils/prompt";

const client = new OpenAI({
    apiKey: process.env.LLM_API_KEY,
    baseURL: process.env.LLM_BASE_URL, // Groq/OpenAI compatible
});

const FALLBACK_REPLY =
    "Sorry, I'm having trouble responding right now. Please try again later.";

export async function generateReply(
    history: Message[],
    userMessage: string
): Promise<string> {
    try {
        const completion = await client.chat.completions.create({
            model: process.env.LLM_MODEL!,
            messages: buildPrompt(history, userMessage),
            max_tokens: 300,
            temperature: 0.3,
        });

        return completion.choices[0].message.content ?? FALLBACK_REPLY;
    } catch (error) {
        console.error("LLM Error:", error);
        return FALLBACK_REPLY;
    }
}
