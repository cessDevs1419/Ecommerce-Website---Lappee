export interface RestockProductsList {
    success: string,
    message: string,
    data: RestockProducts[]
}

export interface RestockProducts {
    variant_id: string,
    name: string,
}

export interface RestockList {
    success: string,
    message: string,
    data: Restock[]
}

export interface Restock {
    restock_id: string,
    items: string,
    date: string
}


export interface RestockViewList {
    success: string,
    message: string,
    data: RestockView
}

export interface RestockView {
    details: Details,
    contents: Contents[],
}

export interface Details {
    id: string,
    date: string,
}

export interface Contents {
    name: string,
    quantity: number,
}


