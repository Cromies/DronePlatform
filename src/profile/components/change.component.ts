import { Component, OnInit }                from '@angular/core';
import { Http, RequestOptions, Headers }    from '@angular/http';
import { AuthService }                      from '../../assets/util/services/auth.service';
import { LogService }                      from '../../assets/util/services/logs.service';
import * as CryptoJS                        from 'crypto-js';
import { Router,
     ActivatedRouteSnapshot,
      ActivatedRoute }                      from '@angular/router';
      import {
        trigger,
        state,
        style,
        animate,
        transition
      }                                     from '@angular/animations';




@Component({
      selector: 'Change',
      templateUrl: '../html/changepass.html',
      styleUrls: [
          '../../assets/css/bootstrap.min.css',
          '../../assets/css/font-awesome.min.css',
          '../../assets/css/fontawesome-free-5.0.13/web-fonts-with-css/css/fa-regular.css',
          '../../assets/css/fontawesome-free-5.0.13/web-fonts-with-css/css/fa-solid.css',
          '../../assets/css/fontawesome-free-5.0.13/web-fonts-with-css/css/fa-brands.css'
  ],

    animations: [
        // trigger('valid', [
        //     state('lift')
        // ])
    ]})

export class ChangeComponent implements OnInit{
    public old:         string;
    public pass:         string;
    public confirm:     string;
    public error_pass:  string;
    public lower_case:  boolean = false;
    public upper_case:  boolean = false;
    public numeric:     boolean = false;
    public special:     boolean = false;
    public minLength:   boolean = false;
    public matched:     boolean = false;
    public confirmed:   boolean = false;
    public all:         boolean = false;
    public special_characters: any = ['!','@','#','$','%','^','&','*','_','~'];

    constructor(private _auth: AuthService, private _logs: LogService, private http: Http, private route: Router){}

    ngOnInit(): void {
        console.log(this._auth.userInfo[0]['PASSWORD']);
        console.log(CryptoJS.SHA512('AirWarden 2.0').toString(CryptoJS.enc.Base64));
    }

    onSubmit(value: any) {
        var headers = new Headers();
        headers.append( 'Content-Type', 'application/json' );
        headers.append('Authorization', 'my-auth-token');
        console.log(value);
        let old = CryptoJS.SHA512(value.old).toString(CryptoJS.enc.Base64);
        let newPass = CryptoJS.SHA512(value.new).toString(CryptoJS.enc.Base64)
        console.log('old: '+old);
        console.log('new: '+newPass);
        console.log(this._auth.userInfo[0]['PASSWORD']);
        if(old === this._auth.userInfo[0]['PASSWORD']){
                let pack = {
                    password: CryptoJS.SHA512(value.pass).toString(CryptoJS.enc.Base64),
                    id: this._auth.userInfo[0]['USERID'],
                    date: new Date()
                }

                return this.http.post(this._auth.mode+'/user/password', pack, {
                    headers: headers
                }).subscribe((data) => {
                    // this.route.navigate(['admin/settings/users']);
                    this._logs.logPass(this._auth.userInfo[0].USERID);
                    this.all = true;
                })

        }

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
    }

}
