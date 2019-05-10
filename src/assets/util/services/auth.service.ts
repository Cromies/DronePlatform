import { Http, RequestOptions, Headers }        from '@angular/http';
import { Observable }                           from 'rxjs';
import {Injectable }                            from '@angular/core';
import { Router }                               from '@angular/router';

@Injectable()

export class AuthService {
    public redirectUrl: string;
    public userInfo: any;
    public level: number;
    public ipAddress: any;
    // public mode: string = 'https://nms-adf-01.newmeadows.local:3000';
    // public mode: string = "https://cc2.dgh.pertino.net:3000";
    public mode: string = "https://167.99.233.46:3000";

    constructor(private router: Router, private http: Http){
        if(this.checkLogin()){
            let data = JSON.parse(sessionStorage.getItem('userInfo'));
            console.log(data);
            if(data.length > 0){
                this.userInfo = data;
                this.level = data[0]['LEVEL'];
                console.log(this.level);
            }
        }
    }

    public checkLogin(): boolean{

        let local = sessionStorage.getItem('userInfo');
         if(local){
            return true;
        } else return false
        // let length = userInfo.length;
        // if(userInfo){
        //     if(userInfo.loggedIn) return true;
        // }
        // return false;
    }

    public getUser(value: any) {
        console.log(value);
        var headers = new Headers();
        headers.append( 'Content-Type', 'application/json' );
        headers.append('Authorization', 'my-auth-token');

        return this.http.post(this.mode+'/login', value, {
            headers: headers
        }).map((res: any) => res.json())

    }

    public logout() {
        sessionStorage.removeItem('userInfo');
        return this.router.navigate(['/login']);
    }

}
