export interface SalesStatisticsList{
    success: string,
    message: string,
    data: SalesStatistics;
}

export interface SalesStatistics{
    date_range: DateRange
    sales: Sales,
    order_count: OrderCount,
}


export interface DateRange{
    start: ''
    end: '',
}

export interface Sales{
    line_graph_data: LineGraph[],
    total: string,
}

export interface LineGraph{
    label: '',
    data: ''
}


export interface OrderCount{
    incomplete: number,
    complete: number,
    all: number,
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
    last_month: '',
    current_month: '',
    increase: boolean,
    percent: ''
}

export interface ProductStatisticsSolds{
    last_month: '',
    current_month: '',
    increase: boolean,
    percent: ''
}

export interface ProductStatisticsOrders{
    last_month: '',
    current_month: '',
    increase: boolean,
    percent: ''
    sales: Sales
    variants: ProductStatisticsVariants[]
}

export interface ProductStatisticsVariants{
    id: string,
    name: string,
    product_sold: number,
    percent: number
}

export interface SalesModel{
    title: string, 
    from: string, 
    to: string,
}
