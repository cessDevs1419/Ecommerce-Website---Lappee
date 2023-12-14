export interface DashboardList{
    success: string,
    message: string,
    data: Dashboard;
}

export interface Dashboard{
    customers: DashboardCustomers,
    views: DashboardViews,
    orders: DashboardOrders,
    recent_orders: DashboardRecentOrders[],
    best_sellers: DashboardBestSellers[]
}


export interface DashboardCustomers{
    last_month: string,
    current_month: string,
    increase: boolean,
    percent: string
}


export interface DashboardViews{
    last_month: string,
    current_month: string,
    increase: boolean,
    percent: string
}


export interface DashboardOrders{
    last_month: string,
    current_month: string,
    increase: boolean,
    percent: string
}

export interface DashboardRecentOrders{
    id: string,
    status: string,
    total_price: string,
    created_at: string
}

export interface DashboardBestSellers{
    id: string,
    name: string,
    product_sold: string,
    percent: string
}