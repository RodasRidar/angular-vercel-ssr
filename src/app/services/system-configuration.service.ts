import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SystemConfiguration } from '../model/system-configuration.interface';

@Injectable({
  providedIn: 'root',
})
export class SystemConfigurationService {
  private SystemConfigurationSubject: BehaviorSubject<SystemConfiguration | null> =
    new BehaviorSubject<SystemConfiguration | null>(null);

  setSystemConfiguration(reg: SystemConfiguration | null): void {
    this.SystemConfigurationSubject.next(reg);
  }

  getSystemConfiguration(): Observable<SystemConfiguration | null> {
    return this.SystemConfigurationSubject.asObservable();
  }
}
