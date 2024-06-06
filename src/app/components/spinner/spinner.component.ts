import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TailwindColor } from '../../model/color.type';
import { SpinnerService } from '../../services/spinner.service';
import { SystemConfigurationService } from '../../services/system-configuration.service';


@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.component.html',
})
export class SpinnerComponent implements OnInit {
  constructor(
    private systemConfigService: SystemConfigurationService,
    private spinnerService: SpinnerService
  ) {}
  ngOnInit(): void {
    this.systemConfigService.getSystemConfiguration().subscribe(x => {
      if (x) {
        this.colorSignal.set(x.businessColor);
      }
    });
    this.spinnerService.isLoading.subscribe(x => {
      this.isLoading.set(x);
    });
  }

  colorSignal = signal<TailwindColor>('pink');
  isLoading = signal<boolean>(false);

  get color() {
    return {
      'fill-indigo-500': this.colorSignal() === 'indigo',
      'fill-gray-500': this.colorSignal() === 'gray',
      'fill-red-500': this.colorSignal() === 'red',
      'fill-yellow-500': this.colorSignal() === 'yellow',
      'fill-green-500': this.colorSignal() === 'green',
      'fill-blue-500': this.colorSignal() === 'blue',
      'fill-purple-500': this.colorSignal() === 'purple',
      'fill-pink-500': this.colorSignal() === 'pink',
      'fill-sky-500': this.colorSignal() === 'sky',
      'fill-orange-500': this.colorSignal() === 'orange',
      'fill-teal-500': this.colorSignal() === 'teal',
      'fill-lime-500': this.colorSignal() === 'lime',
      'fill-black': this.colorSignal() === 'black',
      'fill-fuchsia-500': this.colorSignal() === 'fuchsia',
    };
  }
}
