import { Component, Input } from '@angular/core';
import { SystemConfigurationService } from '../../services/system-configuration.service';
import { Subscription } from 'rxjs';
import { TailwindColor } from '../../model/color.type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
})
export class ButtonComponent {

  @Input() name: string = '';
  @Input() type: 'primary'|'secondary' = 'primary';
  
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

  get BackgroundClass() {
    const colorsList: { [key: string]: string } = {
      indigo: 'bg-indigo-500 text-white',
      gray: 'bg-gray-500 text-white',
      red: 'bg-red-500 text-white',
      yellow: 'bg-yellow-500 text-white',
      green: 'bg-green-500 text-white',
      blue: 'bg-blue-500 text-white',
      purple: 'bg-purple-500 text-white',
      pink: 'bg-pink-500 text-white',
      sky: 'bg-sky-500 text-white',
      orange: 'bg-orange-500 text-white',
      teal: 'bg-teal-500 text-white',
      lime: 'bg-lime-500 text-white',
      fuchsia: 'bg-fuchsia-500 text-white',
      black: 'bg-black text-white',
    };
    return colorsList[this.businessColor];
  }

  get BackgroundHoverClass() {
    const colorsList: { [key: string]: string } = {
      indigo: 'hover:bg-indigo-400',
      gray: 'hover:bg-gray-400',
      red: 'hover:bg-red-400',
      yellow: 'hover:bg-yellow-400',
      green: 'hover:bg-green-400',
      blue: 'hover:bg-blue-400',
      purple: 'hover:bg-purple-400',
      pink: 'hover:bg-pink-400',
      sky: 'hover:bg-sky-400',
      orange: 'hover:bg-orange-400',
      teal: 'hover:bg-teal-400',
      lime: 'hover:bg-lime-400',
      fuchsia: 'hover:bg-fuchsia-400',
      black: 'hover:bg-gray-700',
    };
    return colorsList[this.businessColor];
  }

}
