import { Component, OnInit }    from '@angular/core';
import {Http}                   from "@angular/http";
import { AuthService }          from '../../../assets/util/services/auth.service';




@Component({
  selector: 'Info',
  templateUrl: '../../html/users/user-info.html',
  styleUrls: [ '../../../assets/css/bootstrap.min.css']
})
export class InfoComponent implements OnInit {

    public data;
    public filterQuery = "";
    public rowsOnPage = 100;
    public sortBy = "email";
    public sortOrder = "asc";
    public added = false;
    public busy;
    public level: number;


    constructor(private http: Http, private _auth: AuthService) {
        this.level = this._auth.level;
    }

    ngOnInit(): void {
        // console.log(Config);
        this.busy = this.http.get(this._auth.mode+'/users')
        // this.http.get('https://localhost:3000/users')
            .subscribe((data)=> {
                    console.log(data.json());
                    this.data = data.json();
            });
    }

    public toInt(num: string) {
        return +num;
    }

    public getRole(level: number){
        return this.http.get(this._auth.mode+'/users/role/'+level)
        .map((data: any) => {
            console.log(data);
            let results =  data.json();
            return results[0].NAME;
        })
    }

    public sortByWordLength = (a: any) => {
        return a.city.length;
    }

}
