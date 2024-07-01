import { Component, Input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-home-banner',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './home-banner.component.html',
})
export class HomeBannerComponent {
  @Input() businessPortrait = '';
  @Input() BackgroundImageClass = '';
  @Input() isLoading = false;
}
