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
    variants: Variant[],
}

export interface AdminProductList {
    success: string,
    message: string,
    data: AdminProduct[]
}

export interface AdminProduct {
    product_id: string,
    name: string,
    price: string,  
    preview_image: string
}

export interface Variant {
    variant_id: string,
    variant_name: string,
    stock: number,
    price: string,
    attributes: Attribute[]
    images: string[]

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
    preview_image: string
}

export interface CartItem {
    product: Product,
    variant: string,
    variant_details: Map<string, string>,
    quantity: number
    price: string,
    image_url: string[]
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




