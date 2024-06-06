import { Inject, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { forkJoin, mergeMap, of } from 'rxjs';
import { isPlatformServer } from '@angular/common';
import { SUBDOMAIN } from '../../subdomain.token';
import { Interface } from 'readline';
import { Product } from '../model/product.interface';
import { Client } from '../model/client.interface';
import { NavBarItem } from '../model/nav.interface';
import { SystemConfiguration } from '../model/system-configuration.interface';
import { ClientService } from './client.service';
import { SystemConfigurationService } from './system-configuration.service';

@Injectable()
export class ClientResolver implements Resolve<HomeView> {

  homeView:HomeView = <HomeView>{};
  clientService = inject(ClientService);
  router = inject(Router);
  sistemConfigurationService = inject(SystemConfigurationService);

  constructor(
    @Inject(SUBDOMAIN) private subdomain: string, 
    @Inject(PLATFORM_ID) private platformId: any
  ) 
    {
      if (isPlatformServer(this.platformId)) {
        this.homeView.businessSlug = this.subdomain;
      }
      else {
        this.homeView.businessSlug = window.location.hostname.split('.')[0];
      }

      forkJoin([this.getClientAndLocations(), this.getSystemConfigAndMenu()]).subscribe(
        ([clientAndLocations, systemConfig]) => {
          const [products, client, locations] = clientAndLocations;
          this.homeView.client =client[0];
          this.homeView.imagePortrait = locations[0].imagePortrait ?? '';
          this.homeView.lstProductsOnHomePage = products;
        },
        error => {
          console.error('Error en una de las peticiones', error);
        });

    }

    resolve(): any {
        return of(this.homeView);
    }

    getClientAndLocations = () => {
      return this.clientService.getClientIdByBusinessSlug(this.homeView.businessSlug).pipe(
        mergeMap((res: any[]) => {
          console.log(res);
  
          if (res) {
            const clientId = res[0].id_client;
  
            const getClient$ = this.clientService.getClientByClientId(clientId);
            const getLocation$ = this.clientService.getLocationByClientId(clientId);
  
            return forkJoin([getClient$, getLocation$]);
          } else {
            this.router.navigateByUrl('https://fodi.app/negocio-no-existente');
            return of([] as any);
          }
        }),
        mergeMap(([client, locations]: [any, any]) => {
          if (client.length > 0 && locations.length > 0) {
            const catalogId = locations[0].cartalog_id;
  
            const getSections$ = this.clientService.getSectionsByCatalogId(catalogId);
            const getProducts$ = getSections$.pipe(
              mergeMap(sections => {
                // console.log(sections);
                const sectionId = sections[0].id;
                return this.clientService.getProductsBySectionId(sectionId);
              })
            );
  
            return forkJoin([getProducts$, of(client), of(locations)]);
          } else {
            return of([] as any);
          }
        })
      );
    };
  
    getSystemConfigAndMenu = () => {
      return this.clientService.getSystemConfigByBusinessSlug(this.homeView.businessSlug).pipe(
        mergeMap(systemConfig => {
          this.homeView.systemConfig = systemConfig[0] ;
          this.sistemConfigurationService.setSystemConfiguration(systemConfig[0]);
  
          const menu = [
            {
              id: 1,
              name: 'Inicio',
              url: `/inicio`,
            },
            {
              id: 2,
              name: this.geNameFromCatalogName(systemConfig[0].catalogName ?? ''),
              url: `/${systemConfig[0].catalogName}` ?? '',
            },
            // Otros elementos de menú...
          ];
  
          this.homeView.lstMenu = menu;
  
          return of(systemConfig);
        })
      );
    };
  
    geNameFromCatalogName(name: string) {
      switch (name) {
        case 'catalogo':
          return 'Catálogo';
        case 'carta':
          return 'La Carta';
        case 'productos':
          return 'Productos';
        default:
          return 'Productos.';
      }
    }
}


export interface HomeView{
  businessSlug:string
  lstProductsOnHomePage:Product[]
  client:Client,
  systemConfig:SystemConfiguration,
  lstMenu:NavBarItem[],
  imagePortrait:string
}