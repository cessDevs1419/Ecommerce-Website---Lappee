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

export interface SiteDetailsList {
    success: string,
    message: string,
    data: SiteDetails
}

export interface SiteDetails {
    site_name: SiteName
}

export interface SiteName {
    id: string,
    site_name: string
}

export interface SiteLogoList {
    success: string,
    message: string,
    data: SiteLogo
}

export interface SiteLogo {
    site_logo: string
}