import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ItemShoppingCart, ShoppingCart } from '../../model/item-shopping-cart';
import { CommonModule, CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DiscountPipe } from '../../pipes/discount.pipe';
import { ProductQuantityComponent } from '../product-quantity/product-quantity.component';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { SystemConfigurationService } from '../../services/system-configuration.service';
import { Subscription } from 'rxjs';
import { TailwindColor } from '../../model/color.type';

@Component({
  selector: 'app-order-summary-item',
  standalone: true,
  imports: [NgOptimizedImage,RouterLink,DiscountPipe,CurrencyPipe,ProductQuantityComponent,CommonModule],
  templateUrl: './order-summary-item.component.html'
})
export class OrderSummaryItemComponent {

  @Input() item: ItemShoppingCart = <ItemShoppingCart>{};
  @Output() quantityValueChanged = new EventEmitter<number>();
  @Output() deleteItem = new EventEmitter<ItemShoppingCart>();

  shoppingCart: ShoppingCart = <ShoppingCart>{};
  private configSubscription: Subscription | undefined;

  constructor(private readonly shoppingCartService: ShoppingCartService,
    private readonly systemConfigurationService: SystemConfigurationService
  ) { }
  
  state = 'active';
  businessColor: TailwindColor = 'pink';


  ngOnInit() {
    this.shoppingCartService.cartState$.subscribe(state => {
      state ? this.state = 'active' : this.state = 'inactive';
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

  quantityValue(value: number) {
    this.quantityValueChanged.emit(value);
  }

  deleteItemFromCart() {
    this.deleteItem.emit(this.item);
  }
  
  get TextHoverClass() {
    const colorsList: { [key: string]: string } = {
      indigo: 'hover:bg-indigo-300',
      gray: 'hover:bg-gray-300',
      red: 'hover:bg-red-300',
      yellow: 'hover:bg-yellow-300',
      green: 'hover:bg-green-300',
      blue: 'hover:bg-blue-300',
      purple: 'hover:bg-purple-300',
      pink: 'hover:bg-pink-300',
      sky: 'hover:bg-sky-300',
      orange: 'hover:bg-orange-300',
      teal: 'hover:bg-teal-300',
      lime: 'hover:bg-lime-300',
      fuchsia: 'hover:bg-fuchsia-300',
      black: 'hover:bg-grey-700',
    };
    return colorsList[this.businessColor];
  }
}
