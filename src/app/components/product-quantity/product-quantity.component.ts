import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ItemShoppingCart } from '../../model/item-shopping-cart';

@Component({
  selector: 'app-product-quantity',
  standalone: true,
  imports: [],
  templateUrl: './product-quantity.component.html',
})
export class ProductQuantityComponent {
  readonly MAX_QUANTITY = 20;
  readonly MIN_QUANTITY = 0;
  @Output() quantityValue = new EventEmitter<number>();
  @Input() predeterminedQuantity = 0;
  currentQuantity = 0;
  ngOnInit() {
    if (this.predeterminedQuantity === 0) {
      this.currentQuantity = 1
    } else {
      this.currentQuantity = this.predeterminedQuantity
    }
  }

  ngOnChanges() {
    this.currentQuantity = this.predeterminedQuantity
  }

  incrementQuantity() {
    this.currentQuantity = this.currentQuantity <= this.MAX_QUANTITY ? this.currentQuantity + 1 : this.MAX_QUANTITY;
    this.emitValue()
  }

  decrementQuantity() {
    this.currentQuantity = this.currentQuantity >= 1 ? this.currentQuantity - 1 : this.MIN_QUANTITY;
    this.emitValue()
  }

  emitValue() {
    this.quantityValue.emit(this.currentQuantity);
  }

  onQuantityChange(event: Event){
    const inputElement = event.target as HTMLInputElement;
    let value = Number(inputElement.value);
    console.log(value);

    if (value > this.MAX_QUANTITY) {
      value = this.MAX_QUANTITY;
    } else if (value < this.MIN_QUANTITY) {
      value = this.MIN_QUANTITY;
    }

    this.currentQuantity = value;
  }
}
