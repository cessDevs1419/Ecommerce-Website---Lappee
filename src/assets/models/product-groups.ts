export interface ProductGroupList {
    success: string,
    message: string,
    data: ProductGroup
}

export interface ProductGroup {
    tops: [],
    bottoms: []
}


export interface NewProductGroupList {
    success: string,
    message: string,
    data: NewProductGroup[]
}

export interface NewProductGroup {
    tops: '',
    bottoms: ''
}