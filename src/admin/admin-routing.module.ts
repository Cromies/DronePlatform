import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminComponent }       from './components/admin.component';
import { WhitelistsComponent }       from './components/whitelist/whitelists.component';
import { WhitelistComponent }       from './components/whitelist/whitelist.component';
import { AddSignalComponent }       from './components/whitelist/AddSignal.component';
import { EditSignalComponent }       from './components/whitelist/EditSignal.component';

import { ControlComponent }          from './components/control.component';
import { GlobalComponent }      from './components/global.component';
import { LocationComponent }    from './components/location.component';
import { SensorComponent }      from './components/sensor/sensor.component';
import { SensorsComponent }      from './components/sensor/sensors.component';

import { SensorAddComponent }      from './components/sensor/sensorAdd.component';
import { SensorEditComponent }      from './components/sensor/sensorEdit.component';



import { UserComponent }        from './components/users/user.component';
import { AddComponent }         from './components/users/add.component';
import { EditComponent }         from './components/users/edit.component';
import { InfoComponent }         from './components/users/user-info.component';

import { AuthGuard }                from '../assets/util/services/auth-gaurd.service';

const AdminRoutes: Routes = [
  { path: 'admin/settings/services',  component: ControlComponent, data: {breadcrumb: 'Service Settings', restrict: [3, 4, 5, 6]}},
  { path: 'settings',  component: AdminComponent, data:{breadcrumb: 'Admin Settings', restrict:[3, 4, 5, 6]} },
  { path: 'admin/settings/whitelist',  children:[
        {path: '', redirectTo: 'whitelists', pathMatch: 'full'},
        {path: 'add-signal',  component: AddSignalComponent, data: {breadcrumb: 'Add Signal', restrict:[3, 4, 5, 6]}},
        {path: 'edit-signal',  component: EditSignalComponent, data: {breadcrumb: 'Edit Signal', restrict:[3, 4, 5, 6]}},
        {path: 'whitelists',  component: WhitelistsComponent, data: {breadcrumb: 'Whitelisted Signals', restrict:[3, 4, 5, 6]}},

    ],
      component: WhitelistComponent, data:{breadcrumb:'Admin Settings: Whitelisted Signals', restrict:[3, 4, 5, 6]} },
  { path: 'admin/settings/system',          component: GlobalComponent, data:{breadcrumb:'Admin Settings: System Settings', restrict:[3, 4, 5, 6]} },
  { path: 'admin/settings/sensor',       children:

  [
        {path: '', redirectTo: 'sensors', pathMatch:'full'},
        {path: 'edit-sensor/:id',  component: SensorEditComponent, data:{breadcrumb:'Edit Sensor', restrict:[3, 4, 5, 6]}},
        {path:'add-sensor',  component: SensorAddComponent, data:{breadcrumb:'Add Sensor', restrict:[3, 4, 5, 6]}},
        {path:'sensors',  component: SensorsComponent, data:{ restrict:[3, 4, 5, 6]}}
  ],


      component: SensorComponent, data:{breadcrumb:'Admin Settings: Sensors', restrict:[3, 4, 5, 6]} },
  { path: 'admin/settings/signal',         component: LocationComponent, data:{breadcrumb:'Admin Settings: Signal Strength', restrict:[3, 4, 5, 6]} },
  { path: 'admin/settings/users',             component: UserComponent, children:
                    [
                        { path: '', redirectTo: 'users', pathMatch: 'full' },
                        {path:'add-user', component: AddComponent, data:{breadcrumb:'Add User', restrict:[4, 5, 6]} },
                        {path:'edit-user/:id', component: EditComponent, data:{breadcrumb:'Edit User', restrict:[4, 5, 6]} },
                        {path:'users', component: InfoComponent, data:{ restrict:[4, 5, 6]} }
                    ],
                data:{breadcrumb:'Admin Settings: Users', restrict:[4, 5, 6]} }


];

@NgModule({
  imports: [
    RouterModule.forChild(AdminRoutes),


  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule { }
