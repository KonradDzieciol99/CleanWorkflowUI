import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, interval, map, Observable, of, take, takeUntil, tap, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IRegisterUser } from '../shared/models/IRegisterUser';
import { IUser } from '../shared/models/IUser';
import { IToken } from '../shared/models/IToken';
import { ToastrService } from 'ngx-toastr';

export interface IToastButton {
  id: string;
  title: string;
};

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  private TOKEN:string=environment.LOCALSTORAGE_TOKEN_NAME;
  private baseUrl = environment.apiUrl;
  private currentUserSource = new BehaviorSubject<IUser|undefined>(undefined);
  currentUser$ = this.currentUserSource.asObservable();
  private expirationTimeout: Date|undefined;

  private tokenExpTimer$:Observable<0>|undefined;

  constructor(private http: HttpClient, private router: Router,private toastrService:ToastrService) {

   }

  tryRefreshTokens(){
    
  }
  loadCurrentUser(token: string|null|undefined):Observable<void> {
    if (!token) {
      this.currentUserSource.next(undefined);
      return of();
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get<IUser>(this.baseUrl + 'account', {headers}).pipe(
      map((user: IUser) => {
        if (user) {
          localStorage.setItem(this.TOKEN, user.token);
          this.currentUserSource.next(user);
        }
      })
    )
  }

  login(values: any):Observable<void> {
    return this.http.post<IUser>(this.baseUrl + 'account/login', values).pipe(
      map((user: IUser) => {
        if (user) {
          localStorage.setItem(this.TOKEN, user.token);
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
          localStorage.setItem(this.TOKEN, user.token);
          this.currentUserSource.next(user);
        }
      })
    )
  }

  logout() {
    localStorage.removeItem(this.TOKEN);
    this.currentUserSource.next(undefined);
    this.router.navigateByUrl('/');
  }

  private test(miliseconds:number):void{
    let seconds = Math.floor(miliseconds/1000) ;
    if (this.tokenExpTimer$) {
        interval(1000).pipe(takeUntil(this.tokenExpTimer$)).subscribe(x=>{

        let toast = this.toastrService.info(`sesja zakończy się za ${seconds-x} sekund`,undefined,{})
        
        toast.onTap.subscribe(()=>{
          this.toastrService.info("przedłużanie")
        })

      })

      this.tokenExpTimer$.pipe(take(1)).subscribe(()=>{
        this.toastrService.info("sesja się zakończyła")
      })
    }
  }


}
