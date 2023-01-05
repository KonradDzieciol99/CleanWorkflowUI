import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { map, mergeMap, Observable, of, take } from 'rxjs';
import { IUser } from 'src/app/shared/models/IUser';
import { AuthenticationService } from 'src/app/authentication/authentication.service';

@Injectable()
export class JwtInterceptorInterceptor implements HttpInterceptor {

  constructor(private authenticationService:AuthenticationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    return this.authenticationService.currentUser$.pipe(
      take(1),
      mergeMap(user=>{

        if (user) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${user.token}`
            }
          })
        }

        return next.handle(request)
      })
    );
  }
}

