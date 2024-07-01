import { Component, Inject, PLATFORM_ID, afterNextRender, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { SystemConfigurationService } from './services/system-configuration.service';
import { ClientService } from './services/client.service';
import { forkJoin, mergeMap, of } from 'rxjs';
import { Client } from './model/client.interface';
import { NavBarItem } from './model/nav.interface';
import { Product } from './model/product.interface';
import { SystemConfiguration } from './model/system-configuration.interface';
import { SUBDOMAIN } from '../subdomain.token';
import { CommonModule, isPlatformServer } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})

export class AppComponent {
  tenant = '';
  businessSlug: string = '';
  title = 'Inicio';
  //Inyecciones
  clientService = inject(ClientService);
  router = inject(Router);
  sistemConfigurationService = inject(SystemConfigurationService);
  //Variables
  lstProductsOnHomePage: Product[] = [];
  isLoading = signal<boolean>(false);

  clientSignal = signal<Client>({
    id_client: '',
    username: '',
    name: '',
    tin: '',
    locations: [],
    companyName: '',
    email: '',
    phone: '',
    image: '',
    emailVerified: null,
    accounts: [],
    sessions: [],
    subscription: null,
    businessType: '',
    isActive: null,
    SystemConfiguration: [],
  });

  systemConfig = signal<SystemConfiguration>({
    id: '',
    idClient: '',
    businessColor: 'gray',
  });

  lstMenu = signal<NavBarItem[]>([]);

  imagePortrait = signal<string>('');

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(SUBDOMAIN) private subdomain: string,
  ) {

    afterNextRender(() => {
      initFlowbite();
    })

  }

  ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      this.businessSlug = this.subdomain;
    }
    else {
      this.businessSlug = window.location.hostname.split('.')[0];
    }
    // this.businessSlug = 'fodi'
    forkJoin([this.getClientAndLocations(), this.getSystemConfigAndMenu()]).subscribe(
      ([clientAndLocations, systemConfig]) => {
        const [products, client, locations] = clientAndLocations;

        // console.log(products);

        this.clientSignal.set(client[0]);
        // console.log(client);
        this.clientService.setClient(client[0]);

        this.imagePortrait.set(locations[0].imagePortrait ?? '');
        // console.log(locations);

        this.lstProductsOnHomePage = products;

        // Finaliza el estado de loading
        this.isLoading.set(false);
      },
      error => {
        this.router.navigateByUrl('https://fodi.app/negocio-no-existente');
        console.error('Error en una de las peticiones', error);
        this.isLoading.set(false);
      });
  }

  getClientAndLocations = () => {
    return this.clientService.getClientIdByBusinessSlug(this.businessSlug).pipe(
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
    return this.clientService.getSystemConfigByBusinessSlug(this.businessSlug).pipe(
      mergeMap(systemConfig => {
        this.systemConfig.set(systemConfig[0]);
        this.systemConfig.update((config) => {
          config.businessColor = 'red';
          return config;
        })
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
        this.sistemConfigurationService.setNavBarItem(menu);
        this.lstMenu.set(menu);

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
