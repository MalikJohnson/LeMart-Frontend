import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Category,
  CategoryWithProducts,
  CreateCategoryRequest,
  UpdateCategoryRequest
} from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) { }

  // GET METHODS
  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  getById(id: number): Observable<CategoryWithProducts> {
    return this.http.get<CategoryWithProducts>(`${this.apiUrl}/${id}`);
  }

  getWithProducts(id: number): Observable<CategoryWithProducts> {
    return this.http.get<CategoryWithProducts>(`${this.apiUrl}/${id}/products`);
  }

  // ADMIN OPERATIONS
  create(category: CreateCategoryRequest): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }

  update(id: number, updates: UpdateCategoryRequest): Observable<Category> {
    return this.http.patch<Category>(`${this.apiUrl}/${id}`, updates);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}