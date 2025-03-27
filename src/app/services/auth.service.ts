import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'auth_token';
  private jwtHelper = new JwtHelperService();
  
  private authStatus = new BehaviorSubject<boolean>(this.hasValidToken());
  public authStatus$ = this.authStatus.asObservable();

  constructor(private http: HttpClient) {}


  // Core Methods
  login(credentials: { username: string; password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => this.handleLogin(response.token))
    );
  }

  signup(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/signup`, userData);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.authStatus.next(false);
  }

  // Token Methods
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  hasValidToken(): boolean {
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  // User Info
  getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;
    return this.jwtHelper.decodeToken(token).userId;
  }

  getUsername(): string | null {
    const token = this.getToken();
    if (!token) return null;
    return this.jwtHelper.decodeToken(token).username;
  }

  isAdmin(): boolean {
    const token = this.getToken();
    if (!token) return false;
    return this.jwtHelper.decodeToken(token).role === 'ADMIN';
  }

  // Private
  private handleLogin(token: string): void {
    this.setToken(token);
    this.authStatus.next(true);
  }
}