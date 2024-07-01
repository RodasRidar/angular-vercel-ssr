import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { OrdenSummaryComponent } from '../../components/orden-summary/orden-summary.component';
import { OrderSummaryItemComponent } from '../../components/order-summary-item/order-summary-item.component';
import { Subscription } from 'rxjs';
import { ItemShoppingCart, ShoppingCart } from '../../model/item-shopping-cart';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { SystemConfigurationService } from '../../services/system-configuration.service';
import { CurrencyPipe } from '@angular/common';
import { ButtonComponent } from '../../components/button/button.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-bolsa',
  standalone: true,
  imports: [RouterLink,FooterComponent, NavbarComponent, OrdenSummaryComponent, OrderSummaryItemComponent,CurrencyPipe,ButtonComponent],
  templateUrl: './bolsa.component.html'
})
export class BolsaComponent {

  state = 'active';
  businessColor = 'pink';
  private configSubscription: Subscription | undefined;

  shoppingCart: ShoppingCart = <ShoppingCart>{};
  constructor(private readonly shoppingCartService: ShoppingCartService,
    private readonly systemConfigurationService: SystemConfigurationService
  ) { }

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

  quantityValueChanged(value: number , product: ItemShoppingCart) {
    product.quantity = value
    this.shoppingCart.totalItems = this.shoppingCartService.getTotalItemsByShoppingCart(this.shoppingCart);
    this.shoppingCart.total = this.shoppingCartService.getTotalByShoppingCart(this.shoppingCart);
    this.shoppingCart.subTotal = this.shoppingCartService.getSubTotalByShoppingCart(this.shoppingCart);
    this.shoppingCart.totalDiscount = this.shoppingCartService.getTotalDiscountByShoppingCart(this.shoppingCart);
    this.shoppingCartService.setShoppingCart(this.shoppingCart);
  }

  deleteItem(product: ItemShoppingCart) {
    this.shoppingCart.items = this.shoppingCart.items.filter(item => item.product.id !== product.product.id);
    this.shoppingCart.totalItems = this.shoppingCartService.getTotalItemsByShoppingCart(this.shoppingCart);
    this.shoppingCart.total = this.shoppingCartService.getTotalByShoppingCart(this.shoppingCart);
    this.shoppingCart.subTotal = this.shoppingCartService.getSubTotalByShoppingCart(this.shoppingCart);
    this.shoppingCart.totalDiscount = this.shoppingCartService.getTotalDiscountByShoppingCart(this.shoppingCart);
    this.shoppingCartService.setShoppingCart(this.shoppingCart);
  }
}
