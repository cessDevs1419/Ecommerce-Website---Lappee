export interface ErrorList {
    success: string,
    message: string,
    data: Error
}

export interface Error {
    error: ErrorDetail
}

export interface ErrorDetail {
    [errorType: string]: string[];
}