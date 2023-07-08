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
    product_variants: Variant[]
}

export interface Variant {
    variant_id: string,
    product_id: string,
    color: string,
    color_title: string,
    size: string,
    stock: number,
    stock_limit: number,
    price: string
}

export interface CartItem {
    product: Product,
    variant: string,
    quantity: number
}

export interface ColorVariant {
    color: string,
    name: string,
    sizes: string[]
}
