export interface SizeChartList {
    success: string,
    message: string,
    data: Size[]
}

export interface Size {
    id: string,
    chest: number,
    waist: number,
    hip: number,
    label: string,
    updated_at: string,
    created_at: string
}