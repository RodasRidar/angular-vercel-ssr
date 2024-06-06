import { AfterViewInit, Component, Input, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortraitComponent } from '../portrait/portrait.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TailwindColor } from '../../model/color.type';
import { NavBarItem } from '../../model/nav.interface';
import { Collapse } from 'flowbite';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, PortraitComponent, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  @Input() businessName = '';
  @Input() BusinessColor: TailwindColor = 'pink';
  @Input() BusinessLogo: string = '';
  @Input() lstMenu: NavBarItem[] = [];
  @Input() isLoading: boolean = false;
  constructor() {
    afterNextRender(() => {
      const $targetEl: HTMLElement = document.getElementById(
        'navbar-cta'
      ) as HTMLElement;
  
      // optionally set a trigger element (eg. a button, hamburger icon)
      const $triggerEl: HTMLElement = document.getElementById(
        'triggerEl'
      ) as HTMLElement;
  
      const collapse = new Collapse($targetEl, $triggerEl);
      collapse.collapse();
    })
  }
  get Color() {
    const colorsList: { [key: string]: string } = {
      indigo: 'text-indigo-500',
      gray: 'text-gray-500',
      red: 'text-red-500',
      yellow: 'text-yellow-500',
      green: 'text-green-500',
      blue: 'text-blue-500',
      purple: 'text-purple-500',
      pink: 'text-pink-500',
      sky: 'text-sky-500',
      orange: 'text-orange-500',
      teal: 'text-teal-500',
      lime: 'text-lime-500',
      fuchsia: 'text-fuchsia-500',
      black: 'text-black',
    };
    return colorsList[this.BusinessColor];
  }
  get BGColor() {
    const colorsList: { [key: string]: string } = {
      indigo: 'bg-indigo-500',
      gray: 'bg-gray-500',
      red: 'bg-red-500',
      yellow: 'bg-yellow-500',
      green: 'bg-green-500',
      blue: 'bg-blue-500',
      purple: 'bg-purple-500',
      pink: 'bg-pink-500',
      sky: 'bg-sky-500',
      orange: 'bg-orange-500',
      teal: 'bg-teal-500',
      lime: 'bg-lime-500',
      fuchsia: 'bg-fuchsia-500',
      black: 'bg-black',
    };
    return colorsList[this.BusinessColor];
  }
  getLogoName(cadena: string): string {
    const palabras = cadena.split(' ');

    // Tomar las dos primeras palabras
    const primeraPalabra = palabras.length > 0 ? palabras[0] : '';
    const segundaPalabra = palabras.length > 1 ? palabras[1] : '';

    // Obtener las iniciales en mayúscula
    const iniciales = `${primeraPalabra.charAt(0).toUpperCase()}${segundaPalabra
      .charAt(0)
      .toUpperCase()}`;

    return iniciales;
  }
}
