import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SystemConfiguration } from '../model/system-configuration.interface';
import { TailwindColor } from '../model/color.type';
import { NavBarItem } from '../model/nav.interface';

@Injectable({
  providedIn: 'root',
})
export class SystemConfigurationService {
  private SystemConfigurationSubject: BehaviorSubject<SystemConfiguration | null> =
    new BehaviorSubject<SystemConfiguration | null>(null);
  
  private NavBarItemSubject: BehaviorSubject<NavBarItem[] | null> = new BehaviorSubject<NavBarItem[] | null>(null);

  setSystemConfiguration(reg: SystemConfiguration | null): void {
    this.SystemConfigurationSubject.next(reg);
  }

  getSystemConfiguration(): Observable<SystemConfiguration | null> {
    return this.SystemConfigurationSubject.asObservable();
  }

  setNavBarItem(reg: NavBarItem[] | null): void {
    this.NavBarItemSubject.next(reg);
  }

  getNavBarItem(): Observable<NavBarItem[] | null> {
    return this.NavBarItemSubject.asObservable();
  }

  getHexaCorlorFromBusinessColors(businessColor:TailwindColor):string {
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
    return colorsList[businessColor];
  }

}
