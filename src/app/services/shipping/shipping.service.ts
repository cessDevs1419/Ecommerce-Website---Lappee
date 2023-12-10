import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {

  constructor() { }

  lowSFProvinces: string[] = [
    "cavite"
  ]

  getShippingFee(province: string): string {
    return this.lowSFProvinces.includes(province.toLowerCase()) ? "100.00" : "180.00"
  }
}
