import { Component, OnInit } from '@angular/core';
import { Http }     from '@angular/http';
import { Observable }   from 'rxjs';

import { AuthService }                      from '../../assets/util/services/auth.service';




@Component({
      selector: 'Location',
      templateUrl: '../html/location.html',
      styleUrls: ['../../assets/css/bootstrap.min.css']})

export class LocationComponent implements OnInit {
    public data: any[];
    public headers: any[];
    public sensors: any[];
    public p: number = 1;
    public totalNum: number;
    public busy;
    public colsLength: number;

    constructor(private http: Http, private _auth: AuthService){

    }

    ngOnInit(): void {
        this.busy = this.getData().subscribe(data => {
            console.log(data);
            this.headers    = data[0];
            this.data       = data[1];
            this.sensors    = data[2];
            this.totalNum   = this.data.length;
        })
    }

    getData(){
        return Observable.forkJoin(
            this.http.get(this._auth.mode+'/location/headers').map((res: any) => res.json()),
            this.http.get(this._auth.mode+'/location/nodes').map((res: any) => res.json()),
            this.http.get(this._auth.mode+'/sensor').map((res: any) => res.json())

        );
    }
    getKeys(value: any){
        let keys = Object.keys(value);
        this.colsLength = keys.length;

        return keys;
    }
    getNodeName(value: string){
        // debugger;
        let id = value.split("_");

        let totalNum = this.sensors.length;

        for(let i = 0; i < totalNum; i++){


            if(this.sensors[i].NODE_NAME == id[0]){
                return this.sensors[i].NAME + ' ' + id[1];
            } else if( value == 'ID'){
                return 'Device ID';
            }
        }

    }

}
