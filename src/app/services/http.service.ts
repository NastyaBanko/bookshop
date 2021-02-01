import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OfferModel } from '../models/offerModel';
import { HttpClient } from '@angular/common/http';
import { CategoryModel } from '../models/categoryModel';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  getCategories(): Observable<CategoryModel[]> {
    return this.http.get<CategoryModel[]>('/catalog/api/v1/categories');
  }

  getCategoryById(id: number): Observable<CategoryModel> {
    return this.http.get<CategoryModel>('/catalog/api/v1/categories/id/' + id);
  }

  getCategoryByName(name: string): Observable<any> {
    return this.http.get<any>('/catalog/api/v1/categories/name/' + name);
  }

  getOffers(): Observable<OfferModel[]> {
    return this.http.get<OfferModel[]>('/catalog/api/v1/offers');
  }

  saveOffer(offer: any): Observable<OfferModel> {
    return this.http.post<OfferModel>('/catalog/api/v1/offers', offer);
  }
  saveCategory(category: any): Observable<CategoryModel> {
    return this.http.post<CategoryModel>(
      '/catalog/api/v1/categories',
      category
    );
  }
  updateOffer(offer: any): Observable<OfferModel> {
    return this.http.put<OfferModel>('/catalog/api/v1/offers', offer);
  }
  updateOfferCategory(id: number, category: any): Observable<any> {
    return this.http.put<any>(
      '/catalog/api/v1/offers/' + id + '/category',
      category
    );
  }

  updateCategoryName(category: any): Observable<any> {
    return this.http.put<any>('/catalog/api/v1/categories', category);
  }

  deleteOffer(id: number): Observable<void> {
    return this.http.delete<void>('/catalog/api/v1/offers/' + id);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>('/catalog/api/v1/categories/' + id);
  }

  createOrder(order: { offers: number[]; email: string }): Observable<any> {
    return this.http.post<any>('/processor/api/v1/processor/orders', order);
  }

  getOrdersByEmail(email: string): Observable<any> {
    return this.http.get<any>(`/processor/api/v1/processor/${email}/orders`);
  }

  addOfferToOrder(orderId: number, offerId: number): Observable<any> {
    return this.http.put<any>(
      `/processor/api/v1/processor/orders/${orderId}/add?offerId=${offerId}`,
      null
    );
  }

  deleteOrderItemFromOrder(
    orderId: number,
    orderItemId: number
  ): Observable<any> {
    return this.http.put<any>(
      `/processor/api/v1/processor/orders/${orderId}/delete?orderItemId=${orderItemId}`,
      null
    );
  }

  getOrderById(orderId: number): Observable<any> {
    return this.http.get<any>(`/processor/api/v1/processor/orders/${orderId}`);
  }
  changeOrderStatus(orderId: number, orderStatus: string): Observable<any> {
    return this.http.put<any>(
      `/processor/api/v1/processor/orders/${orderId}/order-status`,
      orderStatus
    );
  }

  changeDeliveryAddress(orderId: number, address: string): Observable<any> {
    return this.http.put<any>(
      `/processor/api/v1/processor/orders/${orderId}/address`,
      address
    );
  }

  changeContactNumber(orderId: number, contactNumber: string): Observable<any> {
    return this.http.put<any>(
      `/processor/api/v1/processor/orders/${orderId}/contact-number`,
      contactNumber
    );
  }
  changePaymentType(orderId: number, paymentType: string): Observable<any> {
    return this.http.put<any>(
      `/processor/api/v1/processor/orders/${orderId}/payment-type`,
      paymentType
    );
  }
}
