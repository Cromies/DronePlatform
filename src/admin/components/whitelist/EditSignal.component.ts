import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRouteSnapshot, ActivatedRoute,  ParamMap  }  from '@angular/router';
import { Http, RequestOptions, Headers }     from '@angular/http';
import {DatePipe } from '@angular/common';
import { AuthService }                      from '../../../assets/util/services/auth.service';
import { LogService }                      from '../../../assets/util/services/logs.service';


@Component({
    selector: 'edit-signal',
    templateUrl: '../../html/edit-signal.html',
    styleUrls: ['../../../assets/css/bootstrap.min.css']
})

export class EditSignalComponent implements OnInit{
    public Description: string;
    public expiration: string;
    public mac_id: string;
    public data: any;
    public busy;

    constructor(private http: Http, private _logs: LogService, private route: ActivatedRoute, private _auth: AuthService, private router: Router, private date: DatePipe){
    }
    ngOnInit(): void {
        this.getData();
    }

    getData(): void {
        this.route.params.subscribe((params) => {
            this.data = params;
            this.Description = params.NAME;
            this.mac_id = params.MAC;
            this.expiration = this.date.transform(params.EXPIRATION, 'yyyy-MM-ddTHH:mm:ss');
            console.log(this.expiration);
        })
    }

    onSubmit(value: any): void {
        value.expiration = this.date.transform(value.expiration, 'yyyy-MM-dd HH:mm:ss');
        value.mac_id = this.mac_id;
        var headers = new Headers();
        headers.append( 'Content-Type', 'application/json' );
        headers.append('Authorization', 'my-auth-token');
        this.http.post(this._auth.mode+'/whitelist/edit', value, {headers: headers})
        .subscribe(() => {
            this._logs.logWhitelistEdit(value);
            this.router.navigate(['/admin/settings/whitelist']);

        })

    }
}
