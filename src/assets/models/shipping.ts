export interface ShippingFeeList {
    success: string,
    message: string,
    data: ShippingFeeCategory
}

export interface ShippingFeeCategory {
    general: ShippingFee[],
    specific: ShippingFee[]
}

export interface ShippingFee {
    id: string,
    scope: string,
    provinces?: string[],
    price: string
}