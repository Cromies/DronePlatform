// Modules imported here
import { NgModule }                 from '@angular/core';
import { FormsModule }              from '@angular/forms';
import { HttpModule }               from '@angular/http';
import { AgmCoreModule }            from '@agm/core';
import { CollapseModule }           from 'ngx-bootstrap';
import { RouterModule }             from '@angular/router';
import { DataTableModule }          from 'angular2-datatable';
import { DataFilterPipe}            from '../assets/util/data-filter-pipe';
import { SortByPipe}                from '../assets/util/sortBy.pipe';
import { userLevelPipe}                from '../assets/util/role.pipe';
// import { BootstrapSwitchModule } from 'angular2-bootstrap-switch';
import { CsvDownloader }            from '../assets/util/csv-downloader';
import {BrowserAnimationsModule}    from '@angular/platform-browser/animations';
import {NgBusyModule} from 'ng-busy';
import {NgxPaginationModule}        from 'ngx-pagination';
import { AuthService }              from '../assets/util/services/auth.service';
import { LogService }              from '../assets/util/services/logs.service';
import {BrowserModule} from "@angular/platform-browser";
// import {Ng5BreadcrumbModule} from 'ng5-brerumb';



import { FooterComponent } from './components/footer/footer.component';
import { SwitchComponent } from './components/switch/switch.component';

import { HeaderComponent } from './components/header/header.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { ValidationComponent } from './components/validation.component';



@NgModule({
  imports: [
    // Ng5BreadcrumbModule.forRoot(),
    CollapseModule.forRoot(),
    AgmCoreModule.forRoot({
        apiKey: 'AIzaSyC4eVm4uQ7DHEj9zuoHbLR3vzXhQDGGM6Y'
    }),
    NgBusyModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    FormsModule,
    HttpModule,
    RouterModule,
    DataTableModule



  ],
  declarations: [
    SwitchComponent,
    BreadcrumbComponent,
     HeaderComponent,
     FooterComponent,
     DataFilterPipe,
     SortByPipe,
     userLevelPipe,
     CsvDownloader,
     ValidationComponent,


    // no declarations yet
  ],
  exports:[
      SwitchComponent,
      BreadcrumbComponent,
      HeaderComponent,
      FooterComponent,
      ValidationComponent,
      DataFilterPipe,
      SortByPipe,
      userLevelPipe,
      CsvDownloader,
      CollapseModule,
      FormsModule,
      NgBusyModule,
      BrowserAnimationsModule,
      NgxPaginationModule,
      AgmCoreModule
      // Ng5BreadcrumbModule

  ],
  providers:[AuthService, LogService]

})
export class SharedModule {


}
