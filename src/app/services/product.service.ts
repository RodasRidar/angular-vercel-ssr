import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Product } from '../model/product.interface';
import { Observable } from 'rxjs';


const BASE_URL = environment.API_SUPABSE_URL;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}
  getProductsByIdUser(idUser: string) {
    return this.http.get(
      `${BASE_URL}/rest/v1/products/${idUser}?id=eq.1&select=*`
    );
  } 

  getProductsByProductId(productId: string): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${BASE_URL}/rest/v1/products?id=eq.${productId}&select=*`
    );
  }
}
