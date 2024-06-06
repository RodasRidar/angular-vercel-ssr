import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { ClientResolver } from './services/client.resolver';
import { SUBDOMAIN } from '../subdomain.token';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    provideHttpClient(withInterceptorsFromDi(),withFetch()),
    // provideClientHydration(),
    // ClientResolver,
    {
      provide: SUBDOMAIN,
      useValue: '',
      deps: [],
    },
  ],
};
