import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Plat} from '../models/plat';

@Injectable({
  providedIn: 'root'
})
export class PlatService {
  private apiUrl = 'http://localhost:8080/api/plats';

  constructor(private http: HttpClient) {}

  getAllPlats(): Observable<Plat[]> {
    return this.http.get<Plat[]>(this.apiUrl);
  }

  getById(id: number): Observable<Plat> {
    return this.http.get<Plat>(`${this.apiUrl}/${id}`);
  }

  getPlatsByType(type: string): Observable<Plat> {
    return this.http.get<Plat>(`${this.apiUrl}` + `/type/${type}`);
  }

  create(plat: Plat): Observable<any> {
    return this.http.post<Plat>(this.apiUrl, plat);
  }

  update(id: number, plat: Plat): Observable<any> {
    return this.http.put<Plat>(`${this.apiUrl}/${id}`, plat);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
