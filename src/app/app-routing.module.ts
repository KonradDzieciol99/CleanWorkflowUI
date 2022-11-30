import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = 
[
  { 
    path: 'auth', 
    loadChildren: () => import("./authentication/authentication.module").then(mod=>mod.AuthenticationModule)
  },
  { 
    path: '', 
    loadChildren: () => import("./home/home.module").then(mod=>mod.HomeModule)
  },
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
