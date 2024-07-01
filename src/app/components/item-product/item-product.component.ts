import { Component, Input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { BadgeComponent } from '../badge/badge.component';
import { Product } from '../../model/product.interface';
import { DiscountPipe } from '../../pipes/discount.pipe';
import { ButtonComponent } from '../button/button.component';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-item-product',
  standalone: true,
  imports: [CommonModule, BadgeComponent, DiscountPipe, NgOptimizedImage,ButtonComponent,RouterLink],
  templateUrl: './item-product.component.html',
})
export class ItemDishComponent {
  @Input() product: Product = {
    id: '',
    section_id: '',
    name: '',
    description: '',
    imageUrl: '',
    price: 0,
    is_popular: false,
    is_on_sale: false,
    discountPercentage: 0,
    is_active: false,
  };
  @Input() isLoading: boolean = false;
}
