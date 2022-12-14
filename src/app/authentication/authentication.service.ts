import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, interval, map, merge, mergeMap, Observable, of, pipe, skip, take, takeUntil, tap, throwError, timer} from 'rxjs';
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

  setAutoLogOutAndReminders(token:string){
   
    //auto log out
    let timeNowInMiliseconds= new Date().valueOf()
    let logoutTime:Date = new Date(timeNowInMiliseconds + (environment.AUTO_LOGOUT_TIME_IN_MINUTES * 60 * 1000));

    timer(logoutTime).pipe(takeUntil(this.currentUserSource.pipe(skip(1)))).subscribe(x=>{
      this.toastrService.info("sesja się zakończyła")
      this.logout();
    });
    //
    let reminderTime = new Date(logoutTime.valueOf() - (2 * 60 * 1000));

    timer(reminderTime).pipe(takeUntil(this.currentUserSource.pipe(skip(1)))).subscribe(x=>{

      let sekondsToEnd= Math.ceil((logoutTime.valueOf() - new Date().valueOf())/1000);
      let activeToast = this.toastrService.info(`sesja zakończy się w mniej niż minutę z powodu braku aktywności kliknij aby wydłużyć sesję`,undefined,{timeOut:(sekondsToEnd*1000)});
      
      // activeToast.onTap.pipe(takeUntil(activeToast.toastRef.afterClosed())).subscribe(()=>{
      //   this.refreshCurrentUser().subscribe(()=>{
      //     this.toastrService.info("Wydłużam sesję")
      //   });
      // });

      activeToast.onTap.pipe(
        takeUntil(activeToast.toastRef.afterClosed()),
        mergeMap(()=>this.refreshCurrentUser())///take(1) ???????????????????
      ).subscribe(()=>{
          this.toastrService.info("Wydłużam sesję")
      });

      this.currentUser$.pipe(skip(1),take(1)).subscribe(()=>{
          this.toastrService.clear(activeToast.toastId);
      })/////////////////////////////////////do przetestowania

    });
  }
  refreshCurrentUser() {
      return this.http.post<IUser>(this.baseUrl + 'account/refresh-token',{},{ withCredentials: true }).pipe(
        map((user: IUser) => {
          if (user) {
            this.currentUserSource.next(user);
          }
        })
      )
  }

  login(values: any):Observable<void> {
    return this.http.post<IUser>(this.baseUrl + 'account/login', values,{withCredentials: true}).pipe(
      map((user: IUser) => {
        if (user) {
          this.currentUserSource.next(user);
          this.setAutoLogOutAndReminders(user.token);//userlogin event?
        }
      })
    )
  }

  register(registerUser: IRegisterUser):Observable<void> {
    return this.http.post<IUser>(this.baseUrl + 'account/register', registerUser ,{withCredentials: true}).pipe(
      map((user: IUser) => {
        if (user) {
          this.currentUserSource.next(user);
        }
      })
    )
  }

  logout() {
    this.cookieService.delete(environment.COOKIE_REFRESH_TOKEN_NAME);//revoke request
    this.currentUserSource.next(undefined);
    this.router.navigateByUrl('/auth');
    this.toastrService.clear();
    this.toastrService.success("logged out successfully");
    
  }

  private test(miliseconds:number,exprationTimeInSeconds:number):void{

    // let exprationTimeInSeconds=(JSON.parse(window.atob(user.token.split('.')[1])) as IToken).exp
    // let dif = exprationTimeInSeconds * 1000-new Date().valueOf();
    // this.tokenExpTimer$ = timer(dif);
    // this.test(dif,exprationTimeInSeconds);

    let secondsToExpire = Math.floor(miliseconds/1000) ;
    if (!this.tokenExpTimer$) {return;}
    let startTime = new Date();
    // interval(10000).pipe(takeUntil(this.currentUserSource.pipe(skip(1)))).subscribe(x=>{
      
    //   var timePassedFromBeginning = Math.floor( (new Date().getTime() - startTime.getTime())/1000);
      
    //   this.toastrService.info(`${timePassedFromBeginning}`,undefined,{});
    //   let activeToast = this.toastrService.info(`sesja zakończy się za ${secondsToExpire-timePassedFromBeginning} sekund`,undefined,{});
            
    //   let activeToastRenewSub = activeToast.onTap.pipe(take(1)).subscribe(()=>{
    //     this.toastrService.info("przedłużanie")
    //   });

    //   activeToast.toastRef.afterClosed().pipe(take(1)).subscribe(()=> {
    //     activeToastRenewSub.unsubscribe();
    //     this.toastrService.info("unsubbvbb")
    //   });

    // });
    
    // this.tokenExpTimer$.pipe(take(1)).subscribe(()=>{
    //   this.toastrService.info("sesja się zakończyła")
    //   this.logout();
    // })

    let tokenStartDate = new Date(exprationTimeInSeconds*1000);
    let tokenEndDate = new Date(exprationTimeInSeconds*1000);
    tokenEndDate.setTime(tokenEndDate.getTime() + (30 * 60 * 1000));
    let halftime:Date=new Date(exprationTimeInSeconds*1000)
    halftime.setTime(tokenStartDate.getTime() + (1 * 60 * 1000));

    let reminder$ = timer(halftime,1000);
    reminder$.pipe(takeUntil(this.currentUserSource.pipe(skip(1)))).subscribe(x=>{
      console.log(x);
      let secondsToEndTime = Math.floor( tokenEndDate.valueOf()/1000)
      var timePassedFromBeginning = Math.floor( (new Date().getTime() - tokenStartDate.getTime())/1000);
      this.toastrService.info(`${timePassedFromBeginning}`,undefined,{});
      let activeToast = this.toastrService.info(`sesja zakończy się za ${secondsToEndTime-timePassedFromBeginning} sekund`,undefined,{});
       
      let activeToastRenewSub = activeToast.onTap.pipe(take(1)).subscribe(()=>{
        this.toastrService.info("przedłużanie")
      });

      activeToast.toastRef.afterClosed().pipe(take(1)).subscribe(()=> {
        activeToastRenewSub.unsubscribe();
        this.toastrService.info("unsubbvbb")
      });
    })

    let endOfTime$ = timer(tokenEndDate);
    endOfTime$.pipe(takeUntil(this.currentUserSource.pipe(skip(1)))).subscribe(()=>{
      this.toastrService.info("sesja się zakończyła")
      this.logout();
    })

    // this.tokenExpTimer$.pipe(take(1)).subscribe(()=>{
    //   this.toastrService.info("sesja się zakończyła")
    //   this.logout();
    // })

  }


}
