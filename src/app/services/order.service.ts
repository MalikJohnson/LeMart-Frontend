import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Order,
  OrderItem,
  CreateOrderRequest,
  AddOrderItemRequest,
  OrderWithItems
} from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = `${environment.apiUrl}/orders`;
  private itemsUrl = `${environment.apiUrl}/order-items`;

  constructor(private http: HttpClient) {}

  // GET METHODS
  getUserOrders(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/user/${userId}`);
  }

  getOrderById(orderId: number): Observable<OrderWithItems> {
    return this.http.get<OrderWithItems>(`${this.baseUrl}/${orderId}`);
  }

  getOrderItems(orderId: number): Observable<OrderItem[]> {
    return this.http.get<OrderItem[]>(`${this.itemsUrl}/order/${orderId}`);
  }

  // ORDER CREATION
  createOrder(request: CreateOrderRequest): Observable<Order> {
    const payload: CreateOrderRequest = {
      ...request,
      status: request.status || 'PENDING'
    };
    return this.http.post<Order>(this.baseUrl, payload);
  }

  addOrderItem(request: AddOrderItemRequest): Observable<OrderItem> {
    return this.http.post<OrderItem>(this.itemsUrl, request);
  }

  // COMPLEX OPERATIONS
  convertCartToOrder(
    userId: number,
    items: Array<{
      productId: number;
      quantity: number;
      currentPrice: number;
    }>
  ): Observable<OrderWithItems> {
    const total = this.calculateTotal(items);
    const orderRequest: CreateOrderRequest = { userId, totalAmount: total };

    return this.createOrder(orderRequest).pipe(
      switchMap(order => {
        if (items.length === 0) {
          return this.http.get<OrderWithItems>(`${this.baseUrl}/${order.id}`);
        }

        const itemRequests = items.map(item =>
          this.addOrderItem({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            priceAtPurchase: item.currentPrice
          })
        );

        return forkJoin(itemRequests).pipe(
          switchMap(() => this.getOrderById(order.id))
        );
      })
    );
  }

  private calculateTotal(
    items: Array<{ quantity: number; currentPrice: number }>
  ): number {
    return items.reduce(
      (sum, item) => sum + (item.quantity * item.currentPrice),
      0
    );
  }
}