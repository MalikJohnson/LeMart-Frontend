import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  loading: boolean = false;
  taxRate: number = 0.07; // 7% tax
  shippingFee: number = 5.99;
  freeShippingThreshold: number = 50;

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.checkAuthentication();
    this.loadCartItems();
  }

  checkAuthentication(): void {
    if (!this.authService.hasValidToken()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/cart' } });
      this.toastr.info('Please log in to view your cart');
    }
  }

  loadCartItems(): void {
    this.loading = true;
    
    this.cartService.cartItems$.subscribe({
      next: (items) => {
        this.cartItems = items;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading cart items', err);
        this.loading = false;
        this.toastr.error('Failed to load cart items');
      }
    });
  }

  updateQuantity(item: any, newQuantity: number): void {
    if (newQuantity < 1) {
      return;
    }

    this.loading = true;
    this.cartService.updateQuantity(item.productId, newQuantity);
    this.loading = false;
  }

  removeFromCart(item: any): void {
    this.loading = true;
    this.cartService.removeFromCart(item.productId);
    this.loading = false;
    this.toastr.success('Item removed from cart');
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.loading = true;
      this.cartService.clearCart();
      this.loading = false;
      this.toastr.success('Cart cleared');
    }
  }

  calculateSubtotal(): number {
    return this.cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  calculateShipping(): number {
    const subtotal = this.calculateSubtotal();
    return subtotal >= this.freeShippingThreshold ? 0 : this.shippingFee;
  }

  calculateTax(): number {
    return this.calculateSubtotal() * this.taxRate;
  }

  calculateTotal(): number {
    return this.calculateSubtotal() + this.calculateShipping() + this.calculateTax();
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}