import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, take } from 'rxjs';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { IUser } from 'src/app/shared/models/IUser';

@Injectable({
  providedIn: 'root'
})
export class AuthModuleGuard implements CanLoad {

  constructor(private authenticationService:AuthenticationService,private router:Router, private toastrService: ToastrService) {

  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.authenticationService.currentUser$.pipe(
        map((auth:IUser|undefined) => {
          if (auth) {
            return true;
          }
          this.toastrService.error("Unauthorized");
          this.router.navigate(['../auth/login'])
          return false;
        })
      )
  }
}
