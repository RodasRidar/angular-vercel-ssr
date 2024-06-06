// import { HttpInterceptorFn } from '@angular/common/http';

// export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
//   return next(req);
// };

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';

import { TokenService } from './../services/token.service';
import { SpinnerService } from '../services/spinner.service';
import { environment } from '../../environments/environment.development';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private tokenService: TokenService,
    private spinnerService: SpinnerService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // this.spinnerService.show();
    request = this.addToken(request);
    return next.handle(request).pipe(
      finalize(() => {
        this.spinnerService.hide();
      })
    );
  }

  private addToken(request: HttpRequest<unknown>) {
    // const token = this.tokenService.getToken();
    // console.log(environment.SUPABASE_KEY);
    // if (!token) {
    const authReq = request.clone({
      // headers: request.headers.set('Authorization', `Bearer ${token}`),
      setHeaders: {
        // Authorization: `Bearer ${token}`,
        Authorization: environment.SUPABASE_KEY,
        apikey: environment.SUPABASE_KEY,
      },
    });
    return authReq;
    // }
    // return request;
  }
}
