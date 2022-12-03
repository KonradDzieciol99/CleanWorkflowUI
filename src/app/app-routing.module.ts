import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthModuleGuard } from './core/guards/auth-module.guard';

const routes: Routes = 
[
  { 
    path: 'auth', 
    loadChildren: () => import("./authentication/authentication.module").then(mod=>mod.AuthenticationModule)
  },
  { 
    canLoad: [AuthModuleGuard],
    path: 'home', 
    loadChildren: () => import("./home/home.module").then(mod=>mod.HomeModule)
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
