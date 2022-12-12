import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, interval, map, Observable, of, pipe, skip, take, takeUntil, tap, throwError, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IRegisterUser } from '../shared/models/IRegisterUser';
import { IUser } from '../shared/models/IUser';
import { IToken } from '../shared/models/IToken';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';

export interface IToastButton {
  id: string;
  title: string;
};

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  
  private baseUrl = environment.apiUrl;
  private currentUserSource = new BehaviorSubject<IUser|undefined>(undefined);
  currentUser$ = this.currentUserSource.asObservable();
  private expirationTimeout: Date|undefined;

  private tokenExpTimer$:Observable<0>|undefined;

  constructor(private http: HttpClient, private router: Router,private toastrService:ToastrService,private cookieService: CookieService) {

  }

  tryRefreshTokens(){
    
  }
  loadCurrentUser() {
    const cookieExists: boolean = this.cookieService.check(environment.COOKIE_REFRESH_TOKEN_NAME);
    if(cookieExists){
      return this.http.post<IUser>(this.baseUrl + 'account/refresh-token',{}).pipe(
        map((user: IUser) => {
          if (user) {
            this.currentUserSource.next(user);
          }
        })
      )
    }
    return throwError(() => new Error(`Empty cookie`));
  }

  login(values: any):Observable<void> {
    return this.http.post<IUser>(this.baseUrl + 'account/login', values,{ withCredentials: true }).pipe(
      map((user: IUser) => {
        if (user) {
          this.currentUserSource.next(user);
          let exprationTimeInSeconds=(JSON.parse(window.atob(user.token.split('.')[1])) as IToken).exp
          let dif = exprationTimeInSeconds * 1000-new Date().valueOf();
          this.tokenExpTimer$ = timer(dif);
          this.test(dif);
        }
      })
    )
  }

  register(registerUser: IRegisterUser):Observable<void> {
    return this.http.post<IUser>(this.baseUrl + 'account/register', registerUser).pipe(
      map((user: IUser) => {
        if (user) {
          this.currentUserSource.next(user);
        }
      })
    )
  }

  logout() {
    this.cookieService.delete(environment.COOKIE_REFRESH_TOKEN_NAME);
    this.currentUserSource.next(undefined);
    this.router.navigateByUrl('/auth');
    this.toastrService.success("logged out successfully");
    
  }

  private test(miliseconds:number):void{
    let secondsToExpire = Math.floor(miliseconds/1000) ;
    if (!this.tokenExpTimer$) {return;}
    let startTime = new Date();
    interval(10000).pipe(takeUntil(this.currentUserSource.pipe(skip(1)))).subscribe(x=>{
      
      var timePassedFromBeginning = Math.floor( (new Date().getTime() - startTime.getTime())/1000);
      
      this.toastrService.info(`${timePassedFromBeginning}`,undefined,{});
      let activeToast = this.toastrService.info(`sesja zakończy się za ${secondsToExpire-timePassedFromBeginning} sekund`,undefined,{});
            
      let activeToastRenewSub = activeToast.onTap.pipe(take(1)).subscribe(()=>{
        this.toastrService.info("przedłużanie")
      });

      activeToast.toastRef.afterClosed().pipe(take(1)).subscribe(()=> {
        activeToastRenewSub.unsubscribe();
        this.toastrService.info("unsubbvbb")
      });

    });
    
    this.tokenExpTimer$.pipe(take(1)).subscribe(()=>{
      this.toastrService.info("sesja się zakończyła")
      this.logout();
    })

  }


}
