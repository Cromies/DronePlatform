import { Component, OnInit } from '@angular/core';
import { AuthService }                      from '../../../assets/util/services/auth.service';
import { LogService }                      from '../../../assets/util/services/logs.service';

import { Http, RequestOptions, Headers }     from '@angular/http';
import { Router, ActivatedRouteSnapshot, ActivatedRoute }  from '@angular/router';
import {DatePipe } from '@angular/common';


@Component({
      selector: 'AddSignal',
      templateUrl: '../../html/add-signal.html',
      styleUrls: ['../../../assets/css/bootstrap.min.css']})

export class AddSignalComponent implements OnInit{
    public expiration: string = '2020-12-31T23:59';
    public Description: string = '';
    public error: boolean = false;
    public err_message: string;
    public mac_id: any;

    constructor(private http: Http, private _logs: LogService,  private route: Router, private _auth: AuthService, private date: DatePipe){}
    ngOnInit(){}

    onSubmit(value: any){
        value.expiration = this.date.transform(value.expiration, 'yyyy-MM-dd HH:mm:ss');
        console.log(value.expiration);
            var headers = new Headers();
            headers.append( 'Content-Type', 'application/json' );
            headers.append('Authorization', 'my-auth-token');
            this.http.post(this._auth.mode+'/whitelist/add', value, {headers: headers})
            .subscribe((data) => {
                let response = data.json();
                if(response.code == 'ER_DUP_ENTRY'){
                    console.log(response);
                    this.error = true;
                    return this.err_message = 'Make sure you\'re using a unique MAC ID';

                }
                this._logs.logWhitelistAdd(value);
                console.log( 'SUCCESSSSSSSSSS');
                this.route.navigate(['/admin/settings/whitelist']);

            })


        console.log(value);
    }
}
