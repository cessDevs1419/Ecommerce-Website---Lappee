export interface InquiryList {
  success: string,
  message: string,
  data: Inquiry,
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