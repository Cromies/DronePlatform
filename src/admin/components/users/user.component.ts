import { Component} from '@angular/core';
import {Http} from "@angular/http";



@Component({
  selector: 'User',
  templateUrl: '../../html/users/user.html',
  styleUrls: [ '../../../assets/css/bootstrap.min.css']
})
export class UserComponent{

    public data;
    public filterQuery = "";
    public rowsOnPage = 10;
    public sortBy = "email";
    public sortOrder = "asc";
    public added = false;

    constructor(private http: Http) {
    }


}
