

export interface CategoryList {
    success: string,
    message: string,
    data: Category[];
}

export interface Category {
    id: string,
    name: string
    sub_categories: Subcategory[],
    images: string[]
}

export interface Subcategory {
    id: string,
    main_category_id: string,
    name: string
}

export interface AdminCategoryList {
    success: string,
    message: string,
    data: AdminCategory[];
}

export interface AdminCategory {
    id: string,
    name: string
}

export interface NewAdminCategoryList {
    success: string,
    message: string,
    data: NewAdminCategory;
}

export interface NewAdminCategory {
    category_id: string,
    name: string
    attributes: Attributes[]
}

export interface Attributes{
    category_attribute_id: string,
    attribute_id: string,
    category_id: string,
    name: string
}


