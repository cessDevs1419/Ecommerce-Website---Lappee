export interface ChatsList {
    success: string,
    message: string,
    data: {
        title: string;
        messages: Chats[];
    };
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


export interface ChatsChannelList {
    success: string,
    message: string,
    data: ChatsChannel[];
}

export interface ChatsChannel {
    id: string,
    created_at: string,
    updated_at: string,
    latest_message_time: string,
    type: number,
    title: string
}