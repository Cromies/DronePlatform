import { Component, OnInit }                    from '@angular/core';
import { Router, ActivatedRouteSnapshot, ActivatedRoute }                               from '@angular/router';
import { Http, RequestOptions, Headers }        from '@angular/http';
import { AuthService }                          from '../../../assets/util/services/auth.service';
import { LogService }                          from '../../../assets/util/services/logs.service';





@Component({
  selector: 'Sensor',
  templateUrl: '../../html/edit-sensor.html',
  styleUrls: [ '../../../assets/css/bootstrap.min.css']
})

export class SensorEditComponent implements OnInit {
    private id: string;
    public sensor_id: any;
    public name: string;
    public gain: number;
    public time_fhss: number;
    public time_video: number;
    public track_thres_fhss: number;
    public noise_thres_fhss: number;
    public thres_fhss_900: number;
    public thres_fhss_400: number;
    public report_thres_24: number;
    public report_thres_58: number;
    public report_thres_900: number;
    public bw_thres_24: number;
    public bw_thres_58: number;
    public bw_thres_900: number;
    public sweep_start_24: number;
    public sweep_stop_24: number;
    public sweep_start_58: number;
    public sweep_stop_58: number;
    public sweep_stop_900: number;
    public sweep_start_900: number;
    public sweep_step: number;
    public location: string;
    public busy;

    constructor(private http: Http, private _logs: LogService, private _auth: AuthService, private router: ActivatedRoute, private route: Router){

    }

    ngOnInit(): void {
        this.router.params.subscribe(params => {
            this.id = params['id'];
            console.log(this.id);
        })

        this.getSensor();
    }



    getSensor() {
        return this.busy = this.http.get(this._auth.mode+'/sensor/' + this.id).subscribe((data) => {
            let sensor = data.json();
            this.sensor_id = sensor[0]['NODE_NAME'];
            this.name = sensor[0]['NAME'];
            this.gain = sensor[0]['GAIN'];
            this.time_fhss = sensor[0]['TIME_FHSS'];
            this.time_video = sensor[0]['TIME_VIDEO'];
            this.track_thres_fhss = sensor[0]['TRACK_THRES_FHSS'];
            this.noise_thres_fhss = sensor[0]['NOISE_THRES_FHSS'];
            this.thres_fhss_900 = sensor[0]['900_THRES_FHSS'];
            this.thres_fhss_400 = sensor[0]['400_THRES_FHSS'];
            this.report_thres_24 = sensor[0]['REPORT_THRES_24'];
            this.report_thres_58 = sensor[0]['REPORT_THRES_58'];
            this.report_thres_900 = sensor[0]['REPORT_THRES_900'];
            this.bw_thres_24 = sensor[0]['BW_THRES_24'];
            this.bw_thres_58 = sensor[0]['BW_THRES_58'];
            this.bw_thres_900 = sensor[0]['BW_THRES_900'];
            this.sweep_stop_24 = sensor[0]['SWEEP_STOP_24'];
            this.sweep_start_24 = sensor[0]['SWEEP_START_24'];
            this.sweep_stop_58 = sensor[0]['SWEEP_STOP_58'];
            this.sweep_start_58 = sensor[0]['SWEEP_START_58'];
            this.sweep_stop_900 = sensor[0]['SWEEP_STOP_900'];
            this.sweep_start_900= sensor[0]['SWEEP_START_900'];
            this.sweep_step = sensor[0]['SWEEP_STEP'];
            this.location = sensor[0]['LOCATION'];


            console.log(sensor[0]['GAIN']);
        })
    }

    onReset(){
        return this.http.get(this._auth.mode+'/sensor/reset/' + this.id).subscribe(() => {
            this._logs.logSensorAction(this.id, 'Reset');

            console.log('SUCCESS');
            this.route.navigate(['/admin/settings/sensor']);
        })
    }

    onSubmit(value: any) {
        console.log(value);
        value.id = this.id;
        var headers = new Headers();
        headers.append( 'Content-Type', 'application/json' );
        headers.append('Authorization', 'my-auth-token');

        return this.http.post(this._auth.mode+'/sensor/edit', value, {
            headers: headers
        })
        .subscribe(() => {
          this._logs.logSensorEdit(value);
            this.route.navigate(['/admin/settings/sensor']);
        })
    }


}
