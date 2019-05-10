import { NgModule }                 from '@angular/core';
import { RouterModule, Routes }     from '@angular/router';

import { ProfileComponent }         from './components/profile.component';
import { ChangeComponent }         from './components/change.component';

import { AuthGuard }                from '../assets/util/services/auth-gaurd.service';



const ProfileRoutes: Routes = [
    { path: 'user', children:
                      [
                          { path: '', redirectTo: 'profile', pathMatch: 'full' },
                          {path:'profile',  component: ProfileComponent, data:{breadcrumb:'My Alert Settings', restrict:[]} },
                          {path:'change-pass',  component: ChangeComponent, data:{breadcrumb:'Change Password', restrict:[]} },

                      ],
                  data:{breadcrumb:'User Settings'} }


];

@NgModule({
  imports: [
    RouterModule.forChild(ProfileRoutes),


  ],
  exports: [
    RouterModule
  ]
})
export class ProfileRoutingModule { }
