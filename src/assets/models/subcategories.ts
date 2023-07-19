export interface SubcategoryList {
    success: string,
    message: string,
    data: AdminSubcategory[]
}

export interface AdminSubcategory {
    id: string,
    name: string,
    main_category: string
}   

export interface AdminPatchSubcategory {
    sub_category_id: string,
    main_category_id: string,
    name: string
}   