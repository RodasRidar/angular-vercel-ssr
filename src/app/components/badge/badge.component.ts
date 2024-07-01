import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemConfigurationService } from '../../services/system-configuration.service';
import { TailwindColor } from '../../model/color.type';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badge.component.html',
})
export class BadgeComponent {
  @Input() name: string = '';
  @Input() type: 'popular' | 'discount' = 'popular';
  businessColor: TailwindColor = 'pink';
  private configSubscription: Subscription | undefined;

  constructor(private systemConfigurationService: SystemConfigurationService) {}

  ngOnInit(): void {
    this.configSubscription = this.systemConfigurationService.getSystemConfiguration().subscribe(config => {
      if (config) {
        this.businessColor = config.businessColor;
      } else {
        this.businessColor = 'pink';
      }
    });
  }

  get Color() {
    return this.systemConfigurationService.getHexaCorlorFromBusinessColors(this.businessColor);
  }
  
  ngOnDestroy(): void {
    if (this.configSubscription) {
      this.configSubscription.unsubscribe();
    }
  }
}
