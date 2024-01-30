import { Size } from "./size-chart"

export interface ProductList {
    success: string,
    message: string,
    data: Product[]
}

export interface Product {
    id: string,
    name: string,
    description: string,
    category: string,
    discount: Discount,
    variants: Variant[],
    size_chart: Size[]
}

export interface AdminProductList {
    success: string,
    message: string,
    data: AdminProduct[]
}

export interface AdminProduct {
    id: string,
    name: string,
    price: string,  
    category_id: string,
    show_my_style: number,
    is_archived: number
}

export interface AdminProductDetails {
    id: string,
    name: string,
    description: string, 
    category_id: string,
    show_my_styles: number,
    is_archived: number
    
}

export interface Variant {
    variant_id: string,
    variant_name: string,
    stock: number,
    price: string,
    attributes: Attribute[],
    images: string[],
    my_styles_image?: string[],
    product_id: string
}

/*
export interface Variant {
    variant_id: string,
    variant_name: string,
    stock: number,
    price: string,
    attributes: Attribute[]
    
    product_id: string,
    color: string,
    color_title: string,
    size: string,
    stock_limit: number,
    variant_images: string[]
} */

export interface Attribute {
    attribute_id: string,
    category_attribute_id: string,
    attribute_name: string,
    value: string,
}

export interface CategoryProductList {
    success: string,
    message: string,
    data: CategoryProduct[]
}

export interface CategoryProduct {
    product_id: string,
    name: string,
    price: number,
    discount: Discount,
    preview_image: string,
}

export interface Discount {
    id: string,
    type: number,
    from: string,
    to: string,
    value: string,
    created_at: string,
    updated_at: string
}

export interface CartItem {
    product: Product,
    variant: string,
    variant_details: Map<string, string>,
    quantity: number
    price: string,
    image_url: string[]
}

export interface CartItemResponse {
    success: string,
    message: string,
    data: CartItemList
}

export interface CartItemList {
    id: string,
    user_id: string,
    created_at: string,
    updated_at: string,
    items: CartItemAPI[]

}

export interface CartItemAPI {
    product: Product,
    selected_variant: string,
    quantity: number
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

export interface MyStyleProduct {
    tops: Product[],
    bottoms: Product[]
}

export interface NewVariantList {
    success: string,
    message: string,
    data: NewVariant[]
}

export interface NewVariant {
    id: string,
    product_id: string,
    stock: number,
    price: string,
    name: string,
    created_at: string,
    updated_at: string,
    images: string[],
    my_style_image: string[],
    attributes: Attribute[],
}