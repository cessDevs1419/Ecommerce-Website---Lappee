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
    address_line_1: string,
    address_line_2: string,
    id: number,
    number: string
}