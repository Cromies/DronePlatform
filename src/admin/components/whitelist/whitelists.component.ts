import { Component, OnInit } from '@angular/core';
import { Http } from'@angular/http';
import { Observable }   from 'rxjs';
import { AuthService }                      from '../../../assets/util/services/auth.service';
import { LogService }                      from '../../../assets/util/services/logs.service';





@Component({
      selector: 'Whitelists',
      templateUrl: '../../html/whitelists.html',
      styleUrls: ['../../../assets/css/bootstrap.min.css']})

export class WhitelistsComponent implements OnInit{
    public data: any[];
    public p: number = 1;
    public busy;


    constructor( private http: Http, private _logs: LogService, private _auth: AuthService ) {

    }

    ngOnInit(): void {
        this.getData();
    }
    getData() {
        this.busy = this.http.get(this._auth.mode+'/whitelist').subscribe((data) => {

            console.log(data.json());
            this.data = data.json();
            this.data.map((mac) => {
                this.onCheck(mac.MAC).subscribe((data) => {
                    if(data.json().length > 0){
                        mac.status = true;
                    } else {
                        mac.status = false;
                    }
                })
            })
            console.log(this.data);

        })
    }
     off(mac){
       setTimeout(() => {
         this.http.get(this._auth.mode+'/whitelist/off/'+mac)
         .subscribe(() => {
             console.log('success');
             this._logs.logWhitelistDisable(mac);
             this.data.map((item) =>{
                 if(item.MAC == mac){
                     item.status = true;
                     // this.getData();
                 }
             })
         })

       }, 300)
    }

    on(mac){
      setTimeout(() => {
        this.http.get(this._auth.mode+'/whitelist/on/'+mac)
        .subscribe(() => {
            console.log('SUCCESS');
            this._logs.logWhitelistEnable(mac);
            this.data.map((item) => {
                if(item.MAC == mac) {
                    item.status = false;
                    // this.getData();
                }
            })
        })
      }, 300);

    }

    onCheck(mac: string){
        return this.http.get(this._auth.mode+'/whitelist/check/'+mac)

    }
    onDelete(mac: string){
        Observable.forkJoin(
            this.http.get(this._auth.mode+'/whitelist/delete/'+mac),
            this.http.get(this._auth.mode+'/blacklist/delete/'+mac)

        ).subscribe(() => {
            this._logs.logWhitelistDelete(mac);
            this.getData();
        })
    }
}
