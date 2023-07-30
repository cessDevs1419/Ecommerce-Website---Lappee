export interface ReviewList {
    success: string,
    message: string,
    data: ReviewItem
}

export interface ReviewItem {
    product_id: string,
    rating: number,
    count: RatingCount,
    reviews: Review[]
}

export interface RatingCount {
    total: number,
    "by-rating": RatingNumber
}

export interface RatingNumber {
    "1.00": number,
    "2.00": number,
    "3.00": number,
    "4.00": number,
    "5.00": number
}

export interface Review {
    review_id: string,
    user_id: string,
    email: string,
    rating: string,
    content: string,
    reviewed_on: string
}