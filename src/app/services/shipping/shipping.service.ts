import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ShippingFeeList } from 'src/assets/models/shipping';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {

  constructor(private http: HttpClient) { }

  lowSFProvinces: string[] = [
    "cavite"
  ]

  getShippingFee(province: string): string {
    return this.lowSFProvinces.includes(province.toLowerCase()) ? "100.00" : "180.00"
  }

  getAdminShippingFeeList(): Observable<ShippingFeeList> {
    return this.http.get<ShippingFeeList>("../../assets/sampleData/shippingfees.json")
  }
}
