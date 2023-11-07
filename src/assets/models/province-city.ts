export interface Province {
    name: string,
    region: string,
    key: string
}

export interface City {
    name: string,
    province: string,
    city: boolean
}