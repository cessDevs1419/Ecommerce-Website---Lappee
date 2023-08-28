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
    sub_price: string,
    product_id: string
}


export interface AdminOrderList {
    success: string,
    message: string,
    data: AdminOrder[]
}

export interface AdminOrder {
    id: string,
    user_id: string,
    status: number,
    created_at: string,
    updated_at: string,
    paid: number,
    tracking_no: string,
    packed_date: string,
    shipped_date: string,
    delivered_date: string,
    total_price: string,
    address_line_1: string,
    address_line_2: string,
    city: string,
    province: string,
    zip_code: number
}

export interface AdminOrderDetailList {
    success: string,
    message: string,
    data: AdminOrderDetail
}

export interface AdminOrderDetail {
    order_id: string,
    user_id: string,
    status: number,
    ordered_on: string,
    paid: number,
    tracking_no: string,
    packed_date: string,
    shipped_date: string,
    delivered_date: string,
    total_price: string,
    address_line_1: string,
    address_line_2: string,
    city: string,
    province: string,
    zip_code: number,
    order_contents: AdminOrderContent[]
}

export interface AdminOrderContent {
    product_id: string,
    quantity: number,
    sub_price: string
}