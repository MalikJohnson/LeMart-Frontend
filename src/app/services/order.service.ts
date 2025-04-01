import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Order,
  OrderItem,
  CreateOrderRequest,
  UpdateOrderStatusRequest,
  OrderStatus
} from '../models/order';
import { AuthService } from './auth.service';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = `${environment.apiUrl}/orders`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    return this.authService.getAuthHeader();
  }

  // GET METHODS
  getUserOrders(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/user/${userId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      switchMap((orders: Order[]) => {
        if (!orders.length) return of<Order[]>([]);
        
        const enhancedOrders$ = orders.map(order => {
          if (!order.orderItems || !order.orderItems.length) {
            return of<Order>(order);
          }
  
          const enhancedItems$ = order.orderItems.map(item => 
            this.http.get<Product>(`${environment.apiUrl}/products/${item.productId}`).pipe(
              map((product: Product) => ({
                ...item,
                productName: product.name,
                productImage: product.imageUrl
              } as OrderItem))
            )
          );
  
          return forkJoin(enhancedItems$).pipe(
            map((items: OrderItem[]) => ({
              ...order,
              orderItems: items
            } as Order))
          );
        });
  
        return forkJoin(enhancedOrders$);
      })
    );
  }

  getOrderById(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${orderId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // ORDER OPERATIONS
  createOrder(request: CreateOrderRequest): Observable<Order> {
    const payload: CreateOrderRequest = {
      ...request,
      status: request.status || 'PENDING'
    };
    return this.http.post<Order>(this.baseUrl, payload, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Detailed error:', error);
        throw error;
      })
    );
  }

  updateOrderStatus(orderId: number, status: 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED'): Observable<Order> {
    const payload: UpdateOrderStatusRequest = { status };
    return this.http.patch<Order>(
        `${this.baseUrl}/${orderId}/status`, 
        payload,
        {
            headers: this.getAuthHeaders()
        }
    );
}

  deleteOrder(orderId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${orderId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // CART CONVERSION
  convertCartToOrder(
    userId: number,
    items: Array<{
      productId: number;
      quantity: number;
      currentPrice: number;
    }>,
    subtotal: number,
    tax: number,
    shipping: number,
    total: number
  ): Observable<Order> {
    const orderRequest: CreateOrderRequest = {
      userId,
      orderItems: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: item.currentPrice
      })),
      subtotal,
      tax,
      shipping,
      totalAmount: total
    };
    return this.createOrder(orderRequest);
  }
}