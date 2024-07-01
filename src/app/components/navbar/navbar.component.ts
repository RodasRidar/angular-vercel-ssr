import { AfterViewInit, Component, Input, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortraitComponent } from '../portrait/portrait.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TailwindColor } from '../../model/color.type';
import { NavBarItem } from '../../model/nav.interface';
import { Collapse } from 'flowbite';
import { CartComponent } from '../cart/cart.component';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { SystemConfigurationService } from '../../services/system-configuration.service';
import { ClientService } from '../../services/client.service';
import { trigger, state, style, transition, animate } from '@angular/animations';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, PortraitComponent, RouterLink, RouterLinkActive,CartComponent],
  templateUrl: './navbar.component.html',
  animations: [
    trigger('cartAnimation', [
      state('start', style({ transform: 'scale(1)' })),
      state('end', style({ transform: 'scale(1.2)' })),
      transition('start => end', [
        animate('0.5s ease')
      ]),
      transition('end => start', [
        animate('0.5s ease')
      ])
      
    ])
  ]
})
export class NavbarComponent {
  @Input() isCheckout: boolean = false;

  businessName = '';
  BusinessColor: TailwindColor = 'pink';
  BusinessLogo: string = '';
  lstMenu: NavBarItem[] = [];
  isLoading: boolean = false;
  showCart = 'inactivate'
  numItemsCart = 0
  cartState = 'start';
  constructor(private readonly shoppingCartService: ShoppingCartService,
    private readonly systemConfiguration: SystemConfigurationService,
    private readonly clientService: ClientService) {
    afterNextRender(() => {
      const $targetEl: HTMLElement = document.getElementById(
        'navbar-cta'
      ) as HTMLElement;
  
      // optionally set a trigger element (eg. a button, hamburger icon)
      const $triggerEl: HTMLElement = document.getElementById(
        'triggerEl'
      ) as HTMLElement;
  
      const collapse = new Collapse($targetEl, $triggerEl);
      collapse.collapse();
    })
  }
  ngOnInit(): void {
    this.shoppingCartService.shoppingCart$.subscribe(shoppingCart => {

      this.numItemsCart = this.shoppingCartService.getTotalItemsByShoppingCart(shoppingCart);
      this.cartState = this.cartState === 'start' ? 'end' : 'start';
      setTimeout(() => {
        this.cartState = 'start';
      }, 500); 
    })

    this.systemConfiguration.getSystemConfiguration().subscribe(config => {
      if (config) {
        this.BusinessColor = config.businessColor;
        this.BusinessLogo = config.businessLogo??'';
        this.isLoading = false;
      }
    })
    this.clientService.getClient().subscribe(client => {
      if (client) {
        this.businessName = client.companyName ?? '';

      }
    })
    this.systemConfiguration.getNavBarItem().subscribe(navBarItems => {
      if (navBarItems) {
        this.lstMenu = navBarItems;
      }
    })
  }
  get Color() {
    const colorsList: { [key: string]: string } = {
      indigo: 'text-indigo-500',
      gray: 'text-gray-500',
      red: 'text-red-500',
      yellow: 'text-yellow-500',
      green: 'text-green-500',
      blue: 'text-blue-500',
      purple: 'text-purple-500',
      pink: 'text-pink-500',
      sky: 'text-sky-500',
      orange: 'text-orange-500',
      teal: 'text-teal-500',
      lime: 'text-lime-500',
      fuchsia: 'text-fuchsia-500',
      black: 'text-black',
    };
    return colorsList[this.BusinessColor];
  }
  get BGColor() {
    const colorsList: { [key: string]: string } = {
      indigo: 'bg-indigo-500',
      gray: 'bg-gray-500',
      red: 'bg-red-500',
      yellow: 'bg-yellow-500',
      green: 'bg-green-500',
      blue: 'bg-blue-500',
      purple: 'bg-purple-500',
      pink: 'bg-pink-500',
      sky: 'bg-sky-500',
      orange: 'bg-orange-500',
      teal: 'bg-teal-500',
      lime: 'bg-lime-500',
      fuchsia: 'bg-fuchsia-500',
      black: 'bg-black',
    };
    return colorsList[this.BusinessColor];
  }
  getLogoName(cadena: string): string {
    const palabras = cadena.split(' ');

    // Tomar las dos primeras palabras
    const primeraPalabra = palabras.length > 0 ? palabras[0] : '';
    const segundaPalabra = palabras.length > 1 ? palabras[1] : '';

    // Obtener las iniciales en mayúscula
    const iniciales = `${primeraPalabra.charAt(0).toUpperCase()}${segundaPalabra
      .charAt(0)
      .toUpperCase()}`;

    return iniciales;
  }
  verCarrito(){
    this.shoppingCartService.toggleCart();
  }
}
