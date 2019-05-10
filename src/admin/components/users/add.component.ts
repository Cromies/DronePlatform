import { Component, OnInit }                from '@angular/core';
import { Router,
     ActivatedRouteSnapshot,
      ActivatedRoute }                      from '@angular/router';
import { Http, RequestOptions, Headers }    from '@angular/http';

import { AuthService }                      from '../../../assets/util/services/auth.service';
import { LogService }                      from '../../../assets/util/services/logs.service';

import { UUID }                             from 'angular2-uuid';
import * as CryptoJS from 'crypto-js';

@Component({
      selector: 'Add',
      templateUrl: '../../html/users/add.html',
      styleUrls: [
          '../../../assets/css/bootstrap.min.css',
          '../../../assets/css/font-awesome.min.css',
          '../../../assets/css/fontawesome-free-5.0.13/web-fonts-with-css/css/fa-regular.css',
          '../../../assets/css/fontawesome-free-5.0.13/web-fonts-with-css/css/fa-solid.css',
          '../../../assets/css/fontawesome-free-5.0.13/web-fonts-with-css/css/fa-brands.css'

  ]})

 export class AddComponent implements OnInit {
     public data: any;
     public roles: any;
     public error_pass: string;
     public error_email: string;
     public lower_case:  boolean = false;
     public upper_case:  boolean = false;
     public numeric:     boolean = false;
     public special:     boolean = false;
     public minLength:   boolean = false;
     public matched:     boolean = false;
     public pass2: any;
     public pass: any;
     public phone_state: boolean = false;
     public email_state: boolean = false;
     public location_state: boolean = false;
     public system_state: boolean = false;
     public complete: any;


     constructor(private http: Http, private _logs: LogService, private _auth: AuthService, private route: Router) {
     }

     ngOnInit() {
         this.getRoles().subscribe((data) => {
             console.log(data);
             this.roles = data;
         })
     }
     onSubmit(valid: boolean, value: any){
         console.log('check');
         if(valid){
             console.log(value);
                     value.created_by = this._auth.userInfo[0]['USERID'];
                     value.created_date = new Date();
                     value._id = UUID.UUID();
                     value.pass = CryptoJS.SHA512(value.pass).toString(CryptoJS.enc.Base64);

                     console.log(value);
                      var headers = new Headers();
                      headers.append( 'Content-Type', 'application/json' );
                      headers.append('Authorization', 'my-auth-token');

                     return this.http.post(this._auth.mode+'/user/add', value, {
                         headers: headers
                     })
                     .subscribe((data) => {
                       this._logs.logUserAdd(value);
                         this.route.navigate(['admin/settings/users']);
                     });

         }
     }

     getRoles(){
         return this.http.get(this._auth.mode+'/roles/'+this._auth.level).map((res: any) => res.json());
     }

     matchPass(event: any) {
         let pass = event.target.value;
         if(this.pass == pass){
             this.matched = true;
         } else {
             this.matched = false;
         }
     }

     validatePass(event: any){
         let pass = event.target.value;
         console.log(this.pass2);
             if(pass.length >= 8){
                 this.minLength = true;
                 console.log('minimum length reached')
             } else {
                 this.minLength = false;
             }
             if(pass.search(/[A-Z]/g) >= 0){
                 this.upper_case = true;
                 console.log('at least one capital letter')
             } else {
                 this.upper_case = false;
             }
             if(pass.search(/[a-z]/g) >= 0){
                 this.lower_case = true;
                 console.log('at least one lower case letter')
             } else {
                 this.lower_case = false;
             }

             if(pass.search(/[0-9]/g) >= 0){
                 this.numeric = true;
                 console.log('at least one number')
             } else {
                 this.numeric = false;
             }


             if((pass.search(/[- \/ \\^$!@#%*+?.()|[ \] {}]/g) >= 0)){
                 this.special = true;
                 console.log('at least one special character')
             } else {
                 this.special = false;
             }

             if(pass == this.pass2){
                 this.matched = true;
             } else {
                 this.matched = false;
             }
     }
 }
