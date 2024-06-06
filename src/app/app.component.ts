import { Component, Inject, PLATFORM_ID, afterNextRender } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { CommonModule, isPlatformServer } from '@angular/common';
import { initFlowbite } from 'flowbite';
import { SUBDOMAIN } from '../subdomain.token';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Inicio';
  tenant = '';

  constructor(
    @Inject(SUBDOMAIN) private subdomain: string, 
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    afterNextRender(() => {
      initFlowbite();
    })
    
    if (isPlatformServer(this.platformId)) {
      this.tenant = this.subdomain;
      console.log(`Subdomain from server: ${this.subdomain}`);
    }
    else {
      this.tenant = window.location.hostname.split('.')[0];
      console.log(`Subdomain from client: ${this.subdomain}`);
    }
  }
}
