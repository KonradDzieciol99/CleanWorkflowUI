import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';
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
        map((auth:IUser|undefined) => {
          if (auth) {
            return true;
          }

          

          this.toastrService.error("Unauthorized");
          this.router.navigate(['../auth/login']);
          return false;
        })
      )
  }
  
}
