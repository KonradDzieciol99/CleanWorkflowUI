import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from "ngx-spinner";
import { ToastrModule } from 'ngx-toastr';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { JwtInterceptorInterceptor } from './interceptors/jwt-interceptor.interceptor';
import { ErrorHandlingInterceptor } from './interceptors/error-handling.interceptor';
import { HeaderComponent } from './header/header.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    HeaderComponent,
    NavBarComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
  ,exports: [],// nie trzeba importować HeaderComponent bo w żadnym elementcie appcomponent nie uzywamy tego w "kodzie" tylko jawnie jako komponent
  providers:[
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorHandlingInterceptor, multi: true },
  ]
  
})
export class CoreModule { }
