// Modules imported here
import { NgModule }       from '@angular/core';
import { CommonModule, DatePipe }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { GoogleMapsAPIWrapper, MarkerManager } from '@agm/core';

import {DataTableModule}    from 'angular2-datatable';
import {SharedModule }    from '../shared/shared.module';
import { ReportsRoutingModule }   from './reports-routing.module';


// Components imported here
import { ReportsComponent }     from './components/reports.component';
import { StatsComponent }    from './components/stats.component';
import { SearchComponent }          from './search/components/search.component';
import { SummaryComponent }          from './search/components/summary.component';
import { ReplaysComponent }         from './search/components/replays.component';
import { IncidentComponent }         from './search/components/incident-details.component';

// services imported here
import { AuthGuard }      from '../assets/util/services/auth-gaurd.service';
import { ReportsService }   from './reports.service';


@NgModule({
  imports: [
    CommonModule,
    DataTableModule,
    FormsModule,
    ReportsRoutingModule,
    SharedModule

  ],
  declarations: [
      ReportsComponent,
      StatsComponent,
      SearchComponent,
      SummaryComponent,
      ReplaysComponent,
      IncidentComponent
      // HeaderComponent

    // no declarations yet
  ],
  providers: [DatePipe, AuthGuard, GoogleMapsAPIWrapper,MarkerManager, ReportsService]
})
export class ReportsModule {


}
