export interface CategoryList {
    success: string,
    message: string,
    data: Category[];
}

export interface Category {
    id: string,
    name: string
    sub_categories: Subcategory[]
}

export interface Subcategory {
    id: string,
    main_category_id: string,
    name: string
}