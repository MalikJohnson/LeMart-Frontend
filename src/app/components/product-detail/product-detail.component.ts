import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ProductWithCategory } from '../../models/product';
import { CartService } from '../../services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: ProductWithCategory | null = null;
  loading: boolean = false;
  stars: number[] = [1, 2, 3, 4, 5]; // For star rating display

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    const productId = this.route.snapshot.paramMap.get('id');
    
    if (productId) {
      this.productService.getById(+productId).subscribe({
        next: (product) => {
          this.product = product;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading product', err);
          this.loading = false;
          this.toastr.error('Failed to load product details');
          this.router.navigate(['/']); // Redirect to home if error
        }
      });
    } else {
      this.router.navigate(['/']); // Redirect to home if no product ID
    }
  }

  addToCart(): void {
    if (!this.product) return;

    if (this.product.stockQuantity <= 0) {
      this.toastr.warning('This product is out of stock');
      return;
    }

    this.cartService.addItem(this.product.id, this.product.price, 1);
    this.toastr.success(`${this.product.name} added to cart!`);
  }

  goBack(): void {
    this.router.navigate(['/']);
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