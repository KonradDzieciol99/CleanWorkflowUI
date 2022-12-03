import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthChildGuard } from '../core/guards/auth-child.guard';
import { HomeComponent } from './home.component';

const routes: Routes = [

  {
    path: '',
    canActivateChild:[AuthChildGuard],
    children: [
      { path: '', component: HomeComponent },

    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
