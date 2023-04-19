export interface Login {
    email: string,
    password: string,
    rememberMe: boolean
}

export interface Register {
    first_name: string,
    middle_name: string,
    last_name: string,
    suffix: string,
    email: string,
    password: string,
    password_confirmation: string,
}