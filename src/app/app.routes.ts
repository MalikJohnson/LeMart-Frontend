import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductService } from './services/product.service';
import { CartService } from './services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './services/auth.service';
import { CategoryService } from './services/category.service';
//import { ProductListComponent } from './components/product-list/product-list.component'; // Commented out
//import { ProductDetailComponent } from './components/product-detail/product-detail.component'; // Commented out
//import { CartComponent } from './components/cart/cart.component'; // Commented out
//import { CheckoutComponent } from './components/checkout/checkout.component'; // Commented out
//import { LoginComponent } from './components/login/login.component'; // Commented out
//import { SignupComponent } from './components/signup/signup.component'; // Commented out
//import { ProfileComponent } from './components/profile/profile.component'; // Commented out
//import { OrderHistoryComponent } from './components/order-history/order-history.component'; // Commented out

export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent,
    providers: [
      ProductService,
      CategoryService,
      CartService,
      AuthService,
      ToastrService
    ]
  },
  { path: '**', redirectTo: '' }
];