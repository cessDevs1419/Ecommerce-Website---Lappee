export interface ReviewList {
    success: string,
    message: string,
    data: Review[]
}

export interface Review {
    id: string;
    productId: string,
    name: string,
    rating: number,
    date: string,
    comment: string,
    attachments: string[]
    isUsernameHidden: boolean
}