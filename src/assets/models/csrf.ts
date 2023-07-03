export interface CsrfResponse {
    success: boolean,
    message: string,
    data: CsrfToken[]
}

export interface CsrfToken {
    csrf_token: string
}