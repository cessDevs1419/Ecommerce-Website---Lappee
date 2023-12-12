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
    date_range: DateRange,
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
    last_month: string,
    current_month: string,
    increase: boolean,
    percent: string
}

export interface ProductStatisticsSolds{
    last_month: string,
    current_month: string,
    increase: boolean,
    percent: string
}

export interface ProductStatisticsOrders{
    last_month: string,
    current_month: string,
    increase: boolean,
    percent: string
    sales: Sales
    list: List[]
    variants: ProductStatisticsVariants[]
}

export interface List{
    id: string,
    order_content_id: string,
    name: string,
    created_at: string,
    status: number,
    total_price: string,
    variant_id: string
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
