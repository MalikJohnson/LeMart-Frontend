// Updated checkout.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { UserService } from '../../services/user.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  userInfo: any = {};
  cartItems: any[] = [];
  loading: boolean = false;
  paymentMethod: string = 'credit_card';
  
  // Order summary
  subtotal: number = 0;
  shipping: number = 0;
  taxRate: number = 0.07;
  tax: number = 0;
  total: number = 0;
  freeShippingThreshold: number = 50;

  constructor(
    private cartService: CartService,
    private userService: UserService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.loadUserInfo();
    this.loadCartItems();
  }

  loadUserInfo(): void {
    this.loading = true;
    const userId = this.authService.getUserId();
    
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.userInfo = user;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading user info', err);
        this.loading = false;
        this.toastr.error('Failed to load user information');
      }
    });
  }

  loadCartItems(): void {
    this.loading = true;
    
    this.cartService.cart$.pipe(
      switchMap(items => {
        if (items.length === 0) return of([]);
        
        return forkJoin(
          items.map(item => 
            this.productService.getById(item.productId).pipe(
              map(product => ({
                ...item,
                product: product
              }))
            )
          )
        );
      })
    ).subscribe({
      next: (items) => {
        this.cartItems = items;
        this.calculateTotals();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading cart items', err);
        this.loading = false;
        this.toastr.error('Failed to load cart items');
      }
    });
  }

  calculateTotals(): void {
    this.subtotal = this.cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
    
    this.shipping = this.subtotal >= this.freeShippingThreshold ? 0 : 5.99;
    this.tax = parseFloat((this.subtotal * this.taxRate).toFixed(2));
    this.total = parseFloat((this.subtotal + this.shipping + this.tax).toFixed(2));
  }

  placeOrder(): void {
    if (!this.authService.hasValidToken()) {
      this.toastr.error('Please log in to complete your order');
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }
  
    this.loading = true;
    const userId = this.authService.getUserId();
    
    const orderItems = this.cartItems.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
      currentPrice: item.product.price
    }));
  
    this.orderService.convertCartToOrder(
      userId,
      orderItems,
      this.subtotal,
      this.tax,
      this.shipping,
      this.total
    ).subscribe({
      next: (order) => {
        this.loading = false;
        this.cartService.clearCart();
        this.toastr.success('Order placed successfully!');
        this.router.navigate(['/order-confirmation', order.id]);
      },
      error: (err) => {
        console.error('Error placing order', err);
        this.loading = false;
        this.toastr.error('Failed to place order. Please try again.');
        
        if (err.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }
}