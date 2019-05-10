// Modules imported here
import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import {SharedModule }    from '../shared/shared.module';

import { DetectionService }     from './detection.service';
import { AuthGuard }      from '../assets/util/services/auth-gaurd.service';



// Components imported here
import { DetectionComponent }   from './detection.component';
// import { HeaderComponent }          from '../assets/components/header/header.component';


// services imported here
//import { DetectionService } from './Detection.service';
import { DetectionRoutingModule }   from './detection-routing.module';

@NgModule({
  imports: [

    CommonModule,
    FormsModule,
    DetectionRoutingModule,
    SharedModule

  ],
  declarations: [
      DetectionComponent
      // HeaderComponent

    // no declarations yet
  ],
  providers: [ DetectionService, AuthGuard]
})
export class DetectionModule {


}
