import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLoadModuleGuard } from './core/guards/auth-load-module.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { HeaderComponent } from './core/header/header.component';
import { TestComponent } from './test/test/test.component';

const routes: Routes = 
[
  { 
    path: 'auth', 
    loadChildren: () => import("./authentication/authentication.module").then(mod=>mod.AuthenticationModule),
    data: { showHeader: false, showSidebar: false,showFooter: false },
  },
  {
    canLoad: [AuthLoadModuleGuard],
    canActivate: [AuthGuard],
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
