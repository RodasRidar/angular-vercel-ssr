import { mergeApplicationConfig, ApplicationConfig, APP_ID } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { APP_BASE_HREF } from '@angular/common';
import { ClientResolver } from './services/client.resolver';
import { REQUEST_SUBDOMAIN, SUBDOMAIN } from '../../src/subdomain.token';
import { provideClientHydration } from '@angular/platform-browser';
 
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideClientHydration(),
    // ClientResolver,
    // {
    //   provide: APP_ID,
    //   useValue: 'serverApp',
    // },
    {
      provide: SUBDOMAIN,
      useFactory: (subdomain: string) => {
        return subdomain!.split('.')[0];;
      },
      deps: [REQUEST_SUBDOMAIN],
    },
    // {
    //   provide: APP_BASE_HREF,
    //   useValue: '/',
    // },

  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
