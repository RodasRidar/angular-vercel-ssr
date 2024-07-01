import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { SystemConfiguration } from '../model/system-configuration.interface';
import { Product } from '../model/product.interface';
import { Section } from '../model/section.interfaces';

import { Client } from '../model/client.interface';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, Observable } from 'rxjs';

const BASE_URL = environment.API_SUPABSE_URL;
const TABLE = 'clients';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor(private http: HttpClient) {}
  getClientByClientId(clientId: string) {
    return this.http.get<Client[]>(
      `${BASE_URL}/rest/v1/${TABLE}?id=eq.${clientId}&select=*`
    );
  }
  getClientIdByBusinessSlug(businessSlug: string) {
    return this.http.get<Client[]>(
      `${BASE_URL}/rest/v1/system_configurations?businessSlug=eq.${businessSlug}&select=id_client`
    );
  }

  getSystemConfigByBusinessSlug(businessSlug: string) {
    return this.http.get<SystemConfiguration[]>(
      `${BASE_URL}/rest/v1/system_configurations?businessSlug=eq.${businessSlug}&select=*`
    );
  }

  getLocationByClientId(clientId: string) {
    return this.http.get<Location[]>(
      `${BASE_URL}/rest/v1/locations?client_id=eq.${clientId}&select=*`
    );
  }

  // getLocationByCatalogId(locationId: string) {
  //   return this.http.get<Location[]>(
  //     `${BASE_URL}/rest/v1/locations?catalog_id=eq.${locationId}&select=*`
  //   );
  // }
  getSectionsByCatalogId(catalogId: string) {
    return this.http.get<Section[]>(
      `${BASE_URL}/rest/v1/sections?catalog_id=eq.${catalogId}&select=*`
    );
  }
  getProductsBySectionId(sectionId: string) {
    return this.http.get<Product[]>(
      `${BASE_URL}/rest/v1/products?section_id=eq.${sectionId}&select=*`
    );
  }

  private ClientSubjetct: BehaviorSubject<Client | null> = new BehaviorSubject<Client | null>(null);

  setClient(reg: Client | null): void {
    this.ClientSubjetct.next(reg);
  }

  getClient(): Observable<Client | null> {
    return this.ClientSubjetct.asObservable();
  }
}
