import { Component, OnInit }    from '@angular/core';
import { Http, RequestOptions, Headers }     from '@angular/http';
import { AuthService }  from '../../assets/util/services/auth.service';
import { LogService }  from '../../assets/util/services/logs.service';

import { Router,
     ActivatedRouteSnapshot,
      ActivatedRoute }                      from '@angular/router';


@Component({
      selector: 'Profile',
      templateUrl: '../html/profile.html',
      styleUrls: ['../../assets/css/bootstrap.min.css',
      '../../assets/css/font-awesome.min.css',
      '../../assets/css/fontawesome-free-5.0.13/web-fonts-with-css/css/fa-regular.css',
      '../../assets/css/fontawesome-free-5.0.13/web-fonts-with-css/css/fa-solid.css',
      '../../assets/css/fontawesome-free-5.0.13/web-fonts-with-css/css/fa-brands.css'

  ]})

export class ProfileComponent implements OnInit {
    public name: string;
    public phone: number;
    public email: string;
    public email_state: number;
    public phone_state: number;
    public location_state: number;
    public system_state: number;
    public data: any;
    public complete: boolean = false;

    constructor(private _auth: AuthService, private _logs: LogService, private http: Http, private router: Router, private route: ActivatedRoute){
    }

    ngOnInit(): void {
        console.log(this._auth.userInfo[0]);
        this.data = this._auth.userInfo[0];
        this.name = this._auth.userInfo[0]['FIRST_NAME'] + ' ' + this._auth.userInfo[0]['LAST_NAME'];
        this.email = this._auth.userInfo[0]['EMAIL'];
        this.phone = this._auth.userInfo[0]['PHONE'];
        this.email_state = this._auth.userInfo[0].EMAILSTATE;
        this.phone_state = this._auth.userInfo[0].PHONESTATE;
        this.location_state = this._auth.userInfo[0].LOCATIONSTATE;
        this.system_state = this._auth.userInfo[0].SYSTEMSTATE;

        console.log(this.name);

    }

    onSubmit() {
            this._auth.userInfo[0].EMAILSTATE = this.email_state ? 1 : 0;
            this._auth.userInfo[0].PHONESTATE = this.phone_state ? 1 : 0;
            this._auth.userInfo[0].LOCATIONSTATE = this.location_state ? 1 : 0;
            this._auth.userInfo[0].SYSTEMSTATE = this.system_state ? 1 : 0;

            let pack = {
                first: this.data.FIRST_NAME,
                last: this.data.LAST_NAME,
                email: this.data.EMAIL,
                phone: this.data.PHONE,
                e_alerts: this.email_state,
                t_alerts: this.phone_state,
                l_alerts: this.location_state,
                s_alerts: this.system_state,
                role: this.data.LEVEL,
                modified_by: this.data.USERID,
                modified_date: new Date()
            }
            console.log(pack);
            this._logs.logUser(pack);
            var headers = new Headers();
            headers.append( 'Content-Type', 'application/json' );
            headers.append('Authorization', 'my-auth-token');

           return this.http.post(this._auth.mode+'/user/edit/'+this.data.USERID, pack, {
               headers: headers
           })
           .subscribe((data) => {
               console.log(data);
               this.complete = true;
           });

    }
}
