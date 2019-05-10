import { Component, OnInit } from '@angular/core';
import { Http }              from '@angular/http';
import { AuthService }                      from '../../assets/util/services/auth.service';
import { Observable}           from 'rxjs';


@Component({
      selector: 'Control',
      templateUrl: '../html/control.html',
      styleUrls: [
        '../../assets/css/bootstrap.min.css',
       '../../assets/css/forms.scss',
       '../../assets/css/font-awesome.min.css',
       '../../assets/css/fontawesome-free-5.0.13/web-fonts-with-css/css/fa-regular.css',
       '../../assets/css/fontawesome-free-5.0.13/web-fonts-with-css/css/fa-solid.css',
       '../../assets/css/fontawesome-free-5.0.13/web-fonts-with-css/css/fa-brands.css'
]})

export class ControlComponent implements OnInit{
  public sensorToggle: boolean;
  public switch: boolean;
  public sensor_switch: boolean;
  public status: boolean;
  public timer: any;
  public idle_message: string;
  public loading: boolean = false;
  public color: string = "#E8E8E8";
  public status_message: string;

  constructor(private http: Http, private _auth: AuthService){

  }

  ngOnInit(){
    this.check();
  }

  public check(){

    this.http.get(this._auth.mode+'/control/check')
    .subscribe((data) => {
      let results = data.json();
      console.log(results[0])
      switch(results[0].STATUS){
        case 0:
          this.switch = true;
          this.status_message = 'Stopped';
          this.color = '#EE6D0B';
          break;
        case 1:
        this.switch = false;
        this.status_message = 'Running';
        this.color = '#45A567';
        break;
        case 2:
        this.switch = false;
        this.status_message = 'Error';
        this.color = '#D53B3C';
        break;
      }
      if(results[0].RULE_NUM){
        this.sensor_switch = true;
      } else {
        this.sensor_switch = false;
      }
    });

  }

  public start(){
    this.idle_message = 'Starting System';
    this.loading = true;
    return this.http.get(this._auth.mode+'/control/start')
    .subscribe((data) => {
      let time = Observable.timer(1500, 1000);
      this.timer = time.subscribe(() => {
        this.http.get(this._auth.mode+'/control/check')
        .subscribe((data) => {
          let results = data.json();
          if(results[0].STATUS == 1){
            this.idle_message = '';
            this.loading = false;
            this.switch = false;
            this.status_message = 'Running';
            this.color = '#45A567';
            this.timer.unsubscribe();
          } else {
            console.log(results[0].STATUS);
          }
        });

      })
    });

  }

  public stop(){

    this.idle_message = 'Stopping System';
    this.loading = true;
    return this.http.get(this._auth.mode+'/control/stop')
    .subscribe((data) => {
      let time = Observable.timer(1500, 1000);
      this.timer = time
      .subscribe(() => {
        this.http.get(this._auth.mode+'/control/check')
        .subscribe((data) => {
          let results = data.json();
          if(results[0].STATUS == 0){
            this.idle_message = '';
            this.loading = false;
            this.switch = true;
            this.status_message = 'Stopped';
            this.color = '#EE6D0B';
            this.timer.unsubscribe();
          } else {
            console.log(results[0].STATUS);

          }
        });

      })
    });

  }

  public single(){
    return this.http.get(this._auth.mode+'/control/single')
    .subscribe((data) => {
    });

  }

  public multiple(){
    return this.http.get(this._auth.mode+'/control/multiple')
    .subscribe((data) => {
      this.sensor_switch = false;
    });

  }
  public setStatus(stat){
    switch(stat){
      case 0:
        this.switch = false;
        this.idle_message = ''
      case 1:
      case 2:
    }
  }
}
