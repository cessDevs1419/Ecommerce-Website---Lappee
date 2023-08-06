export interface AboutUsTosList {
    success: string,
    message: string,
    data: AboutUsTosSection[]
}

export interface AboutUsTosSection {
    id: string,
    title: string,
    content: string,
    order: number,
    updated_at: string,
    created_at: string
}