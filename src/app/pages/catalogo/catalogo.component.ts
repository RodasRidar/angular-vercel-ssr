import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  signal,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { mergeMap, forkJoin, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { ItemMenuComponent } from '../../components/item-catalog/item-catalog.component';
import { ItemDishComponent } from '../../components/item-product/item-product.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { PortraitComponent } from '../../components/portrait/portrait.component';
import { Client } from '../../model/client.interface';
import { NavBarItem } from '../../model/nav.interface';
import { Product } from '../../model/product.interface';
import { Section } from '../../model/section.interfaces';
import { SystemConfiguration } from '../../model/system-configuration.interface';
import { ClientService } from '../../services/client.service';
import { SystemConfigurationService } from '../../services/system-configuration.service';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [
    CommonModule,
    ItemDishComponent,
    NgOptimizedImage,
    PortraitComponent,
    ItemMenuComponent,
    NavbarComponent,
    FooterComponent,
  ],
  templateUrl: './catalogo.component.html',
})
export class CatalogoComponent implements OnInit {
  isLoading = signal<boolean>(true);
  constructor(
    private clientService: ClientService,
    private sistemConfigurationService: SystemConfigurationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  @ViewChild('fixedElement') fixedElement: ElementRef = {} as ElementRef;

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
  lstCatalog = signal<Section[]>([]);

  reviewPoints = 4.2;
  reviews = 3;
  sucursal = 'Surco';
  restaurantName = 'Costillitas';
  restaurantPortrait = '';

  product: Product = {
    is_popular: true,
    is_on_sale: true,
    name: 'ALITAS MIS COSTILLITAs',
    price: 57,
    description:
      '10 unidades de puro sabor, doraditas con cualquiera de nuestras SALSAS DE LA CASA    ',
    discountPercentage: 30,
    imageUrl:
      'https://www.miscostillitas.com/inicio/wp-content/uploads/2023/09/ALI-20.jpg',
    section_id: 'section-1',
    id: 'product-1',
  };

  cartaClass = '';
  cartaMargine = '';

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.scrollY;
    // console.log(scrollPosition)
    if (scrollPosition >= 206) {
      this.cartaClass =
        'overflow-auto w-full max-sm:fixed top-[4.9rem] transform-translate-y-1/2'; //top-1/2 left-0 transform -translate-y-1/2
      this.cartaMargine = 'mt-[55px]';
    } else {
      this.cartaClass = '';
      this.cartaMargine = '';
    }
  }

  ngOnInit() {
    //consumir endpoint y llenar datos del restaurante by alias
    const businessSlug = this.getSubDomain(window.location.hostname);

    if (businessSlug === 'negocio-no-existente') {
      this.router.navigate([businessSlug]);
      return;
    }

    if (!businessSlug) {
      this.router.navigate(['negocio-no-existente']);
      return;
    }

    const getClientAndLocations = () => {
      return this.clientService.getClientIdByBusinessSlug(businessSlug).pipe(
        mergeMap((res: any[]) => {
          console.log(res);

          if (res.length > 0) {
            const clientId = res[0].id_client;

            const getClient$ = this.clientService.getClientByClientId(clientId);
            const getLocation$ =
              this.clientService.getLocationByClientId(clientId);

            return forkJoin([getClient$, getLocation$]);
          } else {
            this.router.navigate(['negocio-no-existente']);
            return of([] as any);
          }
        }),
        mergeMap(([client, locations]: [any, any]) => {
          if (client.length > 0 && locations.length > 0) {
            const catalogId = locations[0].cartalog_id;

            const getSections$ =
              this.clientService.getSectionsByCatalogId(catalogId);
            const getProducts$ = getSections$.pipe(
              mergeMap(sections => {
                console.log(sections);
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

    // Función que obtiene configuración del sistema y menu
    const getSystemConfigAndMenu = () => {
      return this.clientService
        .getSystemConfigByBusinessSlug(businessSlug)
        .pipe(
          mergeMap(systemConfig => {
            this.systemConfig.set(systemConfig[0]);
            this.sistemConfigurationService.setSystemConfiguration(
              systemConfig[0]
            );

            const menu = [
              {
                id: 1,
                name: 'Inicio',
                url: `/inicio`,
              },
              {
                id: 2,
                name: this.geNameFromCatalogName(
                  systemConfig[0].catalogName ?? ''
                ),
                url: `/${systemConfig[0].catalogName}` ?? '',
              },
              // Otros elementos de menú...
            ];

            this.lstMenu.set(menu);

            return of(systemConfig);
          })
        );
    };

    // Combina ambas operaciones en un forkJoin
    forkJoin([getClientAndLocations(), getSystemConfigAndMenu()]).subscribe(
      ([clientAndLocations, systemConfig]) => {
        const [products, client, locations] = clientAndLocations;

        console.log(products);

        this.clientSignal.set(client[0]);
        // Finaliza el estado de loading
        this.isLoading.set(false);
      },
      error => {
        console.error('Error en una de las peticiones', error);
        this.isLoading.set(false);
      }
    );
  }

  getSubDomain(currentUrl: string) {
    // Dividir la URL por puntos para obtener los componentes del dominio
    const domainParts = currentUrl.split('.');

    // El subdominio es el primer componente si hay más de un componente en el dominio
    if (domainParts.length > 1) {
      return domainParts[0];
    } else {
      return 'negocio-no-existente';
    }
  }

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
