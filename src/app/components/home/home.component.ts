import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Product, ProductWithCategory } from '../../models/product';
import { Category } from '../../models/category';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: ProductWithCategory[] = [];
  categories: Category[] = [];
  selectedCategoryId: number | null = null;
  searchQuery: string = '';
  loading: boolean = false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.loadCategories();
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    
    const loadObservable = this.selectedCategoryId 
      ? this.productService.getByCategory(this.selectedCategoryId)
      : this.searchQuery 
        ? this.productService.search(this.searchQuery)
        : this.productService.getAll();

    loadObservable.subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products', err);
        this.loading = false;
        this.toastr.error('Failed to load products');
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Error loading categories', err);
        this.toastr.error('Failed to load categories');
      }
    });
  }

  filterByCategory(categoryId: number): void {
    this.selectedCategoryId = categoryId;
    this.searchQuery = '';
    this.loadProducts();
  }

  searchProducts(): void {
    if (this.searchQuery.trim()) {
      this.selectedCategoryId = null;
      this.loadProducts();
    } else {
      this.clearFilters(); 
    }
  }

  clearFilters(): void {
    this.selectedCategoryId = null;
    this.searchQuery = '';
    this.loadProducts();
  }

  addToCart(product: Product): void {
    if (product.stockQuantity <= 0) {
      this.toastr.warning('This product is out of stock');
      return;
    }
    
    /*if (!this.authService.hasValidToken()) {
      this.toastr.info('Please log in to add items to cart');
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: this.router.url } 
      });
      return;
    }*/
  
    this.cartService.addItem(product.id, product.price, 1);
    this.toastr.success(`${product.name} added to cart!`);
  }

  viewProductDetails(productId: number): void {
    this.router.navigate(['/product-details', productId]);
  }

  getRatingStars(rating: number) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return {
      fullStars: Array(fullStars).fill(0),
      hasHalfStar,
      emptyStars: Array(emptyStars).fill(0)
    };
  }
}