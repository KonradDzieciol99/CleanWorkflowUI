import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/shared/models/IUser';

@Injectable()
export class JwtInterceptorInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    var userJSON = localStorage.getItem('CleanworkFlowUser');
    let user:IUser|undefined;
    if (userJSON) {
      user = JSON.parse(userJSON)
    }

    if (user) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${user.token}`
        }
      })
    }

    return next.handle(request);
  }
}
