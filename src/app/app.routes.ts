import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

// Keep commented imports for future reference
// import { ProductListComponent } from './components/product-list/product-list.component';
// import { ProductDetailComponent } from './components/product-detail/product-detail.component'; 
// import { CartComponent } from './components/cart/cart.component'; 
// import { CheckoutComponent } from './components/checkout/checkout.component'; 
// import { LoginComponent } from './components/login/login.component'; 
// import { SignupComponent } from './components/signup/signup.component'; 
// import { ProfileComponent } from './components/profile/profile.component'; 
// import { OrderHistoryComponent } from './components/order-history/order-history.component';

export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent
  },
  {
    path: 'signup',
    loadComponent: () => import('./components/signup/signup.component').then(m => m.SignupComponent)
  },
  // Add other routes as you uncomment components
  // {
  //   path: 'login',
  //   loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  // },
  { path: '**', redirectTo: '' }
];