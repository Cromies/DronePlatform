// Modules imported here
import { NgModule }             from '@angular/core';
import { CommonModule }         from '@angular/common';
import { FormsModule }          from '@angular/forms';
import {SharedModule }          from '../shared/shared.module';
import {DataTableModule}        from 'angular2-datatable';

// Components imported here
import { AdminComponent }           from './components/admin.component';
import { WhitelistsComponent }       from './components/whitelist/whitelists.component';
import { WhitelistComponent }       from './components/whitelist/whitelist.component';
import { AddSignalComponent }       from './components/whitelist/AddSignal.component';
import { EditSignalComponent }       from './components/whitelist/EditSignal.component';

import { ControlComponent }          from './components/control.component';
import { GlobalComponent }          from './components/global.component';
import { LocationComponent }        from './components/location.component';
import { SensorComponent }          from './components/sensor/sensor.component';
import { SensorsComponent }          from './components/sensor/sensors.component';

import { SensorAddComponent }       from './components/sensor/sensorAdd.component';
import { SensorEditComponent }      from './components/sensor/sensorEdit.component';


import { UserComponent }            from './components/users/user.component';
import { AddComponent }             from './components/users/add.component';
import { EditComponent }            from './components/users/edit.component';
import { InfoComponent }            from './components/users/user-info.component';

import { AuthGuard }                from '../assets/util/services/auth-gaurd.service';
import { AuthService }              from '../assets/util/services/auth.service';
// import { HeaderComponent }          from '../assets/components/header/header.component';


// services imported here
//import { AdminService } from './Admin.service';
import { AdminRoutingModule }   from './admin-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    AdminRoutingModule,
    SharedModule,
    DataTableModule


  ],
  declarations: [
      ControlComponent,
      AdminComponent,
      WhitelistComponent,
      WhitelistsComponent,
      AddSignalComponent,
      EditSignalComponent,
      GlobalComponent,
      LocationComponent,
      SensorComponent,
      SensorsComponent,
      SensorAddComponent,
      SensorEditComponent,
      UserComponent,
      AddComponent,
      EditComponent,
      InfoComponent,
      // HeaderComponent

    // no declarations yet
  ],
  providers: [AuthGuard, AuthService ]
})
export class AdminModule {


}
