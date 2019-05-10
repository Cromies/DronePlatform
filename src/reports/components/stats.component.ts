import { Component, OnInit } from '@angular/core';
import {Router, NavigationExtras } from '@angular/router';
import {Http} from "@angular/http";
import { ReportsService }             from '../reports.service';
import { AuthService }          from '../../assets/util/services/auth.service';




@Component({
  selector: 'Stats',
  templateUrl: '../html/stats.html',
  styleUrls: [ '../../assets/css/bootstrap.min.css']
})
export class StatsComponent implements OnInit {
    public data: any[];
    public p: number = 1;
    public totalNum: number;

    public fileName: string;
    public busy;

    constructor(private http: Http, private reports: ReportsService, private _auth: AuthService) {

    }

    ngOnInit(): void {
        // this.http.get('https://cc2.dgh.pertino.net:3000/users')
        this.busy = this.http.get(this._auth.mode+'/reports/update/deviceStats')
            .subscribe((data)=> {
                this.reports.getDeployment().subscribe((deploy) => {

                    console.log(data.json());
                    this.data = data.json();
                    let today = new Date();
                    this.totalNum = this.data.length;
                    this.fileName = 'AirWarden_'+deploy[0].DEPLOYMENT_CODE+'_DeviceStats_'+ today +'.csv';
            })

            });
    }

    public toInt(num: string) {
        return +num;
    }

    public sortByWordLength = (a: any) => {
        return a.city.length;
    }
}
