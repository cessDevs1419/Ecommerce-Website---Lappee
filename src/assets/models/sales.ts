export interface SalesStatisticsList{
    success: string,
    message: string,
    data: SalesStatistics;
}

export interface SalesStatistics{
    order_count: OrderCount,
    sales: Sales
}

export interface OrderCount{
    incomplete: number,
    complete: number,
    all: number,
}

export interface Sales{
    monthly: Monthly,
    total: string,
}

export interface Monthly{
    January: string,
    February: string,
    March: string,
    April: string,
    May: string,
    June: string,
    July: string,
    August: string,
    September: string,
    October: string,
    November: string,
    December: string
}

export interface ProductStatisticsList{
    success: string,
    message: string,
    data: ProductStatistics;
}

export interface ProductStatistics{
    product_details: ProductStatisticsDetails,
    rating: ProductStatisticsRating,
    product_sold: ProductStatisticsSolds,
    orders: ProductStatisticsOrders,
}

export interface ProductStatisticsDetails{
    id: string,
    name: string
}

export interface ProductStatisticsRating{
    last_month: number,
    current_month: number,
    increase: boolean,
    percent: number
}

export interface ProductStatisticsSolds{
    last_month: number,
    current_month: number,
    increase: boolean,
    percent: number
}

export interface ProductStatisticsOrders{
    last_month: number,
    current_month: number,
    increase: boolean,
    percent: number
}

