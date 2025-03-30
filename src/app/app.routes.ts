import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

// Keep commented imports for future reference
// import { ProductListComponent } from './components/product-list/product-list.component';
// import { ProductDetailComponent } from './components/product-detail/product-detail.component'; 
 //import { CartComponent } from './components/cart/cart.component'; 
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
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  // Add other routes as you uncomment components
  // {
  //   path: 'products',
  //   loadComponent: () => import('./components/product-list/product-list.component').then(m => m.ProductListComponent)
  // },
   {
     path: 'cart',
     loadComponent: () => import('./components/cart/cart.component').then(m => m.CartComponent)
   },
  // {
  //   path: 'checkout',
  //   loadComponent: () => import('./components/checkout/checkout.component').then(m => m.CheckoutComponent)
  // },
  // {
  //   path: 'profile',
  //   loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent)
  // },
  // {
  //   path: 'orders',
  //   loadComponent: () => import('./components/order-history/order-history.component').then(m => m.OrderHistoryComponent)
  // },
  { path: '**', redirectTo: '' }
];