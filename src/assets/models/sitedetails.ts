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

export interface BannersList {
    success: string,
    message: string,
    data: Banner[]
}

export interface Banner {
    id: string,
    label: string,
    path: string
}