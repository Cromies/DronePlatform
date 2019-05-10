import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DetectionComponent }   from './detection.component';

import { AuthGuard }                from '../assets/util/services/auth-gaurd.service';


const detectionRoutes: Routes = [
  { path: 'detection',   component: DetectionComponent, data: { breadcrumb: 'Drone Detection Command Console', restrict:[6]} },

];

@NgModule({
  imports: [
    RouterModule.forChild(detectionRoutes),
  ],

  exports: [
    RouterModule
  ]
})
export class DetectionRoutingModule { }
