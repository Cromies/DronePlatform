import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions, Headers }     from '@angular/http';
import { AuthService }          from '../../../assets/util/services/auth.service';
import { LogService }          from '../../../assets/util/services/logs.service';

import { Observable }           from 'rxjs';




@Component({
  selector: 'Sensors',
  templateUrl: '../../html/sensors.html',
  styleUrls: [ '../../../assets/css/bootstrap.min.css']
})
export class SensorsComponent implements OnInit {
    public p: number = 1;
    public data: any[];
    public status: string;
    public switch: boolean;
    public disabled: boolean = false;
    public timer: any;

    public totalNum: number;
    public level: number;

    public busy;


    constructor(private http: Http, private _auth: AuthService, private _logs: LogService) {
        this.level = this._auth.level;

    }

    ngOnInit(): void {
        // console.log(Config);
        this.getSensors();
    }
    getSensors() {
        return this.busy = this.http.get(this._auth.mode+'/sensor')
            .subscribe((data)=> {
                    console.log(data.json());
                    this.data = data.json();
                    for(let i of this.data){
                            switch(i.STATUS){
                                case 3:
                                    i.switch = true;
                                    i.disabled = true;
                                    i.loading = false;
                                    break;
                                case 1:
                                case 2:
                                    i.switch = false;
                                    i.disabled = false;
                                    i.loading = false;
                                    break;
                                default:
                                    i.switch = true;
                                    i.disabled = false;
                                    i.loading = false;
                                break;
                            }
                    }
                    this.totalNum = this.data.length;
            });
    }
    public setStatus(value: number){
        let status = '';
        switch(value){
            case 0:
                status = 'Offline';
                break;
            case 1:
                status = 'Online';
                break;
            case 2:
                status = 'Error';
                break;
            case 3:
                status = 'Offline: New';
        }
        return status;
    }
    setToggle(toggle: string, id: string): void{
        switch(toggle){
            case 'Start':
                this.start(id);
                break;
            case 'Stop':
                this.stop(id);
                break;
        }
    }

    public start(id: string) {
        var headers = new Headers();
        headers.append( 'Content-Type', 'application/json' );
        headers.append('Authorization', 'my-auth-token');

        let pack = {
            id: id
        }
        return this.http.post(this._auth.mode+'/sensor/start', pack, {
            headers: headers
        } )
        .subscribe(() => {
            let timer = Observable.timer(1500, 1000);
            this.data.forEach((item) => {
                 if(item.NODE_NAME == id){
                     item.loading = true;
                     item.idle_message = 'Starting sensor..';
                 }
             })

            this._logs.logSensorAction(id, 'Start');
            this.timer = timer.subscribe(() => {
            this.http.get(this._auth.mode+'/sensor/check/'+id).subscribe((data) => {
            console.log(data.json());
            let result = data.json();
                if(result[0].CONTROL == result[0].STATUS){
                  switch(result[0].STATUS){
                      case 3:
                          this.data.forEach((item) => {
                               if(item.NODE_NAME == id){
                                   item.loading = false;
                                   item.disabled = true;
                                   item.STATUS = result[0].STATUS;


                               }
                           })
                           this.getSensors();

                          break;
                      case 1:
                      case 2:
                          this.data.forEach((item) => {
                               if(item.NODE_NAME == id){
                                   item.loading = false;
                                   item.STATUS = result[0].STATUS;
                               }
                           })

                           this.getSensors();

                           break;
                      default:
                      break;
                  }
                  this.timer.unsubscribe();

                } else {
                  console.log(result[0]);
                }



            })
          })
        })

    }

    public stop(id: string){
        console.log(id);
        var headers = new Headers();
        headers.append( 'Content-Type', 'application/json' );
        headers.append('Authorization', 'my-auth-token');

        let pack = {
            id: id
        }
        return this.http.post(this._auth.mode+'/sensor/stop', pack, {
            headers: headers
        } )
        .subscribe(() => {
          let timer = Observable.timer(1500, 1000);
          this.data.forEach((item) => {
               if(item.NODE_NAME == id){
                   item.loading = true;
                   item.idle_message = 'Stopping sensor..';
               }
           })

            this._logs.logSensorAction(id, 'Stop');
            this.timer = timer.subscribe(() => {
            this.http.get(this._auth.mode+'/sensor/check/'+id).subscribe((data) => {
               console.log(data.json());
               let result = data.json();
                   if(result[0].CONTROL == result[0].STATUS){
                   switch(result[0].STATUS){
                       case 3:
                           this.data.forEach((item) => {
                                if(item.NODE_NAME == id){

                                    item.disabled = true;
                                    item.STATUS = result[0].STATUS;

                                }
                            })
                            this.getSensors();

                           break;
                       case 0:
                           this.data.forEach((item) => {
                                if(item.NODE_NAME == id){
                                    item.STATUS = result[0].STATUS;
                                }
                            })
                            this.getSensors();

                            break;
                       default:
                       break;
                   }
                   this.timer.unsubscribe();
                 } else {
                   console.log(result[0])
                 }

            })
          })
        })

    }

    public delete(id: string): void {
        var headers = new Headers();
        headers.append( 'Content-Type', 'application/json' );
        headers.append('Authorization', 'my-auth-token');

        let pack = {
            id: id
        }
        Observable.forkJoin(
            this.http.get(this._auth.mode+'/sensor/info/delete/'+id),
            this.http.post(this._auth.mode+'/sensor/delete', pack, {headers: headers} ),
            this.http.get(this._auth.mode+'/sensor/delete-node-time/'+id),
            this.http.get(this._auth.mode+'/sensor/delete-node-power/'+id),


        ).subscribe(() => {
            this._logs.logSensorAction(id, 'Delete');
            console.log('SUCCESS');
            this.getSensors();
        })

    }


}
