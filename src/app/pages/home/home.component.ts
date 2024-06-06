/* eslint-disable prettier/prettier */
import { Component, Inject, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { forkJoin, mergeMap, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { HomeBannerComponent } from '../../components/home-banner/home-banner.component';
import { ItemDishComponent } from '../../components/item-product/item-product.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Client } from '../../model/client.interface';
import { NavBarItem } from '../../model/nav.interface';
import { Product } from '../../model/product.interface';
import { SystemConfiguration } from '../../model/system-configuration.interface';
import { ClientService } from '../../services/client.service';
import { SystemConfigurationService } from '../../services/system-configuration.service';
import { SeoService } from '../../services/seo.service';
import { SUBDOMAIN } from '../../../subdomain.token';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ItemDishComponent,
    NavbarComponent,
    FooterComponent,
    HomeBannerComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  businessSlug: string = '';
  title = 'Inicio';
  //Inyecciones
  seo = inject(SeoService);
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

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private route: ActivatedRoute, @Inject(SUBDOMAIN) private subdomain: string) {
  }

  ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      this.businessSlug = this.subdomain;
    }
    else {
      this.businessSlug = window.location.hostname.split('.')[0];
    }
    // this.businessSlug = this.route.snapshot.data["businessSlug"];


    forkJoin([this.getClientAndLocations(), this.getSystemConfigAndMenu()]).subscribe(
      ([clientAndLocations, systemConfig]) => {
        const [products, client, locations] = clientAndLocations;

        // console.log(products);

        this.clientSignal.set(client[0]);
        // console.log(client);

        this.imagePortrait.set(locations[0].imagePortrait ?? '');
        // console.log(locations);

        this.lstProductsOnHomePage = products;

        // Finaliza el estado de loading
        this.isLoading.set(false);
      },
      error => {
        console.error('Error en una de las peticiones', error);
        this.isLoading.set(false);
      });

    this.seo.title.setTitle(this.clientSignal().companyName ?? '');
    this.seo.meta.updateTag({ name: "description", content: `Estamos probando SSR, esta una pagina de ${this.businessSlug}` });
    this.seo.setCanonicalURL(`www.${this.businessSlug}.fodi.app`);
    this.seo.setIndexFollow(true);
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
  get BackgroundImageClass() {
    const colorsList: { [key: string]: string } = {
      indigo: 'from-indigo-300 via-indigo-300',
      gray: 'from-gray-300 via-gray-300',
      red: 'from-red-300 via-red-300',
      yellow: 'from-yellow-300 via-yellow-300',
      green: 'from-green-300 via-green-300',
      blue: 'from-blue-300 via-blue-300',
      purple: 'from-purple-300 via-purple-300',
      pink: 'from-pink-300 via-pink-300',
      sky: 'from-sky-300 via-sky-300',
      orange: 'from-orange-300 via-orange-300',
      teal: 'from-teal-300 via-teal-300',
      lime: 'from-lime-300 via-lime-300',
      fuchsia: 'from-fuchsia-300 via-fuchsia-300',
      black: 'from-black via-black',
    };
    return colorsList[this.systemConfig().businessColor];
  }
}
