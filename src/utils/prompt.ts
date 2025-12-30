import {
    ChatCompletionMessageParam,
    ChatCompletionSystemMessageParam,
    ChatCompletionUserMessageParam,
    ChatCompletionAssistantMessageParam,
} from "openai/resources/chat/completions";
import { Message } from "../types/chat";

const SYSTEM_PROMPT = `
You are a helpful and professional customer support agent for a fictional e-commerce store.
Answer clearly, concisely, and politely.
Only use the information provided below.
If a question is outside the provided information, say you will connect the user to a human support agent.
Do not guess or invent policies.
`;


const STORE_FAQ = `
Store Information (Demo):

About the Store:
- SpurShop is a fictional direct-to-consumer e-commerce store created for demonstration purposes.
- We sell general lifestyle and everyday products.

Shipping & Delivery:
- We currently ship to India, the United States, and select countries in Europe.
- Standard delivery time is 5–7 business days after order confirmation.
- Orders are processed within 24–48 hours on business days.
- Shipping charges, if applicable, are shown at checkout.

Order Tracking:
- Once an order is shipped, customers receive a tracking link via email.
- Tracking updates may take up to 24 hours to reflect.

Returns & Exchanges:
- Returns are accepted within 30 days of delivery.
- Items must be unused, in original packaging, and in resellable condition.
- Certain items such as personal care products may not be eligible for return.
- Exchanges are subject to product availability.

Refunds:
- Refunds are initiated after the returned item is received and inspected.
- Refunds are processed within 5 business days.
- The amount is credited back to the original payment method.

Cancellations:
- Orders can be cancelled within 12 hours of placing the order or before shipment, whichever is earlier.
- Once shipped, orders cannot be cancelled.

Payments:
- We accept major credit and debit cards, UPI, and net banking.
- Payment security is handled by trusted third-party payment providers.

Support:
- Customer support is available Monday to Friday, 9:00 AM to 6:00 PM IST.
- Queries outside support hours are responded to on the next business day.

Escalation:
- If a query cannot be resolved by the AI agent, it will be escalated to a human support representative.
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