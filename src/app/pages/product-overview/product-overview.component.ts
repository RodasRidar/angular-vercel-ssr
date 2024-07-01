import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../model/product.interface';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { BadgeComponent } from '../../components/badge/badge.component';
import { DiscountPipe } from '../../pipes/discount.pipe';
import { ButtonComponent } from '../../components/button/button.component';
import { ProductQuantityComponent } from '../../components/product-quantity/product-quantity.component';
import { ItemShoppingCart } from '../../model/item-shopping-cart';
import { ShoppingCartService } from '../../services/shopping-cart.service';

@Component({
  selector: 'app-product-overview',
  standalone: true,
  imports: [NavbarComponent,FooterComponent,NgOptimizedImage,
    BadgeComponent, DiscountPipe, CommonModule, ButtonComponent, ProductQuantityComponent],
  templateUrl: './product-overview.component.html',
})
export class ProductOverviewComponent {

  productToCart: ItemShoppingCart = <ItemShoppingCart>{
    quantity: 1,
    product: <Product>{
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
    }
  };
  constructor(private readonly productService: ProductService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly cartService: ShoppingCartService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const productId = params.get('idSEO'); // Obtén el ID del producto de la URL
      if (this.isValidId(productId)) {
        this.getProduct(productId as string);
      } else {
        this.router.navigate(['/negocio-no-existente']); // Redirige a la página de error si el ID es inválido
      }
    });
  }

  isValidId(id: string | null): boolean {
    // if (!id) return false;
    // const idRegex = /^[a-zA-Z0-9_-]+$/; // Define tu propia expresión regular para validar el ID
    // return idRegex.test(id);
    return true;
  }

  getProduct(productId: string): void {
    this.productService.getProductsByProductId(productId).subscribe(
      (data: Product[]) => {
        this.productToCart.product = data[0];
      },
      (error) => {
        console.error('Error al obtener el producto:', error);
        this.router.navigate(['/negocio-no-existente']); // Redirige a la página de error si hay un error en la obtención del producto
      }
    );
  }

  quantityValue(value: number) {
    this.productToCart.quantity = value
  }

  addToCart(): void {
    this.cartService.addProductToCart(this.productToCart);
    setTimeout(() => {
      this.cartService.openCart();
    }, 1100); 
  }
}
