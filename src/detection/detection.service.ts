import { Http, RequestOptions, Headers }        from '@angular/http';

import { forkJoin }   from 'rxjs';
import { map, filter, scan } from 'rxjs/operators';
import {Injectable }    from '@angular/core';
import { AuthService }          from '../assets/util/services/auth.service';

@Injectable()

export class DetectionService {
    constructor(private http: Http, private _auth: AuthService){

    }

    getData() {
        return forkJoin(
            this.http.get(this._auth.mode+'/confirmed').map((res: any) => res.json()),
            this.http.get(this._auth.mode+'/potential').map((res:any) => res.json()),
            this.http.get(this._auth.mode+'/sensors').map((res:any) => res.json())
        );
    }
    getPoints(){
        return this.http.get(this._auth.mode+'/points').map((res: any) => res.json())
    }
    getTime(){
        return this.http.get(this._auth.mode+'/detection/time').map((res: any) => res.json())
    }

    getSections(){
        return this.http.get(this._auth.mode+'/section').map((res: any) => res.json())
    }
    getStartPoint(id){
      return this.http.get(this._auth.mode+'/initial/'+id).map((res: any) => res.json())
    }
    // setStartPoint(id, lon, lat){
    //   var headers = new Headers();
    //   headers.append( 'Content-Type', 'application/json' );
    //   headers.append('Authorization', 'my-auth-token');
    //
    //   let pack = {
    //     id: id,
    //     lon: lon,
    //     lat: lat
    //   }
    //   return this.http.post(this._auth.mode+'/start-point/add', pack, {
    //     headers: headers
    //   }).subscribe(() => {
    //     console.log('point set');
    //   });
    //
    // }
    // deleteStartPoint(id){
    //   return this.http.get(this._auth.mode+'/start-point/delete/'+id).subscribe(() => {/***/})
    // }

    getCenter(){
        return this.http.get(this._auth.mode+'/detection/center').map((res:any) => res.json())
    }
    getDrone() {
        return this.http.get(this._auth.mode+'/detect').map((res: any) => res.json())
    }
    getTrackPoints(id:string){
        return this.http.get(this._auth.mode+'/track/'+id).map((res: any) => res.json())
    }
    getReferences(){
        return this.http.get(this._auth.mode+'/reference').map((res: any) => res.json())
    }
}
