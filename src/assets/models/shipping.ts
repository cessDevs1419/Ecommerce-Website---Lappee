export interface ShippingFeeList {
    success: string,
    message: string,
    data: ShippingFee[]
}

export interface ShippingFee {
    id: string,
    scope: string,
    provinces?: string[],
    price: string
}