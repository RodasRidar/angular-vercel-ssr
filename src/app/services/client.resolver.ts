import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Resolve } from '@angular/router';
import { of } from 'rxjs';
import { isPlatformServer } from '@angular/common';
import { SUBDOMAIN } from '../../subdomain.token';

@Injectable()
export class ClientResolver implements Resolve<string> {
  tenant:string
  constructor(
    @Inject(SUBDOMAIN) private subdomain: string, 
    @Inject(PLATFORM_ID) private platformId: any
  ) 
    {
      if (isPlatformServer(this.platformId)) {
        this.tenant = this.subdomain;
      }
      else {
        this.tenant = window.location.hostname.split('.')[0];
      }
    }

    resolve(): any {
        return of(this.tenant);
    }

}