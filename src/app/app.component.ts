import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; 
import { NavComponent } from './components/nav/nav.component'; 
//import { FooterComponent } from './components/footer/footer.component'; 
//import { HomeComponent } from './components/home/home.component'; 
//import { ProductListComponent } from './components/product-list/product-list.component';
//import { ProductDetailComponent } from './components/product-detail/product-detail.component'; 
//import { CartComponent } from './components/cart/cart.component'; 
//import { CheckoutComponent } from './components/checkout/checkout.component'; 
import { LoginComponent } from './components/login/login.component'; 
import { SignupComponent } from './components/signup/signup.component'; 
//import { ProfileComponent } from './components/profile/profile.component'; 
//import { OrderHistoryComponent } from './components/order-history/order-history.component'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
     RouterOutlet,
     NavComponent, 
     //FooterComponent, 
     //HomeComponent,
     //ProductListComponent,
     //ProductDetailComponent,
     //CartComponent, 
     //CheckoutComponent,
     //LoginComponent,
     //SignupComponent, 
     //ProfileComponent,
     //OrderHistoryComponent, 
  ],
  template: `
    <app-nav></app-nav>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'le-mart-app';
}