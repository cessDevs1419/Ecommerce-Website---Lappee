export interface AdminNotificationList{
    success: string,
    message: string,
    data: AdminNotification[];
}

export interface AdminNotification{
    id: string,
    type: string,
    content: string,
    user_id: string,
    is_read: boolean,
    read_on: string,
    created_at: string,
    updated_at: string,
}