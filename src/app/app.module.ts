
// --- Import necessary modules

import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }         from '@angular/forms';
import { RouterModule }     from '@angular/router';
// --- Import all necessary components
import { AppComponent }         from './app.component';
import { LoginComponent }       from '../login/login.component';
import { dashboardComponent }   from '../dashboard/dashboard.component';


// -- including core routing module
import { AppRoutingModule }     from './app-route.module';

// include all other modules
import { AdminModule }          from '../admin/admin.module';
import { LoginModule }          from '../login/login.module';
import { dashboardModule }      from '../dashboard/dashboard.module';
import { DetectionModule }      from '../detection/detection.module';
import { ReportsModule }          from '../reports/reports.module';
import { ProfileModule }          from '../profile/profile.module';

import { CollapseModule }       from 'ngx-bootstrap';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { SharedModule } from '../shared/shared.module';





@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    LoginModule,
    dashboardModule,
    Angular2FontawesomeModule,
    DetectionModule,
    ReportsModule,
    ProfileModule,
    AdminModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
