export interface ReviewList {
    success: string,
    message: string,
    data: ReviewItem[]
}

export interface ReviewItem {
    product_id: string,
    rating: number,
    count: RatingCount,
    reviews: Review[]
}

export interface RatingCount {
    total: number,
    by_rating: RatingNumber
}

export interface RatingNumber {
    "1": number,
    "2": number,
    "3": number,
    "4": number,
    "5": number
}

export interface Review {
    id: string,
    user_id: string,
    rating: string,
    content: string,
    reviewed_on: string
}