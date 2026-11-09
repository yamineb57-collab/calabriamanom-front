import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';

export interface CurrentUser {
  username: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = '/api/auth';

  constructor(private http: HttpClient) {}

  /**
   * Récupère un cookie CSRF avant la première connexion.
   */
  initializeCsrf(): Observable<unknown> {
    return this.http.get('/api/plats', {
      withCredentials: true
    });
  }

  /**
   * Connexion avec les identifiants administrateur.
   */
  login(username: string, password: string): Observable<void> {
    const body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);

    return this.initializeCsrf().pipe(
      switchMap(() =>
        this.http.post<void>(
          `${this.apiUrl}/login`,
          body.toString(),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            withCredentials: true
          }
        )
      )
    );
  }

  getCurrentUser(): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(`${this.apiUrl}/me`, {
      withCredentials: true
    });
  }

  logout(): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/logout`,
      {},
      { withCredentials: true }
    );
  }
}
