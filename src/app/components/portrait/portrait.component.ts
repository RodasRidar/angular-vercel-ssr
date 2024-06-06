import { AfterViewInit, Component, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Collapse } from 'flowbite';
import { RouterLink } from '@angular/router';
interface NavBarItem {
  id: number;
  name: string;
  url: string;
}
@Component({
  selector: 'app-portrait',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './portrait.component.html',
})
export class PortraitComponent implements AfterViewInit {
  @Input() restaurantName: string = '';
  @Input() restaurantPortrait: string = '';
  @Input() isLoading: boolean = false;
  cartaClass = '';
  styleBlur = '';
  styleFadeTitle = '';

  lstMenu: NavBarItem[] = [
    {
      id: 1,
      name: 'Inicio',
      url: '/inicio',
    },
    {
      id: 2,
      name: 'La carta',
      url: '/catalogo',
    },
    // {
    //   name: "Visitanos",
    //   url: "/locales"
    // }
  ];
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.scrollY;
    const blur = scrollPosition / 10;
    let brightness = 1 - scrollPosition / 150;
    const pxBlur = blur > 6 ? '6px' : blur + 'px';
    brightness = brightness < 0.6 ? 0.6 : brightness;
    const fadetitle = scrollPosition / 120;
    this.styleBlur = `filter:brightness(${brightness});backdrop-filter: blur(${pxBlur})`;
    this.styleFadeTitle = `color: rgba(255, 255, 255,${fadetitle})`;

    if (scrollPosition >= 65) {
      this.cartaClass = `max-sm:fixed top-[-65px] transform-translate-y-1/2 blur-{${pxBlur}} w-full sm:140px`;
    } else {
      this.cartaClass = 'absolute';
    }
  }

  ngAfterViewInit() {
    const $targetEl: HTMLElement = document.getElementById(
      'navbar-cta'
    ) as HTMLElement;

    // optionally set a trigger element (eg. a button, hamburger icon)
    const $triggerEl: HTMLElement = document.getElementById(
      'triggerEl'
    ) as HTMLElement;

    const collapse = new Collapse($targetEl, $triggerEl);
    collapse.collapse();
  }
}
