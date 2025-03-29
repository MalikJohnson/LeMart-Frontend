import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, forkJoin, of } from 'rxjs';
import { catchError, switchMap, tap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

interface CartItem {
  productId: number;
  quantity: number;
  priceAtPurchase: number;
  addedAt?: Date;
}

interface CartResponse {
  id: string;
  items: CartItem[];
}

const EMPTY_CART_RESPONSE: CartResponse = {
  id: 'temp',
  items: []
};

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/carts`;
  private localKey = 'cart_v1';
  
  private cart = new BehaviorSubject<CartItem[]>([]);
  public cart$ = this.cart.asObservable();
  
  private total = new BehaviorSubject<number>(0);
  public total$ = this.total.asObservable();

  private changes = new Subject<void>();
  public changes$ = this.changes.asObservable();

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {
    this.initCart();
  }

  // Initialization
  private initCart(): void {
    if (this.auth.hasValidToken()) {
      this.syncWithServer().subscribe();
    } else {
      this.loadLocalCart();
    }
  }

  private loadLocalCart(): void {
    const cartData = localStorage.getItem(this.localKey);
    if (cartData) {
      try {
        const items = JSON.parse(cartData) as CartItem[];
        this.cart.next(items);
        this.updateTotal();
      } catch {
        localStorage.removeItem(this.localKey);
      }
    }
  }

  // Core Operations
  addItem(productId: number, price: number, quantity: number = 1): void {
    const current = [...this.cart.value];
    const existing = current.find(i => i.productId === productId);

    if (existing) {
      existing.quantity += quantity;
    } else {
      current.push({
        productId,
        quantity,
        priceAtPurchase: price,
        addedAt: new Date()
      });
    }

    this.updateCart(current);
  }

  updateItem(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    const updated = this.cart.value.map(item => 
      item.productId === productId ? { ...item, quantity } : item
    );

    this.updateCart(updated);
  }

  removeItem(productId: number): void {
    const filtered = this.cart.value.filter(i => i.productId !== productId);
    this.updateCart(filtered);
  }

  clearCart(): void {
    this.updateCart([]);
    localStorage.removeItem(this.localKey);
  }

  // Sync Methods
syncWithServer(): Observable<void> {
  if (!this.auth.hasValidToken()) {
    return of(void 0);
  }

  return forkJoin({
    local: of(this.cart.value),
    server: this.getServerCart().pipe(
      catchError(() => of(EMPTY_CART_RESPONSE))
    ) 
  }).pipe(
    switchMap(({ local, server }) => {
      const merged = this.mergeCarts(local, server.items);
      return this.saveToServer(merged);
    }),
    tap((res) => {
      this.updateCart(res.items);
    }),
    map(() => {}),
    catchError(error => {
      console.error('Cart sync failed', error);
      return of(void 0);
    })
  );
}

  private mergeCarts(local: CartItem[], server: CartItem[]): CartItem[] {
    return [...server, ...local.filter(l => 
      !server.some(s => s.productId === l.productId)
    )];
  }

  // API Communication
  private getServerCart(): Observable<CartResponse> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.auth.getToken()}` // MUST include this
    });
  
    return this.http.get<CartResponse>(
      `${this.apiUrl}/user/${this.auth.getUserId()}`,
      { headers }
    ).pipe(
      catchError(error => {
        console.error('API Error:', error);
        return of(EMPTY_CART_RESPONSE);
      })
    );
  }

  private saveToServer(items: CartItem[]): Observable<CartResponse> {
    const userId = this.auth.getUserId();
    return this.http.post<CartResponse>(this.apiUrl, { 
      userId, 
      items: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        priceAtAddition: item.priceAtPurchase
      }))
    }, {
      headers: this.auth.getAuthHeader()
    });
  }

  // Helpers
  private updateCart(items: CartItem[]): void {
    this.cart.next(items);
    this.updateTotal();
    this.persistCart(items);
    this.changes.next();
  }

  private updateTotal(): void {
    const calculated = this.cart.value.reduce(
      (sum, item) => sum + (item.priceAtPurchase * item.quantity), 0
    );
    this.total.next(parseFloat(calculated.toFixed(2)));
  }

  private persistCart(items: CartItem[]): void {
    if (this.auth.hasValidToken()) {
      this.saveToServer(items).subscribe();
    } else {
      localStorage.setItem(this.localKey, JSON.stringify(items));
    }
  }

  // Public Utilities
  getItemCount(): number {
    return this.cart.value.reduce((sum, item) => sum + item.quantity, 0);
  }

  getItem(productId: number): CartItem | undefined {
    return this.cart.value.find(item => item.productId === productId);
  }
}