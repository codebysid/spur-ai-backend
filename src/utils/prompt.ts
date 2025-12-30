import {
    ChatCompletionMessageParam,
    ChatCompletionSystemMessageParam,
    ChatCompletionUserMessageParam,
    ChatCompletionAssistantMessageParam,
} from "openai/resources/chat/completions";
import { Message } from "../types/chat";

const SYSTEM_PROMPT = `
You are a helpful customer support agent for a small e-commerce store.
Answer clearly, concisely, and professionally.
If you are unsure, say you will connect the user to a human agent.
Do not hallucinate policies.
`;

const STORE_FAQ = `
Store Information:
- Shipping: We ship to India, USA, and Europe. Delivery takes 5-7 business days.
- Returns: Returns are accepted within 30 days if the item is unused.
- Refunds: Refunds are processed within 5 business days after receiving the return.
- Support Hours: Monday to Friday, 9 AM to 6 PM IST.
`;

export function buildPrompt(
    history: Message[],
    userMessage: string
): ChatCompletionMessageParam[] {
    const messages: ChatCompletionMessageParam[] = [];

    const systemMessage: ChatCompletionSystemMessageParam = {
        role: "system",
        content: SYSTEM_PROMPT + STORE_FAQ,
    };

    messages.push(systemMessage);

    history.forEach((m) => {
        if (m.sender === "user") {
            const userMsg: ChatCompletionUserMessageParam = {
                role: "user",
                content: m.text,
            };
            messages.push(userMsg);
        } else {
            const aiMsg: ChatCompletionAssistantMessageParam = {
                role: "assistant",
                content: m.text,
            };
            messages.push(aiMsg);
        }
    });

    const latestUserMessage: ChatCompletionUserMessageParam = {
        role: "user",
        content: userMessage,
    };

    messages.push(latestUserMessage);

    return messages;
}