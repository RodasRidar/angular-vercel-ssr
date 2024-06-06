/* eslint-disable prettier/prettier */
import { AfterContentChecked, AfterViewChecked, Component, Inject, Input, OnInit, PLATFORM_ID, afterNextRender, inject, signal } from '@angular/core';
import { APP_BASE_HREF, CommonModule, DOCUMENT, isPlatformServer } from '@angular/common';
import { Observable, forkJoin, mergeMap, of } from 'rxjs';
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
import { Request } from 'express';
import { HomeView } from '../../services/client.resolver';

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

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private route: ActivatedRoute,) {

  }

  ngOnInit(): void {

    const view : HomeView = this.route.snapshot.data["homeViewResolver"];
    console.log(view);

    this.businessSlug = view.businessSlug;
    this.lstProductsOnHomePage = view.lstProductsOnHomePage;
    this.clientSignal.set(view.client);
    this.systemConfig.set(view.systemConfig);
    this.lstMenu.set(view.lstMenu);
    this.imagePortrait.set(view.imagePortrait);

    console.log('cliente:', this.clientSignal());
    this.seo.title.setTitle(this.clientSignal().companyName ?? '');
    this.seo.meta.updateTag({ name: "description", content: `Estamos probando SSR, esta una pagina de ${this.businessSlug}` });
    this.seo.setCanonicalURL(`www.${this.businessSlug}.fodi.app`);
    this.seo.setIndexFollow(true);
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
