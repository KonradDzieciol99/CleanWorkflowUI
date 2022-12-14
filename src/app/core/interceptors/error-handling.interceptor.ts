import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class ErrorHandlingInterceptor implements HttpInterceptor {

  constructor(private toastrService: ToastrService,private cookieService: CookieService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(httpErrorResponse => {
        //console.error(httpErrorResponse);
        if (httpErrorResponse instanceof HttpErrorResponse) {
          
          if (httpErrorResponse.status === 400) {
            this.toastrService.error(httpErrorResponse.error?.Message)
          }
          if (httpErrorResponse.status === 401) {
            this.toastrService.error(httpErrorResponse.error?.Message)
          }
          if (httpErrorResponse.status === 404) {
            this.toastrService.error(httpErrorResponse.error?.Message);
          }
          if (httpErrorResponse.status === 500) {
            this.toastrService.error(httpErrorResponse.error?.Message);
          }
          return throwError(() => httpErrorResponse);
        }
        throw httpErrorResponse;
        //return throwError(() => new Error(httpErrorResponse));
        //return throwError(httpErrorResponse);
      })
    )
  }
}
