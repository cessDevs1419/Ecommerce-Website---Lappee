import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { City, Province } from 'src/assets/models/province-city';

@Injectable({
  providedIn: 'root'
})
export class ProvinceCityService {

  constructor(private http: HttpClient) {
    const province = this.http.get<any>("../../../../assets/provinces.json");
    const cities = this.http.get<any>("../../../../assets/cities.json");

    province.subscribe((response: any) => {
      this.provinces = response;
      console.log(response);
    });

    cities.subscribe((response: any) => {
      this.cities = response;
    });
   }

   provinces: Province[]
   cities: City[]

   getProvinces(): any {
    return this.http.get<any>("../../../../assets/provinces.json");
   }

   getCities(): any {
    return this.http.get<any>("../../../../assets/cities.json");
   }
}
