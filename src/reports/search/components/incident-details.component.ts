import { Component } from '@angular/core';
import {ActivatedRoute } from '@angular/router';
import { Router, NavigationExtras } from '@angular/router';
import { AuthService }          from '../../../assets/util/services/auth.service';

import { Http } from '@angular/http';
import {DatePipe } from '@angular/common';
import { ReportsService }             from '../../reports.service';



@Component({
      selector: 'Incident',
      templateUrl: '../html/incident-details.html',
      styleUrls: ['../../../assets/css/bootstrap.min.css']})

export class IncidentComponent {
  public data;
  public p: number = 1;
  public totalNum: number;

  public first;
  public last;
  public results: any[];
  public fileName;
  public busy;
  public raw;
  public deployment: string;


  public filterQuery = "";
  public rowsOnPage = 25;
  public sortBy = "start";
  public sortOrder = "asc";

  constructor(private reports: ReportsService, private route: ActivatedRoute, private router: Router, private http: Http, private datePipe: DatePipe, private _auth: AuthService){

      this.route.queryParams.subscribe(params => {
          this.raw = params['data'];
          console.log(this.raw)
          this.data = JSON.parse(params['data']);
          console.log(this.data);
          this.first = this.datePipe.transform(this.data.FIRST_HEARD, 'yyyy-MM-dd HH:mm:ss');
          this.last = this.datePipe.transform(this.data.LAST_HEARD, 'yyyy-MM-dd HH:mm:ss');
          // pull the data
          this.busy = this.http.get(this._auth.mode+'/reports/log/'+this.data.DEVICE_ID+'/'+this.first+'/'+this.last)
          .subscribe((data) => {
              console.log(data.json());
              this.results = data.json();
              this.totalNum = this.results.length;
              let today = new Date();
              this.reports.getDeployment().subscribe((data) => {
                  if(this.data.INCIDENT_NUM < 10){
                      this.fileName = 'AirWarden_'+data[0].DEPLOYMENT_CODE+'_Incident_Details_0000'+this.data.INCIDENT_NUM +'_'+today+'.csv';
                  } else if(this.data.INCIDENT_NUM < 100) {
                      this.fileName = 'AirWarden_'+data[0].DEPLOYMENT_CODE+'_Incident_Details_000'+this.data.INCIDENT_NUM +'_'+today+'.csv';
                  } else if(this.data.INCIDENT_NUM < 1000){
                      this.fileName = 'AirWarden_'+data[0].DEPLOYMENT_CODE+'_Incident_Details_00'+this.data.INCIDENT_NUM +'_'+today+'.csv';
                  } else if(this.data.INCIDENT_NUM < 10000){
                      this.fileName = 'AirWarden_'+data[0].DEPLOYMENT_CODE+'_Incident_Details_0'+this.data.INCIDENT_NUM +'_'+today+'.csv';
                  } else this.fileName = 'AirWarden_'+data[0].DEPLOYMENT_CODE+'_Incident_Details_'+this.data.INCIDENT_NUM +'_'+today+'.csv';

              })
              // console.log(this.body);
          })
      })


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


}
