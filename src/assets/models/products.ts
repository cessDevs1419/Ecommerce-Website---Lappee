export interface ProductList {
    success: string,
    message: string,
    data: Product[]
}

export interface Product {
    id: string,
    name: string,
    stock: number,
    stock_limit: number,
    price: number,
    sub_category_id: string,
    description: string
}