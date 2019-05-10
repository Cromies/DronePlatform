// Modules imported here
import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';


import {DataTableModule}    from 'angular2-datatable';
import {SharedModule }    from '../shared/shared.module';


// Components imported here
import { ProfileComponent }         from './components/profile.component';
import { ChangeComponent }         from './components/change.component';
// services imported here

import { ProfileRoutingModule }   from './profile-routing.module';

import { AuthGuard }      from '../assets/util/services/auth-gaurd.service';


@NgModule({
  imports: [
    CommonModule,
    DataTableModule,
    FormsModule,
    ProfileRoutingModule,
    SharedModule

  ],
  declarations: [
      ProfileComponent,
      ChangeComponent
      // HeaderComponent

    // no declarations yet
  ],
  providers: [ AuthGuard]
})
export class ProfileModule {


}
