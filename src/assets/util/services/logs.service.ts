import { Http, RequestOptions, Headers }        from '@angular/http';
import { Observable }                           from 'rxjs';
import {Injectable }                            from '@angular/core';
import { Router }                               from '@angular/router';
import { AuthService }                          from './auth.service';

@Injectable()

export class LogService {

  constructor(private http: Http, private _auth: AuthService) {}

  public logAttempt(email, ip,  attempt){
    var headers = new Headers();
    headers.append( 'Content-Type', 'application/json' );
    headers.append('Authorization', 'my-auth-token');

    let pack = {
      email: email,
      ip: ip,
      status: attempt
    }
    return this.http.post(this._auth.mode+'/log/login-attempt', pack, {
      headers: headers
    }).subscribe(() => {
      console.log('attmpt logged');
    });
  }

  public logLogin(ip, id){
    var headers = new Headers();
    headers.append( 'Content-Type', 'application/json' );
    headers.append('Authorization', 'my-auth-token');

    let pack = {
      ip: ip,
      _id: id
    }
    return this.http.post(this._auth.mode+'/log/login', pack, {
      headers: headers
    }).subscribe(() => {
      console.log('attmpt logged');
    });
  }

  public logUserAdd(value: any){
    var headers = new Headers();
    headers.append( 'Content-Type', 'application/json' );
    headers.append('Authorization', 'my-auth-token');


    return this.http.post(this._auth.mode+'/log/user/add', value, {
      headers: headers
    }).subscribe(() => {
      console.log('USER logged');
    });
  }
  public logUserEdit(value: any){
    var headers = new Headers();
    headers.append( 'Content-Type', 'application/json' );
    headers.append('Authorization', 'my-auth-token');


    return this.http.post(this._auth.mode+'/log/user/edit', value, {
      headers: headers
    }).subscribe(() => {
      console.log('USER logged');
    });
  }

  public logUser(value: any){
    var headers = new Headers();
    headers.append( 'Content-Type', 'application/json' );
    headers.append('Authorization', 'my-auth-token');
    value.id = this._auth.userInfo[0].USERID;


    return this.http.post(this._auth.mode+'/log/user/user', value, {
      headers: headers
    }).subscribe(() => {
      console.log('USER logged');
    });
  }
  public logLastLogin(time, id){
    var headers = new Headers();
    headers.append( 'Content-Type', 'application/json' );
    headers.append('Authorization', 'my-auth-token');

    let pack = {
      time: time,
      _id: id
    }
    return this.http.post(this._auth.mode+'/log/last/login', pack, {
      headers: headers
    }).subscribe(() => {
      console.log('attmpt logged');
    });

  }

  public logPass(id){
    return this.http.get(this._auth.mode+'/log/password/'+id).subscribe(()=> {
      console.log('Password logged')
    })
  }
  public logDownload(name, _id){
    var headers = new Headers();
    headers.append( 'Content-Type', 'application/json' );
    headers.append('Authorization', 'my-auth-token');

    let pack = {
      name: name,
      _id: _id
    }
    return this.http.post(this._auth.mode+'/log/download', pack, {
      headers: headers
    }).subscribe(() => {
      console.log('attmpt logged');
    });

  }
  public logSensor(id, sensor, location, action){
    var headers = new Headers();
    headers.append( 'Content-Type', 'application/json' );
    headers.append('Authorization', 'my-auth-token');

    let pack = {
      _id: id,
      sensor_id: sensor,
      location: location,
      action: action
    }

    return this.http.post(this._auth.mode+'/log/sensor', pack, {
      headers: headers
    }).subscribe(() => {
      console.log('attmpt logged');
    });
  }

  public logSensorEdit(value){
    value._id = this._auth.userInfo[0].USERID;
    var headers = new Headers();
    headers.append( 'Content-Type', 'application/json' );
    headers.append('Authorization', 'my-auth-token');


    return this.http.post(this._auth.mode+'/log/sensor/edit', value, {
      headers: headers
    }).subscribe(() => {
      console.log('USER logged');
    });

  }


  public logSensorAction(sensor, action){
    let id = this._auth.userInfo[0].USERID;
    let value = {
      _id: id,
      sensor_id: sensor,
      action: action
    }
    var headers = new Headers();
    headers.append( 'Content-Type', 'application/json' );
    headers.append('Authorization', 'my-auth-token');


    return this.http.post(this._auth.mode+'/log/sensor/action', value, {
      headers: headers
    }).subscribe(() => {
      console.log('USER logged');
    });

  }

  public logWhitelistAdd(value){
    value._id = this._auth.userInfo[0].USERID;
    var headers = new Headers();
    headers.append( 'Content-Type', 'application/json' );
    headers.append('Authorization', 'my-auth-token');


    return this.http.post(this._auth.mode+'/log/whitelist/add', value, {
      headers: headers
    }).subscribe(() => {
      console.log('whitelist logged');
    });


  }
  public logWhitelistEdit(value){
    value._id = this._auth.userInfo[0].USERID;
    var headers = new Headers();
    headers.append( 'Content-Type', 'application/json' );
    headers.append('Authorization', 'my-auth-token');


    return this.http.post(this._auth.mode+'/log/whitelist/edit', value, {
      headers: headers
    }).subscribe(() => {
      console.log('whitelist logged');
    });


  }

  public logWhitelistDelete(mac){
    let id = this._auth.userInfo[0].USERID;
    let value = {
      _id: id,
      mac: mac
    }
    var headers = new Headers();
    headers.append( 'Content-Type', 'application/json' );
    headers.append('Authorization', 'my-auth-token');


    return this.http.post(this._auth.mode+'/log/whitelist/delete', value, {
      headers: headers
    }).subscribe(() => {
      console.log('whitelist logged');
    });


  }

  public logWhitelistEnable(mac){
    let id = this._auth.userInfo[0].USERID;
    let value = {
      _id: id,
      mac: mac
    }
    var headers = new Headers();
    headers.append( 'Content-Type', 'application/json' );
    headers.append('Authorization', 'my-auth-token');


    return this.http.post(this._auth.mode+'/log/whitelist/enable', value, {
      headers: headers
    }).subscribe(() => {
      console.log('whitelist logged');
    });


  }
  public logWhitelistDisable(mac){
    let id = this._auth.userInfo[0].USERID;
    let value = {
      _id: id,
      mac: mac
    }
    var headers = new Headers();
    headers.append( 'Content-Type', 'application/json' );
    headers.append('Authorization', 'my-auth-token');


    return this.http.post(this._auth.mode+'/log/whitelist/disable', value, {
      headers: headers
    }).subscribe(() => {
      console.log('whitelist logged');
    });


  }



}
