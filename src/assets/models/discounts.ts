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