import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { SystemConfigurationService } from '../../services/system-configuration.service';
import { ButtonComponent } from '../button/button.component';
import { Subscription } from 'rxjs';
import { ItemShoppingCart, ShoppingCart } from '../../model/item-shopping-cart';
import { RouterLink } from '@angular/router';
import { ProductQuantityComponent } from '../product-quantity/product-quantity.component';
import { DiscountPipe } from '../../pipes/discount.pipe';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
  imports: [CommonModule, ButtonComponent, RouterLink,ProductQuantityComponent,DiscountPipe,NgOptimizedImage],
  animations: [
    trigger('fadeInOut', [
      state('inactive', style({
        opacity: 0,
        transform: 'translateX(100%)'
      })),
      state('active', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('inactive => active', [
        animate('200ms ease-in-out')
      ]),
      transition('active => inactive', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class CartComponent {
  readonly MAX_QUANTITY = 20;
  readonly MIN_QUANTITY = 0;
  state = 'active';
  businessColor = 'pink';
  private configSubscription: Subscription | undefined;

  shoppingCart: ShoppingCart = <ShoppingCart>{};
  constructor(private readonly shoppingCartService: ShoppingCartService,
    private readonly systemConfigurationService: SystemConfigurationService
  ) {}

  ngOnInit() {
    this.shoppingCartService.cartState$.subscribe(state => {
      state ? this.state = 'active' : this.state = 'inactive' ;
    });
    
    this.configSubscription = this.systemConfigurationService.getSystemConfiguration().subscribe(config => {
      if (config) {
        this.businessColor = config.businessColor;
      } else {
        this.businessColor = 'pink';
      }
    });

    this.shoppingCartService.shoppingCart$.subscribe(shoppingCart => {
      if (shoppingCart && shoppingCart.items.length > 0) {
        this.shoppingCart = shoppingCart;
        this.shoppingCart.totalItems = this.shoppingCartService.getTotalItemsByShoppingCart(this.shoppingCart);
        this.shoppingCart.total = this.shoppingCartService.getTotalByShoppingCart(this.shoppingCart);
        this.shoppingCart.subTotal = this.shoppingCartService.getSubTotalByShoppingCart(this.shoppingCart);
        this.shoppingCart.totalDiscount = this.shoppingCartService.getTotalDiscountByShoppingCart(this.shoppingCart);
      }
    })
  }

  toggle() {
    if(this.state === 'active'){
      this.state = 'inactive';
    }else{
      this.state = 'active';
    }
    this.shoppingCartService.toggleCart();
  }

  get TextColorClass() {
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
    return colorsList[this.businessColor];
  }

  get TextHoverClass() {
    const colorsList: { [key: string]: string } = {
      indigo: 'hover:text-indigo-300',
      gray: 'hover:text-gray-300',
      red: 'hover:text-red-300',
      yellow: 'hover:text-yellow-300',
      green: 'hover:text-green-300',
      blue: 'hover:text-blue-300',
      purple: 'hover:text-purple-300',
      pink: 'hover:text-pink-300',
      sky: 'hover:text-sky-300',
      orange: 'hover:text-orange-300',
      teal: 'hover:text-teal-300',
      lime: 'hover:text-lime-300',
      fuchsia: 'hover:text-fuchsia-300',
      black: 'hover:text-grey-700',
    };
    return colorsList[this.businessColor];
  }

  ngOnDestroy(): void {
    if (this.configSubscription) {
      this.configSubscription.unsubscribe();
    }
  }
  
  quantityValue(value: number , product: ItemShoppingCart) {
    product.quantity = value
    this.shoppingCart.totalItems = this.shoppingCartService.getTotalItemsByShoppingCart(this.shoppingCart);
    this.shoppingCart.total = this.shoppingCartService.getTotalByShoppingCart(this.shoppingCart);
    this.shoppingCart.subTotal = this.shoppingCartService.getSubTotalByShoppingCart(this.shoppingCart);
    this.shoppingCart.totalDiscount = this.shoppingCartService.getTotalDiscountByShoppingCart(this.shoppingCart);
    this.shoppingCartService.setShoppingCart(this.shoppingCart);
  }

  deleteItemFromCart(product: ItemShoppingCart) {
    this.shoppingCart.items = this.shoppingCart.items.filter(item => item.product.id !== product.product.id);
    this.shoppingCart.totalItems = this.shoppingCartService.getTotalItemsByShoppingCart(this.shoppingCart);
    this.shoppingCart.total = this.shoppingCartService.getTotalByShoppingCart(this.shoppingCart);
    this.shoppingCart.subTotal = this.shoppingCartService.getSubTotalByShoppingCart(this.shoppingCart);
    this.shoppingCart.totalDiscount = this.shoppingCartService.getTotalDiscountByShoppingCart(this.shoppingCart);
    this.shoppingCartService.setShoppingCart(this.shoppingCart);
  }
}

