import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-item-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item-catalog.component.html',
})
export class ItemMenuComponent {
  @Input() isSelected: boolean = false;
  @Input() name: string = '';

  get colors() {
    return {
      'text-white bg-red-500 font-normal': this.isSelected,
      'text-black bg-[#F0F2F5] font-light': !this.isSelected,
    };
  }
}
