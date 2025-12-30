import { supabase } from "../db/supabase";
import { generateReply } from "./llm.service";
import { Message, Sender } from "../types/chat";

export async function handleChatMessage(
    message: string,
    sessionId?: string
) {
    const conversationId =
        sessionId ?? (await createConversation());

    await saveMessage(conversationId, "user", message);

    const history = await getRecentMessages(conversationId, 8);

    const reply = await generateReply(history, message);

    await saveMessage(conversationId, "ai", reply);

    return {
        reply,
        sessionId: conversationId,
    };
}

async function createConversation(): Promise<string> {
    const { data, error } = await supabase
        .from("conversations")
        .insert({})
        .select("id")
        .single();

    if (error) throw error;
    return data.id;
}

async function saveMessage(
    conversationId: string,
    sender: Sender,
    text: string
) {
    await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender,
        text,
    });
}

export async function getRecentMessages(
    conversationId: string,
    limit: number
): Promise<Message[]> {
    const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })
        .limit(limit);

    return data ?? [];
}
