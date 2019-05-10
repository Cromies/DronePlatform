import { Component, OnInit }        from '@angular/core';
import { Http }                     from "@angular/http";
import { CsvDownloader }            from '../../../assets/util/csv-downloader';
import { AuthService }                      from '../../../assets/util/services/auth.service';
import { LogService }                      from '../../../assets/util/services/logs.service';

import { DatePipe }                 from '@angular/common';
import { Router, NavigationExtras } from '@angular/router';
import { ReportsService }             from '../../reports.service';

@Component({
  selector: 'Summary',
  templateUrl: '../html/summary.html',
  styleUrls: [ '../../../assets/css/bootstrap.min.css']
})
export class SummaryComponent implements OnInit {

    public data: any[];
    public p: number = 1;
    public firstNum: number = 25*this.p - 24;
    public lastNum: number = 25*this.p;
    public totalNum: number;
    public defaultStart: string = '2017-01-01T00:00';
    public defaultEnd: string = '2020-12-31T23:59';
    public start;
    public end;
    public statusMessage: string;
    public deployment: string;

    public fileName;
    public busy;



    constructor(private http: Http, private _auth: AuthService, private router: Router, private datePipe: DatePipe, private reports: ReportsService) {
        this.start = this.defaultStart
        this.end = this.defaultEnd
        this.reports.getDeployment().subscribe((data) => {
            console.log(data);
            this.deployment = data[0].DEPLOYMENT_CODE;
        })

    }

    ngOnInit(): void {
    //     this.http.get("https://cc2.dgh.pertino.net:3000/reports/update").subscribe((data)=> {
    // });
    this.onSearch(null);
}

    public onTap(value: any){
        let navigationExtras: NavigationExtras = {
            queryParams: {
                data: JSON.stringify(value)
            }
        };
        console.log(value);
        this.router.navigate(['incident-search/details'], navigationExtras);
    }

    public onReplay(value: any){
        let navigationExtras: NavigationExtras = {
            queryParams: {
                data: JSON.stringify(value)
            }
        };
        console.log(value);
        this.router.navigate(['incident-search/replays'], navigationExtras);
    }


    public onSearch(value: any){
        if(value){
            let start = this.datePipe.transform(value.startDate, 'yyyy-MM-dd HH:mm:ss');
            let end = this.datePipe.transform(value.endDate, 'yyyy-MM-dd HH:mm:ss');

            this.busy = this.http.get(this._auth.mode+'/reports/update/refresh/'+value.startDate+'/'+value.endDate).subscribe((data)=> {
                console.log(data.json());
                this.data = data.json();
                this.totalNum = this.data.length;
            })

        } else {
            this.busy = this.http.get(this._auth.mode+"/reports/update/summary").subscribe((data)=> {
                    console.log(data.json());

                    this.data = data.json();
                    this.totalNum = this.data.length;
                    let today = new Date();
                    console.log(today);
                    this.fileName = 'AirWarden_'+this.deployment+'_Incident_Summary_'+today+'.csv';
            });

        }

    }

    public showResults( value: any) {
        let message: string;
        if(this.totalNum == 0){
            message = 'No drone incidents found.';
        } else {
            message = 'Displaying records ' + ((25*this.p - 24) +' - ' + (25*this.p)) +' of ' + this.totalNum;
        }
        return message;
    }



}
