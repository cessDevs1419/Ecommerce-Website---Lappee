export interface ChatsList {
    success: string,
    message: string,
    data: Chats[];
}

export interface Chats {
    id: string,
    conversation_id: string,
    sender: string,
    message: string,
    attachment: null,
    created_at: string,
    updated_at: string,
    is_deleted: number
}