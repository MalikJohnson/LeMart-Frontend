import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    NgbDropdownModule,
    NgbCollapseModule
  ],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  isCollapsed = true;
  isLoggedIn = false;
  cartItemCount = 0;
  username: string | null = null;
  isAdmin = false;
  
  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Initial status check
    this.updateAuthStatus();
    this.updateCartCount();

    // Subscribe to auth changes
    this.authService.authStatus$.subscribe(() => {
      this.updateAuthStatus();
    });

    // Subscribe to cart changes
    this.cartService.changes$.subscribe(() => {
      this.updateCartCount();
    });
  }

  private updateAuthStatus(): void {
    this.isLoggedIn = this.authService.hasValidToken();
    if (this.isLoggedIn) {
      this.username = this.authService.getUsername();
      this.isAdmin = this.authService.isAdmin();
    } else {
      this.username = null;
      this.isAdmin = false;
    }
  }

  private updateCartCount(): void {
    this.cartItemCount = this.cartService.getItemCount();
  }

  logout(): void {
    this.authService.logout();
    this.cartItemCount = 0;
    localStorage.removeItem('cart_v1');
    this.router.navigate(['/login']);
  }
}