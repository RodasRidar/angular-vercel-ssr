import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemConfigurationService } from '../../services/system-configuration.service';
import { TailwindColor } from '../../model/color.type';


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

  /**
   *
   */
  constructor(private sistemConfigurationService: SystemConfigurationService) {
    this.sistemConfigurationService.getSystemConfiguration().subscribe(x => {
      if (x) {
        this.businessColor = x.businessColor;
      } else {
        this.businessColor = 'pink';
      }
    });
  }
  get Color() {
    const colorsList: { [key: string]: string } = {
      indigo: '#667EEA',
      gray: '#718096',
      red: '#F56565',
      yellow: '#F6E05E',
      green: '#68D391',
      blue: '#4299E1',
      purple: '#9F7AEA',
      pink: '#ED64A6',
      sky: '#4299E1',
      orange: '#ED8936',
      teal: '#4FD1C5',
      lime: '#84CC16',
      fuchsia: '#ED64A6',
      black: '#000000',
    };
    return colorsList[this.businessColor];
  }
}
