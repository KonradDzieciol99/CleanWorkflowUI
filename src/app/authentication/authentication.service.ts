import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IRegisterUser } from '../shared/models/IRegisterUser';
import { IUser } from '../shared/models/IUser';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  TOKEN:string=environment.LOCALSTORAGE_TOKEN_NAME;
  baseUrl = environment.apiUrl;
  private currentUserSource = new BehaviorSubject<IUser|undefined>(undefined);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

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
}
