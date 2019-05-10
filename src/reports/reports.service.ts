import { Http, RequestOptions, Headers }        from '@angular/http';
import { Observable }                           from 'rxjs';
import { Injectable }                           from '@angular/core';
import { AuthService }          from '../assets/util/services/auth.service';

@Injectable()

export class ReportsService {
    constructor(private http: Http, private _auth: AuthService){

    }

    getPoints(){
        return this.http.get(this._auth.mode+'/points').map((res: any) => res.json())
    }

    getSections(){
        return this.http.get(this._auth.mode+'/section').map((res: any) => res.json())
    }
    getDrone() {
        return this.http.get(this._auth.mode+'/detect').map((res: any) => res.json())
    }
    getDeployment() {
        return this.http.get(this._auth.mode+'/deployment').map((res: any) => res.json())
    }
    getCenter(){
        return this.http.get(this._auth.mode+'/detection/center').map((res:any) => res.json())
    }


}
