export interface DiscountProductList{
    success: string,
    message: string,
    data: DiscountProducts[];
}

export interface DiscountProducts{
    id: string,
    name: string,
    category_id: string,
}


export interface DiscountList{
    success: string,
    message: string,
    data: Discounts[];
}

export interface Discounts{
    id: string,
    type: number,
    from: string,
    to: string,
    value: string,
    created_at: string,
    updated_at: string
}