import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GETOrderDetail, GETOrderDetailByUser, POSTOrder, GETAdminOrderDetail, GETOrder, PATCHPackStatus, PATCHShipStatus, PATCHDeliverStatus, PATCHToShipStatus, GETAdminOrderToPack, GETAdminOrderToShip, GETAdminOrderShipping, GETAdminOrderDelivered, GETAdminOrderPending, POSTCancelOrder, GETAdminOrderCancel, GETAdminOrderCancelled, PATCHCancel, PATCHDeny, GETAdminOrderHold, PATCHHold } from '../endpoints';
import { Observable } from 'rxjs';
import { Order } from 'src/assets/models/products';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
      //galing kay dell
    })
  };
  
  constructor(private http: HttpClient) { }
  
  getAdminOrders(): Observable<any> {
    return this.http.get(GETOrder);
  }
  getAdminOrdersPending(): Observable<any> {
    return this.http.get(GETAdminOrderPending);
  }
  getAdminOrdersToPack(): Observable<any> {
    return this.http.get(GETAdminOrderToPack);
  }
  getAdminOrdersToShip(): Observable<any> {
    return this.http.get(GETAdminOrderToShip);
  }
  getAdminOrdersShipping(): Observable<any> {
    return this.http.get(GETAdminOrderShipping);
  }
  getAdminOrdersDelivered(): Observable<any> {
    return this.http.get(GETAdminOrderDelivered);
  }
  getAdminOrdersCancel(): Observable<any> {
    return this.http.get(GETAdminOrderCancel);
  }
  getAdminOrdersCancelled(): Observable<any> {
    return this.http.get(GETAdminOrderCancelled);
  }
  getAdminOrdersHold(): Observable<any> {
    return this.http.get(GETAdminOrderHold);
  }
  getAdminOrderDetail(orderId: string): Observable<any> {
    return this.http.get(GETAdminOrderDetail+ orderId);
    
  }

  patchPack(data: FormData): Observable<any> {
    return this.http.patch<Order>(PATCHPackStatus, data, this.httpOptions);
  } 
  
  patchToShip(data: FormData): Observable<any> {
    return this.http.patch<Order>(PATCHToShipStatus, data, this.httpOptions);
  }
    
  patchShip(data: FormData): Observable<any> {
    return this.http.patch<Order>(PATCHShipStatus, data, this.httpOptions);
  }
  
  patchDeliver(data: FormData): Observable<any> {
    return this.http.patch<Order>(PATCHDeliverStatus, data, this.httpOptions);
  } 
  patchHold(data: FormData): Observable<any> {
    return this.http.patch<Order>(PATCHHold, data, this.httpOptions);
  } 
  patchCancel(data: FormData): Observable<any> {
    return this.http.patch<Order>(PATCHCancel, data, this.httpOptions);
  } 
  patchDeny(data: FormData): Observable<any> {
    return this.http.patch<Order>(PATCHDeny, data, this.httpOptions);
  } 
  
  getOrderDetail(id: string): Observable<any> {
    return this.http.get(GETOrderDetail + id);
  }

  getOrderDetailByUser(): Observable<any> {
    return this.http.get(GETOrderDetailByUser);
  }

  postOrder(data: FormData): Observable<any> {
    return this.http.post(POSTOrder, data, this.httpOptions);
  }

  postCancelOrder(data: FormData): Observable<any> {
    return this.http.post(POSTCancelOrder, data, this.httpOptions);
  }
  
  
}
