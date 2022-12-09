import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { IUser } from 'src/app/shared/models/IUser';

@Injectable({
  providedIn: 'root'
})
export class AuthChildGuard implements CanActivateChild {

  constructor(private authenticationService:AuthenticationService,
              private router:Router, private toastrService: ToastrService) {
    
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.authenticationService.currentUser$.pipe(
        mergeMap(auth=> {
          if (auth) {
            return of(true)
          }
         
          return this.authenticationService.loadCurrentUser().pipe(
            map(()=>{
              return true;
            }),
            catchError(() =>{
              this.router.navigate(['../auth/login'])
              return of(false);
            })
            )
        })
      )
  }
  
}
