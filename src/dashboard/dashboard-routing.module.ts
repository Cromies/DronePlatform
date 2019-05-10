import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { dashboardComponent }   from './dashboard.component';
import { AuthGuard }                from '../assets/util/services/auth-gaurd.service';


const dashboardRoutes: Routes = [
  { path: 'dashboard',  component: dashboardComponent, data: { breadcrumb: 'dashboard', restrict:[]}},

];

@NgModule({
  imports: [
    RouterModule.forChild(dashboardRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class dashboardRoutingModule { }
