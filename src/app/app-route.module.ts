import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

// add all major components here
import { AppComponent }     from './app.component'


const appRoutes: Routes = [

  { path: 'app',        component: AppComponent },
  { path: '',   redirectTo: 'detection', pathMatch: 'full' }

];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
