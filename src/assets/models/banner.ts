export interface BannerList {
  success: string,
  message: string,
  data: Banner[],
}

export interface Banner {
  id: string,
  label: string,
  path: string,
}