import { Component, OnInit, OnDestroy }     from '@angular/core';
import { Router,
     ActivatedRouteSnapshot,
      ActivatedRoute }                      from '@angular/router';
import { Http, RequestOptions, Headers }     from '@angular/http';
import { AuthService }                      from '../../../assets/util/services/auth.service';
import { LogService }                      from '../../../assets/util/services/logs.service';



@Component({
      selector: 'Edit',
      templateUrl: '../../html/users/edit.html',
      styleUrls: ['../../../assets/css/bootstrap.min.css']})

export class EditComponent implements OnInit, OnDestroy {
    public data: any = [];
    private id: string;
    private sub: any;
    public level: number;
    public first: string;
    public last: string;
    public email: string;
    public phone: number;
    public role: number;
    public email_state: number;
    public phone_state: number;
    public location_state: number;
    public system_state: number;
    public roles: any;


    constructor(private router: Router, private _logs: LogService, private route: ActivatedRoute,  private http: Http, private _auth: AuthService) {}

    ngOnInit(){
        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];

        });
        console.log(this.id);
        this.http.get(this._auth.mode+'/user/'+this.id)
        .subscribe((data) => {
                this.data = data.json();
                console.log(this.data);
                this.first = this.data[0].FIRST_NAME;
                this.last = this.data[0].LAST_NAME;
                this.email = this.data[0].EMAIL;
                this.phone = this.data[0].PHONE;
                this.role = this.data[0].LEVEL;
                this.email_state = this.data[0].EMAILSTATE;
                this.phone_state = this.data[0].PHONESTATE;
                this.location_state = this.data[0].LOCATIONSTATE;
                this.system_state = this.data[0].SYSTEMSTATE;
                this.level = this.data[0].LEVEL;
                this.getRoles().subscribe((data) =>{
                    console.log(data);
                     this.roles = data;
                });

        })

    }

    onSubmit(value: any){
        console.log(value);
        value.modified_by = this._auth.userInfo[0]['USERID'];
        value.modified_date = new Date();
         var headers = new Headers();
         headers.append( 'Content-Type', 'application/json' );
         headers.append('Authorization', 'my-auth-token');

        return this.http.post(this._auth.mode+'/user/edit/'+this.id, value, {
            headers: headers
        })
        .subscribe((data) => {
            console.log(data);
            value._id = this.id
            this._logs.logUserEdit(value);
            this.router.navigate(['admin/settings/users']);

        });
    }

    value(value: string){
        return this.data[value];
    }
    getRoles(){
        return this.http.get(this._auth.mode+'/roles/'+this._auth.level).map((res: any) => res.json());
    }

    ngOnDestroy(){
        this.sub.unsubscribe();
    }
}
