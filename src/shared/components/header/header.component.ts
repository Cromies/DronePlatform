import { Component }        from '@angular/core';
// import fontawesome          from '@fortawesome/fontawesome';
import { AuthService }      from '../../../assets/util/services/auth.service';
// import { faCrosshairs }     from '@fortawesome/fontawesome-free-solid/faCrosshairs';
//
// fontawesome.library.add(faCrosshairs);




@Component({
  selector: 'headerElement',
  templateUrl: '../html/header.html',
  styleUrls: [
      '../../../assets/css/main.css',
      '../../../assets/css/font-awesome.min.css',
      '../../../assets/css/fontawesome-free-5.0.13/web-fonts-with-css/css/fa-regular.css',
      '../../../assets/css/fontawesome-free-5.0.13/web-fonts-with-css/css/fa-solid.css',
      '../../../assets/css/fontawesome-free-5.0.13/web-fonts-with-css/css/fa-brands.css'
  ]
})
export class HeaderComponent {
    public isCollapsed: boolean = false;
    public navReports: boolean = false;
    public navSettings: boolean = false;
    public navDeploy: boolean = false;
    public userProfile: boolean = false;
    public level: number;
    public username: string;
    public hide: boolean = false;

    constructor(private auth: AuthService){
        this.level = 0;
        this.username = 'Username';  // this.auth.userInfo[0].FIRST_NAME + ' ' + this.auth.userInfo[0].LAST_NAME;
    }
    public logout() {
        return this.auth.logout();
    }

}
