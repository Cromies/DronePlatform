// Modules imported here
import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
// Components imported here
import { LoginComponent }       from './login.component';
import { SharedModule } from '../shared/shared.module';

// services imported here
//import { LoginService } from './login.service';
import { LoginRoutingModule }   from './login-routing.module';

import { AuthService }      from '../assets/util/services/auth.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LoginRoutingModule,
    SharedModule
  ],
  declarations: [
      LoginComponent
    // no declarations yet
  ],
  providers: [  AuthService]
})
export class LoginModule {}
