export interface InquiryList {
  success: string,
  message: string,
  data: Inquiry[],
}

export interface InquiryContentList {
  success: string,
  message: string,
  data: InquiryContent
}

export interface InquiryContent {
  inquiry: Inquiry,
  replies: Replies[]
}

export interface Inquiry {
  id: string,
  email: string,
  name: string,
  message: string,
  created_at: string,
  updated_at: string,
  is_read: boolean
}

export interface Replies {
  id: string,
  inquiry_id: string,
  user_id: string,
  message: string,
  created_at: string,
  updated_at: string,
  attachments: string[]
}
