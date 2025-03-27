import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  Product,
  ProductWithCategory,
  CreateProductRequest,
  UpdateProductRequest,
  //PagedResponse
} from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  // GET METHODS
  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getById(id: number): Observable<ProductWithCategory> {
    return this.http.get<ProductWithCategory>(`${this.apiUrl}/${id}`);
  }

  getByCategory(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${categoryId}`);
  }

  search(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/search`, { 
      params: { name: query }
    });
  }

  /*getPaged(page = 1, pageSize = 10): Observable<PagedResponse<Product>> {
    return this.http.get<PagedResponse<Product>>(`${this.apiUrl}/paged`, {
      params: { page, pageSize }
    });
  }*/

  // ADMIN METHODS
  create(product: CreateProductRequest): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  update(id: number, updates: UpdateProductRequest): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/${id}`, updates);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}