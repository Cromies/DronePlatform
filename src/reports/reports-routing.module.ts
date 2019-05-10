import { NgModule }                 from '@angular/core';
import { RouterModule, Routes }     from '@angular/router';

import { ReportsComponent }         from './components/reports.component';
import { StatsComponent }           from './components/stats.component';
import { SearchComponent }          from './search/components/search.component';
import { SummaryComponent }          from './search/components/summary.component';
import { ReplaysComponent }         from './search/components/replays.component';
import { IncidentComponent }         from './search/components/incident-details.component';

import { AuthGuard }                from '../assets/util/services/auth-gaurd.service';



const ReportsRoutes: Routes = [
  { path: 'reports',                 component: ReportsComponent, data:{breadcrumb: 'Reports', restrict: []} },
  { path: 'device-stats',            component: StatsComponent, data:{breadcrumb: 'Reports: Device Statistics', restrict: []} },
  { path: 'incident-search',        component: SearchComponent,  children:
                                            [
                                                {path:'', redirectTo: 'summary', pathMatch:'full'},
                                                {path: 'summary',  component: SummaryComponent, data:{breadcrumb: 'Summary', restrict: []} },
                                                {path:'details',  component: IncidentComponent, data:{breadcrumb: 'Details', restrict: []} },
                                                {path:'replays',  component: ReplaysComponent, data:{breadcrumb: 'Replays', restrict: []} },
                                            ],
                                            data:{breadcrumb: 'Reports: Incident Search', restrict: []} },

];

@NgModule({
  imports: [
    RouterModule.forChild(ReportsRoutes),


  ],
  exports: [
    RouterModule
  ]
})
export class ReportsRoutingModule { }
