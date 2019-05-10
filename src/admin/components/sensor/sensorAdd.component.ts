import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions, Headers }     from '@angular/http';
import { AuthService }          from '../../../assets/util/services/auth.service';
import { LogService }          from '../../../assets/util/services/logs.service';

import { Router, ActivatedRouteSnapshot, ActivatedRoute }                               from '@angular/router';
import { Observable }           from 'rxjs';




@Component({
  selector: 'Sensor',
  templateUrl: '../../html/add-sensor.html',
  styleUrls: [ '../../../assets/css/bootstrap.min.css']
})
export class SensorAddComponent implements OnInit {
    public p: number = 1;
    public data: any[];
    public status: string;

    public totalNum: number;
    public level: number;

    public busy;


    constructor(private http: Http, private _logs: LogService, private _auth: AuthService, private route: Router) {
        this.level = this._auth.level;
    }

    ngOnInit(): void {
        // console.log(Config);
        this.busy = this.http.get(this._auth.mode+'/sensor')
        // this.http.get('https://localhost:3000/users')
            .subscribe((data)=> {
                    console.log(data.json());
                    this.data = data.json();
                    this.totalNum = this.data.length;
            });
    }

    public setStatus(value: number){
        status = '';
        if(!value){
            status = 'Offline';
        } else if(value == 1) {
            status = 'Online';
        } else {
            status = 'Error';
        }
        return status;
    }

    onSubmit(value: any) {
        console.log(value);
        let info = {
            id: value.id,
            time: new Date()
        }
        var headers = new Headers();
        headers.append( 'Content-Type', 'application/json' );
        headers.append('Authorization', 'my-auth-token');
        Observable.forkJoin(
            this.http.post(this._auth.mode+'/sensor/add', value, {headers: headers}),
            this.http.post(this._auth.mode+'/sensor/update-info', info, {headers: headers}),
            this.http.get(this._auth.mode+'/sensor/update-node-power/'+value.id),
            this.http.get(this._auth.mode+'/sensor/update-node-time/'+value.id)
        ).subscribe((data) => {
            this._logs.logSensor(this._auth.userInfo[0].USERID, value.id, value.location, 'Add');
            this.route.navigate(['/admin/settings/sensor']);

        })

       // return this.http.post(' https://cc2.dgh.pertino.net:3000/sensor/add', value, {
       //     headers: headers
       // })
       // .subscribe((data) => {
       //
       // });

    }


}
