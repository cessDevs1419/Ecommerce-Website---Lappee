export interface ProductList {
    success: string,
    message: string,
    data: Product[]
}

export interface Product {
    id: string,
    name: string,
    sub_category_id: string,
    description: string,
    images: string[],
    product_variants: Variant[]
}

export interface Variant {
    variant_id: string,
    product_id: string,
    attributes: Attribute[]
    color: string,
    color_title: string,
    size: string,
    stock: number,
    stock_limit: number,
    price: string,
    variant_name: string,
    variant_images: string[]
}

export interface Attribute {
    attribute_id: string
    attribute_name: string,
    attribute_value: string,
}

export interface CartItem {
    product: Product,
    variant: string,
    variant_details: string[],
    quantity: number
    price: string,
    image_url: string
}

export interface ColorVariant {
    color: string,
    name: string,
    sizes: string[]
}

export interface Order {
    id: string,
    variant_id: string,
    quantity: number
}
