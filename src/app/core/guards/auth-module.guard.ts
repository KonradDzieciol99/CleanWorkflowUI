import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, mergeMap, Observable, of, take } from 'rxjs';
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



// return this.authenticationService.currentUser$.pipe(
//   map((auth:IUser|undefined) => {
//     if (auth) {
//       return true;
//     }

//     //this.authenticationService.loadCurrentUser()

//     this.toastrService.error("Unauthorized");
//     this.router.navigate(['../auth/login'])
//     return false;
//   })
// )


//this.toastrService.error("Unauthorized");
