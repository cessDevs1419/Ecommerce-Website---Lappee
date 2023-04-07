export interface SubcategoryList {
    success: string,
    message: string,
    data: Subcategory[]
}

export interface Subcategory {
    id: string,
    main_category: string,
    name: string
}