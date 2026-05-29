import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface AuthUser {
  username: string;
  role: string;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  login(username: string, password: string): Observable<AuthUser | null> {
    // Simulación de autenticación (mock)
    if (username === 'admin' && password === 'admin123') {
      const user: AuthUser = {
        username: 'admin',
        role: 'WAREHOUSE_MANAGER',
        token: 'mock-jwt-token-' + Date.now()
      };
      this.currentUserSubject.next(user);
      localStorage.setItem('petlogilink_user', JSON.stringify(user));
      return of(user).pipe(delay(600));
    }
    return of(null).pipe(delay(600));
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('petlogilink_user');
  }

  isLoggedIn(): boolean {
    const stored = localStorage.getItem('petlogilink_user');
    if (stored) {
      this.currentUserSubject.next(JSON.parse(stored));
      return true;
    }
    return !!this.currentUserSubject.value;
  }

  getUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }
}
