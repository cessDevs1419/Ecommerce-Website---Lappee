export interface CategoryList {
    success: string,
    message: string,
    data: Category[];
}

export interface Category {
    id: string,
    name: string
}