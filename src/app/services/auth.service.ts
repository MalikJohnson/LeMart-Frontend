import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

interface SignupResponse {
  token: string;
  message: string;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'auth_token';
  private usernameKey = 'auth_username';
  private jwtHelper = new JwtHelperService();
  
  private authStatus = new BehaviorSubject<boolean>(this.hasValidToken());
  public authStatus$ = this.authStatus.asObservable();

  constructor(private http: HttpClient) {}

  // Auth methods
  login(credentials: { username: string; password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap({
        next: (response) => this.handleAuthSuccess(response.token),
        error: (error) => {
          throw new Error(error.error?.message || 'Login failed');
        }
      })
    );
  }

  signup(userData: any): Observable<SignupResponse> {
    return this.http.post<SignupResponse>(`${this.apiUrl}/auth/signup`, userData).pipe(
      tap(response => this.handleAuthSuccess(response.token, response.username))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usernameKey);
    this.authStatus.next(false);
  }

  // Token methds
  private handleAuthSuccess(token: string, username?: string): void {
    this.setToken(token);
    if (username) {
      this.setUsername(username);
    }
    this.authStatus.next(true);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setUsername(username: string): void {
    localStorage.setItem(this.usernameKey, username);
  }

  // Auth checkss
  hasValidToken(): boolean {
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;
    const decoded = this.jwtHelper.decodeToken(token);
    return decoded?.userId || null;
  }

  getUsername(): string | null {
    // First try JWT, then fallback to localStorage
    const token = this.getToken();
    if (token) {
      const decoded = this.jwtHelper.decodeToken(token);
      if (decoded?.username) return decoded.username;
    }
    return localStorage.getItem(this.usernameKey);
  }

  isAdmin(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const decoded = this.jwtHelper.decodeToken(token);
    return decoded?.role === 'ADMIN';
  }
}