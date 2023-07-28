export interface OrderList {
    success: string,
    message: string,
    data: OrderDetail[]
}

export interface OrderDetail {
    order_id: string,
    ordered_on: string,
    order_contents: OrderContent[]
}

export interface OrderContent {
    name: string,
    size: string,
    color_title: string,
    quantity: number,
    sub_price: string
}