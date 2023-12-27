export interface DeliveryInfoList {
    success: string,
    message: string,
    data: DeliveryInfo[]
}

export interface DeliveryInfo {
    user_id: string,
    city: string,
    province: string,
    zip_code: number,
    address: string,
    id: number,
    number: string
}

export interface AddressList {
    success: string,
    message: string,
    data: Address[]
}

export interface Address {
    id: string,
    user_id: string,
    address: string,
    city: string,
    province: string,
    zip_code: number,
    number: string,
    label: string,
    in_use: number
}