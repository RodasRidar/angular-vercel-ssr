import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';


const BASE_URL = environment.API_SUPABSE_URL;
const TABLE = 'catalog';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  constructor(private http: HttpClient) {}
  getByUserId(userId: string) {
    return this.http.get(
      `${BASE_URL}/rest/v1/${TABLE}/${userId}?id=eq.1&select=*`
    );
  }
}
