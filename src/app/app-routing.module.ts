import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthModuleGuard } from './core/guards/auth-module.guard';
import { HeaderComponent } from './core/header/header.component';

const routes: Routes = 
[
  {
    path: '',
    component : HeaderComponent ,
    children: [
      { 
        canLoad: [AuthModuleGuard],
        path: 'home', 
        loadChildren: () => import("./home/home.module").then(mod=>mod.HomeModule)
      },
    ]
  },
  { 
    path: 'auth', 
    loadChildren: () => import("./authentication/authentication.module").then(mod=>mod.AuthenticationModule)
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
