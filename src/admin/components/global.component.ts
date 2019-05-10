import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions, Headers }     from '@angular/http';
import { AuthService }                      from '../../assets/util/services/auth.service';



@Component({
      selector: 'Global',
      templateUrl: '../html/global.html',
      styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/forms.scss']})

export class GlobalComponent {
    public data: any[];
    public busy;
    public cleanConfirmed: number;
    public cleanThreat: number;
    public updateStatus: number;
    public cleanCurrent: number;
    public cleanNodes: number;
    public checkHB: number;
    public timeFH: number;
    public timeWF: number;
    public timeSleep: number;
    public lengthFliterFHSS: number;
    public lengthFilterVideo: number;
    public numberDetectFHSS: number;
    public numberDetectVideo: number;
    public tagAlert: number;
    public tagTrack: number;
    public timeAlert: number;
    public timeTrack: number;
    public updateDist: number;



    constructor( private http: Http, private _auth: AuthService ) {

    }

    ngOnInit(): void {
        this.setData();
    }
    setData(): void {
        this.busy = this.http.get(this._auth.mode+'/global').subscribe((data) => {

            console.log(data.json());
            this.data = data.json();
            this.cleanConfirmed = this.data[0]['CLEANCONFIRMED'];
            this.cleanThreat = this.data[0]['CLEANTHREAT'];
            this.updateStatus = this.data[0]['UPDATESTATUS'];
            this.cleanCurrent = this.data[0]['CLEANCURRENT'];
            this.cleanNodes = this.data[0]['CLEANNODES'];
            this.checkHB = this.data[0]['CHECKHB'];
            this.timeFH = this.data[0]['TIMEFH'];
            this.timeWF = this.data[0]['TIMEWF'];
            this.timeSleep = this.data[0]['TIMESLEEP'];
            this.lengthFliterFHSS = this.data[0]['LENGTHFILTERFHSS'];
            this.lengthFilterVideo = this.data[0]['LENGTHFILTERVIDEO'];
            this.numberDetectFHSS = this.data[0]['NUMBERDETECTFHSS'];
            this.numberDetectVideo = this.data[0]['NUMBERDETECTVIDEO'];
            this.tagAlert = this.data[0]['TAGALERT'];
            this.tagTrack = this.data[0]['TAGTRACK'];
            this.timeAlert = this.data[0]['TIMEALERT'];
            this.timeTrack = this.data[0]['TIMETRACK'];
            this.updateDist = this.data[0]['UPDATEDIST'];


        })

    }
    public onReset(){
        this.http.get(this._auth.mode+'/global/reset').subscribe(() => {
            this.setData();
        });
    }

    public onSubmit(value: any): void {
        console.log(value);
        var headers = new Headers();
        headers.append( 'Content-Type', 'application/json' );
        headers.append('Authorization', 'my-auth-token');

        this.http.post(this._auth.mode+'/global/set', value, {
            headers: headers
        }).subscribe(() => {
            this.setData();
        });
    }
}
