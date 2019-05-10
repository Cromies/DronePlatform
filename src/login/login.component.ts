import { Component, OnInit }                    from '@angular/core';
import { Http, RequestOptions, Headers }        from '@angular/http';
import { AuthService }                          from '../assets/util/services/auth.service';
import { LogService }                          from '../assets/util/services/logs.service';

import {ActivatedRoute, Router} from "@angular/router";
import * as CryptoJS from 'crypto-js';
import { DatePipe }                 from '@angular/common';



@Component({
  selector: 'LoginElement',
  templateUrl: './login.html',
  styleUrls: [
        // '../assets/css/normalize.css',
        // '../assets/css/font-awesome.min.css',
        '../assets/css/bootstrap.min.css',
        '../assets/css/forms.scss',
        // '../assets/css/style.css'

        ]
})
export class LoginComponent implements OnInit {

    public message: string;
    public ipAddress: any = null;

    constructor(private authService: AuthService, private _logs: LogService, private datePipe: DatePipe, private http: Http, private router: Router, private route: ActivatedRoute){

    }
    ngOnInit(): void {
        if(this.authService.checkLogin()){
            if(this.authService.userInfo.LEVEL < 6){
                    this.router.navigate(['/detection'], {relativeTo: this.route});
                } else {
                    this.router.navigate(['/incident-search/summary']);
                }
        }

    }
    public login(value: any) {
        let password = CryptoJS.SHA512(value.password).toString(CryptoJS.enc.Base64);
        console.log(password);
        return this.authService.getUser(value)
        .subscribe((data) => {
            console.log(data);
            if(data.data.length > 0){
              if(password !== data.data[0].PASSWORD){
                  this.message = 'Incorrect password for this user';
                  this._logs.logAttempt(value.email, this.ipAddress, 'Fail');

              } else {
                let packet = {
                    loggedIn: true,
                    user: data.data
                }
                let d = new Date();
                d.setTime(d.getTime() + (365*24*60*60*1000));
                let expireDate = "expires="+ d.toUTCString();
                let opts: object = {
                    expires: expireDate
                };
                let currentTime = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
                this.authService.userInfo = data.data;
                this.authService.level = data.data[0]['LEVEL'];
                sessionStorage.setItem('userInfo', JSON.stringify(data.data));
                this._logs.logAttempt(value.email, this.ipAddress, 'Success');
                this._logs.logLogin(this.ipAddress, data.data[0].USERID);
                this._logs.logLastLogin(currentTime, data.data[0].USERID);

                if(data.data[0]['LEVEL'] < 6){
                        this.router.navigate(['/detection']);
                } else {
                        this.router.navigate(['/incident-search/summary']);
                }

              }
            } else {
              this.message = 'Email address not found';
              this._logs.logAttempt(value.email, this.ipAddress, 'Fail');
              this._logs.logLogin(this.ipAddress, data.data[0].USERID);

            }
            // if(data.status == 200){
            // }
        },
      (error) => {
        console.log(error);
      })
    }
}
