export type Sender = "user" | "ai";

export interface Message {
    id: string;
    conversation_id: string;
    sender: Sender;
    text: string;
    created_at: string;
}
