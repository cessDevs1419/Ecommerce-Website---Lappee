export interface SubcategoryList {
    success: string,
    message: string,
    data: AdminSubcategory[]
}

export interface AdminSubcategory {
    id: string,
    name: string,
    main_category_id: string
}   