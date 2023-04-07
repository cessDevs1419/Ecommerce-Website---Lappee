export interface SignIn {
    email: string,
    password: string,
    rememberMe: boolean
}

export interface Register {
    email: string,
    password: string,
    passwordConfirm: string
}