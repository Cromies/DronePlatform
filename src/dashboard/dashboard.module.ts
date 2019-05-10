// Modules imported here
import { NgModule }       from '@angular/core';
import { SharedModule }   from '../shared/shared.module';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { AuthGuard }      from '../assets/util/services/auth-gaurd.service';


// Components imported here
import { dashboardComponent }       from './dashboard.component';
// import { HeaderComponent }          from '../assets/components/header/header.component'

// services imported here
//import { dashboardService } from './dashboard.service';
import { dashboardRoutingModule }   from './dashboard-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    dashboardRoutingModule,
    SharedModule

  ],
  declarations: [
      dashboardComponent


    // no declarations yet
  ],
  providers: [ AuthGuard]
})
export class dashboardModule {


}
