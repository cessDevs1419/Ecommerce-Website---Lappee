export interface UserList {
    success: string,
    message: string,
    data: User[]
}

export interface User {
    user_id: string,
    email: string,
    fname: string,
    mname: string,
    lname: string,
    suffix: string,
    created_at: string,
    last_login: string,
    user_type: number,
    email_verified_at: string
    
}

export interface BannedUserList {
    success: string,
    message: string,
    data: BannedUser[]
}

export interface BannedUser {
    id: string,
    reason: string,
    effective_on: string,
    user_id: string,
    fname: string,
    lname: string,
    suffix: string,
    email: string,
}